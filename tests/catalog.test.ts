import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeArticles, filterArticles, countArticlesByTopic, type ArticleListItem } from '../src/lib/articleCatalog.ts';
const make = (id: string, extras: Partial<ArticleListItem> = {}): ArticleListItem => ({ id, url: `https://example.com/${id}`, title: '人工智能', author: '作者', source: '媒体', published_at: null, excerpt: '青年成长', tags: ['教育'], created_at: '2026-01-01', ...extras });

test('按 URL 合并去重，经典文章保留本地阅读入口', () => {
  const preset = make('preset', { is_preset: true });
  const remote = make('uuid', { url: preset.url });
  assert.deepEqual(mergeArticles([preset], [remote]).map((item) => item.id), ['preset']);
});
test('经典文章优先、其余按时间排序，不修改输入', () => {
  const source = [make('old'), make('new', { created_at: '2026-10-20' }), make('classic', { is_preset: true, created_at: '1900-01-01' })];
  assert.deepEqual(mergeArticles(source).map((item) => item.id), ['classic', 'new', 'old']);
  assert.equal(source[0].id, 'old');
});
test('筛选可以同时限制话题、标签和正文摘要', () => {
  const items = [make('one', { hot_topic: 'youth' }), make('two', { hot_topic: 'ai' })];
  assert.deepEqual(filterArticles(items, ' 青年 ', 'youth', '教育').map((item) => item.id), ['one']);
  assert.equal(filterArticles(items, '', '', '不存在').length, 0);
});
test('话题计数来自完整目录，与当前筛选结果独立', () => {
  const items = [make('one', { hot_topic: 'ai' }), make('two', { hot_topic: 'ai' }), make('three')];
  assert.deepEqual(countArticlesByTopic(items), { ai: 2 });
});
