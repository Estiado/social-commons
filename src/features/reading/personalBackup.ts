import { z } from 'zod';
import {
  createReadingBackup,
  readingBackupSchema,
  restoreReadingBackup,
  MAX_BACKUP_BYTES,
} from './backup.ts';
import {
  essayPersonalSchema,
  readEssayPersonalData,
  restoreEssayPersonalData,
} from '../essay/personalData.ts';
import { materialBackupSchema } from '../essay/materials.ts';

export const LAST_BACKUP_KEY = 'social-commons:last-personal-backup';
const personalBackupSchema = z.object({
  format: z.literal('social-commons-personal'),
  schemaVersion: z.literal(1),
  createdAt: z.iso.datetime(),
  reading: readingBackupSchema,
  essay: essayPersonalSchema,
});

export async function createPersonalBackup(storage: Pick<Storage, 'getItem'> = localStorage) {
  const essay = readEssayPersonalData(storage);
  const reading = await createReadingBackup();
  const blob = new Blob(
    [
      `{"format":"social-commons-personal","schemaVersion":1,"createdAt":${JSON.stringify(new Date().toISOString())},"reading":`,
      reading,
      ',"essay":',
      JSON.stringify(essay),
      '}',
    ],
    { type: 'application/json' },
  );
  if (blob.size > MAX_BACKUP_BYTES)
    throw new Error('全部个人内容超过50 MB，请先分批导出。现有资料保留。');
  return blob;
}

export async function restorePersonalBackup(text: string, storage: Storage = localStorage) {
  if (new Blob([text]).size > MAX_BACKUP_BYTES) throw new Error('备份文件超过50 MB');
  let input: unknown;
  try {
    input = JSON.parse(text);
  } catch {
    throw new Error('备份文件不是有效JSON，现有数据保留。');
  }
  if (readingBackupSchema.safeParse(input).success) return restoreReadingBackup(text);
  const legacy = materialBackupSchema.safeParse(input);
  if (legacy.success)
    return restoreEssayPersonalData(storage, {
      materials: legacy.data.materials,
      concepts: [],
      categories: [],
    });
  const parsed = personalBackupSchema.safeParse(input);
  if (!parsed.success) throw new Error('备份的文章、划线或素材格式无效。尚未写入任何内容。');
  // Validate every section, including the current local material data, before
  // any write. IndexedDB stays atomic; localStorage resumes additively on retry.
  readEssayPersonalData(storage);
  const reading = await restoreReadingBackup(JSON.stringify(parsed.data.reading));
  try {
    const essay = restoreEssayPersonalData(storage, parsed.data.essay);
    return {
      restored: reading.restored + essay.restored,
      skipped: reading.skipped + essay.skipped,
    };
  } catch {
    throw new Error(
      `阅读资料已恢复${reading.restored}条；部分素材尚未恢复，可能空间不足或另一标签页正在编辑。请重试同一备份，已恢复内容不会重复或覆盖。`,
    );
  }
}
