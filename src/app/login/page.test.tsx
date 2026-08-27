import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { getCurrentInviteUserMock, redirectMock } = vi.hoisted(() => ({
  getCurrentInviteUserMock: vi.fn(),
  redirectMock: vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  }),
}));

vi.mock("@/lib/auth/invite-session", () => ({
  getCurrentInviteUser: getCurrentInviteUserMock,
  isInviteSessionConfigured: () => true,
}));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

import LoginPage from "./page";

describe("invite-only login page", () => {
  beforeEach(() => {
    getCurrentInviteUserMock.mockResolvedValue(null);
    redirectMock.mockClear();
  });

  it("offers invite-code access without email, password, or recovery", async () => {
    const page = await LoginPage({ searchParams: Promise.resolve({}) });
    const html = renderToStaticMarkup(page);

    expect(html).toContain("仅限受邀用户");
    expect(html).toContain("邀请码");
    expect(html).toContain('name="inviteCode"');
    expect(html).not.toContain('type="email"');
    expect(html).not.toContain('type="password"');
    expect(html).not.toContain("忘记密码");
  });

  it("redirects an already signed-in user instead of asking for another invite code", async () => {
    getCurrentInviteUserMock.mockResolvedValue({ id: "user-1", label: "Learner" });

    await expect(LoginPage({ searchParams: Promise.resolve({}) })).rejects.toThrow("NEXT_REDIRECT");

    expect(redirectMock).toHaveBeenCalledWith("/lecturas");
  });
});
