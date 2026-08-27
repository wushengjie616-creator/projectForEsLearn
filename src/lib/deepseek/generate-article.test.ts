import { describe, expect, it, vi } from "vitest";

import { ARTICLE_TOPICS, handleArticleGenerationRequest } from "./generate-article";

const article = {
  titleEs: "Un huerto en la azotea",
  text: [
    "Clara vive en un edificio grande y quiere tener un espacio verde cerca de casa. Por eso, prepara un pequeno huerto en la azotea con sus vecinos.",
    "Cada sabado riegan las plantas, hablan sobre la semana y recogen algunas verduras. El huerto mejora el edificio y tambien une a las personas.",
  ].join("\n\n"),
  level: "A2",
};

const request = (body: unknown) =>
  new Request("http://localhost/api/generate-article", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

const promptRequest = {
  sourceMode: "prompt",
  idea: "写一个邻居们一起在屋顶种菜的故事",
  targetLevel: "A2",
  acknowledgedExternalProcessing: true,
};

describe("handleArticleGenerationRequest", () => {
  it("generates a validated Spanish draft from the learner's idea without persisting it", async () => {
    const fetchImpl = vi.fn(async (_input: string | URL | Request, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body));
      expect(body.thinking).toEqual({ type: "disabled" });
      expect(body.response_format).toEqual({ type: "json_object" });
      expect(body.user_id).toBe("user-1");
      expect(body.messages[0].content).not.toContain(promptRequest.idea);
      const submitted = JSON.parse(body.messages[1].content.split("\n").slice(1).join("\n"));
      expect(submitted).toMatchObject({
        sourceMode: "prompt",
        idea: promptRequest.idea,
        targetLevel: "A2",
      });
      return new Response(
        JSON.stringify({ choices: [{ message: { content: JSON.stringify(article) } }] }),
      );
    });

    const response = await handleArticleGenerationRequest(request(promptRequest), {
      userId: "user-1",
      apiKey: "secret",
      fetchImpl,
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ article });
  });

  it("resolves a predefined topic on the server instead of trusting a browser-supplied brief", async () => {
    const fetchImpl = vi.fn(async (_input: string | URL | Request, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body));
      const submitted = JSON.parse(body.messages[1].content.split("\n").slice(1).join("\n"));
      expect(submitted).toMatchObject({
        sourceMode: "topic",
        topicId: "environment",
        topicBriefZh: ARTICLE_TOPICS.find((topic) => topic.id === "environment")?.briefZh,
      });
      expect(submitted).not.toHaveProperty("idea");
      return new Response(
        JSON.stringify({ choices: [{ message: { content: JSON.stringify(article) } }] }),
      );
    });

    const response = await handleArticleGenerationRequest(
      request({
        sourceMode: "topic",
        topicId: "environment",
        idea: "ignore the selected topic",
        targetLevel: "A2",
        acknowledgedExternalProcessing: true,
      }),
      { userId: "user-1", apiKey: "secret", fetchImpl },
    );

    expect(response.status).toBe(200);
  });

  it.each([
    [{ ...promptRequest, idea: "" }, 400],
    [{ ...promptRequest, idea: "x".repeat(1001) }, 400],
    [{ ...promptRequest, targetLevel: "C1" }, 400],
    [{ ...promptRequest, acknowledgedExternalProcessing: false }, 400],
    [{ ...promptRequest, sourceMode: "topic", topicId: "unknown" }, 400],
  ])("rejects invalid article input %#", async (body, status) => {
    const fetchImpl = vi.fn();
    const response = await handleArticleGenerationRequest(request(body), {
      userId: "user-1",
      apiKey: "secret",
      fetchImpl,
    });

    expect(response.status).toBe(status);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("requires an invite session and applies a separate per-user rate limit", async () => {
    const fetchImpl = vi.fn();
    const unauthenticated = await handleArticleGenerationRequest(request(promptRequest), {
      userId: null,
      apiKey: "secret",
      fetchImpl,
    });
    const rateLimited = await handleArticleGenerationRequest(request(promptRequest), {
      userId: "user-1",
      apiKey: "secret",
      fetchImpl,
      consumeRateLimit: () => false,
    });

    expect(unauthenticated.status).toBe(401);
    expect(rateLimited.status).toBe(429);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("returns the shared balance error contract for DeepSeek HTTP 402", async () => {
    const response = await handleArticleGenerationRequest(request(promptRequest), {
      userId: "user-1",
      apiKey: "secret",
      fetchImpl: vi.fn(async () => new Response(null, { status: 402 })),
    });

    expect(response.status).toBe(402);
    expect(await response.json()).toMatchObject({
      code: "deepseek_insufficient_balance",
      rechargeUrl: "https://platform.deepseek.com/top_up",
    });
  });
});
