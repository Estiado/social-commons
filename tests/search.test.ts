import test from 'node:test';
import assert from 'node:assert/strict';
import { searchDocuments, type SearchDocument } from '../src/lib/search.ts';

const document: SearchDocument = { id: 'daily-1', type: 'daily', title: '论证', subtitle: '思辨', path: '/daily?id=1', searchText: '论证 reasoning 正文中的证据' };
test('空白搜索不会返回所有内容', () => assert.deepEqual(searchDocuments([document], '   '), []));
test('搜索正文而不只是结果 ID，自动处理大小写和首尾空格', () => {
  assert.equal(searchDocuments([document], ' 正文 ')[0]?.id, 'daily-1');
  assert.equal(searchDocuments([document], 'REASONING').length, 1);
});
test('搜索结果保留定位路径，不暴露或复制全文索引', () => {
  const [result] = searchDocuments([document], '证据');
  assert.equal(result.path, '/daily?id=1');
  assert.equal('searchText' in result, false);
  assert.equal(document.searchText, '论证 reasoning 正文中的证据');
});
test('命中上限后停止读取剩余文档，避免生成所有结果再截断', () => {
  const unreachable = { get searchText(): string { throw new Error('不应继续扫描'); } } as SearchDocument;
  assert.equal(searchDocuments([document, unreachable], '论证', 1).length, 1);
  assert.deepEqual(searchDocuments([document], '论证', 0), []);
});
