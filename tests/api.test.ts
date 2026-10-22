import test from 'node:test';
import assert from 'node:assert/strict';
import { createExtractHandler } from '../server/extractArticle.ts';
import { onRequest } from '../functions/api/extract-article.ts';
import { onRequest as imageRequest } from '../functions/api/article-image.ts';

test('Cloudflare 接口返回 JSON 405，而不是 SPA 页面', async () => {
  const response = await onRequest({ request: new Request('https://site.test/api/extract-article'), env: {} });
  assert.equal(response.status, 405);
  assert.match(response.headers.get('content-type')!, /application\/json/);
});

test('无长度头的过大提取请求返回 413', async () => {
  const response = await onRequest({ request: new Request('https://site.test/api/extract-article', { method: 'POST', body: 'x'.repeat(9000) }), env: {} });
  assert.equal(response.status, 413);
});

test('无效 JSON 和非对象输入均返回 400', async () => {
  for (const body of ['{broken', 'null', '[]']) {
    const response = await createExtractHandler({})({ httpMethod: 'POST', body });
    assert.equal(response.statusCode, 400);
  }
});

test('访客无需 Supabase 配置或登录即可提取；整个流程不会写数据库', async (context) => {
  const seen: string[] = [];
  context.mock.method(globalThis, 'fetch', async (input: string | URL | Request) => {
    const url = String(input); seen.push(url);
    assert.equal(url, 'https://www.thepaper.cn/newsDetail_123');
    return new Response(`<html><head><title>人工智能与责任</title></head><body><article><h2>工具与边界</h2><p>${'这是保留原文段落的测试文章。'.repeat(12)}</p><figure><img src="https://image.thepaper.cn/example.jpg"><figcaption>原始图注</figcaption></figure></article></body></html>`, { headers: { 'content-type': 'text/html' } });
  });
  const result = await createExtractHandler({})({ httpMethod: 'POST', body: JSON.stringify({ url: 'https://www.thepaper.cn/newsDetail_123' }) });
  assert.equal(result.statusCode, 200);
  const json = JSON.parse(result.body);
  assert.equal(json.article.title, '人工智能与责任');
  assert.equal(json.article.blocks[0].type, 'heading');
  assert.equal(json.article.blocks[2].caption, '原始图注');
  assert.equal(seen.length, 1);
  assert.equal(json.article.is_public, undefined);
});

test('拒绝任意域名并拒绝来源站跳转到内网', async (context) => {
  const handler = createExtractHandler({});
  const fetchMock = context.mock.method(globalThis, 'fetch', async () => new Response(null, { status: 302, headers: { location: 'http://127.0.0.1/admin' } }));
  assert.equal((await handler({ httpMethod: 'POST', body: JSON.stringify({ url: 'http://127.0.0.1/' }) })).statusCode, 400);
  assert.equal(fetchMock.mock.callCount(), 0);
  assert.equal((await handler({ httpMethod: 'POST', body: JSON.stringify({ url: 'https://thepaper.cn/article' }) })).statusCode, 400);
  assert.equal(fetchMock.mock.callCount(), 1);
});

test('分布式配额拒绝时不访问来源站', async (context) => {
  const fetchMock = context.mock.method(globalThis, 'fetch', async () => { throw new Error('不应请求'); });
  const response = await onRequest({ request: new Request('https://site.test/api/extract-article', { method: 'POST', body: '{}' }), env: { EXTRACTION_RATE_LIMITER: { limit: async () => ({ success: false }) } } });
  assert.equal(response.status, 429); assert.equal(fetchMock.mock.callCount(), 0);
});

test('插图代理阻止 SVG 和超大响应，并检查每次重定向', async (context) => {
  const request = () => new Request('https://site.test/api/article-image?url=https%3A%2F%2Fimage.thepaper.cn%2Fa.png');
  const fetchMock = context.mock.method(globalThis, 'fetch', async () => new Response('<svg/>', { headers: { 'content-type': 'image/svg+xml' } }));
  assert.equal((await imageRequest({ request: request(), env: {} })).status, 422);
  fetchMock.mock.mockImplementation(async () => new Response('x', { headers: { 'content-type': 'image/png', 'content-length': String(5 * 1024 * 1024) } }));
  assert.equal((await imageRequest({ request: request(), env: {} })).status, 413);
  fetchMock.mock.mockImplementation(async () => new Response(null, { status: 302, headers: { location: 'http://localhost/private' } }));
  assert.equal((await imageRequest({ request: request(), env: {} })).status, 400);
});
