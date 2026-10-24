import test from 'node:test';
import assert from 'node:assert/strict';
import 'fake-indexeddb/auto';
import { deleteDB, openDB } from 'idb';
import { parsePlainArticle } from '../src/features/reading/parseArticle.ts';
import { addAnnotation, createAnnotation, summarize } from '../src/features/reading/model.ts';
import {
  getGuestArticle,
  saveGuestArticle,
  saveLocalReading,
  removeGuestArticle,
  openReadingDatabase,
} from '../src/features/reading/guestRepository.ts';
import { newDraft, summarizeDraft } from '../src/features/reading/writing/model.ts';
import { getDraft, saveDraft } from '../src/features/reading/writing/repository.ts';
import {
  createPersonalBackup,
  restorePersonalBackup,
} from '../src/features/reading/personalBackup.ts';
import { createReadingBackup } from '../src/features/reading/backup.ts';
import { ESSAY_STORAGE_KEYS, readEssayPersonalData } from '../src/features/essay/personalData.ts';
import { searchReadingWorkspace } from '../src/features/reading/searchRepository.ts';
import { searchEntry, findInEntry, firstSearchMatch } from '../src/features/reading/searchIndex.ts';
import { readingTextSegments } from '../src/features/reading/textSegments.ts';
import {
  clearFeedbackDraft,
  FEEDBACK_DRAFT_KEY,
  parseFeedbackDraft,
  saveFeedbackDraft,
} from '../src/features/feedback/draft.ts';
import { feedbackLink } from '../src/features/feedback/navigation.ts';
import { normalizeFeedback } from '../src/features/feedback/report.ts';
import { shouldOfferTour, markTourSeen } from '../src/features/onboarding/preferences.ts';

class MemoryStorage implements Storage {
  values = new Map<string, string>();
  failKey = '';
  get length() {
    return this.values.size;
  }
  clear() {
    this.values.clear();
  }
  getItem(key: string) {
    return this.values.get(key) ?? null;
  }
  key(index: number) {
    return [...this.values.keys()][index] ?? null;
  }
  removeItem(key: string) {
    this.values.delete(key);
  }
  setItem(key: string, value: string) {
    if (key === this.failKey) throw new Error('QuotaExceededError');
    this.values.set(key, value);
  }
}
const material = {
  id: crypto.randomUUID(),
  conceptId: 'fairness',
  title: '个人素材',
  content: '从真实处境理解一个人的选择。',
  source: '本人整理',
  sourceUrl: '',
  usageHint: '',
  updatedAt: '2026-10-23T00:00:00Z',
};
const concept = {
  id: 'custom-local-test',
  concept: '自建词条',
  category: '我的分类',
  description: '自己的解释。',
  applicableTopics: ['理解'],
  materials: [],
};
const makeEssay = (storage: MemoryStorage) => {
  storage.setItem(ESSAY_STORAGE_KEYS.materials, JSON.stringify([material]));
  storage.setItem(ESSAY_STORAGE_KEYS.concepts, JSON.stringify([concept]));
  storage.setItem(ESSAY_STORAGE_KEYS.categories, JSON.stringify(['我的分类']));
};

test('统一备份往返所有个人内容，重复恢复保留本机编辑并兼容旧文件', async () => {
  await deleteDB('social-commons-reading');
  const storage = new MemoryStorage();
  makeEssay(storage);
  storage.setItem('unrelated-auth', '不应出现在备份');
  const document = parsePlainArticle(
    '一段用于验证完整备份的连续正文，也包含只在文章中的关键词银杏。',
  );
  const record = await saveGuestArticle(document);
  const saved = await saveLocalReading(
    addAnnotation(record, createAnnotation(document, document.blocks[0].id, 0, 6, 'highlight')),
  );
  const draft = await saveDraft(newDraft(document));
  const backup = await (await createPersonalBackup(storage)).text();
  const old = await (await createReadingBackup()).text();
  assert.doesNotMatch(backup, /unrelated-auth|不应出现在备份/u);
  await deleteDB('social-commons-reading');
  storage.clear();
  assert.deepEqual(await restorePersonalBackup(backup, storage), { restored: 5, skipped: 0 });
  assert.deepEqual((await getGuestArticle(document.id))?.annotations, saved.annotations);
  assert.equal((await getDraft(draft.document.id))?.document.title, draft.document.title);
  assert.equal(readEssayPersonalData(storage).concepts[0].concept, concept.concept);
  storage.setItem(
    ESSAY_STORAGE_KEYS.materials,
    JSON.stringify([{ ...material, content: '本机更新，不能被旧备份覆盖。' }]),
  );
  storage.setItem(
    ESSAY_STORAGE_KEYS.concepts,
    JSON.stringify([{ ...concept, description: '本机词条更新' }]),
  );
  assert.deepEqual(await restorePersonalBackup(backup, storage), { restored: 0, skipped: 5 });
  assert.equal(readEssayPersonalData(storage).materials[0].content, '本机更新，不能被旧备份覆盖。');
  assert.equal(readEssayPersonalData(storage).concepts[0].description, '本机词条更新');
  assert.deepEqual(await restorePersonalBackup(old, storage), { restored: 0, skipped: 2 });
  assert.deepEqual(
    await restorePersonalBackup(
      JSON.stringify({ schemaVersion: 1, materials: [material] }),
      storage,
    ),
    { restored: 0, skipped: 1 },
  );
  assert.equal((await searchReadingWorkspace('银杏')).size, 2);
  await deleteDB('social-commons-reading');
});

test('统一恢复先完整校验，素材空间不足可重试且不会覆盖或重复', async () => {
  await deleteDB('social-commons-reading');
  const storage = new MemoryStorage();
  makeEssay(storage);
  const document = parsePlainArticle('恢复发生错误时也必须保留原来的数据。');
  await saveGuestArticle(document);
  const backup = await (await createPersonalBackup(storage)).text();
  await deleteDB('social-commons-reading');
  storage.clear();
  const invalid = JSON.parse(backup);
  invalid.essay.concepts[0].references = [{ title: '危险地址', url: 'javascript:alert(1)' }];
  await assert.rejects(restorePersonalBackup(JSON.stringify(invalid), storage), /尚未写入/u);
  assert.equal(await getGuestArticle(document.id), undefined);
  assert.equal(storage.length, 0);
  storage.failKey = ESSAY_STORAGE_KEYS.concepts;
  await assert.rejects(restorePersonalBackup(backup, storage), /部分素材尚未恢复/u);
  assert.equal((await getGuestArticle(document.id))?.document.id, document.id);
  assert.equal(readEssayPersonalData(storage).materials.length, 1);
  storage.failKey = '';
  assert.deepEqual(await restorePersonalBackup(backup, storage), { restored: 2, skipped: 2 });
  assert.equal(readEssayPersonalData(storage).materials.length, 1);
  storage.setItem(ESSAY_STORAGE_KEYS.materials, '{损坏');
  await assert.rejects(createPersonalBackup(storage), /格式异常/u);
  await deleteDB('social-commons-reading');
});

test('V3原位补齐正文索引，旧正文、划线、期限和文稿原样保留', async () => {
  await deleteDB('social-commons-reading');
  const document = parsePlainArticle('标题里没有的关键词：梧桐，应该可以在正文中检索。');
  const record = {
    document,
    annotations: [createAnnotation(document, document.blocks[0].id, 0, 4, 'highlight')],
    expiresAt: null,
    revision: 0,
  };
  const draft = newDraft(parsePlainArticle('在旧文稿中检索红叶。'));
  const old = await openDB('social-commons-reading', 3, {
    upgrade(db) {
      db.createObjectStore('documents', { keyPath: 'document.id' }).createIndex(
        'by-url',
        'document.url',
      );
      db.createObjectStore('summaries', { keyPath: 'id' }).createIndex('by-expiry', 'expiresAt');
      db.createObjectStore('excerpts', { keyPath: 'key' }).createIndex('by-document', 'documentId');
      db.createObjectStore('drafts', { keyPath: 'document.id' }).createIndex(
        'by-origin',
        'originKey',
        { unique: true },
      );
      db.createObjectStore('draftSummaries', { keyPath: 'id' });
    },
  });
  await old.put('documents', record);
  await old.put('summaries', summarize(record));
  await old.put('drafts', draft);
  await old.put('draftSummaries', summarizeDraft(draft));
  old.close();
  assert.equal(
    (await searchReadingWorkspace('梧桐')).get('article:' + document.id)?.blockId,
    document.blocks[0].id,
  );
  assert.equal((await searchReadingWorkspace('红叶')).size, 1);
  assert.deepEqual(await getGuestArticle(document.id), record);
  assert.deepEqual(await getDraft(draft.document.id), draft);
  await deleteDB('social-commons-reading');
});

test('正文检索跟随保存和删除，陈旧写入不会改掉索引，过期记录不会命中', async () => {
  await deleteDB('social-commons-reading');
  const document = parsePlainArticle('只在正文出现的词：星河。');
  await saveGuestArticle(document);
  const draft = await saveDraft(newDraft(document));
  const updated = await saveDraft({
    ...draft,
    document: { ...document, blocks: [{ id: 'b1', type: 'paragraph', text: '改成月光。' }] },
  });
  await assert.rejects(saveDraft(draft), /另一个标签页/u);
  assert.equal((await searchReadingWorkspace('星河')).size, 1);
  assert.equal(
    (await searchReadingWorkspace('月光')).get('draft:' + updated.document.id)?.blockId,
    'b1',
  );
  await removeGuestArticle(document.id);
  assert.equal((await searchReadingWorkspace('星河')).size, 0);
  const db = await openReadingDatabase();
  await db.put('searchEntries', searchEntry(document, 'article', 1));
  db.close();
  assert.equal((await searchReadingWorkspace('星河')).size, 0);
  const abort = new AbortController();
  abort.abort();
  await assert.rejects(searchReadingWorkspace('月光', abort.signal), /abort/iu);
  await deleteDB('social-commons-reading');
});

test('搜索高亮跨格式与已有划线，偏移仍与原文一致，特殊字符只作文字', () => {
  const document = parsePlainArticle('🙂星河和月光，a+b[1]也只是文字。');
  const block = document.blocks[0];
  assert.ok('text' in block);
  const annotation = createAnnotation(document, block.id, 2, 6, 'highlight');
  const segments = readingTextSegments(
    { ...block, spans: [{ start: 3, end: 5, bold: true }] },
    [annotation],
    '星河',
  );
  assert.equal(segments.map((segment) => segment.text).join(''), block.text);
  assert.equal(
    segments
      .filter((segment) => segment.searched)
      .map((segment) => segment.text)
      .join(''),
    '星河',
  );
  assert.equal(
    segments
      .filter((segment) => segment.saved)
      .map((segment) => segment.text)
      .join(''),
    block.text.slice(2, 6),
  );
  assert.equal(firstSearchMatch(block.text, 'a+b[1]')?.start, block.text.indexOf('a+b[1]'));
  assert.equal(findInEntry(searchEntry(document, 'article'), '不存在'), null);
});

test('反馈草稿保存短输入和待确认请求，刷新可重用编号且不覆盖另一标签页', () => {
  const storage = new MemoryStorage();
  const fields = {
    kind: '使用问题' as const,
    page: '/reading',
    description: '写了两字',
    expected: '',
  };
  let raw = saveFeedbackDraft(storage, null, fields);
  assert.equal(parseFeedbackDraft(raw)?.fields.description, fields.description);
  fields.description = '搜索后的定位不正确';
  const request = {
    id: crypto.randomUUID(),
    fingerprint: JSON.stringify(normalizeFeedback(fields)),
  };
  raw = saveFeedbackDraft(storage, raw, fields, request);
  assert.deepEqual(parseFeedbackDraft(storage.getItem(FEEDBACK_DRAFT_KEY))?.request, request);
  const other = saveFeedbackDraft(storage, raw, { ...fields, description: '另一页面的反馈草稿' });
  assert.throws(() => saveFeedbackDraft(storage, raw, fields), /另一标签页/u);
  assert.equal(clearFeedbackDraft(storage, raw), false);
  assert.equal(storage.getItem(FEEDBACK_DRAFT_KEY), other);
  assert.equal(clearFeedbackDraft(storage, other), true);
  assert.equal(parseFeedbackDraft('{损坏'), null);
  storage.setItem(FEEDBACK_DRAFT_KEY, '{损坏');
  assert.throws(() => saveFeedbackDraft(storage, '{损坏', fields), /暂不覆盖/u);
});

test('反馈来路不被重复入口替换，新手指引完成或跳过后不重复自动打开', () => {
  assert.equal(
    feedbackLink('/feedback', '?page=%2Fquotes%2Fq82'),
    '/feedback?page=%2Fquotes%2Fq82',
  );
  assert.equal(
    feedbackLink('/feedback', '?page=https%3A%2F%2Fexample.com%2F%3Ftoken%3Dx'),
    '/feedback',
  );
  assert.equal(feedbackLink('/feedback', '?page=' + 'x'.repeat(1000)), '/feedback');
  const storage = new MemoryStorage();
  assert.equal(shouldOfferTour(storage), true);
  markTourSeen(storage);
  assert.equal(shouldOfferTour(storage), false);
  assert.equal(
    shouldOfferTour({
      getItem() {
        throw new Error('blocked');
      },
    }),
    false,
  );
});
