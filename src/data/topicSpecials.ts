/**
 * 高考议论文专题数据
 * 每个专题聚合相关话题的文章、通识、名句，方便高三学生按主题找素材
 */

export interface TopicSpecial {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  // 用于匹配观澜文章的话题标签
  relatedTags: string[];
  // 相关的日新通识ID（对应daily.ts中的id）
  relatedDailyIds: string[];
  // 相关的撷英名句ID（对应quotes.ts中的id）
  relatedQuoteIds: string[];
  // 专题封面色（用于卡片渐变）
  color: string;
}

export const TOPIC_SPECIALS: TopicSpecial[] = [
  {
    id: 'tech-ai',
    name: '科技与AI',
    subtitle: '人工智能时代的人文思考',
    description: '当算法开始写作、AI开始对话，人类的独特性在哪里？科技发展与人文关怀的张力，是高考作文常考的核心议题。',
    relatedTags: ['科技与AI'],
    relatedDailyIds: ['thucydides-trap', 'technology-society'],
    relatedQuoteIds: ['su-shi-1', 'wang-guowei'],
    color: 'from-blue-500/10 to-cyan-500/10',
  },
  {
    id: 'youth-responsibility',
    name: '青年与责任',
    subtitle: '时代洪流中的青春担当',
    description: '从"为中华之崛起而读书"到新时代的青年使命，个人与时代的关系始终是议论文的高频主题。',
    relatedTags: ['社会与青年', '教育与成长'],
    relatedDailyIds: ['mayflower', 'civil-rights'],
    relatedQuoteIds: ['li-dazhao', 'lu-xun'],
    color: 'from-red-500/10 to-orange-500/10',
  },
  {
    id: 'culture-heritage',
    name: '文化与传承',
    subtitle: '传统与现代的对话',
    description: '如何在全球化浪潮中守住文化根脉？传统文化的创造性转化，是近年高考作文的热点方向。',
    relatedTags: ['文化与传承'],
    relatedDailyIds: ['renaissance', 'enlightenment'],
    relatedQuoteIds: ['su-shi-2', 'du-fu'],
    color: 'from-amber-500/10 to-yellow-500/10',
  },
  {
    id: 'education-growth',
    name: '教育与成长',
    subtitle: '学习的本质与人生的可能',
    description: '从应试教育到素质教育，从知识灌输到人格培养，关于"人应该如何成长"的思考永不过时。',
    relatedTags: ['教育与成长'],
    relatedDailyIds: ['socratic-method', 'confucius-education'],
    relatedQuoteIds: ['zhuangzi', 'mencius'],
    color: 'from-green-500/10 to-emerald-500/10',
  },
  {
    id: 'international-vision',
    name: '国际与全球',
    subtitle: '世界格局中的中国位置',
    description: '修昔底德陷阱、文明冲突论、人类命运共同体——理解世界，才能更好地理解中国。',
    relatedTags: ['国际与全球', '社会与青年'],
    relatedDailyIds: ['thucydides-trap', 'cold-war'],
    relatedQuoteIds: ['wang-yangming', 'zeng-guofan'],
    color: 'from-purple-500/10 to-indigo-500/10',
  },
  {
    id: 'philosophy-thinking',
    name: '哲学与思辨',
    subtitle: '追问根本问题的能力',
    description: '我是谁？从哪里来？到哪里去？哲学思辨能力是议论文深度的核心，也是区分平庸与深刻的关键。',
    relatedTags: ['哲学与思辨', '文化与传承'],
    relatedDailyIds: ['socratic-method', 'allegory-cave'],
    relatedQuoteIds: ['nietzsche', 'sartre'],
    color: 'from-slate-500/10 to-gray-500/10',
  },
];
