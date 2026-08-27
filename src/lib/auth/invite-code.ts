import { createHash, timingSafeEqual } from "node:crypto";

export type InviteUser = {
  id: string;
  label: string;
  codeHash: string;
  active: boolean;
};

type InviteRegistryDocument = {
  version: number;
  users: unknown;
};

export type InviteRegistrySources = {
  environmentRegistry?: string;
  privateFileRegistry?: string;
  bundledRegistry: InviteRegistryDocument;
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;
const HASH_PATTERN = /^[0-9a-f]{64}$/u;

export function normalizeInviteCode(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const compact = value.trim().toUpperCase().replace(/[\s-]+/gu, "");
  if (!/^ES[0-9A-F]{24}$/u.test(compact)) return null;
  const payload = compact.slice(2);
  return `ES-${payload.match(/.{4}/gu)!.join("-")}`;
}

export function hashInviteCode(code: string): string {
  const normalized = normalizeInviteCode(code);
  if (!normalized) throw new Error("Invalid invite code format");
  return createHash("sha256").update(normalized, "utf8").digest("hex");
}

export function validateInviteUsers(value: unknown): InviteUser[] {
  if (!Array.isArray(value)) throw new Error("Invite registry users must be an array");
  const ids = new Set<string>();
  const hashes = new Set<string>();
  return value.map((candidate) => {
    if (!candidate || typeof candidate !== "object") throw new Error("Invalid invite user");
    const user = candidate as Partial<InviteUser>;
    if (
      typeof user.id !== "string" ||
      !UUID_PATTERN.test(user.id) ||
      typeof user.label !== "string" ||
      user.label.trim().length < 1 ||
      user.label.length > 60 ||
      typeof user.codeHash !== "string" ||
      !HASH_PATTERN.test(user.codeHash) ||
      typeof user.active !== "boolean"
    ) {
      throw new Error("Invalid invite user");
    }
    if (ids.has(user.id) || hashes.has(user.codeHash)) {
      throw new Error("Duplicate invite user id or code hash");
    }
    ids.add(user.id);
    hashes.add(user.codeHash);
    return user as InviteUser;
  });
}

export function resolveInviteUsers({
  environmentRegistry,
  privateFileRegistry,
  bundledRegistry,
}: InviteRegistrySources): InviteUser[] {
  const serialized = environmentRegistry?.trim() || privateFileRegistry?.trim();
  let selected: unknown = bundledRegistry;

  if (serialized) {
    try {
      selected = JSON.parse(serialized);
    } catch {
      throw new Error("Invalid invite registry JSON");
    }
  }

  if (!selected || typeof selected !== "object") {
    throw new Error("Invalid invite registry JSON");
  }
  const registry = selected as Partial<InviteRegistryDocument>;
  if (registry.version !== 1) throw new Error("Unsupported invite registry version");
  return validateInviteUsers(registry.users);
}

export function findInviteUser(code: unknown, users: readonly InviteUser[]): InviteUser | null {
  const normalized = normalizeInviteCode(code);
  if (!normalized) return null;
  const submitted = Buffer.from(hashInviteCode(normalized), "hex");
  let match: InviteUser | null = null;
  for (const user of users) {
    const expected = Buffer.from(user.codeHash, "hex");
    if (expected.length === submitted.length && timingSafeEqual(expected, submitted) && user.active) {
      match = user;
    }
  }
  return match;
}
