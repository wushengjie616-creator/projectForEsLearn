import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { ReadingProgressRepository } from "@/domain/save-reading-progress";

const isConflict = (code: string | undefined) => code === "23505";

export function createReadingProgressRepository(
  supabase: SupabaseClient,
): ReadingProgressRepository {
  return {
    async read(userId, readingSlug) {
      const { data, error } = await supabase
        .from("reading_progress")
        .select("draft,completed,updated_at")
        .eq("user_id", userId)
        .eq("reading_slug", readingSlug)
        .maybeSingle();
      if (error) return { status: "error" };
      return {
        status: "ok",
        value: data
          ? {
              draft: data.draft,
              completed: data.completed,
              updatedAt: data.updated_at,
            }
          : null,
      };
    },

    async create(userId, input) {
      const { error } = await supabase.from("reading_progress").insert({
        user_id: userId,
        reading_slug: input.readingSlug,
        draft: input.draft,
        completed: input.completed,
        updated_at: input.updatedAt,
      });
      if (!error) return "saved";
      return isConflict(error.code) ? "conflict" : "error";
    },

    async updateIfVersion(userId, input) {
      const { data, error } = await supabase
        .from("reading_progress")
        .update({
          draft: input.draft,
          completed: input.completed,
          updated_at: input.updatedAt,
        })
        .eq("user_id", userId)
        .eq("reading_slug", input.readingSlug)
        .eq("updated_at", input.expectedUpdatedAt)
        .select("updated_at")
        .maybeSingle();
      if (error) return "error";
      return data ? "saved" : "conflict";
    },
  };
}
