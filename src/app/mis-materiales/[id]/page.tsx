import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { GeneratedMaterialView } from "@/components/custom-material-workshop";
import { PracticeWorkshop } from "@/components/practice-workshop";
import { getCurrentInviteUser } from "@/lib/auth/invite-session";
import { createAdminClient } from "@/lib/supabase/admin";
import { createCustomLearningRepository } from "@/lib/supabase/custom-learning-repository";

export const metadata: Metadata = { title: "学习材料 | 西语拾页" };

export default async function SavedMaterialPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentInviteUser();
  if (!user) redirect("/login");
  const supabase = createAdminClient();
  if (!supabase) notFound();
  const repository = createCustomLearningRepository(supabase);
  const material = await repository.getMaterial(user.id, (await params).id);
  if (!material) notFound();
  const [practice, attempts] = await Promise.all([
    repository.getLatestPracticeSet(user.id, material.id),
    repository.listAttemptsForMaterial(user.id, material.id),
  ]);

  return (
    <main className="min-h-screen bg-[#f4f0e8] text-[#173b35]">
      <header className="border-b border-[#173b35]/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="font-[family-name:var(--font-serif)] text-xl font-semibold">西语拾页</Link>
          <div className="flex gap-4 text-sm font-medium text-[#58726b]">
            <Link href="/mis-materiales" className="hover:text-[#173b35]">← 我的学习材料</Link>
            <Link href="/mis-datos" className="hover:text-[#173b35]">数据与空间</Link>
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-5xl px-5 pb-16 sm:px-8">
        <GeneratedMaterialView sourceText={material.sourceText} material={material.material} materialId={material.id} />
        <PracticeWorkshop materialId={material.id} initialPractice={practice} initialAttempts={attempts ?? []} />
      </section>
    </main>
  );
}
