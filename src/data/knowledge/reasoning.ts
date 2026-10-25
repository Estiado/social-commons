import { EDITORIAL } from '../../../.artifacts/editorial/knowledge/reasoning.ts';
import type { IDailyKnowledge } from '../types';

// Summaries are written for this site, not quotations from the linked works.
// Teaching questions are explicitly editorial; the source supports the concept.
export const REASONING_KNOWLEDGE: IDailyKnowledge[] = [
  {
    id: 'd51',
    date: '2026-10-22',
    title: '机会成本：选择的代价不只在账单上',
    category: '微观经济学 · 选择',
    summary: EDITORIAL['REASONING_KNOWLEDGE.d51.summary'],
    content: EDITORIAL['REASONING_KNOWLEDGE.d51.content'],
    source:
      'OpenStax《Principles of Economics 3e》2.1，本站概述。https://openstax.org/books/principles-economics-3e/pages/2-1-how-individuals-make-choices-based-on-their-budget-constraint',
  },
  {
    id: 'd52',
    date: '2026-10-22',
    title: '损失厌恶：为什么“失去”格外刺痛',
    category: '微观经济学 · 行为经济学',
    summary: EDITORIAL['REASONING_KNOWLEDGE.d52.summary'],
    content: EDITORIAL['REASONING_KNOWLEDGE.d52.content'],
    source:
      'Daniel Kahneman，Biographical，NobelPrize.org。https://www.nobelprize.org/prizes/economic-sciences/2002/kahneman/biographical/',
  },
  {
    id: 'd53',
    date: '2026-10-22',
    title: '框架效应：同一事实，为什么选择不同',
    category: '社会心理学 · 判断',
    summary: EDITORIAL['REASONING_KNOWLEDGE.d53.summary'],
    content: EDITORIAL['REASONING_KNOWLEDGE.d53.content'],
    source:
      'Daniel Kahneman，Biographical，关于 framing 与 invariance 的论述。https://www.nobelprize.org/prizes/economic-sciences/2002/kahneman/biographical/',
  },
  {
    id: 'd54',
    date: '2026-10-22',
    title: '心理账户：同样的钱为何被区别对待',
    category: '微观经济学 · 行为经济学',
    summary: EDITORIAL['REASONING_KNOWLEDGE.d54.summary'],
    content: EDITORIAL['REASONING_KNOWLEDGE.d54.content'],
    source:
      'NobelPrize.org，2017 年经济学奖新闻稿，本站摘要。https://www.nobelprize.org/prizes/economic-sciences/2017/press-release/',
  },
  {
    id: 'd55',
    date: '2026-10-22',
    title: '有限自控：让计划照顾真实的人',
    category: '社会心理学 · 决策',
    summary: EDITORIAL['REASONING_KNOWLEDGE.d55.summary'],
    content: EDITORIAL['REASONING_KNOWLEDGE.d55.content'],
    source:
      'NobelPrize.org，2017 年经济学奖新闻稿，本站概述。https://www.nobelprize.org/prizes/economic-sciences/2017/press-release/',
  },
  {
    id: 'd56',
    date: '2026-10-22',
    title: '公地治理：共享不必然通向失序',
    category: '环境经济学 · 制度',
    summary: EDITORIAL['REASONING_KNOWLEDGE.d56.summary'],
    content: EDITORIAL['REASONING_KNOWLEDGE.d56.content'],
    source:
      'Elinor Ostrom，诺奖访谈实录。https://www.nobelprize.org/prizes/economic-sciences/2009/ostrom/164465-ostrom-williamson-interview-transcript/',
  },
  {
    id: 'd57',
    date: '2026-10-22',
    title: '自然实验：从“同时发生”走向因果问题',
    category: '微观经济学 · 研究方法',
    summary: EDITORIAL['REASONING_KNOWLEDGE.d57.summary'],
    content: EDITORIAL['REASONING_KNOWLEDGE.d57.content'],
    source:
      'NobelPrize.org，2021 年经济学奖新闻稿。https://www.nobelprize.org/prizes/economic-sciences/2021/press-release/',
  },
  {
    id: 'd58',
    date: '2026-10-22',
    title: '可证伪性：什么证据会让你改变看法',
    category: '西方哲学 · 科学方法',
    summary: EDITORIAL['REASONING_KNOWLEDGE.d58.summary'],
    content: EDITORIAL['REASONING_KNOWLEDGE.d58.content'],
    source:
      'Stanford Encyclopedia of Philosophy，Scientific Method。https://plato.stanford.edu/entries/scientific-method/',
  },
  {
    id: 'd59',
    date: '2026-10-22',
    title: '溯因推理：好解释仍需要被检验',
    category: '西方哲学 · 逻辑',
    summary: EDITORIAL['REASONING_KNOWLEDGE.d59.summary'],
    content: EDITORIAL['REASONING_KNOWLEDGE.d59.content'],
    source:
      'Stanford Encyclopedia of Philosophy，Abduction。https://plato.stanford.edu/entries/abduction/',
  },
  {
    id: 'd60',
    date: '2026-10-22',
    title: '统计显著：不等于重要，也不等于真实概率',
    category: '社会学 · 研究方法',
    summary: EDITORIAL['REASONING_KNOWLEDGE.d60.summary'],
    content: EDITORIAL['REASONING_KNOWLEDGE.d60.content'],
    source:
      'American Statistical Association，Statement on Statistical Significance and P-Values（2016）。https://www.amstat.org/docs/default-source/amstat-documents/p-valuestatement.pdf',
  },
  {
    id: 'd61',
    date: '2026-10-22',
    title: '重复与复现：科学为什么需要别人再做一遍',
    category: '社会学 · 科学共同体',
    summary: EDITORIAL['REASONING_KNOWLEDGE.d61.summary'],
    content: EDITORIAL['REASONING_KNOWLEDGE.d61.content'],
    source:
      'National Academies，Reproducibility and Replicability in Science（2019），研究简报。https://nap.nationalacademies.org/resource/25303/Combined%20Reproducibility%20Brief%20vs2.pdf',
  },
  {
    id: 'd62',
    date: '2026-10-22',
    title: '证言与信任：我们为何离不开他人的知识',
    category: '西方哲学 · 认识论',
    summary: EDITORIAL['REASONING_KNOWLEDGE.d62.summary'],
    content: EDITORIAL['REASONING_KNOWLEDGE.d62.content'],
    source:
      'Stanford Encyclopedia of Philosophy，Epistemological Problems of Testimony。https://plato.stanford.edu/entries/testimony-episprob/',
  },
  {
    id: 'd63',
    date: '2026-10-22',
    title: '可行能力：拥有资源，也要能够使用',
    category: '政治哲学 · 公平',
    summary: EDITORIAL['REASONING_KNOWLEDGE.d63.summary'],
    content: EDITORIAL['REASONING_KNOWLEDGE.d63.content'],
    source:
      'Stanford Encyclopedia of Philosophy，The Capability Approach。https://plato.stanford.edu/entries/capability-approach/',
  },
  {
    id: 'd64',
    date: '2026-10-22',
    title: '开放科学：知识共享也需要规则',
    category: '传播学 · 知识共享',
    summary: EDITORIAL['REASONING_KNOWLEDGE.d64.summary'],
    content: EDITORIAL['REASONING_KNOWLEDGE.d64.content'],
    source: 'UNESCO，Open Science。https://www.unesco.org/en/open-science',
  },
  {
    id: 'd65',
    date: '2026-10-22',
    title: '公共物品：免费使用背后的供给难题',
    category: '微观经济学 · 公共生活',
    summary: EDITORIAL['REASONING_KNOWLEDGE.d65.summary'],
    content: EDITORIAL['REASONING_KNOWLEDGE.d65.content'],
    source:
      'OpenStax《Principles of Economics 3e》13.3 Public Goods。https://openstax.org/books/principles-economics-3e/pages/13-3-public-goods',
  },
  {
    id: 'd66',
    date: '2026-10-22',
    title: '外部性：没有写进价格的影响',
    category: '环境经济学 · 外部性',
    summary: EDITORIAL['REASONING_KNOWLEDGE.d66.summary'],
    content: EDITORIAL['REASONING_KNOWLEDGE.d66.content'],
    source:
      'OpenStax《Principles of Economics 3e》第12章摘要。https://openstax.org/books/principles-economics-3e/pages/12-key-concepts-and-summary',
  },
  {
    id: 'd67',
    date: '2026-10-22',
    title: '比较优势：合作不只发生在能力相当的人之间',
    category: '微观经济学 · 合作',
    summary: EDITORIAL['REASONING_KNOWLEDGE.d67.summary'],
    content: EDITORIAL['REASONING_KNOWLEDGE.d67.content'],
    source:
      'OpenStax《Principles of Microeconomics 2e》19.1。https://openstax.org/books/principles-microeconomics-2e/pages/19-1-absolute-and-comparative-advantage',
  },
  {
    id: 'd68',
    date: '2026-10-22',
    title: '横向阅读：离开页面，才能看清页面',
    category: '媒介研究 · 信息素养',
    summary: EDITORIAL['REASONING_KNOWLEDGE.d68.summary'],
    content: EDITORIAL['REASONING_KNOWLEDGE.d68.content'],
    source:
      'Digital Inquiry Group，A Civic Online Reasoning Module for High School。https://cor.inquirygroup.org/blog/module-for-high-school/',
  },
  {
    id: 'd69',
    date: '2026-10-22',
    title: '算法公平：先说明你在衡量哪一种公平',
    category: '技术哲学 · 算法',
    summary: EDITORIAL['REASONING_KNOWLEDGE.d69.summary'],
    content: EDITORIAL['REASONING_KNOWLEDGE.d69.content'],
    source:
      'Ben Green，Escaping the Impossibility of Fairness: From Formal to Substantive Algorithmic Fairness（2021，作者预印本）。https://arxiv.org/abs/2107.04642',
  },
  {
    id: 'd70',
    date: '2026-10-22',
    title: '关怀伦理：把关系与照料放进道德讨论',
    category: '政治哲学 · 伦理',
    summary: EDITORIAL['REASONING_KNOWLEDGE.d70.summary'],
    content: EDITORIAL['REASONING_KNOWLEDGE.d70.content'],
    source:
      'Stanford Encyclopedia of Philosophy，Feminist Ethics，关怀伦理相关章节。https://plato.stanford.edu/entries/feminism-ethics/',
  },
];
