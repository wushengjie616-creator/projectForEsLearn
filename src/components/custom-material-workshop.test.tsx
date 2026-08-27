import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { GeneratedLearningMaterial } from "@/lib/deepseek/generate-material";

import { CustomMaterialWorkshop, GeneratedMaterialView } from "./custom-material-workshop";

const material: GeneratedLearningMaterial = {
  titleEs: "Una tarde tranquila",
  titleZh: "宁静的下午",
  detectedLevel: "A2",
  summaryZh: "一段关于下午日常活动的短文。",
  difficultyRationaleZh: "以高频现在时和日常词汇为主。",
  focusPoints: ["现在时", "日常活动"],
  paragraphGuides: [
    { translationZh: "玛丽亚在花园里读书。", languageNoteZh: "lee 是 leer 的现在时变位。" },
  ],
  vocabulary: [
    { word: "lee", lemma: "leer", partOfSpeech: "动词", meaningZh: "阅读" },
    { word: "jardín", lemma: "jardín", partOfSpeech: "名词", meaningZh: "花园" },
    { word: "tranquila", lemma: "tranquilo", partOfSpeech: "形容词", meaningZh: "宁静的" },
    { word: "tarde", lemma: "tarde", partOfSpeech: "名词", meaningZh: "下午" },
    { word: "libro", lemma: "libro", partOfSpeech: "名词", meaningZh: "书" },
  ],
  grammarPoints: [
    { title: "现在时", explanationZh: "用于描述当前或习惯动作。", example: "María lee." },
  ],
  questions: [
    { prompt: "¿Dónde lee María?", answer: "Lee en el jardín." },
    { prompt: "¿Qué hace María?", answer: "Lee un libro." },
  ],
  writingPromptZh: "用西班牙语描述你的一个安静下午。",
  studySteps: ["先通读", "核对词汇", "完成写作"],
};

describe("CustomMaterialWorkshop", () => {
  it("renders text/file input, personalization controls, and privacy acknowledgement", () => {
    const html = renderToStaticMarkup(<CustomMaterialWorkshop isAuthenticated />);

    expect(html).toContain("粘贴西班牙语短文");
    expect(html).toContain('accept=".txt,text/plain"');
    expect(html).toContain("目标等级");
    expect(html).toContain("学习重点");
    expect(html).toContain("我确认将短文发送给 DeepSeek");
    expect(html).toContain("生成个性化学习材料");
  });

  it("keeps unauthenticated visitors from submitting paid generation requests", () => {
    const html = renderToStaticMarkup(<CustomMaterialWorkshop isAuthenticated={false} />);

    expect(html).toContain("登录受邀账号后使用");
    expect(html).not.toContain("生成个性化学习材料</button>");
  });
});

describe("GeneratedMaterialView", () => {
  it("renders the source and every product learning section", () => {
    const html = renderToStaticMarkup(
      <GeneratedMaterialView sourceText="María lee un libro en el jardín." material={material} />,
    );

    expect(html).toContain("María");
    expect(html).toContain("宁静的下午");
    expect(html).toContain("难度说明");
    expect(html).toContain("逐段精读");
    expect(html).toContain("重点词汇");
    expect(html).toContain("语法观察");
    expect(html).toContain("阅读理解");
    expect(html).toContain("写作练习");
    expect(html).toContain("建议学习步骤");
    expect(html).toContain("AI 生成内容可能有误");
  });

  it("identifies a persisted material and links to its reusable page", () => {
    const html = renderToStaticMarkup(
      <GeneratedMaterialView
        sourceText="María lee un libro en el jardín."
        material={material}
        materialId="material-1"
      />,
    );

    expect(html).toContain("已保存到你的学习材料");
    expect(html).toContain('href="/mis-materiales/material-1"');
    expect(html).not.toContain("刷新页面后会消失");
  });
});
