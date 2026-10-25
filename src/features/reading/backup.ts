import { z } from 'zod';
import { articleSchema, isExpired, summarize } from './model.ts';
import { openReadingDatabase } from './guestRepository.ts';
import { readingExcerpts } from './excerpts.ts';
import { draftSchema, summarizeDraft } from './writing/model.ts';
import { searchEntry } from './searchIndex.ts';

export const MAX_BACKUP_BYTES = 50 * 1024 * 1024;
const annotationSchema = z.object({
  id: z.uuid(),
  contentVersion: z.uuid(),
  blockId: z.string().max(80),
  kind: z.enum(['paragraph', 'highlight']),
  start: z.number().int().min(0),
  end: z.number().int().min(1),
  text: z.string().min(1).max(30_000),
  createdAt: z.iso.datetime(),
});
const recordSchema = z
  .object({
    document: articleSchema,
    annotations: z.array(annotationSchema).max(10_000),
    expiresAt: z.number().finite().min(0).nullable(),
    revision: z.number().int().min(0),
    localRevision: z.number().int().min(0).optional(),
    topicIds: z.array(z.string().max(100)).max(100).optional(),
    eventIds: z.array(z.string().min(1).max(100)).max(100).optional(),
  })
  .superRefine((record, context) => {
    const blocks = new Map(record.document.blocks.map((block) => [block.id, block]));
    const ids = new Set<string>();
    for (const annotation of record.annotations) {
      const block = blocks.get(annotation.blockId);
      if (
        ids.has(annotation.id) ||
        annotation.contentVersion !== record.document.contentVersion ||
        !block ||
        !('text' in block) ||
        annotation.end <= annotation.start ||
        annotation.end > block.text.length ||
        block.text.slice(annotation.start, annotation.end) !== annotation.text
      ) {
        context.addIssue({ code: 'custom', message: '备份中的划线与正文不匹配' });
      }
      ids.add(annotation.id);
    }
  })
  .transform((record) => ({ ...record, expiresAt: record.expiresAt ?? null }));
export const readingBackupSchema = z
  .object({
    format: z.literal('social-commons-reading'),
    schemaVersion: z.literal(1),
    createdAt: z.iso.datetime(),
    documents: z.array(recordSchema).max(1000),
    drafts: z.array(draftSchema).max(1000),
  })
  .superRefine((backup, context) => {
    for (const entries of [backup.documents, backup.drafts]) {
      if (new Set(entries.map((entry) => entry.document.id)).size !== entries.length)
        context.addIssue({ code: 'custom', message: '备份中有重复编号' });
    }
  });

export async function createReadingBackup() {
  const database = await openReadingDatabase();
  try {
    // Both stores are read in one transaction, so an autosave cannot split a snapshot.
    const transaction = database.transaction(['documents', 'drafts'], 'readonly');
    const parts: BlobPart[] = [
      `{"format":"social-commons-reading","schemaVersion":1,"createdAt":${JSON.stringify(new Date().toISOString())},"documents":[`,
    ];
    let size = 0;
    const append = (text: string) => {
      size += new Blob([text]).size;
      if (size > MAX_BACKUP_BYTES - 1024)
        throw new Error('阅读数据超过 50 MB，请先分批导出；现有数据仍保留。');
      parts.push(text);
    };
    let count = 0;
    let document = await transaction.objectStore('documents').openCursor();
    while (document) {
      if (!isExpired(document.value)) {
        if (++count > 1000) throw new Error('文章超过 1000 篇，请分批导出。');
        append((count > 1 ? ',' : '') + JSON.stringify(recordSchema.parse(document.value)));
      }
      document = await document.continue();
    }
    append('],"drafts":[');
    count = 0;
    let draft = await transaction.objectStore('drafts').openCursor();
    while (draft) {
      if (++count > 1000) throw new Error('文稿超过 1000 份，请分批导出。');
      append((count > 1 ? ',' : '') + JSON.stringify(draftSchema.parse(draft.value)));
      draft = await draft.continue();
    }
    append(']}');
    await transaction.done;
    return new Blob(parts, { type: 'application/json' });
  } finally {
    database.close();
  }
}

export async function restoreReadingBackup(text: string) {
  if (new Blob([text]).size > MAX_BACKUP_BYTES) throw new Error('备份文件超过 50 MB');
  let backup: z.infer<typeof readingBackupSchema>;
  try {
    backup = readingBackupSchema.parse(JSON.parse(text));
  } catch {
    throw new Error('这不是有效的社科通识阅读备份，或其中正文与划线不匹配。现有数据保留。');
  }
  const database = await openReadingDatabase();
  let restored = 0;
  let skipped = 0;
  try {
    // Validation finishes before this transaction. Any write failure aborts the entire restore.
    const transaction = database.transaction(
      ['documents', 'summaries', 'excerpts', 'drafts', 'draftSummaries', 'searchEntries'],
      'readwrite',
    );
    // Observe failures immediately, including quota errors that abort an IDB request.
    void transaction.done.catch(() => undefined);
    try {
      for (const record of backup.documents) {
        if (
          isExpired(record) ||
          (await transaction.objectStore('documents').getKey(record.document.id))
        ) {
          skipped++;
          continue;
        }
        await transaction.objectStore('documents').add(record);
        await transaction.objectStore('summaries').put(summarize(record));
        await transaction
          .objectStore('searchEntries')
          .put(searchEntry(record.document, 'article', record.expiresAt));
        for (const excerpt of readingExcerpts(record))
          await transaction.objectStore('excerpts').put(excerpt);
        restored++;
      }
      for (const draft of backup.drafts) {
        const store = transaction.objectStore('drafts');
        if (
          (await store.getKey(draft.document.id)) ||
          (draft.originKey && (await store.index('by-origin').getKey(draft.originKey)))
        ) {
          skipped++;
          continue;
        }
        await store.add(draft);
        await transaction.objectStore('draftSummaries').put(summarizeDraft(draft));
        await transaction.objectStore('searchEntries').put(searchEntry(draft.document, 'draft'));
        restored++;
      }
      await transaction.done;
      return { restored, skipped };
    } catch (error) {
      try {
        transaction.abort();
      } catch {
        /* A failed request may have already aborted it. */
      }
      await transaction.done.catch(() => undefined);
      throw error;
    }
  } finally {
    database.close();
  }
}
