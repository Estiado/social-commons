import { EDITORIAL } from '../../.artifacts/editorial/searchIndex.ts';
import { DAILY_KNOWLEDGE } from './daily.ts';
import { QUOTE_CATALOGUE as QUOTES } from './quotes.ts';
import { EVENTS } from './events.ts';
import { ESSAY_MATERIALS } from './essay.ts';
import { normalizeSearch, type SearchDocument } from '../lib/search.ts';
import { GUANLAN_EVENTS } from './guanlan/catalogue.ts';
import { WORLD_STORIES } from './world/catalogue.ts';
import { TOPIC_SPECIALS } from './topicSpecials.ts';

const topicNames = new Map(TOPIC_SPECIALS.map((topic) => [topic.id, topic.name]));
const subject = (category: string) => category.split('·')[0].trim();
const sourceLabel = (source: string) => source.split(/https?:\/\/|[；\n]/u)[0].trim();

// 随搜索弹窗按需加载；索引由模块缓存，不在每次输入时重建全文字符串。
const documents: SearchDocument[] = [
  ...WORLD_STORIES.map((item) => ({
    id: 'world-' + item.id,
    type: 'world' as const,
    title: item.title,
    subtitle: '知天下 · 长期事件',
    category: item.category,
    tags: item.keywords,
    source: item.sourceNames?.join('、') || '知天下 · 事件脉络',
    sourceNames: item.sourceNames,
    summary: item.summary,
    path: '/world/' + item.id,
    searchText: [item.title, item.summary, ...item.keywords].join(' ').toLowerCase(),
  })),
  ...GUANLAN_EVENTS.map((item) => ({
    id: `guanlan-event-${item.id}`,
    type: 'guanlan-event' as const,
    title: item.title,
    subtitle: EDITORIAL['SEARCH_INDEX.0.arg0.subtitle'],
    category: topicNames.get(item.topicIds[0]) || '事件精读',
    tags: [...item.keywords, ...item.topicIds.flatMap((id) => topicNames.get(id) || [])],
    source: item.sourceNames?.join('、') || '观澜 · 事件精读',
    sourceNames: item.sourceNames,
    summary: item.summary,
    path: `/guanlan/events/${item.id}`,
    searchText: [item.title, item.summary, item.question, ...item.keywords].join(' ').toLowerCase(),
  })),
  ...DAILY_KNOWLEDGE.map((item) => ({
    id: `daily-${item.id}`,
    type: 'daily' as const,
    title: item.title,
    subtitle: item.category,
    category: subject(item.category),
    tags: [item.title.split('：')[0], ...item.category.split('·').map((part) => part.trim())],
    source: item.researchSource?.journal || sourceLabel(item.source),
    summary: item.summary,
    excerptText: item.content,
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
    category: '诗文与名句',
    tags: [item.author, item.source.replace(/[《》]/gu, '')],
    source: item.author,
    summary: item.text,
    excerptText: [item.text, item.commentary?.text].filter(Boolean).join('\n\n'),
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
    category: subject(item.category),
    tags: [item.category, ...item.perspectives.map((view) => view.role)],
    source: '群鉴 · 多方史料',
    summary: item.summary,
    excerptText: [item.summary, ...item.perspectives.map((view) => view.description)].join('\n\n'),
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
    category: subject(item.category),
    tags: item.applicableTopics,
    source: '议论文素材 · 概念与例证',
    summary: item.description,
    excerptText: [item.description, ...item.materials.map((material) => material.content)].join(
      '\n\n',
    ),
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

export const SEARCH_INDEX: SearchDocument[] = documents.map((document) => ({
  ...document,
  sourceNames: document.sourceNames?.length
    ? document.sourceNames
    : document.source
      ? [document.source]
      : [],
  tags: [...new Set(document.tags.filter(Boolean))],
  searchText: normalizeSearch(
    [
      document.searchText,
      document.source,
      ...(document.sourceNames || []),
      document.category,
      ...(document.tags || []),
    ].join(' '),
  ),
}));
