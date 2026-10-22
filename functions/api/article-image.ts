import { RequestError, validateArticleUrl } from '../../server/articleFetch.ts';
import { allowArticleRequest } from '../../server/requestLimits.ts';
import type { ExtractEnvironment } from '../../server/extractArticle.ts';

// Never forward cookies, execute SVG, or follow an unvalidated redirect.
const IMAGE_HOSTS = ['thepaper.cn', 'people.com.cn', 'people.cn', 'neweekly.com.cn', 'infzm.com', 'zjol.com.cn', 'zjwx.gov.cn', 'qpic.cn', 'qq.com', 'inews.gtimg.com', 'nfwmedia.com', 'nfapp.southcn.com'];
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

export async function onRequest({ request, env }: { request: Request; env: ExtractEnvironment }): Promise<Response> {
  if (request.method !== 'GET') return Response.json({ error: 'Method not allowed' }, { status: 405 });
  if (!await allowArticleRequest(request, env, 'image')) return Response.json({ error: '图片请求较频繁，请稍后重试' }, { status: 429, headers: { 'Retry-After': '60' } });
  try {
    let url = validateArticleUrl(new URL(request.url).searchParams.get('url'), IMAGE_HOSTS);
    const signal = AbortSignal.timeout(12_000);
    for (let hop = 0; hop <= 3; hop++) {
      const response = await fetch(url, { redirect: 'manual', signal, headers: { Accept: 'image/png,image/jpeg,image/webp,image/gif' } });
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        await response.body?.cancel();
        url = validateArticleUrl(new URL(response.headers.get('location') || '', url).href, IMAGE_HOSTS); continue;
      }
      const type = response.headers.get('content-type')?.split(';')[0] || '';
      if (!response.ok || !['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(type) || !response.body) throw new RequestError('插图暂时无法读取', 422);
      if (Number(response.headers.get('content-length')) > MAX_IMAGE_BYTES) { await response.body.cancel(); throw new RequestError('插图过大', 413); }
      const reader = response.body.getReader();
      const chunks: Uint8Array[] = []; let size = 0;
      try {
        while (true) {
          const chunk = await reader.read(); if (chunk.done) break;
          size += chunk.value.byteLength;
          if (size > MAX_IMAGE_BYTES) { await reader.cancel(); throw new RequestError('插图过大', 413); }
          chunks.push(chunk.value);
        }
      } finally { reader.releaseLock(); }
      return new Response(new Blob(chunks as BlobPart[], { type }), { headers: { 'Content-Type': type, 'Cache-Control': 'private, max-age=3600', 'X-Content-Type-Options': 'nosniff' } });
    }
    throw new RequestError('插图跳转次数过多', 422);
  } catch (error) {
    return Response.json({ error: error instanceof RequestError ? error.message : '插图暂时无法读取' }, { status: error instanceof RequestError ? error.status : 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
