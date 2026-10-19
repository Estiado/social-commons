import type { IQuote } from './types';

// EXPORTS: QUOTES, getRandomQuote, getQuoteById

export const QUOTES: IQuote[] = [
  {
    id: 'q1',
    text: '我们都在阴沟里，但仍有人仰望星空。',
    author: '奥斯卡·王尔德',
    source: '《温德米尔夫人的扇子》',
    context: '第三幕，达林顿勋爵所言。王尔德用这句话定义了一种在困境中保持精神高贵的姿态。',
  },
  {
    id: 'q2',
    text: '人生不是一支短短的蜡烛，而是一支由我们暂时拿着的火炬。我们一定要把它燃得十分光明灿烂，然后交给下一代的人们。',
    author: '萧伯纳',
    source: '《人与超人》',
  },
  {
    id: 'q3',
    text: '落霞与孤鹜齐飞，秋水共长天一色。',
    author: '王勃',
    source: '《滕王阁序》',
    context: '一句写尽秋日江天的辽阔与苍茫，一千三百年后读来仍如在目前。',
  },
  {
    id: 'q4',
    text: '真正的发现之旅不在于寻找新的风景，而在于拥有新的眼睛。',
    author: '马塞尔·普鲁斯特',
    source: '《追忆似水年华》',
  },
  {
    id: 'q5',
    text: '万物皆有裂痕，那是光照进来的地方。',
    author: '莱昂纳德·科恩',
    source: '歌曲《Anthem》',
    context: '科恩用诗人的方式说出了不完美的意义——完美是封闭的，裂痕才让光有了入口。',
  },
  {
    id: 'q6',
    text: '江畔何人初见月？江月何年初照人？人生代代无穷已，江月年年望相似。',
    author: '张若虚',
    source: '《春江花月夜》',
    context: '孤篇盖全唐。在时间的长河里，人是短暂的，月是永恒的；但代代相续的凝望，本身就是一种永恒。',
  },
  {
    id: 'q7',
    text: '一个人知道自己为什么而活，就可以忍受任何一种生活。',
    author: '弗里德里希·尼采',
    source: '《偶像的黄昏》',
  },
  {
    id: 'q8',
    text: '我所有的花，都从我的灰烬里长出。',
    author: '安妮·塞克斯顿',
    source: '《The Starry Night》',
    context: '美国自白派诗人的句子。毁灭不是终点，灰烬是下一次生长的土壤。',
  },
  {
    id: 'q9',
    text: '纵一苇之所如，凌万顷之茫然。',
    author: '苏轼',
    source: '《赤壁赋》',
    context: '一叶扁舟，万顷江面。苏轼在被贬谪的途中写出了中国文学史上最旷达的句子之一。',
  },
  {
    id: 'q10',
    text: '我们终此一生，就是要摆脱他人的期待，找到真正的自己。',
    author: '埃莱娜·费兰特',
    source: '《我的天才女友》',
  },
];

export function getRandomQuote(): IQuote {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

export function getQuoteById(id: string): IQuote | undefined {
  return QUOTES.find((q) => q.id === id);
}
