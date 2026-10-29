import test from 'node:test';
import assert from 'node:assert/strict';
import { readingHierarchy, type ReadingNode } from '../src/features/reading/hierarchy.ts';
import type { ArticleBlock } from '../src/features/reading/model.ts';
import {
  navigationCategory,
  navigationThemes,
  TOPIC_GROUPS,
} from '../src/data/navigationTaxonomy.ts';
import { TOPIC_SPECIALS } from '../src/data/topicSpecials.ts';
import { searchDocuments, searchFacets } from '../src/lib/search.ts';

const flatten = (nodes: ReadingNode[]): ArticleBlock[] =>
  nodes.flatMap((node) =>
    node.kind === 'block' ? [node.block] : [node.heading, ...flatten(node.children)],
  );

test('阅读层级不改写块、次序、图片或标注所依赖的文字', () => {
  const blocks: ArticleBlock[] = [
    { id: 'intro', type: 'paragraph', text: '导语' },
    { id: 'main', type: 'heading', level: 2, text: '事件概述' },
    { id: 'body', type: 'paragraph', text: '正文保持原字和偏移。' },
    { id: 'sub', type: 'heading', level: 4, text: '跳级的小节' },
    { id: 'image', type: 'image', url: 'https://example.com/a.png', alt: '图', caption: '图注' },
    { id: 'next', type: 'heading', level: 2, text: '下一章' },
  ];
  const before = structuredClone(blocks);
  const tree = readingHierarchy(blocks);
  const restored = flatten(tree);
  assert.deepEqual(restored, before);
  restored.forEach((block, index) => assert.equal(block, blocks[index]));
  assert.deepEqual(blocks, before);
  assert.equal(tree.length, 3);
});

test('主文默认展开，关键词和媒体提要默认收起；无标题正文仍可完整阅读', () => {
  const blocks: ArticleBlock[] = [
    { id: 'main', type: 'heading', level: 2, text: '主线' },
    { id: 'term', type: 'heading', level: 2, text: '读懂关键词' },
    { id: 'definition', type: 'heading', level: 3, text: '术语' },
    { id: 'source', type: 'heading', level: 2, text: '媒体评论与研究' },
  ];
  const tree = readingHierarchy(blocks);
  assert.deepEqual(
    tree.map((node) => node.kind === 'section' && node.defaultOpen),
    [true, false, false],
  );
  assert.equal(
    tree[1].kind === 'section' &&
      tree[1].children[0].kind === 'section' &&
      tree[1].children[0].defaultOpen,
    false,
  );
  assert.deepEqual(flatten(readingHierarchy([{ id: 'p', type: 'paragraph', text: '独立段落' }])), [
    { id: 'p', type: 'paragraph', text: '独立段落' },
  ]);
});

test('旧群鉴的扁平视角仅在目录兼容模式下归入父章，不改用户原有标题层次', () => {
  const blocks: ArticleBlock[] = [
    { id: 'parent', type: 'heading', level: 2, text: '多方视角' },
    { id: 'view', type: 'heading', level: 2, text: '研究者观点' },
    { id: 'p', type: 'paragraph', text: '原来的文字' },
    { id: 'refs', type: 'heading', level: 2, text: '参考资料' },
  ];
  assert.equal(readingHierarchy(blocks).length, 3);
  const tree = readingHierarchy(blocks, true);
  assert.equal(tree.length, 2);
  assert.deepEqual(flatten(tree), blocks);
  assert.equal(
    tree[0].kind === 'section' &&
      tree[0].children[0].kind === 'section' &&
      tree[0].children[0].level,
    3,
  );
});

test('导航主题覆盖原话题一次且仅一次，原ID不丢失', () => {
  const ids = TOPIC_GROUPS.flatMap((group) => [...group.topicIds]);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual([...ids].sort(), TOPIC_SPECIALS.map((topic) => topic.id).sort());
  assert.equal(navigationCategory('微观经济学 · 决策', 'daily'), '经济与决策');
  assert.deepEqual(navigationThemes(['创作', '创造']), ['文学与审美']);
});

test('作品与作者可独立筛选，全文检索仍可命中原始标签', () => {
  const entry = {
    id: 'q',
    type: 'quote' as const,
    title: '赤壁赋',
    subtitle: '',
    path: '/quotes/q',
    author: '苏轼',
    work: '赤壁赋',
    tags: ['文学与审美'],
    searchText: '苏轼 赤壁赋 创造',
  };
  assert.equal(searchDocuments([entry], '创造', 30, { author: '苏轼', work: '赤壁赋' }).length, 1);
  assert.equal(searchDocuments([entry], '', 30, { author: '李白' }).length, 0);
});

test('上下文候选只忽略自身筛选，不混入其他栏目或不匹配正文的标签', () => {
  const base = {
    id: 'a',
    type: 'daily' as const,
    title: 'AI学习',
    subtitle: '',
    path: '/daily/a',
    category: '社会与心理',
    tags: ['学习与教育'],
    sourceNames: ['期刊A'],
    searchText: 'ai 学习',
  };
  const other = { ...base, id: 'b', category: '哲学与思想', tags: ['科技与AI'] };
  const unrelated = { ...base, id: 'c', searchText: '旅行', sourceNames: ['期刊B'] };
  const facets = searchFacets([base, other, unrelated], 'AI 学习', {
    category: '社会与心理',
    type: 'daily',
  });
  assert.deepEqual(
    facets.categories,
    ['社会与心理', '哲学与思想'].sort((a, b) => a.localeCompare(b, 'zh-CN')),
  );
  assert.deepEqual(facets.tags, ['学习与教育']);
  assert.deepEqual(facets.sources, ['期刊A']);
  assert.deepEqual(searchFacets([base], '', { type: 'world' }).tags, []);
});
