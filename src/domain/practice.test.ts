import { describe, expect, it } from "vitest";

import { gradePractice, normalizeSpanishAnswer, type PracticeAnswerKey } from "./practice";

describe("normalizeSpanishAnswer", () => {
  it.each([
    ["ÁRBOL", "arbol"],
    ["  pingüino  ", "pinguino"],
    ["AÑO", "ano"],
    ["por   la mañana", "por la manana"],
  ])("normalizes %s for accent-insensitive, case-insensitive comparison", (input, expected) => {
    expect(normalizeSpanishAnswer(input)).toBe(expected);
  });
});

describe("gradePractice", () => {
  const answerKey: PracticeAnswerKey[] = [
    {
      questionId: "choice-1",
      type: "multiple_choice",
      correctOptionId: "B",
      correctAnswer: "la plaza",
      explanationZh: "原文说明她观察广场。",
    },
    {
      questionId: "blank-1",
      type: "fill_blank",
      acceptedAnswers: ["después", "despues"],
      correctAnswer: "después",
      explanationZh: "这里需要表示先后顺序的副词。",
    },
  ];

  it("grades choices and short blanks deterministically without semantic guessing", () => {
    const result = gradePractice(answerKey, {
      "choice-1": "b",
      "blank-1": " DESPUÉS ",
    });

    expect(result).toEqual({
      score: 100,
      correctCount: 2,
      totalCount: 2,
      items: [
        {
          questionId: "choice-1",
          submittedAnswer: "b",
          correct: true,
          correctAnswer: "la plaza",
          explanationZh: "原文说明她观察广场。",
        },
        {
          questionId: "blank-1",
          submittedAnswer: " DESPUÉS ",
          correct: true,
          correctAnswer: "después",
          explanationZh: "这里需要表示先后顺序的副词。",
        },
      ],
    });
  });

  it("marks a different normalized string as incorrect and still returns the answer", () => {
    const result = gradePractice(answerKey, {
      "choice-1": "A",
      "blank-1": "antes",
    });

    expect(result.score).toBe(0);
    expect(result.items.map((item) => item.correct)).toEqual([false, false]);
    expect(result.items.map((item) => item.correctAnswer)).toEqual(["la plaza", "después"]);
  });
});
