import test from 'node:test';
import assert from 'node:assert/strict';
import 'fake-indexeddb/auto';
import { deleteDB } from 'idb';
import { GUANLAN_EVENTS, eventsForTopic } from '../src/data/guanlan/catalogue.ts';
import { getGuanlanEvent } from '../src/data/guanlan/index.ts';
import { TOPIC_SPECIALS } from '../src/data/topicSpecials.ts';
import { DAILY_KNOWLEDGE } from '../src/data/daily.ts';
import { getQuoteById } from '../src/data/quotes.ts';
import { SEARCH_INDEX } from '../src/data/searchIndex.ts';
import { searchDocuments } from '../src/lib/search.ts';
import { guanlanEventDocument } from '../src/features/guanlan/eventDocument.ts';
import {
  contentPath,
  loadContentDocument,
  versionContentDocument,
} from '../src/features/reading/contentDocuments.ts';
import { resolveCatalogueReading } from '../src/features/reading/catalogueReading.ts';
import {
  documentToEditor,
  editorToDocument,
} from '../src/features/reading/writing/editorDocument.ts';
import { parsePlainArticle } from '../src/features/reading/parseArticle.ts';
import { addAnnotation, createAnnotation } from '../src/features/reading/model.ts';
import {
  saveGuestArticle,
  saveLocalReading,
  getGuestArticle,
  listGuestArticles,
  linkArticleToEvent,
  linkArticleToTopic,
  listReadingExcerpts,
} from '../src/features/reading/guestRepository.ts';
import {
  createReadingBackup,
  restoreReadingBackup,
  readingBackupSchema,
} from '../src/features/reading/backup.ts';

test('观澜事件保留三层视角、真实署名及有效关联，未知路径不能命中对象原型', async () => {
  assert.equal(new Set(GUANLAN_EVENTS.map((item) => item.id)).size, 12);
  const topics = new Set(TOPIC_SPECIALS.map((item) => item.id));
  for (const summary of GUANLAN_EVENTS) {
    const event = (await getGuanlanEvent(summary.id))!;
    assert.equal(event.title, summary.title);
    assert.ok(event.topicIds.every((id) => topics.has(id)));
    assert.deepEqual(
      event.perspectives.map((view) => view.level),
      ['现象', '社会', '思想'],
    );
    const sources = new Map(event.sources.map((source) => [source.id, source]));
    assert.equal(sources.size, event.sources.length);
    for (const section of [
      event.recap,
      event.background,
      ...event.perspectives,
      ...event.reconsiderations,
    ]) {
      assert.ok(section.paragraphs.length > 0);
      assert.ok(section.sourceIds.length > 0);
      assert.ok(section.sourceIds.every((id) => sources.has(id)));
    }
    for (const source of event.sources) {
      assert.ok(source.title && source.author && source.publication && source.date);
      assert.equal(new URL(source.url).protocol, 'https:');
      if (source.fullText) assert.equal(new URL(source.fullText.url).protocol, 'https:');
    }
    assert.ok(event.relatedDailyIds.every((id) => DAILY_KNOWLEDGE.some((item) => item.id === id)));
    assert.ok(event.relatedQuoteIds.every((id) => getQuoteById(id)));
  }
  for (const id of ['missing', '__proto__', 'constructor'])
    assert.equal(await getGuanlanEvent(id), undefined);
});

test('话题复用同一事件路径，全站搜索直接命中事件；旧目录与旧链接保持可达', () => {
  const ai = GUANLAN_EVENTS.find((item) => item.id === 'ai-at-work')!;
  for (const topicId of ai.topicIds)
    assert.equal(
      eventsForTopic(topicId).find((item) => item.id === ai.id),
      ai,
    );
  assert.deepEqual(eventsForTopic('not-a-topic'), []);
  const ordered = eventsForTopic();
  assert.ok(
    ordered.every((item, index) => index === 0 || ordered[index - 1].sortDate >= item.sortDate),
  );
  for (const query of ['打铁花', '学术酒吧']) {
    const result = searchDocuments(SEARCH_INDEX, query).find(
      (item) => item.type === 'guanlan-event',
    );
    assert.ok(result?.path.startsWith('/guanlan/events/'));
  }
  assert.equal(contentPath('guanlan-event', ai.id), '/guanlan/events/ai-at-work');
  assert.equal(contentPath('event', 'silk-road'), '/events/silk-road');
  assert.equal(contentPath('quote', 'q44'), '/quotes/q44');
  assert.equal(contentPath('topic', 'culture-heritage'), '/topics/culture-heritage');
});

test('事件正文、阅读空间和文稿共用完整内容，来源链接用题名，电子版紧随对应视角', async () => {
  const event = (await getGuanlanEvent('heritage-short-video'))!;
  const document = guanlanEventDocument(event);
  const loaded = await loadContentDocument('guanlan-event', event.id);
  assert.deepEqual(loaded.blocks, document.blocks);
  assert.deepEqual(
    document.blocks
      .filter((block) => block.type === 'heading' && block.level === 2)
      .map((block) => block.text),
    ['新闻回放', '深度背景', '多维立意', '思辨翻转', '媒体评论与研究'],
  );
  for (const source of event.sources) {
    assert.ok(
      document.blocks.some(
        (block) =>
          'text' in block &&
          block.text.includes(source.title) &&
          block.spans?.some((span) => span.href === source.url),
      ),
    );
  }
  const file = event.sources.find((source) => source.fullText)!.fullText!;
  const fileIndex = document.blocks.findIndex(
    (block) => 'text' in block && block.spans?.some((span) => span.href === file.url),
  );
  const reflectionIndex = document.blocks.findIndex(
    (block) => 'text' in block && block.text === '思辨翻转',
  );
  assert.ok(fileIndex > 0 && fileIndex < reflectionIndex);
  for (const block of document.blocks) {
    if ('text' in block) assert.doesNotMatch(block.text, /https?:\/\//u);
  }
  const editor = documentToEditor(document);
  const roundTrip = editorToDocument(editor, document, document.title);
  assert.deepEqual(
    roundTrip.blocks.map((block) => [block.type, 'text' in block ? block.text : '']),
    document.blocks.map((block) => [block.type, 'text' in block ? block.text : '']),
  );
  const hrefs = (blocks: typeof document.blocks) =>
    blocks.flatMap((block) =>
      'text' in block ? (block.spans || []).flatMap((span) => (span.href ? [span.href] : [])) : [],
    );
  assert.deepEqual(hrefs(roundTrip.blocks), hrefs(document.blocks));
  assert.ok(
    roundTrip.blocks.some(
      (block) => block.type === 'quote' && block.text.includes('手艺却得由后来者继承'),
    ),
  );
});

test('更新事件正文生成新快照，既有划线和原版本不被改写', async () => {
  const event = (await getGuanlanEvent('ai-at-work'))!;
  const first = guanlanEventDocument(event);
  const same = guanlanEventDocument(event);
  assert.equal((await versionContentDocument(first)).url, (await versionContentDocument(same)).url);
  const annotation = createAnnotation(first, first.blocks[0].id, 0, 5, 'highlight');
  const old = { document: first, annotations: [annotation], expiresAt: null, revision: 0 };
  const changed = guanlanEventDocument({
    ...event,
    summary: event.summary,
    recap: { ...event.recap, paragraphs: [...event.recap.paragraphs, '一段后来补充的背景。'] },
  });
  const resolved = await resolveCatalogueReading(changed, async (url) =>
    url === first.url ? old : undefined,
  );
  assert.equal(resolved.olderId, first.id);
  assert.equal(resolved.existing, undefined);
  assert.deepEqual(old.annotations, [annotation]);
  assert.notEqual(resolved.document.url, (await versionContentDocument(first)).url);
});

test('个人事件关联、旧话题和摘录一起持久化，备份可恢复且不会覆盖后续编辑', async () => {
  await deleteDB('social-commons-reading');
  const document = parsePlainArticle(
    '这是一段专门用于关联和备份的测试正文，划线应始终对应原来的文字。',
  );
  const initial = await saveGuestArticle(document);
  const annotated = await saveLocalReading(
    addAnnotation(initial, createAnnotation(document, document.blocks[0].id, 0, 8, 'highlight')),
  );
  await linkArticleToTopic(document.id, 'legacy-topic', ['旧标签']);
  await linkArticleToEvent(document.id, GUANLAN_EVENTS[0]);
  await linkArticleToEvent(document.id, GUANLAN_EVENTS[0]);
  const linked = await linkArticleToEvent(document.id, GUANLAN_EVENTS[1]);
  assert.deepEqual(linked.eventIds, ['heritage-short-video', 'ai-at-work']);
  assert.ok(linked.topicIds?.includes('legacy-topic'));
  assert.equal(new Set(linked.topicIds).size, linked.topicIds?.length);
  assert.deepEqual(linked.annotations, annotated.annotations);
  assert.deepEqual(linked.document.blocks, document.blocks);
  assert.equal(linked.document.contentVersion, document.contentVersion);
  assert.equal(linked.expiresAt, null);
  assert.deepEqual((await listGuestArticles())[0].eventIds, linked.eventIds);
  assert.equal((await listReadingExcerpts())[0].text, annotated.annotations[0].text);
  await assert.rejects(saveLocalReading(annotated), /另一个标签页/u);
  const backup = await (await createReadingBackup()).text();
  const previous = JSON.parse(backup);
  delete previous.documents[0].eventIds;
  assert.ok(readingBackupSchema.safeParse(previous).success);
  const invalid = JSON.parse(backup);
  invalid.documents[0].eventIds = [''];
  assert.equal(readingBackupSchema.safeParse(invalid).success, false);
  invalid.documents[0].eventIds = Array.from({ length: 101 }, () => 'event');
  assert.equal(readingBackupSchema.safeParse(invalid).success, false);
  await deleteDB('social-commons-reading');
  assert.deepEqual(await restoreReadingBackup(backup), { restored: 1, skipped: 0 });
  assert.deepEqual((await getGuestArticle(document.id))?.eventIds, linked.eventIds);
  assert.deepEqual((await getGuestArticle(document.id))?.annotations, linked.annotations);
  await linkArticleToEvent(document.id, GUANLAN_EVENTS[2]);
  assert.deepEqual(await restoreReadingBackup(backup), { restored: 0, skipped: 1 });
  assert.equal((await getGuestArticle(document.id))?.eventIds?.length, 3);
  await deleteDB('social-commons-reading');
});
