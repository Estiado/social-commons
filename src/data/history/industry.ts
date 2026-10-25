import { EDITORIAL } from '../../../.artifacts/editorial/history/industry.ts';
import type { IEvent } from '../types';

export const INDUSTRIAL_EVENT: IEvent = {
  id: 'industrial-revolution',
  title: '工业革命：生产增长与生活变化',
  date: '18世纪后半叶—19世纪，先后扩展至其他地区',
  location: '英国及欧洲、北美',
  category: '世界历史 · 经济史',
  summary: EDITORIAL['INDUSTRIAL_EVENT.summary'],
  summarySources: [
    { title: '恩格斯《英国工人阶级状况》导论', url: 'https://www.gutenberg.org/ebooks/17306' },
    {
      title: 'Robert C. Allen：Engels’ pause，2009',
      url: 'https://doi.org/10.1016/j.eeh.2009.04.004',
    },
  ],
  perspectives: [
    {
      id: 'i1',
      role: '亚当·斯密的生产分析',
      title: '专业分工怎样扩大生产能力',
      description: EDITORIAL['INDUSTRIAL_EVENT.perspectives.i1.description'],
      quote: '分工的效果，通过考察它在一些特定制造业中的作用，更容易理解。',
      original: 'The effects of the division of labour',
      source: '亚当·斯密《国富论》，1776，第一卷第一章',
      sourceType: '史料记载',
      sourceUrl: 'https://www.gutenberg.org/ebooks/3300',
      locator: '第一卷第一章，制针业例证',
      readingId: 'smith-wealth',
    },
    {
      id: 'i2',
      role: '恩格斯的社会调查',
      title: '从工人的居住与劳动处境看工业城市',
      description: EDITORIAL['INDUSTRIAL_EVENT.perspectives.i2.description'],
      quote: '曼彻斯特是现代制造业城市的典型。',
      original: 'Manchester is the classic type of a modern manufacturing town',
      source: '弗里德里希·恩格斯《英国工人阶级状况》，1845；Florence Kelley 英译，1892年版',
      sourceType: '史料记载',
      sourceUrl: 'https://www.gutenberg.org/ebooks/17306',
      locator: '“The Great Towns”章，进入曼彻斯特叙述处',
      readingId: 'engels-workers',
    },
    {
      id: 'i3',
      role: 'Robert C. Allen 的经济史研究',
      title: '工资增长为何一度落后于劳动生产率',
      description: EDITORIAL['INDUSTRIAL_EVENT.perspectives.i3.description'],
      quote: '19世纪上半叶，实际工资停滞，而每名劳动者的产出扩张。',
      original: 'the real wage stagnated while output per worker expanded',
      source:
        'Robert C. Allen，Engels’ pause，Explorations in Economic History，2009，46(4):418—435',
      sourceType: '后世研究',
      sourceUrl: 'https://doi.org/10.1016/j.eeh.2009.04.004',
      locator: '摘要及图1；作者公开稿第1—2页',
      readingId: 'allen-engels-pause',
    },
  ],
  academicPapers: [],
  references: [],
};
