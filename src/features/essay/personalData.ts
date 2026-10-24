import { z } from 'zod';
import { localMaterialsSchema } from './materials.ts';

export const ESSAY_STORAGE_KEYS = {
  materials: 'social-commons:concept-materials-v1',
  concepts: 'social-commons:custom-essay-materials',
  categories: 'social-commons:custom-categories',
} as const;
const referenceSchema = z.object({
  title: z.string().max(500),
  url: z
    .url()
    .max(2048)
    .refine((url) => /^https?:\/\//i.test(url)),
});
const conceptSchema = z.object({
  id: z.string().min(1).max(100),
  concept: z.string().min(1).max(500),
  category: z.string().min(1).max(200),
  description: z.string().max(30_000),
  applicableTopics: z.array(z.string().max(200)).max(100),
  references: z.array(referenceSchema).max(100).optional(),
  materials: z
    .array(
      z.object({
        title: z.string().max(500),
        content: z.string().max(30_000),
        source: z.string().max(2000),
        usageHint: z.string().max(2000).optional(),
      }),
    )
    .max(100),
});
export const essayPersonalSchema = z
  .object({
    materials: localMaterialsSchema,
    concepts: z.array(conceptSchema).max(1000),
    categories: z.array(z.string().min(1).max(200)).max(1000),
  })
  .superRefine((data, context) => {
    for (const entries of [data.materials, data.concepts])
      if (new Set(entries.map((entry) => entry.id)).size !== entries.length)
        context.addIssue({ code: 'custom', message: '素材备份有重复编号' });
  });
export type EssayPersonalData = z.infer<typeof essayPersonalSchema>;

export function readEssayPersonalData(storage: Pick<Storage, 'getItem'>): EssayPersonalData {
  try {
    return essayPersonalSchema.parse(
      Object.fromEntries(
        Object.entries(ESSAY_STORAGE_KEYS).map(([name, key]) => [
          name,
          JSON.parse(storage.getItem(key) || '[]'),
        ]),
      ),
    );
  } catch {
    throw new Error('个人素材或词条格式异常，请保留原数据并联系维护者，暂不生成不完整备份。');
  }
}

/** Restore only missing IDs. Never replace a newer local edit with a backup. */
export function restoreEssayPersonalData(storage: Storage, incoming: EssayPersonalData) {
  const snapshots = new Map<string, string | null>(
    Object.values(ESSAY_STORAGE_KEYS).map((key) => [key, storage.getItem(key)]),
  );
  const current = readEssayPersonalData({
    getItem: (key) => snapshots.get(key) ?? null,
  });
  const parsed = essayPersonalSchema.parse(incoming);
  const materialIds = new Set(current.materials.map((item) => item.id));
  const conceptIds = new Set(current.concepts.map((item) => item.id));
  const categories = new Set(current.categories);
  const added = {
    materials: parsed.materials.filter((item) => !materialIds.has(item.id)),
    concepts: parsed.concepts.filter((item) => !conceptIds.has(item.id)),
    categories: [...new Set(parsed.categories)].filter((item) => !categories.has(item)),
  };
  const merged = essayPersonalSchema.parse({
    materials: [...current.materials, ...added.materials],
    concepts: [...current.concepts, ...added.concepts],
    categories: [...current.categories, ...added.categories],
  });
  // Each key is atomic in localStorage. Completed keys are safe to retry if a
  // later key runs out of space; the reader sees an explicit partial failure.
  for (const name of ['materials', 'concepts', 'categories'] as const) {
    if (!added[name].length) continue;
    const key = ESSAY_STORAGE_KEYS[name];
    if (storage.getItem(key) !== snapshots.get(key))
      throw new Error('另一标签页修改了个人素材，请重试恢复。已有内容未覆盖。');
    storage.setItem(key, JSON.stringify(merged[name]));
    if (typeof window !== 'undefined')
      window.dispatchEvent(new CustomEvent('social-commons:storage-change', { detail: key }));
  }
  const restored = added.materials.length + added.concepts.length + added.categories.length;
  return {
    restored,
    skipped: parsed.materials.length + parsed.concepts.length + parsed.categories.length - restored,
  };
}
