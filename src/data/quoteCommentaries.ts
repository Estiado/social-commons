import type { IQuote } from './types';

type Commentary = NonNullable<IQuote['commentary']>;
const reviewed = (text: string, commentator: string, commentatorSource: string, url: string): Commentary => ({
  text, commentator, commentatorSource, url, checkedAt: '2026-10-22', status: 'verified',
});

// These are short, attributed summaries of the linked published sources.
// Do not add invented quotations, anonymous "scholars", or a bibliography
// that only concerns the author but does not support the displayed claim.
const springMoon = reviewed(
  '莫砺锋从全诗结构解释江月与人生之问：诗歌由月下景物转向宇宙遐思，再写游子与思妇。文章比较闻一多和李泽厚的读法，并对将它简单归为少年感伤提出不同意见。此处呈现的是该文的论述摘要。',
  '莫砺锋', '《名作欣赏》；中国作家网刊载：《春江花月夜》：千古常新的明月颂歌，2019-08-27',
  'https://www.chinawriter.com.cn/n1/2019/0827/c404064-31318601.html');
const lantern = reviewed(
  '王增宝在讨论王国维时说明，《人间词话》以摘句的方式比拟求学与成就事业的三个阶段。这句被置于第三阶段，用来说明长期求索后的领悟；这是王国维的借用方式，不宜直接当作辛弃疾创作此词的唯一原意。',
  '王增宝（介绍王国维的“三种境界”说）', '《传记文学》；中国作家网：《“独上高楼，望尽天涯路”——少年王国维》，2022-03-31',
  'https://www.chinawriter.com.cn/n1/2022/0331/c404064-32388558.html');
const pavilion = reviewed(
  '蒙曼在访谈中以庾信的相近句式作比较，指出王勃将意象扩展到落霞、孤鹜与秋水长天，展示了诗词在代际传承中的提炼。这是访谈对语言与境界的分析，不能据此引申出未经原文支持的作者心理。',
  '蒙曼', '《蒙曼谈中华诗词之美——诗词是直抵人心的力量》访谈；江汉大学网页刊载，2017-03-13',
  'https://jw.jhun.edu.cn/54/d4/c2227a87252/pagem.htm');
const rilke = reviewed(
  'August Stahl 的论文把这句结语与里尔克诗中对确定性的质疑、对丧失的感知并置讨论。论文注明它出自悼念 Wolf Graf von Kalckreuth 的《安魂曲》。它不属于《杜伊诺哀歌》第十首，也不能据此虚构诗人写作时的对白。',
  'August Stahl', '《“O dieses ist das Tier, das es nicht gibt.”》，Berliner Beiträge zur Hungarologie 14，印刷页 194；匈牙利国家图书馆电子期刊库',
  'https://epa.oszk.hu/02300/02398/00011/pdf/EPA02398_BerlinerBeitrageZurHung_14_187-201.pdf');

export const QUOTE_COMMENTARIES: Record<string, Commentary> = {
  q3: pavilion, q32: pavilion,
  q6: springMoon, q33: springMoon,
  q20: lantern, q42: lantern,
  q14: rilke, q22: rilke, q48: rilke,
  q27: reviewed('余华在访谈中亲自解释这句话：即使无法继续从事写作，生命仍应继续；理解时应回到简单朴素的生活。他明确反对不断往深处附会。这份作者自述不支持把原句扩写成一套成功学或苦难必然有益的理论。',
    '余华（作者访谈）', '《收获》访谈；中国作家网：《余华访谈：艺术最核心的东西，就是作品里有没有人》，2018-09-01',
    'https://www.chinawriter.com.cn/n1/2018/0901/c405057-30265131.html'),
  q44: reviewed('马俊江从植物人文学讨论东篱采菊：古代菊花的颜色、形态、香气和采集传统，都影响对诗句的理解。文章提醒读者，今天园艺菊的形象不能直接代替陶渊明时代的植物经验。这里保留这一具体研究角度，不替研究者补写人生劝诫。',
    '马俊江', '《中国社会科学报》；中国作家网：《“采菊东篱下”的植物人文学解读》，2024-12-04',
    'https://www.chinawriter.com.cn/n1/2024/1204/c442005-40375265.html'),
  q45: reviewed('河西学院发布的学术报告纪要介绍，查屏球将李白的“天材观”与庄子“无用之用”联系起来解读此句，并考察创作背景与传播。这是公开纪要所能支持的研究视角；纪要没有提供完整讲稿，本站不冒充逐句复述其全部论证。',
    '查屏球（河西学院文学院发布的报告纪要）', '河西学院：《复旦大学查屏球教授为文学院师生作报告》，2025-07-07',
    'https://www10.hxu.edu.cn/info/3851/290582.htm'),
};
