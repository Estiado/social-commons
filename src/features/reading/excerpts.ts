import type { ArticleAnnotation, ReadingRecord } from './model.ts';

export interface ReadingExcerpt extends ArticleAnnotation {
  key: string;
  documentId: string;
  title: string;
  source: string;
  author: string;
  url: string;
}

export const excerptKey = (documentId: string, annotationId: string) =>
  `${documentId}:${annotationId}`;

/** The excerpt index duplicates only saved text and attribution, never full bodies. */
export function readingExcerpts(record: ReadingRecord): ReadingExcerpt[] {
  return record.annotations.map((annotation) => ({
    ...annotation,
    key: excerptKey(record.document.id, annotation.id),
    documentId: record.document.id,
    title: record.document.title,
    source: record.document.source,
    author: record.document.author,
    url: record.document.url,
  }));
}
