import { createContentDocument, contentUrl, SITE_ORIGIN } from '../reading/contentDocuments.ts';
import { referenceParagraph } from '../reading/references.ts';
import type { TextBlock } from '../reading/model.ts';
import type { BriefingEdition } from './edition.ts';

export function briefingDocument(edition: BriefingEdition) {
  const { news, quote, concept, day } = edition;
  const blocks: Omit<TextBlock, 'id'>[] = [
    { type: 'paragraph', text: '每日轮换选读；时事资料日期单列，诗文保留完整篇章。' },
    { type: 'heading', level: 2, text: '时事 · ' + news.title },
    { type: 'paragraph', text: `${news.source} · 最近资料节点 ${news.date}` },
    { type: 'paragraph', text: news.text },
    referenceParagraph('阅读事件脉络与出处', new URL(news.path, SITE_ORIGIN).href),
    { type: 'heading', level: 2, text: '名句 · ' + (quote.title || quote.source) },
    ...quote.text.split(/\n\s*\n/u).map((text) => ({ type: 'quote' as const, text })),
    { type: 'paragraph', text: quote.author + ' · ' + quote.source },
    referenceParagraph('阅读作品与赏析', contentUrl('quote', quote.id)),
    { type: 'heading', level: 2, text: '概念 · ' + concept.title },
    { type: 'paragraph', text: concept.summary },
    { type: 'paragraph', text: concept.source },
    referenceParagraph('阅读概念与原始资料', contentUrl('daily', concept.id)),
  ];
  return createContentDocument(
    '每日简报 · ' + day,
    '社科通识 · 每日选读',
    new URL('/briefing?date=' + day, SITE_ORIGIN).href,
    blocks,
    '社科通识编辑',
    ['每日简报'],
  );
}
