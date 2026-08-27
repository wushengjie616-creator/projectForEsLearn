import { handleCustomMaterialRequest } from "@/lib/deepseek/generate-material";
import { getCurrentInviteUser } from "@/lib/auth/invite-session";
import { createAdminClient } from "@/lib/supabase/admin";
import { createCustomLearningRepository } from "@/lib/supabase/custom-learning-repository";

type RateLimitBucket = { count: number; resetAt: number };
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60_000;
const buckets = new Map<string, RateLimitBucket>();

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

export async function POST(request: Request) {
  const user = await getCurrentInviteUser();
  const supabase = user ? createAdminClient() : null;
  if (user && !supabase) {
    return Response.json({ error: "学习材料存储尚未配置，请联系管理员。" }, { status: 503 });
  }
  const repository = supabase ? createCustomLearningRepository(supabase) : null;
  if (user && repository && !(await repository.getStorageSummary(user.id))) {
    return Response.json(
      { error: "学习材料数据表尚未就绪，请先执行最新 Supabase 迁移。" },
      { status: 503 },
    );
  }

  return handleCustomMaterialRequest(request, {
    userId: user?.id ?? null,
    apiKey: process.env.DEEPSEEK_API_KEY,
    model: process.env.DEEPSEEK_MODEL,
    consumeRateLimit,
    saveMaterial: repository?.saveMaterial,
  });
}
