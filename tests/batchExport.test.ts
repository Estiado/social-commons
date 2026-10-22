import test from 'node:test';
import assert from 'node:assert/strict';
import { strFromU8, unzipSync } from 'fflate';
import { createReadingArchives, safeExportName } from '../src/features/articles/export/batchArchive.ts';
import { parsePlainArticle } from '../src/features/articles/parseArticle.ts';

test('批量导出遍历全部条目、重名不覆盖、分卷保留摘录及失败清单', async () => {
  const sources = ['one', 'missing', 'two'].map((id) => ({ id, title: '../同名文章', storage: 'guest' as const }));
  const document = parsePlainArticle('这是一段用于批量导出验证的正文。');
  const record = { document, annotations: [{ text: '个人摘录' }], revision: 0, expiresAt: Date.now() + 10000 };
  const parts: Uint8Array[] = []; const progress: number[] = [];
  const result = await createReadingArchives(sources, 'docx', {
    load: async ({ id }) => id === 'missing' ? undefined : record as never,
    render: async () => ({ bytes: new Uint8Array(100), warnings: ['图片未嵌入'] }),
    writePart: (bytes) => { parts.push(bytes); }, progress: (done) => { progress.push(done); }, signal: new AbortController().signal,
  }, 1000);
  assert.equal(result.exported, 2); assert.equal(result.failed, 1); assert.equal(parts.length, 2);
  assert.deepEqual(progress, [1, 2, 3]);
  const archives = parts.map((part) => unzipSync(part));
  assert.equal(archives.flatMap((part) => Object.keys(part)).filter((key) => key.endsWith('.docx')).length, 2);
  const backup = Object.entries(archives[0]).find(([key]) => key.endsWith('文章与摘录.json'))!;
  assert.ok(strFromU8(backup[1]).includes('个人摘录'));
  const manifest = JSON.parse(strFromU8(archives[1]['导出清单.json']));
  assert.equal(manifest.final, true); assert.equal(manifest.results.length, 3);
  assert.equal(manifest.results[1].status, 'failed');
  assert.ok(!safeExportName('../../file').includes('/'));
});

test('取消导出不会继续读取其他正文或生成新的下载', async () => {
  const controller = new AbortController(); controller.abort(); let reads = 0;
  await assert.rejects(createReadingArchives([{ id: 'a', title: 'a', storage: 'guest' }], 'json', {
    load: async () => { reads++; return undefined; }, render: async () => ({ bytes: new Uint8Array(), warnings: [] }),
    writePart: () => { throw new Error('must not download'); }, progress: () => {}, signal: controller.signal,
  }), { name: 'AbortError' });
  assert.equal(reads, 0);
});
