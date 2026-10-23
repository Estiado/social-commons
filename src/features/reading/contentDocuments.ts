import { articleSchema, type ArticleBlock, type ArticleDocument } from './model.ts';
import type { IDailyKnowledge, IEvent, IQuote, IEssayMaterial } from '@/data/types';
import type { PresetArticle } from '@/data/presetArticles';
import { nameCatalogueReferences, referenceParagraph } from './references.ts';
import { HISTORY_READINGS } from '../../data/history/readings.ts';

export type ContentKind =
  | 'daily'
  | 'quote'
  | 'event'
  | 'preset'
  | 'essay'
  | 'topic'
  | 'public-article';
export const SITE_ORIGIN = 'https://social-commons.pages.dev';
export function contentPath(kind: ContentKind, id: string): string {
  const encoded = encodeURIComponent(id);
  return kind === 'daily'
    ? `/daily/${encoded}`
    : kind === 'quote'
      ? `/quotes/${encoded}`
      : kind === 'event'
        ? `/events/${encoded}`
        : kind === 'preset'
          ? `/guanlan/preset/${encoded}`
          : kind === 'essay'
            ? `/essay?id=${encoded}`
            : kind === 'topic'
              ? `/topics/${encoded}`
              : `/guanlan/${encoded}`;
}
export const contentUrl = (kind: ContentKind, id: string) =>
  new URL(contentPath(kind, id), SITE_ORIGIN).href;

/** Editing a material creates a new reading snapshot, preserving annotations
 * anchored to its previous text. Volatile IDs and dates are excluded. */
export async function versionContentDocument(document: ArticleDocument): Promise<ArticleDocument> {
  if (!document.url) return document;
  const content = JSON.stringify({
    title: document.title,
    author: document.author,
    source: document.source,
    tags: document.tags,
    blocks: document.blocks,
    typography: document.typography,
  });
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(content));
  const signature = Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
  const url = new URL(document.url);
  url.searchParams.set('snapshot', signature);
  return { ...document, url: url.href };
}

/** All content adapters return the same reader/export contract. Source data is
 * never rewritten, and importing a snapshot does not certify its citations. */
export function createContentDocument(
  title: string,
  source: string,
  url: string,
  blocks: Omit<Extract<ArticleBlock, { text: string }>, 'id'>[],
  author = '',
  tags: string[] = [],
): ArticleDocument {
  return articleSchema.parse({
    schemaVersion: 1,
    id: crypto.randomUUID(),
    contentVersion: crypto.randomUUID(),
    title,
    source,
    author,
    url,
    tags,
    publishedAt: '',
    importedAt: new Date().toISOString(),
    completeness: 'unverified',
    warnings: [],
    blocks: blocks
      .filter((block) => block.text.trim())
      .map(nameCatalogueReferences)
      .map((block, index) => ({ ...block, id: `b${index + 1}` })),
  });
}
const paragraph = (text: string) => ({ type: 'paragraph' as const, text });
const heading = (text: string) => ({ type: 'heading' as const, text, level: 2 });
const paragraphs = (text: string) =>
  text
    .split(/\n\s*\n/)
    .filter((part) => part.trim())
    .map(paragraph);

export function dailyDocument(item: IDailyKnowledge): ArticleDocument {
  return createContentDocument(
    item.title,
    '社科通识 · 日新',
    contentUrl('daily', item.id),
    [
      paragraph(item.summary),
      ...paragraphs(item.content),
      heading('参考资料'),
      paragraph(item.source),
      ...(item.mediaReferences || []).flatMap((reference) => [
        heading(reference.title),
        paragraph(`${reference.source}${reference.date ? ` · ${reference.date}` : ''}`),
        paragraph(reference.excerpt),
        ...(reference.url ? [referenceParagraph(reference.title, reference.url)] : []),
      ]),
    ],
    '',
    [item.category],
  );
}
export function quoteDocument(item: IQuote): ArticleDocument {
  const blocks: Omit<Extract<ArticleBlock, { text: string }>, 'id'>[] = [
    ...item.text.split(/\n\s*\n/u).map((text) => ({ type: 'quote' as const, text })),
    paragraph(`${item.author} · ${item.source}`),
  ];
  if (item.sourceUrl) blocks.push(referenceParagraph(item.source, item.sourceUrl, '作品出处：'));
  if (item.sourceNote) blocks.push(paragraph(`出处说明：${item.sourceNote}`));
  if (item.context) blocks.push(paragraph(item.context));
  if (item.commentary) {
    const note = item.commentary;
    blocks.push(
      heading('作品赏析'),
      paragraph(note.text),
      paragraph(note.commentator.replace('（未单列撰稿者）', '')),
      referenceParagraph(
        note.commentatorSource.replace(
          /[；，]\s*本站(?:概述|摘要|整理|整理摘要)[^；。]*|[；，]\s*非逐字引语/gu,
          '',
        ),
        note.url,
      ),
    );
  }
  return createContentDocument(
    `${item.author} · ${item.title || item.source}`,
    item.source,
    contentUrl('quote', item.id),
    blocks,
    item.author,
  );
}
export function eventDocument(item: IEvent): ArticleDocument {
  return createContentDocument(
    item.title,
    '社科通识 · 群鉴',
    contentUrl('event', item.id),
    [
      paragraph(`${item.date} · ${item.location}`),
      heading('事件概述'),
      paragraph(item.summary),
      ...item.summarySources.map((source) => referenceParagraph(source.title, source.url)),
      heading('多方视角'),
      ...item.perspectives.flatMap((view) => [
        heading(`${view.role}：${view.title}`),
        ...paragraphs(view.description),
        ...(view.quote
          ? [
              {
                type: 'quote' as const,
                text: view.quote + (view.translated === false ? '' : '（节译）'),
              },
            ]
          : []),
        paragraph(view.original),
        referenceParagraph(view.source, view.sourceUrl),
        paragraph(view.locator),
        ...(view.readingId ? [historyReadingBlock(view.readingId)] : []),
      ]),
      ...(item.academicPapers.length
        ? [
            heading('学术文献目录'),
            paragraph(
              '以下为站内整理的文献条目与摘要，非论文全文；书目信息和引述需对照原始出版物核验。',
            ),
          ]
        : []),
      ...item.academicPapers.flatMap((paper) => [
        heading(paper.title),
        paragraph(`${paper.authors.join('、')} · ${paper.year} · ${paper.venue}`),
        paragraph(paper.abstract),
        ...(paper.publisherUrl || paper.downloadUrl || paper.doi
          ? [
              paragraph(
                `出版或开放获取地址：${paper.publisherUrl || paper.downloadUrl || `https://doi.org/${paper.doi}`}`,
              ),
            ]
          : []),
        paragraph(
          `检索：${`https://scholar.google.com/scholar?q=${encodeURIComponent(paper.title)}`}`,
        ),
      ]),
      ...(item.references.length ? [heading('参考资料')] : []),
      ...item.references.map((reference) =>
        reference.url
          ? referenceParagraph(reference.title, reference.url)
          : paragraph(reference.title),
      ),
    ],
    '',
    [item.category],
  );
}

function historyReadingBlock(id: string): Omit<Extract<ArticleBlock, { text: string }>, 'id'> {
  const reading = HISTORY_READINGS[id];
  if (!reading) throw new Error(`未登记电子文献：${id}`);
  const url = reading.file ? `${SITE_ORIGIN}/readings/history/${reading.file}` : reading.url;
  return {
    ...referenceParagraph(reading.title, url, '电子文献：'),
    resource: {
      title: reading.title,
      url,
      sourceUrl: reading.url,
      format: reading.format,
      edition: reading.edition,
      license: reading.license,
    },
  };
}
export function presetDocument(item: PresetArticle): ArticleDocument {
  const document = createContentDocument(
    item.title,
    item.source,
    contentUrl('preset', item.id),
    [
      ...paragraphs(item.content),
      ...(item.url
        ? [referenceParagraph(item.title, item.url, '原文：')]
        : [paragraph(item.source)]),
    ],
    item.author,
    item.tags,
  );
  document.publishedAt = item.published_at;
  return document;
}
export function essayDocument(item: IEssayMaterial): ArticleDocument {
  return createContentDocument(
    item.concept,
    '社科通识 · 议论文素材',
    contentUrl('essay', item.id),
    [
      paragraph(item.description),
      paragraph(`适用话题：${item.applicableTopics.join('、')}`),
      ...(item.references || []).map((reference) =>
        referenceParagraph(reference.title, reference.url),
      ),
      ...item.materials.flatMap((material) => [
        heading(material.title),
        paragraph(material.content),
        paragraph(`来源：${material.source}`),
        ...(material.usageHint ? [paragraph(`整理者使用提示：${material.usageHint}`)] : []),
      ]),
    ],
    '',
    [item.category],
  );
}

/** Only the requested catalogue is loaded; opening a quote does not load all
 * history, essays, public articles and private documents. */
export async function loadContentDocument(kind: ContentKind, id: string): Promise<ArticleDocument> {
  if (kind === 'daily') {
    const { DAILY_KNOWLEDGE } = await import('@/data/daily');
    const item = DAILY_KNOWLEDGE.find((item) => item.id === id);
    if (item) return dailyDocument(item);
  }
  if (kind === 'quote') {
    const { getQuoteById } = await import('@/data/quotes');
    const item = getQuoteById(id);
    if (item) return quoteDocument(item);
  }
  if (kind === 'event') {
    const { getEventById } = await import('@/data/events');
    const item = getEventById(id);
    if (item) return eventDocument(item);
  }
  if (kind === 'preset') {
    const { PRESET_ARTICLES } = await import('@/data/presetArticles');
    const item = PRESET_ARTICLES.find((item) => item.id === id);
    if (item) return presetDocument(item);
  }
  if (kind === 'essay') {
    const { ESSAY_MATERIALS } = await import('@/data/essay');
    const item = ESSAY_MATERIALS.find((item) => item.id === id);
    if (item) return essayDocument(item);
  }
  if (kind === 'topic') {
    const { TOPIC_SPECIALS } = await import('@/data/topicSpecials');
    const item = TOPIC_SPECIALS.find((item) => item.id === id);
    if (item)
      return createContentDocument(item.name, '社科通识 · 专题', contentUrl(kind, id), [
        paragraph(item.subtitle),
        paragraph(item.description),
      ]);
  }
  if (kind === 'public-article') {
    const { supabase } = await import('@/lib/supabase');
    if (!supabase) throw new Error('公共文章服务尚未配置');
    const { data, error } = await supabase
      .from('articles')
      .select('title,source,author,url,content,published_at,tags')
      .eq('id', id)
      .eq('is_public', true)
      .single();
    if (error || !data) throw new Error('公共文章无法读取，请从观澜打开原文或使用链接导入');
    const document = createContentDocument(
      data.title,
      data.source || '来源待核对',
      contentUrl(kind, id),
      [
        ...paragraphs(data.content || ''),
        ...(data.url ? [referenceParagraph(data.title, data.url, '原文：')] : []),
      ],
      data.author || '',
      data.tags || [],
    );
    document.publishedAt = data.published_at || '';
    return document;
  }
  throw new Error('未找到这个内容条目');
}
