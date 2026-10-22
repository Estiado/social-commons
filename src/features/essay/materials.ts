import { z } from 'zod';

export const materialFieldsSchema = z.object({
  title: z.string().trim().min(1, '请填写素材标题').max(200),
  content: z.string().trim().min(1, '请填写素材正文').max(30_000),
  source: z.string().trim().min(1, '请注明来源，自己整理时请如实标注').max(500),
  sourceUrl: z
    .string()
    .max(2048)
    .refine((value) => !value || /^https?:\/\//i.test(value), '出处链接需以 http 或 https 开头'),
  usageHint: z.string().max(2000),
});
export type MaterialFields = z.infer<typeof materialFieldsSchema>;
export const localMaterialSchema = materialFieldsSchema.extend({
  id: z.uuid(),
  conceptId: z.string().min(1).max(100),
  updatedAt: z.iso.datetime(),
});
export type LocalMaterial = z.infer<typeof localMaterialSchema>;
export const localMaterialsSchema = z.array(localMaterialSchema).max(1000);
export const materialBackupSchema = z.object({
  schemaVersion: z.literal(1),
  materials: localMaterialsSchema,
});

/** A restore never duplicates an ID and retains the most recently edited copy. */
export function mergeMaterials(
  current: LocalMaterial[],
  incoming: LocalMaterial[],
): LocalMaterial[] {
  const merged = new Map(current.map((item) => [item.id, item]));
  for (const item of incoming) {
    if (!merged.has(item.id) || merged.get(item.id)!.updatedAt < item.updatedAt)
      merged.set(item.id, item);
  }
  return localMaterialsSchema.parse([...merged.values()]);
}
