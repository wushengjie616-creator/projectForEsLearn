import type { ReadingMaterial } from "./readings";

const source = (url: string): ReadingMaterial["source"] => ({
  name: "Wikisource en español",
  url,
  license: "CC BY-SA 4.0",
  retrievedAt: "2026-08-26",
  editorialNote: "完整收录西语正文；保留原文措辞，合并诗行并统一部分标点以便网页学习。",
  translationNote: "中文译文与学习注释由本站依据公版西语原文编写，并非来源站官方译文。",
});

export const readingMaterialsBatch2: ReadingMaterial[] = [
  {
    slug: "el-leon-y-el-raton",
    title: "El león y el ratón",
    chineseTitle: "狮子与老鼠",
    author: "Félix María Samaniego",
    level: "A2",
    minutes: 9,
    summary: "弱小的老鼠报答狮子的宽容，适合学习过去时叙事和动作动词。",
    focus: ["简单过去时", "动作顺序", "请求与回应"],
    paragraphs: [
      {
        spanish: "Estaba un ratoncillo aprisionado en las garras de un león. No fue preso por ladrón de tocino ni de queso, sino porque con otros molestaba al león, que en su retiro descansaba. Pide perdón, llorando su insolencia, y el rey responde: «¡Te perdono!»",
        chinese: "一只小老鼠被困在狮子的爪下。他并不是因为偷了培根或奶酪被抓，而是因为和其他老鼠打扰了正在休息的狮子。他哭着为自己的冒失请求原谅，狮王回答：“我原谅你！”",
      },
      {
        spanish: "Poco después el león tropieza en una red oculta en la maleza. Quiere salir, mas queda prisionero. El libre ratoncillo llega, roe diligente los nudos de la red y al fin rompió los grillos de la fiera.",
        chinese: "不久之后，狮子撞进灌木丛里隐藏的网。他想逃走，却被牢牢困住。自由的小老鼠赶来，勤快地啃咬网结，最终解开了猛兽的束缚。",
      },
      {
        spanish: "Conviene al poderoso para los infelices ser piadoso; tal vez se puede ver necesitado del auxilio de aquel más desdichado.",
        chinese: "强者应当怜悯弱小；因为有一天，他也可能需要那个最不起眼者的帮助。",
      },
    ],
    vocabulary: [
      { word: "aprisionado", meaning: "被囚禁的；被困住的" },
      { word: "las garras", meaning: "爪子" },
      { word: "pedir perdón", meaning: "请求原谅" },
      { word: "la maleza", meaning: "灌木丛；杂草" },
      { word: "roer", meaning: "啃咬", note: "过去时第三人称单数：royó" },
      { word: "el auxilio", meaning: "帮助；援助" },
      { word: "el retiro", meaning: "僻静处；退隐处", note: "本文指狮子休息的地方" },
      { word: "tropezar", meaning: "绊到；偶然碰上", note: "tropezar en una red＝撞上一张网" },
      { word: "la red", meaning: "网；网状物" },
      { word: "piadoso", meaning: "仁慈的；有怜悯心的" },
    ],
    questions: [
      { prompt: "¿Por qué perdonó el león al ratón?", answer: "Porque el ratón pidió perdón y el león decidió mostrar clemencia." },
      { prompt: "¿Cómo liberó el ratón al león?", answer: "Royó los nudos de la red hasta romperla." },
    ],
    writingPrompt: "用 4–6 句西班牙语写一次你帮助别人或得到意外帮助的经历，使用 primero、después 和 al final。",
    source: source("https://es.wikisource.org/wiki/El_le%C3%B3n_y_el_rat%C3%B3n_(Samaniego)"),
  },
  {
    slug: "los-dos-amigos-y-el-oso",
    title: "Los dos amigos y el oso",
    chineseTitle: "两个朋友与熊",
    author: "Félix María Samaniego",
    level: "A2",
    minutes: 10,
    summary: "危险揭示了友谊是否可靠，适合学习反身动词、间接引语和条件关系。",
    focus: ["反身动词", "间接引语", "人物判断"],
    paragraphs: [
      {
        spanish: "A dos amigos se aparece un oso. El uno, muy medroso, en las ramas de un árbol se asegura; el otro, abandonado a la ventura, se finge muerto repentinamente.",
        chinese: "一头熊出现在两个朋友面前。其中一个十分胆小，爬上树枝躲好；另一个被留在原地，只好突然装死。",
      },
      {
        spanish: "El oso se le acerca lentamente; como, según se cuenta, nunca se alimenta de cadáveres, lo registra y toca, le huele las narices y la boca. No siente el aliento ni el menor movimiento, y se va sin recelo.",
        chinese: "熊慢慢靠近他。据说熊不吃尸体，于是它仔细碰触和察看，又闻了闻他的鼻子和嘴。熊感受不到呼吸或丝毫动作，便放心离开了。",
      },
      {
        spanish: "El cobarde baja del árbol, abraza al compañero y pregunta qué recado le decía el oso. El otro responde: «Aparta tu amistad de la persona que si te ve en el riesgo te abandona.»",
        chinese: "胆小的人从树上下来，拥抱同伴，还问熊刚才对他说了什么。另一人回答：“远离那种看见你身陷危险却抛弃你的朋友。”",
      },
    ],
    vocabulary: [
      { word: "medroso", meaning: "胆小的；恐惧的" },
      { word: "fingirse muerto", meaning: "装死" },
      { word: "el cadáver", meaning: "尸体" },
      { word: "el aliento", meaning: "呼吸；气息" },
      { word: "sin recelo", meaning: "毫无疑虑地；放心地" },
      { word: "abandonar", meaning: "抛弃；离开" },
      { word: "la rama", meaning: "树枝" },
      { word: "acercarse", meaning: "靠近", note: "se le acerca＝它向他靠近" },
      { word: "el recado", meaning: "口信；嘱咐", note: "本文以反问引出熊仿佛说过的话" },
      { word: "el riesgo", meaning: "危险；风险" },
    ],
    questions: [
      { prompt: "¿Qué hizo el primer amigo cuando apareció el oso?", answer: "Subió a un árbol y dejó solo a su compañero." },
      { prompt: "¿Qué consejo comunicó el oso, según el segundo amigo?", answer: "Que hay que apartarse de quien abandona a un amigo en peligro." },
    ],
    writingPrompt: "描述你认为可靠的朋友应有的三种行为。写 4–6 句，并至少使用一次 cuando 和 porque。",
    source: source("https://es.wikisource.org/wiki/Los_dos_amigos_y_el_oso"),
  },
  {
    slug: "la-zorra-y-la-gallina",
    title: "La zorra y la gallina",
    chineseTitle: "狐狸与母鸡",
    author: "Félix María Samaniego",
    level: "A2",
    minutes: 9,
    summary: "生病的母鸡识破狐狸假意关心，适合学习礼貌称呼和讽刺式回答。",
    focus: ["usted 称呼", "问候与健康", "表面关心与真实意图"],
    paragraphs: [
      {
        spanish: "Una zorra, cazando, de corral en corral iba saltando. A favor de la noche llega a una aldea y se cuela al gallinero. Las aves se alborotan, menos una, que estaba en una cesta enferma gravemente.",
        chinese: "一只狐狸外出捕猎，从一个鸡圈跳到另一个鸡圈。借着夜色，她来到村庄，钻进鸡舍。所有鸟都惊慌起来，只有一只病得很重、躺在篮子里的母鸡没有动。",
      },
      {
        spanish: "Mirándola astutamente, la zorra pregunta: «¿Qué es eso, pobrecita? ¿Cuál es tu enfermedad? Habla; ¿cómo la pasas, desdichada?»",
        chinese: "狐狸狡猾地看着母鸡问：“怎么了，可怜的小家伙？你得了什么病？说说吧，你现在感觉怎样，不幸的姑娘？”",
      },
      {
        spanish: "La enferma responde apresurada: «Muy mal me va, señora, en este instante; muy bien si usted se quita de delante.» Cuántas veces se vende un enemigo por amigo.",
        chinese: "生病的母鸡立刻回答：“夫人，此刻我感觉很糟；要是您从我眼前消失，我就会好得很。”敌人有多少次把自己伪装成朋友。",
      },
    ],
    vocabulary: [
      { word: "el corral", meaning: "畜栏；鸡圈" },
      { word: "colarse", meaning: "偷偷溜进" },
      { word: "alborotarse", meaning: "慌乱起来；骚动起来" },
      { word: "pobrecita", meaning: "可怜的小家伙", note: "pobre 的指小形式" },
      { word: "¿Cómo la pasas?", meaning: "你过得怎样？你感觉如何？" },
      { word: "quitarse de delante", meaning: "从眼前走开" },
      { word: "la aldea", meaning: "村庄" },
      { word: "el gallinero", meaning: "鸡舍" },
      { word: "la cesta", meaning: "篮子" },
      { word: "en este instante", meaning: "此刻；现在" },
    ],
    questions: [
      { prompt: "¿Por qué no se alborotó la gallina?", answer: "Porque estaba gravemente enferma en una cesta." },
      { prompt: "¿Qué quería decir realmente la gallina?", answer: "Que la presencia de la zorra era una amenaza y estaría mejor si se marchaba." },
    ],
    writingPrompt: "写一段 4–6 句的对话：一个人假装关心，另一个人礼貌但坚定地拒绝。使用 usted 和至少一个问句。",
    source: source("https://es.wikisource.org/wiki/La_zorra_y_la_gallina"),
  },
];
