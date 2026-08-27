"use client";

import Link from "next/link";
import { useState } from "react";

import { GeneratedMaterialView } from "@/components/custom-material-workshop";
import { DeepSeekErrorNotice } from "@/components/deepseek-error-notice";
import { InteractiveSpanishText } from "@/components/interactive-spanish-text";
import type { GeneratedLearningMaterial } from "@/lib/deepseek/generate-material";
import {
  ARTICLE_TOPICS,
  type ArticleLevel,
  type GeneratedSpanishArticle,
} from "@/lib/deepseek/generate-article";

type ApiError = { message: string; code?: string; manageStorageHref?: string };
type ArticleState =
  | { status: "idle" | "loading" }
  | { status: "error"; error: ApiError }
  | { status: "success"; article: GeneratedSpanishArticle };
type MaterialState =
  | { status: "idle" | "loading" }
  | { status: "error"; error: ApiError }
  | { status: "success"; materialId: string; material: GeneratedLearningMaterial };
type Focus = "balanced" | "vocabulary" | "grammar" | "writing";

const levelLabels: Array<[ArticleLevel, string]> = [
  ["A1", "A1 · 入门"],
  ["A2", "A2 · 基础"],
  ["B1", "B1 · 中级"],
  ["B2", "B2 · 中高级"],
];

const focusLabels: Array<[Focus, string]> = [
  ["balanced", "均衡讲解"],
  ["vocabulary", "词汇积累"],
  ["grammar", "语法理解"],
  ["writing", "写作迁移"],
];

export function ArticleDraftConversion({ article }: { article: GeneratedSpanishArticle }) {
  const [focus, setFocus] = useState<Focus>("balanced");
  const [state, setState] = useState<MaterialState>({ status: "idle" });
  const paragraphs = article.text.split(/\r?\n\s*\r?\n/u).filter(Boolean);

  async function convertToMaterial() {
    setState({ status: "loading" });
    try {
      const response = await fetch("/api/generate-material", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          text: article.text,
          targetLevel: article.level,
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
      if (!response.ok || !payload.materialId || !payload.material) {
        setState({
          status: "error",
          error: {
            message: payload.error ?? "暂时无法转换学习材料，请稍后重试。",
            code: payload.code,
            manageStorageHref: payload.manageStorageHref,
          },
        });
        return;
      }
      setState({
        status: "success",
        materialId: payload.materialId,
        material: payload.material,
      });
    } catch {
      setState({ status: "error", error: { message: "暂时无法转换学习材料，请稍后重试。" } });
    }
  }

  return (
    <section className="mt-8 rounded-[1.75rem] border border-[#173b35]/10 bg-white/75 p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-[#173b35] px-3 py-1 text-xs font-semibold text-white">{article.level}</span>
        <span className="text-xs font-semibold text-[#b24c34]">AI 西语短文 · 草稿尚未保存</span>
      </div>
      <h3 lang="es" className="mt-5 font-[family-name:var(--font-serif)] text-3xl font-semibold">{article.titleEs}</h3>
      <div className="mt-6 space-y-5">
        {paragraphs.map((paragraph, index) => (
          <div key={`${index}-${paragraph.slice(0, 24)}`} className="rounded-2xl bg-[#f7f3eb] p-5">
            <InteractiveSpanishText text={paragraph} />
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs leading-6 text-[#71867f]">
        请先检查短文是否符合你的想法。只有点击转换后，短文才会再次发送给 DeepSeek，并保存为你的个性化学习材料。
      </p>
      <div className="mt-6 flex flex-wrap items-end gap-4">
        <label className="min-w-52 text-sm font-semibold">
          学习重点
          <select
            value={focus}
            onChange={(event) => setFocus(event.target.value as Focus)}
            className="mt-2 w-full rounded-xl border border-[#173b35]/15 bg-[#fffdf8] p-3 font-normal"
          >
            {focusLabels.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <button
          type="button"
          onClick={convertToMaterial}
          disabled={state.status === "loading" || state.status === "success"}
          className="rounded-full bg-[#d65c3d] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {state.status === "loading" ? "正在转换并保存…" : state.status === "success" ? "已保存为学习材料" : "转换并保存为学习材料"}
        </button>
      </div>
      {state.status === "error" && (
        <div className="mt-5">
          <DeepSeekErrorNotice {...state.error} />
        </div>
      )}
      {state.status === "success" && (
        <GeneratedMaterialView
          sourceText={article.text}
          material={state.material}
          materialId={state.materialId}
        />
      )}
    </section>
  );
}

export function ArticleGenerationWorkshop({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [sourceMode, setSourceMode] = useState<"topic" | "prompt">("topic");
  const [topicId, setTopicId] = useState<(typeof ARTICLE_TOPICS)[number]["id"]>(ARTICLE_TOPICS[0].id);
  const [idea, setIdea] = useState("");
  const [targetLevel, setTargetLevel] = useState<ArticleLevel>("A2");
  const [acknowledged, setAcknowledged] = useState(false);
  const [state, setState] = useState<ArticleState>({ status: "idle" });

  if (!isAuthenticated) {
    return (
      <section className="rounded-[1.75rem] border border-[#173b35]/10 bg-white/75 p-7 text-center">
        <h2 className="font-[family-name:var(--font-serif)] text-2xl font-semibold">登录受邀账号后使用</h2>
        <p className="mt-3 text-sm leading-7 text-[#60776f]">文章生成会调用付费 AI 服务，并在你确认转换后保存学习材料。</p>
        <Link href="/login" className="mt-6 inline-flex rounded-full bg-[#173b35] px-5 py-3 text-sm font-semibold text-white">前往登录</Link>
      </section>
    );
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sourceMode === "prompt" && idea.trim().length < 3) {
      setState({ status: "error", error: { message: "请至少输入 3 个字符，说明你想写什么。" } });
      return;
    }
    if (!acknowledged) {
      setState({ status: "error", error: { message: "请先确认允许把主题或想法发送给 DeepSeek。" } });
      return;
    }
    setState({ status: "loading" });
    try {
      const response = await fetch("/api/generate-article", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          sourceMode,
          ...(sourceMode === "topic" ? { topicId } : { idea: idea.trim() }),
          targetLevel,
          acknowledgedExternalProcessing: true,
        }),
      });
      const payload = (await response.json()) as {
        article?: GeneratedSpanishArticle;
        error?: string;
        code?: string;
      };
      if (!response.ok || !payload.article) {
        setState({
          status: "error",
          error: {
            message: payload.error ?? "暂时无法生成西班牙语短文，请稍后重试。",
            code: payload.code,
          },
        });
        return;
      }
      setState({ status: "success", article: payload.article });
    } catch {
      setState({ status: "error", error: { message: "暂时无法生成西班牙语短文，请稍后重试。" } });
    }
  }

  return (
    <>
      <form onSubmit={submit} className="rounded-[1.75rem] border border-[#173b35]/10 bg-white/75 p-6 shadow-[0_18px_55px_rgba(45,72,64,0.08)] sm:p-8">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#173b35]/10 p-4 text-sm font-semibold">
            <input type="radio" name="articleSourceMode" value="topic" checked={sourceMode === "topic"} onChange={() => setSourceMode("topic")} />
            选择平台主题
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#173b35]/10 p-4 text-sm font-semibold">
            <input type="radio" name="articleSourceMode" value="prompt" checked={sourceMode === "prompt"} onChange={() => setSourceMode("prompt")} />
            输入我的想法
          </label>
        </div>

        {sourceMode === "topic" ? (
          <fieldset className="mt-6">
            <legend className="font-semibold">选择一个主题</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ARTICLE_TOPICS.map((topic) => (
                <label key={topic.id} className="cursor-pointer rounded-xl border border-[#173b35]/10 p-4 text-sm">
                  <input type="radio" name="articleTopic" value={topic.id} checked={topicId === topic.id} onChange={() => setTopicId(topic.id)} className="mr-2" />
                  <strong>{topic.labelZh}</strong>
                  <span className="mt-1 block text-xs leading-5 text-[#71867f]">{topic.briefZh}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ) : (
          <label className="mt-6 block font-semibold">
            你想读一篇什么样的文章？
            <textarea
              value={idea}
              onChange={(event) => setIdea(event.target.value)}
              minLength={3}
              maxLength={1000}
              required
              className="mt-3 min-h-36 w-full rounded-2xl border border-[#173b35]/15 bg-[#fffdf8] p-4 text-base leading-7 outline-none focus:border-[#b24c34]"
              placeholder="例如：写一个关于第一次独自旅行、途中遇到善意帮助的故事。可以用中文、英文或西班牙语。"
            />
            <span className="mt-1 block text-xs font-normal text-[#71867f]">{idea.length} / 1000 字符</span>
          </label>
        )}

        <label className="mt-6 block max-w-sm text-sm font-semibold">
          目标等级
          <select value={targetLevel} onChange={(event) => setTargetLevel(event.target.value as ArticleLevel)} className="mt-2 w-full rounded-xl border border-[#173b35]/15 bg-[#fffdf8] p-3 font-normal">
            {levelLabels.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>

        <label className="mt-6 flex items-start gap-3 rounded-xl bg-[#f4f0e8] p-4 text-sm leading-6 text-[#536d65]">
          <input type="checkbox" checked={acknowledged} onChange={(event) => setAcknowledged(event.target.checked)} className="mt-1 size-4 accent-[#b24c34]" />
          <span>我确认把所选主题或输入内容发送给 DeepSeek 生成西班牙语短文；只有我再次点击转换时，短文才会生成并保存为学习材料。</span>
        </label>

        <button type="submit" disabled={state.status === "loading"} className="mt-6 rounded-full bg-[#173b35] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">
          {state.status === "loading" ? "正在生成短文…" : "先生成西班牙语短文"}
        </button>
        {state.status === "error" && (
          <div className="mt-5"><DeepSeekErrorNotice {...state.error} /></div>
        )}
      </form>
      {state.status === "success" && <ArticleDraftConversion article={state.article} />}
    </>
  );
}
