import { DAILY_KNOWLEDGE } from './daily';
import { QUOTES } from './quotes';
import { EVENTS } from './events';
import { ESSAY_MATERIALS } from './essay';
import type { SearchDocument } from '../lib/search';

// 随搜索弹窗按需加载；索引由模块缓存，不在每次输入时重建全文字符串。
export const SEARCH_INDEX: SearchDocument[] = [
  ...DAILY_KNOWLEDGE.map((item) => ({
    id: `daily-${item.id}`, type: 'daily' as const, title: item.title, subtitle: item.category,
    path: `/daily?id=${encodeURIComponent(item.id)}`,
    searchText: [item.title, item.content, item.category, item.summary, item.source].join(' ').toLowerCase(),
  })),
  ...QUOTES.map((item) => ({
    id: `quote-${item.id}`, type: 'quote' as const, title: item.text, subtitle: `${item.author} · ${item.source}`,
    path: `/quotes?id=${encodeURIComponent(item.id)}`,
    searchText: [item.text, item.author, item.source, item.commentary?.text].join(' ').toLowerCase(),
  })),
  ...EVENTS.map((item) => ({
    id: `event-${item.id}`, type: 'event' as const, title: item.title, subtitle: item.category,
    path: `/events/${item.id}`,
    searchText: [item.title, item.summary, item.category, ...item.perspectives.map((p) => `${p.title} ${p.description}`)].join(' ').toLowerCase(),
  })),
  ...ESSAY_MATERIALS.map((item) => ({
    id: `essay-${item.id}`, type: 'essay' as const, title: item.concept, subtitle: item.category,
    path: `/essay?id=${encodeURIComponent(item.id)}`,
    searchText: [item.concept, item.description, item.category, ...item.applicableTopics,
      ...item.materials.map((material) => `${material.title} ${material.content} ${material.source}`)].join(' ').toLowerCase(),
  })),
];
