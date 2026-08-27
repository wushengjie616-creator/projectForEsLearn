import "server-only";

import registry from "@/config/invite-users.json";

import { validateInviteUsers } from "./invite-code";

if (registry.version !== 1) throw new Error("Unsupported invite registry version");

export const inviteUsers = validateInviteUsers(registry.users);

export function hasActiveInviteUsers() {
  return inviteUsers.some((user) => user.active);
}
