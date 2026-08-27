import { getCurrentInviteUser } from "@/lib/auth/invite-session";
import { generatePracticeWithDeepSeek } from "@/lib/deepseek/generate-practice";
import { deepSeekFailureResponse } from "@/lib/deepseek/provider-error";
import { createAdminClient } from "@/lib/supabase/admin";
import { createCustomLearningRepository } from "@/lib/supabase/custom-learning-repository";

type RateLimitBucket = { count: number; resetAt: number };
const buckets = new Map<string, RateLimitBucket>();
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 10 * 60_000;

function consumeRateLimit(userId: string) {
  const now = Date.now();
  const bucket = buckets.get(userId);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(userId, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (bucket.count >= RATE_LIMIT) return false;
  bucket.count += 1;
  return true;
}

const json = (body: unknown, status: number) =>
  Response.json(body, { status, headers: { "cache-control": "no-store" } });

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentInviteUser();
  if (!user) return json({ error: "请先登录受邀账号。" }, 401);
  if (!process.env.DEEPSEEK_API_KEY) return json({ error: "AI 练习生成尚未配置。" }, 503);
  const supabase = createAdminClient();
  if (!supabase) return json({ error: "学习材料存储尚未配置。" }, 503);
  const repository = createCustomLearningRepository(supabase);
  const material = await repository.getMaterial(user.id, (await context.params).id);
  if (!material) return json({ error: "找不到这份学习材料。" }, 404);
  if (!consumeRateLimit(user.id)) return json({ error: "练习生成较频繁，请稍后再试。" }, 429);

  try {
    const generated = await generatePracticeWithDeepSeek(material, {
      apiKey: process.env.DEEPSEEK_API_KEY,
      model: process.env.DEEPSEEK_MODEL,
      userId: user.id,
    });
    const saved = await repository.savePracticeSet(
      user.id,
      material.id,
      generated.questions,
      generated.answerKey,
    );
    if (saved.status === "storage_full") {
      return json({
        error: "个人存储空间不足，请先清理答题记录或旧学习材料。",
        code: "storage_full",
        manageStorageHref: "/mis-datos",
      }, 507);
    }
    if (saved.status === "error") return json({ error: "练习未能保存，请稍后重试。" }, 503);
    const practice = await repository.getLatestPracticeSet(user.id, material.id);
    if (!practice) return json({ error: "练习保存后暂时无法读取。" }, 503);
    return json({ practice }, 200);
  } catch (error) {
    return deepSeekFailureResponse(error, {
      timeout: "AI 练习生成超时，请重试。",
      fallback: "AI 练习暂时无法生成，请稍后重试。",
    });
  }
}
