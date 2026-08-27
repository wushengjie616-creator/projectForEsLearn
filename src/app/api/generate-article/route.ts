import { getCurrentInviteUser } from "@/lib/auth/invite-session";
import { handleArticleGenerationRequest } from "@/lib/deepseek/generate-article";

type RateLimitBucket = { count: number; resetAt: number };
const buckets = new Map<string, RateLimitBucket>();
const RATE_LIMIT = 5;
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

export async function POST(request: Request) {
  const user = await getCurrentInviteUser();
  return handleArticleGenerationRequest(request, {
    userId: user?.id ?? null,
    apiKey: process.env.DEEPSEEK_API_KEY,
    model: process.env.DEEPSEEK_MODEL,
    consumeRateLimit,
  });
}
