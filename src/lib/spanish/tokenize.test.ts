import { describe, expect, it } from "vitest";

import { getContextWindow, tokenizeSpanish } from "./tokenize";

describe("tokenizeSpanish", () => {
  it("preserves the source text while identifying accented Spanish words", () => {
    const source = "¿Qué sucedió? ¡Matóla; abrióla! pingüino y veintidós.";
    const tokens = tokenizeSpanish(source);

    expect(tokens.map((token) => token.text).join("")).toBe(source);
    expect(tokens.filter((token) => token.isWord).map((token) => token.text)).toEqual([
      "Qué",
      "sucedió",
      "Matóla",
      "abrióla",
      "pingüino",
      "y",
      "veintidós",
    ]);
  });

  it("keeps apostrophes and hyphens inside Latin-script words", () => {
    const tokens = tokenizeSpanish("d'Artagnan, histórico-cultural");

    expect(tokens.filter((token) => token.isWord).map((token) => token.text)).toEqual([
      "d'Artagnan",
      "histórico-cultural",
    ]);
  });
});

describe("getContextWindow", () => {
  it("returns a bounded excerpt that still contains the selected word", () => {
    const source = `${"inicio ".repeat(100)}palabra ${"final ".repeat(100)}`;
    const wordStart = source.indexOf("palabra");
    const context = getContextWindow(source, wordStart, "palabra".length, 600);

    expect(context.length).toBeLessThanOrEqual(600);
    expect(context).toContain("palabra");
  });
});
