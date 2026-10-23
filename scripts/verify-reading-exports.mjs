import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { build } from 'vite';
import { parseArticleHtml } from '../src/features/reading/parseArticle.ts';
import { PDFDocument, PDFName } from 'pdf-lib';
import { unzipSync, strFromU8 } from 'fflate';

await build({
  configFile: false,
  publicDir: false,
  build: {
    lib: {
      entry: {
        pdf: 'src/features/reading/export/exportPdf.ts',
        word: 'src/features/reading/export/exportDocx.ts',
      },
      formats: ['es'],
      fileName: (_format, name) => `${name}.mjs`,
    },
    outDir: '.artifacts/reading-export-build',
    emptyOutDir: true,
    minify: true,
  },
});
const article = parseArticleHtml(
  `<article><h1>中文导出验收：标题与出处</h1><h2>第一节：段落与分页</h2>${Array.from({ length: 45 }, (_, index) => `<p>第${index + 1}段：这是用于验证中文字体、段落顺序、自动换行与跨页排版的测试文字。${'需要保证导出的文字可以选择和复制。'.repeat(6)}</p>`).join('')}</article>`,
  'https://thepaper.cn/verification',
);
article.author = '测试作者';
article.source = '本地合成验收文章';
article.publishedAt = '2026-10-21';
article.typography = { font: 'yahei', size: 14, lineHeight: 2 };
article.blocks.unshift({
  id: 'rich-format',
  type: 'paragraph',
  text: '加粗下划线与编辑后文字',
  alignment: 'right',
  spans: [
    { start: 0, end: 5, bold: true, underline: true },
    { start: 6, end: 11, italic: true, strike: true, href: 'https://example.com/source' },
  ],
});
const { buildArticlePdf, wrapPdfText, wrapStyledPdfText } = await import(
  '../.artifacts/reading-export-build/pdf.mjs'
);
assert.deepEqual(
  wrapPdfText('甲乙丙\n丁', 2, () => 1),
  ['甲乙', '丙', '丁'],
);
assert.deepEqual(
  wrapPdfText('甲乙。丙丁', 2, () => 1),
  ['甲', '乙。', '丙丁'],
);
const styledLines = wrapStyledPdfText(
  [{ text: '甲乙' }, { text: '。', bold: true }, { text: '丙' }],
  2,
  () => 1,
);
assert.deepEqual(
  styledLines.map((line) => line.runs.map((run) => run.text).join('')),
  ['甲', '乙。', '丙'],
);
assert.equal(styledLines[1].runs.at(-1).bold, true);
const font = new Uint8Array(await readFile('public/fonts/NotoSansSC-Regular.ttf'));
const pdf = await buildArticlePdf(article, font);
const parsed = await PDFDocument.load(pdf.bytes);
assert.ok(parsed.getPageCount() > 1);
assert.equal(parsed.getTitle(), article.title);
assert.ok(pdf.bytes.byteLength > 1000);
const destinations = parsed.getPages().flatMap((page) =>
  (page.node.Annots()?.asArray() || []).flatMap((ref) => {
    const annotation = parsed.context.lookup(ref);
    const action = annotation.get(PDFName.of('A'));
    const uri = action?.get(PDFName.of('URI'));
    return uri ? [uri.decodeText()] : [];
  }),
);
assert.ok(destinations.includes('https://example.com/source'));
assert.ok(destinations.includes(article.url));
const { buildArticleDocx } = await import('../.artifacts/reading-export-build/word.mjs');
const word = await buildArticleDocx(article);
const wordBytes = new Uint8Array(await word.blob.arrayBuffer());
const parts = unzipSync(wordBytes);
const xml = strFromU8(parts['word/document.xml']);
const stylesXml = strFromU8(parts['word/styles.xml']);
assert.ok(stylesXml.includes('微软雅黑'));
assert.ok(stylesXml.includes('w:sz w:val="28"'));
assert.ok(xml.includes('w:line="480"'));
for (const expected of [
  '加粗下划线',
  '编辑后文字',
  '<w:b',
  '<w:u',
  '<w:i',
  '<w:strike',
  'w:val="right"',
])
  assert.ok(xml.includes(expected), expected);
assert.ok(strFromU8(parts['word/_rels/document.xml.rels']).includes('https://example.com/source'));
await mkdir('.artifacts/export-verification', { recursive: true });
await writeFile('.artifacts/export-verification/reading.pdf', pdf.bytes);
await writeFile('.artifacts/export-verification/reading.docx', wordBytes);
console.log(
  `Exports built: PDF ${parsed.getPageCount()} pages, ${pdf.bytes.byteLength} bytes; DOCX ${word.blob.size} bytes. Layout needs visual verification separately.`,
);
