import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  EDITORIAL_FILE,
  generateEditorialContent,
  parseEditorialCopy,
} from '../scripts/editorial-content.ts';
import { GUANLAN_EVENTS } from '../src/data/guanlan/catalogue.ts';
import { getGuanlanEvent } from '../src/data/guanlan/index.ts';
import { guanlanEventDocument } from '../src/features/guanlan/eventDocument.ts';

const block = (group: string, key: string, text: string) =>
  `<!-- copy: ${group}#${key} -->\n${text}\n<!-- /copy -->\n`;

test('编辑稿保留段落、换行与原文字符，重复编号和损坏标记明确报错', () => {
  const text =
    '第一段：引号“保留”，不是代码。\n\n第二段含有 <script> 标签和 `符号`，按文字保存。\n';
  const parsed = parseEditorialCopy(
    '# 编辑稿\n' + block('knowledge/youthStudies', 'd101.content', text).replace(/\n/g, '\r\n'),
  );
  assert.equal(parsed.get('knowledge/youthStudies')?.['d101.content'], text);
  for (const invalid of [
    block('daily', 'one', '正文') + block('daily', 'one', '重复'),
    '<!-- copy: daily#one -->\n没有结束',
    '<!-- /copy -->',
    '<!-- copy: daily#one -->\n<!-- copy: daily#two -->',
    block('../escape', 'one', '正文'),
    block('daily', 'one', '   '),
    '<!-- copy daily#one -->\n正文\n<!-- /copy -->',
  ])
    assert.throws(() => parseEditorialCopy(invalid), /编辑稿/u);
});

test('修改一份正文文件即可生成新内容；格式换行和注释不干扰编号校验', async (t) => {
  const artifactRoot = path.resolve('.artifacts');
  await mkdir(artifactRoot, { recursive: true });
  const root = await mkdtemp(path.join(artifactRoot, 'test-editorial-'));
  t.after(async () => {
    assert.equal(path.dirname(path.resolve(root)), artifactRoot);
    await rm(root, { recursive: true, force: true });
  });
  await mkdir(path.join(root, 'src/data'), { recursive: true });
  await mkdir(path.join(root, 'content'), { recursive: true });
  await writeFile(
    path.join(root, 'src/data/daily.ts'),
    `import { EDITORIAL, paragraphCopy } from '../../.artifacts/editorial/daily.ts';
// EDITORIAL['this-comment-is-not-a-reference']
const text = EDITORIAL[
 'd1.content'
];
const paragraphs = paragraphCopy('d1.paragraphs');`,
  );
  const original =
    block('daily', 'd1.content', '可以直接编辑的正文。') +
    block('daily', 'd1.paragraphs', '第一段。\n\n第二段。');
  await writeFile(path.join(root, EDITORIAL_FILE), original);
  const result = await generateEditorialContent(root);
  assert.equal(result.entries, 2);
  const output = path.join(root, '.artifacts/editorial/daily.ts');
  const first = await import(pathToFileURL(output).href + '?version=first');
  assert.equal(first.EDITORIAL['d1.content'], '可以直接编辑的正文。');
  assert.deepEqual(first.paragraphCopy('d1.paragraphs'), ['第一段。', '第二段。']);
  assert.deepEqual((await generateEditorialContent(root)).changed, []);
  await writeFile(
    path.join(root, EDITORIAL_FILE),
    original.replace('可以直接编辑的正文。', '用户修改后的正文。'),
  );
  assert.equal((await generateEditorialContent(root)).changed.length, 1);
  const second = await import(pathToFileURL(output).href + '?version=second');
  assert.equal(second.EDITORIAL['d1.content'], '用户修改后的正文。');
  const validOutput = await readFile(output, 'utf8');
  for (const invalid of [
    block('daily', 'd1.content', '漏了另一个字段。'),
    original + block('daily', 'unused', '没有登记的新编号。'),
    block('other', 'one', '删除了daily整组。'),
  ]) {
    await writeFile(path.join(root, EDITORIAL_FILE), invalid);
    await assert.rejects(generateEditorialContent(root), /编辑稿/u);
    assert.equal(await readFile(output, 'utf8'), validOutput);
  }
});

test('观澜全部资料均有可收藏的多段提要，阅读正文与导出模型包含相同文字', async () => {
  const copy = parseEditorialCopy(await readFile(EDITORIAL_FILE, 'utf8'));
  assert.ok([...copy.values()].reduce((sum, group) => sum + Object.keys(group).length, 0) >= 620);
  let count = 0;
  for (const summary of GUANLAN_EVENTS) {
    const event = (await getGuanlanEvent(summary.id))!;
    const document = guanlanEventDocument(event);
    for (const source of event.sources) {
      count++;
      assert.ok(source.digest.length >= 2, source.id);
      assert.ok(source.digest.join('').length >= 150, source.id);
      for (const paragraph of source.digest)
        assert.ok(
          document.blocks.some((block) => block.type === 'paragraph' && block.text === paragraph),
        );
    }
  }
  assert.equal(count, 48);
});
