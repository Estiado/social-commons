import type { EventSection, GuanlanEvent } from '../../data/guanlan/types.ts';
import { createContentDocument, contentUrl } from '../reading/contentDocuments.ts';
import { referenceParagraph } from '../reading/references.ts';
import type { TextBlock } from '../reading/model.ts';

type Block = Omit<TextBlock, 'id'>;
const paragraph = (text: string): Block => ({ type: 'paragraph', text });
const heading = (text: string, level = 2): Block => ({ type: 'heading', text, level });

/** One document powers the public page, private snapshot and Word/PDF output.
 * Section anchors are presentation only; saved offsets still use block IDs. */
export function guanlanEventDocument(event: GuanlanEvent) {
  const sources = new Map(event.sources.map((source) => [source.id, source]));
  const cite = (ids: string[], includeFiles = false): Block[] =>
    ids.flatMap((id) => {
      const source = sources.get(id);
      if (!source) throw new Error(`事件 ${event.id} 引用了缺失出处 ${id}`);
      return [
        referenceParagraph(source.title, source.url, `${source.author} · `),
        ...(includeFiles && source.fullText
          ? [referenceParagraph(source.fullText.title, source.fullText.url)]
          : []),
      ];
    });
  const section = (item: EventSection): Block[] => [
    heading(item.title, 3),
    ...item.paragraphs.map(paragraph),
    ...cite(item.sourceIds),
  ];
  const document = createContentDocument(
    event.title,
    '社科通识 · 观澜事件精读',
    contentUrl('guanlan-event', event.id),
    [
      paragraph(event.question),
      heading('新闻回放'),
      ...section(event.recap),
      heading('深度背景'),
      ...section(event.background),
      heading('多维立意'),
      ...event.perspectives.flatMap((view): Block[] => [
        heading(`${view.level}：${view.title}`, 3),
        paragraph(`关键词：${view.keywords.join('、')}`),
        ...view.paragraphs.map(paragraph),
        ...(view.quote
          ? [{ type: 'quote' as const, text: view.quote.text }, paragraph(view.quote.speaker)]
          : []),
        ...cite(view.sourceIds, true),
      ]),
      heading('思辨翻转'),
      paragraph('社科通识编辑'),
      ...event.reconsiderations.flatMap(section),
      heading('媒体评论与研究'),
      ...event.sources.flatMap((source): Block[] => [
        heading(source.title, 3),
        paragraph(`${source.author} · ${source.publication} · ${source.date}`),
        paragraph(source.description),
        referenceParagraph(source.title, source.url),
      ]),
    ],
    '社科通识编辑',
    event.keywords,
  );
  return document;
}
