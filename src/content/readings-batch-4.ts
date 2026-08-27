import type { ReadingMaterial } from "./readings";

const chemistryBookUrl = "https://openstax.org/books/qu%C3%ADmica-comenzando-%C3%A1tomos-2ed/pages/1-introduccion";
const physicsBookUrl = "https://openstax.org/books/f%C3%ADsica-universitaria-volumen-1/pages/1-introduccion";

const openStaxSource = (url: string, bookUrl: string, editorialNote: string): ReadingMaterial["source"] => ({
  name: "OpenStax",
  url,
  license: "CC BY 4.0",
  retrievedAt: "2026-08-26",
  editorialNote,
  translationNote: "中文学习译文、词汇与练习由本站依据开放许可西语原文编写，并非 OpenStax 官方译文或答案。",
  requiredAttribution: `Acceso gratuito en ${bookUrl}`,
  deepSeekPolicy: {
    enabled: false,
    statementUrl: url,
    statementSummaryZh: "未经 OpenStax 许可，该教材不得用于训练大型语言模型，也不得纳入大型语言模型或生成式 AI 产品。",
  },
});

export const readingMaterialsBatch4: ReadingMaterial[] = [
  {
    slug: "la-quimica-en-la-vida-cotidiana",
    title: "La química en la vida cotidiana",
    chineseTitle: "日常生活中的化学",
    author: "Edward J. Neth, Paul Flowers, Klaus Theopold, Richard Langley y William R. Robinson",
    level: "B1",
    minutes: 11,
    summary: "从起床、咖啡、洗浴到交通，观察一段教材导言如何把抽象学科连接到日常经验。",
    focus: ["日常动作顺序", "泛指与无人称表达", "英西同源学术词"],
    paragraphs: [
      {
        spanish: "Suena el despertador y, después de darle al botón de “posponer\" una o dos veces, se levanta de la cama. Se prepara una taza de café para ponerse en marcha y luego se ducha, se viste, desayuna y comprueba si hay mensajes en su teléfono. De camino a la escuela, se detiene a llenar el tanque de gasolina de su automóvil, lo que hace que casi llegue tarde al primer día de clase de Química.",
        chinese: "闹钟响了；按一两次‘稍后提醒’后，你起床，冲一杯咖啡让自己进入状态，接着洗澡、穿衣、吃早餐并查看手机消息。上学途中，你停车给汽车加油，结果第一堂化学课差点迟到。",
      },
      {
        spanish: "Mientras encuentra un asiento en el aula, lee la pregunta proyectada en la pantalla: “¡Bienvenidos a la clase! ¿Por qué debemos estudiar química?”.",
        chinese: "当你在教室里找座位时，看见屏幕上投出的问题：‘欢迎来上课！我们为什么应该学习化学？’",
      },
      {
        spanish: "¿Tiene una respuesta? Puede que estudie química porque cumple un requisito académico, pero si tiene en cuenta sus actividades cotidianas, puede que la química le resulte interesante por otras razones. Casi todo lo que se hace y se encuentra durante el día tiene que ver con la química. Hacer café, cocer huevos y tostar el pan es algo que tiene que ver con la química.",
        chinese: "你有答案吗？也许你学化学只是为了满足课程要求；但若考虑日常活动，化学还可能因别的理由变得有趣。一天中人们所做、所接触的几乎一切都与化学有关，冲咖啡、煮鸡蛋和烤面包都是例子。",
      },
      {
        spanish: "Los productos que utiliza, como el jabón y el champú, los tejidos que viste, los aparatos electrónicos que lo mantienen conectado al mundo, la gasolina que impulsa su automóvil, todos ellos y otros implican sustancias y procesos químicos. Tanto si es consciente como si no, la química forma parte de su mundo cotidiano. En este curso, aprenderá muchos de los principios esenciales que subyacen en la química de la vida moderna.",
        chinese: "你使用的肥皂和洗发水、身穿的织物、让你与世界保持联系的电子设备，以及驱动汽车的汽油，都涉及化学物质与过程。无论是否意识到，化学都是日常世界的一部分；这门课程将介绍支撑现代生活化学现象的许多基本原理。",
      },
    ],
    vocabulary: [
      { word: "el despertador", meaning: "闹钟" },
      { word: "ponerse en marcha", meaning: "开始运转；进入状态" },
      { word: "de camino a", meaning: "在去……的路上" },
      { word: "cumplir un requisito", meaning: "满足一项要求" },
      { word: "tener en cuenta", meaning: "考虑到" },
      { word: "tener que ver con", meaning: "与……有关" },
      { word: "implicar", meaning: "涉及；意味着", note: "与英语 implicate/implication 相关，但此处常译‘涉及’" },
      { word: "subyacer", meaning: "构成……的基础；潜藏于", note: "第三人称复数：subyacen" },
      { word: "la sustancia", meaning: "物质", note: "本文以复数 sustancias 指各种化学物质" },
      { word: "cotidiano", meaning: "日常的", note: "与英语 quotidian 同源，但西语更常用" },
    ],
    questions: [
      { prompt: "¿Qué actividades de la mañana menciona el texto antes de llegar a clase?", answer: "Menciona levantarse, preparar café, ducharse, vestirse, desayunar, mirar el teléfono y llenar el tanque de gasolina." },
      { prompt: "¿Cómo relaciona el texto la química con la vida cotidiana?", answer: "Enumera alimentos, productos de higiene, tejidos, aparatos electrónicos y combustible que dependen de sustancias y procesos químicos." },
      { prompt: "¿Qué función cumple la pregunta proyectada en la pantalla?", answer: "Introduce el tema y lleva al lector a buscar motivos personales y cotidianos para estudiar química." },
    ],
    writingPrompt: "用 80–110 词西班牙语描述你一天中的五件物品或活动，并说明它们分别与哪一种学科或技术有关。至少使用 tener que ver con 两次。",
    source: openStaxSource(chemistryBookUrl, chemistryBookUrl, "收录第 1 章导言的完整文字段落；排除图片说明与章节目录，未改写原句。"),
  },
  {
    slug: "modelos-teorias-y-leyes-cientificas",
    title: "Modelos, teorías y leyes científicas",
    chineseTitle: "科学模型、理论与定律",
    author: "William Moebs, Samuel J. Ling y Jeff Sanny",
    level: "B2",
    minutes: 18,
    summary: "用玻尔模型等例子辨析模型、理论和定律，并学习科学论证中‘有用但不完整’的表达方式。",
    focus: ["定义与分类", "让步和对比", "科学论证词汇"],
    paragraphs: [
      {
        spanish: "Un modelo es una representación de algo que a menudo es demasiado difícil (o imposible) de mostrar directamente. Aunque un modelo esté justificado por las pruebas experimentales, solo es preciso para describir ciertos aspectos de un sistema físico. Un ejemplo es el modelo de Bohr de los átomos de un solo electrón, en el que el electrón se imagina orbitando el núcleo, de forma análoga a como los planetas orbitan el Sol.",
        chinese: "模型是对某种难以或无法直接展示之物的呈现。即使实验依据支持一个模型，它通常也只能准确描述物理系统的某些方面。玻尔单电子原子模型就是例子：人们想象电子绕原子核运行，类似行星绕太阳运行。",
      },
      {
        spanish: "No podemos observar las órbitas de los electrones directamente, pero la imagen mental sirve para explicar algunas de las observaciones que podemos hacer, como la emisión de luz de los gases calientes (espectros atómicos). Sin embargo, otras observaciones muestran que la imagen del modelo de Bohr no es realmente el aspecto de los átomos. El modelo es \"erróneo\", pero sigue siendo útil para algunos fines. Los físicos utilizan los modelos para diversos fines. Por ejemplo, los modelos permiten a los físicos analizar un escenario y realizar un cálculo, o bien pueden utilizarse para representar una situación en forma de simulación informática. Sin embargo, en última instancia, los resultados de estos cálculos y simulaciones deben comprobarse por otros medios, es decir, por la observación y la experimentación.",
        chinese: "我们不能直接观察电子轨道，但这种心智图像能解释热气体发光等现象。另一方面，其他观察表明玻尔模型并不是原子的真实样貌；它虽‘错误’，在某些目的下仍有用。模型可以帮助物理学家分析情境、计算或建立计算机模拟，不过这些结果最终必须通过观察和实验等其他手段检验。",
      },
      {
        spanish: "La palabra teoría tiene un significado diferente para los científicos que el que suele tener en la conversación cotidiana. En particular, para un científico, una teoría no es lo mismo que una \"conjetura\" o una \"idea\" o incluso una \"hipótesis\". La frase \"es solo una teoría\" podría carecer de sentido y ser una tontería para los científicos, porque la ciencia se basa en la noción de teorías. Para un científico, una teoría es una explicación comprobable de los patrones de la naturaleza apoyada en pruebas científicas y verificada en múltiples ocasiones por varios grupos de investigadores. Algunas teorías incluyen modelos que permiten visualizar los fenómenos, mientras que otras no.",
        chinese: "‘理论’在科学语境与日常对话中含义不同。对科学家而言，理论不等于猜测、想法，甚至也不等于假设；‘这只不过是理论’这种说法可能毫无意义，因为科学本就建立在理论概念上。科学理论是对自然规律的可检验解释，受到科学证据支持，并由多个研究团队反复验证。有些理论包含帮助想象现象的模型，有些则没有。",
      },
      {
        spanish: "La teoría de la gravedad de Newton, por ejemplo, no requiere ningún modelo o imagen mental, porque podemos observar los objetos directamente con nuestros propios sentidos. La teoría cinética de los gases, en cambio, es un modelo en el que se considera que un gas está compuesto por átomos y moléculas. Los átomos y las moléculas son demasiado pequeños para ser observados directamente con nuestros sentidos, por lo que los imaginamos mentalmente para entender lo que los instrumentos nos dicen sobre el comportamiento de los gases. Aunque los modelos solo pretenden describir con precisión ciertos aspectos de un sistema físico, una teoría debe describir todos los aspectos de cualquier sistema que entre en su ámbito de aplicación. En particular, cualquier consecuencia comprobable de una teoría debería verificarse experimentalmente. Si un experimento demuestra que una consecuencia de una teoría es falsa, entonces la teoría se descarta o se modifica convenientemente (por ejemplo, limitando su ámbito de aplicación).",
        chinese: "例如，牛顿引力理论无需心智模型，因为我们可用感官直接观察物体；气体动理论则把气体视为由原子和分子构成。它们小到无法由感官直接观察，因此人们借助想象理解仪器揭示的气体行为。模型只求准确描述系统的某些方面，理论却应覆盖其适用范围内系统的各方面。理论的可检验推论应经实验验证；若实验表明某项推论错误，就应抛弃或适当修改理论，例如缩小适用范围。",
      },
      {
        spanish: "Una ley utiliza un lenguaje conciso para describir un patrón generalizado en la naturaleza apoyado por pruebas científicas y experimentos repetidos. A menudo, una ley puede expresarse en forma de una única ecuación matemática. Las leyes y las teorías son similares en el sentido de que ambas son afirmaciones científicas que resultan de una hipótesis probada y están respaldadas por pruebas científicas. Sin embargo, la designación de ley suele reservarse para un enunciado conciso y muy general que describe fenómenos de la naturaleza, como la ley de que la energía se conserva durante cualquier proceso, o la segunda ley del movimiento de Newton, que relaciona la fuerza (F), la masa (m) y la aceleración (a) mediante la sencilla ecuación F=ma. Una teoría, en cambio, es una declaración menos concisa del comportamiento observado. Por ejemplo, la teoría de la evolución y la teoría de la relatividad no pueden expresarse de forma suficientemente concisa para ser consideradas leyes. La mayor diferencia entre una ley y una teoría es que una teoría es mucho más compleja y dinámica. Una ley describe una sola acción, mientras que una teoría explica todo un grupo de fenómenos relacionados.",
        chinese: "定律用简洁语言描述自然界中受到科学证据和重复实验支持的一般模式，往往能写成单一数学方程。定律与理论都是经检验假设产生、由证据支持的科学陈述；不过‘定律’通常指简洁而高度概括的自然现象陈述，如能量守恒或以 F=ma 连接力、质量与加速度的牛顿第二定律。理论对已观察行为的陈述不那么简短；演化论和相对论就无法简化到成为定律。二者最大差别在于，定律描述单一作用，理论则解释一整组相关现象，因而更复杂、更动态。",
      },
    ],
    vocabulary: [
      { word: "estar justificado por", meaning: "得到……的根据或支持" },
      { word: "la prueba experimental", meaning: "实验证据" },
      { word: "de forma análoga a", meaning: "以类似于……的方式" },
      { word: "en última instancia", meaning: "归根结底；最终" },
      { word: "la conjetura", meaning: "猜想；推测" },
      { word: "comprobable", meaning: "可检验的" },
      { word: "el ámbito de aplicación", meaning: "适用范围" },
      { word: "respaldar", meaning: "支持；为……背书" },
      { word: "la representación", meaning: "表示；表征；模型", note: "representación de algo＝对某物的呈现" },
      { word: "descartar", meaning: "排除；弃用", note: "se descarta 表示理论被弃用" },
    ],
    questions: [
      { prompt: "¿Por qué puede seguir siendo útil un modelo considerado erróneo?", answer: "Porque puede describir ciertos aspectos del sistema y explicar algunas observaciones, aunque no represente toda la realidad." },
      { prompt: "¿Qué debe ocurrir si un experimento contradice una consecuencia comprobable de una teoría?", answer: "La teoría debe descartarse o modificarse, por ejemplo limitando su ámbito de aplicación." },
      { prompt: "¿Cuál es la diferencia principal entre una ley y una teoría según el texto?", answer: "Una ley describe de forma concisa una acción o patrón, mientras que una teoría explica un conjunto complejo de fenómenos relacionados." },
    ],
    writingPrompt: "用 120–150 词西班牙语解释一个你熟悉的模型（地图、天气预报、经济模型等）：它能解释什么、忽略什么、应如何检验。使用 aunque、sin embargo 和 en última instancia。",
    source: openStaxSource(
      "https://openstax.org/books/f%C3%ADsica-universitaria-volumen-1/pages/1-1-el-alcance-y-la-escala-de-la-fisica",
      physicsBookUrl,
      "连续节选该节关于模型、理论与定律的正文；排除中间插图及图注，未改写原句，学习页仅合并相邻段落。",
    ),
  },
];
