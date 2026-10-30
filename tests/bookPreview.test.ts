import assert from 'node:assert/strict';
import test from 'node:test';
import {
  BOOK_CHAPTERS,
  filterBookEntries,
  showBookCatalogue,
} from '../src/features/book/chapters.ts';
import { onRequest } from '../functions/_middleware.ts';

test('book index preserves six chapters and forwards incumbent article and tool links', () => {
  assert.equal(BOOK_CHAPTERS.length, 6);
  for (const chapter of BOOK_CHAPTERS) {
    assert.equal(showBookCatalogue(chapter.path, ''), true);
    assert.equal(showBookCatalogue(chapter.path, '?q=AI&category=学习'), true);
    for (const search of ['?id=q1', '?view=all', '?group=youth'])
      assert.equal(showBookCatalogue(chapter.path, search), false);
    assert.equal(showBookCatalogue(chapter.path + '/article', ''), false);
  }
  assert.equal(showBookCatalogue('/reading', ''), false);
});

test('catalogue search combines words and category without altering original entries', () => {
  const entries = [
    {
      id: 'a',
      title: 'AI 学习',
      summary: '生成效应',
      groups: ['社会'],
      metadata: '',
      path: '/a',
      searchText: 'ai 学习 生成效应',
    },
    {
      id: 'b',
      title: 'AI 职场',
      summary: '劳动',
      groups: ['经济'],
      metadata: '',
      path: '/b',
      searchText: 'ai 职场 劳动',
    },
  ];
  assert.deepEqual(
    filterBookEntries(entries, 'AI 学习', '').map((item) => item.id),
    ['a'],
  );
  assert.deepEqual(
    filterBookEntries(entries, 'AI', '经济').map((item) => item.id),
    ['b'],
  );
  assert.equal(filterBookEntries(entries, '不存在', '').length, 0);
  assert.equal(entries.length, 2);
});

test('preview middleware blocks production API bindings for every request method', async () => {
  let forwarded = 0;
  const next = async () => {
    forwarded++;
    return new Response('asset');
  };
  for (const method of ['GET', 'POST', 'PUT', 'DELETE']) {
    const response = await onRequest({
      request: new Request('https://preview.test/api/extract-article', { method }),
      next,
    });
    assert.equal(response.status, 503);
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
  }
  assert.equal(forwarded, 0);
  assert.equal(
    (await onRequest({ request: new Request('https://preview.test/book/paper-valley.webp'), next }))
      .status,
    200,
  );
  assert.equal(forwarded, 1);
});
