import { supabase } from '@/lib/supabase';
import { articleSchema, isPartialArticle, summarize, type ReadingRecord, type ReadingSummary, type ArticleAnnotation } from './model';

async function accountClient() {
  if (!supabase) throw new Error('云端保存尚未配置；文章仍可在当前浏览器阅读和导出');
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (!session || session.user.is_anonymous) throw new Error('请先通过邮箱验证码登录');
  return { client: supabase, userId: session.user.id };
}

function databaseError(error: { code?: string; message?: string }): Error {
  if (['42P01', 'PGRST205', '42703'].includes(error.code || '')) return new Error('云端阅读空间尚未就绪，请联系维护者；本机文章仍保留');
  return new Error(error.message || '云端保存失败，请稍后重试');
}

function decodeRecord(row: { document: unknown; annotations: unknown; revision: number }): ReadingRecord {
  const document = articleSchema.parse(row.document);
  const blocks = new Map(document.blocks.map((block) => [block.id, block]));
  const annotations = Array.isArray(row.annotations) ? (row.annotations as ArticleAnnotation[]).filter((item) => {
    if (!item || typeof item !== 'object' || typeof item.id !== 'string' || !['paragraph', 'highlight'].includes(item.kind)) return false;
    const block = blocks.get(item.blockId);
    return item.contentVersion === document.contentVersion && block && 'text' in block
      && Number.isInteger(item.start) && Number.isInteger(item.end) && item.start >= 0 && item.end > item.start && item.end <= block.text.length
      && block.text.slice(item.start, item.end) === item.text;
  }) : [];
  return { document, annotations, revision: row.revision, expiresAt: null };
}

export async function listCloudArticles(): Promise<ReadingSummary[]> {
  const { client, userId } = await accountClient();
  const { data, error } = await client.from('reading_documents')
    .select('id,title,source,imported_at,annotation_count').eq('owner_id', userId)
    .order('updated_at', { ascending: false }).limit(100);
  if (error) throw databaseError(error);
  return (data || []).map((row) => ({ id: row.id, title: row.title, source: row.source,
    importedAt: row.imported_at, annotationCount: row.annotation_count, expiresAt: null }));
}

export async function getCloudArticle(id: string): Promise<ReadingRecord | undefined> {
  const { client, userId } = await accountClient();
  const { data, error } = await client.from('reading_documents').select('document,annotations,revision').eq('owner_id', userId).eq('id', id).maybeSingle();
  if (error) throw databaseError(error);
  return data ? decodeRecord(data) : undefined;
}

/** Batch export scans all summaries with a stable key, then opens one body at
 * a time. It must not silently stop at the reader's latest-100 display limit. */
export async function listAllCloudArticles(): Promise<ReadingSummary[]> {
  const { client, userId } = await accountClient();
  const summaries: ReadingSummary[] = []; let cursor = '';
  while (true) {
    let query = client.from('reading_documents').select('id,title,source,imported_at,annotation_count')
      .eq('owner_id', userId).order('id').limit(200);
    if (cursor) query = query.gt('id', cursor);
    const { data, error } = await query;
    if (error) throw databaseError(error);
    for (const row of data || []) summaries.push({ id: row.id, title: row.title, source: row.source,
      importedAt: row.imported_at, annotationCount: row.annotation_count, expiresAt: null });
    if (!data || data.length < 200) return summaries;
    cursor = data[data.length - 1].id;
  }
}

export async function saveCloudArticle(record: ReadingRecord): Promise<ReadingRecord> {
  const { client, userId } = await accountClient();
  articleSchema.parse(record.document);
  const payload = { document: record.document, annotations: record.annotations, revision: record.revision + 1 };
  if (record.revision > 0) {
    const { data, error } = await client.from('reading_documents').update(payload).eq('id', record.document.id)
      .eq('owner_id', userId).eq('revision', record.revision).select('document,annotations,revision').maybeSingle();
    if (error) throw databaseError(error);
    if (!data) throw new Error('这篇文章已在其他设备更新，请重新打开后再保存，避免覆盖新收藏');
    return decodeRecord(data);
  }
  const { data, error } = await client.from('reading_documents').insert({ id: record.document.id, owner_id: userId, ...payload }).select('document,annotations,revision').single();
  if (error?.code === '23505') {
    const existing = await client.from('reading_documents').select('document,annotations,revision').eq('owner_id', userId)
      .eq(record.document.url ? 'url' : 'id', record.document.url || record.document.id).maybeSingle();
    if (existing.error) throw databaseError(existing.error);
    if (existing.data) {
      const saved = decodeRecord(existing.data);
      if (isPartialArticle(saved.document) && record.document.completeness === 'user-confirmed') throw new Error('账号内已有这篇文章的节选。请打开旧文章，选择“重新粘贴完整正文”，确认替换后保存。');
      if (record.annotations.length) throw new Error('账号内已有这篇文章，请先从阅读空间打开已有版本再收藏');
      return saved;
    }
  }
  if (error) throw databaseError(error);
  return decodeRecord(data);
}

export { summarize };
