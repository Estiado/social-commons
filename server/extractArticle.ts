import * as cheerio from 'cheerio/slim';
import { fetchArticleHtml, validateArticleUrl, DEFAULT_ARTICLE_HOSTS, RequestError } from './articleFetch.ts';
import { HOT_TOPICS } from '../src/data/hotTopics.ts';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { matchTopics } from './topics.ts';

export interface ExtractEnvironment {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  ARTICLE_ALLOWED_HOSTS?: string;
}

interface ExtractedArticle {
  url: string;
  title: string;
  author: string | null;
  source: string | null;
  published_at: string | null;
  excerpt: string | null;
  content: string | null;
  tags: string[];
}

/**
 * 从网页中提取文章元数据
 */
async function extractArticle(url: string, hosts: string[]): Promise<ExtractedArticle> {
  const html = await fetchArticleHtml(url, hosts);
  const $ = cheerio.load(html);

  // 提取标题：优先 og:title，然后 <title>
  let title =
    $('meta[property="og:title"]').attr('content') ||
    $('meta[name="twitter:title"]').attr('content') ||
    $('h1').first().text().trim() ||
    $('title').text().trim();

  // 提取作者
  let author =
    $('meta[name="author"]').attr('content') ||
    $('meta[property="article:author"]').attr('content') ||
    $('.author').first().text().trim() ||
    $('[class*="author"]').first().text().trim() ||
    null;

  // 提取来源媒体
  let source =
    $('meta[property="og:site_name"]').attr('content') ||
    $('meta[name="application-name"]').attr('content') ||
    new URL(url).hostname.replace('www.', '') ||
    null;

  // 提取发布时间
  let publishedAt =
    $('meta[property="article:published_time"]').attr('content') ||
    $('meta[name="publishdate"]').attr('content') ||
    $('meta[name="pubdate"]').attr('content') ||
    $('time').first().attr('datetime') ||
    null;

  // 提取摘要
  let excerpt =
    $('meta[name="description"]').attr('content') ||
    $('meta[property="og:description"]').attr('content') ||
    $('meta[name="twitter:description"]').attr('content') ||
    null;

  // 提取正文：尝试常见的正文容器
  const contentSelectors = [
    'article',
    '.article-content',
    '.article-body',
    '.post-content',
    '.entry-content',
    '#content',
    '.content',
    'main',
  ];

  let content = '';
  for (const selector of contentSelectors) {
    const $container = $(selector);
    if ($container.length > 0 && $container.text().trim().length > 100) {
      // 移除脚本、样式、广告等
      $container.find('script, style, nav, footer, header, .ad, .advertisement, .share, .comment').remove();
      content = $container
        .find('p')
        .map((_, el) => $(el).text().trim())
        .get()
        .filter((p) => p.length > 0)
        .join('\n\n');
      if (content.length > 50) break;
    }
  }

  // 如果没找到正文容器，用所有段落
  if (!content) {
    content = $('p')
      .map((_, el) => $(el).text().trim())
      .get()
      .filter((p) => p.length > 20)
      .join('\n\n');
  }

  // 提取标签
  const tags: string[] = [];
  const tagSelectors = [
    'meta[property="article:tag"]',
    'meta[name="keywords"]',
    '.tag',
    '.tags a',
    '[rel="tag"]',
  ];
  for (const selector of tagSelectors) {
    $(selector).each((_, el) => {
      const tag = $(el).attr('content') || $(el).text().trim();
      if (tag && tag.length < 20) {
        tags.push(...tag.split(/[,，、]/).map((t) => t.trim()).filter(Boolean));
      }
    });
  }

  // 清理
  title = title.replace(/\s*[-|_]\s*.*$/, '').trim(); // 去掉标题后的网站名
  if (author) author = author.trim();
  if (excerpt) excerpt = excerpt.trim().slice(0, 500);
  if (content) content = content.trim();

  // 自动匹配话题标签（基于标题+摘要+正文前500字）
  const topicText = `${title} ${excerpt || ''} ${content?.slice(0, 500) || ''}`;
  const autoTopics = matchTopics(topicText);

  // 合并网页提取的标签和自动话题标签
  const allTags = [...new Set([...tags, ...autoTopics])].slice(0, 10);

  return {
    url,
    title: title || '未命名文章',
    author: author || null,
    source: source || null,
    published_at: publishedAt && Number.isFinite(Date.parse(publishedAt)) ? new Date(publishedAt).toISOString() : null,
    excerpt: excerpt || null,
    content: content || null,
    tags: allTags,
  };
}

/**
 * 将文章段落拆分存入 article_paragraphs 表
 */
async function saveParagraphs(
  supabase: SupabaseClient,
  articleId: string,
  content: string,
) {
  const paragraphs = content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 10);

  if (paragraphs.length === 0) return;

  const paragraphRecords = paragraphs.map((content, index) => ({
    article_id: articleId,
    paragraph_index: index,
    content,
  }));

  const { error } = await supabase.from('article_paragraphs').insert(paragraphRecords);
  if (error) throw error;
}

export function createExtractHandler(environment: ExtractEnvironment) {
  const supabaseUrl = environment.SUPABASE_URL;
  const supabaseServiceKey = environment.SUPABASE_SERVICE_ROLE_KEY;
  const hosts = environment.ARTICLE_ALLOWED_HOSTS?.split(',').map((host) => host.trim().toLowerCase()).filter(Boolean) || DEFAULT_ARTICLE_HOSTS;
  return async (event: { httpMethod: string; body: string | null; authorization?: string }) => {
  // CORS 头
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    if ((event.body?.length || 0) > 8192) throw new RequestError('请求内容过大', 413);
    let input: { url?: unknown; topicId?: unknown };
    try { input = JSON.parse(event.body || '{}'); } catch { throw new RequestError('请求必须是有效的 JSON'); }
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new RequestError('请求格式无效');
    const url = validateArticleUrl(input.url, hosts).href;

    // 检查 Supabase 配置
    if (!supabaseUrl || !supabaseServiceKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: '服务器未配置 Supabase，请联系管理员' }),
      };
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const token = event.authorization?.match(/^Bearer (.+)$/i)?.[1];
    if (!token) throw new RequestError('请先连接素材库，再提交文章', 401);
    const { data: auth, error: authError } = await supabase.auth.getUser(token);
    if (authError || !auth.user) throw new RequestError('登录已失效，请刷新后重试', 401);

    // 检查是否已存在（缓存命中：直接返回已有文章，不重新爬取）
    const { data: existing, error: existingError } = await supabase
      .from('articles')
      .select('id, title, author, source, published_at, excerpt, tags, created_at')
      .eq('url', url)
      .maybeSingle();
    if (existingError) throw existingError;

    if (existing) {
      // 统计段落数
      const { count: paragraphCount, error: countError } = await supabase
        .from('article_paragraphs')
        .select('*', { count: 'exact', head: true })
        .eq('article_id', existing.id);
      if (countError) throw countError;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: '文章已存在（缓存命中）',
          cached: true,
          article: {
            ...existing,
            paragraphCount: paragraphCount || 0,
          },
        }),
      };
    }

    // 提取文章
    const article = await extractArticle(url, hosts);
    const topic = HOT_TOPICS.find((topic) => topic.id === input.topicId);
    if (topic) article.tags = [...new Set([topic.name, ...topic.keywords.slice(0, 2), ...article.tags])].slice(0, 10);
    if (!article.content || article.content.length < 50) throw new RequestError('未能提取正文，请直接访问原文阅读');

    // 存入数据库
    const { data: inserted, error } = await supabase
      .from('articles')
      .insert({
        url: article.url,
        title: article.title,
        author: article.author,
        source: article.source,
        published_at: article.published_at,
        excerpt: article.excerpt,
        content: article.content,
        tags: article.tags,
        is_public: true,
      })
      .select('id')
      .single();

    if (error) throw error;

    // 拆分段落存入段落表
    if (article.content && inserted) {
      try { await saveParagraphs(supabase, inserted.id, article.content); }
      catch (error) {
        // 补偿本次失败写入，避免缓存永久命中只有标题、没有段落的半成品。
        await supabase.from('articles').delete().eq('id', inserted.id);
        throw error;
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: '文章提取成功',
        article: {
          id: inserted?.id,
          title: article.title,
          author: article.author,
          source: article.source,
          published_at: article.published_at,
          excerpt: article.excerpt,
          tags: article.tags,
          paragraphCount: article.content ? article.content.split(/\n\n+/).filter((p) => p.length > 10).length : 0,
        },
      }),
    };
  } catch (error) {
    console.error('提取文章失败:', error);
    return {
      statusCode: error instanceof RequestError ? error.status : 500,
      headers,
      body: JSON.stringify({
        error: error instanceof RequestError ? error.message : '提取失败，请稍后重试',
      }),
    };
  }
  };
}
