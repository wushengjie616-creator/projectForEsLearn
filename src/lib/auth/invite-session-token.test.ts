import { describe, expect, it } from "vitest";

import { hashInviteCode, type InviteUser } from "./invite-code";
import { createInviteSessionToken, verifyInviteSessionToken } from "./invite-session-token";

const secret = "test-only-session-secret-with-32-characters";
const user: InviteUser = {
  id: "0f80e217-f84b-4a85-b530-7db3889b6649",
  label: "测试学习者",
  codeHash: hashInviteCode("ES-A1B2-C3D4-E5F6-7890-ABCD-EF12"),
  active: true,
};

describe("invite session token", () => {
  it("round-trips an active user's signed session", () => {
    const token = createInviteSessionToken(user.id, secret, {
      now: 1_000,
      ttlMs: 60_000,
    });

    expect(verifyInviteSessionToken(token, secret, [user], 30_000)).toEqual(user);
  });

  it("rejects tampering, expiration, and a deactivated user", () => {
    const token = createInviteSessionToken(user.id, secret, {
      now: 1_000,
      ttlMs: 60_000,
    });
    const tampered = `${token.slice(0, -1)}${token.endsWith("a") ? "b" : "a"}`;

    expect(verifyInviteSessionToken(tampered, secret, [user], 30_000)).toBeNull();
    expect(verifyInviteSessionToken(token, secret, [user], 61_001)).toBeNull();
    expect(verifyInviteSessionToken(token, secret, [{ ...user, active: false }], 30_000)).toBeNull();
  });

  it("refuses a weak signing secret", () => {
    expect(() => createInviteSessionToken(user.id, "too-short")).toThrow(
      "INVITE_SESSION_SECRET must be at least 32 characters",
    );
  });
});
