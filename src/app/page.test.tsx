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

import Home from "./page";

describe("home page", () => {
  beforeEach(() => {
    getCurrentInviteUserMock.mockResolvedValue(null);
    createAdminClientMock.mockReturnValue(null);
  });

  it("presents a real public reading path instead of a fabricated demo plan", async () => {
    const html = renderToStaticMarkup(await Home());

    expect(html).toContain("从一页西语开始");
    expect(html).toContain("推荐阅读路径");
    expect(html).toContain("Un Jardín en el Congo");
    expect(html).toContain('href="/lecturas/un-jardin-en-el-congo"');
    expect(html).toContain("登录后同步真实进度");
    expect(html).not.toContain("本地演示计划");
    expect(html).not.toContain("33%");
    expect(html).toContain('href="/crear-material"');
    expect(html).not.toContain("口语训练");
    expect(html).not.toContain("听力训练");
  });

  it("derives completion and next readings from the signed-in user's stored progress", async () => {
    const query = { select: vi.fn(), eq: vi.fn() };
    query.select.mockReturnValue(query);
    query.eq.mockResolvedValue({
      data: [
        { reading_slug: "un-jardin-en-el-congo", completed: true },
        { reading_slug: "la-gallina-de-los-huevos-de-oro", completed: true },
        { reading_slug: "la-lechera", completed: false },
      ],
      error: null,
    });
    getCurrentInviteUserMock.mockResolvedValue({ id: "user-1", label: "Learner" });
    createAdminClientMock.mockReturnValue({ from: vi.fn(() => query) });

    const html = renderToStaticMarkup(await Home());

    expect(html).toContain("依据真实学习进度");
    expect(html).toContain("8%");
    expect(html).toContain("已完成 2 / 24 篇");
    expect(html).toContain("El cuervo y el zorro");
    expect(html).not.toContain("Un Jardín en el Congo</p>");
  });

  it("shows account controls instead of a login link to a signed-in user", async () => {
    getCurrentInviteUserMock.mockResolvedValue({ id: "user-1", label: "Learner" });

    const html = renderToStaticMarkup(await Home());

    expect(html).toContain("Learner");
    expect(html).toContain("退出");
    expect(html).not.toContain('href="/login"');
  });

  it("does not present zero progress as personal data when the progress read fails", async () => {
    const query = { select: vi.fn(), eq: vi.fn() };
    query.select.mockReturnValue(query);
    query.eq.mockResolvedValue({ data: null, error: { message: "database unavailable" } });
    getCurrentInviteUserMock.mockResolvedValue({ id: "user-1", label: "Learner" });
    createAdminClientMock.mockReturnValue({ from: vi.fn(() => query) });

    const html = renderToStaticMarkup(await Home());

    expect(html).toContain("学习进度暂时无法读取");
    expect(html).not.toContain("已完成 0 / 24 篇");
  });
});
