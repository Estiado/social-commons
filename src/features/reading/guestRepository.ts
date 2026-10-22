import { openDB, type DBSchema, type IDBPTransaction } from 'idb';
import { readingExcerpts, type ReadingExcerpt } from './excerpts.ts';
import type { WritingDraft, DraftSummary } from './writing/model.ts';
import { isBlockedDocument, SourceVerificationError } from './sourceAccess.ts';
import {
  articleSchema,
  GUEST_RETENTION_MS,
  isExpired,
  isPartialArticle,
  summarize,
  type ArticleDocument,
  type ReadingRecord,
  type ReadingSummary,
} from './model.ts';

interface ReadingDatabase extends DBSchema {
  documents: { key: string; value: ReadingRecord; indexes: { 'by-url': string } };
  summaries: { key: string; value: ReadingSummary; indexes: { 'by-expiry': number } };
  excerpts: { key: string; value: ReadingExcerpt; indexes: { 'by-document': string } };
  drafts: { key: string; value: WritingDraft; indexes: { 'by-origin': string } };
  draftSummaries: { key: string; value: DraftSummary };
}
const stores = ['documents', 'summaries', 'excerpts'] as const;
type ReadingTransaction = IDBPTransaction<ReadingDatabase, typeof stores, 'readwrite'>;
async function replaceExcerpts(
  transaction: ReadingTransaction,
  id: string,
  record?: ReadingRecord,
) {
  const excerpts = transaction.objectStore('excerpts');
  for (const key of await excerpts.index('by-document').getAllKeys(id)) await excerpts.delete(key);
  if (record) for (const excerpt of readingExcerpts(record)) await excerpts.put(excerpt);
}
export const openReadingDatabase = () =>
  openDB<ReadingDatabase>('social-commons-reading', 3, {
    upgrade(database, oldVersion, _newVersion, transaction) {
      if (oldVersion < 1) {
        database
          .createObjectStore('documents', { keyPath: 'document.id' })
          .createIndex('by-url', 'document.url');
        database
          .createObjectStore('summaries', { keyPath: 'id' })
          .createIndex('by-expiry', 'expiresAt');
      }
      if (oldVersion < 2) {
        const excerpts = database.createObjectStore('excerpts', { keyPath: 'key' });
        excerpts.createIndex('by-document', 'documentId');
        // A cursor upgrades existing documents one at a time. No clear/rebuild
        // of the user's original articles, IDs, expiry dates or annotations.
        void (async () => {
          let cursor = await transaction.objectStore('documents').openCursor();
          while (cursor) {
            for (const excerpt of readingExcerpts(cursor.value)) await excerpts.put(excerpt);
            cursor = await cursor.continue();
          }
        })().catch(() => transaction.abort());
      }
      if (oldVersion < 3) {
        database
          .createObjectStore('drafts', { keyPath: 'document.id' })
          .createIndex('by-origin', 'originKey', { unique: true });
        database.createObjectStore('draftSummaries', { keyPath: 'id' });
      }
    },
  });

export async function linkArticleToTopic(id: string, topicId: string, tags: string[]) {
  const database = await openReadingDatabase();
  try {
    const transaction = database.transaction(stores, 'readwrite');
    const current = await transaction.objectStore('documents').get(id);
    if (!current || isExpired(current)) throw new Error('文章已到期或移除，请重新导入');
    const record: ReadingRecord = {
      ...current,
      expiresAt: null,
      topicIds: [...new Set([...(current.topicIds || []), topicId])],
      document: articleSchema.parse({
        ...current.document,
        tags: [...new Set([...current.document.tags, ...tags])].slice(0, 20),
      }),
      localRevision: (current.localRevision || 0) + 1,
    };
    await transaction.objectStore('documents').put(record);
    await transaction.objectStore('summaries').put(summarize(record));
    await replaceExcerpts(transaction, id, record);
    await transaction.done;
    return record;
  } finally {
    database.close();
  }
}

async function removeExpired(now = Date.now()) {
  const database = await openReadingDatabase();
  try {
    const transaction = database.transaction(stores, 'readwrite');
    const expired = await transaction
      .objectStore('summaries')
      .index('by-expiry')
      .getAllKeys(IDBKeyRange.upperBound(now));
    for (const id of expired) {
      await transaction.objectStore('documents').delete(id);
      await transaction.objectStore('summaries').delete(id);
      await replaceExcerpts(transaction, id);
    }
    await transaction.done;
  } finally {
    database.close();
  }
}

export async function listGuestArticles(): Promise<ReadingSummary[]> {
  await removeExpired();
  const database = await openReadingDatabase();
  try {
    // Lists read summaries, never all article bodies into memory.
    return (await database.getAll('summaries')).sort((a, b) =>
      b.importedAt.localeCompare(a.importedAt),
    );
  } finally {
    database.close();
  }
}

export async function getGuestArticle(id: string): Promise<ReadingRecord | undefined> {
  await removeExpired();
  const database = await openReadingDatabase();
  try {
    const record = await database.get('documents', id);
    if (!record || isExpired(record)) return undefined;
    articleSchema.parse(record.document);
    return record;
  } finally {
    database.close();
  }
}

export async function saveGuestArticle(document: ArticleDocument): Promise<ReadingRecord> {
  articleSchema.parse(document);
  if (isBlockedDocument(document)) throw new SourceVerificationError();
  await removeExpired();
  const database = await openReadingDatabase();
  try {
    const transaction = database.transaction(stores, 'readwrite');
    // A URL is deduplicated only inside this browser. Other people's private
    // documents can never be returned as a global URL cache hit.
    if (document.url) {
      const existing = await transaction.objectStore('documents').index('by-url').get(document.url);
      if (existing) {
        if (
          (isPartialArticle(existing.document) && document.completeness === 'user-confirmed') ||
          isBlockedDocument(existing.document)
        ) {
          const completed = {
            ...existing,
            document: { ...document, id: existing.document.id },
            annotations: [],
          };
          await transaction.objectStore('documents').put(completed);
          await transaction.objectStore('summaries').put(summarize(completed));
          await replaceExcerpts(transaction, completed.document.id, completed);
          await transaction.done;
          return completed;
        }
        await transaction.done;
        return existing;
      }
    }
    const record: ReadingRecord = {
      document,
      annotations: [],
      expiresAt: Date.now() + GUEST_RETENTION_MS,
      revision: 0,
    };
    await transaction.objectStore('documents').put(record);
    await transaction.objectStore('summaries').put(summarize(record));
    await replaceExcerpts(transaction, record.document.id, record);
    await transaction.done;
    return record;
  } finally {
    database.close();
  }
}

export async function removeGuestArticle(id: string) {
  const database = await openReadingDatabase();
  try {
    const transaction = database.transaction(stores, 'readwrite');
    await transaction.objectStore('documents').delete(id);
    await transaction.objectStore('summaries').delete(id);
    await replaceExcerpts(transaction, id);
    await transaction.done;
  } finally {
    database.close();
  }
}

/** Saving or bookmarking during the local pilot keeps the document until the
 * browser data is cleared. Compare revisions inside the same IDB transaction. */
export async function saveLocalReading(record: ReadingRecord): Promise<ReadingRecord> {
  articleSchema.parse(record.document);
  const database = await openReadingDatabase();
  try {
    const transaction = database.transaction(stores, 'readwrite');
    const current = await transaction.objectStore('documents').get(record.document.id);
    if (!current || isExpired(current)) throw new Error('这篇临时文章已移除或到期，请重新导入');
    if (
      current.document.contentVersion !== record.document.contentVersion ||
      (current.localRevision || 0) !== (record.localRevision || 0)
    )
      throw new Error('文章已在另一个标签页更新，请重新打开后再保存');
    const saved = {
      ...record,
      revision: 0,
      expiresAt: null,
      localRevision: (current.localRevision || 0) + 1,
    };
    await transaction.objectStore('documents').put(saved);
    await transaction.objectStore('summaries').put(summarize(saved));
    await replaceExcerpts(transaction, saved.document.id, saved);
    await transaction.done;
    return saved;
  } finally {
    database.close();
  }
}

export async function getGuestArticleByUrl(url: string): Promise<ReadingRecord | undefined> {
  await removeExpired();
  const database = await openReadingDatabase();
  try {
    return await database.getFromIndex('documents', 'by-url', url);
  } finally {
    database.close();
  }
}

export async function listReadingExcerpts(): Promise<ReadingExcerpt[]> {
  await removeExpired();
  const database = await openReadingDatabase();
  try {
    return (await database.getAll('excerpts')).sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  } finally {
    database.close();
  }
}

/** Migration is additive and idempotent by document ID; it never overwrites a
 * document the reader has edited after a previous import. */
export async function importLocalReading(record: ReadingRecord): Promise<ReadingRecord> {
  articleSchema.parse(record.document);
  const database = await openReadingDatabase();
  try {
    const transaction = database.transaction(stores, 'readwrite');
    const existing = await transaction.objectStore('documents').get(record.document.id);
    if (existing) {
      if (existing.document.contentVersion !== record.document.contentVersion)
        throw new Error('本机已有文章版本已变化，请先备份并核对后再迁移。');
      const blockIds = new Set(existing.document.blocks.map((block) => block.id));
      const annotationIds = new Set(existing.annotations.map((item) => item.id));
      const blocks = record.document.blocks.filter((block) => !blockIds.has(block.id));
      const annotations = record.annotations.filter((item) => !annotationIds.has(item.id));
      if (!blocks.length && !annotations.length) {
        await transaction.done;
        return existing;
      }
      const merged = {
        ...existing,
        document: { ...existing.document, blocks: [...existing.document.blocks, ...blocks] },
        annotations: [...existing.annotations, ...annotations],
        localRevision: (existing.localRevision || 0) + 1,
      };
      articleSchema.parse(merged.document);
      await transaction.objectStore('documents').put(merged);
      await transaction.objectStore('summaries').put(summarize(merged));
      await replaceExcerpts(transaction, merged.document.id, merged);
      await transaction.done;
      return merged;
    }
    const saved = { ...record, expiresAt: null, revision: 0, localRevision: 1 };
    await transaction.objectStore('documents').put(saved);
    await transaction.objectStore('summaries').put(summarize(saved));
    await replaceExcerpts(transaction, saved.document.id, saved);
    await transaction.done;
    return saved;
  } finally {
    database.close();
  }
}
