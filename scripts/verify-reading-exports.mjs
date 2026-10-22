import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { build } from 'vite';
import { parseArticleHtml } from '../src/features/articles/parseArticle.ts';
import { PDFDocument } from 'pdf-lib';

await build({ configFile: false, publicDir: false, build: {
  lib: { entry: { pdf: 'src/features/articles/export/exportPdf.ts', word: 'src/features/articles/export/exportDocx.ts' }, formats: ['es'], fileName: (_format, name) => `${name}.mjs` },
  outDir: '.artifacts/reading-export-build', emptyOutDir: true, minify: true,
} });
const article = parseArticleHtml(`<article><h1>中文导出验收：标题与出处</h1><h2>第一节：段落与分页</h2>${Array.from({ length: 45 }, (_, index) => `<p>第${index + 1}段：这是用于验证中文字体、段落顺序、自动换行与跨页排版的测试文字。${'需要保证导出的文字可以选择和复制。'.repeat(6)}</p>`).join('')}</article>`, 'https://thepaper.cn/verification');
article.author = '测试作者'; article.source = '本地合成验收文章'; article.publishedAt = '2026-10-21';
const { buildArticlePdf, wrapPdfText } = await import('../.artifacts/reading-export-build/pdf.mjs');
assert.deepEqual(wrapPdfText('甲乙丙\n丁', 2, () => 1), ['甲乙', '丙', '丁']);
const font = new Uint8Array(await readFile('public/fonts/NotoSansSC-Regular.ttf'));
const pdf = await buildArticlePdf(article, font);
const parsed = await PDFDocument.load(pdf.bytes);
assert.ok(parsed.getPageCount() > 1);
assert.equal(parsed.getTitle(), article.title);
assert.ok(pdf.bytes.byteLength > 1000);
const { buildArticleDocx } = await import('../.artifacts/reading-export-build/word.mjs');
const word = await buildArticleDocx(article);
await mkdir('.artifacts/export-verification', { recursive: true });
await writeFile('.artifacts/export-verification/reading.pdf', pdf.bytes);
await writeFile('.artifacts/export-verification/reading.docx', new Uint8Array(await word.blob.arrayBuffer()));
console.log(`Exports built: PDF ${parsed.getPageCount()} pages, ${pdf.bytes.byteLength} bytes; DOCX ${word.blob.size} bytes. Layout needs visual verification separately.`);
