import { openReadingDatabase } from './guestRepository.ts';
import { findInEntry, type WorkspaceMatch } from './searchIndex.ts';

export async function searchReadingWorkspace(query: string, signal?: AbortSignal) {
  const matches = new Map<string, WorkspaceMatch>();
  if (!query.trim()) return matches;
  const database = await openReadingDatabase();
  try {
    const transaction = database.transaction('searchEntries');
    let cursor = await transaction.store.openCursor();
    while (cursor) {
      signal?.throwIfAborted();
      const match = findInEntry(cursor.value, query);
      if (match) matches.set(cursor.key, match);
      cursor = await cursor.continue();
    }
    await transaction.done;
    return matches;
  } finally {
    database.close();
  }
}
