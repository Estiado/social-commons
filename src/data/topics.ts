/**
 * 高考议论文话题关键词库
 * 用于自动给文章打标签，按话题聚合
 */

export interface Topic {
  id: string;
  name: string;
  keywords: string[];
}

export const TOPICS: Topic[] = [
  {
    id: 'tech-ai',
    name: '科技与AI',
    keywords: ['人工智能', 'AI', '科技', '创新', '芯片', '算法', '大数据', '互联网', '数字', '智能', '机器人', 'ChatGPT', '大模型', '技术'],
  },
  {
    id: 'education',
    name: '教育与成长',
    keywords: ['教育', '高考', '大学', '学习', '人才', '培养', '学生', '老师', '学校', '课程', '知识', '读书', '成长', '青春'],
  },
  {
    id: 'culture',
    name: '文化与传承',
    keywords: ['文化', '传统', '历史', '文学', '艺术', '传承', '国学', '经典', '非遗', '节日', '习俗', '精神', '文明'],
  },
  {
    id: 'society',
    name: '社会与青年',
    keywords: ['社会', '青年', '责任', '担当', '奋斗', '时代', '价值', '道德', '规则', '公平', '正义', '公益', '志愿'],
  },
  {
    id: 'economy',
    name: '经济与发展',
    keywords: ['经济', '发展', '市场', '消费', '产业', '企业', '就业', '创业', '金融', '贸易', '增长', '转型', '乡村'],
  },
  {
    id: 'international',
    name: '国际与全球',
    keywords: ['国际', '全球', '外交', '合作', '竞争', '世界', '国家', '战略', '安全', '和平', '开放', '全球化'],
  },
  {
    id: 'environment',
    name: '生态与环境',
    keywords: ['环境', '生态', '绿色', '低碳', '碳达峰', '碳中和', '气候', '污染', '保护', '自然', '可持续', '能源'],
  },
  {
    id: 'philosophy',
    name: '哲学与思辨',
    keywords: ['哲学', '思辨', '逻辑', '辩证', '思考', '认知', '真理', '价值', '意义', '自由', '选择', '困境'],
  },
];

/**
 * 基于文本内容匹配话题标签
 * @param text 文章标题+摘要+正文前500字
 * @returns 匹配到的话题名称列表
 */
export function matchTopics(text: string): string[] {
  if (!text) return [];
  const lowerText = text.toLowerCase();
  const matched: string[] = [];

  for (const topic of TOPICS) {
    let score = 0;
    for (const keyword of topic.keywords) {
      const normalized = keyword.toLowerCase();
      if (!normalized) continue;
      let offset = 0;
      while (score < 2) {
        const match = lowerText.indexOf(normalized, offset);
        if (match < 0) break;
        score++;
        offset = match + normalized.length;
      }
      // 只需要判断阈值，不创建整段文本的匹配数组，也不再扫描剩余关键词。
      if (score >= 2) break;
    }
    // 匹配到至少2个关键词或1个关键词出现多次才算
    if (score >= 2) {
      matched.push(topic.name);
    }
  }

  return matched;
}
