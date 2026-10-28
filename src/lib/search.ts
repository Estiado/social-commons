export type SearchType = 'daily' | 'quote' | 'event' | 'essay' | 'guanlan-event' | 'world';

export interface SearchResult {
  id: string;
  type: SearchType;
  title: string;
  subtitle: string;
  path: string;
  category?: string;
  tags?: string[];
  source?: string;
  sourceNames?: string[];
  summary?: string;
}

export interface SearchDocument extends SearchResult {
  /** Normalized once when the public catalogue is loaded. */
  searchText: string;
  /** Original plain text for a contextual snippet; never returned in results. */
  excerptText?: string;
}

export interface SearchFilters {
  type?: SearchType;
  category?: string;
  tag?: string;
  source?: string;
}

export function normalizeSearch(value: string): string {
  return value.normalize('NFKC').toLocaleLowerCase().replace(/\s+/gu, ' ').trim();
}

/** Whitespace joins up to eight terms with AND; punctuation is literal, never a regex. */
export function searchTerms(query: string): string[] {
  return [...new Set(normalizeSearch(query.slice(0, 200)).split(' ').filter(Boolean))].slice(0, 8);
}

export function searchSnippet(text: string, terms: readonly string[], length = 118): string {
  const plain = text.replace(/\s+/gu, ' ').trim();
  if (plain.length <= length) return plain;
  const normalized = normalizeSearch(plain);
  const positions = terms.map((term) => normalized.indexOf(term)).filter((index) => index >= 0);
  const first = positions.length ? Math.min(...positions) : 0;
  const start = Math.max(0, first - 28);
  const end = Math.min(plain.length, start + length);
  return `${start ? '…' : ''}${plain.slice(start, end)}${end < plain.length ? '…' : ''}`;
}

/** Search all candidates before limiting: a late title match outranks an early body match. */
export function searchDocuments(
  documents: readonly SearchDocument[],
  query: string,
  limit = 30,
  filters: SearchFilters = {},
  browse = false,
): SearchResult[] {
  const terms = searchTerms(query);
  if (limit <= 0 || (!terms.length && !browse && !Object.values(filters).some(Boolean))) return [];
  const ranked: { document: SearchDocument; score: number; order: number }[] = [];
  for (const [order, document] of documents.entries()) {
    if (filters.type && document.type !== filters.type) continue;
    if (filters.category && document.category !== filters.category) continue;
    if (filters.tag && !document.tags?.includes(filters.tag)) continue;
    if (
      filters.source &&
      document.source !== filters.source &&
      !document.sourceNames?.includes(filters.source)
    )
      continue;
    if (!terms.every((term) => document.searchText.includes(term))) continue;
    const title = normalizeSearch(document.title);
    const tags = normalizeSearch((document.tags || []).join(' '));
    const source = normalizeSearch(document.source || document.subtitle);
    const score =
      terms.reduce(
        (total, term) =>
          total +
          (title.includes(term) ? 12 : tags.includes(term) ? 7 : source.includes(term) ? 4 : 1),
        0,
      ) + (terms.length && title === terms.join(' ') ? 24 : 0);
    ranked.push({ document, score, order });
  }
  ranked.sort((a, b) => b.score - a.score || a.order - b.order);
  return ranked.slice(0, limit).map(({ document }) => {
    const { searchText: _index, excerptText, ...result } = document;
    return {
      ...result,
      summary: searchSnippet(excerptText || document.summary || document.subtitle, terms),
    };
  });
}

/** Safe text ranges for React <mark>; merges overlapping matches without HTML parsing. */
export function searchHighlights(text: string, query: string): { start: number; end: number }[] {
  const ranges = searchTerms(query)
    .flatMap((term) => {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
      return Array.from(text.matchAll(new RegExp(escaped, 'giu')), (match) => ({
        start: match.index,
        end: match.index + match[0].length,
      }));
    })
    .sort((a, b) => a.start - b.start);
  const merged: typeof ranges = [];
  for (const range of ranges) {
    const previous = merged.at(-1);
    if (previous && range.start <= previous.end) previous.end = Math.max(previous.end, range.end);
    else merged.push({ ...range });
  }
  return merged;
}
