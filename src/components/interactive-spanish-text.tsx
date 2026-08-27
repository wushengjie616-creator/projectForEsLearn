"use client";

import { useRef, useState } from "react";

import { DeepSeekErrorNotice } from "@/components/deepseek-error-notice";
import type { WordTranslation } from "@/lib/deepseek/translate-word";
import { getContextWindow, tokenizeSpanish } from "@/lib/spanish/tokenize";

type InteractiveSpanishTextProps = {
  text: string;
  sourceReadingSlug?: string;
  deepSeekEnabled?: boolean;
};

type TranslationState =
  | { status: "idle" }
  | { status: "loading"; word: string }
  | { status: "success"; translation: WordTranslation }
  | { status: "error"; word: string; message: string; code?: string };

export function InteractiveSpanishText({
  text,
  sourceReadingSlug,
  deepSeekEnabled = true,
}: InteractiveSpanishTextProps) {
  const tokens = tokenizeSpanish(text);
  const cache = useRef(new Map<string, WordTranslation>());
  const [state, setState] = useState<TranslationState>({ status: "idle" });

  async function translate(word: string, start: number) {
    const context = getContextWindow(text, start, word.length);
    const cacheKey = `${word.toLocaleLowerCase("es")}\u0000${context}`;
    const cached = cache.current.get(cacheKey);
    if (cached) {
      setState({ status: "success", translation: cached });
      return;
    }

    setState({ status: "loading", word });
    try {
      const response = await fetch("/api/translate-word", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ word, context, sourceReadingSlug }),
      });
      const payload = (await response.json()) as {
        translation?: WordTranslation;
        error?: string;
        code?: string;
      };
      if (!response.ok || !payload.translation) {
        setState({
          status: "error",
          word,
          message: payload.error ?? "AI 释义暂时不可用，请稍后重试。",
          code: payload.code,
        });
        return;
      }
      cache.current.set(cacheKey, payload.translation);
      setState({ status: "success", translation: payload.translation });
    } catch (error) {
      setState({
        status: "error",
        word,
        message: error instanceof Error ? error.message : "AI 释义暂时不可用，请稍后重试。",
      });
    }
  }

  return (
    <div className="min-w-0 flex-1">
      <p lang="es" className="font-[family-name:var(--font-serif)] text-xl leading-9 text-[#173b35]">
        {tokens.map((token, index) =>
          token.isWord && deepSeekEnabled ? (
            <button
              key={`${token.start}-${index}`}
              type="button"
              data-spanish-word={token.text}
              onClick={() => translate(token.text, token.start)}
              className="rounded-sm decoration-[#c05a3e]/40 decoration-dotted underline-offset-4 hover:text-[#b24c34] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b24c34]"
              aria-label={`查看 ${token.text} 的 AI 释义`}
            >
              {token.text}
            </button>
          ) : (
            <span key={`${token.start}-${index}`}>{token.text}</span>
          ),
        )}
      </p>

      <div className="mt-4 min-h-7 text-sm" aria-live="polite">
        {state.status === "loading" && <p className="text-[#71867f]">正在查询 “{state.word}”…</p>}
        {state.status === "error" && (
          <DeepSeekErrorNotice message={`“${state.word}”：${state.message}`} code={state.code} />
        )}
        {state.status === "success" && (
          <section className="rounded-xl border border-[#d2ab52]/45 bg-[#fffaf0] p-4" aria-label={`${state.translation.word} 的 AI 释义`}>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <strong lang="es" className="text-lg text-[#b24c34]">{state.translation.word}</strong>
              <span lang="es" className="font-medium">{state.translation.lemma}</span>
              <span className="text-xs text-[#71867f]">{state.translation.partOfSpeech}</span>
            </div>
            <p className="mt-2 text-[#435e56]">{state.translation.meaningZh}</p>
            {state.translation.meaningEn && <p lang="en" className="mt-1 text-xs text-[#71867f]">English: {state.translation.meaningEn}</p>}
            {state.translation.grammarNote && <p className="mt-2 text-xs leading-5 text-[#60776f]">{state.translation.grammarNote}</p>}
            <p className="mt-2 text-[11px] text-[#8a9893]">AI 生成内容可能有误，请结合原文与重点词汇核对。</p>
          </section>
        )}
      </div>
    </div>
  );
}
