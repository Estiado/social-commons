import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  HeadingLevel,
  AlignmentType,
  ExternalHyperlink,
} from 'docx';
import type { ArticleDocument } from '../model';
import { loadExportImage } from './assets';
import { styledRuns } from '../writing/model';
import { DEFAULT_TYPOGRAPHY, DOCUMENT_FONTS } from '../typography';

export async function buildArticleDocx(
  article: ArticleDocument,
): Promise<{ blob: Blob; warnings: string[] }> {
  const warnings: string[] = [];
  const typography = article.typography || DEFAULT_TYPOGRAPHY;
  const children: Paragraph[] = [
    new Paragraph({
      text: article.title,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      text: [article.author, article.source, article.publishedAt].filter(Boolean).join(' · '),
      alignment: AlignmentType.CENTER,
    }),
  ];
  if (article.url)
    children.push(
      new Paragraph({
        children: [
          new TextRun('原文：'),
          new ExternalHyperlink({
            link: article.url,
            children: [new TextRun({ text: article.title, style: 'Hyperlink' })],
          }),
        ],
      }),
    );
  for (const warning of article.warnings)
    children.push(new Paragraph({ text: `导入核对提示：${warning}` }));
  let imageBytes = 0;
  for (const block of article.blocks) {
    if (block.type === 'image') {
      try {
        const image = await loadExportImage(block.url);
        imageBytes += image.bytes.byteLength;
        if (imageBytes > 20 * 1024 * 1024) throw new Error('本篇插图总量过大');
        const scale = Math.min(1, 580 / image.width, 650 / image.height);
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new ImageRun({
                type: 'png',
                data: image.bytes,
                transformation: {
                  width: Math.round(image.width * scale),
                  height: Math.round(image.height * scale),
                },
                altText: { title: block.alt, description: block.caption, name: block.id },
              }),
            ],
          }),
        );
      } catch {
        warnings.push(`插图未嵌入：${block.caption || block.alt || block.id}`);
        children.push(
          new Paragraph({
            children: [
              new TextRun('插图未能读取：'),
              new ExternalHyperlink({
                link: block.url,
                children: [
                  new TextRun({
                    text: block.caption || block.alt || '查看原文插图',
                    style: 'Hyperlink',
                  }),
                ],
              }),
            ],
          }),
        );
      }
      if (block.caption)
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: block.caption, size: 20, color: '666666' })],
          }),
        );
      continue;
    }
    children.push(
      new Paragraph({
        children: [
          ...(block.type === 'list-item'
            ? [new TextRun(block.listOrder ? `${block.listOrder}. ` : '• ')]
            : []),
          ...styledRuns(block).flatMap((run) =>
            run.text.split('\n').map((text, index) => {
              const value = new TextRun({
                text,
                break: index ? 1 : undefined,
                bold: run.bold,
                italics: run.italic,
                underline: run.underline ? {} : undefined,
                strike: run.strike,
                style: run.href ? 'Hyperlink' : undefined,
              });
              return run.href
                ? new ExternalHyperlink({ link: run.href, children: [value] })
                : value;
            }),
          ),
        ],
        alignment:
          block.alignment === 'center'
            ? AlignmentType.CENTER
            : block.alignment === 'right'
              ? AlignmentType.RIGHT
              : block.alignment === 'justify'
                ? AlignmentType.JUSTIFIED
                : AlignmentType.LEFT,
        heading:
          block.type === 'heading'
            ? [
                HeadingLevel.HEADING_1,
                HeadingLevel.HEADING_2,
                HeadingLevel.HEADING_3,
                HeadingLevel.HEADING_4,
              ][Math.max(0, (block.level || 2) - 1)]
            : undefined,
        indent: block.type === 'quote' ? { left: 360 } : undefined,
        spacing: { after: 160, line: Math.round(typography.lineHeight * 240) },
      }),
    );
  }
  children.push(new Paragraph({ text: '由社科通识导出 · 保留原文出处', spacing: { before: 240 } }));
  const document = new Document({
    creator: '社科通识',
    title: article.title,
    styles: {
      default: {
        document: {
          run: { font: DOCUMENT_FONTS[typography.font].word, size: typography.size * 2 },
        },
      },
      paragraphStyles: [
        {
          id: 'Title',
          name: 'Title',
          basedOn: 'Normal',
          run: { font: '黑体', size: 40, color: '222222', bold: true },
          paragraph: { spacing: { after: 240 } },
        },
        ...[32, 28, 26, 24].map((size, index) => ({
          id: `Heading${index + 1}`,
          name: `heading ${index + 1}`,
          basedOn: 'Normal',
          next: 'Normal',
          run: { font: '黑体', size, color: '222222', bold: true },
          paragraph: { keepNext: true, spacing: { before: 240, after: 120 } },
        })),
      ],
    },
    sections: [
      {
        properties: { page: { margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } },
        children,
      },
    ],
  });
  return { blob: await Packer.toBlob(document), warnings };
}
