import test from 'node:test';
import assert from 'node:assert/strict';
import 'fake-indexeddb/auto';
import { deleteDB } from 'idb';
import { parseArticleHtml, parsePlainArticle } from '../src/features/reading/parseArticle.ts';
import { addAnnotation, createAnnotation, canonicalArticleUrl, GUEST_RETENTION_MS, isPartialArticle, prepareArticleExport } from '../src/features/reading/model.ts';
import { getGuestArticle, listGuestArticles, saveGuestArticle, saveLocalReading } from '../src/features/reading/guestRepository.ts';

test('富文本保留短段落、标题、图片和图注的顺序，并去除执行内容', () => {
  const article = parseArticleHtml('<h1>完整标题 - 保留副标题</h1><article><h2>第一节</h2><p>短句。</p><p>前文<img src="/photo.png" onerror="alert(1)">后文</p><figure><img src="/figure.png"><figcaption>这是真实图注</figcaption></figure><script>bad()</script><p>最后一段需要保留完整顺序，不能因为正文较短就丢掉。</p></article>', 'https://thepaper.cn/article');
  assert.equal(article.title, '完整标题 - 保留副标题');
  assert.deepEqual(article.blocks.map((item) => item.type), ['heading', 'paragraph', 'paragraph', 'image', 'paragraph', 'image', 'paragraph']);
  assert.equal(article.blocks[5].type === 'image' && article.blocks[5].caption, '这是真实图注');
  assert.ok(!JSON.stringify(article).includes('bad()'));
  assert.ok(!JSON.stringify(article).includes('onerror'));
});

test('纯文本中的 HTML 字符按文字显示，不执行或丢失', () => {
  const article = parsePlainArticle('第一段。\n<script>alert(1)</script>\n最后一段。');
  assert.equal(article.blocks[1].type !== 'image' && article.blocks[1].text, '<script>alert(1)</script>');
});

test('正文容器外的登录阅读提示也会把南方周末预览标为节选，导出不能冒充全文', () => {
  const article = parseArticleHtml('<h1>对奇葩投诉说不</h1><div class="nfzm-content__fulltext"><p>这只是可见的第一段，正文必须保持清晰，不能把短预览误称为文章全文。</p><p>这里是第二段。</p></div><aside>登录获取更多阅读权限</aside>', 'https://www.infzm.com/contents/343016');
  assert.equal(article.blocks.length, 2); assert.equal(isPartialArticle(article), true);
  assert.match(prepareArticleExport(article).title, /节选，非全文/);
  assert.ok(prepareArticleExport(article).warnings.some((warning) => warning.includes('不是文章全文')));
});

test('人民日报可见署名覆盖错误模板日期，澎湃使用实际正文容器', () => {
  const article = parseArticleHtml('<meta name="author" content="第005版"><meta name="publishdate" content="2013-07-17"><h1>报道标题</h1><p class="sec">李铭轩 《人民日报》（2026年10月21日 第05版）</p><div id="ozoom"><p>应当保留的文章正文，作者与日期以报纸显示为准，避免静态模板元信息误导读者。</p><p>第二个足够长的正文段落，保证容器可以被识别。</p></div>', 'https://paper.people.com.cn/rmrb/pc/content/202610/21/a.html');
  assert.equal(article.author, '李铭轩'); assert.equal(article.publishedAt, '2026-10-21'); assert.equal(article.source, '人民日报');
  const paper = parseArticleHtml('<p>导航噪声</p><div class="cententWrap__dynamic"><p>真正正文应当单独识别，避免导航文字或者推荐列表混入文章。这里还需要一些正文长度，让内容满足识别条件。</p></div><p>推荐内容</p>', 'https://thepaper.cn/article');
  assert.equal(paper.blocks.length, 1);
  assert.ok(!JSON.stringify(paper.blocks).includes('导航噪声'));
});

test('划线记录准确偏移、同文不同位置，以及内容版本；重复保存幂等', () => {
  const document = parsePlainArticle('重复文字，重复文字。');
  const record = { document, annotations: [], expiresAt: null, revision: 1 };
  const first = createAnnotation(document, 'b1', 0, 4, 'highlight');
  const second = createAnnotation(document, 'b1', 5, 9, 'highlight');
  const saved = addAnnotation(addAnnotation(addAnnotation(record, first), first), second);
  assert.equal(saved.annotations.length, 2);
  assert.equal(second.text, '重复文字');
  assert.throws(() => createAnnotation(document, 'b1', -1, 2, 'highlight'));
  assert.throws(() => addAnnotation(record, { ...first, contentVersion: crypto.randomUUID() }));
});

test('访客重复导入只在本浏览器去重，七天到期后正文与目录均移除', async (context) => {
  await deleteDB('social-commons-reading');
  let clock = Date.now(); context.mock.method(Date, 'now', () => clock);
  const article = parsePlainArticle('用于测试访客保存期限的正文。');
  article.url = canonicalArticleUrl('https://thepaper.cn/article?utm_source=x#anchor');
  const saved = await saveGuestArticle(article);
  const duplicate = await saveGuestArticle({ ...article, id: crypto.randomUUID() });
  assert.equal(saved.document.id, duplicate.document.id);
  assert.equal((await listGuestArticles()).length, 1);
  assert.equal(saved.expiresAt, clock + GUEST_RETENTION_MS);
  clock += GUEST_RETENTION_MS - 1;
  assert.ok(await getGuestArticle(saved.document.id));
  clock += 1;
  assert.equal(await getGuestArticle(saved.document.id), undefined);
  assert.deepEqual(await listGuestArticles(), []);
});

test('补全文可替换同链接的本机节选，不延长七天期限', async () => {
  await deleteDB('social-commons-reading');
  const article = parsePlainArticle('短节选。'); article.url = 'https://www.infzm.com/contents/test'; article.completeness = 'partial';
  const saved = await saveGuestArticle(article);
  const full = parsePlainArticle('导入者自行粘贴并核对的完整正文。'); full.url = article.url; full.completeness = 'user-confirmed';
  const completed = await saveGuestArticle(full);
  assert.equal(completed.document.id, saved.document.id);
  assert.equal(completed.expiresAt, saved.expiresAt);
  assert.equal(completed.document.completeness, 'user-confirmed');
  assert.equal(completed.document.blocks[0].type !== 'image' && completed.document.blocks[0].text, '导入者自行粘贴并核对的完整正文。');
});

test('本机收藏无需账号、长期保留，陈旧标签页不能覆盖新摘录', async (context) => {
  await deleteDB('social-commons-reading');
  const document = parsePlainArticle('这篇文章需要在本机长期收藏。');
  const imported = await saveGuestArticle(document);
  const annotation = createAnnotation(document, 'b1', 0, 4, 'highlight');
  const saved = await saveLocalReading(addAnnotation(imported, annotation));
  assert.equal(saved.expiresAt, null); assert.equal(saved.annotations.length, 1);
  await assert.rejects(saveLocalReading(imported), /另一个标签页/);
  const future = Date.now() + GUEST_RETENTION_MS + 1;
  context.mock.method(Date, 'now', () => future);
  assert.equal((await getGuestArticle(document.id))?.annotations.length, 1);
  assert.equal((await listGuestArticles()).length, 1);
});
