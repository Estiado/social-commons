import { collectionsSchema } from '../collections.ts';
import type { ReadingExcerpt } from '../excerpts.ts';
import { articleSchema, type ArticleBlock } from '../model.ts';
import { newDraft } from './model.ts';
import { getDraftByOrigin, saveDraft } from './repository.ts';
import { provenanceParagraph } from '../references.ts';

/** Old folders become editable manuscripts. Keep the original backup untouched. */
export async function migrateLegacyDrafts(excerpts: ReadingExcerpt[], raw?: unknown) {
  const groups = collectionsSchema.parse(
    raw === undefined
      ? JSON.parse(localStorage.getItem('social-commons:reading-collections-v1') || '[]')
      : raw,
  );
  const byKey = new Map(excerpts.map((excerpt) => [excerpt.key, excerpt]));
  for (const group of groups) {
    if (await getDraftByOrigin(`legacy-collection:${group.id}`)) continue;
    const draft = newDraft();
    const blocks: ArticleBlock[] = [
      { id: '', type: 'paragraph', text: group.description || '原有资料已转为文稿，可继续编辑。' },
    ];
    for (const reference of group.items) {
      const excerpt = byKey.get(reference.key);
      blocks.push({ id: '', type: 'heading', level: 2, text: excerpt?.title || '待恢复的旧摘录' });
      blocks.push({
        id: '',
        type: 'quote',
        text: excerpt?.text || `原摘录暂不可读，原编号：${reference.key}`,
      });
      if (excerpt)
        blocks.push({
          id: '',
          ...provenanceParagraph(excerpt),
        });
      if (reference.note)
        blocks.push({ id: '', type: 'paragraph', text: `我的备注：${reference.note}` });
    }
    draft.originKey = `legacy-collection:${group.id}`;
    draft.document = articleSchema.parse({
      ...draft.document,
      title: group.name,
      blocks: blocks.map((block, index) => ({ ...block, id: `b${index + 1}` })),
    });
    await saveDraft(draft);
  }
}
