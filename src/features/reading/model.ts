import { z } from 'zod';
import { documentTypographySchema } from './typography.ts';
import { isBlockedDocument, SourceVerificationError } from './sourceAccess.ts';

export const GUEST_RETENTION_MS = 7 * 24 * 60 * 60 * 1000;
export const MAX_ARTICLE_CHARACTERS = 160_000;
export const MAX_ARTICLE_IMAGES = 24;

/** Only structured text is rendered. Imported HTML is never stored or executed. */
const textBlockSchema = z.object({
  id: z.string().max(80),
  type: z.enum(['paragraph', 'heading', 'quote', 'list-item']),
  text: z.string().min(1).max(30_000),
  level: z.number().int().min(1).max(4).optional(),
  alignment: z.enum(['left', 'center', 'right', 'justify']).optional(),
  listOrder: z.number().int().min(1).max(9999).optional(),
  spans: z
    .array(
      z.object({
        start: z.number().int().min(0),
        end: z.number().int().min(1),
        bold: z.boolean().optional(),
        italic: z.boolean().optional(),
        underline: z.boolean().optional(),
        strike: z.boolean().optional(),
        href: z
          .url()
          .max(2048)
          .refine((url) => /^https?:\/\//i.test(url))
          .optional(),
      }),
    )
    .max(10_000)
    .optional(),
});
const imageBlockSchema = z.object({
  id: z.string().max(80),
  type: z.literal('image'),
  url: z
    .url()
    .max(2048)
    .refine((url) => /^https?:\/\//i.test(url)),
  alt: z.string().max(500),
  caption: z.string().max(2000),
});
export const articleSchema = z
  .object({
    schemaVersion: z.literal(1),
    id: z.uuid(),
    contentVersion: z.uuid(),
    title: z.string().trim().min(1).max(500),
    author: z.string().max(300),
    source: z.string().max(300),
    url: z
      .string()
      .max(2048)
      .refine((url) => !url || /^https?:\/\//i.test(url)),
    publishedAt: z.string().max(80),
    importedAt: z.iso.datetime(),
    completeness: z.enum(['unverified', 'partial', 'user-confirmed']).default('unverified'),
    tags: z.array(z.string().max(80)).max(20),
    blocks: z
      .array(z.discriminatedUnion('type', [textBlockSchema, imageBlockSchema]))
      .min(1)
      .max(2000),
    warnings: z.array(z.string().max(500)).max(20),
    typography: documentTypographySchema.optional(),
  })
  .superRefine((article, context) => {
    const ids = new Set(article.blocks.map((block) => block.id));
    if (ids.size !== article.blocks.length)
      context.addIssue({ code: 'custom', message: '正文块编号重复' });
    for (const block of article.blocks) {
      if (!('text' in block)) continue;
      let end = 0;
      for (const span of block.spans || []) {
        if (span.start < end || span.end <= span.start || span.end > block.text.length)
          context.addIssue({ code: 'custom', message: '文字格式范围无效' });
        end = span.end;
      }
    }
    if (
      article.blocks.reduce((sum, block) => sum + ('text' in block ? block.text.length : 0), 0) >
      MAX_ARTICLE_CHARACTERS
    ) {
      context.addIssue({ code: 'custom', message: '文章过长，请分篇导入' });
    }
    if (article.blocks.filter((block) => block.type === 'image').length > MAX_ARTICLE_IMAGES) {
      context.addIssue({ code: 'custom', message: '插图过多，请分篇导入' });
    }
  });
export type ArticleDocument = z.infer<typeof articleSchema>;
export type ArticleBlock = ArticleDocument['blocks'][number];
export type TextBlock = Extract<ArticleBlock, { text: string }>;

/** Older saved documents may only have the original completeness warning. */
export function isPartialArticle(article: ArticleDocument): boolean {
  return (
    article.completeness === 'partial' ||
    article.warnings.some((warning) => /仅展示部分正文|仅有公开节选/.test(warning))
  );
}

export function prepareArticleExport(article: ArticleDocument): ArticleDocument {
  if (isBlockedDocument(article)) throw new SourceVerificationError();
  if (!isPartialArticle(article)) return article;
  return {
    ...article,
    title: `【节选，非全文】${article.title}`,
    warnings: [...new Set(['本文件仅包含原站公开节选，不是文章全文。', ...article.warnings])],
  };
}

export interface ArticleAnnotation {
  id: string;
  contentVersion: string;
  blockId: string;
  kind: 'paragraph' | 'highlight';
  start: number;
  end: number;
  text: string;
  createdAt: string;
}
export interface ReadingRecord {
  document: ArticleDocument;
  annotations: ArticleAnnotation[];
  expiresAt: number | null;
  /** Optimistic lock for a cloud row; contentVersion anchors annotations to the text. */
  revision: number;
  /** Separate browser concurrency check; cloud revision retains its meaning. */
  localRevision?: number;
  /** Personal associations stay in this browser, never in the public catalogue. */
  topicIds?: string[];
}
export interface ReadingSummary {
  id: string;
  title: string;
  source: string;
  importedAt: string;
  annotationCount: number;
  expiresAt: number | null;
  topicIds?: string[];
}

export function summarize(record: ReadingRecord): ReadingSummary {
  const { id, title, source, importedAt } = record.document;
  return {
    id,
    title,
    source,
    importedAt,
    annotationCount: record.annotations.length,
    expiresAt: record.expiresAt,
    topicIds: record.topicIds || [],
  };
}

export function isExpired(record: Pick<ReadingRecord, 'expiresAt'>, now = Date.now()): boolean {
  return record.expiresAt !== null && record.expiresAt <= now;
}

export function canonicalArticleUrl(value: string): string {
  if (!value.trim()) return '';
  const url = new URL(value.trim());
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.port)
    throw new Error('请输入有效的 HTTP/HTTPS 原文链接');
  url.hash = '';
  for (const key of [...url.searchParams.keys()]) {
    if (/^(utm_|spm$|from$|share_|timestamp$)/i.test(key)) url.searchParams.delete(key);
  }
  return url.href;
}

export function createAnnotation(
  document: ArticleDocument,
  blockId: string,
  start: number,
  end: number,
  kind: ArticleAnnotation['kind'],
): ArticleAnnotation {
  const block = document.blocks.find((item) => item.id === blockId);
  if (
    !block ||
    !('text' in block) ||
    !Number.isInteger(start) ||
    !Number.isInteger(end) ||
    start < 0 ||
    end > block.text.length ||
    end <= start
  ) {
    throw new Error('选区已变化，请重新选择文字');
  }
  return {
    id: crypto.randomUUID(),
    contentVersion: document.contentVersion,
    blockId,
    kind,
    start,
    end,
    text: block.text.slice(start, end),
    createdAt: new Date().toISOString(),
  };
}

export function addAnnotation(record: ReadingRecord, annotation: ArticleAnnotation): ReadingRecord {
  const block = record.document.blocks.find((item) => item.id === annotation.blockId);
  if (
    annotation.contentVersion !== record.document.contentVersion ||
    !block ||
    !('text' in block) ||
    block.text.slice(annotation.start, annotation.end) !== annotation.text
  )
    throw new Error('文章版本已变化，请重新打开文章');
  if (
    record.annotations.some(
      (item) =>
        item.blockId === annotation.blockId &&
        item.start === annotation.start &&
        item.end === annotation.end &&
        item.kind === annotation.kind,
    )
  )
    return record;
  return { ...record, annotations: [...record.annotations, annotation] };
}
