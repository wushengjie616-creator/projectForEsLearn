import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { PracticeWorkshop } from "./practice-workshop";

describe("PracticeWorkshop", () => {
  it("offers persisted objective practice generation without an existing set", () => {
    const html = renderToStaticMarkup(
      <PracticeWorkshop materialId="material-1" initialPractice={null} initialAttempts={[]} />,
    );

    expect(html).toContain("生成练习");
    expect(html).toContain("选择题和短填空");
    expect(html).not.toContain("简答题");
  });

  it("renders a saved set and long-term attempt history", () => {
    const html = renderToStaticMarkup(
      <PracticeWorkshop
        materialId="material-1"
        initialPractice={{
          id: "set-1",
          materialId: "material-1",
          createdAt: "2026-08-27T00:00:00.000Z",
          questions: [
            {
              id: "choice-1",
              type: "multiple_choice",
              prompt: "¿Qué abre Lucía?",
              options: [
                { id: "A", text: "la puerta" },
                { id: "B", text: "la ventana" },
                { id: "C", text: "el libro" },
                { id: "D", text: "la mesa" },
              ],
            },
            { id: "blank-1", type: "fill_blank", prompt: "Lucía ___ la ventana.", hintZh: "动词" },
          ],
        }}
        initialAttempts={[{
          id: "attempt-1",
          practiceSetId: "set-1",
          score: 50,
          correctCount: 1,
          totalCount: 2,
          createdAt: "2026-08-27T01:00:00.000Z",
        }]}
      />,
    );

    expect(html).toContain("¿Qué abre Lucía?");
    expect(html).toContain("Lucía ___ la ventana.");
    expect(html).toContain("50 分");
    expect(html).toContain("再次练习");
  });
});
