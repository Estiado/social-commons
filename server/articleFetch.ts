// 抓取范围显式限制在可信媒体域名，重定向的每一跳也要重新检查。
export const DEFAULT_ARTICLE_HOSTS = ['thepaper.cn', 'people.com.cn', 'gmw.cn', 'qq.com', 'toutiao.com', 'rmlt.com.cn', 'oeeee.com', 'lifeweek.com.cn', 'zjol.com.cn', 'wikisource.org'];
const MAX_BYTES = 2 * 1024 * 1024;

export class RequestError extends Error {
  status: number;
  constructor(message: string, status = 400) { super(message); this.status = status; }
}

export function validateArticleUrl(value: unknown, hosts = DEFAULT_ARTICLE_HOSTS): URL {
  if (typeof value !== 'string' || value.length > 2048) throw new RequestError('请提供有效的文章链接');
  let url: URL;
  try { url = new URL(value); } catch { throw new RequestError('请提供有效的文章链接'); }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.port) throw new RequestError('仅支持不带账号和自定义端口的 HTTP/HTTPS 链接');
  if (!hosts.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`))) throw new RequestError('暂不支持这个来源，请使用已支持媒体的原文链接');
  url.hash = '';
  return url;
}

/** 响应流达到上限立即取消，避免大文件占满函数内存。 */
export async function readBoundedHtml(response: Response, maxBytes = MAX_BYTES): Promise<string> {
  const type = response.headers.get('content-type') || '';
  if (!type.includes('text/html') && !type.includes('application/xhtml+xml')) throw new RequestError('该链接不是 HTML 文章，PDF 请直接阅读原文');
  if (Number(response.headers.get('content-length')) > maxBytes) {
    await response.body?.cancel();
    throw new RequestError('页面过大，暂时无法提取');
  }
  if (!response.body) throw new RequestError('文章内容为空');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let html = '';
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > maxBytes) { await reader.cancel(); throw new RequestError('页面过大，暂时无法提取'); }
      html += decoder.decode(chunk.value, { stream: true });
    }
    return html + decoder.decode();
  } finally { reader.releaseLock(); }
}

export async function fetchArticleHtml(value: string, hosts = DEFAULT_ARTICLE_HOSTS): Promise<string> {
  let url = validateArticleUrl(value, hosts);
  const signal = AbortSignal.timeout(12_000);
  for (let redirect = 0; redirect <= 3; redirect++) {
    const response = await fetch(url, { redirect: 'manual', signal,
      headers: { Accept: 'text/html,application/xhtml+xml', 'Accept-Language': 'zh-CN,zh;q=0.9' } });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      await response.body?.cancel();
      const location = response.headers.get('location');
      if (!location) throw new RequestError('文章跳转地址无效');
      url = validateArticleUrl(new URL(location, url).href, hosts);
      continue;
    }
    if (!response.ok) { await response.body?.cancel(); throw new RequestError(`来源网站暂时无法访问（HTTP ${response.status}）`, 502); }
    return readBoundedHtml(response);
  }
  throw new RequestError('文章跳转次数过多');
}
