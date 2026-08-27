import type { ReadingMaterial } from "./readings";

const euSource = (url: string, editorialNote: string): ReadingMaterial["source"] => ({
  name: "Comisión Europea",
  url,
  license: "CC BY 4.0",
  retrievedAt: "2026-08-27",
  editorialNote,
  translationNote: "中文学习译文、词汇与练习由本站依据开放许可西语原文编写，不代表欧盟机构的官方译文、政策解释或教学答案。",
  requiredAttribution: "© Unión Europea, 1995–2026. Fuente: portal oficial de la Unión Europea.",
});

export const readingMaterialsBatch7: ReadingMaterial[] = [
  {
    slug: "proteccion-del-medio-ambiente-e-innovacion",
    title: "Protección del medio ambiente e innovación",
    chineseTitle: "环境保护与创新",
    author: "Unión Europea",
    level: "B2",
    minutes: 9,
    summary: "从自然保护、公共健康到绿色增长，观察政策文本如何连接环境行动与经济机会。",
    focus: ["并列政策目标", "因果链条", "环境与经济词汇"],
    paragraphs: [
      {
        spanish: "Se trabaja en muchos frentes para proteger las especies amenazadas y las zonas naturales de la UE, garantizar la seguridad del agua potable y el agua de baño, mejorar la calidad del aire y la gestión de residuos y reducir los efectos de los productos químicos nocivos.",
        chinese: "欧盟在多个方面开展工作：保护受威胁物种和自然区域，保障饮用水与浴场水安全，改善空气质量和废物管理，并减少有害化学品的影响。",
      },
      {
        spanish: "La protección del medio ambiente y la innovación contribuyen a crear nuevas oportunidades de negocio y empleo, que a su vez estimulan nuevas inversiones. El crecimiento ecológico es un elemento central de la política de la UE para garantizar que en Europa el crecimiento económico sea ambientalmente sostenible. Además, la UE desempeña un papel clave en el impulso al desarrollo sostenible en todo el mundo.",
        chinese: "环境保护与创新有助于创造新的商业和就业机会，而这些机会又会刺激新的投资。绿色增长是欧盟政策的核心要素，旨在确保欧洲经济增长在环境方面可持续。此外，欧盟也致力于在全球推动可持续发展。",
      },
    ],
    vocabulary: [
      { word: "trabajar en varios frentes", meaning: "从多个方面开展工作" },
      { word: "la especie amenazada", meaning: "受威胁物种" },
      { word: "el agua de baño", meaning: "浴场水；供游泳等活动使用的水体" },
      { word: "la gestión de residuos", meaning: "废物管理" },
      { word: "nocivo", meaning: "有害的" },
      { word: "a su vez", meaning: "继而；反过来又" },
      { word: "el crecimiento ecológico", meaning: "绿色增长" },
      { word: "desempeñar un papel", meaning: "发挥作用" },
      { word: "el agua potable", meaning: "饮用水" },
      { word: "la oportunidad de negocio", meaning: "商业机会" },
    ],
    questions: [
      { prompt: "¿Qué ámbitos de protección ambiental enumera el primer párrafo?", answer: "Menciona especies y zonas naturales, agua potable y de baño, calidad del aire, residuos y productos químicos nocivos." },
      { prompt: "¿Qué cadena económica presenta el segundo párrafo?", answer: "La protección ambiental y la innovación crean oportunidades de negocio y empleo, que a su vez estimulan inversiones." },
      { prompt: "¿Qué condición debe cumplir el crecimiento económico según el texto?", answer: "Debe ser ambientalmente sostenible." },
    ],
    writingPrompt: "用 90–120 词西班牙语为学校或社区提出三个环境行动，并写出它们如何依次带来健康、就业或投资方面的益处。至少使用 a su vez 和 contribuir a。",
    source: euSource(
      "https://european-union.europa.eu/priorities-and-actions/actions-topic/environment_es",
      "节选页面两段仍可独立成立的正文；改动为去除 HTML 标签。排除带 2020 时间节点的旧目标段、链接列表、图片和第三方素材，未改写所选措辞。",
    ),
  },
  {
    slug: "como-funciona-la-politica-agricola-de-la-ue",
    title: "Cómo funciona la política agrícola de la UE",
    chineseTitle: "欧盟农业政策如何运作",
    author: "Unión Europea",
    level: "B2",
    minutes: 11,
    summary: "了解农业政策覆盖的领域，以及欧盟机构、成员国和地方政府之间的实施与监督分工。",
    focus: ["制度与治理", "名词化表达", "范围和职责描述"],
    paragraphs: [
      {
        spanish: "La política agrícola de la UE ha evolucionado considerablemente en las últimas décadas para ayudar a los agricultores a afrontar estos desafíos y a responder al cambio de actitudes y expectativas de las personas. La política agrícola de la UE abarca una amplia gama de ámbitos, incluida la calidad de los alimentos, la trazabilidad, el comercio y la promoción de los productos agrícolas de la UE. La UE apoya financieramente a sus agricultores e impulsa las prácticas sostenibles y respetuosas con el medio ambiente, invirtiendo, al mismo tiempo, en el desarrollo de las zonas rurales.",
        chinese: "过去几十年里，欧盟农业政策发生了显著演变，以帮助农民应对挑战，并回应公众态度和期待的变化。政策涵盖食品质量、可追溯性、贸易以及欧盟农产品推广等广泛领域。欧盟为农民提供资金支持、推动可持续和环境友好型做法，同时投资农村地区发展。",
      },
      {
        spanish: "Las instituciones de la UE colaboran en la elaboración, aplicación, supervisión y evaluación de las políticas agrícolas y alimentarias. Las autoridades nacionales y locales aplican la legislación acordada a nivel de la UE. A través del presupuesto de la UE, los Estados miembros acceden a los fondos disponibles de conformidad con las normas establecidas a nivel de la UE. La UE también supervisa la forma en que se aplica la legislación y su eficacia, y coordina los cambios que se introducen en la legislación.",
        chinese: "欧盟机构协作制定、实施、监督和评估农业及食品政策。国家和地方主管部门执行在欧盟层面商定的法律；成员国依照欧盟规则，通过欧盟预算获得可用资金。欧盟还监督法律的实施方式和成效，并协调对法律作出的修改。",
      },
    ],
    vocabulary: [
      { word: "afrontar", meaning: "面对；应对" },
      { word: "abarcar", meaning: "涵盖；包括" },
      { word: "la trazabilidad", meaning: "可追溯性", note: "与英语 trace/traceability 同源" },
      { word: "impulsar", meaning: "推动；促进" },
      { word: "la elaboración", meaning: "制定；编制" },
      { word: "la supervisión", meaning: "监督" },
      { word: "de conformidad con", meaning: "依照；符合" },
      { word: "la eficacia", meaning: "成效；有效性" },
      { word: "el agricultor", meaning: "农民；农业生产者" },
      { word: "los fondos", meaning: "资金；基金", note: "acceder a los fondos＝获得资金" },
    ],
    questions: [
      { prompt: "¿Qué ámbitos abarca la política agrícola mencionados en el texto?", answer: "Incluye calidad de los alimentos, trazabilidad, comercio y promoción de productos agrícolas." },
      { prompt: "¿Qué autoridades aplican la legislación acordada a nivel de la UE?", answer: "La aplican las autoridades nacionales y locales." },
      { prompt: "¿Qué funciones conserva la UE después de acordar la legislación?", answer: "Facilita fondos, supervisa cómo se aplica la legislación y su eficacia, y coordina sus cambios." },
    ],
    writingPrompt: "用 110–140 词西班牙语说明一项公共政策从制定到实施应经过哪些主体和步骤。至少使用 elaboración、aplicación、supervisión 和 de conformidad con。",
    source: euSource(
      "https://european-union.europa.eu/priorities-and-actions/actions-topic/agriculture_es",
      "节选页面两个连续制度说明段；改动为去除 HTML 标签。排除缺少就地出处的全球预测与就业数字段、链接列表、图片和第三方素材，未改写所选措辞。",
    ),
  },
];
