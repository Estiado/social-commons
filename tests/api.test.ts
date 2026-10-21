import test from 'node:test';
import assert from 'node:assert/strict';
import { createExtractHandler } from '../server/extractArticle.ts';
import { onRequest } from '../functions/api/extract-article.ts';

const environment = { SUPABASE_URL: 'https://example.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'test-service-key' };
const body = JSON.stringify({ url: 'https://thepaper.cn/article' });
test('Cloudflare 接口返回 JSON 405，而不是 SPA 的 index.html', async () => {
  const response = await onRequest({ request: new Request('https://site.test/api/extract-article'), env: {} });
  assert.equal(response.status, 405);
  assert.ok(response.headers.get('content-type')?.includes('application/json'));
});
test('无长度头的过大请求体返回 413', async () => {
  const response = await onRequest({ request: new Request('https://site.test/api/extract-article', { method: 'POST', body: 'x'.repeat(9000) }), env: {} });
  assert.equal(response.status, 413);
});
test('格式错误和非对象 JSON 返回 400', async (context) => {
  context.mock.method(console, 'error', () => {});
  for (const body of ['{broken', 'null', '[]']) {
    const response = await createExtractHandler(environment)({ httpMethod: 'POST', body });
    assert.equal(response.statusCode, 400);
  }
});
test('缺少登录凭证时不允许使用 service role 提取文章', async (context) => {
  context.mock.method(console, 'error', () => {});
  const fetchMock = context.mock.method(globalThis, 'fetch', async () => { throw new Error('不应发起任何外部请求'); });
  const result = await createExtractHandler(environment)({ httpMethod: 'POST', body });
  assert.equal(result.statusCode, 401);
  assert.equal(fetchMock.mock.callCount(), 0);
});
test('命中缓存时不抓取来源网站，并保留统一的 article.id 返回结构', async (context) => {
  const seen: string[] = [];
  context.mock.method(globalThis, 'fetch', async (input: string | URL | Request, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    seen.push(url);
    if (url.includes('/auth/v1/user')) return Response.json({ id: 'user-1', aud: 'authenticated' });
    if (url.includes('/rest/v1/articles?')) return Response.json({ id: 'article-1', title: '已提取文章', tags: [] });
    if (url.includes('/rest/v1/article_paragraphs?') && init?.method === 'HEAD') return new Response(null, { headers: { 'content-range': '0-0/3' } });
    throw new Error(`不应访问 ${url}`);
  });
  const result = await createExtractHandler(environment)({ httpMethod: 'POST', body, authorization: 'Bearer test-token' });
  assert.equal(result.statusCode, 200);
  const json = JSON.parse(result.body);
  assert.equal(json.cached, true);
  assert.equal(json.article.id, 'article-1');
  assert.equal(json.article.paragraphCount, 3);
  assert.ok(seen.every((url) => url.startsWith(environment.SUPABASE_URL)));
});

for (const failParagraphs of [false, true]) test(failParagraphs ? '段落写入失败会清理本次文章，并返回失败' : '新文章提取、话题归类和段落写入使用同一返回协议', async (context) => {
  context.mock.method(console, 'error', () => {});
  const writes: { table: string; method: string; body: unknown }[] = [];
  context.mock.method(globalThis, 'fetch', async (input: string | URL | Request, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    const method = init?.method || 'GET';
    if (url.includes('/auth/v1/user')) return Response.json({ id: 'user-1', aud: 'authenticated' });
    if (url.startsWith('https://thepaper.cn/')) return new Response(`<html><head><title>测试报道</title></head><body><article><p>${'这是一段用于验证提取流程的文章正文。'.repeat(8)}</p></article></body></html>`, { headers: { 'content-type': 'text/html' } });
    const table = new URL(url).pathname.split('/').pop()!;
    if (table === 'articles' && method === 'GET') return Response.json(null);
    writes.push({ table, method, body: init?.body ? JSON.parse(String(init.body)) : null });
    if (table === 'articles' && method === 'POST') return Response.json({ id: 'new-article' }, { status: 201 });
    if (table === 'article_paragraphs' && method === 'POST') return failParagraphs
      ? Response.json({ message: '模拟段落写入失败' }, { status: 400 }) : new Response(null, { status: 201 });
    if (table === 'articles' && method === 'DELETE') return new Response(null, { status: 204 });
    throw new Error(`未预期的请求 ${method} ${url}`);
  });
  const result = await createExtractHandler(environment)({ httpMethod: 'POST', body: JSON.stringify({ url: 'https://thepaper.cn/article', topicId: 'ai-society' }), authorization: 'Bearer test-token' });
  if (failParagraphs) {
    assert.equal(result.statusCode, 500);
    assert.ok(writes.some((write) => write.table === 'articles' && write.method === 'DELETE'));
    assert.equal(JSON.parse(result.body).success, undefined);
  } else {
    assert.equal(result.statusCode, 200);
    assert.equal(JSON.parse(result.body).article.id, 'new-article');
    assert.ok((writes.find((write) => write.table === 'articles')?.body as { tags: string[] }).tags.includes('AI与社会'));
    assert.equal(writes.filter((write) => write.table === 'article_paragraphs').length, 1);
  }
});
