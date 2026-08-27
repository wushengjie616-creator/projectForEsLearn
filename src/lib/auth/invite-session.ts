import "server-only";

import { cookies } from "next/headers";

import type { InviteUser } from "./invite-code";
import { inviteUsers } from "./invite-registry";
import { createInviteSessionToken, verifyInviteSessionToken } from "./invite-session-token";

const COOKIE_NAME = "haiknow_invite_session";
const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

function getSessionSecret() {
  const secret = process.env.INVITE_SESSION_SECRET?.trim();
  return secret && secret.length >= 32 ? secret : null;
}

export function isInviteSessionConfigured() {
  return Boolean(getSessionSecret());
}

export async function getCurrentInviteUser(): Promise<InviteUser | null> {
  const secret = getSessionSecret();
  if (!secret) return null;
  const cookieStore = await cookies();
  return verifyInviteSessionToken(cookieStore.get(COOKIE_NAME)?.value, secret, inviteUsers);
}

export async function startInviteSession(user: InviteUser) {
  const secret = getSessionSecret();
  if (!secret) throw new Error("Invite sessions are not configured");
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, createInviteSessionToken(user.id, secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearInviteSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
