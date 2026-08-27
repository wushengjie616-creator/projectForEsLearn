import type { ReadingProgressInput } from "./reading-progress";
import { resolveReadingProgressCompletion } from "./reading-progress";

export type StoredReadingProgress = {
  draft: string;
  completed: boolean;
  updatedAt: string;
};

export type ReadingProgressRepository = {
  read: (
    userId: string,
    readingSlug: string,
  ) => Promise<{ status: "ok"; value: StoredReadingProgress | null } | { status: "error" }>;
  create: (
    userId: string,
    input: { readingSlug: string; draft: string; completed: boolean; updatedAt: string },
  ) => Promise<"saved" | "conflict" | "error">;
  updateIfVersion: (
    userId: string,
    input: { readingSlug: string; draft: string; completed: boolean; updatedAt: string; expectedUpdatedAt: string },
  ) => Promise<"saved" | "conflict" | "error">;
};

export type SaveReadingProgressResult = "saved" | "conflict" | "unavailable";

export async function persistReadingProgress(
  command: ReadingProgressInput,
  userId: string,
  repository: ReadingProgressRepository,
  now: () => Date = () => new Date(),
): Promise<SaveReadingProgressResult> {
  const currentResult = await repository.read(userId, command.readingSlug);
  if (currentResult.status === "error") return "unavailable";

  const current = currentResult.value;
  if ((current?.updatedAt ?? "") !== command.expectedUpdatedAt) return "conflict";
  const nowMilliseconds = now().getTime();
  const updatedAt = new Date(
    current
      ? Math.max(nowMilliseconds, Date.parse(current.updatedAt) + 1)
      : nowMilliseconds,
  ).toISOString();

  const update = {
    readingSlug: command.readingSlug,
    draft: command.draft,
    completed: resolveReadingProgressCompletion(command.intent, current?.completed ?? false),
    updatedAt,
  };

  const result = current
    ? await repository.updateIfVersion(userId, {
        ...update,
        expectedUpdatedAt: current.updatedAt,
      })
    : await repository.create(userId, update);

  return result === "error" ? "unavailable" : result;
}
