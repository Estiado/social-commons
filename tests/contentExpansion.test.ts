import test from 'node:test';
import assert from 'node:assert/strict';
import { QUOTES, QUOTE_CATALOGUE, getQuoteById } from '../src/data/quotes.ts';
import { DAILY_KNOWLEDGE } from '../src/data/daily.ts';
import { EVENTS } from '../src/data/events.ts';
import { ESSAY_MATERIALS } from '../src/data/essay.ts';
import { ESSAY_EXAMPLES } from '../src/data/essayExamples.ts';
import { CURATED_COMMENTARIES } from '../src/data/curatedCommentaries.ts';
import { TOPIC_SPECIALS } from '../src/data/topicSpecials.ts';
import { quoteDocument, versionContentDocument } from '../src/features/reading/contentDocuments.ts';
import { resolveCatalogueReading } from '../src/features/reading/catalogueReading.ts';
import {
  documentToEditor,
  editorToDocument,
} from '../src/features/reading/writing/editorDocument.ts';
import {
  articleSchema,
  createAnnotation,
  type ReadingRecord,
} from '../src/features/reading/model.ts';
import { materialFieldsSchema } from '../src/features/essay/materials.ts';

test('扩容后旧 ID 保留，目录不重复推荐同一作品，新增内容具有来源和有效专题关系', () => {
  assert.ok(DAILY_KNOWLEDGE.length >= 70);
  assert.ok(EVENTS.length >= 8);
  assert.ok(ESSAY_MATERIALS.length >= 40);
  assert.ok(ESSAY_EXAMPLES.length >= 15);
  assert.equal(CURATED_COMMENTARIES.length, 50);
  for (const collection of [
    QUOTES,
    DAILY_KNOWLEDGE,
    EVENTS,
    ESSAY_MATERIALS,
    ESSAY_EXAMPLES,
    CURATED_COMMENTARIES,
  ]) {
    assert.equal(new Set(collection.map((item) => item.id)).size, collection.length);
  }
  for (let index = 1; index <= 50; index++) assert.ok(getQuoteById(`q${index}`));
  for (const quote of QUOTE_CATALOGUE) assert.ok(!quote.canonicalId);
  assert.ok(!QUOTE_CATALOGUE.some((item) => ['q8', 'q10'].includes(item.id)));
  assert.equal(getQuoteById('q50')?.text, getQuoteById('q23')?.text);
  for (const quote of QUOTES.filter((item) => Number(item.id.slice(1)) > 50)) {
    assert.ok(quote.sourceUrl && new URL(quote.sourceUrl));
    assert.equal(quote.commentary?.status, 'verified');
  }
  for (const example of ESSAY_EXAMPLES) {
    materialFieldsSchema.parse(example);
    assert.ok(ESSAY_MATERIALS.some((item) => item.id === example.conceptId));
  }
  for (const topic of TOPIC_SPECIALS) {
    for (const id of topic.relatedDailyIds)
      assert.ok(DAILY_KNOWLEDGE.some((item) => item.id === id));
    for (const id of topic.relatedQuoteIds)
      assert.ok(QUOTE_CATALOGUE.some((item) => item.id === id));
  }
  for (const article of CURATED_COMMENTARIES) {
    assert.match(article.publishedAt, /^2026-(07|08|09|10)-\d{2}$/);
    for (const id of article.topicIds || [])
      assert.ok(TOPIC_SPECIALS.some((topic) => topic.id === id));
  }
});

test('长语段使用作品标题，分段原文完整进入阅读和导出模型', () => {
  const quote = getQuoteById('q6')!;
  const document = quoteDocument(quote);
  assert.notEqual(document.title, quote.text);
  assert.ok(document.title.length < 100);
  assert.equal(
    document.blocks
      .filter((item) => item.type === 'quote')
      .map((item) => item.text)
      .join('\n\n'),
    quote.text,
  );
  assert.ok(document.blocks.filter((item) => item.type === 'quote').length > 1);
  assert.match(JSON.stringify(document), /落月摇情满江树/);
});

test('目录更新不覆盖旧版和划线，未改动的旧记录继续沿用原 ID', async () => {
  const document = quoteDocument(getQuoteById('q36')!);
  const annotation = createAnnotation(document, 'b1', 0, 6, 'highlight');
  const old: ReadingRecord = { document, annotations: [annotation], revision: 2, expiresAt: null };
  const find = async (url: string) => (url === document.url ? old : undefined);
  const same = await resolveCatalogueReading(quoteDocument(getQuoteById('q36')!), find);
  assert.equal(same.existing, old);
  const changed = structuredClone(document);
  changed.blocks.push({ id: 'new-source', type: 'paragraph', text: '更新后的版本说明。' });
  const updated = await resolveCatalogueReading(changed, find);
  assert.equal(updated.existing, undefined);
  assert.equal(updated.olderId, document.id);
  assert.notEqual(updated.document.url, document.url);
  assert.equal(old.annotations[0].text, annotation.text);
  assert.ok(!JSON.stringify(old).includes('更新后的版本说明'));
  const savedNew = { ...old, document: updated.document };
  const reopened = await resolveCatalogueReading(changed, async (url) =>
    url === updated.document.url ? savedNew : undefined,
  );
  assert.equal(reopened.existing, savedNew);
});

test('常用正文样式在编辑转换与快照中保留，拒绝任意 CSS 值', async () => {
  const document = quoteDocument(getQuoteById('q60')!);
  const styled = articleSchema.parse({
    ...document,
    typography: { font: 'yahei', size: 14, lineHeight: 2 },
  });
  const restored = editorToDocument(documentToEditor(styled), styled, styled.title);
  assert.deepEqual(restored.typography, styled.typography);
  assert.notEqual(
    (await versionContentDocument(document)).url,
    (await versionContentDocument(styled)).url,
  );
  assert.throws(() =>
    articleSchema.parse({
      ...document,
      typography: { font: 'url(https://example.com)', size: 99, lineHeight: 0 },
    }),
  );
});
