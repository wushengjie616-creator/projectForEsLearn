import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  PracticeAttemptSummary,
  PracticeSetForGrading,
  SaveResult,
  StoredCustomMaterial,
  StoredPracticeSet,
  UserStorageSummary,
} from "@/domain/custom-learning";
import type { PracticeAnswerKey, PracticeGrade, PracticeQuestion } from "@/domain/practice";
import {
  estimateStorageBytes,
  isStorageCapacityError,
  resolveUserStorageLimitBytes,
} from "@/domain/storage-policy";
import type { CustomMaterialRequest, GeneratedLearningMaterial } from "@/lib/deepseek/generate-material";

type StoredBytesRow = { storage_bytes: number };

function sumBytes(rows: StoredBytesRow[] | null) {
  return (rows ?? []).reduce((total, row) => total + Number(row.storage_bytes), 0);
}

export function createCustomLearningRepository(supabase: SupabaseClient) {
  const limitBytes = resolveUserStorageLimitBytes(process.env.USER_STORAGE_LIMIT_BYTES);

  async function getStorageSummary(userId: string): Promise<UserStorageSummary | null> {
    const [materials, sets, attempts] = await Promise.all([
      supabase.from("custom_learning_materials").select("storage_bytes").eq("user_id", userId),
      supabase.from("practice_sets").select("storage_bytes").eq("user_id", userId),
      supabase.from("practice_attempts").select("storage_bytes").eq("user_id", userId),
    ]);
    if (materials.error || sets.error || attempts.error) return null;
    return {
      materialCount: materials.data?.length ?? 0,
      practiceSetCount: sets.data?.length ?? 0,
      attemptCount: attempts.data?.length ?? 0,
      usedBytes: sumBytes(materials.data) + sumBytes(sets.data) + sumBytes(attempts.data),
      limitBytes,
    };
  }

  async function hasSpace(userId: string, requestedBytes: number) {
    const summary = await getStorageSummary(userId);
    return summary ? summary.usedBytes + requestedBytes <= summary.limitBytes : null;
  }

  return {
    getStorageSummary,

    async saveMaterial(
      userId: string,
      input: CustomMaterialRequest,
      material: GeneratedLearningMaterial,
    ): Promise<SaveResult> {
      const storageBytes = estimateStorageBytes(input.text, input.targetLevel, input.focus, material);
      const spaceAvailable = await hasSpace(userId, storageBytes);
      if (spaceAvailable === false) return { status: "storage_full" };
      if (spaceAvailable === null) return { status: "error" };
      const { data, error } = await supabase
        .from("custom_learning_materials")
        .insert({
          user_id: userId,
          source_text: input.text,
          target_level: input.targetLevel,
          focus: input.focus,
          material,
          storage_bytes: storageBytes,
        })
        .select("id")
        .single();
      if (error) {
        return { status: isStorageCapacityError(error) ? "storage_full" : "error" };
      }
      return { status: "saved", id: data.id };
    },

    async listMaterials(userId: string): Promise<StoredCustomMaterial[] | null> {
      const { data, error } = await supabase
        .from("custom_learning_materials")
        .select("id,source_text,target_level,focus,material,created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) return null;
      return (data ?? []).map((row) => ({
        id: row.id,
        sourceText: row.source_text,
        targetLevel: row.target_level,
        focus: row.focus,
        material: row.material,
        createdAt: row.created_at,
      })) as StoredCustomMaterial[];
    },

    async getMaterial(userId: string, materialId: string): Promise<StoredCustomMaterial | null> {
      const { data, error } = await supabase
        .from("custom_learning_materials")
        .select("id,source_text,target_level,focus,material,created_at")
        .eq("user_id", userId)
        .eq("id", materialId)
        .maybeSingle();
      if (error || !data) return null;
      return {
        id: data.id,
        sourceText: data.source_text,
        targetLevel: data.target_level,
        focus: data.focus,
        material: data.material,
        createdAt: data.created_at,
      } as StoredCustomMaterial;
    },

    async savePracticeSet(
      userId: string,
      materialId: string,
      questions: PracticeQuestion[],
      answerKey: PracticeAnswerKey[],
    ): Promise<SaveResult> {
      const storageBytes = estimateStorageBytes(questions, answerKey);
      const spaceAvailable = await hasSpace(userId, storageBytes);
      if (spaceAvailable === false) return { status: "storage_full" };
      if (spaceAvailable === null) return { status: "error" };
      const { data, error } = await supabase
        .from("practice_sets")
        .insert({
          user_id: userId,
          material_id: materialId,
          questions,
          answer_key: answerKey,
          storage_bytes: storageBytes,
        })
        .select("id")
        .single();
      if (error) return { status: isStorageCapacityError(error) ? "storage_full" : "error" };
      return { status: "saved", id: data.id };
    },

    async getLatestPracticeSet(userId: string, materialId: string): Promise<StoredPracticeSet | null> {
      const { data, error } = await supabase
        .from("practice_sets")
        .select("id,material_id,questions,created_at")
        .eq("user_id", userId)
        .eq("material_id", materialId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error || !data) return null;
      return {
        id: data.id,
        materialId: data.material_id,
        questions: data.questions as PracticeQuestion[],
        createdAt: data.created_at,
      };
    },

    async getPracticeSetForGrading(
      userId: string,
      practiceSetId: string,
    ): Promise<PracticeSetForGrading | null> {
      const { data, error } = await supabase
        .from("practice_sets")
        .select("id,material_id,questions,answer_key,created_at")
        .eq("user_id", userId)
        .eq("id", practiceSetId)
        .maybeSingle();
      if (error || !data) return null;
      return {
        id: data.id,
        materialId: data.material_id,
        questions: data.questions as PracticeQuestion[],
        answerKey: data.answer_key as PracticeAnswerKey[],
        createdAt: data.created_at,
      };
    },

    async saveAttempt(
      userId: string,
      practiceSetId: string,
      answers: Record<string, string>,
      grade: PracticeGrade,
    ): Promise<SaveResult> {
      const storageBytes = estimateStorageBytes(answers, grade);
      const spaceAvailable = await hasSpace(userId, storageBytes);
      if (spaceAvailable === false) return { status: "storage_full" };
      if (spaceAvailable === null) return { status: "error" };
      const { data, error } = await supabase
        .from("practice_attempts")
        .insert({
          user_id: userId,
          practice_set_id: practiceSetId,
          answers,
          results: grade,
          score: grade.score,
          correct_count: grade.correctCount,
          total_count: grade.totalCount,
          storage_bytes: storageBytes,
        })
        .select("id")
        .single();
      if (error) return { status: isStorageCapacityError(error) ? "storage_full" : "error" };
      return { status: "saved", id: data.id };
    },

    async listAttemptsForMaterial(
      userId: string,
      materialId: string,
    ): Promise<PracticeAttemptSummary[] | null> {
      const sets = await supabase
        .from("practice_sets")
        .select("id")
        .eq("user_id", userId)
        .eq("material_id", materialId);
      if (sets.error) return null;
      const setIds = (sets.data ?? []).map((row) => row.id);
      if (setIds.length === 0) return [];
      const { data, error } = await supabase
        .from("practice_attempts")
        .select("id,practice_set_id,score,correct_count,total_count,created_at")
        .eq("user_id", userId)
        .in("practice_set_id", setIds)
        .order("created_at", { ascending: false });
      if (error) return null;
      return (data ?? []).map((row) => ({
        id: row.id,
        practiceSetId: row.practice_set_id,
        score: row.score,
        correctCount: row.correct_count,
        totalCount: row.total_count,
        createdAt: row.created_at,
      }));
    },

    async deleteAllAttempts(userId: string) {
      const { error } = await supabase.from("practice_attempts").delete().eq("user_id", userId);
      return !error;
    },

    async deleteMaterial(userId: string, materialId: string) {
      const { error } = await supabase
        .from("custom_learning_materials")
        .delete()
        .eq("user_id", userId)
        .eq("id", materialId);
      return !error;
    },
  };
}
