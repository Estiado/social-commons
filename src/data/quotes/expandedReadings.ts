import { EDITORIAL } from '../../../.artifacts/editorial/quotes/expandedReadings.ts';
import type { IQuote } from '../types';

// Revisions retain the original IDs. Readers' saved documents are independent
// snapshots, so extending a catalogue passage must not rewrite their anchors.
export const EXPANDED_READINGS: Record<string, Partial<IQuote>> = {
  q3: {
    text: '时维九月，序属三秋。潦水尽而寒潭清，烟光凝而暮山紫。俨骖騑于上路，访风景于崇阿。临帝子之长洲，得天人之旧馆。\n\n层峦耸翠，上出重霄；飞阁流丹，下临无地。鹤汀凫渚，穷岛屿之萦回；桂殿兰宫，即冈峦之体势。\n\n披绣闼，俯雕甍，山原旷其盈视，川泽纡其骇瞩。闾阎扑地，钟鸣鼎食之家；舸舰弥津，青雀黄龙之舳。云销雨霁，彩彻区明。落霞与孤鹜齐飞，秋水共长天一色。渔舟唱晚，响穷彭蠡之滨；雁阵惊寒，声断衡阳之浦。',
    source: '《滕王阁序》写景部分节选',
    context: EDITORIAL['EXPANDED_READINGS.q3.context'],
  },
  q6: {
    text: '春江潮水连海平，海上明月共潮生。\n滟滟随波千万里，何处春江无月明！\n江流宛转绕芳甸，月照花林皆似霰；\n空里流霜不觉飞，汀上白沙看不见。\n江天一色无纤尘，皎皎空中孤月轮。\n江畔何人初见月？江月何年初照人？\n人生代代无穷已，江月年年望相似。\n不知江月待何人，但见长江送流水。\n\n白云一片去悠悠，青枫浦上不胜愁。\n谁家今夜扁舟子？何处相思明月楼？\n可怜楼上月徘徊，应照离人妆镜台。\n玉户帘中卷不去，捣衣砧上拂还来。\n此时相望不相闻，愿逐月华流照君。\n鸿雁长飞光不度，鱼龙潜跃水成文。\n\n昨夜闲潭梦落花，可怜春半不还家。\n江水流春去欲尽，江潭落月复西斜。\n斜月沉沉藏海雾，碣石潇湘无限路。\n不知乘月几人归，落月摇情满江树。',
    context: EDITORIAL['EXPANDED_READINGS.q6.context'],
    sourceUrl: 'https://www.chinawriter.com.cn/n1/2019/0827/c404064-31318601.html',
  },
  q9: {
    text: '壬戌之秋，七月既望，苏子与客泛舟游于赤壁之下。清风徐来，水波不兴。举酒属客，诵明月之诗，歌窈窕之章。\n\n少焉，月出于东山之上，徘徊于斗牛之间。白露横江，水光接天。纵一苇之所如，凌万顷之茫然。浩浩乎如冯虚御风，而不知其所止；飘飘乎如遗世独立，羽化而登仙。',
    source: '《赤壁赋》开篇节选',
    context: EDITORIAL['EXPANDED_READINGS.q9.context'],
  },
  q16: {
    text: '一别都门三改火，天涯踏尽红尘。\n依然一笑作春温。无波真古井，有节是秋筠。\n\n惆怅孤帆连夜发，送行淡月微云。\n尊前不用翠眉颦。人生如逆旅，我亦是行人。',
    source: '《临江仙·送钱穆父》',
  },
  q17: {
    text: '细草微风岸，危樯独夜舟。\n星垂平野阔，月涌大江流。\n名岂文章著，官应老病休。\n飘飘何所似，天地一沙鸥。',
  },
  q18: {
    text: '夫天地者，万物之逆旅也；光阴者，百代之过客也。而浮生若梦，为欢几何？古人秉烛夜游，良有以也。\n\n况阳春召我以烟景，大块假我以文章。会桃花之芳园，序天伦之乐事。群季俊秀，皆为惠连；吾人咏歌，独惭康乐。幽赏未已，高谈转清。\n\n开琼筵以坐花，飞羽觞而醉月。不有佳咏，何伸雅怀？如诗不成，罚依金谷酒数。',
    source: '《春夜宴从弟桃花园序》',
    context: EDITORIAL['EXPANDED_READINGS.q18.context'],
  },
  q19: {
    text: '老少同一死，贤愚无复数。\n日醉或能忘，将非促龄具？\n立善常所欣，谁当为汝誉？\n甚念伤吾生，正宜委运去。\n纵浪大化中，不喜亦不惧。\n应尽便须尽，无复独多虑。',
    source: '《形影神·神释》结尾节选',
  },
  q20: {
    text: '东风夜放花千树，更吹落、星如雨。\n宝马雕车香满路。凤箫声动，玉壶光转，一夜鱼龙舞。\n\n蛾儿雪柳黄金缕，笑语盈盈暗香去。\n众里寻他千百度。蓦然回首，那人却在，灯火阑珊处。',
    sourceUrl:
      'https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/chi-edu/recommended-passages/KS4_17c.pdf',
  },
  q23: {
    title: '我用什么才能留住你',
    text: '我给你贫穷的街道、绝望的日落、破败郊区的月亮。\n我给你一个久久地望着孤月的人的悲哀。',
    source: '《英文诗两首》之二，常以《我用什么才能留住你》为题流传',
    sourceUrl: 'https://m.thepaper.cn/baijiahao_19606792',
    context: EDITORIAL['EXPANDED_READINGS.q23.context'],
    sourceNote: EDITORIAL['EXPANDED_READINGS.q23.sourceNote'],
  },
  q31: {
    text: '朝发轫于苍梧兮，夕余至乎县圃。\n欲少留此灵琐兮，日忽忽其将暮。\n吾令羲和弭节兮，望崦嵫而勿迫。\n路漫漫其修远兮，吾将上下而求索。',
    source: '《离骚》节选',
    context: EDITORIAL['EXPANDED_READINGS.q31.context'],
  },
  q34: {
    text: '锦瑟无端五十弦，一弦一柱思华年。\n庄生晓梦迷蝴蝶，望帝春心托杜鹃。\n沧海月明珠有泪，蓝田日暖玉生烟。\n此情可待成追忆，只是当时已惘然。',
  },
  q35: {
    text: '一曲新词酒一杯，去年天气旧亭台。夕阳西下几时回？\n\n无可奈何花落去，似曾相识燕归来。小园香径独徘徊。',
    sourceUrl:
      'https://www.edb.gov.hk/tc/curriculum-development/kla/chi-edu/resources/secondary-edu/lang/reciting-mp3.html',
  },
  q36: {
    text: '莫听穿林打叶声，何妨吟啸且徐行。\n竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。\n\n料峭春风吹酒醒，微冷，山头斜照却相迎。\n回首向来萧瑟处，归去，也无风雨也无晴。',
    source: '《定风波·莫听穿林打叶声》',
    sourceUrl: 'https://www.chinawriter.com.cn/wxpl/2014/2014-05-13/203498.html',
  },
  q38: {
    sourceNote: EDITORIAL['EXPANDED_READINGS.q38.sourceNote'],
  },
  q41: {
    text: '风急天高猿啸哀，渚清沙白鸟飞回。\n无边落木萧萧下，不尽长江滚滚来。\n万里悲秋常作客，百年多病独登台。\n艰难苦恨繁霜鬓，潦倒新停浊酒杯。',
  },
  q43: { text: '生当作人杰，死亦为鬼雄。\n至今思项羽，不肯过江东。' },
  q44: {
    text: '结庐在人境，而无车马喧。\n问君何能尔？心远地自偏。\n采菊东篱下，悠然见南山。\n山气日夕佳，飞鸟相与还。\n此中有真意，欲辨已忘言。',
    sourceUrl:
      'https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/chi-edu/recommended-passages/KS4_11.pdf',
  },
  q45: {
    text: '君不见黄河之水天上来，奔流到海不复回。\n君不见高堂明镜悲白发，朝如青丝暮成雪。\n人生得意须尽欢，莫使金樽空对月。\n天生我材必有用，千金散尽还复来。\n烹羊宰牛且为乐，会须一饮三百杯。\n\n岑夫子，丹丘生，将进酒，杯莫停。\n与君歌一曲，请君为我倾耳听。\n钟鼓馔玉不足贵，但愿长醉不复醒。\n古来圣贤皆寂寞，惟有饮者留其名。\n陈王昔时宴平乐，斗酒十千恣欢谑。\n主人何为言少钱，径须沽取对君酌。\n五花马，千金裘，呼儿将出换美酒，与尔同销万古愁。',
    context: EDITORIAL['EXPANDED_READINGS.q45.context'],
  },
  q46: {
    text: '我闻琵琶已叹息，又闻此语重唧唧。\n同是天涯沦落人，相逢何必曾相识！\n我从去年辞帝京，谪居卧病浔阳城。\n浔阳地僻无音乐，终岁不闻丝竹声。\n住近湓江地低湿，黄芦苦竹绕宅生。\n其间旦暮闻何物？杜鹃啼血猿哀鸣。\n春江花朝秋月夜，往往取酒还独倾。',
    source: '《琵琶行》诗人回应部分节选',
    context: EDITORIAL['EXPANDED_READINGS.q46.context'],
  },
};

export const QUOTE_ALIASES: Record<string, string> = {
  q21: 'q12',
  q47: 'q12',
  q22: 'q14',
  q48: 'q14',
  q32: 'q3',
  q33: 'q6',
  q42: 'q20',
  q50: 'q23',
};
