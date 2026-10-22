import { load, type Cheerio } from 'cheerio/slim';
import type { AnyNode, Element } from 'domhandler';
import { articleSchema, canonicalArticleUrl, MAX_ARTICLE_CHARACTERS, MAX_ARTICLE_IMAGES, type ArticleBlock, type ArticleDocument } from './model.ts';

// A source adapter only describes where the publisher keeps its article. The
// common walker preserves order, headings and figures for both URL and paste.
const SOURCES = [
  { host: 'thepaper.cn', name: '澎湃新闻', selectors: ['[class*="cententWrap"]', '.news_txt', '#contTxt', '.news_part_father'] },
  { host: 'people.com.cn', name: '人民网', selectors: ['#ozoom', '#articleContent', '.rm_txt_con', '.rm_txt', '#rwb_zw', '.box_con', '#p_content'] },
  { host: 'neweekly.com.cn', name: '新周刊', selectors: ['.article-content', '.article-detail-content', '.detail-content'] },
  { host: 'infzm.com', name: '南方周末', selectors: ['.nfzm-content__fulltext', '.article-content', '.articleContent', '.article-body'] },
  { host: 'zjol.com.cn', name: '浙江在线', selectors: ['.artCon', '#article-content', '.article-content', '#content', '.content'] },
  { host: 'mp.weixin.qq.com', name: '', selectors: ['#js_content'] },
];
const GENERIC_SELECTORS = ['article', '[itemprop="articleBody"]', '.article-content', '.article-body', '.post-content', '.entry-content', '#content', 'main'];
const NOISE = 'script,style,noscript,iframe,nav,footer,header,aside,form,button,.ad,.advertisement,.share,.comment,[hidden],[aria-hidden="true"]';
const cleanText = (text: string) => text.replace(/\u00a0/g, ' ').replace(/[\t\r ]+/g, ' ').replace(/\n\s*\n/g, '\n').trim();

export function parseArticleHtml(html: string, url = '', now = new Date()): ArticleDocument {
  if (html.length > 2 * 1024 * 1024) throw new Error('粘贴内容过大，请分篇导入');
  const $ = load(html);
  const hostname = url ? new URL(url).hostname : '';
  const source = SOURCES.find((item) => hostname === item.host || hostname.endsWith(`.${item.host}`));
  const meta = (selector: string) => $(selector).first().attr('content')?.trim() || '';
  const title = meta('meta[property="og:title"]') || $('h1').first().text().trim() || $('title').text().trim() || '粘贴导入的文章';
  let author = meta('meta[name="author"]') || meta('meta[property="article:author"]') || $('#js_name,.author').first().text().trim();
  let publishedAt = meta('meta[property="article:published_time"]') || meta('meta[name="publishdate"]') || meta('meta[name="pubdate"]') || $('time').first().attr('datetime') || '';
  let sourceName = meta('meta[property="og:site_name"]') || $('#js_name').first().text().trim() || source?.name || hostname;
  // The newspaper's static template contains a stale 2013 date and a page
  // number in meta[name=author]. Its visible byline is the reliable source.
  if (hostname === 'paper.people.com.cn' && /\/rmrb\//.test(url)) {
    const byline = cleanText($('.sec').first().text());
    author = byline.split('《人民日报》')[0].trim(); sourceName = '人民日报';
    const date = byline.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
    publishedAt = date ? `${date[1]}-${date[2].padStart(2, '0')}-${date[3].padStart(2, '0')}` : '';
  }
  if (source?.host === 'zjol.com.cn' && new URL(url).pathname.includes('/zjxc/')) {
    sourceName = '浙江宣传';
    publishedAt = $.root().text().match(/\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}/)?.[0].replace(/\s+/g, ' ') || '';
    const byline = $('.mt').nextAll('span').first().text().trim();
    if (byline.startsWith('来源：浙江宣传')) author = byline.replace(/^来源：浙江宣传\s*/, '');
  }
  if (source?.host === 'infzm.com') publishedAt = $('.nfzm-content__publish').first().attr('data-time') || publishedAt;
  // Access notices often live outside the article container and are removed as
  // navigation noise below. Detect them before selecting/cleaning the body.
  const accessRestricted = /登录后.{0,8}(阅读|查看)|订阅后|购买后.{0,8}阅读|剩余内容|本文为付费|登录获取更多阅读权限/.test($.root().text());
  $(NOISE).remove();
  // Choose the first sufficiently substantive source container. Broad fallbacks
  // are explicitly flagged so a navigation page never silently looks verified.
  let container: Cheerio<AnyNode> = $.root();
  let found = false;
  for (const selector of [...(source?.selectors || []), ...GENERIC_SELECTORS]) {
    const candidate = $(selector).first();
    if (cleanText(candidate.text()).length >= 50) { container = candidate; found = true; break; }
  }
  const blocks: ArticleBlock[] = [];
  const warnings: string[] = [];
  const addText = (type: 'paragraph' | 'heading' | 'quote' | 'list-item', value: string, level?: number) => {
    const text = cleanText(value);
    if (text && !(type === 'heading' && text === title)) blocks.push({ id: `b${blocks.length + 1}`, type, text, ...(level ? { level } : {}) });
  };
  const addImage = (element: Element) => {
    const image = $(element);
    const raw = image.attr('data-src') || image.attr('data-original') || image.attr('src');
    if (!raw) return;
    let imageUrl: URL;
    try { imageUrl = new URL(raw, url || undefined); } catch { warnings.push('有插图缺少可访问的地址，请在原文核对。'); return; }
    if (!['http:', 'https:'].includes(imageUrl.protocol) || imageUrl.username || imageUrl.password) return;
    if (blocks.filter((block) => block.type === 'image').length >= MAX_ARTICLE_IMAGES) return;
    const figure = image.closest('figure');
    blocks.push({ id: `b${blocks.length + 1}`, type: 'image', url: imageUrl.href,
      alt: (image.attr('alt') || '').slice(0, 500), caption: cleanText(figure.find('figcaption').text()).slice(0, 2000) });
  };
  const visit = (node: AnyNode) => {
    if (node.type !== 'tag') return;
    const element = node as Element;
    const tag = element.name.toLowerCase();
    if (tag === 'img') { addImage(element); return; }
    if (tag === 'figcaption') return;
    if (/^h[1-4]$/.test(tag)) { addText('heading', $(element).text(), Number(tag[1])); return; }
    if (['p', 'li', 'blockquote'].includes(tag)) {
      // Inline images are kept in their exact position, without losing nearby text.
      let text = '';
      const flush = () => { addText(tag === 'li' ? 'list-item' : tag === 'blockquote' ? 'quote' : 'paragraph', text); text = ''; };
      const inline = (child: AnyNode) => {
        if (child.type === 'text') text += child.data;
        else if (child.type === 'tag' && child.name === 'img') { flush(); addImage(child); }
        else if (child.type === 'tag' && child.name === 'br') text += '\n';
        else if ('children' in child) child.children.forEach(inline);
      };
      element.children.forEach(inline); flush(); return;
    }
    const hasBlockChild = $(element).find('p,h1,h2,h3,h4,li,blockquote,img').length > 0;
    if (!hasBlockChild && ['div', 'section'].includes(tag)) { addText('paragraph', $(element).text()); return; }
    element.children.forEach(visit);
  };
  container.contents().each((_, node) => {
    if (node.type === 'text') addText('paragraph', node.data);
    else visit(node);
  });
  const textLength = blocks.reduce((sum, block) => sum + ('text' in block ? block.text.length : 0), 0);
  if (!textLength) throw new Error('没有识别到正文，请使用粘贴正文导入');
  if (textLength > MAX_ARTICLE_CHARACTERS) throw new Error('文章过长，请分篇导入');
  if (!found && url) warnings.push('使用通用规则识别正文，请核对是否包含导航或遗漏段落。');
  if (textLength < 150) warnings.push('识别到的正文较短，请核对是否只有摘要。');
  if (accessRestricted) warnings.push('原站仅展示部分正文：当前仅有公开节选，不是全文。请在有权阅读原文后复制完整正文，再用粘贴方式导入。');
  return articleSchema.parse({ schemaVersion: 1, id: crypto.randomUUID(), contentVersion: crypto.randomUUID(),
    title: title.slice(0, 500), author: author.slice(0, 300), source: sourceName.slice(0, 300),
    url: canonicalArticleUrl(url), publishedAt: publishedAt.slice(0, 80), importedAt: now.toISOString(),
    completeness: accessRestricted ? 'partial' : 'unverified', tags: [], blocks, warnings: [...new Set(warnings)].slice(0, 20) });
}

export function parsePlainArticle(text: string): ArticleDocument {
  if (text.length > MAX_ARTICLE_CHARACTERS) throw new Error('文章过长，请分篇导入');
  const escape = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  return parseArticleHtml(`<article>${text.split(/\n+/).map((paragraph) => `<p>${escape(paragraph)}</p>`).join('')}</article>`);
}
