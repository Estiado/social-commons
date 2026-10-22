import { z } from 'zod';
import { articleSchema, type ArticleDocument, type TextBlock } from '../model.ts';

export const draftSchema = z.object({
  document: articleSchema,
  revision: z.number().int().min(0),
  updatedAt: z.iso.datetime(),
  originKey: z.string().max(200).optional(),
});
export type WritingDraft = z.infer<typeof draftSchema>;
export interface DraftSummary {
  id: string;
  title: string;
  updatedAt: string;
  revision: number;
}
export const summarizeDraft = (draft: WritingDraft): DraftSummary => ({
  id: draft.document.id,
  title: draft.document.title,
  updatedAt: draft.updatedAt,
  revision: draft.revision,
});

export function newDraft(document?: ArticleDocument): WritingDraft {
  return draftSchema.parse({
    document: document || {
      schemaVersion: 1,
      id: crypto.randomUUID(),
      contentVersion: crypto.randomUUID(),
      title: '未命名文稿',
      source: '个人整理 · 社科通识',
      author: '',
      url: '',
      publishedAt: '',
      importedAt: new Date().toISOString(),
      completeness: 'user-confirmed',
      tags: [],
      warnings: [],
      blocks: [{ id: 'b1', type: 'paragraph', text: ' ' }],
    },
    revision: 0,
    updatedAt: new Date().toISOString(),
  });
}

export interface StyledRun {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  href?: string;
}
/** One pass over validated non-overlapping ranges; plain articles need no extra runs. */
export function styledRuns(block: TextBlock): StyledRun[] {
  const runs: StyledRun[] = [];
  let position = 0;
  for (const span of block.spans || []) {
    if (span.start > position) runs.push({ text: block.text.slice(position, span.start) });
    runs.push({ ...span, text: block.text.slice(span.start, span.end) });
    position = span.end;
  }
  if (position < block.text.length) runs.push({ text: block.text.slice(position) });
  return runs;
}
