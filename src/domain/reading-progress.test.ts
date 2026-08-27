import { describe, expect, it } from "vitest";

import { parseReadingProgress, resolveReadingProgressCompletion } from "./reading-progress";

describe("reading progress input", () => {
  it("parses an explicit completion command with its expected version", () => {
    expect(parseReadingProgress({
      readingSlug: "la-lechera",
      draft: "Primero venderé la leche.",
      intent: "complete",
      expectedUpdatedAt: "2026-08-27T07:00:00.000Z",
    })).toEqual({
      readingSlug: "la-lechera",
      draft: "Primero venderé la leche.",
      intent: "complete",
      expectedUpdatedAt: "2026-08-27T07:00:00.000Z",
    });
  });

  it("rejects unknown readings and oversized drafts", () => {
    expect(() => parseReadingProgress({ readingSlug: "inventado", draft: "", intent: "save", expectedUpdatedAt: "" })).toThrow("未知阅读材料");
    expect(() => parseReadingProgress({ readingSlug: "la-lechera", draft: "x".repeat(10_001), intent: "save", expectedUpdatedAt: "" })).toThrow("草稿不能超过 10000 个字符");
  });

  it("rejects unknown commands and malformed versions", () => {
    expect(() => parseReadingProgress({ readingSlug: "la-lechera", draft: "", intent: "delete", expectedUpdatedAt: "" })).toThrow("保存操作无效");
    expect(() => parseReadingProgress({ readingSlug: "la-lechera", draft: "", intent: "save", expectedUpdatedAt: "yesterday" })).toThrow("进度版本无效");
  });

  it("preserves completion when saving and changes it only on explicit commands", () => {
    expect(resolveReadingProgressCompletion("save", true)).toBe(true);
    expect(resolveReadingProgressCompletion("save", false)).toBe(false);
    expect(resolveReadingProgressCompletion("complete", false)).toBe(true);
    expect(resolveReadingProgressCompletion("reopen", true)).toBe(false);
  });
});
