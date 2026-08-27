import { createHmac, timingSafeEqual } from "node:crypto";

import type { InviteUser } from "./invite-code";

const DEFAULT_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;

type SessionPayload = {
  v: 1;
  userId: string;
  expiresAt: number;
};

function requireStrongSecret(secret: string) {
  if (secret.length < 32) {
    throw new Error("INVITE_SESSION_SECRET must be at least 32 characters");
  }
}

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload, "utf8").digest("base64url");
}

export function createInviteSessionToken(
  userId: string,
  secret: string,
  options: { now?: number; ttlMs?: number } = {},
): string {
  requireStrongSecret(secret);
  if (!UUID_PATTERN.test(userId)) throw new Error("Invalid invite user id");
  const now = options.now ?? Date.now();
  const ttlMs = options.ttlMs ?? DEFAULT_TTL_MS;
  if (!Number.isFinite(now) || !Number.isFinite(ttlMs) || ttlMs <= 0) {
    throw new Error("Invalid invite session lifetime");
  }
  const body = Buffer.from(
    JSON.stringify({ v: 1, userId, expiresAt: now + ttlMs } satisfies SessionPayload),
    "utf8",
  ).toString("base64url");
  return `${body}.${sign(body, secret)}`;
}

export function verifyInviteSessionToken(
  token: unknown,
  secret: string,
  users: readonly InviteUser[],
  now = Date.now(),
): InviteUser | null {
  try {
    requireStrongSecret(secret);
    if (typeof token !== "string" || token.length > 4096) return null;
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [body, suppliedSignature] = parts;
    const expectedSignature = sign(body, secret);
    const supplied = Buffer.from(suppliedSignature, "base64url");
    const expected = Buffer.from(expectedSignature, "base64url");
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;

    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as Partial<SessionPayload>;
    if (
      payload.v !== 1 ||
      typeof payload.userId !== "string" ||
      !UUID_PATTERN.test(payload.userId) ||
      typeof payload.expiresAt !== "number" ||
      !Number.isFinite(payload.expiresAt) ||
      payload.expiresAt <= now
    ) {
      return null;
    }
    return users.find((user) => user.id === payload.userId && user.active) ?? null;
  } catch {
    return null;
  }
}
