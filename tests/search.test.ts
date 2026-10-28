import test from 'node:test';
import assert from 'node:assert/strict';
import {
  searchDocuments,
  searchHighlights,
  searchTerms,
  searchSnippet,
  type SearchDocument,
} from '../src/lib/search.ts';

const document: SearchDocument = {
  id: 'daily-1',
  type: 'daily',
  title: '论证',
  subtitle: '思辨',
  path: '/daily?id=1',
  searchText: '论证 reasoning 正文中的证据',
};
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
test('先做相关性排序再截取，较晚出现的标题命中不会被前30条正文命中遮住', () => {
  const early = Array.from({ length: 35 }, (_, index) => ({
    ...document,
    id: 'early-' + index,
    title: '资料',
    searchText: '资料 论证',
  }));
  const late = { ...document, id: 'late', type: 'quote' as const };
  const results = searchDocuments([...early, late], '论证', 30);
  assert.equal(results.length, 30);
  assert.equal(results[0].id, 'late');
  assert.deepEqual(searchDocuments([document], '论证', 0), []);
});

test('多词AND检索、全半角归一化及查询上限，标点不会作为正则执行', () => {
  assert.equal(searchDocuments([document], '正文 reasoning').length, 1);
  assert.equal(searchDocuments([document], '正文 不存在').length, 0);
  assert.deepEqual(searchTerms(' ＡＩ  AI 学习 '), ['ai', '学习']);
  assert.ok(searchTerms('x '.repeat(200)).length <= 8);
  assert.deepEqual(searchHighlights('<script>[x]+</script>', '[x]+'), [{ start: 8, end: 12 }]);
});

test('栏目、标签与来源筛选在截取之前生效，无输入也能按条件浏览', () => {
  const first = { ...document, category: '哲学', tags: ['思辨'], source: '原书' };
  const second = {
    ...document,
    id: 'quote-1',
    type: 'quote' as const,
    category: '诗文',
    tags: ['时间'],
    source: '苏轼',
  };
  assert.deepEqual(searchDocuments([first, second], '', 30), []);
  assert.equal(searchDocuments([first, second], '', 30, { type: 'quote' })[0].id, second.id);
  assert.equal(
    searchDocuments([first, second], '论证', 1, {
      source: '苏轼',
      tag: '时间',
      category: '诗文',
    })[0].id,
    second.id,
  );
  assert.equal(
    searchDocuments([first, second], '论证', 30, { source: '苏轼', tag: '思辨' }).length,
    0,
  );
});

test('摘要定位正文命中且全文不进入结果，高亮合并交叠命中', () => {
  const text = '开头'.repeat(90) + '需要查找的正文证据' + '后续'.repeat(80);
  const item = { ...document, excerptText: text };
  const result = searchDocuments([item], '证据')[0];
  assert.ok(result.summary?.includes('正文证据'));
  assert.ok(result.summary!.length <= 120);
  assert.equal('excerptText' in result, false);
  assert.equal('searchText' in result, false);
  assert.deepEqual(searchHighlights('人工智能智能', '人工智能 智能'), [{ start: 0, end: 6 }]);
  assert.equal(searchSnippet('短文', ['找不到']), '短文');
  assert.equal(searchSnippet('这段简短摘要。', ['摘要']), '这段简短摘要。');
});

test('同一事件登记多个资料来源，按其中一个机构筛选即可命中', () => {
  const event = {
    ...document,
    source: '新华社、国际能源署',
    sourceNames: ['新华社', '国际能源署'],
  };
  assert.equal(searchDocuments([event], '论证', 30, { source: '新华社' }).length, 1);
  assert.equal(searchDocuments([event], '', 30, { source: '国际能源署' }).length, 1);
  assert.equal(searchDocuments([event], '论证', 30, { source: '未登记机构' }).length, 0);
});
