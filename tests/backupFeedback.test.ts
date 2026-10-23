import test from 'node:test';
import assert from 'node:assert/strict';
import 'fake-indexeddb/auto';
import { deleteDB } from 'idb';
import { parsePlainArticle } from '../src/features/reading/parseArticle.ts';
import { createAnnotation, addAnnotation } from '../src/features/reading/model.ts';
import {
  saveGuestArticle,
  saveLocalReading,
  getGuestArticle,
  listReadingExcerpts,
} from '../src/features/reading/guestRepository.ts';
import { newDraft } from '../src/features/reading/writing/model.ts';
import { saveDraft, getDraft } from '../src/features/reading/writing/repository.ts';
import { createReadingBackup, restoreReadingBackup } from '../src/features/reading/backup.ts';
import { feedbackReport } from '../src/features/feedback/report.ts';

test('阅读备份可恢复正文、划线与文稿，重复恢复不覆盖已有编辑', async () => {
  await deleteDB('social-commons-reading');
  const document = parsePlainArticle(
    '用于验证备份与恢复的连续正文，既有划线必须仍然对应相同文字。',
  );
  let record = await saveGuestArticle(document);
  record = await saveLocalReading(
    addAnnotation(record, createAnnotation(document, document.blocks[0].id, 0, 8, 'highlight')),
  );
  const draft = await saveDraft(newDraft(document));
  const backup = await (await createReadingBackup()).text();
  await deleteDB('social-commons-reading');
  assert.deepEqual(await restoreReadingBackup(backup), { restored: 2, skipped: 0 });
  assert.deepEqual((await getGuestArticle(document.id))?.annotations, record.annotations);
  assert.equal((await listReadingExcerpts())[0].text, record.annotations[0].text);
  const restored = (await getDraft(draft.document.id))!;
  await saveDraft({ ...restored, document: { ...restored.document, title: '本机后续编辑' } });
  assert.deepEqual(await restoreReadingBackup(backup), { restored: 0, skipped: 2 });
  assert.equal((await getDraft(draft.document.id))?.document.title, '本机后续编辑');
  const invalid = JSON.parse(backup);
  invalid.documents[0].annotations[0].text = '伪造划线';
  invalid.documents[0].document.id = crypto.randomUUID();
  await assert.rejects(restoreReadingBackup(JSON.stringify(invalid)), /不是有效/u);
  assert.equal(await getGuestArticle(invalid.documents[0].document.id), undefined);
  const unsafe = JSON.parse(backup);
  unsafe.drafts[0].document.blocks[0].spans = [{ start: 0, end: 2, href: 'javascript:alert(1)' }];
  await assert.rejects(restoreReadingBackup(JSON.stringify(unsafe)));
  const expired = JSON.parse(backup);
  expired.documents[0].document.id = crypto.randomUUID();
  expired.documents[0].expiresAt = 1;
  assert.deepEqual(await restoreReadingBackup(JSON.stringify(expired)), {
    restored: 0,
    skipped: 2,
  });
  await deleteDB('social-commons-reading');
});

test('反馈文件只含主动填写的信息，移除链接中的查询和片段', () => {
  const report = feedbackReport(
    {
      kind: '使用问题',
      description: '手机搜索后看不见结果',
      expected: '滚动到结果',
      page: '/essay?private=value#anchor',
      unknown: '不应带入',
    },
    '2026-10-23T00:00:00Z',
  );
  assert.match(report, /页面：\/essay\n/u);
  assert.doesNotMatch(report, /private|unknown|anchor|不应带入/u);
  assert.throws(() =>
    feedbackReport({ kind: '使用问题', description: '太短', page: '', expected: '' }),
  );
  assert.doesNotMatch(
    feedbackReport({
      kind: '内容纠错',
      description: '引用来源错误了',
      page: 'https://example.com/?token=secret',
      expected: '',
    }),
    /example|secret/u,
  );
});
