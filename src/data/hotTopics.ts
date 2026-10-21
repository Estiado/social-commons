/**
 * 时事热点话题库
 * 观澜频道以热点话题为单位组织，每个话题下汇集多家媒体的时评文章
 * 用户提交文章时，可选择归类到某个热点话题
 */

export interface HotTopic {
  id: string;
  name: string;
  description: string;
  keywords: string[]; // 用于自动匹配文章标签
  icon: string; // lucide图标名
  color: string; // 主题色
}

export const HOT_TOPICS: HotTopic[] = [
  {
    id: 'ai-society',
    name: 'AI与社会',
    description: '人工智能技术发展对就业、教育、伦理的冲击与思考',
    keywords: ['人工智能', 'AI', 'ChatGPT', '大模型', '科技伦理', '自动化'],
    icon: 'Cpu',
    color: 'blue',
  },
  {
    id: 'culture-renaissance',
    name: '文化传承与创新',
    description: '传统文化在当代的活化、创新与传播',
    keywords: ['传统文化', '文化自信', '国潮', '非遗', '文化创新', '中华文明'],
    icon: 'Palmtree',
    color: 'amber',
  },
  {
    id: 'youth-future',
    name: '青年与未来',
    description: '当代青年的择业、生活态度与社会担当',
    keywords: ['青年', '躺平', '内卷', '就业', '择业', 'Z世代', '年轻人'],
    icon: 'GraduationCap',
    color: 'green',
  },
  {
    id: 'education-reform',
    name: '教育改革',
    description: '教育公平、双减、高考改革、素质教育等议题',
    keywords: ['教育', '高考', '双减', '教育公平', '素质教育', '教育改革'],
    icon: 'BookOpen',
    color: 'purple',
  },
  {
    id: 'tech-ethics',
    name: '科技伦理',
    description: '技术进步带来的隐私、算法、生物伦理等问题',
    keywords: ['科技伦理', '算法', '隐私', '数据安全', '基因编辑', '技术垄断'],
    icon: 'ShieldAlert',
    color: 'red',
  },
  {
    id: 'social-equity',
    name: '社会公平',
    description: '阶层流动、贫富差距、公共服务均等化',
    keywords: ['公平', '贫富差距', '阶层', '共同富裕', '公共服务', '社会公平'],
    icon: 'Scale',
    color: 'indigo',
  },
  {
    id: 'environment',
    name: '生态文明',
    description: '双碳目标、环境保护、可持续发展',
    keywords: ['环保', '碳中和', '双碳', '生态', '可持续发展', '气候变化'],
    icon: 'Leaf',
    color: 'emerald',
  },
  {
    id: 'globalization',
    name: '全球化与逆全球化',
    description: '国际贸易、地缘政治、文明冲突与对话',
    keywords: ['全球化', '国际贸易', '地缘政治', '逆全球化', '国际关系', '文明对话'],
    icon: 'Globe',
    color: 'cyan',
  },
  {
    id: 'rural-revitalization',
    name: '乡村振兴',
    description: '新农村建设、城乡融合、乡土文化',
    keywords: ['乡村振兴', '农村', '城乡', '三农', '乡土', '新农村'],
    icon: 'Home',
    color: 'lime',
  },
  {
    id: 'digital-life',
    name: '数字生活',
    description: '短视频、社交媒体、算法推荐对生活方式的重塑',
    keywords: ['短视频', '社交媒体', '算法推荐', '数字生活', '网络文化', '直播'],
    icon: 'Smartphone',
    color: 'pink',
  },
  {
    id: 'family-relation',
    name: '家庭与代际',
    description: '亲子关系、养老、婚育观念变化',
    keywords: ['家庭', '亲子', '养老', '婚育', '代际', '老龄化'],
    icon: 'Heart',
    color: 'rose',
  },
  {
    id: 'urban-life',
    name: '城市与生活',
    description: '城市化、通勤、社区、城市文化',
    keywords: ['城市', '通勤', '社区', '城市化', '城市文化', '打工'],
    icon: 'Building2',
    color: 'orange',
  },
];

// 根据文章标签匹配热点话题
export function matchHotTopic(tags: string[]): HotTopic | null {
  if (!tags || tags.length === 0) return null;
  // 手动归类写入话题全名，优先于交叉关键词，避免“科技伦理”被 AI 话题抢走。
  for (const tag of tags) {
    const explicit = HOT_TOPICS.find((topic) => topic.name === tag);
    if (explicit) return explicit;
  }
  for (const topic of HOT_TOPICS) {
    if (tags.some((tag) => tag && topic.keywords.some((kw) => tag.toLowerCase().includes(kw.toLowerCase()) || kw.toLowerCase().includes(tag.toLowerCase())))) {
      return topic;
    }
  }
  return null;
}
