import Link from "next/link";

import { logout } from "@/app/login/actions";
import { readingMaterials } from "@/content/readings";
import { createRecommendedReadingPlan } from "@/domain/learning-plan";
import { getCurrentInviteUser } from "@/lib/auth/invite-session";
import { createAdminClient } from "@/lib/supabase/admin";

function BookIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
      <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5v-16Z" />
    </svg>
  );
}

export default async function Home() {
  const user = await getCurrentInviteUser();
  const supabase = user ? createAdminClient() : null;
  let progressUnavailable = false;
  let completedSlugs: string[] = [];

  if (user) {
    if (!supabase) {
      progressUnavailable = true;
    } else {
      const { data, error } = await supabase
        .from("reading_progress")
        .select("reading_slug, completed")
        .eq("user_id", user.id);
      if (error) {
        progressUnavailable = true;
      } else {
        completedSlugs = (data ?? [])
          .filter((row) => row.completed === true)
          .map((row) => row.reading_slug);
      }
    }
  }

  const plan = createRecommendedReadingPlan(readingMaterials, completedSlugs);
  const primaryReadingHref = plan.tasks[0]?.href ?? "/lecturas";

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f0e8] text-[#173b35]">
      <div className="pointer-events-none fixed inset-0 opacity-40 [background-image:radial-gradient(#7d968c_0.7px,transparent_0.7px)] [background-size:18px_18px]" />

      <header className="relative border-b border-[#173b35]/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <a href="#top" className="flex items-center gap-3" aria-label="西语拾页首页">
            <span className="grid size-10 place-items-center rounded-full bg-[#173b35] text-[#f4f0e8]">
              <BookIcon />
            </span>
            <span>
              <span className="block font-[family-name:var(--font-serif)] text-xl font-semibold tracking-wide">西语拾页</span>
              <span className="block text-[10px] tracking-[0.28em] text-[#58726b] uppercase">Lee · Escribe · Crece</span>
            </span>
          </a>

          <nav className="hidden items-center gap-8 text-sm text-[#4c6861] md:flex" aria-label="主导航">
            <a className="transition-colors hover:text-[#173b35]" href="#method">学习方法</a>
            <a className="transition-colors hover:text-[#173b35]" href="#plan">我的计划</a>
            <Link className="transition-colors hover:text-[#173b35]" href="/lecturas">阅读材料</Link>
            <Link className="transition-colors hover:text-[#173b35]" href="/crear-material">生成学习材料</Link>
            {user && <Link className="transition-colors hover:text-[#173b35]" href="/mis-materiales">我的材料</Link>}
          </nav>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="max-w-36 truncate text-sm font-medium text-[#4c6861]" title={user.label}>
                {user.label}
              </span>
              <form action={logout}>
                <button className="rounded-full border border-[#173b35]/25 px-4 py-2 text-sm font-medium transition hover:bg-[#173b35] hover:text-white">
                  退出
                </button>
              </form>
            </div>
          ) : (
            <Link href="/login" className="rounded-full border border-[#173b35]/25 px-4 py-2 text-sm font-medium transition hover:bg-[#173b35] hover:text-white">
              邀请码登录
            </Link>
          )}
        </div>
      </header>

      <section id="top" className="relative mx-auto grid max-w-7xl gap-14 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:py-28">
        <div className="flex flex-col justify-center">
          <div className="mb-7 flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-[#b24c34] uppercase">
            <span className="h-px w-9 bg-[#b24c34]" />
            为中文母语学习者设计
          </div>

          <h1 className="max-w-3xl font-[family-name:var(--font-serif)] text-5xl leading-[1.08] font-semibold tracking-[-0.035em] sm:text-6xl lg:text-7xl">
            从一页西语开始，
            <span className="italic text-[#b24c34]">读懂更大的世界。</span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-[#4c6861] sm:text-lg">
            以真实文本为起点，在阅读中理解语法，在写作中组织表达。按清晰的学习路径，稳步建立属于你的西班牙语读写能力。
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link href={primaryReadingHref} className="rounded-full bg-[#d65c3d] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(178,76,52,0.22)] transition hover:-translate-y-0.5 hover:bg-[#bd4d33]">
              {user && !progressUnavailable ? "继续推荐阅读" : "开始第一篇阅读"}
            </Link>
            <Link href="/crear-material" className="rounded-full border border-[#173b35]/20 px-6 py-3.5 text-sm font-semibold hover:bg-white/60">
              生成我的学习材料
            </Link>
            <a href="#method" className="flex items-center gap-2 px-3 py-3 text-sm font-semibold text-[#173b35]">
              了解学习方法 <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div id="plan" className="relative flex items-center justify-center lg:justify-end">
          <div className="absolute -top-6 right-3 size-32 rounded-full bg-[#edc96d]/35 blur-3xl" />
          <article className="relative w-full max-w-lg rounded-[2rem] border border-white/70 bg-white/75 p-5 shadow-[0_28px_80px_rgba(45,72,64,0.13)] backdrop-blur sm:p-7">
            <div className="mb-7 flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-[#779087] uppercase">
                  {user && !progressUnavailable ? "依据真实学习进度" : "推荐起步路径"}
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-serif)] text-2xl font-semibold">{user ? "你的推荐阅读路径" : "推荐阅读路径"}</h2>
              </div>
              <div className="grid size-16 shrink-0 place-items-center rounded-full border-[5px] border-[#dfd9cb] border-t-[#d65c3d] text-sm font-bold">
                {progressUnavailable ? "—" : `${plan.progress}%`}
              </div>
            </div>

            <ol className="space-y-3">
              {plan.tasks.map((task, index) => (
                <li key={task.slug}>
                  <Link href={task.href} className={`flex items-center gap-4 rounded-2xl border p-4 transition hover:-translate-y-0.5 ${task.completed ? "border-[#99afa7]/30 bg-[#edf2ef]" : "border-[#173b35]/10 bg-white/70"}`}>
                    <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${task.completed ? "bg-[#173b35] text-white" : "bg-[#efe9dc] text-[#6c827a]"}`}>
                      {task.completed ? <span aria-label="已完成">✓</span> : <BookIcon />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold tracking-[0.14em] text-[#779087] uppercase">
                        {task.level} · Lectura
                      </p>
                      <p className={`mt-1 font-medium ${task.completed ? "text-[#667b74]" : "text-[#173b35]"}`}>{task.title}</p>
                    </div>
                    <span className="text-xs font-medium text-[#879a93]">0{index + 1}</span>
                  </Link>
                </li>
              ))}
            </ol>

            <div className="mt-6 flex items-center justify-between border-t border-[#173b35]/10 pt-5 text-sm">
              <span className="text-[#6d817a]">
                {progressUnavailable
                  ? "学习进度暂时无法读取"
                  : user
                    ? `已完成 ${plan.completedCount} / ${plan.totalCount} 篇`
                    : `登录后同步真实进度 · 共 ${plan.totalCount} 篇`}
              </span>
              <span className="font-semibold text-[#b24c34]">{plan.allCompleted ? "复习" : "下一组"}约 {plan.nextMinutes} 分钟</span>
            </div>
          </article>
        </div>
      </section>

      <section id="method" className="relative border-y border-[#173b35]/10 bg-[#173b35] text-[#f8f3e9]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-3 lg:px-12">
          {[
            ["01", "读一篇", "从短小、分级的真实文本中理解词汇与结构。"],
            ["02", "拆一句", "借助中文解释和英西对照，看清表达之间的联系。"],
            ["03", "写一段", "用刚读到的语言完成摘要、改写与短文练习。"],
          ].map(([number, title, description]) => (
            <div key={number} className="grid grid-cols-[auto_1fr] gap-4 border-white/10 md:border-r md:pr-8 last:border-0">
              <span className="font-[family-name:var(--font-serif)] text-3xl italic text-[#e8bd58]">{number}</span>
              <div>
                <h2 className="font-[family-name:var(--font-serif)] text-xl font-semibold">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-[#bac9c4]">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="materials" className="relative mx-auto max-w-7xl px-5 py-14 text-center sm:px-8 lg:px-12">
        <p className="text-xs font-semibold tracking-[0.18em] text-[#b24c34] uppercase">Contenido con criterio</p>
        <h2 className="mt-3 font-[family-name:var(--font-serif)] text-3xl font-semibold">有依据的课程，有边界的内容</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#60776f]">
          课程结构参考权威西班牙语等级框架；站内材料仅采用公版、开放许可或获得授权的文本，并保留清晰来源。
        </p>
        <Link href="/lecturas" className="mt-7 inline-flex rounded-full border border-[#173b35]/20 px-5 py-3 text-sm font-semibold hover:bg-[#173b35] hover:text-white">浏览 24 篇精选材料 →</Link>
      </section>
    </main>
  );
}
