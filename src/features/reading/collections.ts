import { z } from 'zod';
import type { ReadingExcerpt } from './excerpts.ts';
import { createContentDocument } from './contentDocuments.ts';
import { provenanceParagraph } from './references.ts';

export const collectionSchema = z.object({
  id: z.string().min(1).max(100),
  name: z.string().trim().min(1).max(100),
  description: z.string().max(1000).default(''),
  updatedAt: z.iso.datetime(),
  items: z
    .array(z.object({ key: z.string().max(250), note: z.string().max(2000).default('') }))
    .max(2000),
});
export const collectionsSchema = z.array(collectionSchema).max(200);
export type ReadingCollection = z.infer<typeof collectionSchema>;

export function addCollectionItems(
  collection: ReadingCollection,
  keys: string[],
): ReadingCollection {
  const existing = new Set(collection.items.map((item) => item.key));
  const added: ReadingCollection['items'] = [];
  for (const key of keys) {
    if (!existing.has(key)) {
      existing.add(key);
      added.push({ key, note: '' });
    }
  }
  return collectionSchema.parse({
    ...collection,
    updatedAt: new Date().toISOString(),
    items: [...collection.items, ...added],
  });
}
export function mergeCollections(
  existing: ReadingCollection[],
  incoming: ReadingCollection[],
): ReadingCollection[] {
  const merged = new Map(existing.map((group) => [group.id, group]));
  for (const group of incoming) {
    const current = merged.get(group.id);
    // Reimport adds missing references, preserving the reader's names, order and notes.
    if (!current) {
      merged.set(group.id, group);
      continue;
    }
    const keys = new Set(current.items.map((item) => item.key));
    const added = group.items.filter((item) => {
      if (keys.has(item.key)) return false;
      keys.add(item.key);
      return true;
    });
    merged.set(group.id, {
      ...current,
      items: [...current.items, ...added],
      updatedAt: added.length ? new Date().toISOString() : current.updatedAt,
    });
  }
  return collectionsSchema.parse([...merged.values()]);
}
export function collectionDocument(collection: ReadingCollection, excerpts: ReadingExcerpt[]) {
  const byKey = new Map(excerpts.map((item) => [item.key, item]));
  const missing = collection.items.filter((item) => !byKey.has(item.key));
  if (missing.length)
    throw new Error(`${missing.length} 条摘录已被取消收藏或无法读取，请先处理标注的条目再导出。`);
  if (!collection.items.length) throw new Error('请先向素材包添加摘录');
  return createContentDocument(collection.name, '个人整理 · 社科通识阅读空间', '', [
    { type: 'paragraph', text: collection.description },
    ...collection.items.flatMap((reference, index) => {
      const item = byKey.get(reference.key)!;
      return [
        { type: 'heading' as const, level: 2, text: `${index + 1}. ${item.title}` },
        { type: 'quote' as const, text: item.text },
        {
          type: 'paragraph' as const,
          ...provenanceParagraph(item),
        },
        ...(reference.note
          ? [{ type: 'paragraph' as const, text: `我的使用备注：${reference.note}` }]
          : []),
      ];
    }),
  ]);
}
