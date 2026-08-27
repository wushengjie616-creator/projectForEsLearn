export type MultipleChoiceAnswerKey = {
  questionId: string;
  type: "multiple_choice";
  correctOptionId: string;
  correctAnswer: string;
  explanationZh: string;
};

export type FillBlankAnswerKey = {
  questionId: string;
  type: "fill_blank";
  acceptedAnswers: string[];
  correctAnswer: string;
  explanationZh: string;
};

export type PracticeAnswerKey = MultipleChoiceAnswerKey | FillBlankAnswerKey;

export type MultipleChoiceQuestion = {
  id: string;
  type: "multiple_choice";
  prompt: string;
  options: Array<{ id: string; text: string }>;
};

export type FillBlankQuestion = {
  id: string;
  type: "fill_blank";
  prompt: string;
  hintZh?: string;
};

export type PracticeQuestion = MultipleChoiceQuestion | FillBlankQuestion;

export type PracticeGradeItem = {
  questionId: string;
  submittedAnswer: string;
  correct: boolean;
  correctAnswer: string;
  explanationZh: string;
};

export type PracticeGrade = {
  score: number;
  correctCount: number;
  totalCount: number;
  items: PracticeGradeItem[];
};

export function normalizeSpanishAnswer(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}+/gu, "")
    .toLocaleLowerCase("en-US")
    .trim()
    .replace(/\s+/gu, " ");
}

export function gradePractice(
  answerKey: PracticeAnswerKey[],
  answers: Record<string, string>,
): PracticeGrade {
  const items = answerKey.map((key): PracticeGradeItem => {
    const submittedAnswer = answers[key.questionId] ?? "";
    const correct = key.type === "multiple_choice"
      ? submittedAnswer.trim().toUpperCase() === key.correctOptionId.trim().toUpperCase()
      : key.acceptedAnswers.some(
          (answer) => normalizeSpanishAnswer(submittedAnswer) === normalizeSpanishAnswer(answer),
        );
    return {
      questionId: key.questionId,
      submittedAnswer,
      correct,
      correctAnswer: key.correctAnswer,
      explanationZh: key.explanationZh,
    };
  });
  const correctCount = items.filter((item) => item.correct).length;
  const totalCount = items.length;
  return {
    score: totalCount === 0 ? 0 : Math.round((correctCount / totalCount) * 100),
    correctCount,
    totalCount,
    items,
  };
}
