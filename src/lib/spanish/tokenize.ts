export type SpanishTextToken = {
  text: string;
  isWord: boolean;
  start: number;
};

const SPANISH_WORD = /[\p{Script=Latin}\p{M}]+(?:['’\-][\p{Script=Latin}\p{M}]+)*/gu;

export function tokenizeSpanish(text: string): SpanishTextToken[] {
  const tokens: SpanishTextToken[] = [];
  let cursor = 0;

  for (const match of text.matchAll(SPANISH_WORD)) {
    const start = match.index;
    if (start > cursor) {
      tokens.push({ text: text.slice(cursor, start), isWord: false, start: cursor });
    }
    tokens.push({ text: match[0], isWord: true, start });
    cursor = start + match[0].length;
  }

  if (cursor < text.length) {
    tokens.push({ text: text.slice(cursor), isWord: false, start: cursor });
  }

  return tokens;
}

export function getContextWindow(
  text: string,
  wordStart: number,
  wordLength: number,
  maxLength = 600,
): string {
  if (text.length <= maxLength) return text;

  const safeWordStart = Math.max(0, Math.min(wordStart, text.length));
  const safeWordEnd = Math.min(text.length, safeWordStart + Math.max(0, wordLength));
  const remaining = Math.max(0, maxLength - (safeWordEnd - safeWordStart));
  let start = Math.max(0, safeWordStart - Math.floor(remaining / 2));
  const end = Math.min(text.length, start + maxLength);
  start = Math.max(0, end - maxLength);

  return text.slice(start, end);
}
