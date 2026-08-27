import type { ReadingMaterial } from "./readings";

export const readingMaterialsBatch11: ReadingMaterial[] = [
  {
    slug: "la-dieta-saludable",
    title: "La dieta saludable",
    chineseTitle: "健康饮食",
    author: "Rocío Diestro Sánchez",
    level: "A2",
    minutes: 8,
    summary: "用简短的现代西班牙语说明健康饮食、疾病预防、身体防御能力和每日运动之间的关系。",
    focus: ["食物与健康", "原因表达", "无人称 se", "频率表达"],
    paragraphs: [
      {
        spanish: "Es aquella que incluye la cantidad correcta de cada uno de los tipos de alimentos y que se realiza de forma continua. Llevar una dieta saludable, es muy importante porque:",
        chinese: "健康饮食是指持续摄入各类食物，并保证每一类的量都合适。保持健康饮食非常重要，因为：",
      },
      {
        spanish: "Nos ayuda a evitar enfermedades directamente relacionadas con la alimentación como son el sobrepeso, la obesidad... En la mayoría de ocasiones, estas enfermedades aparecen porque tomamos muchos alimentos con un alto contenido en grasas.",
        chinese: "它能帮助我们避免与饮食直接相关的疾病，例如超重和肥胖。很多时候，这些问题出现，是因为我们吃了太多脂肪含量高的食物。",
      },
      {
        spanish: "También podemos evitar otro tipo de enfermedades, ya que la alimentación ayuda a nuestro cuerpo a tener unas defensas fuertes. Por ejemplo, puede luchar más fácilmente contra algunos virus, como el de la gripe.",
        chinese: "我们也可以降低其他疾病的风险，因为饮食能帮助身体保持较强的防御能力。例如，身体可以更容易地对抗某些病毒，如流感病毒。",
      },
      {
        spanish: "Además de una alimentación saludable, para mantener adecuadamente nuestra salud, se debe hacer ejercicio diariamente.",
        chinese: "除了健康饮食之外，为了良好地维持健康，还应当每天运动。",
      },
    ],
    vocabulary: [
      { word: "la dieta", meaning: "饮食方式；日常膳食", note: "不只表示减肥餐" },
      { word: "la cantidad", meaning: "数量" },
      { word: "de forma continua", meaning: "持续地；连续地" },
      { word: "evitar", meaning: "避免" },
      { word: "el sobrepeso", meaning: "超重" },
      { word: "un alto contenido en", meaning: "……含量高" },
      { word: "las defensas", meaning: "身体防御能力；免疫防线" },
      { word: "ya que", meaning: "因为；由于" },
      { word: "hacer ejercicio", meaning: "锻炼；运动" },
      { word: "diariamente", meaning: "每天；每日地" },
    ],
    questions: [
      { prompt: "¿Qué incluye una dieta saludable según el texto?", answer: "Incluye la cantidad correcta de cada tipo de alimento y se mantiene de forma continua." },
      { prompt: "¿Por qué pueden aparecer el sobrepeso y la obesidad?", answer: "Porque se toman muchos alimentos con un alto contenido en grasas." },
      { prompt: "¿Qué recomienda el texto además de una alimentación saludable?", answer: "Recomienda hacer ejercicio diariamente." },
    ],
    writingPrompt: "用 70–100 词西班牙语写一份你能长期坚持的健康日常计划。至少写到两类食物和一种运动，并使用 porque、ya que、además de 和 diariamente。",
    source: {
      name: "INTEF",
      url: "https://descargas.intef.es/recursos_educativos/It_didac/CCNN/1/05/Nuestra_alimentacion/la_dieta_saludable.html",
      license: "CC BY-SA 4.0",
      retrievedAt: "2026-08-27",
      editorialNote: "完整收录页面的学生阅读正文；仅规范化 HTML 和不换行空格。教师活动说明、导航、练习、图片与第三方媒体均未入库；来源中的逗号与省略号原样保留。",
      translationNote: "中文译文、词汇、问题与写作任务由本站制作，并按 CC BY-SA 4.0 共享；不是 INTEF 官方译文，也不构成个体化医疗或营养建议。",
      requiredAttribution: "Rocío Diestro Sánchez, «La dieta saludable», itinerario «Nuestra alimentación», INTEF, 2022, CC BY-SA 4.0.",
    },
  },
];
