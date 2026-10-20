import type { IEssayMaterial } from './types';

// 高考议论文素材库
// 框架已搭建，materials 数组中的内容由用户后续自行填充
// 每个概念下可添加多条素材：标题、正文、来源、使用提示

export const ESSAY_MATERIALS: IEssayMaterial[] = [
  {
    id: 'e1',
    concept: '修昔底德陷阱',
    category: '国际关系 · 历史',
    description:
      '新崛起大国与守成大国之间的结构性冲突风险。适用于讨论竞争与合作、历史规律与人为选择、和平崛起等主题。',
    applicableTopics: ['竞争与合作', '和平崛起', '历史规律', '大国关系', '危机与转机'],
    materials: [
      {
        title: '示例：伯罗奔尼撒战争的启示',
        content:
          '（此处可填入从网上摘抄的优秀文段或自己整理的素材。建议包含：事件概述 + 分析角度 + 可引用的金句）',
        source: '待补充',
        usageHint: '适用于"竞争未必导致冲突"、"制度设计可以避免历史重演"等论点',
      },
    ],
  },
  {
    id: 'e2',
    concept: '信息不对称与柠檬市场',
    category: '经济学',
    description:
      '当交易双方信息不对等时，劣质产品会驱逐优质产品。适用于讨论诚信、制度设计、品牌价值、监管的必要性等主题。',
    applicableTopics: ['诚信与信任', '制度的力量', '劣币驱逐良币', '品牌价值', '监管与自由'],
    materials: [
      {
        title: '示例素材标题',
        content: '（待填充）',
        source: '待补充',
        usageHint: '适用于论证"信任是市场的基础"、"好制度让坏人变好"等',
      },
    ],
  },
  {
    id: 'e3',
    concept: '化性起伪——荀子的人性观',
    category: '中国哲学',
    description:
      '善不是天生的，而是后天教化和制度建构的结果。适用于讨论教育的意义、环境对人的塑造、自律与他律等主题。',
    applicableTopics: ['教育的意义', '环境与成长', '自律与他律', '人性善恶', '文化传承'],
    materials: [
      {
        title: '示例素材标题',
        content: '（待填充）',
        source: '待补充',
        usageHint: '适用于论证"教育改变命运"、"制度塑造人性"等',
      },
    ],
  },
  {
    id: 'e4',
    concept: '社会事实——个体与社会',
    category: '社会学',
    description:
      '社会不是个人的简单集合，而是有其自身实在性的结构。适用于讨论个人与集体、时代与命运、社会环境对人的影响等主题。',
    applicableTopics: ['个人与集体', '时代与命运', '社会责任', '环境塑造人', '团结与凝聚'],
    materials: [
      {
        title: '示例素材标题',
        content: '（待填充）',
        source: '待补充',
        usageHint: '适用于论证"人是社会关系的总和"、"时代造就英雄"等',
      },
    ],
  },
  {
    id: 'e5',
    concept: '大转型——市场与社会的博弈',
    category: '经济史 · 政治经济学',
    description:
      '市场不是自然的，而是被建构的；社会会自发保护自己免受市场的过度侵蚀。适用于讨论发展与公平、效率与人文、科技与伦理等主题。',
    applicableTopics: ['发展与公平', '效率与人文', '科技伦理', '市场与监管', '传统与现代'],
    materials: [
      {
        title: '示例素材标题',
        content: '（待填充）',
        source: '待补充',
        usageHint: '适用于论证"发展不能以牺牲人为代价"、"技术需要人文约束"等',
      },
    ],
  },
  {
    id: 'e6',
    concept: '五月花号——多视角看历史',
    category: '世界历史 · 殖民史',
    description:
      '同一个历史事件，不同立场的人有截然不同的叙述。适用于讨论历史的多面性、话语权、真相与建构、文明冲突等主题。',
    applicableTopics: ['历史的多面性', '话语权', '真相与建构', '文明冲突', '记忆与遗忘'],
    materials: [
      {
        title: '示例素材标题',
        content: '（待填充）',
        source: '待补充',
        usageHint: '适用于论证"历史是胜利者书写的"、"换个角度看世界"等',
      },
    ],
  },
  {
    id: 'e7',
    concept: '科技与人文的张力',
    category: '哲学 · 技术批判',
    description:
      '技术进步与人文关怀之间的永恒张力。科技带来效率和便利，但也可能导致人的异化、意义的丧失和审美的退化。适用于讨论AI时代、技术伦理、工具理性等主题。',
    applicableTopics: ['科技与人文', 'AI时代', '技术伦理', '工具理性', '效率与温度'],
    materials: [],
  },
  {
    id: 'e8',
    concept: '传统与现代的对话',
    category: '文化研究 · 身份认同',
    description:
      '传统不是包袱，现代也不是终点。如何在传统中找到根脉，在现代中获得新生，是每一个文化共同体的必修课。适用于讨论文化自信、传统转化、古今之辩等主题。',
    applicableTopics: ['传统与现代', '文化自信', '传承与创新', '古今之辩', '根与翼'],
    materials: [],
  },
  {
    id: 'e9',
    concept: '个体与群体的边界',
    category: '社会学 · 政治哲学',
    description:
      '个体自由与群体秩序之间的平衡。没有个体的群体是死水，没有群体的个体是流沙。适用于讨论个人主义与集体主义、自由与责任、独特性与归属感等主题。',
    applicableTopics: ['个体与群体', '自由与责任', '独特性与归属感', '个人主义', '集体主义'],
    materials: [],
  },
  {
    id: 'e10',
    concept: '理性与感性的辩证',
    category: '哲学 · 认识论',
    description:
      '理性让我们看清世界，感性让我们感受世界。没有理性的感性是盲目，没有感性的理性是冰冷。适用于讨论理智与情感、逻辑与直觉、头脑与心灵等主题。',
    applicableTopics: ['理性与感性', '理智与情感', '逻辑与直觉', '冷与热', '知与情'],
    materials: [],
  },
  {
    id: 'e11',
    concept: '自由与规则的共生',
    category: '政治哲学 · 法哲学',
    description:
      '绝对的自由导致混乱，绝对的规则导致窒息。真正的自由是在规则中舞蹈，真正的规则是为自由设定边界。适用于讨论自律与他律、秩序与活力、约束与解放等主题。',
    applicableTopics: ['自由与规则', '自律与他律', '秩序与活力', '约束与解放', '边界与空间'],
    materials: [],
  },
  {
    id: 'e12',
    concept: '功利与审美的超越',
    category: '美学 · 价值哲学',
    description:
      '功利追求有用，审美追求无用之用。在一个效率至上的时代，审美的"无用"恰恰是对人的完整性的守护。适用于讨论有用与无用、实用与诗意、功利与超越等主题。',
    applicableTopics: ['功利与审美', '有用与无用', '实用与诗意', '功利与超越', '计算与感悟'],
    materials: [],
  },
  {
    id: 'e13',
    concept: '记忆与遗忘的艺术',
    category: '历史哲学 · 记忆研究',
    description:
      '记忆让我们知道自己是谁，遗忘让我们能够继续前行。该记住什么、该遗忘什么，是个人和集体都必须面对的选择。适用于讨论历史记忆、放下与铭记、创伤与和解等主题。',
    applicableTopics: ['记忆与遗忘', '铭记与放下', '历史记忆', '创伤与和解', '过去与未来'],
    materials: [],
  },
  {
    id: 'e14',
    concept: '快与慢的节奏',
    category: '生活哲学 · 时间观',
    description:
      '快是效率，慢是深度。在一个加速的时代，慢不是落后，而是一种抵抗——抵抗被速度抹平的思考和感受。适用于讨论快节奏生活、深度与效率、等待与焦虑等主题。',
    applicableTopics: ['快与慢', '效率与深度', '加速与减速', '等待与焦虑', '即时与沉淀'],
    materials: [],
  },
  {
    id: 'e15',
    concept: '破与立的辩证法',
    category: '辩证法 · 历史哲学',
    description:
      '不破不立，但破不等于立。批判旧世界需要勇气，建设新世界需要智慧。真正的进步不是简单的否定，而是扬弃——在批判中继承，在继承中超越。适用于讨论改革与革命、批判与建设、否定与超越等主题。',
    applicableTopics: ['破与立', '批判与建设', '改革与革命', '否定与超越', '扬弃'],
    materials: [],
  },
];

export function getEssayMaterialsByCategory(category: string): IEssayMaterial[] {
  if (category === '全部') return ESSAY_MATERIALS;
  return ESSAY_MATERIALS.filter((m) => m.category.startsWith(category));
}

export function getEssayCategories(): string[] {
  return ['全部', ...Array.from(new Set(ESSAY_MATERIALS.map((m) => m.category.split(' · ')[0])))];
}
