import { describe, expect, it } from "vitest";

import { createRecommendedReadingPlan } from "./learning-plan";

const materials = [
  { slug: "b2-text", title: "Texto B2", level: "B2" as const, minutes: 20 },
  { slug: "a2-first", title: "Primer A2", level: "A2" as const, minutes: 8 },
  { slug: "a1-text", title: "Texto A1", level: "A1" as const, minutes: 6 },
  { slug: "a2-second", title: "Segundo A2", level: "A2" as const, minutes: 12 },
];

describe("recommended reading plan", () => {
  it("uses real completed slugs and recommends the next level-ordered readings", () => {
    const plan = createRecommendedReadingPlan(materials, ["a1-text", "not-in-library"], 2);

    expect(plan).toEqual({
      tasks: [
        {
          slug: "a2-first",
          title: "Primer A2",
          level: "A2",
          minutes: 8,
          completed: false,
          href: "/lecturas/a2-first",
        },
        {
          slug: "a2-second",
          title: "Segundo A2",
          level: "A2",
          minutes: 12,
          completed: false,
          href: "/lecturas/a2-second",
        },
      ],
      completedCount: 1,
      totalCount: 4,
      progress: 25,
      nextMinutes: 20,
      allCompleted: false,
    });
  });

  it("shows a completed review list when the entire library is finished", () => {
    const plan = createRecommendedReadingPlan(materials, materials.map((item) => item.slug), 2);

    expect(plan.progress).toBe(100);
    expect(plan.completedCount).toBe(4);
    expect(plan.allCompleted).toBe(true);
    expect(plan.tasks.map((task) => task.slug)).toEqual(["a2-second", "b2-text"]);
    expect(plan.tasks.every((task) => task.completed)).toBe(true);
    expect(plan.nextMinutes).toBe(32);
  });
});
