import { knowledgeGroup } from '@/data/knowledgeCategories';
import { TOPIC_GROUPS } from '@/data/navigationTaxonomy';
import type { BookChapterId, BookEntry } from './chapters';

type EntryInput = Omit<BookEntry, 'searchText'> & { keywords?: string[] };
const entry = (input: EntryInput): BookEntry => ({
  ...input,
  searchText: [
    input.title,
    input.summary,
    input.metadata,
    ...input.groups,
    ...(input.keywords || []),
  ]
    .join(' ')
    .toLocaleLowerCase(),
});

// Each chapter owns a lazy import. Opening the contents never downloads all six catalogues.
const loaders: Record<BookChapterId, () => Promise<BookEntry[]>> = {
  daily: async () => {
    const { DAILY_KNOWLEDGE } = await import('@/data/daily');
    return DAILY_KNOWLEDGE.map((item) =>
      entry({
        id: item.id,
        title: item.title,
        summary: item.summary,
        groups: [knowledgeGroup(item.category)],
        metadata: item.category,
        path: '/daily/' + encodeURIComponent(item.id),
      }),
    );
  },
  events: async () => {
    const { EVENTS } = await import('@/data/events');
    return EVENTS.map((item) =>
      entry({
        id: item.id,
        title: item.title,
        summary: item.summary,
        groups: [item.category.split(' · ').at(-1)!],
        metadata: item.date + ' · ' + item.perspectives.length + '个视角',
        path: '/events/' + encodeURIComponent(item.id),
      }),
    );
  },
  quotes: async () => {
    const { QUOTE_CATALOGUE } = await import('@/data/quotes');
    return QUOTE_CATALOGUE.map((item) =>
      entry({
        id: item.id,
        title: item.title || item.source,
        summary: item.text,
        groups: [item.author],
        metadata: item.author + ' · ' + item.source,
        path: '/quotes/' + encodeURIComponent(item.id),
      }),
    );
  },
  essay: async () => {
    const { ESSAY_MATERIALS } = await import('@/data/essay');
    return ESSAY_MATERIALS.map((item) =>
      entry({
        id: item.id,
        title: item.concept,
        summary: item.description,
        groups: [knowledgeGroup(item.category)],
        metadata: item.category,
        keywords: item.applicableTopics,
        path: '/essay?id=' + encodeURIComponent(item.id),
      }),
    );
  },
  guanlan: async () => {
    const { GUANLAN_EVENTS } = await import('@/data/guanlan/catalogue');
    return GUANLAN_EVENTS.map((item) =>
      entry({
        id: item.id,
        title: item.title,
        summary: item.summary,
        groups: TOPIC_GROUPS.filter((group) =>
          group.topicIds.some((id) => item.topicIds.includes(id)),
        ).map((group) => group.name),
        metadata: item.dateLabel,
        keywords: [item.question, ...item.keywords],
        path: '/guanlan/events/' + encodeURIComponent(item.id),
      }),
    );
  },
  world: async () => {
    const { WORLD_STORIES } = await import('@/data/world/catalogue');
    return WORLD_STORIES.map((item) =>
      entry({
        id: item.id,
        title: item.title,
        summary: item.summary,
        groups: [item.category],
        metadata: item.period,
        keywords: item.keywords,
        path: '/world/' + encodeURIComponent(item.id),
      }),
    );
  },
};

const cache = new Map<BookChapterId, Promise<BookEntry[]>>();
export function loadBookCatalogue(id: BookChapterId) {
  let pending = cache.get(id);
  if (!pending) {
    pending = loaders[id]().catch((error) => {
      cache.delete(id);
      throw error;
    });
    cache.set(id, pending);
  }
  return pending;
}
