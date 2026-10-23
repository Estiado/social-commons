import type { IEvent } from '../types';

export const ENLIGHTENMENT_EVENT: IEvent = {
  id: 'enlightenment-18th',
  title: '启蒙运动：理性、社会与平等的不同答案',
  date: '17世纪后期—18世纪末',
  location: '欧洲及跨大西洋思想网络',
  category: '世界历史 · 思想史',
  summary:
    '启蒙运动是17世纪后期至18世纪在欧洲发展的思想与文化运动，并没有统一的组织或一套人人接受的学说。科学革命、印刷传播、公共讨论以及对宗教和政治权威的批判，共同改变了人们理解自然、社会和个人权利的方式。法国的百科全书派、苏格兰的道德哲学与政治经济学、德语地区关于理性与信仰的争论，各有不同的问题和立场。康德以摆脱他人监护来说明启蒙；斯密考察社会分工与交换如何形成；沃斯通克拉夫特则追问，被称作普遍的理性与自由为何没有同等给予女性。这些著述既推动了制度变革，也留下了谁能享有平等、进步如何实现等争论。',
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
      description:
        '康德把不成熟解释为不能在没有别人引导时使用自己的理解力。他将问题部分归于缺乏决心和勇气，并进一步区分履行特定职务时的服从与面向阅读公众的自由讨论。文章并未简单要求取消一切制度约束，而是为公开批评保留空间。',
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
      description:
        '《国富论》第一卷从制针等具体劳动出发，分析专业分工怎样提高熟练程度、节约转换工序的时间，并促进机器的采用。随后，斯密把分工与交换、市场范围相联系。他提供的是对经济活动如何组织的解释，不能把它缩减为“任何私利都会自动产生公共利益”。',
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
      description:
        '沃斯通克拉夫特反对把女性教育仅仅理解为取悦男性的训练。她针对卢梭关于两性教育的看法提出异议，把独立判断、教育与人的尊严联系起来。她并不以女性反过来支配男性为目标，而要求女性能够支配自身；这也把启蒙关于理性的原则推进到性别关系之中。',
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
