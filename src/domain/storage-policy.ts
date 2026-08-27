export const DEFAULT_USER_STORAGE_LIMIT_BYTES = 10 * 1024 * 1024;

export function resolveUserStorageLimitBytes(value: string | undefined): number {
  if (!value) return DEFAULT_USER_STORAGE_LIMIT_BYTES;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0
    ? parsed
    : DEFAULT_USER_STORAGE_LIMIT_BYTES;
}

export function estimateStorageBytes(...values: unknown[]): number {
  const encoder = new TextEncoder();
  return values.reduce<number>((total, value) => {
    if (value === undefined) return total;
    const serialized = typeof value === "string" ? value : JSON.stringify(value);
    return total + encoder.encode(serialized ?? "").byteLength;
  }, 0);
}

export function isStorageCapacityError(
  error: { code?: string; message?: string } | null,
): boolean {
  if (!error) return false;
  if (error.code === "53100") return true;
  return /disk\s*full|quota\s*(?:is\s*)?exceed|storage\s*(?:is\s*)?(?:full|limit)/iu.test(
    error.message ?? "",
  );
}
