import { describe, expect, it, vi } from "vitest";

import type { StoredCustomMaterial } from "@/domain/custom-learning";

import { generatePracticeWithDeepSeek } from "./generate-practice";

const storedMaterial = {
  id: "material-1",
  sourceText: "Cada mañana, Lucía abre la ventana. Después prepara café.",
  targetLevel: "A2",
  focus: "balanced",
  createdAt: "2026-08-27T00:00:00.000Z",
  material: {
    titleEs: "La mañana de Lucía",
    titleZh: "露西亚的早晨",
    detectedLevel: "A2",
    summaryZh: "文章描述露西亚的早晨。",
    difficultyRationaleZh: "高频现在时。",
    focusPoints: ["现在时", "日常活动"],
    paragraphGuides: [{ translationZh: "每天早晨。", languageNoteZh: "现在时。" }],
    vocabulary: [
      { word: "mañana", lemma: "mañana", partOfSpeech: "名词", meaningZh: "早晨" },
      { word: "abre", lemma: "abrir", partOfSpeech: "动词", meaningZh: "打开" },
      { word: "ventana", lemma: "ventana", partOfSpeech: "名词", meaningZh: "窗户" },
      { word: "prepara", lemma: "preparar", partOfSpeech: "动词", meaningZh: "准备" },
      { word: "café", lemma: "café", partOfSpeech: "名词", meaningZh: "咖啡" },
    ],
    grammarPoints: [{ title: "现在时", explanationZh: "表示习惯。", example: "Lucía abre." }],
    questions: [
      { prompt: "¿Qué abre Lucía?", answer: "La ventana." },
      { prompt: "¿Qué prepara?", answer: "Café." },
    ],
    writingPromptZh: "描述你的早晨。",
    studySteps: ["阅读", "复习", "练习"],
  },
} satisfies StoredCustomMaterial;

const generated = {
  questions: [
    ...Array.from({ length: 4 }, (_, index) => ({
      id: `choice-${index + 1}`,
      type: "multiple_choice",
      prompt: `选择题 ${index + 1}`,
      options: [
        { id: "A", text: "la puerta" },
        { id: "B", text: "la ventana" },
        { id: "C", text: "el libro" },
        { id: "D", text: "la mesa" },
      ],
      correctOptionId: "B",
      explanationZh: "原文出现 la ventana。",
    })),
    ...Array.from({ length: 4 }, (_, index) => ({
      id: `blank-${index + 1}`,
      type: "fill_blank",
      prompt: `Lucía ___ la ventana ${index + 1}.`,
      hintZh: "填写一个动词。",
      acceptedAnswers: ["abre"],
      explanationZh: "原文使用 abre。",
    })),
  ],
};

describe("generatePracticeWithDeepSeek", () => {
  it("creates four choices and four short blanks while keeping answer keys server-side", async () => {
    const fetchImpl = vi.fn(async (_input: string | URL | Request, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body));
      expect(body.thinking).toEqual({ type: "disabled" });
      expect(body.response_format).toEqual({ type: "json_object" });
      const submitted = JSON.parse(body.messages[1].content.split("\n").slice(1).join("\n"));
      expect(submitted.sourceText).toBe(storedMaterial.sourceText);
      expect(submitted.learningMaterial.detectedLevel).toBe("A2");
      return new Response(
        JSON.stringify({ choices: [{ message: { content: JSON.stringify(generated) } }] }),
      );
    });

    const result = await generatePracticeWithDeepSeek(storedMaterial, {
      apiKey: "secret",
      userId: "user-1",
      fetchImpl,
    });

    expect(result.questions).toHaveLength(8);
    expect(result.answerKey).toHaveLength(8);
    expect(result.questions.filter((item) => item.type === "multiple_choice")).toHaveLength(4);
    expect(result.questions.filter((item) => item.type === "fill_blank")).toHaveLength(4);
    expect(JSON.stringify(result.questions)).not.toContain("correctOptionId");
    expect(JSON.stringify(result.questions)).not.toContain("acceptedAnswers");
    expect(result.answerKey[0]).toMatchObject({ questionId: "choice-1", correctOptionId: "B" });
    expect(result.answerKey[4]).toMatchObject({ questionId: "blank-1", acceptedAnswers: ["abre"] });
  });

  it("accepts safe provider IDs containing uppercase letters and underscores", async () => {
    const providerOutput = {
      questions: generated.questions.map((question, index) => ({
        ...question,
        id: index < 4 ? `MC_${index + 1}` : `FILL_${index - 3}`,
      })),
    };
    const fetchImpl = vi.fn(async () =>
      new Response(
        JSON.stringify({ choices: [{ message: { content: JSON.stringify(providerOutput) } }] }),
      ),
    );

    const result = await generatePracticeWithDeepSeek(storedMaterial, {
      apiKey: "secret",
      userId: "user-1",
      fetchImpl,
    });

    expect(result.questions.map((question) => question.id)).toEqual([
      "MC_1",
      "MC_2",
      "MC_3",
      "MC_4",
      "FILL_1",
      "FILL_2",
      "FILL_3",
      "FILL_4",
    ]);
  });

  it("rejects a generated set with the wrong objective-question mix", async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify({ questions: generated.questions.slice(0, 4) }) } }] })),
    );

    await expect(generatePracticeWithDeepSeek(storedMaterial, {
      apiKey: "secret",
      userId: "user-1",
      fetchImpl,
    })).rejects.toThrow("Invalid DeepSeek response");
  });

  it("rejects unsafe provider IDs", async () => {
    const invalid = {
      questions: generated.questions.map((question, index) =>
        index === 0 ? { ...question, id: "__proto__" } : question,
      ),
    };
    const fetchImpl = vi.fn(async () =>
      new Response(
        JSON.stringify({ choices: [{ message: { content: JSON.stringify(invalid) } }] }),
      ),
    );

    await expect(
      generatePracticeWithDeepSeek(storedMaterial, {
        apiKey: "secret",
        userId: "user-1",
        fetchImpl,
      }),
    ).rejects.toThrow("Invalid DeepSeek response");
  });

  it("rejects a fill question containing more than one blank", async () => {
    const invalid = {
      questions: generated.questions.map((question, index) =>
        index === 4 ? { ...question, prompt: "Lucía ___ la ventana y ___ café." } : question,
      ),
    };
    const fetchImpl = vi.fn(async () =>
      new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify(invalid) } }] })),
    );

    await expect(generatePracticeWithDeepSeek(storedMaterial, {
      apiKey: "secret",
      userId: "user-1",
      fetchImpl,
    })).rejects.toThrow("Invalid DeepSeek response");
  });

  it("preserves the provider status when the account balance is exhausted", async () => {
    const fetchImpl = vi.fn(async () => new Response(null, { status: 402 }));

    await expect(generatePracticeWithDeepSeek(storedMaterial, {
      apiKey: "secret",
      userId: "user-1",
      fetchImpl,
    })).rejects.toMatchObject({ name: "DeepSeekHttpError", status: 402 });
  });
});
