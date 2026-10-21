import { supabase } from './supabase';
import { requireSuccess } from './database';
import { getPresetParagraphs, type PresetArticle } from '../data/presetArticles';

// 同一标签页合并并发同步；失败时允许下一次用户操作重试。
const pending = new Map<string, Promise<Record<number, string>>>();

async function sync(article: PresetArticle): Promise<Record<number, string>> {
  if (!supabase) throw new Error('云端素材库尚未配置');
  const paragraphs = getPresetParagraphs(article.id);
  let { data: existing, error } = await supabase.from('articles').select('id').eq('url', article.url).maybeSingle();
  if (error) throw error;
  if (!existing) {
    const result = await supabase.from('articles').insert({
      url: article.url, title: article.title, author: article.author, source: article.source,
      published_at: article.published_at, excerpt: article.excerpt, tags: article.tags,
      content: paragraphs.map((p) => p.content).join('\n\n'), is_public: true, is_preset: true,
    }).select('id').single();
    // 其他标签页可能先创建了同一 URL；唯一约束冲突时读取其结果。
    if (result.error?.code === '23505') {
      ({ data: existing, error } = await supabase.from('articles').select('id').eq('url', article.url).single());
      if (error) throw error;
    } else {
      if (result.error) throw result.error;
      existing = result.data;
    }
  }
  if (!existing) throw new Error('同步文章失败');
  const current = await requireSuccess(supabase.from('article_paragraphs').select('id, paragraph_index').eq('article_id', existing.id));
  const ids: Record<number, string> = Object.fromEntries((current.data || []).map((p) => [p.paragraph_index, p.id]));
  // 旧版本可能只写入文章、未写入段落；补齐缺失段落而不是永远返回不完整文章。
  const missing = paragraphs.flatMap((paragraph, index) => ids[index] ? [] : [{ article_id: existing.id, paragraph_index: index, content: paragraph.content }]);
  if (missing.length) {
    const inserted = await requireSuccess(supabase.from('article_paragraphs').insert(missing).select('id, paragraph_index'));
    for (const paragraph of inserted.data || []) ids[paragraph.paragraph_index] = paragraph.id;
  }
  return ids;
}

export function syncPresetArticle(article: PresetArticle): Promise<Record<number, string>> {
  let request = pending.get(article.id);
  if (!request) {
    request = sync(article).finally(() => pending.delete(article.id));
    pending.set(article.id, request);
  }
  return request;
}
