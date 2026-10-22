import test from 'node:test';
import assert from 'node:assert/strict';
import 'fake-indexeddb/auto';
import { openDB, deleteDB } from 'idb';
import { DAILY_KNOWLEDGE } from '../src/data/daily.ts';
import { QUOTES } from '../src/data/quotes.ts';
import { EVENTS } from '../src/data/events.ts';
import {
  dailyDocument,
  quoteDocument,
  eventDocument,
  versionContentDocument,
} from '../src/features/reading/contentDocuments.ts';
import {
  createAnnotation,
  addAnnotation,
  summarize,
  type ReadingRecord,
} from '../src/features/reading/model.ts';
import {
  getGuestArticle,
  saveGuestArticle,
  saveLocalReading,
  listReadingExcerpts,
  removeGuestArticle,
  importLocalReading,
} from '../src/features/reading/guestRepository.ts';
import {
  addCollectionItems,
  mergeCollections,
  collectionDocument,
  type ReadingCollection,
} from '../src/features/reading/collections.ts';
import { isModuleLoadError } from '../src/lib/moduleLoadError.ts';

test('所有日新、名句、历史条目均可转换为同一阅读模型，保留完整文字和核验提示', () => {
  for (const item of DAILY_KNOWLEDGE) {
    const document = dailyDocument(item);
    assert.ok(
      document.blocks.some((block) => 'text' in block && block.text.includes(item.summary)),
    );
  }
  for (const item of QUOTES) {
    const document = quoteDocument(item);
    assert.ok(document.blocks.some((block) => 'text' in block && block.text === item.text));
    if (item.commentary) assert.ok(JSON.stringify(document).includes(item.commentary.url));
  }
  for (const item of EVENTS) {
    const document = eventDocument(item);
    const texts = document.blocks.flatMap((block) => ('text' in block ? [block.text] : []));
    for (const view of item.perspectives)
      for (const part of view.description.split(/\n\s*\n/)) assert.ok(texts.includes(part));
  }
});

test('V1 本机数据库原位升级，旧文章、期限与划线保持不变，并建立摘录索引', async () => {
  await deleteDB('social-commons-reading');
  const document = dailyDocument(DAILY_KNOWLEDGE[0]);
  const annotation = createAnnotation(document, 'b1', 0, 4, 'highlight');
  const record: ReadingRecord = {
    document,
    annotations: [annotation],
    expiresAt: null,
    revision: 0,
    localRevision: 3,
  };
  const database = await openDB('social-commons-reading', 1, {
    upgrade(db) {
      db.createObjectStore('documents', { keyPath: 'document.id' }).createIndex(
        'by-url',
        'document.url',
      );
      db.createObjectStore('summaries', { keyPath: 'id' }).createIndex('by-expiry', 'expiresAt');
    },
  });
  await database.put('documents', record);
  await database.put('summaries', summarize(record));
  database.close();
  assert.deepEqual(await getGuestArticle(document.id), record);
  const excerpts = await listReadingExcerpts();
  assert.equal(excerpts.length, 1);
  assert.equal(excerpts[0].text, annotation.text);
  assert.equal(excerpts[0].documentId, document.id);
});

test('正文、摘要、摘录索引在同一事务更新；取消收藏与删除不会留下幽灵摘录', async () => {
  await deleteDB('social-commons-reading');
  const document = quoteDocument(QUOTES[0]);
  const record = await saveGuestArticle(document);
  const annotation = createAnnotation(document, 'b1', 0, 4, 'highlight');
  const saved = await saveLocalReading(addAnnotation(record, annotation));
  assert.equal((await listReadingExcerpts()).length, 1);
  const removed = await saveLocalReading({ ...saved, annotations: [] });
  assert.deepEqual(await listReadingExcerpts(), []);
  await saveLocalReading(addAnnotation(removed, annotation));
  await removeGuestArticle(document.id);
  assert.deepEqual(await listReadingExcerpts(), []);
});

test('旧资料重复迁移不覆盖本机版本，并可追加后来收藏的条目', async () => {
  await deleteDB('social-commons-reading');
  const document = quoteDocument(QUOTES[0]);
  const annotation = createAnnotation(document, 'b1', 0, 4, 'highlight');
  const record: ReadingRecord = {
    document,
    annotations: [annotation],
    revision: 0,
    expiresAt: null,
  };
  const first = await importLocalReading(record);
  const repeat = await importLocalReading(record);
  assert.deepEqual(repeat, first);
  const second = createAnnotation(document, 'b1', 4, 6, 'highlight');
  await importLocalReading({ ...record, annotations: [annotation, second] });
  assert.equal((await listReadingExcerpts()).length, 2);
});

test('素材包去重、重复导入保留本人备注和排序，导出保留出处，缺失摘录不能静默忽略', async () => {
  const excerpts = await listReadingExcerpts();
  const group: ReadingCollection = {
    id: 'group',
    name: '教学内测',
    description: '我的主题',
    updatedAt: new Date().toISOString(),
    items: [{ key: excerpts[0].key, note: '本人备注' }],
  };
  const added = addCollectionItems(group, [excerpts[0].key, excerpts[1].key, excerpts[1].key]);
  assert.equal(added.items.length, 2);
  const merged = mergeCollections(
    [added],
    [{ ...group, name: '旧名称', items: [{ key: excerpts[0].key, note: '旧备注' }] }],
  );
  assert.equal(merged[0].name, '教学内测');
  assert.equal(merged[0].items[0].note, '本人备注');
  const document = collectionDocument(added, excerpts);
  assert.ok(JSON.stringify(document).includes(excerpts[0].source));
  assert.ok(JSON.stringify(document).includes('本人备注'));
  assert.throws(() => collectionDocument(added, []), /无法读取/);
  const imported = mergeCollections(
    [group],
    [
      {
        ...group,
        name: '旧名称',
        items: [
          { key: excerpts[0].key, note: '旧备注' },
          { key: excerpts[1].key, note: '追加条目原有备注' },
        ],
      },
    ],
  );
  assert.equal(imported[0].items[0].note, '本人备注');
  assert.equal(imported[0].items[1].note, '追加条目原有备注');
});

test('过期页面模块需要重新加载，普通业务错误继续正常重试', () => {
  assert.equal(
    isModuleLoadError(new TypeError('Failed to fetch dynamically imported module: /events.js')),
    true,
  );
  assert.equal(isModuleLoadError(new Error('账号状态读取失败')), false);
});

test('编辑素材另存阅读版本，原收藏不被覆盖，相同正文重开不会重复导入', async () => {
  await deleteDB('social-commons-reading');
  const original = await versionContentDocument(dailyDocument(DAILY_KNOWLEDGE[0]));
  const first = await saveGuestArticle(original);
  const annotation = createAnnotation(original, 'b1', 0, 4, 'highlight');
  await saveLocalReading(addAnnotation(first, annotation));
  const reopened = await versionContentDocument({
    ...original,
    id: crypto.randomUUID(),
    contentVersion: crypto.randomUUID(),
    importedAt: new Date().toISOString(),
  });
  assert.equal(reopened.url, original.url);
  assert.equal((await saveGuestArticle(reopened)).document.id, original.id);
  const revised = await versionContentDocument({
    ...original,
    id: crypto.randomUUID(),
    contentVersion: crypto.randomUUID(),
    blocks: [{ id: 'b1', type: 'paragraph', text: '读者修改后的新素材。' }],
  });
  assert.notEqual(revised.url, original.url);
  await saveGuestArticle(revised);
  assert.equal((await getGuestArticle(original.id))?.annotations.length, 1);
  assert.equal(
    (await getGuestArticle(revised.id))?.document.blocks[0].text,
    '读者修改后的新素材。',
  );
});
