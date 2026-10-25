import { EDITORIAL } from '../../.artifacts/editorial/essay.ts';
import type { IEssayMaterial } from './types';
import { REASONING_ESSAYS } from './essay/reasoning.ts';
import { SOCIAL_ESSAYS } from './essay/socialEvidence.ts';
import { LEARNING_ESSAYS } from './essay/learningAndCulture.ts';
import { EXPERIENCE_ESSAYS } from './essay/socialExperience.ts';
import { YOUTH_ESSAYS } from './essay/youthStudies.ts';

// 内置概念目录。读者素材在本浏览器保存，站方示例独立维护于 essayExamples.ts。

export const ESSAY_MATERIALS: IEssayMaterial[] = [
  ...EXPERIENCE_ESSAYS,
  ...YOUTH_ESSAYS,
  ...LEARNING_ESSAYS,
  ...SOCIAL_ESSAYS,
  ...REASONING_ESSAYS,
  {
    id: 'e1',
    concept: '修昔底德陷阱',
    category: '国际关系 · 历史',
    description: EDITORIAL['ESSAY_MATERIALS.e1.description'],
    applicableTopics: ['竞争与合作', '和平崛起', '历史规律', '大国关系', '危机与转机'],
    materials: [],
  },
  {
    id: 'e2',
    concept: '信息不对称与柠檬市场',
    category: '经济学',
    description: EDITORIAL['ESSAY_MATERIALS.e2.description'],
    applicableTopics: ['诚信与信任', '制度的力量', '劣币驱逐良币', '品牌价值', '监管与自由'],
    materials: [],
  },
  {
    id: 'e3',
    concept: '化性起伪——荀子的人性观',
    category: '中国哲学',
    description: EDITORIAL['ESSAY_MATERIALS.e3.description'],
    applicableTopics: ['教育的意义', '环境与成长', '自律与他律', '人性善恶', '文化传承'],
    materials: [],
  },
  {
    id: 'e4',
    concept: '社会事实——个体与社会',
    category: '社会学',
    description: EDITORIAL['ESSAY_MATERIALS.e4.description'],
    applicableTopics: ['个人与集体', '时代与命运', '社会责任', '环境塑造人', '团结与凝聚'],
    materials: [],
  },
  {
    id: 'e5',
    concept: '大转型——市场与社会的博弈',
    category: '经济史 · 政治经济学',
    description: EDITORIAL['ESSAY_MATERIALS.e5.description'],
    applicableTopics: ['发展与公平', '效率与人文', '科技伦理', '市场与监管', '传统与现代'],
    materials: [],
  },
  {
    id: 'e6',
    concept: '五月花号——多视角看历史',
    category: '世界历史 · 殖民史',
    description: EDITORIAL['ESSAY_MATERIALS.e6.description'],
    applicableTopics: ['历史的多面性', '话语权', '真相与建构', '文明冲突', '记忆与遗忘'],
    materials: [],
  },
  {
    id: 'e7',
    concept: '科技与人文的张力',
    category: '哲学 · 技术批判',
    description: EDITORIAL['ESSAY_MATERIALS.e7.description'],
    applicableTopics: ['科技与人文', 'AI时代', '技术伦理', '工具理性', '效率与温度'],
    materials: [],
  },
  {
    id: 'e8',
    concept: '传统与现代的对话',
    category: '文化研究 · 身份认同',
    description: EDITORIAL['ESSAY_MATERIALS.e8.description'],
    applicableTopics: ['传统与现代', '文化自信', '传承与创新', '古今之辩', '根与翼'],
    materials: [],
  },
  {
    id: 'e9',
    concept: '个体与群体的边界',
    category: '社会学 · 政治哲学',
    description: EDITORIAL['ESSAY_MATERIALS.e9.description'],
    applicableTopics: ['个体与群体', '自由与责任', '独特性与归属感', '个人主义', '集体主义'],
    materials: [],
  },
  {
    id: 'e10',
    concept: '理性与感性的辩证',
    category: '哲学 · 认识论',
    description: EDITORIAL['ESSAY_MATERIALS.e10.description'],
    applicableTopics: ['理性与感性', '理智与情感', '逻辑与直觉', '冷与热', '知与情'],
    materials: [],
  },
  {
    id: 'e11',
    concept: '自由与规则的共生',
    category: '政治哲学 · 法哲学',
    description: EDITORIAL['ESSAY_MATERIALS.e11.description'],
    applicableTopics: ['自由与规则', '自律与他律', '秩序与活力', '约束与解放', '边界与空间'],
    materials: [],
  },
  {
    id: 'e12',
    concept: '功利与审美的超越',
    category: '美学 · 价值哲学',
    description: EDITORIAL['ESSAY_MATERIALS.e12.description'],
    applicableTopics: ['功利与审美', '有用与无用', '实用与诗意', '功利与超越', '计算与感悟'],
    materials: [],
  },
  {
    id: 'e13',
    concept: '记忆与遗忘的艺术',
    category: '历史哲学 · 记忆研究',
    description: EDITORIAL['ESSAY_MATERIALS.e13.description'],
    applicableTopics: ['记忆与遗忘', '铭记与放下', '历史记忆', '创伤与和解', '过去与未来'],
    materials: [],
  },
  {
    id: 'e14',
    concept: '快与慢的节奏',
    category: '生活哲学 · 时间观',
    description: EDITORIAL['ESSAY_MATERIALS.e14.description'],
    applicableTopics: ['快与慢', '效率与深度', '加速与减速', '等待与焦虑', '即时与沉淀'],
    materials: [],
  },
  {
    id: 'e15',
    concept: '破与立的辩证法',
    category: '辩证法 · 历史哲学',
    description: EDITORIAL['ESSAY_MATERIALS.e15.description'],
    applicableTopics: ['破与立', '批判与建设', '改革与革命', '否定与超越', '扬弃'],
    materials: [],
  },
  {
    id: 'e16',
    concept: '洞穴寓言——表象与真实',
    category: '哲学 · 认识论',
    description: EDITORIAL['ESSAY_MATERIALS.e16.description'],
    applicableTopics: ['表象与本质', '偏见与真相', '认知突破', '独立思考', '走出舒适区'],
    materials: [],
  },
  {
    id: 'e17',
    concept: '无知之幕——正义的起点',
    category: '政治哲学 · 罗尔斯',
    description: EDITORIAL['ESSAY_MATERIALS.e17.description'],
    applicableTopics: ['公平与正义', '制度设计', '换位思考', '同理心', '弱势群体'],
    materials: [],
  },
  {
    id: 'e18',
    concept: '平庸之恶——不思考的危险',
    category: '政治哲学 · 阿伦特',
    description: EDITORIAL['ESSAY_MATERIALS.e18.description'],
    applicableTopics: ['个人责任', '独立思考', '服从与反抗', '良知', '平庸之恶'],
    materials: [],
  },
  {
    id: 'e19',
    concept: '剧场国家——权力的表演性',
    category: '人类学 · 格尔茨',
    description: EDITORIAL['ESSAY_MATERIALS.e19.description'],
    applicableTopics: ['权力的本质', '仪式与象征', '形象与实质', '表演性', '认同建构'],
    materials: [],
  },
  {
    id: 'e20',
    concept: '差序格局——中国社会的结构',
    category: '社会学 · 费孝通',
    description: EDITORIAL['ESSAY_MATERIALS.e20.description'],
    applicableTopics: ['人情社会', '关系文化', '公私边界', '法治与人情', '中国社会结构'],
    materials: [],
  },
  {
    id: 'e21',
    concept: '风险社会——现代性的另一面',
    category: '社会学 · 贝克',
    description: EDITORIAL['ESSAY_MATERIALS.e21.description'],
    applicableTopics: ['科技伦理', '发展与代价', '现代性反思', '全球治理', '风险与安全'],
    materials: [],
  },
  {
    id: 'e22',
    concept: '单向度的人——批判的消失',
    category: '西方马克思主义 · 马尔库塞',
    description: EDITORIAL['ESSAY_MATERIALS.e22.description'],
    applicableTopics: ['消费主义', '技术理性', '批判精神', '独立思考', '反抗与顺从'],
    materials: [],
  },
  {
    id: 'e23',
    concept: '规训与惩罚——权力如何塑造身体',
    category: '后现代哲学 · 福柯',
    description: EDITORIAL['ESSAY_MATERIALS.e23.description'],
    applicableTopics: ['权力的微观运作', '纪律与自由', '监控社会', '标准化与个性', '规训'],
    materials: [],
  },
  {
    id: 'e24',
    concept: '想象的共同体——民族是什么',
    category: '历史学 · 安德森',
    description: EDITORIAL['ESSAY_MATERIALS.e24.description'],
    applicableTopics: ['民族认同', '集体记忆', '文化建构', '想象与真实', '全球化与本土化'],
    materials: [],
  },
  {
    id: 'e25',
    concept: '消费社会——符号的狂欢',
    category: '社会学 · 鲍德里亚',
    description: EDITORIAL['ESSAY_MATERIALS.e25.description'],
    applicableTopics: ['消费主义', '品牌与身份', '符号价值', '极简主义', '物质与精神'],
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
