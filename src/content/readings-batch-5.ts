import type { ReadingMaterial } from "./readings";

const bookUrl = "https://openstax.org/books/qu%C3%ADmica-comenzando-%C3%A1tomos-2ed/pages/1-introduccion";

export const readingMaterialsBatch5: ReadingMaterial[] = [
  {
    slug: "procesos-espontaneos-y-no-espontaneos",
    title: "Procesos espontáneos y no espontáneos",
    chineseTitle: "自发与非自发过程",
    author: "Edward J. Neth, Paul Flowers, Klaus Theopold, Richard Langley y William R. Robinson",
    level: "B1",
    minutes: 9,
    summary: "用水流、抽水、铁锈和融冰解释过程为何在特定条件下自然朝一个方向发生。",
    focus: ["定义与举例", "条件表达", "方向与对比"],
    paragraphs: [
      {
        spanish: "Los procesos tienen una tendencia natural a producirse en una dirección bajo una serie de condiciones determinadas. El agua fluye naturalmente cuesta abajo, pero el flujo cuesta arriba requiere la intervención externa, como el uso de una bomba.",
        chinese: "在一组确定条件下，过程具有朝某个方向自然发生的趋势。水会自然向低处流，但要让水向高处流，就需要外部干预，例如使用水泵。",
      },
      {
        spanish: "El hierro expuesto a la atmósfera terrestre se corroe, pero el óxido no se convierte en hierro sin un tratamiento químico intencionado. Un proceso espontáneo es aquel que se produce de forma natural en determinadas condiciones. Un proceso no espontáneo, en cambio, no tendrá lugar a menos que sea \"impulsado\" por el aporte continuo de energía de una fuente externa.",
        chinese: "暴露在地球大气中的铁会腐蚀，但若没有有意进行的化学处理，铁锈不会自己变回铁。自发过程是在特定条件下自然发生的过程；相反，非自发过程只有在外部能源持续提供能量来‘推动’时才会发生。",
      },
      {
        spanish: "Un proceso que es espontáneo en una dirección bajo un conjunto particular de condiciones es no espontáneo en la dirección inversa. Por ejemplo, a temperatura ambiente y a la presión atmosférica típica, el hielo se derrite espontáneamente, pero el agua no se congela espontáneamente.",
        chinese: "在一组特定条件下沿某方向自发发生的过程，其反方向就是非自发的。例如，在室温和典型大气压下，冰会自发融化，水却不会自发结冰。",
      },
    ],
    vocabulary: [
      { word: "la tendencia", meaning: "趋势；倾向" },
      { word: "cuesta abajo", meaning: "向低处；下坡" },
      { word: "la intervención externa", meaning: "外部干预" },
      { word: "corroerse", meaning: "腐蚀；生锈", note: "第三人称单数：se corroe" },
      { word: "tener lugar", meaning: "发生" },
      { word: "a menos que", meaning: "除非", note: "后接虚拟式：sea impulsado" },
      { word: "el aporte", meaning: "供给；投入" },
      { word: "derretirse", meaning: "融化" },
      { word: "la dirección inversa", meaning: "相反方向" },
      { word: "congelarse", meaning: "结冰；冻结", note: "与 derretirse（融化）构成反向过程" },
    ],
    questions: [
      { prompt: "¿Por qué el agua no fluye cuesta arriba de manera espontánea?", answer: "Porque el flujo cuesta arriba necesita una intervención externa, como una bomba." },
      { prompt: "¿Qué necesita un proceso no espontáneo para tener lugar?", answer: "Necesita ser impulsado por un aporte continuo de energía de una fuente externa." },
      { prompt: "¿Cómo muestra el ejemplo del hielo que la dirección depende de las condiciones?", answer: "A temperatura ambiente y presión normal, derretirse es espontáneo, mientras que congelarse no lo es." },
    ],
    writingPrompt: "用 70–100 词西班牙语举出两个日常过程，说明哪个方向自然发生、反方向需要什么外部干预。至少使用 pero、a menos que 和 por ejemplo。",
    source: {
      name: "OpenStax",
      url: "https://openstax.org/books/qu%C3%ADmica-comenzando-%C3%A1tomos-2ed/pages/12-1-espontaneidad",
      license: "CC BY 4.0",
      retrievedAt: "2026-08-26",
      editorialNote: "收录 12.1 节开头的完整正文段落；排除学习目标和图示，未改写原句，学习页按例证切分为三段。",
      translationNote: "中文学习译文、词汇与练习由本站依据开放许可西语原文编写，并非 OpenStax 官方译文或答案。",
      requiredAttribution: `Acceso gratuito en ${bookUrl}`,
      deepSeekPolicy: {
        enabled: false,
        statementUrl: "https://openstax.org/books/qu%C3%ADmica-comenzando-%C3%A1tomos-2ed/pages/12-1-espontaneidad",
        statementSummaryZh: "未经 OpenStax 许可，该教材不得用于训练大型语言模型，也不得纳入大型语言模型或生成式 AI 产品。",
      },
    },
  },
];
