import type { ReadingMaterial } from "./readings";

export const readingMaterialsBatch13: ReadingMaterial[] = [
  {
    slug: "los-alimentos-y-las-estaciones",
    title: "Los alimentos y las estaciones",
    chineseTitle: "食物与四季",
    author: "Rocío Diestro Sánchez",
    level: "A2",
    minutes: 10,
    summary: "用四季食物清单学习季节、月份、颜色和常见果蔬词汇，并辨别教材例子与普遍事实的区别。",
    focus: ["四季与月份", "果蔬词汇", "地点限定", "命令式任务"],
    paragraphs: [
      {
        spanish: "No en todas las épocas del año se pueden comer los mismos alimentos. Los alimentos que sólo se pueden comer en una estación determinada del año, se les llaman alimentos de temporada. Esto quiere decir que sólo los encontraremos en invierno, en primavera, en verano o en otoño. A continuación, vamos a ver algunos de estos alimentos y la estación en la que los podemos encontrar:",
        chinese: "一年中不同时间能获得的食物并不完全相同。原文把只在特定季节找到的食物称为时令食物，并将例子分到冬、春、夏、秋四季。这里是入门教材的简化定义；真实供应会受地点、半球、种植方式和运输影响。",
      },
      {
        spanish: "INVIERNO: Espinacas, piña, uvas, granada, coles...",
        chinese: "冬季：菠菜、菠萝、葡萄、石榴、卷心菜等。",
      },
      {
        spanish: "PRIMAVERA: Fresa, ciruela, níspero, espárragos, guisantes...",
        chinese: "春季：草莓、李子、枇杷、芦笋、豌豆等。",
      },
      {
        spanish: "VERANO: Berenjena, cereza, melón, sandía, arándano...",
        chinese: "夏季：茄子、樱桃、甜瓜、西瓜、蓝莓等。",
      },
      {
        spanish: "OTOÑO: Calabaza, castañas, setas, mandarina, dátiles...",
        chinese: "秋季：南瓜、栗子、蘑菇、橘子、椰枣等。",
      },
      {
        spanish: "Diseña un calendario anual con los alimentos de temporada. Escribe el nombre de los meses del año según la siguiente leyenda y dibuja debajo de cada uno de ellos, algunos de los alimentos que puedes encontrar. Leyenda: Azul: Los meses de invierno. Verde: Los meses de primavera. Rojo: Los meses de verano. Marrón: Los meses de otoño.",
        chinese: "设计一份时令食物年历：按照图例写出各月份，并在每个月下画出能找到的一些食物。冬季月份用蓝色，春季用绿色，夏季用红色，秋季用棕色。",
      },
    ],
    vocabulary: [
      { word: "la época", meaning: "时期；时节" },
      { word: "la estación", meaning: "季节；车站", note: "本文指季节" },
      { word: "de temporada", meaning: "当季的；时令的" },
      { word: "el invierno", meaning: "冬季" },
      { word: "la primavera", meaning: "春季" },
      { word: "el verano", meaning: "夏季" },
      { word: "el otoño", meaning: "秋季" },
      { word: "la berenjena", meaning: "茄子" },
      { word: "el níspero", meaning: "枇杷" },
      { word: "los guisantes", meaning: "豌豆" },
      { word: "las setas", meaning: "蘑菇；食用菌" },
      { word: "debajo de", meaning: "在……下面" },
    ],
    questions: [
      { prompt: "¿Cómo define el texto los alimentos de temporada?", answer: "Como alimentos que se encuentran en una estación determinada del año." },
      { prompt: "¿En qué estación coloca el texto la sandía y el melón?", answer: "En verano." },
      { prompt: "¿Qué color corresponde a la primavera en la leyenda?", answer: "El verde." },
      { prompt: "¿Por qué no debemos tratar la lista como una regla universal?", answer: "Porque la disponibilidad depende del lugar, el hemisferio, el cultivo y la cadena de suministro." },
    ],
    writingPrompt: "调查你所在地区一种水果或蔬菜的真实上市季节，用 80–110 词西班牙语写一张‘时令卡片’，并与原文清单比较。至少使用 en mi región、mientras que、depender de 和 se puede encontrar。",
    source: {
      name: "INTEF",
      url: "https://descargas.intef.es/recursos_educativos/It_didac/CCNN/1/05/Nuestra_alimentacion/los_alimentos_y_las_estaciones.html",
      license: "CC BY-SA 4.0",
      retrievedAt: "2026-08-27",
      editorialNote: "完整保存定义、四季示例和日历任务；仅规范化 HTML 与不换行空格。排除教师导语、导航、图片、下载模板及第三方媒体。原文清单是该教材的示例，不作为跨地区事实：实际时令受地点与供应链影响，学习译文显式补充此限定。",
      translationNote: "中文译文、事实限定、词汇、问题与写作任务由本站制作，并按 CC BY-SA 4.0 共享；不是 INTEF 官方译文或全球时令指南。",
      requiredAttribution: "Rocío Diestro Sánchez, «Los alimentos y las estaciones», itinerario «Nuestra alimentación», INTEF, 2022, CC BY-SA 4.0.",
    },
  },
];
