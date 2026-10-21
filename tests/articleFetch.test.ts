import test from 'node:test';
import assert from 'node:assert/strict';
import { validateArticleUrl, readBoundedHtml, fetchArticleHtml } from '../server/articleFetch.ts';

test('支持可信媒体及其子域，去掉片段标识', () => assert.equal(validateArticleUrl('https://m.thepaper.cn/news?id=1#text').href, 'https://m.thepaper.cn/news?id=1'));
test('拒绝本地地址、域名伪装、凭证、额外端口和非 HTTP 协议', () => {
  for (const url of ['http://127.0.0.1/', 'http://localhost/', 'http://169.254.169.254/', 'https://thepaper.cn.attacker.test/', 'https://thepaper.cn@attacker.test/', 'https://u:p@thepaper.cn/', 'https://thepaper.cn:444/', 'file:///etc/passwd', 'bad']) assert.throws(() => validateArticleUrl(url));
});
test('每次重定向重新验证目标地址', async (context) => {
  const mock = context.mock.method(globalThis, 'fetch', async () => new Response(null, { status: 302, headers: { location: 'http://127.0.0.1/private' } }));
  await assert.rejects(fetchArticleHtml('https://thepaper.cn/news'), /暂不支持/);
  assert.equal(mock.mock.callCount(), 1);
});
test('只接受 HTML，拒绝 PDF 和超大 Content-Length', async () => {
  await assert.rejects(readBoundedHtml(new Response('pdf', { headers: { 'content-type': 'application/pdf' } })), /不是 HTML/);
  await assert.rejects(readBoundedHtml(new Response('abc', { headers: { 'content-type': 'text/html', 'content-length': '100' } }), 10), /页面过大/);
});
test('没有长度头的响应流也受实际字节限制', async () => {
  await assert.rejects(readBoundedHtml(new Response('超过上限的中文', { headers: { 'content-type': 'text/html' } }), 5), /页面过大/);
  assert.equal(await readBoundedHtml(new Response('<p>中文</p>', { headers: { 'content-type': 'text/html' } })), '<p>中文</p>');
});
