import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { createAdminClientMock, getCurrentInviteUserMock } = vi.hoisted(() => ({
  createAdminClientMock: vi.fn(),
  getCurrentInviteUserMock: vi.fn(),
}));

vi.mock("@/lib/auth/invite-session", () => ({
  getCurrentInviteUser: getCurrentInviteUserMock,
}));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: createAdminClientMock,
}));

import ReadingPage, { generateStaticParams } from "./page";

describe("reading detail page", () => {
  beforeEach(() => {
    getCurrentInviteUserMock.mockResolvedValue(null);
    createAdminClientMock.mockReturnValue(null);
  });

  it("statically exposes every stored reading route", () => {
    expect(generateStaticParams()).toEqual([
      { slug: "la-gallina-de-los-huevos-de-oro" },
      { slug: "el-cuervo-y-el-zorro" },
      { slug: "la-lechera" },
      { slug: "el-leon-y-el-raton" },
      { slug: "los-dos-amigos-y-el-oso" },
      { slug: "la-zorra-y-la-gallina" },
      { slug: "gobierno-de-la-alhambra" },
      { slug: "tradiciones-locales" },
      { slug: "la-casa-del-gallo" },
      { slug: "la-quimica-en-la-vida-cotidiana" },
      { slug: "modelos-teorias-y-leyes-cientificas" },
      { slug: "procesos-espontaneos-y-no-espontaneos" },
      { slug: "el-pacto-verde-europeo" },
      { slug: "proteccion-del-medio-ambiente-e-innovacion" },
      { slug: "como-funciona-la-politica-agricola-de-la-ue" },
      { slug: "la-ia-y-el-significado-de-la-literatura" },
      { slug: "la-abeja-haragana" },
      { slug: "movimiento-y-fuerza" },
      { slug: "la-dieta-saludable" },
      { slug: "las-comidas-del-dia" },
      { slug: "los-alimentos-y-las-estaciones" },
      { slug: "alimentacion-y-patrimonio-inmaterial" },
      { slug: "trampas-para-peces-de-brewarrina" },
      { slug: "un-jardin-en-el-congo" },
    ]);
  });

  it("renders the required OpenStax digital attribution", async () => {
    const page = await ReadingPage({
      params: Promise.resolve({ slug: "la-quimica-en-la-vida-cotidiana" }),
    });
    const html = renderToStaticMarkup(page);

    expect(html).toContain("Acceso gratuito en https://openstax.org/books/");
    expect(html).toContain("CC BY 4.0");
  });

  it("renders the UNESCO derivative-work notice", async () => {
    const page = await ReadingPage({
      params: Promise.resolve({ slug: "la-ia-y-el-significado-de-la-literatura" }),
    });
    const html = renderToStaticMarkup(page);

    expect(html).toContain("CC BY-SA 3.0 IGO");
    expect(html).toContain("no es una publicación oficial de la UNESCO");
  });

  it("renders the UNESCO Courier attribution and derivative-work notice", async () => {
    const page = await ReadingPage({
      params: Promise.resolve({ slug: "alimentacion-y-patrimonio-inmaterial" }),
    });
    const html = renderToStaticMarkup(page);

    expect(html).toContain("El Correo de la UNESCO");
    expect(html).toContain("Lucia Iglesias Kuntz");
    expect(html).toContain("CC BY-SA 3.0 IGO");
    expect(html).toContain("no es una publicación oficial de la UNESCO");
  });

  it("renders Global Voices author, translator, and CC attribution", async () => {
    const page = await ReadingPage({
      params: Promise.resolve({ slug: "trampas-para-peces-de-brewarrina" }),
    });
    const html = renderToStaticMarkup(page);

    expect(html).toContain("Global Voices en Español");
    expect(html).toContain("Kevin Rennie");
    expect(html).toContain("Antonella Clara Difalco");
    expect(html).toContain("CC BY 3.0");
  });

  it("renders African Storybook author, translator, and CC attribution", async () => {
    const page = await ReadingPage({
      params: Promise.resolve({ slug: "un-jardin-en-el-congo" }),
    });
    const html = renderToStaticMarkup(page);

    expect(html).toContain("African Storybook");
    expect(html).toContain("Christelle X");
    expect(html).toContain("Mila Uzzi");
    expect(html).toContain("CC BY 4.0");
  });

  it("renders translator attribution for a translated public-domain reading", async () => {
    const page = await ReadingPage({
      params: Promise.resolve({ slug: "la-casa-del-gallo" }),
    });
    const html = renderToStaticMarkup(page);

    expect(html).toContain("Washington Irving");
    expect(html).toContain("Luis Lamarca");
    expect(html).toContain("Project Gutenberg");
  });

  it("renders translation and learning tools for a reading", async () => {
    const page = await ReadingPage({
      params: Promise.resolve({ slug: "la-gallina-de-los-huevos-de-oro" }),
    });
    const html = renderToStaticMarkup(page);

    expect(html).toContain("La gallina de los huevos de oro");
    expect(html).toContain("展开中文学习译文");
    expect(html).toContain("从前有一只母鸡");
    expect(html).toContain("重点词汇");
    expect(html).toContain("点击任意西语单词查看 AI 释义");
    expect(html).toContain("data-spanish-word");
    expect(html).toContain("阅读理解");
    expect(html).toContain("写作练习");
    expect(html).toContain("CC BY-SA 4.0");
    expect(html).toContain("并非来源站官方译文");
  });

  it("renders an article-specific difficulty rationale", async () => {
    const page = await ReadingPage({
      params: Promise.resolve({ slug: "un-jardin-en-el-congo" }),
    });
    const html = renderToStaticMarkup(page);

    expect(html).toContain("难度说明");
    expect(html).toContain("A1 · 入门短句");
    expect(html).toContain("预计 8 分钟");
    expect(html).toContain("家与菜园");
    expect(html).toContain("重点词汇（14 项）");
  });

  it("preserves an existing completion state and offers an explicit reopen command", async () => {
    const query = {
      select: vi.fn(),
      eq: vi.fn(),
      maybeSingle: vi.fn(async () => ({
        data: {
          draft: "Texto guardado",
          completed: true,
          updated_at: "2026-08-27T07:00:00.000Z",
        },
        error: null,
      })),
    };
    query.select.mockReturnValue(query);
    query.eq.mockReturnValue(query);
    getCurrentInviteUserMock.mockResolvedValue({ id: "user-1", label: "Learner" });
    createAdminClientMock.mockReturnValue({ from: vi.fn(() => query) });

    const html = renderToStaticMarkup(await ReadingPage({
      params: Promise.resolve({ slug: "la-lechera" }),
    }));

    expect(html).toContain('name="expectedUpdatedAt" value="2026-08-27T07:00:00.000Z"');
    expect(html).toMatch(/<button[^>]*value="save"[^>]*name="intent"/u);
    expect(html).toMatch(/<button[^>]*value="reopen"[^>]*name="intent"/u);
    expect(html).toContain("取消完成");
    expect(html).not.toContain('name="completed"');
  });

  it("blocks editing when stored progress cannot be read", async () => {
    const query = {
      select: vi.fn(),
      eq: vi.fn(),
      maybeSingle: vi.fn(async () => ({ data: null, error: { message: "database unavailable" } })),
    };
    query.select.mockReturnValue(query);
    query.eq.mockReturnValue(query);
    getCurrentInviteUserMock.mockResolvedValue({ id: "user-1", label: "Learner" });
    createAdminClientMock.mockReturnValue({ from: vi.fn(() => query) });

    const html = renderToStaticMarkup(await ReadingPage({
      params: Promise.resolve({ slug: "la-lechera" }),
    }));

    expect(html).toContain("为避免覆盖已有草稿，编辑和保存已暂停");
    expect(html).toMatch(/<textarea[^>]*disabled=""/u);
    expect(html).not.toMatch(/<button[^>]*value="save"[^>]*name="intent"/u);
  });

  it("allows a retry when the previous save failed but the latest read succeeds", async () => {
    const query = {
      select: vi.fn(),
      eq: vi.fn(),
      maybeSingle: vi.fn(async () => ({ data: null, error: null })),
    };
    query.select.mockReturnValue(query);
    query.eq.mockReturnValue(query);
    getCurrentInviteUserMock.mockResolvedValue({ id: "user-1", label: "Learner" });
    createAdminClientMock.mockReturnValue({ from: vi.fn(() => query) });

    const html = renderToStaticMarkup(await ReadingPage({
      params: Promise.resolve({ slug: "la-lechera" }),
      searchParams: Promise.resolve({ progressError: "1" }),
    }));

    expect(html).toContain("上次保存未成功，当前已重新加载远端进度");
    expect(html).toMatch(/<button[^>]*value="save"[^>]*name="intent"/u);
    expect(html).not.toMatch(/<textarea[^>]*disabled=""/u);
  });
});
