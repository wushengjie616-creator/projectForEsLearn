import type { CustomMaterialRequest, GeneratedLearningMaterial } from "@/lib/deepseek/generate-material";

import type { PracticeAnswerKey, PracticeGrade, PracticeQuestion } from "./practice";

export type StoredCustomMaterial = {
  id: string;
  sourceText: string;
  targetLevel: CustomMaterialRequest["targetLevel"];
  focus: CustomMaterialRequest["focus"];
  material: GeneratedLearningMaterial;
  createdAt: string;
};

export type StoredPracticeSet = {
  id: string;
  materialId: string;
  questions: PracticeQuestion[];
  createdAt: string;
};

export type PracticeSetForGrading = StoredPracticeSet & {
  answerKey: PracticeAnswerKey[];
};

export type PracticeAttemptSummary = {
  id: string;
  practiceSetId: string;
  score: number;
  correctCount: number;
  totalCount: number;
  createdAt: string;
};

export type StoredPracticeAttempt = PracticeAttemptSummary & {
  answers: Record<string, string>;
  results: PracticeGrade;
};

export type UserStorageSummary = {
  materialCount: number;
  practiceSetCount: number;
  attemptCount: number;
  usedBytes: number;
  limitBytes: number;
};

export type SaveResult =
  | { status: "saved"; id: string }
  | { status: "storage_full" }
  | { status: "error" };
