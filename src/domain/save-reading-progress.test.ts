import { describe, expect, it, vi } from "vitest";

import type { ReadingProgressInput } from "./reading-progress";
import { persistReadingProgress, type ReadingProgressRepository } from "./save-reading-progress";

const command = (overrides: Partial<ReadingProgressInput> = {}): ReadingProgressInput => ({
  readingSlug: "la-lechera",
  draft: "Mi borrador",
  intent: "save",
  expectedUpdatedAt: "2026-08-27T07:00:00.000Z",
  ...overrides,
});

function repository(overrides: Partial<ReadingProgressRepository> = {}): ReadingProgressRepository {
  return {
    read: vi.fn(async () => ({
      status: "ok" as const,
      value: { draft: "Anterior", completed: true, updatedAt: "2026-08-27T07:00:00.000Z" },
    })),
    create: vi.fn(async () => "saved" as const),
    updateIfVersion: vi.fn(async () => "saved" as const),
    ...overrides,
  };
}

describe("persistReadingProgress", () => {
  it("preserves a completed reading when only the draft is saved", async () => {
    const store = repository();

    await expect(
      persistReadingProgress(command(), "user-1", store, () => new Date("2026-08-27T08:00:00.000Z")),
    ).resolves.toBe("saved");
    expect(store.updateIfVersion).toHaveBeenCalledWith("user-1", {
      readingSlug: "la-lechera",
      draft: "Mi borrador",
      completed: true,
      expectedUpdatedAt: "2026-08-27T07:00:00.000Z",
      updatedAt: "2026-08-27T08:00:00.000Z",
    });
    expect(store.create).not.toHaveBeenCalled();
  });

  it("rejects a stale browser version without writing", async () => {
    const store = repository();

    await expect(
      persistReadingProgress(command({ expectedUpdatedAt: "2026-08-27T06:00:00.000Z" }), "user-1", store),
    ).resolves.toBe("conflict");
    expect(store.updateIfVersion).not.toHaveBeenCalled();
    expect(store.create).not.toHaveBeenCalled();
  });

  it("blocks writes when the current progress cannot be read", async () => {
    const store = repository({ read: vi.fn(async () => ({ status: "error" as const })) });

    await expect(persistReadingProgress(command(), "user-1", store)).resolves.toBe("unavailable");
    expect(store.updateIfVersion).not.toHaveBeenCalled();
    expect(store.create).not.toHaveBeenCalled();
  });

  it("creates a new row and applies an explicit completion command", async () => {
    const store = repository({
      read: vi.fn(async () => ({ status: "ok" as const, value: null })),
    });

    await expect(
      persistReadingProgress(
        command({ intent: "complete", expectedUpdatedAt: "" }),
        "user-1",
        store,
        () => new Date("2026-08-27T08:00:00.000Z"),
      ),
    ).resolves.toBe("saved");
    expect(store.create).toHaveBeenCalledWith("user-1", {
      readingSlug: "la-lechera",
      draft: "Mi borrador",
      completed: true,
      updatedAt: "2026-08-27T08:00:00.000Z",
    });
  });

  it("reports a conflict if another write wins after the read", async () => {
    const store = repository({ updateIfVersion: vi.fn(async () => "conflict" as const) });

    await expect(persistReadingProgress(command(), "user-1", store)).resolves.toBe("conflict");
  });

  it("always advances the version even when the clock equals the stored millisecond", async () => {
    const store = repository();

    await persistReadingProgress(
      command(),
      "user-1",
      store,
      () => new Date("2026-08-27T07:00:00.000Z"),
    );

    expect(store.updateIfVersion).toHaveBeenCalledWith(
      "user-1",
      expect.objectContaining({ updatedAt: "2026-08-27T07:00:00.001Z" }),
    );
  });
});
