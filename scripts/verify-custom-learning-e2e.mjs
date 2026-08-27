import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const baseUrl = process.env.HAIKNOW_E2E_BASE_URL ?? "http://localhost:3000";

function readEnvFile(path) {
  const values = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/u)) {
    const match = line.match(/^\s*([^#][^=]*)=(.*)$/u);
    if (!match) continue;
    const value = match[2].trim();
    values[match[1].trim()] =
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
        ? value.slice(1, -1)
        : value;
  }
  return values;
}

function required(value, name) {
  if (!value?.trim()) throw new Error(`${name} is not configured`);
  return value.trim();
}

function sessionCookie(userId, secret) {
  const payload = Buffer.from(
    JSON.stringify({ v: 1, userId, expiresAt: Date.now() + 60 * 60 * 1000 }),
    "utf8",
  ).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload, "utf8").digest("base64url");
  return `haiknow_invite_session=${payload}.${signature}`;
}

function actionId(formHtml) {
  return formHtml.match(/name="(\$ACTION_ID_[^"]+)"/u)?.[1] ?? null;
}

async function postServerAction(path, formHtml, cookie, fields = {}) {
  const id = actionId(formHtml);
  if (!id) throw new Error(`server_action_not_found:${path}`);
  const body = new FormData();
  body.append(id, "");
  for (const [name, value] of Object.entries(fields)) body.append(name, value);
  return fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { cookie },
    body,
    redirect: "manual",
  });
}

const localEnv = { ...readEnvFile(resolve(root, ".env.local")), ...process.env };
const supabaseUrl = required(
  localEnv.SUPABASE_URL ?? localEnv.NEXT_PUBLIC_SUPABASE_URL,
  "SUPABASE_URL",
);
const supabaseKey = required(localEnv.SUPABASE_SECRET_KEY, "SUPABASE_SECRET_KEY");
const sessionSecret = required(localEnv.INVITE_SESSION_SECRET, "INVITE_SESSION_SECRET");
const registry = JSON.parse(readFileSync(resolve(root, "src/config/invite-users.json"), "utf8"));
const user = registry.users.find((candidate) => candidate.active);
if (!user) throw new Error("No active invite user is configured");
const cookie = sessionCookie(user.id, sessionSecret);
const restHeaders = {
  apikey: supabaseKey,
  authorization: `Bearer ${supabaseKey}`,
  "content-type": "application/json",
};
const restUrl = (table, query = "") =>
  `${supabaseUrl}/rest/v1/${table}${query ? `?${query}` : ""}`;

async function restJson(table, query) {
  const response = await fetch(restUrl(table, query), { headers: restHeaders });
  if (!response.ok) throw new Error(`supabase_read_${table}_${response.status}`);
  return response.json();
}

async function deleteProbeMaterial(materialId) {
  if (!materialId) return;
  const response = await fetch(
    restUrl(
      "custom_learning_materials",
      `id=eq.${encodeURIComponent(materialId)}&user_id=eq.${encodeURIComponent(user.id)}`,
    ),
    { method: "DELETE", headers: restHeaders },
  );
  if (!response.ok) throw new Error(`fallback_cleanup_${response.status}`);
}

let materialId;
try {
  console.log("NOTICE this check makes two real DeepSeek API calls and deletes only its own probe data");
  const existingAttempts = await restJson(
    "practice_attempts",
    `select=id&user_id=eq.${encodeURIComponent(user.id)}`,
  );
  if (existingAttempts.length !== 0) {
    throw new Error("Refusing to test clear-all because this user already has attempt records");
  }
  console.log("PRECHECK migration=true existing_attempts=0");

  const marker = `HAIKNOW-E2E-${Date.now()}`;
  const sourceText =
    `Ana vive en Madrid y estudia espanol cada tarde. Lee una pagina, apunta palabras nuevas y escribe un resumen breve. ${marker}. ` +
    "Los domingos revisa sus notas con su hermana y prepara la lectura de la semana siguiente.";
  const materialResponse = await fetch(`${baseUrl}/api/generate-material`, {
    method: "POST",
    headers: { cookie, "content-type": "application/json" },
    body: JSON.stringify({
      text: sourceText,
      targetLevel: "A1",
      focus: "balanced",
      acknowledgedExternalProcessing: true,
    }),
  });
  const materialPayload = await materialResponse.json();
  if (!materialResponse.ok || !materialPayload.materialId) {
    throw new Error(`material_generation_${materialResponse.status}`);
  }
  materialId = materialPayload.materialId;
  console.log("MATERIAL generate=200 persisted=true structured=true");

  const savedPage = await fetch(`${baseUrl}/mis-materiales/${materialId}`, {
    headers: { cookie },
    redirect: "manual",
  });
  if (savedPage.status !== 200) throw new Error(`material_reopen_${savedPage.status}`);
  console.log("MATERIAL reopen=200");

  const practiceResponse = await fetch(`${baseUrl}/api/materials/${materialId}/practice`, {
    method: "POST",
    headers: { cookie },
  });
  const practicePayload = await practiceResponse.json();
  if (!practiceResponse.ok || !practicePayload.practice?.id) {
    throw new Error(`practice_generation_${practiceResponse.status}`);
  }
  const practiceId = practicePayload.practice.id;
  const questions = practicePayload.practice.questions;
  const choiceCount = questions.filter((question) => question.type === "multiple_choice").length;
  const blankCount = questions.filter((question) => question.type === "fill_blank").length;
  if (questions.length !== 8 || choiceCount !== 4 || blankCount !== 4) {
    throw new Error("practice_shape_invalid");
  }
  console.log("PRACTICE generate=200 persisted=true choice=4 blank=4");

  const [storedSet] = await restJson(
    "practice_sets",
    `select=id,answer_key&user_id=eq.${encodeURIComponent(user.id)}&id=eq.${encodeURIComponent(practiceId)}`,
  );
  if (!storedSet?.answer_key) throw new Error("practice_answer_key_missing");
  const answers = Object.fromEntries(
    storedSet.answer_key.map((answer) => [
      answer.questionId,
      answer.type === "multiple_choice"
        ? String(answer.correctOptionId).toLowerCase()
        : String(answer.acceptedAnswers[0])
            .normalize("NFD")
            .replace(/\p{M}/gu, "")
            .toUpperCase(),
    ]),
  );
  const attemptResponse = await fetch(`${baseUrl}/api/practice/${practiceId}/attempts`, {
    method: "POST",
    headers: { cookie, "content-type": "application/json" },
    body: JSON.stringify({ answers }),
  });
  const attemptPayload = await attemptResponse.json();
  if (!attemptResponse.ok || attemptPayload.grade?.score !== 100) {
    throw new Error(`attempt_grade_${attemptResponse.status}_${attemptPayload.grade?.score ?? "none"}`);
  }
  console.log("ATTEMPT grade=200 score=100 accent_case_insensitive=true persisted=true");

  const dataPage = await fetch(`${baseUrl}/mis-datos`, { headers: { cookie } });
  if (!dataPage.ok) throw new Error(`storage_page_${dataPage.status}`);
  const html = await dataPage.text();
  const forms = html.match(/<form\b[\s\S]*?<\/form>/gu) ?? [];
  const clearForm = forms.find((form) => !form.includes('name="materialId"'));
  const materialForm = forms.find(
    (form) => form.includes('name="materialId"') && form.includes(`value="${materialId}"`),
  );
  if (!clearForm || !materialForm) throw new Error("storage_actions_missing");

  const clearResponse = await postServerAction("/mis-datos", clearForm, cookie);
  if (clearResponse.status !== 303) throw new Error(`clear_attempts_${clearResponse.status}`);
  const attemptsAfterClear = await restJson(
    "practice_attempts",
    `select=id&user_id=eq.${encodeURIComponent(user.id)}`,
  );
  const setsAfterClear = await restJson(
    "practice_sets",
    `select=id&user_id=eq.${encodeURIComponent(user.id)}&id=eq.${encodeURIComponent(practiceId)}`,
  );
  if (attemptsAfterClear.length !== 0 || setsAfterClear.length !== 1) {
    throw new Error("clear_attempts_scope_invalid");
  }
  console.log("CLEANUP attempts_action=303 attempts_deleted=true material_and_set_preserved=true");

  const secondAttemptResponse = await fetch(`${baseUrl}/api/practice/${practiceId}/attempts`, {
    method: "POST",
    headers: { cookie, "content-type": "application/json" },
    body: JSON.stringify({ answers }),
  });
  if (!secondAttemptResponse.ok) throw new Error(`attempt_recreate_${secondAttemptResponse.status}`);

  const deleteResponse = await postServerAction("/mis-datos", materialForm, cookie, {
    materialId,
  });
  if (deleteResponse.status !== 303) throw new Error(`delete_material_${deleteResponse.status}`);
  const [materialsAfterDelete, setsAfterDelete, attemptsAfterDelete] = await Promise.all([
    restJson(
      "custom_learning_materials",
      `select=id&user_id=eq.${encodeURIComponent(user.id)}&id=eq.${encodeURIComponent(materialId)}`,
    ),
    restJson(
      "practice_sets",
      `select=id&user_id=eq.${encodeURIComponent(user.id)}&material_id=eq.${encodeURIComponent(materialId)}`,
    ),
    restJson(
      "practice_attempts",
      `select=id&user_id=eq.${encodeURIComponent(user.id)}&practice_set_id=eq.${encodeURIComponent(practiceId)}`,
    ),
  ]);
  if (materialsAfterDelete.length || setsAfterDelete.length || attemptsAfterDelete.length) {
    throw new Error("material_cascade_delete_invalid");
  }
  materialId = undefined;
  console.log("CLEANUP material_action=303 cascade_deleted=true");
  console.log("RESULT custom_learning_e2e=passed probe_data_remaining=0");
} finally {
  if (materialId) {
    await deleteProbeMaterial(materialId);
    console.log("FALLBACK_CLEANUP probe_material_deleted=true");
  }
}
