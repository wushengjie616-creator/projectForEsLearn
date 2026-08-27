import crypto from "node:crypto";
import fs from "node:fs";

import { createClient } from "@supabase/supabase-js";

function readEnvFile(path) {
  return Object.fromEntries(
    fs
      .readFileSync(path, "utf8")
      .split(/\r?\n/u)
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const separator = line.indexOf("=");
        return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
      }),
  );
}

function getActionName(html, beforeField) {
  const boundary = beforeField ? html.indexOf(`name="${beforeField}"`) : html.length;
  if (boundary < 0) return null;
  const matches = [...html.slice(0, boundary).matchAll(/name="([^"]*ACTION[^"]*)"/gu)];
  return matches.at(-1)?.[1] ?? null;
}

function getInputValue(html, name) {
  const input = html.match(new RegExp(`<input[^>]*name="${name}"[^>]*>`, "u"))?.[0];
  return input?.match(/value="([^"]*)"/u)?.[1] ?? null;
}

const env = readEnvFile(".env.local");
const registry = JSON.parse(fs.readFileSync("src/config/invite-users.json", "utf8"));
const privateRegistry = JSON.parse(fs.readFileSync(".local/invite-codes.json", "utf8"));
const userId = registry.users[0]?.id;
const inviteCode = privateRegistry.codes.find((entry) => entry.id === userId)?.code;
const origin = (process.env.VERIFY_ORIGIN ?? "http://localhost:3000").replace(/\/$/u, "");

if (!env.SUPABASE_URL || !env.SUPABASE_SECRET_KEY || !userId || !inviteCode) {
  throw new Error("Supabase configuration or the first local invite code is missing");
}

const db = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});

const probeSlug = `connection-probe-${crypto.randomUUID()}`;
let probeInserted = false;
try {
  let result = await db.from("reading_progress").insert({
    user_id: userId,
    reading_slug: probeSlug,
    draft: "supabase connection probe",
    completed: false,
  });
  if (result.error) throw new Error(`Database insert failed: ${result.error.code}`);
  probeInserted = true;

  result = await db
    .from("reading_progress")
    .select("draft,completed")
    .eq("user_id", userId)
    .eq("reading_slug", probeSlug)
    .single();
  if (result.error || result.data.draft !== "supabase connection probe") {
    throw new Error(`Database read failed: ${result.error?.code ?? "mismatch"}`);
  }

  result = await db
    .from("reading_progress")
    .update({ completed: true })
    .eq("user_id", userId)
    .eq("reading_slug", probeSlug);
  if (result.error) throw new Error(`Database update failed: ${result.error.code}`);
  console.log("database_crud=True");
} finally {
  if (probeInserted) {
    const cleanup = await db
      .from("reading_progress")
      .delete()
      .eq("user_id", userId)
      .eq("reading_slug", probeSlug);
    if (cleanup.error) throw new Error(`Database cleanup failed: ${cleanup.error.code}`);
    console.log("database_probe_cleanup=True");
  }
}

const readingSlug = "la-gallina-de-los-huevos-de-oro";
const marker = `e2e-probe-${crypto.randomUUID()}`;
const snapshotResult = await db
  .from("reading_progress")
  .select("draft,completed,updated_at")
  .eq("user_id", userId)
  .eq("reading_slug", readingSlug)
  .maybeSingle();
if (snapshotResult.error) throw new Error(`Progress snapshot failed: ${snapshotResult.error.code}`);
const snapshot = snapshotResult.data;
let progressMutationAttempted = false;

try {
  let response = await fetch(`${origin}/login`);
  let html = await response.text();
  let actionName = getActionName(html);
  if (!response.ok || !actionName) throw new Error("Login page action is missing");

  let form = new FormData();
  form.set(actionName, "");
  form.set("inviteCode", inviteCode);
  response = await fetch(`${origin}/login`, {
    method: "POST",
    body: form,
    headers: { origin },
    redirect: "manual",
  });
  const sessionCookie = response.headers
    .get("set-cookie")
    ?.split(/,(?=\s*[^;,]+=)/u)
    .find((value) => value.trimStart().startsWith("haiknow_invite_session="))
    ?.trim()
    .split(";", 1)[0];
  if (!sessionCookie || response.status < 300 || response.status >= 400) {
    throw new Error(`Invite login failed: ${response.status}`);
  }

  response = await fetch(`${origin}/lecturas/${readingSlug}`, {
    headers: { cookie: sessionCookie },
  });
  html = await response.text();
  actionName = getActionName(html, "readingSlug");
  if (!response.ok || !actionName) throw new Error("Reading progress action is missing");
  const expectedUpdatedAt = getInputValue(html, "expectedUpdatedAt");
  if (expectedUpdatedAt === null || expectedUpdatedAt !== (snapshot?.updated_at ?? "")) {
    throw new Error("Reading progress version is missing or stale");
  }

  form = new FormData();
  form.set(actionName, "");
  form.set("readingSlug", readingSlug);
  form.set("draft", marker);
  form.set("intent", "save");
  form.set("expectedUpdatedAt", expectedUpdatedAt);
  progressMutationAttempted = true;
  response = await fetch(`${origin}/lecturas/${readingSlug}`, {
    method: "POST",
    body: form,
    headers: { cookie: sessionCookie, origin },
    redirect: "manual",
  });
  if (response.status < 300 || response.status >= 400) {
    throw new Error(`Progress Server Action failed: ${response.status}`);
  }

  const saved = await db
    .from("reading_progress")
    .select("draft,completed,updated_at")
    .eq("user_id", userId)
    .eq("reading_slug", readingSlug)
    .single();
  if (
    saved.error ||
    saved.data.draft !== marker ||
    saved.data.completed !== (snapshot?.completed ?? false)
  ) {
    throw new Error(`Progress readback failed: ${saved.error?.code ?? "mismatch"}`);
  }

  const staleForm = new FormData();
  staleForm.set(actionName, "");
  staleForm.set("readingSlug", readingSlug);
  staleForm.set("draft", `${marker}-stale`);
  staleForm.set("intent", "save");
  staleForm.set("expectedUpdatedAt", expectedUpdatedAt);
  response = await fetch(`${origin}/lecturas/${readingSlug}`, {
    method: "POST",
    body: staleForm,
    headers: { cookie: sessionCookie, origin },
    redirect: "manual",
  });
  if (
    response.status < 300 ||
    response.status >= 400 ||
    !response.headers.get("location")?.includes("conflict=1")
  ) {
    throw new Error(`Stale progress write was not rejected: ${response.status}`);
  }
  const afterConflict = await db
    .from("reading_progress")
    .select("draft,updated_at")
    .eq("user_id", userId)
    .eq("reading_slug", readingSlug)
    .single();
  if (
    afterConflict.error ||
    afterConflict.data.draft !== marker ||
    afterConflict.data.updated_at !== saved.data.updated_at
  ) {
    throw new Error(`Stale progress write changed stored data: ${afterConflict.error?.code ?? "mismatch"}`);
  }
  console.log("invite_login_e2e=True");
  console.log("progress_server_action_e2e=True");
  console.log("progress_readback_e2e=True");
  console.log("progress_conflict_e2e=True");
} finally {
  if (progressMutationAttempted) {
    const restore = snapshot
      ? await db.from("reading_progress").upsert(
          {
            user_id: userId,
            reading_slug: readingSlug,
            draft: snapshot.draft,
            completed: snapshot.completed,
            updated_at: snapshot.updated_at,
          },
          { onConflict: "user_id,reading_slug" },
        )
      : await db
          .from("reading_progress")
          .delete()
          .eq("user_id", userId)
          .eq("reading_slug", readingSlug);
    if (restore.error) throw new Error(`Progress restore failed: ${restore.error.code}`);
    console.log("original_progress_restored=True");
  }
}
