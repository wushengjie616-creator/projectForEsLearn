import { describe, expect, it } from "vitest";

import {
  DEFAULT_USER_STORAGE_LIMIT_BYTES,
  estimateStorageBytes,
  isStorageCapacityError,
  resolveUserStorageLimitBytes,
} from "./storage-policy";

describe("storage policy", () => {
  it("uses a conservative 10 MiB per-user default and accepts a positive override", () => {
    expect(DEFAULT_USER_STORAGE_LIMIT_BYTES).toBe(10 * 1024 * 1024);
    expect(resolveUserStorageLimitBytes(undefined)).toBe(DEFAULT_USER_STORAGE_LIMIT_BYTES);
    expect(resolveUserStorageLimitBytes("2097152")).toBe(2 * 1024 * 1024);
    expect(resolveUserStorageLimitBytes("invalid")).toBe(DEFAULT_USER_STORAGE_LIMIT_BYTES);
  });

  it("estimates UTF-8 bytes rather than JavaScript character count", () => {
    expect(estimateStorageBytes("á", { word: "mañana" })).toBeGreaterThan(
      "á".length + JSON.stringify({ word: "mañana" }).length,
    );
  });

  it.each([
    [{ code: "53100", message: "disk full" }, true],
    [{ code: "PGRST000", message: "Database quota exceeded" }, true],
    [{ code: "23505", message: "duplicate key" }, false],
  ])("recognizes database-capacity failures %#", (error, expected) => {
    expect(isStorageCapacityError(error)).toBe(expected);
  });
});
