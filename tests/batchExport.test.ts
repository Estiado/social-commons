import test from 'node:test';
import assert from 'node:assert/strict';
import { strFromU8, unzipSync } from 'fflate';
import {
  createReadingArchives,
  safeExportName,
} from '../src/features/reading/export/batchArchive.ts';
import { parsePlainArticle } from '../src/features/reading/parseArticle.ts';

test('批量导出遍历全部条目、重名不覆盖、分卷保留摘录及失败清单', async () => {
  const sources = ['one', 'missing', 'two'].map((id) => ({
    id,
    title: '../同名文章',
    storage: 'guest' as const,
  }));
  const document = parsePlainArticle('这是一段用于批量导出验证的正文。');
  const record = {
    document,
    annotations: [{ text: '个人摘录' }],
    revision: 0,
    expiresAt: Date.now() + 10000,
  };
  const parts: Uint8Array[] = [];
  const progress: number[] = [];
  const result = await createReadingArchives(
    sources,
    'docx',
    {
      load: async ({ id }) => (id === 'missing' ? undefined : (record as never)),
      render: async () => ({ bytes: new Uint8Array(100), warnings: ['图片未嵌入'] }),
      writePart: (bytes) => {
        parts.push(bytes);
      },
      progress: (done) => {
        progress.push(done);
      },
      signal: new AbortController().signal,
    },
    1000,
  );
  assert.equal(result.exported, 2);
  assert.equal(result.failed, 1);
  assert.equal(parts.length, 2);
  assert.deepEqual(progress, [1, 2, 3]);
  const archives = parts.map((part) => unzipSync(part));
  assert.equal(
    archives.flatMap((part) => Object.keys(part)).filter((key) => key.endsWith('.docx')).length,
    2,
  );
  const backup = Object.entries(archives[0]).find(([key]) => key.endsWith('文章与摘录.json'))!;
  assert.ok(strFromU8(backup[1]).includes('个人摘录'));
  const manifest = JSON.parse(strFromU8(archives[1]['导出清单.json']));
  assert.equal(manifest.final, true);
  assert.equal(manifest.results.length, 3);
  assert.equal(manifest.results[1].status, 'failed');
  assert.ok(!safeExportName('../../file').includes('/'));
});

test('取消导出不会继续读取其他正文或生成新的下载', async () => {
  const controller = new AbortController();
  controller.abort();
  let reads = 0;
  await assert.rejects(
    createReadingArchives([{ id: 'a', title: 'a', storage: 'guest' }], 'json', {
      load: async () => {
        reads++;
        return undefined;
      },
      render: async () => ({ bytes: new Uint8Array(), warnings: [] }),
      writePart: () => {
        throw new Error('must not download');
      },
      progress: () => {},
      signal: controller.signal,
    }),
    { name: 'AbortError' },
  );
  assert.equal(reads, 0);
});

test('整库 ZIP 包含素材包关系及备注备份', async () => {
  const document = parsePlainArticle('整库导出需要保留文章与素材包的联系。');
  const backup = {
    schemaVersion: 1,
    collections: [
      {
        id: 'lesson',
        name: '教学主题',
        items: [{ key: 'document:annotation', note: '用于课堂讨论' }],
      },
    ],
  };
  let archive: Uint8Array | undefined;
  await createReadingArchives(
    [{ id: document.id, title: document.title, storage: 'guest' }],
    'json',
    {
      extraFiles: { '阅读空间素材包.json': new TextEncoder().encode(JSON.stringify(backup)) },
      load: async () => ({ document, annotations: [], revision: 0, expiresAt: null }),
      render: async () => {
        throw new Error('JSON 不应生成排版文件');
      },
      writePart: (bytes) => {
        archive = bytes;
      },
      progress: () => {},
      signal: new AbortController().signal,
    },
  );
  assert.deepEqual(JSON.parse(strFromU8(unzipSync(archive!)['阅读空间素材包.json'])), backup);
});
