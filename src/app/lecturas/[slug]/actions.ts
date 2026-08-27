"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { parseReadingProgress } from "@/domain/reading-progress";
import { persistReadingProgress } from "@/domain/save-reading-progress";
import { getCurrentInviteUser } from "@/lib/auth/invite-session";
import { createAdminClient } from "@/lib/supabase/admin";
import { createReadingProgressRepository } from "@/lib/supabase/reading-progress-repository";

export async function saveReadingProgress(formData: FormData) {
  const input = parseReadingProgress({
    readingSlug: formData.get("readingSlug"),
    draft: formData.get("draft"),
    intent: formData.get("intent"),
    expectedUpdatedAt: formData.get("expectedUpdatedAt"),
  });
  const user = await getCurrentInviteUser();
  if (!user) redirect("/login?error=请先使用邀请码登录");
  const supabase = createAdminClient();
  if (!supabase) redirect("/login?error=Supabase%20尚未配置");
  const result = await persistReadingProgress(
    input,
    user.id,
    createReadingProgressRepository(supabase),
  );
  if (result === "conflict") {
    redirect(`/lecturas/${input.readingSlug}?conflict=1`);
  }
  if (result === "unavailable") {
    redirect(`/lecturas/${input.readingSlug}?progressError=1`);
  }
  revalidatePath(`/lecturas/${input.readingSlug}`);
  redirect(`/lecturas/${input.readingSlug}?saved=1`);
}
