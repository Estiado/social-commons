import type { JSONContent } from '@tiptap/core';
import {
  articleSchema,
  type ArticleBlock,
  type ArticleDocument,
  type TextBlock,
} from '../model.ts';
import { styledRuns } from './model.ts';

function inlineContent(block: TextBlock): JSONContent[] {
  return styledRuns(block).flatMap((run) => {
    const marks = [
      ...(run.bold ? [{ type: 'bold' }] : []),
      ...(run.italic ? [{ type: 'italic' }] : []),
      ...(run.underline ? [{ type: 'underline' }] : []),
      ...(run.strike ? [{ type: 'strike' }] : []),
      ...(run.href ? [{ type: 'link', attrs: { href: run.href } }] : []),
    ];
    return run.text
      .split('\n')
      .flatMap((text, index) => [
        ...(index ? [{ type: 'hardBreak' }] : []),
        ...(text ? [{ type: 'text', text, marks }] : []),
      ]);
  });
}

export function documentToEditor(article: ArticleDocument): JSONContent {
  const content: JSONContent[] = [];
  for (const block of article.blocks) {
    if (block.type === 'image') {
      content.push({ type: 'image', attrs: { src: block.url, alt: block.alt } });
      if (block.caption)
        content.push({ type: 'paragraph', content: [{ type: 'text', text: block.caption }] });
      continue;
    }
    const node: JSONContent = {
      type: block.type === 'heading' ? 'heading' : 'paragraph',
      attrs: { level: block.level || 2, textAlign: block.alignment || 'left' },
      content: inlineContent(block),
    };
    if (block.type === 'quote') content.push({ type: 'blockquote', content: [node] });
    else if (block.type === 'list-item') {
      const type = block.listOrder ? 'orderedList' : 'bulletList';
      const last = content.at(-1);
      const item = { type: 'listItem', content: [node] };
      const continuesNumbering =
        !block.listOrder ||
        Number(last?.attrs?.start || 1) + (last?.content?.length || 0) === block.listOrder;
      if (last?.type === type && continuesNumbering) last.content!.push(item);
      else
        content.push({
          type,
          attrs: block.listOrder ? { start: block.listOrder } : {},
          content: [item],
        });
    } else content.push(node);
  }
  return { type: 'doc', content };
}

function readInline(node: JSONContent) {
  let text = '';
  const spans: NonNullable<TextBlock['spans']> = [];
  for (const child of node.content || []) {
    const value = child.type === 'hardBreak' ? '\n' : child.text || '';
    const start = text.length;
    text += value;
    const marks = child.marks || [];
    if (value && marks.length) {
      const link = marks.find((mark) => mark.type === 'link')?.attrs?.href;
      spans.push({
        start,
        end: text.length,
        bold: marks.some((mark) => mark.type === 'bold') || undefined,
        italic: marks.some((mark) => mark.type === 'italic') || undefined,
        underline: marks.some((mark) => mark.type === 'underline') || undefined,
        strike: marks.some((mark) => mark.type === 'strike') || undefined,
        href: typeof link === 'string' && /^https?:\/\//i.test(link) ? link : undefined,
      });
    }
  }
  return { text: text || ' ', spans: spans.length ? spans : undefined };
}

/** Editor JSON is converted back to our validated document contract. No HTML is persisted. */
export function editorToDocument(json: JSONContent, original: ArticleDocument, title: string) {
  const blocks: ArticleBlock[] = [];
  const walk = (nodes: JSONContent[], quote = false, list?: { ordered: boolean; next: number }) => {
    for (const node of nodes) {
      if (node.type === 'image') {
        blocks.push({
          id: `b${blocks.length + 1}`,
          type: 'image',
          url: node.attrs?.src || '',
          alt: node.attrs?.alt || '',
          caption: '',
        });
      } else if (node.type === 'blockquote') walk(node.content || [], true);
      else if (node.type === 'bulletList' || node.type === 'orderedList')
        walk(node.content || [], quote, {
          ordered: node.type === 'orderedList',
          next: node.attrs?.start || 1,
        });
      else if (node.type === 'listItem') {
        // A multi-paragraph list item stays readable as consecutive numbered paragraphs.
        walk(node.content || [], quote, list);
      } else if (node.type === 'paragraph' || node.type === 'heading') {
        const alignment = node.attrs?.textAlign;
        blocks.push({
          id: `b${blocks.length + 1}`,
          type: list
            ? 'list-item'
            : node.type === 'heading'
              ? 'heading'
              : quote
                ? 'quote'
                : 'paragraph',
          ...readInline(node),
          level: node.type === 'heading' ? node.attrs?.level || 2 : undefined,
          alignment: ['left', 'center', 'right', 'justify'].includes(alignment)
            ? alignment
            : undefined,
          listOrder: list?.ordered ? list.next++ : undefined,
        });
      }
    }
  };
  walk(json.content || []);
  return articleSchema.parse({
    ...original,
    title: title.trim() || '未命名文稿',
    blocks: blocks.length ? blocks : [{ id: 'b1', type: 'paragraph', text: ' ' }],
  });
}
