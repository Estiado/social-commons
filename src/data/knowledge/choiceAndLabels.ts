import { EDITORIAL } from '../../../.artifacts/editorial/knowledge/choiceAndLabels.ts';
import type { IDailyKnowledge } from '../types';

// Shared source records keep concepts and recommended examples in agreement.
export const CHOICE_STUDIES = [
  {
    id: 'd140',
    conceptId: 'e110',
    concept: '反事实思维',
    category: '认知心理学 · 决策',
    title: EDITORIAL['d140.title'],
    summary: EDITORIAL['d140.summary'],
    content: EDITORIAL['d140.content'],
    topics: ['选择与行动', '反思', '偶然与必然'],
    sourceTitle:
      'Kai Epstude、Neal J. Roese：The Functional Theory of Counterfactual Thinking，Personality and Social Psychology Review 12(2)，2008，168–192页',
    url: 'https://pubmed.ncbi.nlm.nih.gov/18453477/',
  },
  {
    id: 'd141',
    conceptId: 'e111',
    concept: '结果偏误',
    category: '认知心理学 · 决策',
    title: EDITORIAL['d141.title'],
    summary: EDITORIAL['d141.summary'],
    content: EDITORIAL['d141.content'],
    topics: ['判断与证据', '成败', '偶然与必然'],
    sourceTitle:
      'Jonathan Baron、John C. Hershey：Outcome Bias in Decision Evaluation，Journal of Personality and Social Psychology 54(4)，1988，569–579页',
    url: 'https://doi.org/10.1037/0022-3514.54.4.569',
    references: [
      {
        title: '论文电子版 · 佛罗里达大学课程资料',
        url: 'https://bear.warrington.ufl.edu/brenner/mar7588/Papers/baron-hershey-jpsp1988.pdf',
      },
    ],
  },
  {
    id: 'd142',
    conceptId: 'e112',
    concept: '模糊厌恶',
    category: '行为经济学 · 不确定性',
    title: EDITORIAL['d142.title'],
    summary: EDITORIAL['d142.summary'],
    content: EDITORIAL['d142.content'],
    topics: ['风险与选择', '信息', '求知'],
    sourceTitle:
      'Daniel Ellsberg：Risk, Ambiguity, and the Savage Axioms，The Quarterly Journal of Economics 75(4)，1961，643–669页',
    url: 'https://doi.org/10.2307/1884324',
    references: [
      {
        title: '原论文 · 加州大学欧文分校课程电子版',
        url: 'https://sites.socsci.uci.edu/~bskyrms/bio/readings/ellsberg.pdf',
      },
    ],
  },
  {
    id: 'd143',
    conceptId: 'e113',
    concept: '有限理性与满意化',
    category: '经济学 · 决策',
    title: EDITORIAL['d143.title'],
    summary: EDITORIAL['d143.summary'],
    content: EDITORIAL['d143.content'],
    topics: ['选择与行动', '效率与限度', '变化与适应'],
    sourceTitle:
      'Herbert A. Simon：A Behavioral Model of Rational Choice，The Quarterly Journal of Economics 69(1)，1955，99–118页；卡内基梅隆大学档案',
    url: 'https://digitalcollections.library.cmu.edu/node/48694',
  },
  {
    id: 'd144',
    conceptId: 'e114',
    concept: '语言标签与心理本质主义',
    category: '认知心理学 · 语言发展',
    title: EDITORIAL['d144.title'],
    summary: EDITORIAL['d144.summary'],
    content: EDITORIAL['d144.content'],
    topics: ['标签与个体', '语言与理解', '偏见'],
    sourceTitle:
      'Susan A. Gelman、Gail D. Heyman：Carrot-Eaters and Creature-Believers，Psychological Science 10(6)，1999，489–493页',
    url: 'https://journals.sagepub.com/doi/10.1111/1467-9280.00194',
  },
  {
    id: 'd145',
    conceptId: 'e115',
    concept: '家族相似',
    category: '西方哲学 · 语言',
    title: EDITORIAL['d145.title'],
    summary: EDITORIAL['d145.summary'],
    content: EDITORIAL['d145.content'],
    topics: ['语言与理解', '复杂性', '成功的尺度'],
    sourceTitle:
      'Anat Biletzki、Anat Matar：Ludwig Wittgenstein，《斯坦福哲学百科》，第3.4节Language-games and Family Resemblance',
    url: 'https://plato.stanford.edu/entries/wittgenstein/#LangGameFamiRese',
  },
  {
    id: 'd146',
    conceptId: 'e116',
    concept: '数据集说明与分类边界',
    category: '媒介研究 · 数据',
    title: EDITORIAL['d146.title'],
    summary: EDITORIAL['d146.summary'],
    content: EDITORIAL['d146.content'],
    topics: ['标签与个体', '技术与责任', '信息判断'],
    sourceTitle:
      'Timnit Gebru等：Datasheets for Datasets，Communications of the ACM 64(12)，2021，86–92页；作者预印本v8',
    url: 'https://arxiv.org/abs/1803.09010',
  },
  {
    id: 'd147',
    conceptId: 'e117',
    concept: '探索与利用',
    category: '组织心理学 · 学习',
    title: EDITORIAL['d147.title'],
    summary: EDITORIAL['d147.summary'],
    content: EDITORIAL['d147.content'],
    topics: ['选择与行动', '创新与积累', '长期与短期'],
    sourceTitle:
      'James G. March：Exploration and Exploitation in Organizational Learning，Organization Science 2(1)，1991，71–87页',
    url: 'https://pubsonline.informs.org/doi/abs/10.1287/orsc.2.1.71',
  },
];

export const CHOICE_KNOWLEDGE: IDailyKnowledge[] = CHOICE_STUDIES.map((item) => ({
  id: item.id,
  date: '2026-11-02',
  title: item.title,
  category: item.category,
  summary: item.summary,
  content: item.content,
  source: `${item.sourceTitle}。${item.url}`,
}));
