import type { ArticleDocument, ReadingRecord } from './model.ts';
import { versionContentDocument } from './contentDocuments.ts';

type FindReading = (url: string) => Promise<ReadingRecord | undefined>;

/** New editorial text gets its own snapshot. Matching legacy copies retain
 * their original IDs and highlights; changed copies stay in the library. */
export async function resolveCatalogueReading(document: ArticleDocument, find: FindReading) {
  const snapshot = await versionContentDocument(document);
  const exact = await find(snapshot.url);
  if (exact) return { document: exact.document, existing: exact };
  const legacy = await find(document.url);
  if (legacy) {
    const previous = await versionContentDocument(legacy.document);
    if (previous.url === snapshot.url) return { document: legacy.document, existing: legacy };
  }
  return { document: snapshot, olderId: legacy?.document.id };
}
