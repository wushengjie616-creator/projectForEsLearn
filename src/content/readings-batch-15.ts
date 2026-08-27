import type { ReadingMaterial } from "./readings";

export const readingMaterialsBatch15: ReadingMaterial[] = [
  {
    slug: "trampas-para-peces-de-brewarrina",
    title: "Trampas para peces de Brewarrina en Australia podrían ser la construcción humana más antigua del mundo",
    chineseTitle: "澳大利亚布鲁瓦里纳鱼陷阱或为世界最古老的人类建筑",
    author: "Kevin Rennie",
    translator: "Antonella Clara Difalco",
    level: "B1",
    minutes: 11,
    summary: "认识澳大利亚原住民的古老水产养殖遗址，同时通过 podría、se ha sugerido 与 no se ha verificado 区分醒目标题、推测和已经证实的事实。",
    focus: ["可能性表达", "无人称 se", "地点信息", "证据强度"],
    paragraphs: [
      {
        spanish: "En Australia están dos de los sitios de acuicultura más antiguos del mundo, donde los pueblos indígenas se dedicaron a la cría de peces y anguilas durante miles de años.",
        chinese: "澳大利亚有世界上最古老的两处水产养殖遗址；原住民曾在那里饲养鱼和鳗鱼，延续了数千年。",
      },
      {
        spanish: "Las trampas para peces de Brewarrina están en el río Barwon, en Nueva Gales del Sur, al norte del país. También se las conoce como las trampas para peces de Baiame: Ngunnhu, Nonah o Nyemba. El yacimiento fue incluido en la lista de Lugares del Patrimonio Nacional en 2005.",
        chinese: "布鲁瓦里纳鱼陷阱位于澳大利亚北部新南威尔士州的巴旺河，也被称为 Baiame 鱼陷阱、Ngunnhu、Nonah 或 Nyemba。该遗址于 2005 年列入国家遗产名录。",
      },
      {
        spanish: "Se ha sugerido que estas trampas para peces podrían ser la construcción humana más antigua del mundo, con una antigüedad de miles de años. Incluso hay quienes afirman que tienen 40,000 años. Algunas investigaciones sugieren que podrían tener solo mil años.",
        chinese: "有人提出，这些鱼陷阱可能是世界上最古老的人类建筑，已有数千年历史；甚至有人声称它们有四万年之久，但也有研究认为它们可能只有一千年。原文把这些数字写成相互竞争的说法，而非定论。",
      },
      {
        spanish: "Sin embargo, su antigüedad no se ha verificado científicamente.",
        chinese: "然而，它们的年代尚未得到科学验证。",
      },
      {
        spanish: "Se ha debatido mucho sobre Dark Emu, libro muy vendido de Bruce Pascoe.",
        chinese: "围绕布鲁斯·帕斯科的畅销书《Dark Emu》已经有过许多争论。",
      },
      {
        spanish: "El Museo Cultural Aborigen de Brewarrina es muy popular entre los turistas. En su página de Facebook se registran muchas de sus visitas y se publican numerosos videos de las trampas.",
        chinese: "布鲁瓦里纳原住民文化博物馆很受游客欢迎；它的 Facebook 页面记录了许多参观活动，也发布了不少鱼陷阱视频。本站未复制这些社交媒体内容。",
      },
    ],
    vocabulary: [
      { word: "la acuicultura", meaning: "水产养殖", note: "英语对应 aquaculture" },
      { word: "la anguila", meaning: "鳗鱼" },
      { word: "el yacimiento", meaning: "遗址；矿床", note: "本文指考古/文化遗址" },
      { word: "incluir", meaning: "纳入；包括", note: "fue incluido 是被动语态" },
      { word: "se ha sugerido", meaning: "有人提出；已有观点认为", note: "不说明具体提出者的无人称表达" },
      { word: "podría", meaning: "可能会；可能是", note: "条件式在这里降低断言强度" },
      { word: "afirmar", meaning: "声称；断言" },
      { word: "verificar", meaning: "核实；验证", note: "英语对应 verify" },
      { word: "sin embargo", meaning: "然而" },
      { word: "la antigüedad", meaning: "年代；古老程度", note: "本文讨论遗址究竟有多古老，不等于古董" },
    ],
    questions: [
      { prompt: "¿Dónde están las trampas para peces de Brewarrina?", answer: "Están en el río Barwon, en Nueva Gales del Sur, Australia." },
      { prompt: "¿En qué año entró el yacimiento en la lista del Patrimonio Nacional?", answer: "En 2005." },
      { prompt: "¿Qué dos estimaciones muy diferentes sobre su antigüedad menciona el texto?", answer: "Menciona una afirmación de 40 000 años y una investigación que sugiere solo mil años." },
      { prompt: "¿Está científicamente verificada la antigüedad de las trampas?", answer: "No. El texto dice expresamente que no se ha verificado científicamente." },
    ],
    writingPrompt: "用 90–120 词西班牙语介绍一处古老遗址，并把‘已证实事实’与‘尚待核实说法’分开。至少使用 está en、fue incluido、se ha sugerido、podría 和 sin embargo；不要把标题中的可能性改写成确定事实。",
    source: {
      name: "Global Voices en Español",
      url: "https://es.globalvoices.org/2026/08/08/trampas-para-peces-de-brewarrina-en-australia-podrian-ser-la-construccion-humana-mas-antigua-del-mundo/",
      license: "CC BY 3.0",
      retrievedAt: "2026-08-27",
      editorialNote: "选取六个西语作者叙述段；遇到引出第三方引语的来源段落时，仅保留此前完整作者句。只规范化 HTML 与不换行空格，排除照片、图注、外部引语、社媒、视频、相关链接和第三方媒体，未改写所选西语词句；明确标示选择与学习加工改动。",
      translationNote: "所存西语文本是 Antonella Clara Difalco 对 Kevin Rennie 英文文章的 Global Voices 西语译文；中文译文、证据强度注释、词汇、问题与写作任务由本站制作，并非 Global Voices 官方中文译文。",
      requiredAttribution: "Kevin Rennie, «Trampas para peces de Brewarrina en Australia podrían ser la construcción humana más antigua del mundo», traducción al español de Antonella Clara Difalco, Global Voices en Español, 8 de agosto de 2026, CC BY 3.0; original en inglés publicado el 14 de julio de 2026.",
    },
  },
];
