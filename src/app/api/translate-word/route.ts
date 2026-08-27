import { handleWordTranslationRequest } from "@/lib/deepseek/translate-word";
import { getCurrentInviteUser } from "@/lib/auth/invite-session";

type RateLimitBucket = { count: number; resetAt: number };
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;
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

  return handleWordTranslationRequest(request, {
    userId: user?.id ?? null,
    apiKey: process.env.DEEPSEEK_API_KEY,
    model: process.env.DEEPSEEK_MODEL,
    consumeRateLimit,
  });
}
