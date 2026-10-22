import test from 'node:test';
import assert from 'node:assert/strict';
import { materialBackupSchema, mergeMaterials } from '../src/features/essay/materials.ts';
import { QUOTES } from '../src/data/quotes.ts';

test('素材恢复保留更新版本、不产生重复 ID，拒绝损坏的备份和非网页链接', () => {
  const old = {
    id: crypto.randomUUID(),
    conceptId: 'e1',
    title: '个人材料',
    content: '正文',
    source: '本人整理',
    sourceUrl: '',
    usageHint: '',
    updatedAt: '2026-10-21T00:00:00.000Z',
  };
  const next = { ...old, content: '修改后的正文', updatedAt: '2026-10-22T00:00:00.000Z' };
  assert.deepEqual(mergeMaterials([next], [old, next]), [next]);
  assert.throws(() =>
    materialBackupSchema.parse({
      schemaVersion: 1,
      materials: [{ ...old, sourceUrl: 'javascript:alert(1)' }],
    }),
  );
  assert.throws(() => materialBackupSchema.parse({ materials: [] }));
});

test('公开名句评析必须具有核验状态、具体来源页面与日期，不发布旧的匿名学者评述', () => {
  const ids = new Set(QUOTES.map((item) => item.id));
  assert.equal(ids.size, QUOTES.length);
  for (let index = 1; index <= 50; index++) assert.ok(ids.has(`q${index}`));
  for (const quote of QUOTES) {
    if (!quote.commentary) continue;
    assert.equal(quote.commentary.status, 'verified');
    assert.match(quote.commentary.url, /^https:\/\//);
    assert.match(quote.commentary.checkedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(!quote.commentary.commentator.includes('研究学者'));
  }
});
