import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { getCurrentInviteUser } from "@/lib/auth/invite-session";
import { createAdminClient } from "@/lib/supabase/admin";
import { createCustomLearningRepository } from "@/lib/supabase/custom-learning-repository";

import { deleteAllPracticeAttempts, deleteCustomMaterial } from "./actions";

export const metadata: Metadata = { title: "数据与空间 | 西语拾页" };

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KiB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MiB`;
}

export default async function MyDataPage({ searchParams }: {
  searchParams: Promise<{ deleted?: string; error?: string }>;
}) {
  const user = await getCurrentInviteUser();
  if (!user) redirect("/login");
  const supabase = createAdminClient();
  const repository = supabase ? createCustomLearningRepository(supabase) : null;
  const [summary, materials] = repository
    ? await Promise.all([repository.getStorageSummary(user.id), repository.listMaterials(user.id)])
    : [null, null];
  const params = await searchParams;
  const usedPercent = summary
    ? Math.min(100, Math.round((summary.usedBytes / summary.limitBytes) * 100))
    : 0;

  return (
    <main className="min-h-screen bg-[#f4f0e8] text-[#173b35]">
      <header className="border-b border-[#173b35]/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="font-[family-name:var(--font-serif)] text-xl font-semibold">西语拾页</Link>
          <Link href="/mis-materiales" className="text-sm font-medium text-[#58726b] hover:text-[#173b35]">← 我的学习材料</Link>
        </div>
      </header>
      <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        <p className="text-xs font-semibold tracking-[0.2em] text-[#b24c34] uppercase">Datos y almacenamiento</p>
        <h1 className="mt-3 font-[family-name:var(--font-serif)] text-4xl font-semibold">数据与空间</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[#60776f]">平台为每个邀请码用户设置独立软配额，提前避免 Supabase 项目被学习数据占满。删除操作不会影响其他用户。</p>

        {params.deleted && <p className="mt-6 rounded-xl bg-[#e2efe9] p-4 text-sm text-[#315f52]">清理完成，空间统计已更新。</p>}
        {params.error && <p className="mt-6 rounded-xl bg-[#f8e5de] p-4 text-sm text-[#923f2c]">清理未成功，请稍后重试；若 Supabase 已进入只读或暂停状态，请先到 Supabase 控制台处理容量。</p>}

        {summary ? (
          <section className="mt-8 rounded-2xl border border-[#173b35]/10 bg-white/75 p-6">
            <div className="flex items-end justify-between gap-5">
              <div>
                <h2 className="font-[family-name:var(--font-serif)] text-2xl font-semibold">个人空间占用</h2>
                <p className="mt-2 text-sm text-[#60776f]">约 {formatBytes(summary.usedBytes)} / {formatBytes(summary.limitBytes)}</p>
              </div>
              <strong className={usedPercent >= 90 ? "text-[#b24c34]" : "text-[#173b35]"}>{usedPercent}%</strong>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#e6dfd1]">
              <div className={`h-full ${usedPercent >= 90 ? "bg-[#b24c34]" : "bg-[#5d897c]"}`} style={{ width: `${usedPercent}%` }} />
            </div>
            {usedPercent >= 90 && <p className="mt-4 text-sm font-medium text-[#923f2c]">空间接近上限，请清理旧答题记录或不再需要的学习材料后再生成内容。</p>}
            <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
              <div className="rounded-xl bg-[#f4f0e8] p-4"><dt className="text-[#71867f]">学习材料</dt><dd className="mt-1 text-2xl font-semibold">{summary.materialCount}</dd></div>
              <div className="rounded-xl bg-[#f4f0e8] p-4"><dt className="text-[#71867f]">练习题集</dt><dd className="mt-1 text-2xl font-semibold">{summary.practiceSetCount}</dd></div>
              <div className="rounded-xl bg-[#f4f0e8] p-4"><dt className="text-[#71867f]">答题记录</dt><dd className="mt-1 text-2xl font-semibold">{summary.attemptCount}</dd></div>
            </dl>
          </section>
        ) : (
          <p className="mt-8 rounded-2xl bg-[#f8e5de] p-5 text-sm text-[#923f2c]">空间统计暂时无法读取。若刚更新功能，请先执行新的 Supabase 数据库迁移。</p>
        )}

        <section className="mt-8 rounded-2xl border border-[#173b35]/10 bg-white/70 p-6">
          <h2 className="font-[family-name:var(--font-serif)] text-2xl font-semibold">清理答题记录</h2>
          <p className="mt-2 text-sm leading-7 text-[#60776f]">删除全部历史作答、得分和批改结果，保留学习材料与练习题集。</p>
          <form action={deleteAllPracticeAttempts} className="mt-4">
            <ConfirmSubmitButton message="确定删除你的全部答题记录吗？此操作无法恢复。" className="rounded-full border border-[#b24c34]/40 px-5 py-2.5 text-sm font-semibold text-[#923f2c] hover:bg-[#f8e5de]">清空全部答题记录</ConfirmSubmitButton>
          </form>
        </section>

        <section className="mt-8">
          <h2 className="font-[family-name:var(--font-serif)] text-2xl font-semibold">删除个性化学习材料</h2>
          <p className="mt-2 text-sm leading-7 text-[#60776f]">删除一份材料会同时删除它的练习题集和全部答题记录，无法恢复。</p>
          <div className="mt-5 space-y-3">
            {(materials ?? []).map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#173b35]/10 bg-white/70 p-5">
                <div>
                  <p lang="es" className="font-semibold">{item.material.titleEs}</p>
                  <p className="mt-1 text-sm text-[#71867f]">{item.material.titleZh}</p>
                </div>
                <form action={deleteCustomMaterial}>
                  <input type="hidden" name="materialId" value={item.id} />
                  <ConfirmSubmitButton message={`确定删除“${item.material.titleZh}”及其全部练习记录吗？`} className="rounded-full border border-[#b24c34]/40 px-4 py-2 text-sm font-semibold text-[#923f2c] hover:bg-[#f8e5de]">删除</ConfirmSubmitButton>
                </form>
              </div>
            ))}
            {materials?.length === 0 && <p className="rounded-2xl bg-white/60 p-5 text-sm text-[#60776f]">当前没有可删除的个性化学习材料。</p>}
          </div>
        </section>
      </section>
    </main>
  );
}
