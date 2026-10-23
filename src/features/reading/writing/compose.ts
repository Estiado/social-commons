import {
  articleSchema,
  isPartialArticle,
  type ArticleBlock,
  type ArticleDocument,
} from '../model.ts';
import type { ReadingExcerpt } from '../excerpts.ts';
import { newDraft } from './model.ts';
import { isBlockedDocument, isVerificationPage, SourceVerificationError } from '../sourceAccess.ts';
import { provenanceParagraph } from '../references.ts';

export type WritingSource =
  | { kind: 'article' | 'draft'; document: ArticleDocument }
  | { kind: 'excerpt'; excerpt: ReadingExcerpt };

/** Compile only selected items, in selection order, into one editable snapshot. */
export function composeDraft(sources: WritingSource[], title = '我的阅读文稿') {
  if (!sources.length) throw new Error('请先选择要编入文稿的内容');
  const blocks: ArticleBlock[] = [];
  for (const source of sources) {
    const article = source.kind === 'excerpt' ? undefined : source.document;
    if (article && isBlockedDocument(article)) throw new SourceVerificationError();
    if (source.kind === 'excerpt' && isVerificationPage(source.excerpt.title, source.excerpt.text))
      throw new SourceVerificationError();
    const item = source.kind === 'excerpt' ? source.excerpt : source.document;
    blocks.push({ id: '', type: 'heading', level: 1, text: item.title });
    if (article && isPartialArticle(article))
      blocks.push({ id: '', type: 'paragraph', text: '【节选，非全文】以下为已保存的可见部分。' });
    if (source.kind === 'excerpt')
      blocks.push({ id: '', type: 'quote', text: source.excerpt.text });
    else blocks.push(...source.document.blocks.map((block) => ({ ...block })));
    blocks.push({
      id: '',
      ...provenanceParagraph(item),
    });
    if (article)
      for (const warning of article.warnings)
        blocks.push({ id: '', type: 'paragraph', text: `原文核对提示：${warning}` });
  }
  const draft = newDraft();
  draft.document = articleSchema.parse({
    ...draft.document,
    title,
    blocks: blocks.map((block, index) => ({ ...block, id: `b${index + 1}` })),
  });
  return draft;
}
