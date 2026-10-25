import { EDITORIAL } from '../../../.artifacts/editorial/history/enlightenment.ts';
import type { IEvent } from '../types';

export const ENLIGHTENMENT_EVENT: IEvent = {
  id: 'enlightenment-18th',
  title: '启蒙运动：理性、社会与平等的不同答案',
  date: '17世纪后期—18世纪末',
  location: '欧洲及跨大西洋思想网络',
  category: '世界历史 · 思想史',
  summary: EDITORIAL['ENLIGHTENMENT_EVENT.summary'],
  summarySources: [
    {
      title: 'William Bristow：Enlightenment，斯坦福哲学百科',
      url: 'https://plato.stanford.edu/entries/enlightenment/',
    },
  ],
  perspectives: [
    {
      id: 'e1',
      role: '康德',
      title: '启蒙首先意味着自己运用理解力',
      description: EDITORIAL['ENLIGHTENMENT_EVENT.perspectives.e1.description'],
      quote: '要有勇气运用你自己的理解力！',
      original: 'Have courage to use your own understanding!',
      source:
        '伊曼努尔·康德《答复这个问题：什么是启蒙？》，1784；H. B. Nisbet 英译，载 Kant: Political Writings',
      sourceType: '史料记载',
      sourceUrl:
        'https://sites.evergreen.edu/politicalshakespeares/wp-content/uploads/sites/226/2015/12/Kant-A-response-to-the-question-What-is-Enlightenment.pdf',
      locator: '第54—55页，开篇及“理性的公开运用”段落',
    },
    {
      id: 'e2',
      role: '亚当·斯密',
      title: '社会协作不必只从宏大制度蓝图理解',
      description: EDITORIAL['ENLIGHTENMENT_EVENT.perspectives.e2.description'],
      quote: '劳动生产力的最大改进……似乎都是分工的结果。',
      original: 'The greatest improvements in the productive powers of labour',
      source: '亚当·斯密《国民财富的性质和原因的研究》，1776',
      sourceType: '史料记载',
      sourceUrl: 'https://www.gutenberg.org/ebooks/3300',
      locator: '第一卷第一章，首段；第二、三章',
      readingId: 'smith-wealth',
    },
    {
      id: 'e3',
      role: '玛丽·沃斯通克拉夫特',
      title: '女性也应成为支配自己的理性主体',
      description: EDITORIAL['ENLIGHTENMENT_EVENT.perspectives.e3.description'],
      quote: '我并不希望她们拥有支配男人的权力，而希望她们能支配自己。',
      original: 'I do not wish them to have power over men; but over themselves.',
      source: '玛丽·沃斯通克拉夫特《女权辩护》，1792',
      sourceType: '史料记载',
      sourceUrl: 'https://www.gutenberg.org/ebooks/3420',
      locator: '第五章，回应卢梭女性教育论的段落',
      readingId: 'wollstonecraft-rights',
    },
  ],
  academicPapers: [],
  references: [],
};
