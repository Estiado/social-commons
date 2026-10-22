import { createExtractHandler, type ExtractEnvironment } from '../../server/extractArticle.ts';
import { allowArticleRequest } from '../../server/requestLimits.ts';

// Public extraction never writes a public article or uses a service key.
export async function onRequest(context: { request: Request; env: ExtractEnvironment }): Promise<Response> {
  const request = context.request;
  if (request.method === 'POST' && !await allowArticleRequest(request, context.env)) {
    return Response.json({ error: '操作较频繁，请一分钟后重试' }, { status: 429, headers: { 'Retry-After': '60', 'Cache-Control': 'no-store' } });
  }
  if (Number(request.headers.get('content-length')) > 8192) {
    return Response.json({ error: '请求内容过大' }, { status: 413 });
  }
  // 对没有 Content-Length 的流也施加上限，避免一次性读入无限请求体。
  let body = '';
  if (request.method === 'POST' && request.body) {
    const reader = request.body.getReader();
    const decoder = new TextDecoder();
    let size = 0;
    try {
      while (true) {
        const chunk = await reader.read();
        if (chunk.done) break;
        size += chunk.value.byteLength;
        if (size > 8192) { await reader.cancel(); return Response.json({ error: '请求内容过大' }, { status: 413 }); }
        body += decoder.decode(chunk.value, { stream: true });
      }
      body += decoder.decode();
    } finally { reader.releaseLock(); }
  }
  const result = await createExtractHandler(context.env)({ httpMethod: request.method, body });
  return new Response(result.body, { status: result.statusCode, headers: result.headers });
}
