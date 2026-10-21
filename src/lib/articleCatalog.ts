export interface ArticleListItem {
  id: string;
  url: string;
  title: string;
  author: string | null;
  source: string | null;
  published_at: string | null;
  excerpt: string | null;
  tags: string[];
  created_at: string;
  is_preset?: boolean;
  is_external?: boolean;
  hot_topic?: string;
}

/** 按 URL 去重，优先保留前面的本地阅读入口；不修改输入数组。 */
export function mergeArticles(...groups: readonly ArticleListItem[][]): ArticleListItem[] {
  const byUrl = new Map<string, ArticleListItem>();
  for (const group of groups) for (const article of group) {
    if (!byUrl.has(article.url)) byUrl.set(article.url, article);
  }
  return [...byUrl.values()].sort((a, b) => {
    const presetOrder = Number(Boolean(b.is_preset)) - Number(Boolean(a.is_preset));
    return presetOrder || (Date.parse(b.created_at) || 0) - (Date.parse(a.created_at) || 0);
  });
}

export function filterArticles(articles: readonly ArticleListItem[], query: string, topicId: string, tag = ''): ArticleListItem[] {
  const normalized = query.trim().toLowerCase();
  return articles.filter((article) => (!topicId || article.hot_topic === topicId)
    && (!tag || article.tags.includes(tag))
    && (!normalized || [article.title, article.author, article.source, article.excerpt, ...article.tags].join(' ').toLowerCase().includes(normalized)));
}

export function countArticlesByTopic(articles: readonly ArticleListItem[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const article of articles) if (article.hot_topic) counts[article.hot_topic] = (counts[article.hot_topic] || 0) + 1;
  return counts;
}
