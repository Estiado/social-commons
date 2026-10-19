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
];

export function getEssayMaterialsByCategory(category: string): IEssayMaterial[] {
  if (category === '全部') return ESSAY_MATERIALS;
  return ESSAY_MATERIALS.filter((m) => m.category.startsWith(category));
}

export function getEssayCategories(): string[] {
  return ['全部', ...Array.from(new Set(ESSAY_MATERIALS.map((m) => m.category.split(' · ')[0])))];
}
