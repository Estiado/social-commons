import { EDITORIAL } from '../../.artifacts/editorial/quotes.ts';
import type { IQuote } from './types';
import { QUOTE_COMMENTARIES } from './quoteCommentaries.ts';
import { CLASSICAL_PASSAGES } from './quotes/classicalPassages.ts';
import { EXPANDED_READINGS, QUOTE_ALIASES } from './quotes/expandedReadings.ts';
import { PUBLISHED_COMMENTARIES } from './quotes/publishedCommentaries.ts';
import { EXTENDED_CLASSICS, EXTENDED_COMMENTARIES } from './quotes/extendedClassics.ts';
import { DWELLING_AND_TIME } from './quotes/dwellingAndTime.ts';
import { TIME_AND_ATTENTION } from './quotes/timeAndAttention.ts';
import { FRIENDSHIP_READINGS, FRIENDSHIP_COMMENTARIES } from './quotes/friendshipAndNature.ts';

// IDs remain stable for existing links. Unverified legacy commentary was
// withdrawn; only specifically sourced, reviewed summaries are published.
const QUOTE_TEXTS: Omit<IQuote, 'commentary'>[] = [
  {
    id: 'q1',
    text: '我们都在阴沟里，但仍有人仰望星空。',
    author: '奥斯卡·王尔德',
    source: '《温德米尔夫人的扇子》第三幕',
  },
  {
    id: 'q2',
    text: '人生不是一支短短的蜡烛，而是一支由我们暂时拿着的火炬。我们一定要把它燃得十分光明灿烂，然后交给下一代的人们。',
    author: '萧伯纳',
    source: '萧伯纳演讲与书信集（常被引述，确切出处有争议）',
  },
  {
    id: 'q3',
    text: '落霞与孤鹜齐飞，秋水共长天一色。',
    author: '王勃',
    source: '《滕王阁序》',
  },
  {
    id: 'q4',
    text: '真正的发现之旅不在于寻找新的风景，而在于拥有新的眼睛。',
    author: '马塞尔·普鲁斯特',
    source: '《追忆似水年华》第五卷《女囚》',
  },
  {
    id: 'q5',
    text: '万物皆有裂痕，那是光照进来的地方。',
    author: '莱昂纳德·科恩',
    source: '歌曲《Anthem》(1992)',
  },
  {
    id: 'q6',
    text: '江畔何人初见月？江月何年初照人？人生代代无穷已，江月年年望相似。',
    author: '张若虚',
    source: '《春江花月夜》',
  },
  {
    id: 'q7',
    text: '一个人知道自己为什么而活，就可以忍受任何一种生活。',
    author: '弗里德里希·尼采',
    source: '《偶像的黄昏》(1889)',
  },
  {
    id: 'q8',
    text: '我所有的花，都从我的灰烬里长出。',
    author: '安妮·塞克斯顿',
    source: '《The Starry Night》(1962)',
    sourceNote: EDITORIAL['QUOTE_TEXTS.q8.sourceNote'],
  },
  {
    id: 'q9',
    text: '纵一苇之所如，凌万顷之茫然。',
    author: '苏轼',
    source: '《前赤壁赋》',
  },
  {
    id: 'q10',
    text: '我们终此一生，就是要摆脱他人的期待，找到真正的自己。',
    author: '埃莱娜·费兰特',
    source: '《我的天才女友》(那不勒斯四部曲之一)',
    sourceNote: EDITORIAL['QUOTE_TEXTS.q10.sourceNote'],
  },
  {
    id: 'q11',
    text: '无穷的远方，无数的人们，都和我有关。',
    author: '鲁迅',
    source: '《且介亭杂文末编·这也是生活》',
  },
  {
    id: 'q12',
    text: '在隆冬，我终于知道，我身上有一个不可战胜的夏天。',
    author: '阿尔贝·加缪',
    source: '《夏天集·重返蒂巴萨》',
  },
  {
    id: 'q13',
    text: '破山中贼易，破心中贼难。',
    author: '王阳明',
    source: '《传习录》引王阳明《与杨仕德薛尚谦书》',
  },
  {
    id: 'q14',
    text: '有何胜利可言，挺住意味着一切。',
    author: '赖内·马利亚·里尔克',
    source: '《安魂曲·为沃尔夫·冯·卡尔克罗伊特而作》（1908）；中文为常见译法',
  },
  {
    id: 'q15',
    text: '所谓无底深渊，下去，也是前程万里。',
    author: '木心',
    source: '《素履之往》',
  },
  {
    id: 'q16',
    text: '人生如逆旅，我亦是行人。',
    author: '苏轼',
    source: '《临江仙·送钱穆父》',
  },
  {
    id: 'q17',
    text: '星垂平野阔，月涌大江流。',
    author: '杜甫',
    source: '《旅夜书怀》',
  },
  {
    id: 'q18',
    text: '天地者，万物之逆旅；光阴者，百代之过客。',
    author: '李白',
    source: '《春夜宴从弟桃花园序》',
  },
  {
    id: 'q19',
    text: '纵浪大化中，不喜亦不惧。',
    author: '陶渊明',
    source: '《神释》',
  },
  {
    id: 'q20',
    text: '众里寻他千百度，蓦然回首，那人却在，灯火阑珊处。',
    author: '辛弃疾',
    source: '《青玉案·元夕》',
  },
  {
    id: 'q21',
    text: '在隆冬，我终于知道，我身上有一个不可战胜的夏天。',
    author: '阿尔贝·加缪',
    source: '《重返蒂巴萨》',
  },
  {
    id: 'q22',
    text: '有何胜利可言，挺住意味着一切。',
    author: '里尔克',
    source: '《安魂曲·为沃尔夫·冯·卡尔克罗伊特而作》（1908）；中文为常见译法',
  },
  {
    id: 'q23',
    text: '我给你一个从未有过信仰的人的忠诚。',
    author: '豪尔赫·路易斯·博尔赫斯',
    source: '《我用什么才能留住你》',
  },
  {
    id: 'q24',
    text: '她那时候还太年轻，不知道所有命运赠送的礼物，早已在暗中标好了价格。',
    author: '斯蒂芬·茨威格',
    source: '《断头王后》',
  },
  {
    id: 'q25',
    text: '命定的局限尽可永在，不屈的挑战却不可须臾或缺。',
    author: '史铁生',
    source: '《我与地坛》',
  },
  {
    id: 'q26',
    text: '一个人只拥有此生此世是不够的，他还应该拥有诗意的世界。',
    author: '王小波',
    source: '《万寿寺》',
  },
  {
    id: 'q27',
    text: '人是为了活着本身而活着，而不是为了活着之外的任何事物而活着。',
    author: '余华',
    source: '《活着》',
  },
  {
    id: 'q28',
    text: '人诗意地栖居在大地上。',
    author: '弗里德里希·荷尔德林',
    source: '《人，诗意地栖居》',
  },
  {
    id: 'q29',
    text: '我行过许多地方的桥，看过许多次数的云，喝过许多种类的酒，却只爱过一个正当最好年龄的人。',
    author: '沈从文',
    source: '《湘行书简》（沈从文致张兆和的书信；版本页码待核对）',
    sourceNote: EDITORIAL['QUOTE_TEXTS.q29.sourceNote'],
  },
  {
    id: 'q30',
    text: '我所有的一切都被剥夺了，除了一个——那就是我还可以选择自己面对这一切的方式。',
    author: '维克多·弗兰克尔',
    source: '《活出生命的意义》',
  },
  {
    id: 'q31',
    text: '路漫漫其修远兮，吾将上下而求索。',
    author: '屈原',
    source: '《离骚》',
  },
  {
    id: 'q32',
    text: '落霞与孤鹜齐飞，秋水共长天一色。',
    author: '王勃',
    source: '《滕王阁序》',
  },
  {
    id: 'q33',
    text: '江畔何人初见月？江月何年初照人？',
    author: '张若虚',
    source: '《春江花月夜》',
  },
  {
    id: 'q34',
    text: '此情可待成追忆，只是当时已惘然。',
    author: '李商隐',
    source: '《锦瑟》',
  },
  {
    id: 'q35',
    text: '无可奈何花落去，似曾相识燕归来。',
    author: '晏殊',
    source: '《浣溪沙》',
  },
  {
    id: 'q36',
    text: '回首向来萧瑟处，归去，也无风雨也无晴。',
    author: '苏轼',
    source: '《定风波》',
  },
  {
    id: 'q37',
    text: '凡不能毁灭我的，必使我更强大。',
    author: '弗里德里希·尼采',
    source: '《偶像的黄昏》',
  },
  {
    id: 'q38',
    text: '向死而生。',
    author: '马丁·海德格尔',
    source: '《存在与时间》',
  },
  {
    id: 'q39',
    text: '对于不可说的，必须保持沉默。',
    author: '路德维希·维特根斯坦',
    source: '《逻辑哲学论》',
  },
  {
    id: 'q40',
    text: '幸福的家庭都是相似的，不幸的家庭各有各的不幸。',
    author: '列夫·托尔斯泰',
    source: '《安娜·卡列尼娜》',
  },
  {
    id: 'q41',
    text: '无边落木萧萧下，不尽长江滚滚来。',
    author: '杜甫',
    source: '《登高》',
  },
  {
    id: 'q42',
    text: '众里寻他千百度，蓦然回首，那人却在，灯火阑珊处。',
    author: '辛弃疾',
    source: '《青玉案·元夕》',
  },
  {
    id: 'q43',
    text: '生当作人杰，死亦为鬼雄。',
    author: '李清照',
    source: '《夏日绝句》',
  },
  {
    id: 'q44',
    text: '采菊东篱下，悠然见南山。',
    author: '陶渊明',
    source: '《饮酒·其五》',
  },
  {
    id: 'q45',
    text: '天生我材必有用，千金散尽还复来。',
    author: '李白',
    source: '《将进酒》',
  },
  {
    id: 'q46',
    text: '同是天涯沦落人，相逢何必曾相识。',
    author: '白居易',
    source: '《琵琶行》',
  },
  {
    id: 'q47',
    text: '在隆冬，我终于知道，我身上有一个不可战胜的夏天。',
    author: '阿尔贝·加缪',
    source: '《夏天集》',
  },
  {
    id: 'q48',
    text: '有何胜利可言，挺住意味着一切。',
    author: '赖内·马利亚·里尔克',
    source: '《安魂曲·为沃尔夫·冯·卡尔克罗伊特而作》（1908）；中文为常见译法',
  },
  {
    id: 'q49',
    text: '目的虽有，却无路可循；我们称之为路的，无非是踌躇。',
    author: '弗朗茨·卡夫卡',
    source: '《卡夫卡箴言录》',
  },
  {
    id: 'q50',
    text: '我给你我写的书中所能包含的一切悟力、我生活中所能有的男子气概或幽默。',
    author: '豪尔赫·路易斯·博尔赫斯',
    source: '《我用什么才能留住你》',
  },
];

const readingTexts: IQuote[] = [
  ...QUOTE_TEXTS,
  ...CLASSICAL_PASSAGES,
  ...EXTENDED_CLASSICS,
  ...FRIENDSHIP_READINGS,
  ...TIME_AND_ATTENTION,
  ...DWELLING_AND_TIME,
];

const readings = new Map(
  readingTexts.map((quote) => {
    const revised = { ...quote, ...EXPANDED_READINGS[quote.id] };
    return [
      quote.id,
      {
        ...revised,
        commentary:
          quote.commentary ||
          FRIENDSHIP_COMMENTARIES[quote.id] ||
          EXTENDED_COMMENTARIES[quote.id] ||
          PUBLISHED_COMMENTARIES[quote.id] ||
          QUOTE_COMMENTARIES[quote.id],
      },
    ];
  }),
);

export const QUOTES: IQuote[] = [...readings.values()].map((quote) => {
  const canonicalId = QUOTE_ALIASES[quote.id];
  return canonicalId ? { ...readings.get(canonicalId)!, id: quote.id, canonicalId } : quote;
});

// Retain unresolved legacy URLs, but do not recommend uncertain attributions.
const unresolved = new Set(['q8', 'q10']);
export const QUOTE_CATALOGUE = QUOTES.filter(
  (quote) => !quote.canonicalId && !unresolved.has(quote.id),
);

export function getRandomQuote(): IQuote {
  return QUOTE_CATALOGUE[Math.floor(Math.random() * QUOTE_CATALOGUE.length)];
}
export function getQuoteById(id: string): IQuote | undefined {
  return QUOTES.find((quote) => quote.id === id);
}
