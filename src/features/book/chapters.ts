export const BOOK_CHAPTERS = [
  { id: 'daily', label: '日新', path: '/daily' },
  { id: 'events', label: '群鉴', path: '/events' },
  { id: 'quotes', label: '撷英', path: '/quotes' },
  { id: 'essay', label: '议论文素材', path: '/essay' },
  { id: 'guanlan', label: '观澜', path: '/guanlan' },
  { id: 'world', label: '知天下', path: '/world' },
] as const;

export type BookChapter = (typeof BOOK_CHAPTERS)[number];
export type BookChapterId = BookChapter['id'];

export interface BookEntry {
  id: string;
  title: string;
  summary: string;
  groups: string[];
  metadata: string;
  path: string;
  searchText: string;
}

export function chapterForPath(pathname: string) {
  return BOOK_CHAPTERS.find((chapter) => pathname === chapter.path);
}

/** An article deep link must reach the incumbent reader, never an index overlay. */
export function showBookCatalogue(pathname: string, search: string) {
  const params = new URLSearchParams(search);
  return (
    Boolean(chapterForPath(pathname)) && !['id', 'view', 'group'].some((key) => params.has(key))
  );
}

export function filterBookEntries(entries: BookEntry[], query: string, group: string) {
  const words = query.trim().toLocaleLowerCase().split(/\s+/u).filter(Boolean);
  return entries.filter(
    (entry) =>
      (!group || entry.groups.includes(group)) &&
      words.every((word) => entry.searchText.includes(word)),
  );
}
