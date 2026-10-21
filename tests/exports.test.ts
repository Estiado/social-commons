import test from 'node:test';
import assert from 'node:assert/strict';
import { buildText, buildMarkdown, buildPrintHtml, escapeHtml, type ExportItem } from '../src/lib/collectionExport.ts';

const collection = { name: '只有划线的素材包', description: '论证练习' };
const highlight: ExportItem = { index: 1, type: '划线', content: '论据的原文', title: '一篇文章', source: '原媒体', author: '原作者', url: 'https://example.com/original' };
test('仅有划线的素材包也能生成所有文本格式', () => {
  for (const content of [buildText(collection, [highlight]), buildMarkdown(collection, [highlight]), buildPrintHtml(collection, [highlight])]) {
    for (const expected of [highlight.content, highlight.title, highlight.source, highlight.author, highlight.url]) assert.ok(content.includes(expected));
  }
});
test('打印内容转义文章、素材包名称和描述中的 HTML', () => {
  const attack = '<img src=x onerror="alert(1)"><script>bad()</script>';
  const html = buildPrintHtml({ name: attack, description: attack }, [{ ...highlight, content: attack, title: attack, author: attack, url: attack }]);
  assert.ok(!html.includes('<script>'));
  assert.ok(!html.includes('<img'));
  assert.ok(html.includes('&lt;script&gt;'));
  assert.equal(escapeHtml('&<>"\''), '&amp;&lt;&gt;&quot;&#39;');
});
test('Markdown 的长摘录使用正文，避免整篇变成巨大的标题', () => {
  const content = buildMarkdown(collection, [highlight]);
  assert.ok(content.includes('### 1. 划线\n\n论据的原文'));
  assert.ok(!content.includes('### 1. 论据的原文'));
});
