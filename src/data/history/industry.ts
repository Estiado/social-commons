import type { IEvent } from '../types';

export const INDUSTRIAL_EVENT: IEvent = {
  id: 'industrial-revolution',
  title: '工业革命：生产增长与生活变化',
  date: '18世纪后半叶—19世纪，先后扩展至其他地区',
  location: '英国及欧洲、北美',
  category: '世界历史 · 经济史',
  summary:
    '工业革命指生产和社会生活由手工劳动、分散作坊逐步转向机械化工厂的长期变化，最早在英国显著展开。棉纺机械、蒸汽动力、煤铁工业和交通建设相互推动，生产规模扩大，工厂城市迅速发展，越来越多人依靠工资生活。它并不是某一年由一项发明单独引起的，也没有让所有人的生活同时改善。机器投资、劳动时间、住房卫生、童工与收入分配，都成为当时人的争论对象。斯密对分工的解释、恩格斯对工业城市的观察，以及经济史学家对工资与产出的重建，展示了“生产得更多”与“生活得更好”之间复杂而有时间差的关系。',
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
      description:
        '斯密以制针业说明，把工序分给不同劳动者，可以提高熟练程度、减少工序转换，并有助于采用机器。这种解释把目光放在生产组织上，而不仅是某位发明家的机器。斯密写作时工业化尚在发展之中，他讨论的是增长的一种机制，并不是对后来全部工厂生活的总结。',
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
      description:
        '恩格斯以曼彻斯特为重点，把机器、蒸汽动力和分工的扩展，与工人的住房、疾病、劳动和阶级关系放在一起考察。他既承认现代制造业的巨大变化，也批判劳动者被压低为机器附属物的处境。这是一位持鲜明政治立场的同时代观察者的著述。',
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
      description:
        'Allen 重建1760—1913年的产出、工资和分配关系，认为19世纪上半叶劳动生产率增长时，实际工资增长明显滞后；世纪中叶以后，两者的走势才趋于接近。他将这一变化放入技术进步、资本积累和利润份额的相互作用之中，并与较为乐观的工资估计展开争论。',
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
