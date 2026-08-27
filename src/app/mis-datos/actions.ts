"use server";

import { redirect } from "next/navigation";

import { getCurrentInviteUser } from "@/lib/auth/invite-session";
import { createAdminClient } from "@/lib/supabase/admin";
import { createCustomLearningRepository } from "@/lib/supabase/custom-learning-repository";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;

export async function deleteAllPracticeAttempts() {
  const user = await getCurrentInviteUser();
  if (!user) redirect("/login");
  const supabase = createAdminClient();
  if (!supabase) redirect("/mis-datos?error=storage");
  const deleted = await createCustomLearningRepository(supabase!).deleteAllAttempts(user!.id);
  redirect(deleted ? "/mis-datos?deleted=attempts" : "/mis-datos?error=delete");
}

export async function deleteCustomMaterial(formData: FormData) {
  const user = await getCurrentInviteUser();
  if (!user) redirect("/login");
  const materialId = formData.get("materialId");
  if (typeof materialId !== "string" || !UUID.test(materialId)) {
    redirect("/mis-datos?error=invalid");
  }
  const supabase = createAdminClient();
  if (!supabase) redirect("/mis-datos?error=storage");
  const deleted = await createCustomLearningRepository(supabase!).deleteMaterial(user!.id, materialId);
  redirect(deleted ? "/mis-datos?deleted=material" : "/mis-datos?error=delete");
}
