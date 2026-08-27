"use server";

import { redirect } from "next/navigation";

import { findInviteUser } from "@/lib/auth/invite-code";
import { inviteUsers } from "@/lib/auth/invite-registry";
import { clearInviteSession, startInviteSession } from "@/lib/auth/invite-session";

function errorRedirect(message: string): never {
  redirect(`/login?error=${encodeURIComponent(message)}`);
}

export async function login(formData: FormData) {
  const user = findInviteUser(formData.get("inviteCode"), inviteUsers);
  if (!user) errorRedirect("邀请码无效或已停用");
  try {
    await startInviteSession(user!);
  } catch {
    errorRedirect("邀请码登录尚未配置，请联系管理员");
  }
  redirect("/lecturas");
}

export async function logout() {
  await clearInviteSession();
  redirect("/");
}
