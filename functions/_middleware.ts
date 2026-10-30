/** The preview must not use production API bindings, even when inherited by Pages. */
export function onRequest(context: { request: Request; next(): Promise<Response> }) {
  if (new URL(context.request.url).pathname.startsWith('/api/')) {
    return Response.json(
      { error: '独立预览版暂不连接远程服务，可使用粘贴导入并在本浏览器保存。' },
      {
        status: 503,
        headers: { 'Cache-Control': 'no-store' },
      },
    );
  }
  return context.next();
}
