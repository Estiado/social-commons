import { EDITORIAL } from '../../../.artifacts/editorial/guanlan/catalogue.ts';
import type { GuanlanEventSummary } from './types';

/** Lightweight entry points; event bodies are requested only on their own pages. */
export const GUANLAN_EVENTS: GuanlanEventSummary[] = [
  {
    id: 'heritage-short-video',
    title: EDITORIAL['GUANLAN_EVENTS.heritage-short-video.title'],
    summary: EDITORIAL['GUANLAN_EVENTS.heritage-short-video.summary'],
    question: EDITORIAL['GUANLAN_EVENTS.heritage-short-video.question'],
    sortDate: '2026-10-23',
    dateLabel: '报道与评论：2026年10月23日',
    topicIds: ['culture-heritage', 'tech-ai', 'literature-aesthetics'],
    keywords: ['非遗', '打铁花', '短视频', '活态传承', '文化与生活'],
  },
  {
    id: 'ai-at-work',
    title: EDITORIAL['GUANLAN_EVENTS.ai-at-work.title'],
    summary: EDITORIAL['GUANLAN_EVENTS.ai-at-work.summary'],
    question: EDITORIAL['GUANLAN_EVENTS.ai-at-work.question'],
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
    title: EDITORIAL['GUANLAN_EVENTS.academic-bars.title'],
    summary: EDITORIAL['GUANLAN_EVENTS.academic-bars.summary'],
    question: EDITORIAL['GUANLAN_EVENTS.academic-bars.question'],
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
