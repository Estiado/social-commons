import { openDB, type DBSchema } from 'idb';
import { articleSchema, GUEST_RETENTION_MS, isExpired, isPartialArticle, summarize, type ArticleDocument, type ReadingRecord, type ReadingSummary } from './model.ts';

interface ReadingDatabase extends DBSchema {
  documents: { key: string; value: ReadingRecord; indexes: { 'by-url': string } };
  summaries: { key: string; value: ReadingSummary; indexes: { 'by-expiry': number } };
}
const openReadingDatabase = () => openDB<ReadingDatabase>('social-commons-reading', 1, {
  upgrade(database) {
    database.createObjectStore('documents', { keyPath: 'document.id' }).createIndex('by-url', 'document.url');
    database.createObjectStore('summaries', { keyPath: 'id' }).createIndex('by-expiry', 'expiresAt');
  },
});

async function removeExpired(now = Date.now()) {
  const database = await openReadingDatabase();
  try {
    const transaction = database.transaction(['documents', 'summaries'], 'readwrite');
    const expired = await transaction.objectStore('summaries').index('by-expiry').getAllKeys(IDBKeyRange.upperBound(now));
    for (const id of expired) {
      await transaction.objectStore('documents').delete(id);
      await transaction.objectStore('summaries').delete(id);
    }
    await transaction.done;
  } finally { database.close(); }
}

export async function listGuestArticles(): Promise<ReadingSummary[]> {
  await removeExpired();
  const database = await openReadingDatabase();
  try {
    // Lists read summaries, never all article bodies into memory.
    return (await database.getAll('summaries')).sort((a, b) => b.importedAt.localeCompare(a.importedAt));
  } finally { database.close(); }
}

export async function getGuestArticle(id: string): Promise<ReadingRecord | undefined> {
  await removeExpired();
  const database = await openReadingDatabase();
  try {
    const record = await database.get('documents', id);
    if (!record || isExpired(record)) return undefined;
    articleSchema.parse(record.document);
    return record;
  } finally { database.close(); }
}

export async function saveGuestArticle(document: ArticleDocument): Promise<ReadingRecord> {
  articleSchema.parse(document);
  await removeExpired();
  const database = await openReadingDatabase();
  try {
    const transaction = database.transaction(['documents', 'summaries'], 'readwrite');
    // A URL is deduplicated only inside this browser. Other people's private
    // documents can never be returned as a global URL cache hit.
    if (document.url) {
      const existing = await transaction.objectStore('documents').index('by-url').get(document.url);
      if (existing) {
        if (isPartialArticle(existing.document) && document.completeness === 'user-confirmed') {
          const completed = { ...existing, document: { ...document, id: existing.document.id }, annotations: [] };
          await transaction.objectStore('documents').put(completed);
          await transaction.objectStore('summaries').put(summarize(completed));
          await transaction.done; return completed;
        }
        await transaction.done; return existing;
      }
    }
    const record: ReadingRecord = { document, annotations: [], expiresAt: Date.now() + GUEST_RETENTION_MS, revision: 0 };
    await transaction.objectStore('documents').put(record);
    await transaction.objectStore('summaries').put(summarize(record));
    await transaction.done;
    return record;
  } finally { database.close(); }
}

export async function removeGuestArticle(id: string) {
  const database = await openReadingDatabase();
  try {
    const transaction = database.transaction(['documents', 'summaries'], 'readwrite');
    await transaction.objectStore('documents').delete(id);
    await transaction.objectStore('summaries').delete(id);
    await transaction.done;
  } finally { database.close(); }
}

/** Saving or bookmarking during the local pilot keeps the document until the
 * browser data is cleared. Compare revisions inside the same IDB transaction. */
export async function saveLocalReading(record: ReadingRecord): Promise<ReadingRecord> {
  articleSchema.parse(record.document);
  const database = await openReadingDatabase();
  try {
    const transaction = database.transaction(['documents', 'summaries'], 'readwrite');
    const current = await transaction.objectStore('documents').get(record.document.id);
    if (!current || isExpired(current)) throw new Error('这篇临时文章已移除或到期，请重新导入');
    if (current.document.contentVersion !== record.document.contentVersion || (current.localRevision || 0) !== (record.localRevision || 0)) throw new Error('文章已在另一个标签页更新，请重新打开后再保存');
    const saved = { ...record, revision: 0, expiresAt: null, localRevision: (current.localRevision || 0) + 1 };
    await transaction.objectStore('documents').put(saved);
    await transaction.objectStore('summaries').put(summarize(saved));
    await transaction.done;
    return saved;
  } finally { database.close(); }
}
