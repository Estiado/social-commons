import { EDITORIAL } from '../../../.artifacts/editorial/essay/reasoning.ts';
import type { IEssayMaterial } from '../types';
import { REASONING_KNOWLEDGE } from '../knowledge/reasoning.ts';

// One explicit link to the underlying knowledge entry keeps source URLs and
// descriptions consistent. Essay prompts remain editorial, not scholar quotes.
const selections = [
  {
    id: 'e26',
    dailyId: 'd51',
    concept: '机会成本与取舍',
    topics: ['选择与放弃', '时间管理', '效率与价值'],
    question: EDITORIAL['selections.e26.question'],
  },
  {
    id: 'e27',
    dailyId: 'd52',
    concept: '损失厌恶与参照点',
    topics: ['得失', '成长', '心态与行动'],
    question: EDITORIAL['selections.e27.question'],
  },
  {
    id: 'e28',
    dailyId: 'd53',
    concept: '框架效应与表达责任',
    topics: ['语言的力量', '信息判断', '独立思考'],
    question: EDITORIAL['selections.e28.question'],
  },
  {
    id: 'e29',
    dailyId: 'd56',
    concept: '公地治理与共同责任',
    topics: ['公共精神', '规则', '合作与信任'],
    question: EDITORIAL['selections.e29.question'],
  },
  {
    id: 'e30',
    dailyId: 'd57',
    concept: '相关与因果',
    topics: ['实事求是', '科学精神', '审慎判断'],
    question: EDITORIAL['selections.e30.question'],
  },
  {
    id: 'e31',
    dailyId: 'd58',
    concept: '反证意识与自我修正',
    topics: ['质疑', '求真', '开放心态'],
    question: EDITORIAL['selections.e31.question'],
  },
  {
    id: 'e32',
    dailyId: 'd59',
    concept: '最佳解释与合理怀疑',
    topics: ['思考方法', '表象与真相', '调查研究'],
    question: EDITORIAL['selections.e32.question'],
  },
  {
    id: 'e33',
    dailyId: 'd60',
    concept: '数据表达与统计素养',
    topics: ['数字时代', '真实与误读', '理性'],
    question: EDITORIAL['selections.e33.question'],
  },
  {
    id: 'e34',
    dailyId: 'd61',
    concept: '复现与知识共同体',
    topics: ['诚信', '科学精神', '合作'],
    question: EDITORIAL['selections.e34.question'],
  },
  {
    id: 'e35',
    dailyId: 'd62',
    concept: '专家证言与合理信任',
    topics: ['权威与独立', '知识', '偏见'],
    question: EDITORIAL['selections.e35.question'],
  },
  {
    id: 'e36',
    dailyId: 'd63',
    concept: '资源平等与实际机会',
    topics: ['公平', '教育', '人的发展'],
    question: EDITORIAL['selections.e36.question'],
  },
  {
    id: 'e37',
    dailyId: 'd64',
    concept: '知识共享与责任',
    topics: ['传承与创新', '共享', '规则意识'],
    question: EDITORIAL['selections.e37.question'],
  },
  {
    id: 'e38',
    dailyId: 'd66',
    concept: '外部性与公共边界',
    topics: ['自由与责任', '生态', '公共生活'],
    question: EDITORIAL['selections.e38.question'],
  },
  {
    id: 'e39',
    dailyId: 'd68',
    concept: '横向阅读与信息核查',
    topics: ['媒介素养', '真实', '独立思考'],
    question: EDITORIAL['selections.e39.question'],
  },
  {
    id: 'e40',
    dailyId: 'd70',
    concept: '关怀与责任分配',
    topics: ['人与人', '家庭与社会', '边界'],
    question: EDITORIAL['selections.e40.question'],
  },
];

export const REASONING_ESSAYS: IEssayMaterial[] = selections.map((selection) => {
  const knowledge = REASONING_KNOWLEDGE.find((item) => item.id === selection.dailyId);
  if (!knowledge) throw new Error(`Missing knowledge source: ${selection.dailyId}`);
  const url = knowledge.source.match(/https?:\/\/\S+$/u)?.[0];
  if (!url) throw new Error(`Missing source URL: ${selection.dailyId}`);
  return {
    id: selection.id,
    concept: selection.concept,
    category: knowledge.category.split(' · ')[0],
    description: `${knowledge.summary}\n\n本站写作提示：${selection.question}`,
    applicableTopics: selection.topics,
    references: [
      { title: knowledge.source.slice(0, knowledge.source.indexOf('https:')).trim(), url },
    ],
    materials: [],
  };
});
