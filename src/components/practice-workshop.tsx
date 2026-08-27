"use client";

import { useState } from "react";

import { DeepSeekErrorNotice } from "@/components/deepseek-error-notice";
import type { PracticeAttemptSummary, StoredPracticeSet } from "@/domain/custom-learning";
import type { PracticeGrade } from "@/domain/practice";

type RequestState = { status: "idle" | "loading" } | { status: "error"; message: string; code?: string; manageStorageHref?: string };

export function PracticeWorkshop({ materialId, initialPractice, initialAttempts }: {
  materialId: string;
  initialPractice: StoredPracticeSet | null;
  initialAttempts: PracticeAttemptSummary[];
}) {
  const [practice, setPractice] = useState(initialPractice);
  const [attempts, setAttempts] = useState(initialAttempts);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [grade, setGrade] = useState<PracticeGrade | null>(null);
  const [requestState, setRequestState] = useState<RequestState>({ status: "idle" });

  async function generatePractice() {
    setRequestState({ status: "loading" });
    setGrade(null);
    try {
      const response = await fetch(`/api/materials/${materialId}/practice`, { method: "POST" });
      const payload = (await response.json()) as {
        practice?: StoredPracticeSet;
        error?: string;
        code?: string;
        manageStorageHref?: string;
      };
      if (!response.ok || !payload.practice) {
        setRequestState({
          status: "error",
          message: payload.error ?? "练习暂时无法生成。",
          code: payload.code,
          manageStorageHref: payload.manageStorageHref,
        });
        return;
      }
      setPractice(payload.practice);
      setAnswers({});
      setRequestState({ status: "idle" });
    } catch {
      setRequestState({ status: "error", message: "练习暂时无法生成，请稍后重试。" });
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!practice) return;
    setRequestState({ status: "loading" });
    try {
      const response = await fetch(`/api/practice/${practice.id}/attempts`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const payload = (await response.json()) as {
        attemptId?: string;
        grade?: PracticeGrade;
        error?: string;
        manageStorageHref?: string;
      };
      if (!response.ok || !payload.grade || !payload.attemptId) {
        setRequestState({
          status: "error",
          message: payload.error ?? "答案暂时无法提交。",
          manageStorageHref: payload.manageStorageHref,
        });
        return;
      }
      setGrade(payload.grade);
      setAttempts((current) => [{
        id: payload.attemptId!,
        practiceSetId: practice.id,
        score: payload.grade!.score,
        correctCount: payload.grade!.correctCount,
        totalCount: payload.grade!.totalCount,
        createdAt: new Date().toISOString(),
      }, ...current]);
      setRequestState({ status: "idle" });
    } catch {
      setRequestState({ status: "error", message: "答案暂时无法提交，请稍后重试。" });
    }
  }

  const resetAttempt = () => {
    setAnswers({});
    setGrade(null);
    setRequestState({ status: "idle" });
  };

  return (
    <section className="mt-12 border-t border-[#173b35]/15 pt-10" aria-labelledby="practice-heading">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-[#b24c34] uppercase">Práctica objetiva</p>
          <h2 id="practice-heading" className="mt-2 font-[family-name:var(--font-serif)] text-3xl font-semibold">生成练习</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#60776f]">DeepSeek 根据原文和学习页出题；题型仅包含选择题和短填空，各 4 道。提交后只做忽略大小写和音标的字符串检验，不调用 AI 批改。</p>
        </div>
        <button type="button" onClick={generatePractice} disabled={requestState.status === "loading"} className="rounded-full bg-[#d65c3d] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
          {requestState.status === "loading" ? "处理中…" : practice ? "重新生成练习" : "生成练习"}
        </button>
      </div>

      {requestState.status === "error" && (
        <div className="mt-5">
          <DeepSeekErrorNotice
            message={requestState.message}
            code={requestState.code}
            manageStorageHref={requestState.manageStorageHref}
          />
        </div>
      )}

      {practice && (
        <form onSubmit={submit} className="mt-8 space-y-5">
          {practice.questions.map((question, index) => {
            const itemGrade = grade?.items.find((item) => item.questionId === question.id);
            return (
              <fieldset key={question.id} className="rounded-2xl border border-[#173b35]/10 bg-white/75 p-5 sm:p-6">
                <legend className="px-2 font-semibold"><span className="mr-2 text-[#b24c34]">{String(index + 1).padStart(2, "0")}</span>{question.prompt}</legend>
                {question.type === "multiple_choice" ? (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {question.options.map((option) => (
                      <label key={option.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#173b35]/10 p-3 text-sm">
                        <input type="radio" name={question.id} value={option.id} required disabled={Boolean(grade)} checked={answers[question.id] === option.id} onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))} />
                        <span><strong className="mr-2">{option.id}.</strong>{option.text}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4">
                    <input lang="es" type="text" required maxLength={60} disabled={Boolean(grade)} value={answers[question.id] ?? ""} onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))} className="w-full max-w-md rounded-xl border border-[#173b35]/15 bg-[#fffdf8] px-4 py-3 outline-none focus:border-[#b24c34]" />
                    {question.hintZh && <p className="mt-2 text-xs text-[#71867f]">提示：{question.hintZh}</p>}
                  </div>
                )}
                {itemGrade && (
                  <div className={`mt-4 rounded-xl p-4 text-sm ${itemGrade.correct ? "bg-[#e2efe9] text-[#315f52]" : "bg-[#f8e5de] text-[#923f2c]"}`}>
                    <p className="font-semibold">{itemGrade.correct ? "回答正确" : `回答错误 · 正确答案：${itemGrade.correctAnswer}`}</p>
                    <p className="mt-1 leading-6">{itemGrade.explanationZh}</p>
                  </div>
                )}
              </fieldset>
            );
          })}
          {grade ? (
            <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-[#173b35] p-5 text-white">
              <strong className="text-2xl">{grade.score} 分</strong>
              <span className="text-sm text-[#d4dfdb]">答对 {grade.correctCount} / {grade.totalCount}</span>
              <button type="button" onClick={resetAttempt} className="ml-auto rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#173b35]">再次练习</button>
            </div>
          ) : (
            <button type="submit" disabled={requestState.status === "loading"} className="rounded-full bg-[#173b35] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">提交并批改</button>
          )}
          <p className="text-xs leading-6 text-[#71867f]">可以再次练习；每次得分都会保存为长期学习记录。</p>
        </form>
      )}

      {attempts.length > 0 && (
        <section className="mt-10 rounded-2xl border border-[#173b35]/10 bg-white/60 p-6">
          <h3 className="font-[family-name:var(--font-serif)] text-2xl font-semibold">答题记录</h3>
          <ul className="mt-4 divide-y divide-[#173b35]/10">
            {attempts.map((attempt) => (
              <li key={attempt.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                <time dateTime={attempt.createdAt} className="text-[#60776f]">{new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(attempt.createdAt))}</time>
                <strong>{attempt.score} 分 · {attempt.correctCount}/{attempt.totalCount}</strong>
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  );
}
