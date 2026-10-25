// A stable navigation taxonomy, independent of the more detailed source labels.
export const KNOWLEDGE_GROUPS = [
  {
    name: '哲学与思想',
    subjects: [
      '中国哲学',
      '西方哲学',
      '政治哲学',
      '后现代哲学',
      '西方马克思主义',
      '情境主义国际',
      '存在主义',
      '技术哲学',
      '历史哲学',
      '语言哲学',
    ],
  },
  {
    name: '社会与心理',
    subjects: [
      '社会学',
      '人类学',
      '社会心理学',
      '经济社会学',
      '认知心理学',
      '组织心理学',
      '媒介心理学',
      '心理学',
    ],
  },
  {
    name: '经济与决策',
    subjects: ['经济学', '微观经济学', '行为经济学', '经济史', '博弈论', '环境经济学'],
  },
  {
    name: '文学与传播',
    subjects: ['文学理论', '中国文学', '媒介研究', '媒介哲学', '传播学', '文学批评', '美学'],
  },
  { name: '历史与世界', subjects: ['国际关系', '政治学', '历史学'] },
] as const;
export function knowledgeGroup(subject: string) {
  const primary = subject.split('·')[0].trim();
  return (
    KNOWLEDGE_GROUPS.find((group) => (group.subjects as readonly string[]).includes(primary))
      ?.name || '其他'
  );
}
