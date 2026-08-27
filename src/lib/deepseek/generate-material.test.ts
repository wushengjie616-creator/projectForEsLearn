import { describe, expect, it, vi } from "vitest";

import {
  generateLearningMaterialWithDeepSeek,
  handleCustomMaterialRequest,
} from "./generate-material";

const spanishText = [
  "Cada mañana, Lucía abre la ventana y observa la plaza de su barrio.",
  "Después prepara café, escribe unas líneas y comienza su jornada con calma.",
].join("\n\n");

const validRequest = {
  text: spanishText,
  targetLevel: "A2" as const,
  focus: "balanced" as const,
  acknowledgedExternalProcessing: true,
};

const validMaterial = {
  titleEs: "La mañana de Lucía",
  titleZh: "露西亚的早晨",
  detectedLevel: "A2",
  summaryZh: "文章描述露西亚平静的早晨习惯。",
  difficultyRationaleZh: "使用高频现在时动词和日常生活词汇。",
  focusPoints: ["现在时", "日常活动", "时间顺序"],
  paragraphGuides: [
    { translationZh: "每天早晨，露西亚打开窗户，观察街区广场。", languageNoteZh: "观察并列动词。" },
    { translationZh: "之后她准备咖啡、写几行字，平静地开始一天的工作。", languageNoteZh: "después 表示顺序。" },
  ],
  vocabulary: [
    { word: "mañana", lemma: "mañana", partOfSpeech: "名词", meaningZh: "早晨", meaningEn: "morning" },
    { word: "abre", lemma: "abrir", partOfSpeech: "动词", meaningZh: "打开" },
    { word: "observa", lemma: "observar", partOfSpeech: "动词", meaningZh: "观察" },
    { word: "barrio", lemma: "barrio", partOfSpeech: "名词", meaningZh: "街区" },
    { word: "jornada", lemma: "jornada", partOfSpeech: "名词", meaningZh: "一天的工作" },
  ],
  grammarPoints: [
    { title: "陈述式现在时", explanationZh: "描述习惯性动作。", example: "Lucía abre la ventana." },
  ],
  questions: [
    { prompt: "¿Qué observa Lucía?", answer: "Observa la plaza de su barrio." },
    { prompt: "¿Cómo comienza su jornada?", answer: "La comienza con calma." },
  ],
  writingPromptZh: "用 4–6 句西班牙语描述你的早晨。",
  studySteps: ["先通读原文", "核对重点词汇", "回答理解题"],
};

const request = (body: unknown) =>
  new Request("http://localhost/api/generate-material", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

const successfulDeepSeekFetch = vi.fn(async () =>
  new Response(
    JSON.stringify({ choices: [{ message: { content: JSON.stringify(validMaterial) } }] }),
  ),
);

describe("handleCustomMaterialRequest", () => {
  it("rejects an unauthenticated upload before contacting DeepSeek", async () => {
    const fetchImpl = vi.fn();
    const response = await handleCustomMaterialRequest(request(validRequest), {
      userId: null,
      apiKey: "secret",
      fetchImpl,
    });

    expect(response.status).toBe(401);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("requires explicit acknowledgement before sending user text externally", async () => {
    const fetchImpl = vi.fn();
    const response = await handleCustomMaterialRequest(
      request({ ...validRequest, acknowledgedExternalProcessing: false }),
      { userId: "user-1", apiKey: "secret", fetchImpl },
    );

    expect(response.status).toBe(400);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it.each([
    [{ ...validRequest, text: "Demasiado corto." }, 400],
    [{ ...validRequest, text: "a".repeat(6001) }, 400],
    [{ ...validRequest, targetLevel: "C2" }, 400],
    [{ ...validRequest, focus: "speaking" }, 400],
  ])("rejects invalid generation input %#", async (body, status) => {
    const fetchImpl = vi.fn();
    const response = await handleCustomMaterialRequest(request(body), {
      userId: "user-1",
      apiKey: "secret",
      fetchImpl,
    });

    expect(response.status).toBe(status);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("requires a server-side API key", async () => {
    const response = await handleCustomMaterialRequest(request(validRequest), {
      userId: "user-1",
      apiKey: undefined,
      fetchImpl: vi.fn(),
    });

    expect(response.status).toBe(503);
  });

  it("enforces the injected generation rate limit", async () => {
    const fetchImpl = vi.fn();
    const response = await handleCustomMaterialRequest(request(validRequest), {
      userId: "user-1",
      apiKey: "secret",
      fetchImpl,
      consumeRateLimit: () => false,
    });

    expect(response.status).toBe(429);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("persists the generated snapshot for the signed-in user before reporting success", async () => {
    const saveMaterial = vi.fn(async () => ({ status: "saved" as const, id: "material-1" }));

    const response = await handleCustomMaterialRequest(request(validRequest), {
      userId: "user-1",
      apiKey: "secret",
      fetchImpl: successfulDeepSeekFetch,
      saveMaterial,
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ materialId: "material-1", material: validMaterial });
    expect(saveMaterial).toHaveBeenCalledWith("user-1", validRequest, validMaterial);
  });

  it("returns a cleanup route when the generated snapshot cannot fit in storage", async () => {
    const response = await handleCustomMaterialRequest(request(validRequest), {
      userId: "user-1",
      apiKey: "secret",
      fetchImpl: successfulDeepSeekFetch,
      saveMaterial: async () => ({ status: "storage_full" as const }),
    });

    expect(response.status).toBe(507);
    expect(await response.json()).toMatchObject({
      code: "storage_full",
      manageStorageHref: "/mis-datos",
    });
  });

  it("distinguishes provider balance exhaustion from a generic generation failure", async () => {
    const response = await handleCustomMaterialRequest(request(validRequest), {
      userId: "user-1",
      apiKey: "secret",
      fetchImpl: vi.fn(async () => new Response(null, { status: 402 })),
      saveMaterial: async () => ({ status: "error" as const }),
    });

    expect(response.status).toBe(402);
    expect(await response.json()).toMatchObject({
      code: "deepseek_insufficient_balance",
      rechargeUrl: "https://platform.deepseek.com/top_up",
    });
  });
});

describe("generateLearningMaterialWithDeepSeek", () => {
  it("uses JSON mode and returns a validated product-shaped learning material", async () => {
    const fetchImpl = vi.fn(async (_input: string | URL | Request, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body));
      expect(init?.headers).toMatchObject({ Authorization: "Bearer secret" });
      expect(body.model).toBe("deepseek-v4-flash");
      expect(body.response_format).toEqual({ type: "json_object" });
      expect(body.thinking).toEqual({ type: "disabled" });
      expect(body.user_id).toBe("user-1");
      expect(body.messages[0].content).not.toContain(spanishText);
      const submittedData = JSON.parse(body.messages[1].content.split("\n").slice(1).join("\n"));
      expect(submittedData.sourceText).toBe(spanishText);
      expect(submittedData.paragraphCount).toBe(2);
      expect(submittedData.targetLevel).toBe("A2");
      expect(submittedData.focus).toBe("balanced");
      return new Response(
        JSON.stringify({ choices: [{ message: { content: JSON.stringify(validMaterial) } }] }),
        { status: 200 },
      );
    });

    const result = await generateLearningMaterialWithDeepSeek(validRequest, {
      apiKey: "secret",
      userId: "user-1",
      fetchImpl,
    });

    expect(result).toEqual(validMaterial);
  });

  it("rejects a result that omits a source paragraph explanation", async () => {
    const incomplete = { ...validMaterial, paragraphGuides: validMaterial.paragraphGuides.slice(0, 1) };
    const fetchImpl = vi.fn(async () =>
      new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify(incomplete) } }] })),
    );

    await expect(
      generateLearningMaterialWithDeepSeek(validRequest, {
        apiKey: "secret",
        userId: "user-1",
        fetchImpl,
      }),
    ).rejects.toThrow("Invalid DeepSeek response");
  });
});
