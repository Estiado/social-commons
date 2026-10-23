import type { TextBlock } from './model.ts';

type ReferenceBlock = Omit<TextBlock, 'id'>;

export function provenanceParagraph(item: {
  title: string;
  author?: string;
  source: string;
  url: string;
}): ReferenceBlock {
  const prefix = `出处：${[item.author, item.source].filter(Boolean).join(' · ') || item.title}`;
  return item.url
    ? referenceParagraph(item.title, item.url, prefix + '\n原文：')
    : { type: 'paragraph', text: prefix };
}

/** Store the readable title in the document itself, so selection offsets and
 * Word exports agree with what the reader sees. Never shorten saved user text. */
export function referenceParagraph(title: string, url: string, prefix = ''): ReferenceBlock {
  return {
    type: 'paragraph',
    text: prefix + title,
    spans: [{ start: prefix.length, end: prefix.length + title.length, href: url }],
  };
}

/** Older catalogue sources put citations and URLs in one string. Convert them
 * before making a reading snapshot; existing private documents remain intact. */
export function nameCatalogueReferences(block: ReferenceBlock): ReferenceBlock {
  if (block.spans?.length || !/https?:\/\//u.test(block.text)) return block;
  const spans: NonNullable<TextBlock['spans']> = [];
  let text = '';
  let position = 0;
  for (const match of block.text.matchAll(/https?:\/\/[^\s<>“”「」]+/gu)) {
    const before = block.text.slice(position, match.index);
    const url = match[0].replace(/[。，；;）)]+$/u, '');
    const trailing = match[0].slice(url.length);
    const label = before.replace(/[\s。；;：:，,]+$/u, '').trim();
    // A short bibliographic description is already a useful title. Long prose
    // stays prose, followed by a compact source link.
    if (label && label.length <= 300) {
      const start = text.length;
      text += label;
      spans.push({ start, end: text.length, href: url });
    } else {
      text += before;
      const start = text.length;
      text += '阅读参考资料';
      spans.push({ start, end: text.length, href: url });
    }
    text += trailing;
    position = match.index! + match[0].length;
  }
  text += block.text.slice(position);
  return { ...block, text, spans };
}
