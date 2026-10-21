export type SearchType = 'daily' | 'quote' | 'event' | 'essay';

export interface SearchResult {
  id: string;
  type: SearchType;
  title: string;
  subtitle: string;
  path: string;
}

export interface SearchDocument extends SearchResult {
  searchText: string;
}

/** 同一条内容只做一次大小写归一化；检索到上限后立即停止扫描。 */
export function searchDocuments(documents: readonly SearchDocument[], query: string, limit = 30): SearchResult[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized || limit <= 0) return [];
  const results: SearchResult[] = [];
  for (const document of documents) {
    if (!document.searchText.includes(normalized)) continue;
    const { searchText: _searchText, ...result } = document;
    results.push(result);
    if (results.length >= limit) break;
  }
  return results;
}
