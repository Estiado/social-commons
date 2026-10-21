import { createExtractHandler, type ExtractEnvironment } from '../../server/extractArticle.ts';

// Cloudflare 在请求上下文传入密钥；不要把 service role 放进 VITE_* 前端变量。
export async function onRequest(context: { request: Request; env: ExtractEnvironment }): Promise<Response> {
  const request = context.request;
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
  const result = await createExtractHandler(context.env)({ httpMethod: request.method, body, authorization: request.headers.get('authorization') || undefined });
  return new Response(result.body, { status: result.statusCode, headers: result.headers });
}
