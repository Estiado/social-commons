import { openReadingDatabase } from '../guestRepository.ts';
import { draftSchema, summarizeDraft, type WritingDraft } from './model.ts';

export async function listDrafts() {
  const database = await openReadingDatabase();
  try {
    return (await database.getAll('draftSummaries')).sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt),
    );
  } finally {
    database.close();
  }
}
export async function getDraft(id: string) {
  const database = await openReadingDatabase();
  try {
    const value = await database.get('drafts', id);
    return value ? draftSchema.parse(value) : undefined;
  } finally {
    database.close();
  }
}
export async function getDraftByOrigin(key: string) {
  const database = await openReadingDatabase();
  try {
    return await database.getFromIndex('drafts', 'by-origin', key);
  } finally {
    database.close();
  }
}
/** The snapshot is independent of source documents. Revision checks protect other open editors. */
export async function saveDraft(value: WritingDraft) {
  const draft = draftSchema.parse(value);
  const database = await openReadingDatabase();
  try {
    const transaction = database.transaction(['drafts', 'draftSummaries'], 'readwrite');
    if (draft.originKey) {
      const migrated = await transaction
        .objectStore('drafts')
        .index('by-origin')
        .get(draft.originKey);
      if (migrated && migrated.document.id !== draft.document.id) {
        await transaction.done;
        return migrated;
      }
    }
    const current = await transaction.objectStore('drafts').get(draft.document.id);
    if (current && current.revision !== draft.revision)
      throw new Error('这份文稿已在另一个标签页更新。请先下载当前内容备份，再重新打开。');
    const saved = { ...draft, revision: draft.revision + 1, updatedAt: new Date().toISOString() };
    await transaction.objectStore('drafts').put(saved);
    await transaction.objectStore('draftSummaries').put(summarizeDraft(saved));
    await transaction.done;
    return saved;
  } finally {
    database.close();
  }
}
