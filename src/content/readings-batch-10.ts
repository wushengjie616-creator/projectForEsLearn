import type { ReadingMaterial } from "./readings";

export const readingMaterialsBatch10: ReadingMaterial[] = [
  {
    slug: "movimiento-y-fuerza",
    title: "Movimiento y fuerza",
    chineseTitle: "运动与力",
    author: "Luis García Cabello",
    level: "B1",
    minutes: 15,
    summary: "用足球、接触、重力与磁铁等熟悉例子理解运动如何改变，以及力可以怎样分类。",
    focus: ["科学定义", "分类表达", "条件句", "同源词辨认"],
    paragraphs: [
      {
        spanish: "Podemos llamar movimiento al cambio de posición que experimenta un cuerpo en el espacio en un período de tiempo determinado. El movimiento está directamente relacionado con la fuerza, puesto que esta es capaz de iniciar, detener o modificar un movimiento. Un cuerpo en reposo jamás se moverá si no se ejerce una fuerza sobre él. Por ejemplo: un balón de fútbol jamás se moverá hasta que sea golpeado por alguien.",
        chinese: "我们可以把运动称为物体在一定时间内发生的位置变化。运动与力直接相关，因为力能够使运动开始、停止或发生改变。若没有力作用在静止物体上，它就不会运动。例如，足球只有被人踢到之后才会移动。",
      },
      {
        spanish: "Igualmente, un movimiento no se pararía si no se ejerciera ninguna fuerza sobre él. Sin embargo, esto no quiere decir que si golpeamos una pelota, esta seguirá moviéndose indefinidamente porque sobre ella siempre actúan una serie de fuerzas que estudiaremos a continuación.",
        chinese: "同样，如果没有任何力作用，运动也不会停止。不过，这并不意味着我们踢出一个球后，它会永远运动下去，因为总有一系列力作用在球上；下文将会介绍这些力。",
      },
      {
        spanish: "Dependiendo de si los elementos se rozan o no, podemos clasificar las fuerzas en: Fuerza de contacto Para que se dé este tipo de fuerza es necesario que haya contacto físico entre los dos cuerpos.",
        chinese: "根据物体之间是否相互接触，我们可以给力分类。第一类是接触力：要产生这种力，两个物体之间必须有物理接触。",
      },
      {
        spanish: "Dependiendo de la duración del contacto, las podemos dividir en dos categorías: Instantáneas: solo actúan sobre un breve instante de tiempo sobre los cuerpos, dando lugar a movimientos uniformes. Continuas: actúan de forma continuada sobre los cuerpos dando lugar a movimientos acelerados.",
        chinese: "根据接触持续的时间，接触力还可分成两类：瞬时力只在很短的时间内作用于物体，产生匀速运动；持续力则连续作用于物体，产生加速运动。",
      },
      {
        spanish: "Fuerza de empuje: esta fuerza se presenta en los cuerpos sumergidos en fluidos y tiene sentido contrario al de la gravedad. Arquímedes estableció que era proporcional al volumen de líquido desplazado por el cuerpo. Fuerza normal: es la fuerza que ejerce una superficie sobre un cuerpo. Es de la misma dirección, pero de sentido contrario a la fuerza que ejerce el cuerpo sobre la superficie. Es perpendicular a la superficie.",
        chinese: "浮力出现在浸入流体的物体上，方向与重力相反。阿基米德指出，它与物体排开的液体体积成正比。支持力则是表面对物体施加的力：它与物体压向表面的力方向在同一直线上、朝向相反，并且垂直于表面。",
      },
      {
        spanish: "Fuerza de tensión: se presenta al tirar de un cable, cuerda o resorte. Fuerza de rozamiento: es una fuerza que se ejerce cuando dos cuerpos diferentes están en contacto. Esta fuerza siempre posee sentido opuesto al movimiento pues nace como una resistencia de los cuerpos al movimiento. Varía dependiendo del tipo de superficie.",
        chinese: "拉动缆线、绳子或弹簧时会出现张力。摩擦力则在两个不同物体接触时产生；它始终与运动方向相反，因为它是物体对运动的阻力，并会随表面种类而变化。",
      },
      {
        spanish: "Es la fuerza que puede ejercerse sin contacto físico alguno entre los cuerpos. Los tipos más importantes son: Fuerza de gravedad: es la que ejerce la masa de los cuerpos sobre los objetos cercanos, atrayéndolos hacia sí. El principal ejemplo es la fuerza de atracción que ejerce la Tierra sobre los cuerpos que están sobre ella.",
        chinese: "另一类力无需物体发生任何物理接触就能作用，叫作非接触力。其中，重力是有质量的物体吸引附近物体的力；最典型的例子就是地球对其表面物体产生的吸引力。",
      },
      {
        spanish: "Fuerza eléctrica: es la fuerza que se da entre dos o más cargas eléctricas. Si son del mismo signo, se repelen; si son de distinto signo, se atraen. Magnetismo: son características de los imanes. Son fuerzas de atracción (entre partículas con carga diferente) o repulsión (entre partículas con la misma cargas) entre campos electromagnéticos.",
        chinese: "电力发生在两个或更多电荷之间：同号电荷相斥，异号电荷相吸。磁力是磁铁的特性，表现为电磁场之间的吸引或排斥。原文最后一句有数的一致性问题，本站为忠实保存而没有静默改写。",
      },
    ],
    vocabulary: [
      { word: "el movimiento", meaning: "运动", note: "与英语 movement 同源" },
      { word: "ejercer una fuerza", meaning: "施加一个力" },
      { word: "puesto que", meaning: "因为；鉴于" },
      { word: "en reposo", meaning: "处于静止状态" },
      { word: "rozarse", meaning: "相互摩擦；接触磨蹭" },
      { word: "dar lugar a", meaning: "导致；产生" },
      { word: "el empuje", meaning: "推力；此处指浮力" },
      { word: "el rozamiento", meaning: "摩擦；摩擦力" },
      { word: "sumergido", meaning: "浸没的；潜入水中的" },
      { word: "atraer / repeler", meaning: "吸引 / 排斥" },
    ],
    questions: [
      { prompt: "¿Qué puede hacer una fuerza con un movimiento?", answer: "Puede iniciarlo, detenerlo o modificarlo." },
      { prompt: "¿Cuál es la diferencia básica entre una fuerza de contacto y una fuerza a distancia?", answer: "La primera requiere contacto físico entre cuerpos; la segunda puede actuar sin contacto." },
      { prompt: "¿Por qué una pelota no sigue moviéndose indefinidamente después de golpearla?", answer: "Porque sobre ella actúan otras fuerzas, como el rozamiento." },
      { prompt: "¿Qué ocurre entre cargas eléctricas del mismo signo?", answer: "Se repelen." },
    ],
    writingPrompt: "选择生活中的一个运动物体，用 100–130 词西班牙语说明哪些力让它开始、改变或停止运动。至少使用 puesto que、si、sin embargo 和 dependiendo de。",
    source: {
      name: "INTEF",
      url: "https://descargas.intef.es/recursos_educativos/It_didac/CCNN/5/08/La_fuerza_y_sus_efectos/movimiento_y_fuerza.html",
      license: "CC BY-SA 4.0",
      retrievedAt: "2026-08-27",
      editorialNote: "完整收录正文讲解部分；去除网页导航、互动练习、视频链接、图片与第三方媒体，只规范化不换行和零宽空格。段内为学习显示合并标题或相邻原段，未改写来源措辞；原文可疑语法也予以保留和提示。",
      translationNote: "中文译文、词汇、问题与写作任务由本站制作，并按 CC BY-SA 4.0 作为衍生学习内容共享；不是 INTEF 的官方中文版本或标准答案。",
      requiredAttribution: "Luis García Cabello, «Movimiento y fuerza», itinerario «La fuerza y sus efectos», INTEF, 2022, CC BY-SA 4.0.",
    },
  },
];
