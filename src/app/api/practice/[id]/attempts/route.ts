import { gradePractice } from "@/domain/practice";
import { getCurrentInviteUser } from "@/lib/auth/invite-session";
import { createAdminClient } from "@/lib/supabase/admin";
import { createCustomLearningRepository } from "@/lib/supabase/custom-learning-repository";

const json = (body: unknown, status: number) =>
  Response.json(body, { status, headers: { "cache-control": "no-store" } });

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentInviteUser();
  if (!user) return json({ error: "请先登录受邀账号。" }, 401);
  const supabase = createAdminClient();
  if (!supabase) return json({ error: "答题记录存储尚未配置。" }, 503);
  const repository = createCustomLearningRepository(supabase);
  const practice = await repository.getPracticeSetForGrading(user.id, (await context.params).id);
  if (!practice) return json({ error: "找不到这套练习。" }, 404);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "请求格式不正确。" }, 400);
  }
  if (!body || typeof body !== "object" || !((body as Record<string, unknown>).answers)) {
    return json({ error: "请完成全部题目后再提交。" }, 400);
  }
  const candidate = (body as { answers: unknown }).answers;
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    return json({ error: "答案格式不正确。" }, 400);
  }
  const rawAnswers = candidate as Record<string, unknown>;
  const answers: Record<string, string> = {};
  for (const key of practice.answerKey) {
    const answer = rawAnswers[key.questionId];
    if (typeof answer !== "string" || answer.trim() === "" || answer.length > 160) {
      return json({ error: "请完成全部题目，每个答案不超过 160 个字符。" }, 400);
    }
    answers[key.questionId] = answer;
  }

  const grade = gradePractice(practice.answerKey, answers);
  const saved = await repository.saveAttempt(user.id, practice.id, answers, grade);
  if (saved.status === "storage_full") {
    return json({
      error: "个人存储空间不足，请先清理旧答题记录。",
      code: "storage_full",
      manageStorageHref: "/mis-datos",
    }, 507);
  }
  if (saved.status === "error") return json({ error: "答题记录未能保存，请稍后重试。" }, 503);
  return json({ attemptId: saved.id, grade }, 200);
}
