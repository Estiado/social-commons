import type { ArticleDocument } from './model.ts';

export interface SearchEntry {
  key: string;
  documentId: string;
  kind: 'article' | 'draft';
  title: string;
  source: string;
  expiresAt: number | null;
  blocks: { id: string; text: string }[];
}

/** Keep searchable plain text separate from images, formatting and annotations. */
export function searchEntry(
  document: ArticleDocument,
  kind: SearchEntry['kind'],
  expiresAt: number | null = null,
): SearchEntry {
  return {
    key: `${kind}:${document.id}`,
    documentId: document.id,
    kind,
    title: document.title,
    source: `${document.source} ${document.author}`,
    expiresAt,
    blocks: document.blocks.flatMap((block) =>
      'text' in block
        ? [{ id: block.id, text: block.text }]
        : block.caption
          ? [{ id: block.id, text: block.caption }]
          : [],
    ),
  };
}

export function searchRanges(text: string, query: string) {
  const needle = query.trim().slice(0, 200);
  if (!needle) return [];
  const pattern = new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'giu');
  return Array.from(text.matchAll(pattern), (match) => ({
    start: match.index,
    end: match.index + match[0].length,
  }));
}
export function firstSearchMatch(text: string, query: string) {
  const needle = query.trim().slice(0, 200);
  if (!needle) return null;
  const match = new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'iu').exec(text);
  return match ? { start: match.index, end: match.index + match[0].length } : null;
}

export interface WorkspaceMatch {
  blockId?: string;
  snippet: string;
}
export function findInEntry(
  entry: SearchEntry,
  query: string,
  now = Date.now(),
): WorkspaceMatch | null {
  if (entry.expiresAt !== null && entry.expiresAt <= now) return null;
  for (const block of entry.blocks) {
    const match = firstSearchMatch(block.text, query);
    if (match) {
      const start = Math.max(0, match.start - 38);
      const end = Math.min(block.text.length, match.end + 90);
      return {
        blockId: block.id,
        snippet: `${start ? '…' : ''}${block.text.slice(start, end)}${end < block.text.length ? '…' : ''}`,
      };
    }
  }
  return firstSearchMatch(`${entry.title} ${entry.source}`, query)
    ? { snippet: entry.source }
    : null;
}
