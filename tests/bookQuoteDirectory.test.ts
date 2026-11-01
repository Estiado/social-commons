import assert from 'node:assert/strict';
import test from 'node:test';
import { QUOTE_CATALOGUE } from '../src/data/quotes.ts';
import { quoteDirectory, quoteIndexFor } from '../src/features/book/quoteDirectory.ts';

const entries = QUOTE_CATALOGUE.map((item) => ({
  id: item.id,
  title: item.title || item.source,
  summary: item.text,
  groups: [item.author, quoteIndexFor(item.author).author],
  metadata: item.author,
  path: '/quotes/' + item.id,
  searchText: item.author,
  quoteIndex: quoteIndexFor(item.author, item.title || item.source),
}));

test('every current literary work has one documented region and period, without lost or duplicate entries', () => {
  assert.equal(new Set(entries.map((item) => item.id)).size, QUOTE_CATALOGUE.length);
  assert.deepEqual(
    entries.filter((item) => item.quoteIndex.region === '待考'),
    [],
  );
  const root = quoteDirectory(entries, '');
  assert.deepEqual(
    root.facets.map((item) => item.name),
    ['中国文学', '外国文学'],
  );
  assert.equal(
    root.facets.reduce((n, item) => n + item.count, 0),
    entries.length,
  );
  const leafIds: string[] = [];
  for (const region of root.facets) {
    for (const period of quoteDirectory(entries, region.key).facets) {
      for (const author of quoteDirectory(entries, period.key).facets) {
        const leaf = quoteDirectory(entries, author.key);
        assert.equal(leaf.works, true);
        assert.equal(leaf.parent, period.key);
        assert.equal(leaf.matches.length, author.count);
        leafIds.push(...leaf.matches.map((item) => item.id));
      }
    }
  }
  assert.deepEqual(leafIds.sort(), entries.map((item) => item.id).sort());
});

test('Chinese periods are chronological and authors, anthologies and uncertain attributions stay distinct', () => {
  const periods = quoteDirectory(entries, '中国').facets.map((item) => item.name);
  assert.ok(periods.indexOf('汉') < periods.indexOf('唐'));
  assert.ok(periods.indexOf('唐') < periods.indexOf('宋'));
  assert.ok(periods.indexOf('宋') < periods.indexOf('元'));
  assert.equal(quoteIndexFor('《诗经》').author, '《诗经》');
  assert.equal(quoteIndexFor('《礼记》').period, '先秦两汉');
  assert.equal(
    quoteIndexFor('杜秋娘（传统署名，作者有异说）').author,
    '杜秋娘（传统署名，作者有异说）',
  );
  assert.equal(quoteIndexFor('佚名', '迢迢牵牛星').period, '汉');
  assert.equal(quoteIndexFor('佚名', '未考证的新作品').region, '待考');
  assert.equal(quoteIndexFor('尚未编目的作者').period, '待考');
});

test('legacy author links and Rilke aliases still reach the canonical works; search facets never invent counts', () => {
  const legacy = quoteDirectory(entries, '苏轼');
  const canonical = quoteDirectory(entries, '中国/宋/苏轼');
  assert.deepEqual(
    legacy.matches.map((item) => item.id),
    canonical.matches.map((item) => item.id),
  );
  assert.equal(legacy.title, '苏轼');
  assert.equal(quoteIndexFor('里尔克').author, quoteIndexFor('赖内·马利亚·里尔克').author);
  assert.deepEqual(
    quoteDirectory(entries, '里尔克').matches.map((item) => item.id),
    quoteDirectory(entries, '外国/19—20世纪之交/赖内·马利亚·里尔克').matches.map((item) => item.id),
  );
  const single = entries.filter((item) => item.id === canonical.matches[0].id);
  assert.equal(quoteDirectory(single, '').facets[0].count, 1);
  assert.deepEqual(quoteDirectory([], '中国/唐').facets, []);
  assert.equal(quoteDirectory(entries, '~all').matches.length, entries.length);
});
