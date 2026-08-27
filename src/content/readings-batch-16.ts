import type { ReadingMaterial } from "./readings";

export const readingMaterialsBatch16: ReadingMaterial[] = [
  {
    slug: "un-jardin-en-el-congo",
    title: "Un Jardín en el Congo",
    chineseTitle: "刚果的一座花园",
    author: "Christelle X",
    translator: "Mila Uzzi",
    level: "A1",
    minutes: 8,
    summary: "一个孩子回忆在刚果的家、菜园和妈妈教她种菜的经历，再用现在时说出搬到南非后的变化。句子很短，但过去时需要少量支架。",
    focus: ["家与菜园", "物主词", "过去与现在", "家庭传承"],
    paragraphs: [
      {
        spanish: "Esta casa está en el Congo. Me gusta esta casa.",
        chinese: "这座房子在刚果。我喜欢这座房子。",
      },
      {
        spanish: "Teníamos nuestro propio baño. Teníamos nuestro propio inodoro.",
        chinese: "我们曾有自己的浴室，也有自己的马桶。",
      },
      {
        spanish: "Teníamos un jardín. Estaba plantando mi propia huerta.",
        chinese: "我们曾有一座花园。我那时正在种自己的菜园。",
      },
      {
        spanish: "Mi mamá me dijo, \"Mi mamá me enseñó a plantar. Ahora yo te enseño a ti.\"",
        chinese: "妈妈对我说：“我的妈妈教会了我种植。现在我来教你。”",
      },
      {
        spanish: "Planté tomates y espinaca. Lo hice sola.",
        chinese: "我种了番茄和菠菜。这是我独自完成的。",
      },
      {
        spanish: "Le llevaba tomates a mi mamá. Ella me decía, \"Muchas gracias.\"",
        chinese: "我常把番茄拿给妈妈。她会对我说：“非常感谢。”",
      },
      {
        spanish: "Nos fuimos de esa casa en el Congo.",
        chinese: "后来我们离开了刚果的那座房子。",
      },
      {
        spanish: "No tenemos un jardín en Sudáfrica.",
        chinese: "如今我们在南非没有花园。",
      },
    ],
    vocabulary: [
      { word: "la casa", meaning: "房子；家" },
      { word: "gustar", meaning: "使……喜欢", note: "me gusta esta casa＝我喜欢这座房子" },
      { word: "propio / propia", meaning: "自己的；本人的", note: "需与名词性数一致" },
      { word: "el baño", meaning: "浴室；洗手间" },
      { word: "el inodoro", meaning: "马桶" },
      { word: "el jardín", meaning: "花园" },
      { word: "la huerta", meaning: "菜园；果蔬园", note: "比 jardín 更强调种植食物" },
      { word: "plantar", meaning: "种植" },
      { word: "el tomate", meaning: "番茄；西红柿" },
      { word: "la espinaca", meaning: "菠菜" },
      { word: "solo / sola", meaning: "独自的；单独地", note: "sola 与叙述者的阴性形式一致" },
      { word: "irse", meaning: "离开；走掉", note: "nos fuimos 是简单过去时" },
      { word: "teníamos", meaning: "我们当时有", note: "tener 的未完成过去时，表示过去持续状态" },
      { word: "enseñó", meaning: "（他/她）教了", note: "enseñar 的简单过去时" },
    ],
    questions: [
      { prompt: "¿Dónde estaba la casa?", answer: "Estaba en el Congo." },
      { prompt: "¿Qué plantó la narradora?", answer: "Plantó tomates y espinaca." },
      { prompt: "¿Quién enseñó a la narradora a plantar?", answer: "Su mamá." },
      { prompt: "¿Qué cambió después de mudarse?", answer: "En Sudáfrica ya no tienen un jardín." },
    ],
    writingPrompt: "用 6–8 个很短的西班牙语句子写一段‘以前的家与现在的家’。至少使用 teníamos、me gustaba、planté、nos fuimos 和 ahora；可以先套用原文句型，再替换地点和物品。",
    source: {
      name: "African Storybook",
      url: "https://www.africanstorybook.org/read/downloadbook.php?a=1&d=0&id=35534&layout=landscape",
      license: "CC BY 4.0",
      retrievedAt: "2026-08-27",
      editorialNote: "完整故事文字，共八页；从官方 PDF 在内存中提取，合并页面内换行，并把 PDF 字体编码恢复为页面显示的西语字符。排除封面画面、逐页插图和徽标，未改写词句或标点。",
      translationNote: "所存西语文本是 Mila Uzzi 对 Christelle X 故事的 African Storybook 西语译文；中文译文、语法支架、词汇、问题和写作任务由本站制作，并注明为 CC BY 4.0 改编，不是 African Storybook 官方中文译文。",
      requiredAttribution: "«Un Jardín en el Congo» (Spanish), written and illustrated by Christelle X, translated by Mila Uzzi, © African Storybook Initiative 2019, CC BY 4.0, source www.africanstorybook.org, book ID 35534.",
    },
  },
];
