"use client";

import Link from "next/link";
import { useState } from "react";

import { InteractiveSpanishText } from "@/components/interactive-spanish-text";
import { DeepSeekErrorNotice } from "@/components/deepseek-error-notice";
import type { GeneratedLearningMaterial } from "@/lib/deepseek/generate-material";
import { splitSpanishParagraphs } from "@/lib/deepseek/generate-material";

type GenerationState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string; code?: string; manageStorageHref?: string }
  | { status: "success"; sourceText: string; materialId: string; material: GeneratedLearningMaterial };

const levelOptions = [
  ["auto", "自动评估"],
  ["A1", "A1 · 入门"],
  ["A2", "A2 · 基础"],
  ["B1", "B1 · 中级"],
  ["B2", "B2 · 中高级"],
] as const;

const focusOptions = [
  ["balanced", "均衡讲解"],
  ["vocabulary", "词汇积累"],
  ["grammar", "语法理解"],
  ["writing", "写作迁移"],
] as const;

export function GeneratedMaterialView({ sourceText, material, materialId }: {
  sourceText: string;
  material: GeneratedLearningMaterial;
  materialId?: string;
}) {
  const paragraphs = splitSpanishParagraphs(sourceText);

  return (
    <article className="mt-12 border-t border-[#173b35]/15 pt-10" aria-label="生成的个性化学习材料">
      <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
        <span className="rounded-full bg-[#173b35] px-3 py-1 text-white">{material.detectedLevel}</span>
        <span className="text-[#71867f]">AI 个性化材料 · {materialId ? "已保存" : "预览"}</span>
        {materialId && (
          <Link href={`/mis-materiales/${materialId}`} className="text-[#b24c34] underline underline-offset-4">
            已保存到你的学习材料
          </Link>
        )}
      </div>
      <h2 lang="es" className="mt-5 font-[family-name:var(--font-serif)] text-4xl font-semibold">{material.titleEs}</h2>
      <p className="mt-2 text-lg font-medium text-[#b24c34]">{material.titleZh}</p>
      <p className="mt-5 max-w-3xl leading-8 text-[#5d746d]">{material.summaryZh}</p>

      <section className="mt-6 rounded-2xl border border-[#d2ab52]/35 bg-[#f3e4b8]/45 p-5">
        <h3 className="font-semibold">难度说明</h3>
        <p className="mt-2 text-sm leading-7 text-[#536860]">{material.difficultyRationaleZh}</p>
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="学习重点">
          {material.focusPoints.map((point) => (
            <li key={point} className="rounded-full bg-white/70 px-3 py-1 text-xs text-[#536860]">{point}</li>
          ))}
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="custom-close-reading">
        <h3 id="custom-close-reading" className="font-[family-name:var(--font-serif)] text-2xl font-semibold">逐段精读</h3>
        <div className="mt-5 space-y-5">
          {paragraphs.map((paragraph, index) => {
            const guide = material.paragraphGuides[index];
            return (
              <div key={`${index}-${paragraph.slice(0, 30)}`} className="rounded-2xl border border-[#173b35]/10 bg-white/75 p-5 sm:p-7">
                <div className="flex gap-4">
                  <span className="mt-1 text-sm italic text-[#c05a3e]">{String(index + 1).padStart(2, "0")}</span>
                  <InteractiveSpanishText text={paragraph} />
                </div>
                <div className="mt-5 border-t border-[#173b35]/10 pt-4 sm:pl-8">
                  <p className="text-sm leading-7 text-[#536d65]">{guide.translationZh}</p>
                  <p className="mt-2 text-xs leading-6 text-[#71867f]">语言提示：{guide.languageNoteZh}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-[#173b35]/10 bg-white/70 p-6">
          <h3 className="font-[family-name:var(--font-serif)] text-2xl font-semibold">重点词汇</h3>
          <dl className="mt-5 space-y-4">
            {material.vocabulary.map((item) => (
              <div key={`${item.word}-${item.lemma}`} className="border-b border-[#173b35]/10 pb-4 last:border-0 last:pb-0">
                <dt className="flex flex-wrap items-baseline gap-2">
                  <strong lang="es" className="text-[#b24c34]">{item.word}</strong>
                  <span lang="es" className="text-sm">{item.lemma}</span>
                  <span className="text-xs text-[#71867f]">{item.partOfSpeech}</span>
                </dt>
                <dd className="mt-1 text-sm text-[#536d65]">{item.meaningZh}</dd>
                {item.meaningEn && <dd lang="en" className="mt-1 text-xs text-[#71867f]">English: {item.meaningEn}</dd>}
                {item.noteZh && <dd className="mt-1 text-xs text-[#71867f]">{item.noteZh}</dd>}
              </div>
            ))}
          </dl>
        </section>

        <section className="rounded-2xl border border-[#173b35]/10 bg-white/70 p-6">
          <h3 className="font-[family-name:var(--font-serif)] text-2xl font-semibold">语法观察</h3>
          <div className="mt-5 space-y-5">
            {material.grammarPoints.map((point) => (
              <div key={point.title}>
                <h4 className="font-semibold text-[#b24c34]">{point.title}</h4>
                <p className="mt-1 text-sm leading-7 text-[#536d65]">{point.explanationZh}</p>
                <p lang="es" className="mt-2 rounded-xl bg-[#f4f0e8] p-3 text-sm">{point.example}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-10">
        <h3 className="font-[family-name:var(--font-serif)] text-2xl font-semibold">阅读理解</h3>
        <div className="mt-5 space-y-3">
          {material.questions.map((question, index) => (
            <details key={question.prompt} className="rounded-2xl border border-[#173b35]/10 bg-white/65 p-5">
              <summary className="cursor-pointer font-medium"><span className="mr-2 text-[#b24c34]">0{index + 1}</span>{question.prompt}</summary>
              <p lang="es" className="mt-4 border-t border-[#173b35]/10 pt-4 text-sm text-[#60776f]">参考答案：{question.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-[1.75rem] bg-[#173b35] p-6 text-[#f7f2e8] sm:p-8">
        <p className="text-xs font-semibold tracking-[0.18em] text-[#e6bd59] uppercase">Escritura</p>
        <h3 className="mt-2 font-[family-name:var(--font-serif)] text-2xl font-semibold">写作练习</h3>
        <p className="mt-4 leading-8 text-[#d4dfdb]">{material.writingPromptZh}</p>
      </section>

      <section className="mt-8 rounded-2xl border border-[#d2ab52]/35 bg-[#f3e4b8]/45 p-6">
        <h3 className="font-semibold">建议学习步骤</h3>
        <ol className="mt-4 space-y-3">
          {material.studySteps.map((step, index) => (
            <li key={step} className="flex gap-3 text-sm leading-6 text-[#536860]">
              <span className="font-semibold text-[#b24c34]">{String(index + 1).padStart(2, "0")}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <p className="mt-6 text-xs leading-6 text-[#71867f]">
        AI 生成内容可能有误，请结合原文核对。{materialId ? "这份快照可在下次登录后继续查看和练习。" : "这份内容尚未保存。"}
      </p>
    </article>
  );
}

export function CustomMaterialWorkshop({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [text, setText] = useState("");
  const [targetLevel, setTargetLevel] = useState<"auto" | "A1" | "A2" | "B1" | "B2">("auto");
  const [focus, setFocus] = useState<"balanced" | "vocabulary" | "grammar" | "writing">("balanced");
  const [acknowledged, setAcknowledged] = useState(false);
  const [state, setState] = useState<GenerationState>({ status: "idle" });

  async function loadTextFile(file: File | undefined) {
    if (!file) return;
    if (file.size > 30_000) {
      setState({ status: "error", message: "TXT 文件不能超过 30 KB。" });
      return;
    }
    try {
      const content = await file.text();
      if (content.length > 6000) {
        setState({ status: "error", message: "短文不能超过 6000 个字符。" });
        return;
      }
      setText(content);
      setState({ status: "idle" });
    } catch {
      setState({ status: "error", message: "无法读取该 TXT 文件。" });
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (text.trim().length < 50) {
      setState({ status: "error", message: "请提供至少 50 个字符的西班牙语短文。" });
      return;
    }
    if (!acknowledged) {
      setState({ status: "error", message: "请先确认允许把短文发送给 DeepSeek 处理。" });
      return;
    }

    const sourceText = text.trim();
    setState({ status: "loading" });
    try {
      const response = await fetch("/api/generate-material", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          text: sourceText,
          targetLevel,
          focus,
          acknowledgedExternalProcessing: true,
        }),
      });
      const payload = (await response.json()) as {
        materialId?: string;
        material?: GeneratedLearningMaterial;
        error?: string;
        code?: string;
        manageStorageHref?: string;
      };
      if (!response.ok || !payload.material || !payload.materialId) {
        setState({
          status: "error",
          message: payload.error ?? "暂时无法生成学习材料，请稍后重试。",
          code: payload.code,
          manageStorageHref: payload.manageStorageHref,
        });
        return;
      }
      setState({ status: "success", sourceText, materialId: payload.materialId, material: payload.material });
    } catch (error) {
      setState({
        status: "error",
        message: error instanceof Error ? error.message : "暂时无法生成学习材料，请稍后重试。",
      });
    }
  }

  if (!isAuthenticated) {
    return (
      <section className="rounded-[1.75rem] border border-[#173b35]/10 bg-white/75 p-7 text-center shadow-[0_18px_55px_rgba(45,72,64,0.08)]">
        <h2 className="font-[family-name:var(--font-serif)] text-2xl font-semibold">登录受邀账号后使用</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#60776f]">个性化生成会调用付费 AI 服务，因此只向已登录的受邀用户开放。</p>
        <Link href="/login" className="mt-6 inline-flex rounded-full bg-[#173b35] px-5 py-3 text-sm font-semibold text-white">前往登录</Link>
      </section>
    );
  }

  return (
    <>
      <form onSubmit={submit} className="rounded-[1.75rem] border border-[#173b35]/10 bg-white/75 p-6 shadow-[0_18px_55px_rgba(45,72,64,0.08)] sm:p-8">
        <label htmlFor="custom-source" className="font-semibold">粘贴西班牙语短文</label>
        <p className="mt-2 text-sm leading-6 text-[#71867f]">50–6000 个字符，最多 12 段；也可以选择本地 TXT 文件。请勿包含个人或敏感信息。</p>
        <textarea
          id="custom-source"
          name="sourceText"
          lang="es"
          value={text}
          onChange={(event) => setText(event.target.value)}
          minLength={50}
          maxLength={6000}
          required
          className="mt-4 min-h-64 w-full rounded-2xl border border-[#173b35]/15 bg-[#fffdf8] p-4 text-base leading-7 outline-none focus:border-[#b24c34]"
          placeholder="Pega aquí tu texto en español…"
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-[#71867f]">
          <span>{text.length} / 6000 字符</span>
          <label className="cursor-pointer rounded-full border border-[#173b35]/15 px-4 py-2 font-semibold text-[#536d65] hover:bg-[#f4f0e8]">
            选择 TXT 文件
            <input
              type="file"
              accept=".txt,text/plain"
              className="sr-only"
              onChange={(event) => loadTextFile(event.target.files?.[0])}
            />
          </label>
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            目标等级
            <select value={targetLevel} onChange={(event) => setTargetLevel(event.target.value as typeof targetLevel)} className="mt-2 w-full rounded-xl border border-[#173b35]/15 bg-[#fffdf8] p-3 font-normal">
              {levelOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold">
            学习重点
            <select value={focus} onChange={(event) => setFocus(event.target.value as typeof focus)} className="mt-2 w-full rounded-xl border border-[#173b35]/15 bg-[#fffdf8] p-3 font-normal">
              {focusOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
        </div>

        <label className="mt-7 flex items-start gap-3 rounded-xl bg-[#f4f0e8] p-4 text-sm leading-6 text-[#536d65]">
          <input type="checkbox" checked={acknowledged} onChange={(event) => setAcknowledged(event.target.checked)} className="mt-1 size-4 accent-[#b24c34]" />
          <span>我确认将短文发送给 DeepSeek 生成学习材料，并将原文与生成结果保存到我的受邀账号。</span>
        </label>

        <button type="submit" disabled={state.status === "loading"} className="mt-6 rounded-full bg-[#d65c3d] px-6 py-3 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-60">
          {state.status === "loading" ? "正在生成，请稍候…" : "生成个性化学习材料"}
        </button>
        <div className="mt-4 min-h-6 text-sm" aria-live="polite">
          {state.status === "loading" && <p className="text-[#71867f]">DeepSeek 正在分析短文并组织读写练习，通常需要数秒。</p>}
          {state.status === "error" && (
            <DeepSeekErrorNotice
              message={state.message}
              code={state.code}
              manageStorageHref={state.manageStorageHref}
            />
          )}
        </div>
      </form>

      {state.status === "success" && <GeneratedMaterialView sourceText={state.sourceText} material={state.material} materialId={state.materialId} />}
    </>
  );
}
