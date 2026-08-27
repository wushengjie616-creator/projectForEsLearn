import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentInviteUser } from "@/lib/auth/invite-session";
import { createAdminClient } from "@/lib/supabase/admin";
import { createCustomLearningRepository } from "@/lib/supabase/custom-learning-repository";

export const metadata: Metadata = {
  title: "我的学习材料 | 西语拾页",
  description: "查看受邀账号保存的个性化西班牙语学习材料。",
};

export default async function MyMaterialsPage() {
  const user = await getCurrentInviteUser();
  if (!user) redirect("/login");
  const supabase = createAdminClient();
  const materials = supabase
    ? await createCustomLearningRepository(supabase).listMaterials(user.id)
    : null;

  return (
    <main className="min-h-screen bg-[#f4f0e8] text-[#173b35]">
      <header className="border-b border-[#173b35]/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="font-[family-name:var(--font-serif)] text-xl font-semibold">西语拾页</Link>
          <div className="flex gap-4 text-sm font-medium text-[#58726b]">
            <Link href="/crear-material" className="hover:text-[#173b35]">生成新材料</Link>
            <Link href="/mis-datos" className="hover:text-[#173b35]">数据与空间</Link>
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        <p className="text-xs font-semibold tracking-[0.2em] text-[#b24c34] uppercase">Biblioteca personal</p>
        <h1 className="mt-3 font-[family-name:var(--font-serif)] text-4xl font-semibold">我的学习材料</h1>
        <p className="mt-4 text-sm leading-7 text-[#60776f]">这些材料只属于邀请码用户“{user.label}”，再次登录后仍可继续阅读和练习。</p>

        {materials === null ? (
          <p className="mt-8 rounded-2xl bg-[#f8e5de] p-5 text-sm text-[#923f2c]">材料暂时无法读取。若刚更新功能，请先执行新的 Supabase 数据库迁移。</p>
        ) : materials.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-[#173b35]/10 bg-white/70 p-7">
            <p className="text-[#60776f]">还没有保存的个性化学习材料。</p>
            <Link href="/crear-material" className="mt-5 inline-flex rounded-full bg-[#173b35] px-5 py-3 text-sm font-semibold text-white">生成第一份材料</Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {materials.map((item) => (
              <Link key={item.id} href={`/mis-materiales/${item.id}`} className="rounded-2xl border border-[#173b35]/10 bg-white/75 p-6 transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="flex items-center justify-between gap-4 text-xs font-semibold text-[#71867f]">
                  <span className="rounded-full bg-[#173b35] px-3 py-1 text-white">{item.material.detectedLevel}</span>
                  <time dateTime={item.createdAt}>{new Intl.DateTimeFormat("zh-CN").format(new Date(item.createdAt))}</time>
                </div>
                <h2 lang="es" className="mt-5 font-[family-name:var(--font-serif)] text-2xl font-semibold">{item.material.titleEs}</h2>
                <p className="mt-1 font-medium text-[#b24c34]">{item.material.titleZh}</p>
                <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#60776f]">{item.material.summaryZh}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
