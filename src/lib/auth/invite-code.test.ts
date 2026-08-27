import { describe, expect, it } from "vitest";

import {
  findInviteUser,
  hashInviteCode,
  normalizeInviteCode,
  resolveInviteUsers,
  type InviteUser,
} from "./invite-code";

const activeUser: InviteUser = {
  id: "0f80e217-f84b-4a85-b530-7db3889b6649",
  label: "测试学习者",
  codeHash: hashInviteCode("ES-A1B2-C3D4-E5F6-7890-ABCD-EF12"),
  active: true,
};

describe("normalizeInviteCode", () => {
  it("accepts a case-insensitive code and restores its canonical separators", () => {
    expect(normalizeInviteCode("  es-a1b2 c3d4-e5f6-7890-abcd-ef12 ")).toBe(
      "ES-A1B2-C3D4-E5F6-7890-ABCD-EF12",
    );
  });

  it.each(["", "ES-1234", "ES-GGGG-C3D4-E5F6-7890-ABCD-EF12", "not-a-code"])(
    "rejects malformed code %s",
    (code) => expect(normalizeInviteCode(code)).toBeNull(),
  );
});

describe("findInviteUser", () => {
  it("returns the active user for a matching code", () => {
    expect(findInviteUser("es-a1b2-c3d4-e5f6-7890-abcd-ef12", [activeUser])).toEqual(
      activeUser,
    );
  });

  it("does not authenticate a wrong or disabled code", () => {
    expect(findInviteUser("ES-FFFF-FFFF-FFFF-FFFF-FFFF-FFFF", [activeUser])).toBeNull();
    expect(findInviteUser("ES-A1B2-C3D4-E5F6-7890-ABCD-EF12", [
      { ...activeUser, active: false },
    ])).toBeNull();
  });
});

describe("resolveInviteUsers", () => {
  const registry = (user: InviteUser) => JSON.stringify({ version: 1, users: [user] });
  const privateUser = { ...activeUser, id: "a19418f1-a62c-40fa-9f5a-bc7e8791c36a", label: "私有文件" };
  const environmentUser = { ...activeUser, id: "7d1283ab-e3bf-47c4-81a3-544cff0e2fc2", label: "生产环境" };

  it("prefers the production environment registry over local and bundled sources", () => {
    expect(resolveInviteUsers({
      environmentRegistry: registry(environmentUser),
      privateFileRegistry: registry(privateUser),
      bundledRegistry: { version: 1, users: [activeUser] },
    })).toEqual([environmentUser]);
  });

  it("uses the ignored private registry when the environment value is blank", () => {
    expect(resolveInviteUsers({
      environmentRegistry: "  ",
      privateFileRegistry: registry(privateUser),
      bundledRegistry: { version: 1, users: [] },
    })).toEqual([privateUser]);
  });

  it("fails closed when the selected private source is malformed", () => {
    expect(() => resolveInviteUsers({
      privateFileRegistry: "not-json",
      bundledRegistry: { version: 1, users: [activeUser] },
    })).toThrow("Invalid invite registry JSON");
  });
});
