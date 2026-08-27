import "server-only";

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import registry from "@/config/invite-users.json";

import { resolveInviteUsers } from "./invite-code";

const privateRegistryPath = resolve(process.cwd(), ".local", "invite-users.json");
const privateFileRegistry = existsSync(privateRegistryPath)
  ? readFileSync(privateRegistryPath, "utf8")
  : undefined;

export const inviteUsers = resolveInviteUsers({
  environmentRegistry: process.env.INVITE_USERS_JSON,
  privateFileRegistry,
  bundledRegistry: registry,
});

export function hasActiveInviteUsers() {
  return inviteUsers.some((user) => user.active);
}
