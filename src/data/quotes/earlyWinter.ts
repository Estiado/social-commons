import { EDITORIAL } from '../../../.artifacts/editorial/quotes/earlyWinter.ts';
import type { IQuote } from '../types';

export const EARLY_WINTER_READINGS: IQuote[] = [
  {
    id: 'q115',
    author: '苏轼',
    source: '《赠刘景文》',
    text: '荷尽已无擎雨盖，菊残犹有傲霜枝。\n一年好景君须记，最是橙黄橘绿时。',
    sourceUrl: 'https://zh.wikisource.org/zh-hans/贈劉景文',
    sourceNote: EDITORIAL['q115.sourceNote'],
    commentary: {
      text: EDITORIAL['q115.commentary'],
      commentator: '香港教育局编选资料',
      commentatorSource: '《积累与感兴》〈赠刘景文〉，赏析重点',
      url: 'https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/chi-edu/resources/primary/lang/jilei_shi_pdf/jilei_shi_082.pdf',
      status: 'verified',
      checkedAt: '2026-11-09',
    },
  },
  {
    id: 'q116',
    author: '朱熹',
    source: '《观书有感·其一》',
    text: '半亩方塘一鉴开，天光云影共徘徊。\n问渠那得清如许？为有源头活水来。',
    sourceUrl: 'https://zh.wikisource.org/zh-hans/觀書有感',
    commentary: {
      text: EDITORIAL['q116.commentary'],
      commentator: '香港教育局编选资料',
      commentatorSource: '《积累与感兴》〈观书有感〉，赏析重点',
      url: 'https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/chi-edu/resources/primary/lang/jilei_shi_pdf/jilei_shi_087.pdf',
      status: 'verified',
      checkedAt: '2026-11-09',
    },
  },
  {
    id: 'q117',
    author: '刘禹锡',
    source: '《秋词·其一》',
    text: '自古逢秋悲寂寥，我言秋日胜春朝。\n晴空一鹤排云上，便引诗情到碧霄。',
    sourceUrl: 'https://zh.wikisource.org/zh-hans/秋詞_(劉禹錫)',
    commentary: {
      text: EDITORIAL['q117.commentary'],
      commentator: '南通大学所载鉴赏',
      commentatorSource: '《刘禹锡〈秋词〉鉴赏》，论后两句',
      url: 'https://sxss.ntu.edu.cn/2018/0302/c6266a165835/page.htm',
      status: 'verified',
      checkedAt: '2026-11-09',
    },
  },
  {
    id: 'q118',
    author: '李白',
    source: '《夜泊牛渚怀古》',
    text: '牛渚西江夜，青天无片云。\n登高望秋月，空忆谢将军。\n余亦能高咏，斯人不可闻。\n明朝挂帆去，枫叶落纷纷。',
    sourceUrl:
      'https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/chi-edu/resources/lit/02_3688.pdf',
    sourceNote: EDITORIAL['q118.sourceNote'],
    commentary: {
      text: EDITORIAL['q118.commentary'],
      commentator: '郑滋斌',
      commentatorSource: '香港教育局刊载《〈诗经·秦风·蒹葭〉的诗义蠡测》，第33页',
      url: 'https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/chi-edu/resources/lit/02_3688.pdf',
      status: 'verified',
      checkedAt: '2026-11-09',
    },
  },
];
