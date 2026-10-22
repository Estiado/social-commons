import { fetchArticleHtml, validateArticleUrl, DEFAULT_ARTICLE_HOSTS, RequestError } from './articleFetch.ts';
import { parseArticleHtml } from '../src/features/reading/parseArticle.ts';
import { matchTopics } from './topics.ts';

export interface ExtractEnvironment {
  ARTICLE_ALLOWED_HOSTS?: string;
  // Extraction returns a document. Only an explicit save writes to an account.
  EXTRACTION_RATE_LIMITER?: { limit(input: { key: string }): Promise<{ success: boolean }> };
}

export function createExtractHandler(environment: ExtractEnvironment) {
  const hosts = environment.ARTICLE_ALLOWED_HOSTS?.split(',').map((host) => host.trim().toLowerCase()).filter(Boolean) || DEFAULT_ARTICLE_HOSTS;
  return async (event: { httpMethod: string; body: string | null }) => {
    const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
    if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
    if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    try {
      let input: { url?: unknown };
      try { input = JSON.parse(event.body || '{}'); } catch { throw new RequestError('请求必须是有效的 JSON'); }
      if (!input || typeof input !== 'object' || Array.isArray(input)) throw new RequestError('请求格式无效');
      const url = validateArticleUrl(input.url, hosts).href;
      const html = await fetchArticleHtml(url, hosts);
      const article = parseArticleHtml(html, url);
      const text = article.blocks.filter((block) => 'text' in block).map((block) => block.text).join(' ');
      article.tags = matchTopics(`${article.title} ${text.slice(0, 1500)}`);
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, article }) };
    } catch (error) {
      const statusCode = error instanceof RequestError ? error.status : error instanceof Error && error.name === 'TimeoutError' ? 504 : 422;
      const message = error instanceof RequestError ? error.message : statusCode === 504 ? '来源网站响应超时，请稍后重试或粘贴正文' : '未能完整识别文章，请使用粘贴正文导入';
      return { statusCode, headers, body: JSON.stringify({ error: message }) };
    }
  };
}
