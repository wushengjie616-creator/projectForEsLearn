import { getReadingBySlug } from "@/content/readings";

export type ReadingProgressInput = {
  readingSlug: string;
  draft: string;
  intent: "save" | "complete" | "reopen";
  expectedUpdatedAt: string;
};

type RawReadingProgress = {
  readingSlug: unknown;
  draft: unknown;
  intent: unknown;
  expectedUpdatedAt: unknown;
};

export function parseReadingProgress(raw: RawReadingProgress): ReadingProgressInput {
  if (typeof raw.readingSlug !== "string" || !getReadingBySlug(raw.readingSlug)) {
    throw new Error("未知阅读材料");
  }
  if (typeof raw.draft !== "string") throw new Error("草稿格式无效");
  if (raw.draft.length > 10_000) throw new Error("草稿不能超过 10000 个字符");
  if (raw.intent !== "save" && raw.intent !== "complete" && raw.intent !== "reopen") {
    throw new Error("保存操作无效");
  }
  if (
    typeof raw.expectedUpdatedAt !== "string" ||
    (raw.expectedUpdatedAt !== "" &&
      (raw.expectedUpdatedAt.length > 64 || Number.isNaN(Date.parse(raw.expectedUpdatedAt))))
  ) {
    throw new Error("进度版本无效");
  }

  return {
    readingSlug: raw.readingSlug,
    draft: raw.draft,
    intent: raw.intent,
    expectedUpdatedAt: raw.expectedUpdatedAt,
  };
}

export function resolveReadingProgressCompletion(
  intent: ReadingProgressInput["intent"],
  currentCompleted: boolean,
): boolean {
  if (intent === "complete") return true;
  if (intent === "reopen") return false;
  return currentCompleted;
}
