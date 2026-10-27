import { EDITORIAL } from '../../.artifacts/editorial/searchIndex.ts';
import { DAILY_KNOWLEDGE } from './daily.ts';
import { QUOTE_CATALOGUE as QUOTES } from './quotes.ts';
import { EVENTS } from './events.ts';
import { ESSAY_MATERIALS } from './essay.ts';
import type { SearchDocument } from '../lib/search.ts';
import { GUANLAN_EVENTS } from './guanlan/catalogue.ts';
import { WORLD_STORIES } from './world/catalogue.ts';

// 随搜索弹窗按需加载；索引由模块缓存，不在每次输入时重建全文字符串。
export const SEARCH_INDEX: SearchDocument[] = [
  ...WORLD_STORIES.map((item) => ({
    id: 'world-' + item.id,
    type: 'world' as const,
    title: item.title,
    subtitle: '知天下 · 长期事件',
    path: '/world/' + item.id,
    searchText: [item.title, item.summary, ...item.keywords].join(' ').toLowerCase(),
  })),
  ...GUANLAN_EVENTS.map((item) => ({
    id: `guanlan-event-${item.id}`,
    type: 'guanlan-event' as const,
    title: item.title,
    subtitle: EDITORIAL['SEARCH_INDEX.0.arg0.subtitle'],
    path: `/guanlan/events/${item.id}`,
    searchText: [item.title, item.summary, item.question, ...item.keywords].join(' ').toLowerCase(),
  })),
  ...DAILY_KNOWLEDGE.map((item) => ({
    id: `daily-${item.id}`,
    type: 'daily' as const,
    title: item.title,
    subtitle: item.category,
    path: `/daily/${encodeURIComponent(item.id)}`,
    searchText: [item.title, item.content, item.category, item.summary, item.source]
      .join(' ')
      .toLowerCase(),
  })),
  ...QUOTES.map((item) => ({
    id: `quote-${item.id}`,
    type: 'quote' as const,
    title: item.title || item.source,
    subtitle: `${item.author} · ${item.text.slice(0, 45)}…`,
    path: `/quotes/${encodeURIComponent(item.id)}`,
    searchText: [item.text, item.author, item.source, item.commentary?.text]
      .join(' ')
      .toLowerCase(),
  })),
  ...EVENTS.map((item) => ({
    id: `event-${item.id}`,
    type: 'event' as const,
    title: item.title,
    subtitle: item.category,
    path: `/events/${item.id}`,
    searchText: [
      item.title,
      item.summary,
      item.category,
      ...item.perspectives.map((p) => `${p.title} ${p.description}`),
    ]
      .join(' ')
      .toLowerCase(),
  })),
  ...ESSAY_MATERIALS.map((item) => ({
    id: `essay-${item.id}`,
    type: 'essay' as const,
    title: item.concept,
    subtitle: item.category,
    path: `/essay?id=${encodeURIComponent(item.id)}`,
    searchText: [
      item.concept,
      item.description,
      item.category,
      ...item.applicableTopics,
      ...item.materials.map(
        (material) => `${material.title} ${material.content} ${material.source}`,
      ),
    ]
      .join(' ')
      .toLowerCase(),
  })),
];
