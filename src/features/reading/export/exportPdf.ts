import { PDFDocument, rgb, degrees, type PDFFont } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import type { ArticleDocument } from '../model';
import { loadExportImage } from './assets';
import { styledRuns, type StyledRun } from '../writing/model';

export function wrapStyledPdfText(
  runs: StyledRun[],
  width: number,
  measure: (character: string) => number,
) {
  const lines: { runs: StyledRun[]; width: number }[] = [];
  let current: { runs: StyledRun[]; width: number } = { runs: [], width: 0 };
  const finish = () => {
    lines.push(current);
    current = { runs: [], width: 0 };
  };
  for (const run of runs) {
    let segment: StyledRun | undefined;
    for (const character of run.text.replace(/\r/g, '')) {
      if (character === '\n') {
        finish();
        segment = undefined;
        continue;
      }
      if (character.charCodeAt(0) < 32) continue;
      const size = measure(character);
      if (current.width && current.width + size > width) {
        finish();
        segment = undefined;
      }
      if (!segment) {
        segment = { ...run, text: '' };
        current.runs.push(segment);
      }
      segment.text += character;
      current.width += size;
    }
  }
  if (current.runs.length) lines.push(current);
  return lines;
}

/** Character widths are memoized per font size. Wrapping stays linear in the
 * article length, including Chinese text and long source URLs. */
export function wrapPdfText(
  text: string,
  width: number,
  measure: (character: string) => number,
): string[] {
  const lines: string[] = [];
  let line = '';
  let used = 0;
  for (const character of text.replace(/\r/g, '')) {
    if (character === '\n') {
      lines.push(line);
      line = '';
      used = 0;
      continue;
    }
    const size = measure(character);
    if (line && used + size > width) {
      lines.push(line);
      line = '';
      used = 0;
    }
    line += character;
    used += size;
  }
  if (line) lines.push(line);
  return lines;
}

export async function buildArticlePdf(
  article: ArticleDocument,
  fontBytes?: Uint8Array,
): Promise<{ bytes: Uint8Array; warnings: string[] }> {
  if (!fontBytes) {
    const response = await fetch('/fonts/NotoSansSC-Regular.ttf', {
      signal: AbortSignal.timeout(60_000),
    });
    if (!response.ok || response.headers.get('content-type')?.includes('text/html'))
      throw new Error('中文字体加载失败，请稍后重试');
    fontBytes = new Uint8Array(await response.arrayBuffer());
  }
  const document = await PDFDocument.create();
  document.registerFontkit(fontkit);
  // fontkit's CJK subsetting drops outlines in several PDF renderers. Embed the
  // static TrueType font intact so exported Chinese remains portable.
  const font = await document.embedFont(fontBytes, { subset: false });
  document.setTitle(article.title);
  document.setAuthor(article.author || article.source);
  document.setCreator('社科通识');
  const PAGE = { width: 595.28, height: 841.89, margin: 52 };
  const width = PAGE.width - PAGE.margin * 2;
  let page = document.addPage([PAGE.width, PAGE.height]);
  let y = PAGE.height - PAGE.margin;
  const widths = new Map<number, Map<string, number>>();
  const measure = (font: PDFFont, size: number) => {
    if (!widths.has(size)) widths.set(size, new Map());
    const cache = widths.get(size)!;
    return (character: string) => {
      if (!cache.has(character)) cache.set(character, font.widthOfTextAtSize(character, size));
      return cache.get(character)!;
    };
  };
  const space = (height: number) => {
    if (y - height < PAGE.margin + 18) {
      page = document.addPage([PAGE.width, PAGE.height]);
      y = PAGE.height - PAGE.margin;
    }
  };
  const drawText = (text: string, size = 11, muted = false, indent = 0) => {
    const printable = Array.from(text)
      .filter((character) => character === '\n' || character.charCodeAt(0) >= 32)
      .join('');
    const lines = wrapPdfText(printable, width - indent, measure(font, size));
    for (const line of lines) {
      space(size * 1.75);
      page.drawText(line, {
        x: PAGE.margin + indent,
        y: y - size,
        size,
        font,
        color: muted ? rgb(0.4, 0.4, 0.4) : rgb(0.12, 0.12, 0.12),
      });
      y -= size * 1.75;
    }
    y -= 7;
  };
  const drawStyled = (runs: StyledRun[], size: number, indent: number, alignment?: string) => {
    const advance = measure(font, size);
    for (const line of wrapStyledPdfText(runs, width - indent - 3, advance)) {
      space(size * 1.75);
      let x =
        PAGE.margin +
        indent +
        (alignment === 'center'
          ? (width - indent - line.width) / 2
          : alignment === 'right'
            ? width - indent - line.width
            : 0);
      for (const run of line.runs) {
        const options = {
          x,
          y: y - size,
          size,
          font,
          color: run.href ? rgb(0.2, 0.3, 0.6) : rgb(0.12, 0.12, 0.12),
          xSkew: degrees(run.italic ? 10 : 0),
        };
        page.drawText(run.text, options);
        // A small second pass preserves emphasis with the same portable CJK font.
        if (run.bold) page.drawText(run.text, { ...options, x: x + 0.25 });
        const length = Array.from(run.text).reduce((sum, char) => sum + advance(char), 0);
        for (const offset of [run.underline ? -1 : undefined, run.strike ? size * 0.35 : undefined])
          if (offset !== undefined)
            page.drawLine({
              start: { x, y: y - size + offset },
              end: { x: x + length, y: y - size + offset },
              thickness: 0.6,
              color: options.color,
            });
        x += length;
      }
      y -= size * 1.75;
    }
    y -= 7;
  };
  drawText(article.title, 20);
  drawText(
    [article.author, article.source, article.publishedAt].filter(Boolean).join(' · '),
    9,
    true,
  );
  if (article.url) drawText(`原文：${article.url}`, 9, true);
  for (const warning of article.warnings) drawText(`导入核对提示：${warning}`, 9, true);
  const warnings: string[] = [];
  let imageBytes = 0;
  for (const block of article.blocks) {
    if (block.type === 'image') {
      try {
        const image = await loadExportImage(block.url);
        imageBytes += image.bytes.byteLength;
        if (imageBytes > 20 * 1024 * 1024) throw new Error('本篇插图总量过大');
        const embedded = await document.embedPng(image.bytes);
        const scale = Math.min(1, width / image.width, 520 / image.height);
        const w = image.width * scale;
        const h = image.height * scale;
        space(h + 30);
        y -= h;
        page.drawImage(embedded, { x: (PAGE.width - w) / 2, y, width: w, height: h });
        y -= 10;
      } catch {
        warnings.push(`插图未嵌入：${block.caption || block.alt || block.id}`);
        drawText(`［插图未能读取，请参见原文：${block.url}］`, 9, true);
      }
      if (block.caption) drawText(block.caption, 9, true);
    } else {
      if (block.type === 'heading') space(65);
      drawStyled(
        [
          ...(block.type === 'list-item'
            ? [{ text: block.listOrder ? `${block.listOrder}. ` : '• ' }]
            : []),
          ...styledRuns(block),
        ],
        block.type === 'heading' ? Math.max(12, 18 - (block.level || 2)) : 11,
        block.type === 'quote' ? 18 : 0,
        block.alignment,
      );
    }
  }
  const pages = document.getPages();
  pages.forEach((page, index) =>
    page.drawText(`${index + 1} / ${pages.length} · 社科通识`, {
      x: PAGE.margin,
      y: 30,
      size: 8,
      font,
      color: rgb(0.5, 0.5, 0.5),
    }),
  );
  return { bytes: await document.save(), warnings };
}
