import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { InteractiveSpanishText } from "@/components/interactive-spanish-text";
import { getDifficultyRationale, getReadingBySlug, readingMaterials } from "@/content/readings";
import { logout } from "@/app/login/actions";
import { getCurrentInviteUser } from "@/lib/auth/invite-session";
import { createAdminClient } from "@/lib/supabase/admin";

import { saveReadingProgress } from "./actions";

type ReadingPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ saved?: string; conflict?: string; progressError?: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return readingMaterials.map((material) => ({ slug: material.slug }));
}

export async function generateMetadata({ params }: ReadingPageProps): Promise<Metadata> {
  const material = getReadingBySlug((await params).slug);
  return material
    ? { title: `${material.title} | 西语拾页`, description: material.summary }
    : {};
}

export default async function ReadingPage({ params, searchParams }: ReadingPageProps) {
  const material = getReadingBySlug((await params).slug);
  if (!material) notFound();
  const user = await getCurrentInviteUser();
  const supabase = createAdminClient();
  const progressResult = user && supabase
    ? await supabase.from("reading_progress").select("draft, completed, updated_at").eq("user_id", user.id).eq("reading_slug", material.slug).maybeSingle()
    : null;
  const progress = progressResult?.data ?? null;
  const progressReadFailed = Boolean(user && (!supabase || progressResult?.error));
  const pageStatus = await searchParams;
  const saved = pageStatus?.saved === "1";
  const conflict = pageStatus?.conflict === "1";
  const progressError = pageStatus?.progressError === "1";

  return (
    <main className="min-h-screen bg-[#f4f0e8] text-[#173b35]">
      <header className="border-b border-[#173b35]/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="font-[family-name:var(--font-serif)] text-xl font-semibold">西语拾页</Link>
          <div className="flex items-center gap-4">
            <Link href="/lecturas" className="text-sm font-medium text-[#58726b] hover:text-[#173b35]">← 阅读材料库</Link>
            {user && <form action={logout}><button className="rounded-full border border-[#173b35]/20 px-3 py-1.5 text-xs font-medium hover:bg-white/60">退出</button></form>}
          </div>
        </div>
      </header>

      <article className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
              <span className="rounded-full bg-[#173b35] px-3 py-1 text-white">{material.level}</span>
              <span className="text-[#71867f]">约 {material.minutes} 分钟</span>
              <span className="text-[#71867f]">{material.author}</span>
              {material.translator && <span className="text-[#71867f]">西译：{material.translator}</span>}
            </div>
            <h1 className="mt-6 font-[family-name:var(--font-serif)] text-4xl leading-tight font-semibold sm:text-5xl">{material.title}</h1>
            <p className="mt-2 text-lg font-medium text-[#b24c34]">{material.chineseTitle}</p>
            <p className="mt-5 max-w-2xl leading-8 text-[#5d746d]">{material.summary}</p>
            <section className="mt-6 max-w-3xl rounded-2xl border border-[#d2ab52]/35 bg-[#f3e4b8]/45 p-5 text-sm leading-7 text-[#536860]">
              <h2 className="font-semibold text-[#173b35]">难度说明</h2>
              <p className="mt-2">{getDifficultyRationale(material)}</p>
            </section>

            <section className="mt-10 space-y-6" aria-label="西班牙语原文与翻译">
              <p className="text-sm leading-6 text-[#60776f]">
                点击任意西语单词查看 AI 释义。查询时会把该词与当前段落的短上下文发送给 DeepSeek；需先使用邀请码登录。
              </p>
              {material.paragraphs.map((paragraph, index) => (
                <div key={paragraph.spanish} className="rounded-2xl border border-[#173b35]/10 bg-white/70 p-5 sm:p-7">
                  <div className="flex gap-4">
                    <span className="mt-1 font-[family-name:var(--font-serif)] text-sm italic text-[#c05a3e]">{String(index + 1).padStart(2, "0")}</span>
                    <InteractiveSpanishText text={paragraph.spanish} />
                  </div>
                  <details className="mt-5 border-t border-[#173b35]/10 pt-4">
                    <summary className="cursor-pointer text-sm font-semibold text-[#b24c34]">展开中文学习译文</summary>
                    <p className="mt-3 pl-0 text-sm leading-7 text-[#60776f] sm:pl-8">{paragraph.chinese}</p>
                  </details>
                </div>
              ))}
            </section>

            <section className="mt-12">
              <h2 className="font-[family-name:var(--font-serif)] text-2xl font-semibold">阅读理解</h2>
              <div className="mt-5 space-y-3">
                {material.questions.map((question, index) => (
                  <details key={question.prompt} className="rounded-2xl border border-[#173b35]/10 bg-white/60 p-5">
                    <summary className="cursor-pointer font-medium"><span className="mr-2 text-[#b24c34]">0{index + 1}</span>{question.prompt}</summary>
                    <p lang="es" className="mt-4 border-t border-[#173b35]/10 pt-4 text-sm leading-7 text-[#60776f]">参考答案：{question.answer}</p>
                  </details>
                ))}
              </div>
            </section>

            <form action={saveReadingProgress} className="mt-10 rounded-[1.75rem] bg-[#173b35] p-6 text-[#f7f2e8] sm:p-8">
              <input type="hidden" name="readingSlug" value={material.slug} />
              <input type="hidden" name="expectedUpdatedAt" value={progress?.updated_at ?? ""} />
              <p className="text-xs font-semibold tracking-[0.18em] text-[#e6bd59] uppercase">Escritura</p>
              <h2 className="mt-2 font-[family-name:var(--font-serif)] text-2xl font-semibold">写作练习</h2>
              <p className="mt-4 leading-8 text-[#d4dfdb]">{material.writingPrompt}</p>
              <textarea name="draft" defaultValue={progress?.draft ?? ""} maxLength={10000} disabled={progressReadFailed} aria-label="写作练习草稿" className="mt-6 min-h-40 w-full rounded-2xl border border-white/15 bg-white/10 p-4 text-base text-white outline-none placeholder:text-[#9fb1aa] focus:border-[#e6bd59] disabled:cursor-not-allowed disabled:opacity-60" placeholder={user ? "Escribe aquí…" : "登录后可保存草稿与完成状态。"} />
              {saved && <p className="mt-3 text-sm text-[#bfe3d5]">学习进度已保存。</p>}
              {conflict && <p className="mt-3 text-sm text-[#f5cf75]">其他标签页或设备已经更新了这篇进度。这里已加载最新版本，请确认后重新编辑。</p>}
              {progressReadFailed && <p className="mt-3 text-sm text-[#ffd1c7]">进度暂时无法读取或保存；为避免覆盖已有草稿，编辑和保存已暂停。请稍后刷新。</p>}
              {!progressReadFailed && progressError && <p className="mt-3 text-sm text-[#f5cf75]">上次保存未成功，当前已重新加载远端进度；请确认内容后重试。</p>}
              {user && !progressReadFailed ? (
                <div className="mt-4 flex flex-wrap gap-3">
                  <button name="intent" value="save" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#173b35]">保存草稿</button>
                  <button name="intent" value={progress?.completed ? "reopen" : "complete"} className="rounded-full border border-[#e6bd59] px-5 py-2.5 text-sm font-semibold text-[#e6bd59]">{progress?.completed ? "取消完成" : "标记已完成"}</button>
                </div>
              ) : !user ? (
                <Link href="/login" className="mt-4 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#173b35]">登录并保存进度</Link>
              ) : null}
            </form>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <section className="rounded-2xl border border-[#173b35]/10 bg-white/65 p-5">
              <h2 className="font-[family-name:var(--font-serif)] text-xl font-semibold">重点词汇（{material.vocabulary.length} 项）</h2>
              <dl className="mt-5 space-y-4">
                {material.vocabulary.map((item) => (
                  <div key={item.word} className="border-b border-[#173b35]/10 pb-4 last:border-0 last:pb-0">
                    <dt lang="es" className="font-semibold text-[#b24c34]">{item.word}</dt>
                    <dd className="mt-1 text-sm text-[#536d65]">{item.meaning}</dd>
                    {item.note && <dd className="mt-1 text-xs leading-5 text-[#7b8e88]">{item.note}</dd>}
                  </div>
                ))}
              </dl>
            </section>

            <section className="rounded-2xl border border-[#d2ab52]/35 bg-[#f3e4b8]/45 p-5 text-sm leading-6 text-[#536860]">
              <h2 className="font-semibold text-[#173b35]">本篇学习重点</h2>
              <ul className="mt-3 list-inside list-disc space-y-1">
                {material.focus.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>
          </aside>
        </div>

        <footer className="mt-14 border-t border-[#173b35]/10 pt-7 text-xs leading-6 text-[#71867f]">
          <p>原作：{material.author}{material.translator ? `，西语译者：${material.translator}` : ""}，来源 <a className="underline hover:text-[#173b35]" href={material.source.url} rel="noreferrer" target="_blank">{material.source.name}</a>，许可 {material.source.license}，检索日期 {material.source.retrievedAt}。</p>
          <p>编辑说明：{material.source.editorialNote}</p>
          <p>{material.source.translationNote}</p>
          {material.source.requiredAttribution && <p>{material.source.requiredAttribution}</p>}
          {material.source.derivativeNotice && <p>{material.source.derivativeNotice}</p>}
        </footer>
      </article>
    </main>
  );
}
