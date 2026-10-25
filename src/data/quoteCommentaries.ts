import { EDITORIAL } from '../../.artifacts/editorial/quoteCommentaries.ts';
import type { IQuote } from './types';

type Commentary = NonNullable<IQuote['commentary']>;
const reviewed = (
  text: string,
  commentator: string,
  commentatorSource: string,
  url: string,
): Commentary => ({
  text,
  commentator,
  commentatorSource,
  url,
  checkedAt: '2026-10-22',
  status: 'verified',
});

// These are short, attributed summaries of the linked published sources.
// Do not add invented quotations, anonymous "scholars", or a bibliography
// that only concerns the author but does not support the displayed claim.
const springMoon = reviewed(
  EDITORIAL['springMoon.arg0'],
  '莫砺锋',
  '《名作欣赏》；中国作家网刊载：《春江花月夜》：千古常新的明月颂歌，2019-08-27',
  'https://www.chinawriter.com.cn/n1/2019/0827/c404064-31318601.html',
);
const lantern = reviewed(
  EDITORIAL['lantern.arg0'],
  '王增宝（介绍王国维的“三种境界”说）',
  '《传记文学》；中国作家网：《“独上高楼，望尽天涯路”——少年王国维》，2022-03-31',
  'https://www.chinawriter.com.cn/n1/2022/0331/c404064-32388558.html',
);
const pavilion = reviewed(
  EDITORIAL['pavilion.arg0'],
  '蒙曼',
  '《蒙曼谈中华诗词之美——诗词是直抵人心的力量》访谈；江汉大学网页刊载，2017-03-13',
  'https://jw.jhun.edu.cn/54/d4/c2227a87252/pagem.htm',
);
const rilke = reviewed(
  EDITORIAL['rilke.arg0'],
  'August Stahl',
  '《“O dieses ist das Tier, das es nicht gibt.”》，Berliner Beiträge zur Hungarologie 14，印刷页 194；匈牙利国家图书馆电子期刊库',
  'https://epa.oszk.hu/02300/02398/00011/pdf/EPA02398_BerlinerBeitrageZurHung_14_187-201.pdf',
);

export const QUOTE_COMMENTARIES: Record<string, Commentary> = {
  q3: pavilion,
  q32: pavilion,
  q6: springMoon,
  q33: springMoon,
  q20: lantern,
  q42: lantern,
  q14: rilke,
  q22: rilke,
  q48: rilke,
  q27: reviewed(
    EDITORIAL['QUOTE_COMMENTARIES.q27.arg0'],
    '余华（作者访谈）',
    '《收获》访谈；中国作家网：《余华访谈：艺术最核心的东西，就是作品里有没有人》，2018-09-01',
    'https://www.chinawriter.com.cn/n1/2018/0901/c405057-30265131.html',
  ),
  q44: reviewed(
    EDITORIAL['QUOTE_COMMENTARIES.q44.arg0'],
    '马俊江',
    '《中国社会科学报》；中国作家网：《“采菊东篱下”的植物人文学解读》，2024-12-04',
    'https://www.chinawriter.com.cn/n1/2024/1204/c442005-40375265.html',
  ),
  q45: reviewed(
    EDITORIAL['QUOTE_COMMENTARIES.q45.arg0'],
    '查屏球（河西学院文学院发布的报告纪要）',
    '河西学院：《复旦大学查屏球教授为文学院师生作报告》，2025-07-07',
    'https://www10.hxu.edu.cn/info/3851/290582.htm',
  ),
};
