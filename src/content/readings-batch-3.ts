import type { ReadingMaterial } from "./readings";

const source = (editorialNote: string): ReadingMaterial["source"] => ({
  name: "Project Gutenberg",
  url: "https://www.gutenberg.org/ebooks/52262",
  license: "Project Gutenberg License; public domain in the USA",
  retrievedAt: "2026-08-26",
  editorialNote,
  translationNote: "中文学习译文、词汇与练习由本站依据 1833 年西语译本编写，并非来源站官方译文。",
});

const attribution = {
  author: "Washington Irving",
  translator: "Luis Lamarca",
} as const;

export const readingMaterialsBatch3: ReadingMaterial[] = [
  {
    slug: "gobierno-de-la-alhambra",
    title: "Gobierno de la Alhambra",
    chineseTitle: "阿尔罕布拉宫的治理",
    ...attribution,
    level: "B2",
    minutes: 24,
    summary: "从王室堡垒到衰败遗迹，追踪阿尔罕布拉宫的权力、破坏与修复；原文保留 1833 年历史拼写。",
    focus: ["历史叙事与时间线", "无人称与被动结构", "历史拼写辨认"],
    paragraphs: [
      {
        spanish: "Es la Alhambra una fortaleza antigua, ó un palacio fortificado, desde cuya morada dominaban los reyes moros de Granada su ponderado paraiso terrenal, y en donde estuvo la última silla de su imperio en España. El palacio forma solo una parte de la fortaleza, cuyas almenadas murallas se estienden en direccion irregular en derredor de la cresta de una elevada colina que se desprende de la cadena de montes nevados y domina la ciudad. En tiempo de los moros podia esta fortaleza contener en su recinto un egército de cuarenta mil hombres, y no pocas veces sirvió á los soberanos de asilo contra sus vasallos sublevados. Despues de haber pasado el reino á manos de los cristianos, siguió la Alhambra siendo una morada real, y la habitaron algunas veces los monarcas castellanos. Cárlos V comenzó á levantar un palacio dentro de sus muros; mas los repetidos terremotos no dejaron llevar adelante esta empresa. Los últimos reyes que habitaron este edificio, fueron Felipe V y su esposa la reina Isabel de Parma, al principio del siglo diez y ocho.",
        chinese: "阿尔罕布拉宫是一座古老堡垒，也可说是一座设防宫殿。格拉纳达的摩尔国王曾从这里统治他们备受赞美的人间乐园，这里也是其帝国在西班牙最后的王座。宫殿只是堡垒的一部分，带垛口的城墙沿高丘山脊曲折延伸，俯瞰全城。摩尔人时代，堡内可容纳四万人的军队，也常成为君主躲避叛乱臣民的庇护所。王国落入基督徒手中后，它仍是王室居所；查理五世曾在城墙内兴建宫殿，却因多次地震未能完工。最后居住于此的国王是十八世纪初的腓力五世及其妻帕尔马的伊莎贝尔王后。",
      },
      {
        spanish: "Hiciéronse grandes preparativos para recibirlos, se reparó el palacio y los jardines, y se construyeron nuevas habitaciones, que fueron ricamente adornadas por artistas italianos. Mas á pesar de todo, despues de la mansion pasagera de estos príncipes, la Alhambra quedó de nuevo desierta y desolada, si bien se conservaba siempre en ella un estado militar y guarnicion bastante numerosa. El gobernador era nombrado directamente por el rey, y su jurisdiccion se estendia hasta los arrabales de la ciudad, sin ninguna dependencia del capitan general de Granada. Habitaba la parte que corresponde á la fachada del antiguo palacio, y jamas bajaba á Granada sin algun aparato militar. La fortaleza era en efecto una pequeña ciudad, pues que contenia muchas calles, un convento de franciscos y una iglesia parroquial.",
        chinese: "为迎接他们，人们大作准备：修缮宫殿与花园、增建房间，并请意大利艺术家华丽装饰。可是这些王公短暂停留后，阿尔罕布拉宫又变得荒凉，尽管仍保持军事编制和人数可观的驻军。总督由国王直接任命，管辖范围延伸到城郊，不受格拉纳达都督节制。他住在旧宫殿正面一带，每次下到格拉纳达都带着军事排场。堡垒实际上像一座小城，里面有多条街道、方济各会修道院和一座堂区教堂。",
      },
      {
        spanish: "Pero el abandono de la córte fue un golpe fatal para la Alhambra: sus hermosas salas fueron deteriorándose de dia en dia, quedando muchas del todo arruinadas; destruyéronse los jardines, y las fuentes cesaron de correr. Un enjambre de vagabundos se fue apoderando poco á poco de las partes desiertas de los edificios; los contrabandistas se aprovechaban de la independencia de su jurisdiccion para seguir con seguridad sus criminales operaciones; los ladrones, los pícaros de todas clases se refugiaban en su recinto, y dirigian desde allí sus tiros sobre Granada y sus inmediaciones. Por fin, puso el gobierno la mano, y desapareció este desórden: la plaza fue enteramente purificada, quedando solo en ella aquellos moradores de notoria honradez, y cuyo derecho de residencia era incontestable; demoliéronse la mayor parte de las casas, y únicamente se conservó una pequeña aldea, el convento y la parroquia. Durante las últimas guerras de la península, habiendo ocupado los franceses á Granada, pusieron una guarnicion en la Alhambra: alojóse el comandante en el palacio, y este monumento de la grandeza y de la elegancia de los moros, se salvó entonces de una completa devastacion por efecto de aquel gusto ilustrado que distingue á la nacion francesa. Se repararon los techos, y lo que quedaba de las salas y las galerías fue puesto á cubierto de la injuria del tiempo; se cultivaron los jardines, pusiéronse corrientes los conductos del agua, y volvió á saltar esta en medio de las flores: de modo que España debe á sus invasores la conservacion del mas hermoso y mas interesante de sus monumentos históricos.",
        chinese: "然而宫廷的离去给阿尔罕布拉宫以致命一击：华美厅堂日益破败，许多完全坍毁；花园遭破坏，喷泉也停止流动。流浪者逐渐占据荒废建筑，走私者借独立管辖之便继续非法活动，盗贼与各色无赖以此为藏身处，向格拉纳达及周边下手。政府最终介入，清理堡区，只留下品行公认端正且居住权无可争议的人；多数房屋被拆，仅保留一个小村落、修道院和教堂。半岛战争后期，法军占领格拉纳达并在宫内驻军。指挥官住进宫殿，而这座体现摩尔人宏伟与优雅的古迹，因法国人推崇文化的品味免于彻底毁坏。屋顶得到修复，残存厅廊免受风雨侵蚀；花园重新耕作，水道恢复，水又在花间喷涌。作者因而作出颇具争议的判断：西班牙最美且最有意义的历史古迹之一，竟由入侵者保存下来。",
      },
      {
        spanish: "Antes de evacuar la fortaleza, volaron los franceses muchas torres de la muralla esterior é inutilizaron las fortificaciones; y como desde entonces no existe ya la importancia militar de esta plaza, su guarnicion consiste únicamente en algunos inválidos, cuyo principal servicio está reducido á guardar las torres esteriores, que suelen servir para prision de reos de estado. El mismo gobernador ha abandonado ya las alturas de la Alhambra y vive en el centro de Granada, en donde le es mucho mas fácil comunicarse con el gobierno.",
        chinese: "撤离堡垒前，法军炸毁了外墙的许多塔楼，使防御工事失去作用。此后这里不再具有军事重要性，驻军只剩一些伤残军人，主要职责是看守外塔；这些塔常被用作关押政治犯的监狱。总督本人也已离开阿尔罕布拉宫高地，住到格拉纳达市中心，以便与政府联络。",
      },
      {
        spanish: "No puedo terminar esta breve noticia sin dar testimonio de la exactitud y laudable celo con que el actual comandante de la Alhambra D. Francisco de la Serna, llena los deberes de su destino, y emplea los cortos recursos de que puede disponer en reparar las ruinas del palacio, y retardar por medio de sabias precauciones una ruina que por desgracia es sobrado cierta. Si hubiesen hecho otro tanto sus predecesores, este monumento conservaria aun casi toda su belleza primitiva, y si el gobierno ausiliase los buenos deseos de este benemérito oficial, aquellos preciosos vestigios adornarian aun el pais por largo tiempo, y de todos los puntos de la tierra conducirian á él á los curiosos ilustrados.",
        chinese: "作者在结束这段简述前，赞扬当时的阿尔罕布拉宫指挥官弗朗西斯科·德拉塞尔纳认真尽职。他用有限资源修补宫殿废墟，并以审慎措施延缓那不幸却几乎确定的毁坏。若前任们也如此行事，这座古迹本可保留近乎全部原初之美；若政府支持这位有功官员的善意，这些珍贵遗存还会长久装点国土，吸引世界各地有见识的访客。",
      },
    ],
    vocabulary: [
      { word: "la fortaleza", meaning: "堡垒；要塞" },
      { word: "la almena", meaning: "城垛；雉堞" },
      { word: "la guarnición", meaning: "驻军", note: "原文写作 guarnicion，现代拼写带重音" },
      { word: "el arrabal", meaning: "城郊；城外居民区" },
      { word: "deteriorarse", meaning: "逐渐损坏、恶化" },
      { word: "poner la mano", meaning: "介入、着手处理", note: "这里不是字面上的‘把手放上去’" },
      { word: "evacuar", meaning: "撤离" },
      { word: "el vestigio", meaning: "遗迹；残存痕迹" },
      { word: "la jurisdicción", meaning: "管辖权；管辖范围", note: "原文历史拼写为 jurisdiccion" },
      { word: "la devastación", meaning: "毁坏；破坏", note: "原文历史拼写为 devastacion" },
    ],
    questions: [
      { prompt: "¿Qué funciones tuvo la Alhambra después de pasar a manos cristianas?", answer: "Siguió siendo residencia real, mantuvo gobernador y guarnición, y funcionó como una pequeña ciudad fortificada." },
      { prompt: "¿Qué contraste presenta el autor sobre la ocupación francesa?", answer: "Los franceses repararon y conservaron el palacio, pero antes de retirarse destruyeron torres y fortificaciones." },
      { prompt: "¿Qué condición imagina el autor para conservar mejor el monumento?", answer: "Que los predecesores hubieran cuidado el edificio y que el gobierno apoyara al comandante encargado de repararlo." },
    ],
    writingPrompt: "用 100–140 词西班牙语概括这座古迹的‘兴盛—衰败—修复’时间线，并用 sin embargo 指出作者叙述中的一处矛盾。",
    source: source("完整章节进入原文库；学习页合并原始换行但不现代化拼写，并按原段落提供学习译文。"),
  },
  {
    slug: "tradiciones-locales",
    title: "Tradiciones locales",
    chineseTitle: "地方传说",
    ...attribution,
    level: "B2",
    minutes: 22,
    summary: "作者解释阿尔罕布拉藏宝传说如何由历史事实、民间想象与叙述者的加工共同形成。",
    focus: ["观点与证据", "传说叙事词汇", "长句中的关系从句"],
    paragraphs: [
      {
        spanish: "El pueblo español tiene una pasion oriental á los cuentos, y señaladamente á los que refieren acontecimientos maravillosos. Es muy comun en España el ver á las gentes vulgares reunidas en un corro á la puerta de sus cabañas, ó bajo las inmensas campanas de las chimeneas de las ventas, escuchando embelesadas las leyendas en que se trata de las peligrosas aventuras de los viageros, ó de las refriegas de los ladrones y contrabandistas. Pero los temas favoritos de estas historias son los tesoros escondidos por los moros: al atravesar aquellas montañas desiertas, teatro otro tiempo de tantos combates gloriosos, no encuentra el viagero una sola atalaya puesta sobre un pico elevado en medio de las rocas, ó dominando un lugarejo que parece abierto á pico en la peña, sin que el mozo que le acompaña no se quite el cigarro de la boca para referirle alguna conseja de las monedas árabes que están enterradas bajo sus cimientos. Ni se halla tampoco un solo alcázar en las ciudades que no tenga tambien su historia dorada, trasmitida entre los pobres del pueblo de generacion en generacion.",
        chinese: "作者说，西班牙民众热爱故事，尤其喜爱奇异事件。人们常在小屋门口围坐，或聚在客栈巨大壁炉罩下，入迷地听旅人险遇、盗匪与走私者冲突的传说。但最受欢迎的主题是摩尔人埋藏的宝藏：经过荒山上的瞭望塔或岩壁村落时，随行青年总会讲起地基下的阿拉伯钱币；城中的宫堡似乎也无不拥有一则代代流传的黄金故事。这里的概括带有十九世纪旅行者的主观视角。",
      },
      {
        spanish: "Estas tradiciones, como la mayor parte de las fábulas populares, deben su orígen á algunos hechos verdaderos. Durante las guerras de moros y cristianos, que afligieron por tanto tiempo el pais, los castillos y las ciudades mudaban de dueño con gran frecuencia, y sus habitantes cuando se veían sitiados, solian enterrar sus alhajas y dinero en las cuevas y en los pozos, como se practica aun en las naciones guerreras del oriente. En la época de la espulsion de los moros, muchos de ellos escondieron los efectos mas preciosos que poseían, con la esperanza de regresar muy pronto á su tierra natal y recobrar su tesoro. Ello es cierto que algunas veces cavando entre las ruinas, ó en las inmediaciones de las casas ó palacios moriscos, se han hallado arcas llenas de monedas de oro y de plata, que vuelven á ver la luz despues de haber estado enterradas por espacio de muchos años; y basta un corto número de estos hechos para dar lugar á mil fábulas.",
        chinese: "这些传说与多数民间故事一样，可能源于某些真实事件。摩尔人与基督徒长期战争时，城堡和城市频繁易主，被围困的居民常把珠宝和金钱埋进洞穴与井中。摩尔人被驱逐时，许多人也藏起最贵重的物品，希望不久后返回故土取回。废墟或摩尔式住宅、宫殿附近确实偶尔出土装满金银币的箱子；少数事实，已经足以生出上千则传说。",
      },
      {
        spanish: "Estas historias se presentan con aquella reunion de gótico y oriental, que en mi concepto caracteriza todos los usos y rasgos esenciales de las costumbres de España, señaladamente en las provincias meridionales: el tesoro escondido está siempre protegido por un encanto; unas veces le defiende un horrible dragon, otras le guardan unos moros encantados, que al cabo de siglos permanecen aun armados de punta en blanco, con la espada desnuda é inmóviles como unas estátuas, en el sitio donde fueron enterradas sus riquezas.",
        chinese: "这些故事融合了作者所谓的哥特与东方色彩；在他看来，这种结合尤其能代表西班牙南部的习俗。藏宝总受魔法保护：有时由可怕的龙守护，有时由中了魔法的摩尔人看守；数百年过去，他们仍全副武装、拔剑在手，像雕像一样立在财富埋藏之处。",
      },
      {
        spanish: "Es muy natural que la Alhambra, en razon de las circunstancias particulares de su historia, preste materia mas amplia á estas ficciones que ninguno de los otros lugares célebres en las crónicas; y algunos vestigios encontrados de tarde en tarde entre sus ruinas, han acreditado las maravillosas tradiciones que sobre ellos andan esparcidas. En una ocasion se desenterró una olla llena de oro, y el esqueleto de un gallo; y los mas inteligentes en estas materias, opinaron que esta ave habia sida enterrada viva. En otro tiempo se descubrió una caja, y dentro de ella se halló un grande escarabajo cubierto de inscripciones árabes, que se creyó fuesen palabras mágicas de gran virtud. En una palabra, los ingenios mas aventajados de la poblacion andrajosa de la Alhambra, se han devanado los sesos hasta lograr que no hubiese en esta antigua fortaleza una torre, una sala, ni una bóveda sin su correspondiente historia prodigiosa. Creo que los capítulos anteriores habrán familiarizado ya á mis lectores con las localidades de este palacio, y así voy á engolfarme atrevidamente en sus pasmosas leyendas, que me ha sido preciso restaurar enteramente, reuniendo los fragmentos que me fueron contados en diferentes épocas y por distintas personas; bien así como un sábio anticuario suele formar un documento histórico con algunas letras sueltas de una inscripcion medio borrada por el tiempo.",
        chinese: "阿尔罕布拉宫历史特殊，自然比其他名胜更能为幻想提供素材；遗址中偶尔发现的物件也加强了相关传说。一次有人挖出盛满黄金的罐子和一具公鸡骨架，懂行者认为那只鸟曾被活埋。另一次发现一只盒子，里面的大甲虫刻满阿拉伯文字，人们以为是法力强大的咒语。于是当地善讲故事的人绞尽脑汁，几乎让堡内每座塔、每个厅堂和拱顶都有奇谈。作者承认，接下来要把不同时间、不同讲述者提供的碎片重新拼成传说，就像古物学家用残缺铭文的零散字母组成历史文献。",
      },
      {
        spanish: "Si el lector encontrase en mis relaciones alguna cosa increible, tenga la bondad de considerar que el sitio en que me hallo no puede gobernarse por las leyes de la probabilidad que rigen en las escenas de la vida comun. El suelo que piso está encantado, y los acontecimientos mas tribiales reciben en él un aspecto sobrenatural y maravilloso.",
        chinese: "如果读者觉得这些叙述里有难以置信之处，请记住：作者所在之地不受日常生活的概率法则支配。他脚下的土地中了魔法，最平凡的事件也会在这里呈现超自然、奇妙的面貌。",
      },
    ],
    vocabulary: [
      { word: "la venta", meaning: "（旧时道路旁的）客栈", note: "此处不是‘出售’" },
      { word: "el viajero", meaning: "旅行者", note: "原文历史拼写为 viagero" },
      { word: "la atalaya", meaning: "瞭望塔" },
      { word: "la conseja", meaning: "民间故事；传闻" },
      { word: "el alcázar", meaning: "城堡式宫殿" },
      { word: "el encanto", meaning: "魔法；魅力", note: "此处指保护宝藏的魔法" },
      { word: "devanarse los sesos", meaning: "绞尽脑汁" },
      { word: "engolfarse", meaning: "投身、沉浸于某事" },
      { word: "el tesoro", meaning: "宝藏；财富" },
      { word: "la bóveda", meaning: "拱顶；穹顶空间", note: "原文指宫殿中被附上传说的空间" },
    ],
    questions: [
      { prompt: "¿Qué hechos históricos propone el narrador como origen de las leyendas?", answer: "Los asedios, los cambios de dueño y la expulsión llevaron a muchas personas a esconder joyas y dinero; algunos tesoros fueron encontrados después." },
      { prompt: "¿Cómo reconoce el narrador su propio papel en la creación de las leyendas?", answer: "Dice que reunió fragmentos contados por distintas personas y que tuvo que restaurarlos como un anticuario reconstruye una inscripción." },
      { prompt: "¿Qué efecto produce el último párrafo?", answer: "Invita al lector a suspender la incredulidad y prepara el paso de una explicación histórica a relatos maravillosos." },
    ],
    writingPrompt: "选择一个你熟悉的地方传说，用 120–160 词西班牙语分别写出‘可核查事实’和‘后来的想象’，最后说明两者怎样混合。",
    source: source("完整章节进入原文库；学习页合并原始换行但不现代化拼写，并对作者的时代性概括加以提示。"),
  },
  {
    slug: "la-casa-del-gallo",
    title: "La Casa del Gallo",
    chineseTitle: "风信鸡之屋",
    ...attribution,
    level: "B2",
    minutes: 13,
    summary: "一座被遗忘的城堡、一尊会转向的青铜骑士，以及历史解释与魔法传说之间的转换。",
    focus: ["地点与器物描写", "历史解释和传说对照", "关系代词与过去时"],
    paragraphs: [
      {
        spanish: "En la cumbre de la alta colina del Albaicin, que es el barrio mas elevado de Granada, se ven los restos de un castillo levantado poco despues de la conquista de España por los árabes. Al presente está trasformado en una fábrica, y ha caido en tal olvido, que á pesar del ausilio que me prestaba el sapientísimo Mateo, me costó gran trabajo el descubrirle. Este edificio conserva aun el nombre con que fue conocido por espacio de algunos siglos; esto es, el de casa del Gallo de viento. Se llamó así por tener en la parte superior una figura de bronce que giraba á modo de veleta á todos vientos, y representaba un guerrero á caballo, armado de lanza y adarga, con dos versos árabes, que dicen así traducidos al castellano: «Dice el sábio Aben-Habuz / Que así se defiende el andaluz.»",
        chinese: "格拉纳达最高的街区阿尔拜辛坐落在高丘上，山顶可见一座城堡遗迹，它建于阿拉伯人征服西班牙后不久。作者到访时，那里已变成工厂并几乎被遗忘；即使博学的马特奥相助，他也费了很大力气才找到。这座建筑仍保留流传数百年的名字——‘风信鸡之屋’。屋顶曾有一尊青铜像，像风向标一样随风转动，形象是手持长矛和皮盾的骑士。像上还有两行阿拉伯诗句，译成西语意为：‘智者阿本-哈布斯说，安达卢西亚人就是这样保卫自己。’",
      },
      {
        spanish: "Este Aben-Habuz, segun las crónicas árabes, fue uno de los capitanes de Tarik, quien le nombró alcaide de Granada; y es probable que hiciese erigir dicha efigie guerrera, para recordar á los habitantes musulmanes del pais, que hallándose como se hallaban rodeados de enemigos, su seguridad exigia que estuviesen á toda hora prontos á combatir.",
        chinese: "据阿拉伯编年史，阿本-哈布斯是塔里克的一名将领，后来被任命为格拉纳达长官。他很可能命人竖立这尊武士像，提醒当地穆斯林居民：既然四面受敌，为了安全就必须时刻准备战斗。",
      },
      {
        spanish: "Sin embargo, las tradiciones populares esplican de otro modo lo que concierne á Aben-Habuz y su palacio, y nos enseñan que el guerrero de bronce fue en su orígen un talisman que tenia oculta una gran virtud; mas que con el tiempo ha perdido su poder mágico, quedando reducido á una simple veleta.",
        chinese: "然而民间传统对阿本-哈布斯及其宫殿另有解释：青铜武士原本是一件暗藏强大法力的护符，只是随着时间流逝失去了魔力，最终退化成普通风向标。",
      },
      {
        spanish: "Estas tradiciones son las que me he propuesto dejar consignadas en el capítulo siguiente.",
        chinese: "作者说，下一章将把这些传说记录下来。",
      },
    ],
    vocabulary: [
      { word: "la cumbre", meaning: "山顶；顶峰" },
      { word: "el auxilio", meaning: "帮助；援助", note: "原文历史拼写为 ausilio" },
      { word: "la veleta", meaning: "风向标" },
      { word: "la adarga", meaning: "皮盾；摩尔式盾牌" },
      { word: "el alcaide", meaning: "堡垒或城镇的长官" },
      { word: "erigir", meaning: "竖立；建立" },
      { word: "el talismán", meaning: "护符；法器", note: "原文写作 talisman" },
      { word: "dejar consignado", meaning: "书面记录下来" },
      { word: "el guerrero", meaning: "战士；武士" },
      { word: "estar pronto a", meaning: "准备好做……", note: "本文 estar prontos á combatir＝随时准备战斗" },
    ],
    questions: [
      { prompt: "¿Por qué recibió el edificio el nombre de Casa del Gallo de viento?", answer: "Porque tenía arriba una figura de bronce que giraba como una veleta y representaba a un guerrero a caballo." },
      { prompt: "¿Qué función histórica pudo tener la figura, según el narrador?", answer: "Pudo recordar a los habitantes que debían estar siempre preparados para combatir." },
      { prompt: "¿En qué se diferencia la explicación popular?", answer: "La tradición dice que la figura era un talismán con poder mágico que acabó convertido en una simple veleta." },
    ],
    writingPrompt: "用 80–120 词西班牙语描写一件真实地标，并分别给它写一个理性解释和一个超自然传说；使用 sin embargo 连接两种版本。",
    source: source("完整章节进入原文库；学习页保留全文，合并原始换行，并在正文显示中去除纯文本转写所用的下划线强调符。"),
  },
];
