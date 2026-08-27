import { readingMaterialsBatch2 } from "./readings-batch-2";
import { readingMaterialsBatch3 } from "./readings-batch-3";
import { readingMaterialsBatch4 } from "./readings-batch-4";
import { readingMaterialsBatch5 } from "./readings-batch-5";
import { readingMaterialsBatch6 } from "./readings-batch-6";
import { readingMaterialsBatch7 } from "./readings-batch-7";
import { readingMaterialsBatch8 } from "./readings-batch-8";
import { readingMaterialsBatch9 } from "./readings-batch-9";
import { readingMaterialsBatch10 } from "./readings-batch-10";
import { readingMaterialsBatch11 } from "./readings-batch-11";
import { readingMaterialsBatch12 } from "./readings-batch-12";
import { readingMaterialsBatch13 } from "./readings-batch-13";
import { readingMaterialsBatch14 } from "./readings-batch-14";
import { readingMaterialsBatch15 } from "./readings-batch-15";
import { readingMaterialsBatch16 } from "./readings-batch-16";

export type ReadingLevel = "A1" | "A2" | "B1" | "B2";

export const readingLevels: ReadingLevel[] = ["A1", "A2", "B1", "B2"];

export const readingLevelGuides: Record<
  ReadingLevel,
  { label: string; description: string; prerequisites: string }
> = {
  A1: {
    label: "入门短句",
    description: "以高频生活词和短句为主，在译文支架下辨认人物、地点与基本动作。",
    prerequisites: "认识西语字母与重音符号，能读懂 ser、estar、tener 等常见动词的简单形式。",
  },
  A2: {
    label: "基础叙事",
    description: "处理连贯短篇、常见过去时和基础连接词，提取事件顺序、原因与结果。",
    prerequisites: "掌握现在时和常见过去时基础，能借助词表理解数段相连的日常或寓言文本。",
  },
  B1: {
    label: "中级阅读",
    description: "阅读较长叙事或说明文，辨认段落主旨、论据、语气以及跨句指代关系。",
    prerequisites: "能独立阅读一般主题短文，并理解主要过去时、虚拟或条件表达的常见用法。",
  },
  B2: {
    label: "中高级研读",
    description: "研读历史、文学、科学或政策原文，处理低频词、抽象概念与复杂论证结构。",
    prerequisites: "能把握较长原文的整体结构，并愿意核对历史拼写、术语和作者立场。",
  },
};

export type ReadingParagraph = { spanish: string; chinese: string };
export type VocabularyItem = { word: string; meaning: string; note?: string };
export type ReadingQuestion = { prompt: string; answer: string };

export type ReadingMaterial = {
  slug: string;
  title: string;
  chineseTitle: string;
  author: string;
  translator?: string;
  level: ReadingLevel;
  minutes: number;
  summary: string;
  focus: string[];
  paragraphs: ReadingParagraph[];
  vocabulary: VocabularyItem[];
  questions: ReadingQuestion[];
  writingPrompt: string;
  source: {
    name: string;
    url: string;
    license: string;
    retrievedAt: string;
    editorialNote: string;
    translationNote: string;
    requiredAttribution?: string;
    derivativeNotice?: string;
    deepSeekPolicy?: {
      enabled: false;
      statementUrl: string;
      statementSummaryZh: string;
    };
  };
};

const source = (url: string, editorialNote: string): ReadingMaterial["source"] => ({
  name: "Wikisource en español",
  url,
  license: "CC BY-SA 4.0",
  retrievedAt: "2026-08-26",
  editorialNote,
  translationNote: "中文译文与学习注释由本站依据公版西语原文编写，并非来源站官方译文。",
});

const readingMaterialsBatch1: ReadingMaterial[] = [
  {
    slug: "la-gallina-de-los-huevos-de-oro",
    title: "La gallina de los huevos de oro",
    chineseTitle: "金蛋鸡",
    author: "Félix María Samaniego",
    level: "A2",
    minutes: 8,
    summary: "一则关于贪心与耐心的短寓言，适合熟悉过去时和数量表达。",
    focus: ["过去时叙事", "数量与频率", "寓言寓意"],
    paragraphs: [
      {
        spanish: "Érase una gallina que ponía un huevo de oro al dueño cada día. Aún con tanta ganancia, mal contento, quiso el rico avariento descubrir de una vez la mina de oro, y hallar en menos tiempo más tesoro.",
        chinese: "从前有一只母鸡，每天给主人下一枚金蛋。尽管已有如此丰厚的收益，贪心的富人仍不满足，想一次找到金矿，在更短时间里得到更多财宝。",
      },
      {
        spanish: "Matóla; abrióla el vientre de contado; pero después de haberla registrado, ¿qué sucedió? Que, muerta la gallina, perdió su huevo de oro, y no halló mina.",
        chinese: "他杀了母鸡，立刻剖开它的肚子；可仔细翻找以后，发生了什么？母鸡死了，他失去了每天的金蛋，也没有找到什么金矿。",
      },
      {
        spanish: "¡Cuántos hay que teniendo lo bastante, enriquecerse quieren al instante, abrazando proyectos a veces de tan rápidos efectos, que sólo en pocos meses, cuando se contemplaban ya marqueses, contando sus millones, se vieron en la calle sin calzones!",
        chinese: "有多少人明明已经拥有足够，却还想一夜暴富，投身于见效过快的计划；不过几个月，他们刚幻想自己成了侯爵、数着百万家财，转眼却落得一无所有！",
      },
    ],
    vocabulary: [
      { word: "poner", meaning: "下（蛋）；放置", note: "ponía 是未完成过去时" },
      { word: "cada día", meaning: "每天" },
      { word: "avariento", meaning: "贪财的；吝啬的" },
      { word: "de contado", meaning: "立刻；当即", note: "较古典的表达" },
      { word: "hallar", meaning: "找到", note: "常见近义词是 encontrar" },
      { word: "la ganancia", meaning: "收益；利润", note: "与动词 ganar（获得、赚取）同源" },
      { word: "descubrir", meaning: "发现；揭开" },
      { word: "registrar", meaning: "仔细搜查；检查", note: "本文用 haberla registrado 表示检查母鸡体内" },
      { word: "perder", meaning: "失去；丢失", note: "perdió 是简单过去时第三人称单数" },
      { word: "al instante", meaning: "立即；马上" },
    ],
    questions: [
      { prompt: "¿Qué ponía la gallina cada día?", answer: "Ponía un huevo de oro." },
      { prompt: "¿Por qué perdió el dueño su riqueza?", answer: "Porque fue avariento, mató la gallina y no encontró ninguna mina." },
    ],
    writingPrompt: "用 3–5 句西班牙语写一次“因为太着急而失去更多”的经历；尽量使用 porque、pero 和 al final。",
    source: source(
      "https://es.wikisource.org/wiki/La_gallina_de_los_huevos_de_oro_(Samaniego)",
      "完整收录西语正文；为网页阅读合并原诗行并统一引号，未改写词句。",
    ),
  },
  {
    slug: "el-cuervo-y-el-zorro",
    title: "El cuervo y el zorro",
    chineseTitle: "乌鸦与狐狸",
    author: "Félix María Samaniego",
    level: "A2",
    minutes: 10,
    summary: "狐狸用奉承骗走乌鸦的奶酪，适合学习直接引语和形容词。",
    focus: ["直接引语", "外貌形容词", "因果关系"],
    paragraphs: [
      {
        spanish: "En la rama de un árbol, bien ufano y contento, con un queso en el pico, estaba el señor Cuervo. Del olor atraído, un Zorro muy maestro le dijo estas palabras un poco más o menos:",
        chinese: "乌鸦先生站在树枝上，嘴里叼着一块奶酪，神气又开心。一只十分狡猾的狐狸被香味吸引，走来对他说了大概这样一番话：",
      },
      {
        spanish: "«¡Tenga usted buenos días, señor Cuervo, mi dueño! ¡Vaya que estáis donoso, mono, lindo en extremo! Yo no gasto lisonjas, y digo lo que siento; que si a tu bella traza corresponde el gorjeo, juro a la diosa Ceres, siendo testigo el cielo, que tú serás el Fénix de sus vastos imperios.»",
        chinese: "“祝您早安，乌鸦先生，我的主人！您真是优雅、可爱、美丽至极！我从不说奉承话，只说真心感受。倘若您的歌声与俊美外表相称，我向女神刻瑞斯发誓、请天空作证：您一定会成为她辽阔国度中的凤凰。”",
      },
      {
        spanish: "Al oír un discurso tan dulce y halagüeño, de vanidad llevado, quiso cantar el Cuervo. Abrió su negro pico, dejó caer el queso.",
        chinese: "听到这番甜美讨喜的话，乌鸦被虚荣心冲昏了头，想要高歌。他张开黑色的嘴，奶酪便掉了下来。",
      },
      {
        spanish: "El muy astuto Zorro, después de haberle preso, le dijo: «Señor bobo, pues sin otro alimento quedáis con alabanzas tan hinchado y repleto, digerid las lisonjas mientras yo digiero el queso.» Quien oye aduladores, nunca espere otro premio.",
        chinese: "狡猾的狐狸拿到奶酪后说：“傻先生，既然没有别的食物，您就靠这些赞美把自己填饱吧。您慢慢消化奉承话，我来消化奶酪。”听信奉承的人，不要期待别的奖赏。",
      },
    ],
    vocabulary: [
      { word: "el pico", meaning: "鸟嘴；喙" },
      { word: "atraído", meaning: "被吸引的", note: "来自 atraer" },
      { word: "la lisonja", meaning: "奉承话" },
      { word: "halagüeño", meaning: "讨喜的；令人愉快的" },
      { word: "dejar caer", meaning: "让……掉下；失手掉落" },
      { word: "la vanidad", meaning: "虚荣心" },
      { word: "la rama", meaning: "树枝" },
      { word: "el queso", meaning: "奶酪" },
      { word: "ufano", meaning: "得意的；骄傲的", note: "本文与 contento 并列描写乌鸦" },
      { word: "el gorjeo", meaning: "鸟鸣；婉转的歌声", note: "来自动词 gorjear" },
    ],
    questions: [
      { prompt: "¿Qué tenía el cuervo en el pico?", answer: "Tenía un queso." },
      { prompt: "¿Cómo consiguió el zorro el queso?", answer: "Halagó al cuervo para que cantara y abriera el pico." },
    ],
    writingPrompt: "用狐狸或乌鸦的第一人称重写故事结尾（4–6 句），至少使用一个过去时动词和一个因果连接词。",
    source: source(
      "https://es.wikisource.org/wiki/El_cuervo_y_el_zorro",
      "完整收录西语正文；为网页阅读合并原诗行并统一引号，未改写词句。",
    ),
  },
  {
    slug: "la-lechera",
    title: "La lechera",
    chineseTitle: "挤奶姑娘",
    author: "Félix María Samaniego",
    level: "A2",
    minutes: 12,
    summary: "一连串美好设想因一个跳跃破灭，适合学习将来表达和叙事顺序。",
    focus: ["将来计划", "叙事顺序", "古典词汇"],
    paragraphs: [
      {
        spanish: "Llevaba en la cabeza una lechera el cántaro al mercado con aquella presteza, aquel aire sencillo, aquel agrado, que va diciendo a todo el que lo advierte: «¡Yo sí que estoy contenta con mi suerte!»",
        chinese: "一个挤奶姑娘头顶陶罐，轻快地向市场走去。她神态朴素又愉悦，仿佛在向每个见到她的人说：“我可真满意自己的运气！”",
      },
      {
        spanish: "Marchaba sola la feliz lechera, y decía entre sí: «Esta leche vendida, en limpio me dará tanto dinero, y con esta partida un canasto de huevos comprar quiero, para sacar cien pollos.»",
        chinese: "快乐的姑娘独自走着，心里说道：“卖掉这些牛奶，我能净赚一笔钱；我要用它买一篮鸡蛋，孵出一百只小鸡。”",
      },
      {
        spanish: "«Del importe logrado de tanto pollo mercaré un cochino; con bellota, salvado, berza, castaña engordará sin tino. Llevarélo al mercado; sacaré de él sin duda buen dinero; compraré de contado una robusta vaca y un ternero.»",
        chinese: "“卖掉这么多鸡，我要买一头小猪；用橡子、麦麸、卷心菜和栗子喂它，它一定会长得很肥。再把它带到市场，我肯定能卖个好价钱，然后马上买一头健壮的母牛和一头小牛。”",
      },
      {
        spanish: "Con este pensamiento enajenada, brinca de manera que a su salto violento el cántaro cayó. ¡Pobre lechera! Adiós leche, dinero, huevos, pollos, lechón, vaca y ternero.",
        chinese: "她完全沉浸在这些想象中，高兴得跳了起来；猛烈的一跳让陶罐摔在地上。可怜的姑娘！牛奶、钱、鸡蛋、小鸡、小猪、母牛和小牛，全都再见了。",
      },
      {
        spanish: "No seas ambiciosa de mejor o más próspera fortuna; que vivirás ansiosa sin que pueda saciarte cosa alguna. No anheles impaciente el bien futuro: mira que ni el presente está seguro.",
        chinese: "不要贪求更好、更兴旺的命运，否则你会一直焦虑，没有什么能让你满足。不要急切渴望未来的好处——要知道，就连眼前拥有的也未必稳妥。",
      },
    ],
    vocabulary: [
      { word: "el cántaro", meaning: "陶罐；水罐" },
      { word: "el mercado", meaning: "市场" },
      { word: "un canasto", meaning: "一篮；篮子" },
      { word: "mercar", meaning: "购买", note: "现代日常西语更常用 comprar" },
      { word: "brincar", meaning: "跳起来" },
      { word: "anhelar", meaning: "渴望" },
      { word: "en limpio", meaning: "净得；扣除成本后", note: "本文指卖牛奶后的净收入" },
      { word: "sacar", meaning: "获得；取出", note: "sacar cien pollos 指孵出一百只小鸡" },
      { word: "engordar", meaning: "长胖；育肥" },
      { word: "caer", meaning: "落下；摔倒", note: "cayó 是简单过去时第三人称单数" },
    ],
    questions: [
      { prompt: "¿Qué quería comprar primero la lechera?", answer: "Quería comprar un canasto de huevos." },
      { prompt: "¿Por qué cayó el cántaro?", answer: "Porque la lechera saltó mientras imaginaba su fortuna futura." },
    ],
    writingPrompt: "写一个 5 步的个人计划，每步用西班牙语说明“完成这一步后要做什么”；最后补一句现实风险。",
    source: source(
      "https://es.wikisource.org/wiki/La_lechera",
      "教学节选：保留故事开端、计划链条、转折和寓意段落；省略部分重复铺陈，段内合并原诗行。",
    ),
  },
];

export const readingMaterials: ReadingMaterial[] = [
  ...readingMaterialsBatch1,
  ...readingMaterialsBatch2,
  ...readingMaterialsBatch3,
  ...readingMaterialsBatch4,
  ...readingMaterialsBatch5,
  ...readingMaterialsBatch6,
  ...readingMaterialsBatch7,
  ...readingMaterialsBatch8,
  ...readingMaterialsBatch9,
  ...readingMaterialsBatch10,
  ...readingMaterialsBatch11,
  ...readingMaterialsBatch12,
  ...readingMaterialsBatch13,
  ...readingMaterialsBatch14,
  ...readingMaterialsBatch15,
  ...readingMaterialsBatch16,
];

export const readingDifficultyAssessments: Record<string, string> = {
  "la-gallina-de-los-huevos-de-oro": "篇幅短、寓意清楚，但有古典词汇、长句和多个过去时；借助译文与词表适合作为 A2 挑战阅读。",
  "el-cuervo-y-el-zorro": "故事线单一，但奉承台词较长，含古典称呼、修辞和直接引语，需要按意群拆句。",
  "la-lechera": "计划链条易追踪，同时密集使用将来时、农业词汇和古典表达，适合已有基础时态概念的读者。",
  "el-leon-y-el-raton": "三段线性叙事提供清楚因果，但过去时动作、寓言词汇和古典倒装需要词表支架。",
  "los-dos-amigos-y-el-oso": "篇幅短且情节熟悉，难点集中在反身结构、过去时动作和结尾的间接劝告。",
  "la-zorra-y-la-gallina": "对话短、人物少；需要理解礼貌称呼、双关式回答和由故事推断讽刺寓意。",
  "gobierno-de-la-alhambra": "十九世纪拼写、超长复句、历史制度词汇和跨段年代变化共同造成较高负荷。",
  "tradiciones-locales": "长段落结合历史叙述、民间传说、比喻和作者评论，并保留十九世纪拼写。",
  "la-casa-del-gallo": "篇幅较前两章短，但历史拼写、摩尔建筑词汇及史实到魔法传说的语体转换仍复杂。",
  "la-quimica-en-la-vida-cotidiana": "日常生活框架降低理解门槛，但要跨句连接例子与化学概念，并处理少量学术词汇。",
  "modelos-teorias-y-leyes-cientificas": "需要精确区分模型、理论和定律，跟踪限制条件、反例与多层从句中的论证关系。",
  "procesos-espontaneos-y-no-espontaneos": "正文很短且例子具体，但包含条件关系、被动表达和成对的热力学抽象概念。",
  "el-pacto-verde-europeo": "政策文本以名词化表达连接目标、期限、法律约束和社会公平，信息密度高于日常叙事。",
  "proteccion-del-medio-ambiente-e-innovacion": "两段文字紧凑罗列多个政策领域，并用抽象因果链连接环境、投资和增长。",
  "como-funciona-la-politica-agricola-de-la-ue": "需区分多层机构职责，理解政策名词、被动结构及跨句指代，属于制度说明文研读。",
  "la-ia-y-el-significado-de-la-literatura": "核心是抽象的人文论证，需要辨认让步、对比、隐含立场和多组概念边界。",
  "la-abeja-haragana": "完整文学短篇篇幅长，叙事过去时密集，含直接引语、地域词和需跨场景追踪的因果线。",
  "movimiento-y-fuerza": "教材结构和生活例子提供明确支架，但仍需掌握科学定义、因果说明和术语之间的关系。",
  "la-dieta-saludable": "主题熟悉、段落结构清楚，以高频饮食词为主，难点是健康因果和建议表达。",
  "las-comidas-del-dia": "时间顺序和食物词可预测；主要挑战是五餐名称、钟点表达以及西班牙地区用法。",
  "los-alimentos-y-las-estaciones": "四季、月份、颜色与果蔬形成重复结构，适合在基础词汇上练习分类和地点限定。",
  "alimentacion-y-patrimonio-inmaterial": "完整长文结合引语、统计、机构项目和非遗概念，需要整合多段论据并区分案例与定义。",
  "trampas-para-peces-de-brewarrina": "新闻段落较短，但要持续区分 podría、se ha sugerido、afirman 与未验证事实的证据强度。",
  "un-jardin-en-el-congo": "八页均为重复度高的短句和具体生活词；少量过去时由图画书结构、译文与词形提示支撑。",
};

export function getReadingBySlug(slug: string): ReadingMaterial | undefined {
  return readingMaterials.find((material) => material.slug === slug);
}

export function isReadingDeepSeekEnabled(slug: string): boolean {
  return getReadingBySlug(slug)?.source.deepSeekPolicy?.enabled !== false;
}

export function getDifficultyRationale(material: ReadingMaterial): string {
  const guide = readingLevelGuides[material.level];
  return `${material.level} · ${guide.label}：${guide.description}本篇预计 ${material.minutes} 分钟，主要挑战是${material.focus.join("、")}。定级依据：${readingDifficultyAssessments[material.slug]}学习前提：${guide.prerequisites}`;
}
