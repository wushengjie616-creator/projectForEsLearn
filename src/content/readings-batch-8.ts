import type { ReadingMaterial } from "./readings";

export const readingMaterialsBatch8: ReadingMaterial[] = [
  {
    slug: "la-ia-y-el-significado-de-la-literatura",
    title: "La IA y el significado de la literatura",
    chineseTitle: "人工智能与文学的意义",
    author: "Zhaiyk Sultan",
    level: "B2",
    minutes: 15,
    summary: "思考人工智能能否超越语言模仿，真正参与文学中的历史记忆、道德推理与批判思考。",
    focus: ["论点与限定", "AI 和人文学词汇", "对比与反驳"],
    paragraphs: [
      {
        spanish: "La IA nos seduce con la promesa de unir pasado y presente, haciendo que las tradiciones literarias sean más accesibles, más vivas.",
        chinese: "人工智能以连接过去与现在的承诺吸引我们，仿佛能让文学传统更容易接触，也更有生命力。",
      },
      {
        spanish: "La IA puede asistir en el análisis textual, el aprendizaje de idiomas e incluso la experimentación creativa. La verdadera literatura no es solo modelo: es significado. Y ninguna máquina puede simular la lucha humana por significado. La poesía generada por IA al estilo de Abai o Zhumabayev es una aproximación, una simulación, no una extensión de su legado intelectual.",
        chinese: "人工智能可以辅助文本分析、语言学习，甚至创作实验。但真正的文学不只是一种模式，更是意义；机器无法模拟人类追寻意义的挣扎。以阿拜或茹马巴耶夫风格生成的诗，是近似与模拟，而不是其思想遗产的延伸。",
      },
      {
        spanish: "Para implicarnos de manera significativa con las tradiciones literarias kazajas, debemos reconocer que la literatura no es simplemente un conjunto de patrones lingüísticos, sino un vehículo para pensamiento crítico, razonamiento moral y conciencia histórica. La IA puede asistir en el estudio de estas tradiciones, pero no puede participar en ellas como un agente intelectual. El peligro, entonces, no es que la IA vaya a reemplazar a los escritores humanos —no lo hará, porque no puede— sino que podamos confundir sus resultados con algo que no son. Hacerlo sería malinterpretar fundamentalmente tanto la naturaleza de la IA como la esencia de la creatividad humana misma.",
        chinese: "要真正理解哈萨克文学传统，就必须认识到文学并非一组语言模式，而是批判思考、道德推理和历史意识的载体。人工智能能辅助研究，却不能作为思想主体参与其中。危险不在于它会取代作家——它既不会也不能——而在于人们可能把其产出误认成并非其所是之物，从根本上误解人工智能与人类创造力。",
      },
      {
        spanish: "La cuestión no es si la IA puede escribir como Abai, sino si nosotros, como humanos, podemos seguir pensando críticamente sobre las implicaciones del papel de la IA en la producción de conocimiento.",
        chinese: "问题不在于人工智能能否像阿拜那样写作，而在于我们作为人类，能否继续批判性地思考人工智能在知识生产中所扮演角色的影响。",
      },
      {
        spanish: "La IA puede tener un lugar en la educación literaria – pero solo como herramienta para la investigación, nunca como sustituto del trabajo ético e intelectual de los escritores humanos.",
        chinese: "人工智能可以在文学教育中占有一席之地，但只能作为研究工具，绝不能替代人类作家的伦理与思想劳动。",
      },
    ],
    vocabulary: [
      { word: "seducir con la promesa de", meaning: "以……的承诺吸引" },
      { word: "la experimentación creativa", meaning: "创作实验" },
      { word: "una aproximación", meaning: "近似物；接近但不完全相同的结果" },
      { word: "el legado intelectual", meaning: "思想遗产" },
      { word: "implicarse con", meaning: "深入参与；认真理解" },
      { word: "el razonamiento moral", meaning: "道德推理" },
      { word: "un agente intelectual", meaning: "思想主体；知识活动参与者" },
      { word: "las implicaciones", meaning: "影响；深层含义", note: "与英语 implications 同源" },
      { word: "la conciencia histórica", meaning: "历史意识" },
      { word: "el sustituto", meaning: "替代品；替代者", note: "sustituto de＝……的替代品" },
    ],
    questions: [
      { prompt: "¿Qué usos positivos de la IA reconoce el autor?", answer: "Reconoce que puede ayudar en el análisis textual, el aprendizaje de idiomas, la experimentación creativa y la investigación." },
      { prompt: "¿Por qué distingue el autor entre simulación y legado intelectual?", answer: "Porque imitar patrones o estilos no equivale a poseer conciencia histórica, razonamiento moral ni intención intelectual." },
      { prompt: "¿Cuál es el peligro principal que identifica el texto?", answer: "Que confundamos los resultados de la IA con creatividad o participación intelectual humana auténtica." },
    ],
    writingPrompt: "用 130–170 词西班牙语回应作者：选一个你赞成或反对的论点，先准确概括，再给出例子和限定。至少使用 no solo... sino、sin embargo 和 la cuestión no es... sino...。",
    source: {
      name: "UNESCO IdeasLAB",
      url: "https://www.unesco.org/es/articles/simulando-el-alma-la-ia-y-el-legado-de-la-literatura-kazaja",
      license: "CC BY-SA 3.0 IGO",
      retrievedAt: "2026-08-27",
      editorialNote: "节选文章结论五段；改动为去除 HTML span 并规范化不换行空格。排除 AdobeStock 图片、参考文献、作者简介和第三方素材，未改写所选措辞。学习加工按相同许可证共享。",
      translationNote: "中文学习译文、词汇、问题与写作任务是本站制作的衍生学习内容，并按 CC BY-SA 3.0 IGO 共享；不代表 UNESCO 的官方译文、立场或教学答案。",
      requiredAttribution: "Zhaiyk Sultan, «Simulando el alma: la IA y el legado de la literatura kazaja», UNESCO IdeasLAB, CC BY-SA 3.0 IGO.",
      derivativeNotice: "La presente publicación no es una publicación oficial de la UNESCO y no debe considerarse como tal.",
    },
  },
];
