import test from 'node:test';
import assert from 'node:assert/strict';
import 'fake-indexeddb/auto';
import { openDB, deleteDB } from 'idb';
import { DAILY_KNOWLEDGE } from '../src/data/daily.ts';
import { dailyDocument } from '../src/features/reading/contentDocuments.ts';
import { createAnnotation, addAnnotation, summarize } from '../src/features/reading/model.ts';
import {
  saveGuestArticle,
  getGuestArticle,
  saveLocalReading,
  linkArticleToTopic,
  listReadingExcerpts,
  listGuestArticles,
} from '../src/features/reading/guestRepository.ts';
import {
  documentToEditor,
  editorToDocument,
} from '../src/features/reading/writing/editorDocument.ts';
import { composeDraft } from '../src/features/reading/writing/compose.ts';
import { newDraft } from '../src/features/reading/writing/model.ts';
import { saveDraft, getDraft, listDrafts } from '../src/features/reading/writing/repository.ts';
import { migrateLegacyDrafts } from '../src/features/reading/writing/legacyDrafts.ts';
import {
  isVerificationPage,
  SourceVerificationError,
} from '../src/features/reading/sourceAccess.ts';
import { parseArticleHtml } from '../src/features/reading/parseArticle.ts';
import { createExtractHandler } from '../server/extractArticle.ts';
import { KNOWLEDGE_GROUPS, knowledgeGroup } from '../src/data/knowledgeCategories.ts';
import { CURATED_COMMENTARIES } from '../src/data/curatedCommentaries.ts';
import { TOPIC_SPECIALS } from '../src/data/topicSpecials.ts';
import { commentaryTopics } from '../src/features/reading/commentaryTopics.ts';

const challengeHtml =
  '<html><head><title>环境异常</title></head><body><h1>环境异常</h1><p>当前环境异常，完成验证后即可继续访问。</p><a>去验证</a></body></html>';

test('验证拦截页在解析、API 和保存三层拒绝，正常讨论验证的文章不受影响', async (context) => {
  const url = 'https://mp.weixin.qq.com/s/uzknmLQp4i58rtVeR-K4pw';
  assert.throws(() => parseArticleHtml(challengeHtml, url), SourceVerificationError);
  context.mock.method(
    globalThis,
    'fetch',
    async () => new Response(challengeHtml, { headers: { 'content-type': 'text/html' } }),
  );
  const response = await createExtractHandler({})({
    httpMethod: 'POST',
    body: JSON.stringify({ url }),
  });
  assert.equal(response.statusCode, 422);
  assert.equal(JSON.parse(response.body).code, 'SOURCE_VERIFICATION_REQUIRED');
  const document = dailyDocument(DAILY_KNOWLEDGE[0]);
  document.title = '环境异常';
  document.blocks = [
    { id: 'b1', type: 'paragraph', text: '当前环境异常，完成验证后即可继续访问。去验证' },
  ];
  await assert.rejects(saveGuestArticle(document), SourceVerificationError);
  assert.throws(() => composeDraft([{ kind: 'article', document }]), SourceVerificationError);
  assert.equal(
    isVerificationPage(
      '从人机验证看无障碍设计',
      '用户需要完成验证后继续访问，设计应兼顾弱视群体。',
    ),
    false,
  );
});

test('V2 原位升级新增文稿存储，原正文、摘录、期限不变', async () => {
  await deleteDB('social-commons-reading');
  const document = dailyDocument(DAILY_KNOWLEDGE[0]);
  const record = {
    document,
    annotations: [createAnnotation(document, 'b1', 0, 3, 'highlight')],
    expiresAt: null,
    revision: 0,
  };
  const database = await openDB('social-commons-reading', 2, {
    upgrade(db) {
      db.createObjectStore('documents', { keyPath: 'document.id' }).createIndex(
        'by-url',
        'document.url',
      );
      db.createObjectStore('summaries', { keyPath: 'id' }).createIndex('by-expiry', 'expiresAt');
      db.createObjectStore('excerpts', { keyPath: 'key' }).createIndex('by-document', 'documentId');
    },
  });
  await database.put('documents', record);
  await database.put('summaries', summarize(record));
  database.close();
  const saved = await saveDraft(newDraft());
  assert.deepEqual(await getGuestArticle(document.id), record);
  assert.equal((await getDraft(saved.document.id))?.revision, 1);
});

test('专题关联保留划线并同步摘要、去重和长期保存', async () => {
  await deleteDB('social-commons-reading');
  const document = dailyDocument(DAILY_KNOWLEDGE[0]);
  const record = await saveGuestArticle(document);
  const annotated = await saveLocalReading(
    addAnnotation(record, createAnnotation(document, 'b1', 0, 3, 'highlight')),
  );
  await linkArticleToTopic(document.id, 'tech-ai', ['科技与AI']);
  const linked = await linkArticleToTopic(document.id, 'tech-ai', ['科技与AI']);
  assert.deepEqual(linked.annotations, annotated.annotations);
  assert.deepEqual(linked.topicIds, ['tech-ai']);
  assert.equal(linked.expiresAt, null);
  assert.deepEqual((await listGuestArticles())[0].topicIds, ['tech-ai']);
  assert.equal((await listReadingExcerpts()).length, 1);
});

test('编排只包含所选内容，保持顺序、出处、插图与节选提示，不修改原件', () => {
  const first = dailyDocument(DAILY_KNOWLEDGE[0]);
  const second = dailyDocument(DAILY_KNOWLEDGE[1]);
  first.completeness = 'partial';
  first.blocks.push({
    id: 'image',
    type: 'image',
    url: 'https://image.thepaper.cn/example.jpg',
    alt: '插图',
    caption: '图注',
  });
  const original = structuredClone(first);
  const draft = composeDraft([
    { kind: 'article', document: second },
    { kind: 'article', document: first },
  ]);
  assert.equal('text' in draft.document.blocks[0] && draft.document.blocks[0].text, second.title);
  assert.ok(JSON.stringify(draft).includes('【节选，非全文】'));
  assert.ok(JSON.stringify(draft).includes(first.url));
  assert.ok(JSON.stringify(draft).includes('图注'));
  assert.equal(JSON.stringify(draft).includes(DAILY_KNOWLEDGE[2].title), false);
  assert.notEqual(draft.document.id, first.id);
  assert.deepEqual(first, original);
});

test('编辑器往返保留格式、换行、列表编号和图片内容，拒绝可执行图片', () => {
  const document = dailyDocument(DAILY_KNOWLEDGE[0]);
  document.blocks = [
    { id: 'b1', type: 'heading', level: 2, alignment: 'center', text: '格式标题' },
    {
      id: 'b2',
      type: 'paragraph',
      text: '甲乙\n丙丁',
      spans: [
        { start: 0, end: 2, bold: true, underline: true, href: 'https://example.com/' },
        { start: 3, end: 5, italic: true, strike: true },
      ],
    },
    { id: 'b3', type: 'list-item', text: '从三开始', listOrder: 3 },
    { id: 'b4', type: 'list-item', text: '连续第四', listOrder: 4 },
    { id: 'b5', type: 'list-item', text: '重新编号', listOrder: 1 },
    { id: 'b6', type: 'quote', text: '引用' },
    {
      id: 'b7',
      type: 'image',
      url: 'https://image.thepaper.cn/example.jpg',
      alt: '插图',
      caption: '图注保留',
    },
  ];
  const result = editorToDocument(documentToEditor(document), document, '编辑后的标题');
  assert.equal(result.title, '编辑后的标题');
  assert.equal(result.blocks[0].type === 'heading' && result.blocks[0].alignment, 'center');
  assert.equal(
    JSON.stringify('text' in result.blocks[1] && result.blocks[1].spans),
    JSON.stringify('text' in document.blocks[1] && document.blocks[1].spans),
  );
  assert.deepEqual(
    result.blocks.filter((block) => block.type === 'list-item').map((block) => block.listOrder),
    [3, 4, 1],
  );
  assert.ok(JSON.stringify(result).includes('图注保留'));
  assert.throws(() =>
    editorToDocument(
      { type: 'doc', content: [{ type: 'image', attrs: { src: 'javascript:alert(1)' } }] },
      document,
      '非法图片',
    ),
  );
});

test('跨标签页文稿修订冲突拒绝覆盖；旧包迁移幂等并保留备注与编辑内容', async () => {
  await deleteDB('social-commons-reading');
  const saved = await saveDraft(newDraft());
  const edited = await saveDraft({
    ...saved,
    document: { ...saved.document, title: '先保存的内容' },
  });
  await assert.rejects(
    saveDraft({ ...saved, document: { ...saved.document, title: '过期标签页' } }),
    /另一个标签页/,
  );
  assert.equal((await getDraft(saved.document.id))?.document.title, edited.document.title);
  const groups = [
    {
      id: 'old',
      name: '原有素材',
      description: '我的说明',
      updatedAt: new Date().toISOString(),
      items: [{ key: 'missing', note: '珍贵的旧备注' }],
    },
  ];
  await migrateLegacyDrafts([], groups);
  const migrated = (await listDrafts()).find((item) => item.title === '原有素材')!;
  const draft = (await getDraft(migrated.id))!;
  assert.ok(JSON.stringify(draft).includes('珍贵的旧备注'));
  assert.ok(JSON.stringify(draft).includes('missing'));
  await saveDraft({ ...draft, document: { ...draft.document, title: '迁移后我自己改过' } });
  await migrateLegacyDrafts([], groups);
  assert.equal((await listDrafts()).length, 2);
  assert.equal((await getDraft(migrated.id))?.document.title, '迁移后我自己改过');
});

test('大类覆盖全部细学科；精选条目日期、URL、专题关联有效', () => {
  assert.equal(KNOWLEDGE_GROUPS.length, 5);
  for (const item of DAILY_KNOWLEDGE) assert.notEqual(knowledgeGroup(item.category), '其他');
  const topics = new Set(TOPIC_SPECIALS.map((item) => item.id));
  assert.equal(
    new Set(CURATED_COMMENTARIES.map((item) => item.id)).size,
    CURATED_COMMENTARIES.length,
  );
  assert.equal(
    new Set(CURATED_COMMENTARIES.map((item) => item.url)).size,
    CURATED_COMMENTARIES.length,
  );
  for (const item of CURATED_COMMENTARIES) {
    assert.match(item.publishedAt, /^2026-(07|08|09|10)-\d\d$/);
    assert.ok(item.publishedAt <= item.checkedAt);
    assert.ok(commentaryTopics(item).every((id) => topics.has(id)));
  }
});
