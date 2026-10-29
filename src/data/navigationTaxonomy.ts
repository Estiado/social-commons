import { knowledgeGroup } from './knowledgeCategories.ts';

/** Navigation groups do not replace source labels or persistent topic IDs. */
export const TOPIC_GROUPS = [
  {
    id: 'youth',
    name: '青年与社会',
    topicIds: ['youth-university', 'youth-responsibility', 'education-growth', 'society-fairness'],
  },
  { id: 'technology', name: '科技与生活', topicIds: ['tech-ai', 'economy-development'] },
  {
    id: 'culture',
    name: '文化与历史',
    topicIds: ['culture-heritage', 'history-memory', 'literature-aesthetics'],
  },
  { id: 'thought', name: '思想与个体', topicIds: ['philosophy-thinking', 'individual-freedom'] },
  { id: 'world', name: '世界与环境', topicIds: ['international-global', 'ecology-future'] },
  { id: 'other', name: '其他', topicIds: ['other'] },
] as const;

const THEMES: [string, RegExp][] = [
  ['青年与成长', /青年|大学|成长|成才|职业|就业/u],
  ['学习与教育', /学习|教育|知识|读书|阅读|认知/u],
  ['公平与权利', /公平|正义|权利|平等|程序|性别/u],
  ['科技与AI', /AI|人工智能|算法|科技|技术|科学/u],
  ['文化与传承', /文化|传承|传统|非遗|创新/u],
  ['文学与审美', /文学|诗|审美|戏剧|创作|创造|艺术/u],
  ['自我与选择', /自我|个体|自由|选择|责任|人生|意义/u],
  ['经济与消费', /经济|消费|市场|劳动|资本|收入/u],
  ['环境与合作', /环境|生态|能源|气候|合作|可持续/u],
  ['冲突与和平', /战争|冲突|和平|俄乌|巴以|加沙/u],
  ['媒介与传播', /媒介|媒体|传播|舆论|短视频|信息/u],
];

export function navigationThemes(values: readonly string[]): string[] {
  const text = values.join(' ');
  return THEMES.filter(([, pattern]) => pattern.test(text)).map(([name]) => name);
}

export function navigationCategory(category: string, type: string): string {
  if (type === 'quote') return '文学与传播';
  const group = knowledgeGroup(category);
  if (group !== '其他') return group;
  if (/科技|技术|科学|人工智能|AI/u.test(category)) return '科学与技术';
  if (/国际|全球|历史|冲突|和平|地缘|战争/u.test(category) || type === 'event' || type === 'world')
    return '历史与世界';
  if (/哲学|个体|自由|思辨/u.test(category)) return '哲学与思想';
  if (/经济|消费/u.test(category)) return '经济与决策';
  if (/文化|文学|传播|传承/u.test(category)) return '文学与传播';
  if (/青年|教育|成长|社会|公平/u.test(category)) return '社会与心理';
  return '其他';
}
