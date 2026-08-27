import Link from "next/link";

import { readingLevelGuides, readingLevels, readingMaterials } from "@/content/readings";

export default function ReadingLibraryPage() {
  return (
    <main className="min-h-screen bg-[#f4f0e8] text-[#173b35]">
      <header className="border-b border-[#173b35]/10 bg-[#f4f0e8]/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="font-[family-name:var(--font-serif)] text-xl font-semibold">西语拾页</Link>
          <Link href="/" className="text-sm font-medium text-[#58726b] hover:text-[#173b35]">返回首页</Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <p className="text-xs font-semibold tracking-[0.2em] text-[#b24c34] uppercase">Lecturas seleccionadas</p>
        <h1 className="mt-4 font-[family-name:var(--font-serif)] text-4xl font-semibold sm:text-5xl">阅读材料库</h1>
        <p className="mt-5 max-w-2xl leading-8 text-[#5c746d]">
          从短篇公版原文开始。每篇材料都附有逐段中文学习译文、重点词汇、理解问题、写作任务和可核验出处。
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#71867f]">
          A1–B2 是本站建议的支架阅读等级，综合原文长度、句法、词汇、体裁与本站提供的译文和词表；不是来源方的官方 CEFR 认证。
        </p>

        <div className="mt-12 space-y-14">
          {readingLevels.map((level) => {
            const guide = readingLevelGuides[level];
            const materials = readingMaterials.filter((material) => material.level === level);

            return (
              <section key={level} aria-labelledby={`level-${level}`}>
                <div className="max-w-3xl border-l-4 border-[#d5b052] pl-5">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <h2 id={`level-${level}`} className="font-[family-name:var(--font-serif)] text-3xl font-semibold">{level} · {guide.label}</h2>
                    <span className="text-sm text-[#71867f]">{materials.length} 篇</span>
                  </div>
                  <p className="mt-2 leading-7 text-[#5c746d]">{guide.description}</p>
                  <p className="mt-1 text-sm leading-6 text-[#71867f]"><strong className="text-[#58726b]">学习前提：</strong>{guide.prerequisites}</p>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {materials.map((material) => {
                    const index = readingMaterials.indexOf(material) + 1;
                    return (
                      <article key={material.slug} className="group flex min-h-80 flex-col rounded-[1.75rem] border border-[#173b35]/10 bg-white/70 p-6 shadow-[0_16px_45px_rgba(45,72,64,0.08)] transition hover:-translate-y-1 hover:bg-white">
                        <div className="flex items-center justify-between">
                          <span className="rounded-full bg-[#173b35] px-3 py-1 text-xs font-semibold text-white">{material.level}</span>
                          <span className="font-[family-name:var(--font-serif)] text-3xl italic text-[#d5b052]">{String(index).padStart(2, "0")}</span>
                        </div>
                        <h3 className="mt-7 font-[family-name:var(--font-serif)] text-2xl font-semibold leading-tight">{material.title}</h3>
                        <p className="mt-1 text-sm font-medium text-[#b24c34]">{material.chineseTitle}</p>
                        <p className="mt-5 flex-1 text-sm leading-7 text-[#60776f]">{material.summary}</p>
                        <div className="mt-6 flex items-center justify-between border-t border-[#173b35]/10 pt-5 text-xs text-[#71867f]">
                          <span>{material.minutes} 分钟</span>
                          <Link className="font-semibold text-[#173b35] group-hover:text-[#b24c34]" href={`/lecturas/${material.slug}`}>开始阅读 →</Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        <aside className="mt-10 rounded-2xl border border-[#d3aa4c]/30 bg-[#f3e4b8]/40 p-5 text-sm leading-7 text-[#5d6f69]">
          <strong className="text-[#173b35]">内容说明：</strong>材料只收录公版或开放许可原文，并逐篇标示作者、译者（如有）、来源与许可。中文译文和学习注释由本站编写；历史文本保留原拼写并另作提示。
        </aside>
      </section>
    </main>
  );
}
