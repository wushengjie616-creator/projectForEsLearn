export type ReadingPlanSource = {
  slug: string;
  title: string;
  level: "A1" | "A2" | "B1" | "B2";
  minutes: number;
};

export type RecommendedReadingPlan = {
  tasks: Array<ReadingPlanSource & { completed: boolean; href: string }>;
  completedCount: number;
  totalCount: number;
  progress: number;
  nextMinutes: number;
  allCompleted: boolean;
};

export function createRecommendedReadingPlan(
  materials: ReadingPlanSource[],
  completedSlugs: Iterable<string>,
  taskLimit = 3,
): RecommendedReadingPlan {
  const levelOrder: Record<ReadingPlanSource["level"], number> = {
    A1: 0,
    A2: 1,
    B1: 2,
    B2: 3,
  };
  const ordered = materials
    .map((material, index) => ({ material, index }))
    .sort((left, right) =>
      levelOrder[left.material.level] - levelOrder[right.material.level] || left.index - right.index,
    )
    .map(({ material }) => material);
  const librarySlugs = new Set(ordered.map((material) => material.slug));
  const completed = new Set(
    Array.from(completedSlugs).filter((slug) => librarySlugs.has(slug)),
  );
  const completedCount = completed.size;
  const totalCount = ordered.length;
  const allCompleted = totalCount > 0 && completedCount === totalCount;
  const limit = Math.max(0, Math.floor(taskLimit));
  const selected = allCompleted
    ? ordered.slice(Math.max(0, ordered.length - limit))
    : ordered.filter((material) => !completed.has(material.slug)).slice(0, limit);
  const tasks = selected.map((material) => ({
    ...material,
    completed: completed.has(material.slug),
    href: `/lecturas/${material.slug}`,
  }));

  return {
    tasks,
    completedCount,
    totalCount,
    progress: totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100),
    nextMinutes: tasks.reduce((total, task) => total + task.minutes, 0),
    allCompleted,
  };
}
