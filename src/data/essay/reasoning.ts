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
    question: '先列出真实可行的替代方案，再解释为什么选择其中一个；不要将全部遗憾都算成机会成本。',
  },
  {
    id: 'e27',
    dailyId: 'd52',
    concept: '损失厌恶与参照点',
    topics: ['得失', '成长', '心态与行动'],
    question: '先说明“损失”相对于哪个参照点，再比较心理感受与实际后果。',
  },
  {
    id: 'e28',
    dailyId: 'd53',
    concept: '框架效应与表达责任',
    topics: ['语言的力量', '信息判断', '独立思考'],
    question: '对同一组事实进行两种表达，核查是否保留了相同的分母、期限与条件。',
  },
  {
    id: 'e29',
    dailyId: 'd56',
    concept: '公地治理与共同责任',
    topics: ['公共精神', '规则', '合作与信任'],
    question: '不要只要求人人自觉；补充参与者如何协商、监督和处理争议。',
  },
  {
    id: 'e30',
    dailyId: 'd57',
    concept: '相关与因果',
    topics: ['实事求是', '科学精神', '审慎判断'],
    question: '从现象到结论之间，至少比较一个竞争解释，写出还缺少的证据。',
  },
  {
    id: 'e31',
    dailyId: 'd58',
    concept: '反证意识与自我修正',
    topics: ['质疑', '求真', '开放心态'],
    question: '写清什么证据会使你修改主张；给观点保留被现实纠正的入口。',
  },
  {
    id: 'e32',
    dailyId: 'd59',
    concept: '最佳解释与合理怀疑',
    topics: ['思考方法', '表象与真相', '调查研究'],
    question: '区分“解释得通”“更有根据”与“已经证明”，不靠一个动人的故事结束论证。',
  },
  {
    id: 'e33',
    dailyId: 'd60',
    concept: '数据表达与统计素养',
    topics: ['数字时代', '真实与误读', '理性'],
    question: '检查样本、效果大小与不确定性，避免用“显著”替代“重要”。',
  },
  {
    id: 'e34',
    dailyId: 'd61',
    concept: '复现与知识共同体',
    topics: ['诚信', '科学精神', '合作'],
    question: '说明一个结论怎样让别人复核；区分暂未重复成功与已经证实造假。',
  },
  {
    id: 'e35',
    dailyId: 'd62',
    concept: '专家证言与合理信任',
    topics: ['权威与独立', '知识', '偏见'],
    question: '尊重专业分工，也核对专业范围、证据与争议；避免把反权威变成拒绝证据。',
  },
  {
    id: 'e36',
    dailyId: 'd63',
    concept: '资源平等与实际机会',
    topics: ['公平', '教育', '人的发展'],
    question: '从“给予多少”继续追问“能否使用”，比较相同待遇背后的不同处境。',
  },
  {
    id: 'e37',
    dailyId: 'd64',
    concept: '知识共享与责任',
    topics: ['传承与创新', '共享', '规则意识'],
    question: '把可阅读、可复制、可修改分别判断；署名和链接让共享能够持续。',
  },
  {
    id: 'e38',
    dailyId: 'd66',
    concept: '外部性与公共边界',
    topics: ['自由与责任', '生态', '公共生活'],
    question: '画出谁获益、谁承担成本，再讨论减轻影响的可行办法。',
  },
  {
    id: 'e39',
    dailyId: 'd68',
    concept: '横向阅读与信息核查',
    topics: ['媒介素养', '真实', '独立思考'],
    question: '追溯原始出处，检查多个页面是否只是在转述同一消息。',
  },
  {
    id: 'e40',
    dailyId: 'd70',
    concept: '关怀与责任分配',
    topics: ['人与人', '家庭与社会', '边界'],
    question: '写出被照料者的需要，也写出照料者的负担与自主权。',
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
