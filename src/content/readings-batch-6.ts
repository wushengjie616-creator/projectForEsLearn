import type { ReadingMaterial } from "./readings";

const sourceUrl = "https://commission.europa.eu/strategy-and-policy/priorities-2019-2024/european-green-deal_es";

export const readingMaterialsBatch6: ReadingMaterial[] = [
  {
    slug: "el-pacto-verde-europeo",
    title: "El Pacto Verde Europeo",
    chineseTitle: "欧洲绿色协议",
    author: "Comisión Europea",
    level: "B2",
    minutes: 12,
    summary: "阅读欧盟委员会如何用目标、行动领域和社会公平来说明一项公共政策。",
    focus: ["公共政策说明文", "目的与结果表达", "数字和时间目标"],
    paragraphs: [
      {
        spanish: "El Pacto Verde Europeo está transformando la UE en una economía moderna, eficiente en el uso de los recursos y competitiva.",
        chinese: "欧洲绿色协议正在把欧盟转变为一个现代化、资源利用高效且具有竞争力的经济体。",
      },
      {
        spanish: "Puesto en marcha por la presidenta Von der Leyen en 2019, responde a las peticiones urgentes de los ciudadanos, especialmente de los jóvenes, para actuar por el clima. Establece un plan para transformar la economía, la energía, el transporte y las industrias en Europa a fin de conseguir un futuro más sostenible.",
        chinese: "该协议由冯德莱恩主席于 2019 年启动，回应了公民、尤其是年轻人要求采取气候行动的迫切呼声。它制定计划，改造欧洲的经济、能源、交通和工业，以实现更可持续的未来。",
      },
      {
        spanish: "Su objetivo es reducir las emisiones en al menos un 50 % de aquí a 2030, para llegar hasta el 55 %, al tiempo que se vincula jurídicamente el objetivo de neutralidad para 2050 a través de la Legislación Europea sobre el Clima. El Pacto Verde Europeo impulsa una transición limpia que protege a las personas y al planeta y que es económicamente sólida y socialmente justa.",
        chinese: "其目标是到 2030 年至少减排 50%，并争取达到 55%；与此同时，通过《欧洲气候法》让 2050 年实现气候中和的目标具有法律约束力。欧洲绿色协议推动清洁转型，既保护人与地球，也力求在经济上稳健、在社会上公平。",
      },
      {
        spanish: "Invierte en innovación, tecnologías limpias e infraestructuras ecológicas, garantizando al mismo tiempo una transición justa para las comunidades más afectadas. Gracias al Pacto Verde Europeo, los europeos disfrutan de un aire más limpio y de productos y hogares más eficientes desde el punto de vista energético. También recurren a más fuentes de energía renovables para su vida diaria.",
        chinese: "协议投资于创新、清洁技术与绿色基础设施，同时保障受影响最大的社区能够公平转型。欧盟委员会称，欧洲人因此获得更清洁的空气、更节能的产品和住宅，也在日常生活中采用更多可再生能源。",
      },
    ],
    vocabulary: [
      { word: "eficiente en el uso de los recursos", meaning: "资源利用高效的" },
      { word: "poner en marcha", meaning: "启动；开始实施" },
      { word: "a fin de", meaning: "为了；以便", note: "后接不定式" },
      { word: "de aquí a 2030", meaning: "从现在到 2030 年；到 2030 年前" },
      { word: "vincular jurídicamente", meaning: "赋予法律约束；在法律上绑定" },
      { word: "la neutralidad", meaning: "中和；中立", note: "neutralidad climática 指气候中和" },
      { word: "la transición justa", meaning: "公正转型" },
      { word: "recurrir a", meaning: "采用；求助于" },
      { word: "la emisión", meaning: "排放；发行", note: "本文复数 emisiones 指温室气体排放" },
      { word: "la energía renovable", meaning: "可再生能源" },
    ],
    questions: [
      { prompt: "¿Qué sectores pretende transformar el plan?", answer: "Pretende transformar la economía, la energía, el transporte y las industrias en Europa." },
      { prompt: "¿Cómo se relacionan los objetivos de 2030 y 2050?", answer: "Para 2030 se busca reducir las emisiones al menos un 50 % y hasta un 55 %, mientras que para 2050 se fija jurídicamente la neutralidad climática." },
      { prompt: "¿Qué dos dimensiones de justicia menciona el texto al describir la transición?", answer: "Afirma que debe ser económicamente sólida y socialmente justa, especialmente para las comunidades más afectadas." },
    ],
    writingPrompt: "用 110–140 词西班牙语为你所在城市提出一项绿色计划：写明 2030 年目标、三个行动领域，以及如何照顾受影响最大的群体。使用 a fin de、al mismo tiempo 和 gracias a。",
    source: {
      name: "Comisión Europea",
      url: sourceUrl,
      license: "CC BY 4.0",
      retrievedAt: "2026-08-26",
      editorialNote: "完整收录页面导言四段；改动仅为去除 HTML 标签并把不换行空格规范为普通空格，未改写措辞；未收录徽标、图片或第三方素材。",
      translationNote: "中文学习译文、词汇与练习由本站依据开放许可西语原文编写，不代表欧盟委员会官方译文、立场扩展或教学答案。",
      requiredAttribution: "© Unión Europea, 1995–2026. Fuente: Comisión Europea.",
    },
  },
];
