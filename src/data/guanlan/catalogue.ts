import type { GuanlanEventSummary } from './types';

/** Lightweight entry points; event bodies are requested only on their own pages. */
export const GUANLAN_EVENTS: GuanlanEventSummary[] = [
  {
    id: 'heritage-short-video',
    title: '当打铁花被截成十几秒：非遗怎样继续活着',
    summary: '从打铁花的短视频传播，追问观看、技艺学习与传承人的生活之间，还隔着哪些环节。',
    question: '被看见以后，怎样有人继续做、愿意学？',
    sortDate: '2026-10-23',
    dateLabel: '报道与评论：2026年10月23日',
    topicIds: ['culture-heritage', 'tech-ai', 'literature-aesthetics'],
    keywords: ['非遗', '打铁花', '短视频', '活态传承', '文化与生活'],
  },
  {
    id: 'ai-at-work',
    title: '当AI成了职场口头禅：效率究竟发生在哪里',
    summary: '从年轻人对职场AI热的吐槽出发，对照生产率研究与劳动史，分辨工具、流程和人的责任。',
    question: '会谈论一种技术，与让它真正改善工作，有什么距离？',
    sortDate: '2026-10-13',
    dateLabel: '相关报道：2026年10月13日',
    topicIds: [
      'tech-ai',
      'youth-university',
      'youth-responsibility',
      'economy-development',
      'individual-freedom',
      'history-memory',
    ],
    keywords: ['AI', '人工智能', '职场', '效率', '劳动', '技术热'],
  },
  {
    id: 'academic-bars',
    title: '学术酒吧兴起之后：一次相遇能留下什么',
    summary: '把学术讲座搬进酒吧，带来了新的线下相遇，也让知识质量、消费门槛与关系延续成为问题。',
    question: '短暂的共同兴趣，怎样成为理解与交流的起点？',
    sortDate: '2026-07-10',
    dateLabel: '现象始于此前报道；跟进研究：2026年7月10日',
    topicIds: [
      'youth-university',
      'education-growth',
      'society-fairness',
      'philosophy-thinking',
      'individual-freedom',
    ],
    keywords: ['学术酒吧', '青年', '社交', '知识消费', '临时共同体', '归属感'],
  },
];

export function eventsForTopic(topicId?: string): GuanlanEventSummary[] {
  return GUANLAN_EVENTS.filter((item) => !topicId || item.topicIds.includes(topicId)).sort((a, b) =>
    b.sortDate.localeCompare(a.sortDate),
  );
}
