import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { articleSchema, type ReadingRecord } from './model';
import { importLocalReading } from './guestRepository';
import { excerptKey } from './excerpts';
import { collectionsSchema, type ReadingCollection } from './collections';

const originalArticle = z.object({
  id: z.uuid(),
  title: z.string(),
  source: z.string().nullable(),
  author: z.string().nullable(),
  url: z.string(),
});
const one = <T>(value: T | T[]): T => (Array.isArray(value) ? value[0] : value);
const paragraphSchema = z.object({
  id: z.string(),
  paragraph_id: z.string(),
  article_paragraphs: z.preprocess(
    one,
    z.object({
      id: z.string(),
      content: z.string(),
      paragraph_index: z.number(),
      articles: z.preprocess(one, originalArticle),
    }),
  ),
});
const highlightSchema = z.object({
  id: z.string(),
  selected_text: z.string(),
  articles: z.preprocess(one, originalArticle),
});
interface QueryResult {
  data: unknown[] | null;
  error: { message: string } | null;
}
async function allRows(query: (from: number, to: number) => PromiseLike<QueryResult>) {
  const rows: unknown[] = [];
  for (let offset = 0; ; offset += 200) {
    const { data, error } = await query(offset, offset + 199);
    if (error) throw new Error(`旧资料读取失败：${error.message}`);
    rows.push(...(data || []));
    if (!data || data.length < 200) return rows;
  }
}

/** Explicit, read-only bridge for the existing browser identity. It never signs
 * in a new anonymous user, changes ownership or writes back to legacy tables. */
export async function importLegacyWorkspace() {
  if (!supabase)
    throw new Error('本开发预览未配置旧数据库。请在正式网站、原来收藏时使用的浏览器中导入。');
  const initial = await supabase.auth.getSession();
  if (initial.error) throw initial.error;
  const userId = initial.data.session?.user.id;
  if (!userId)
    throw new Error(
      '未找到这个浏览器原有的收藏身份。请使用原来收藏时的浏览器；不会创建新身份冒充旧资料。',
    );
  const [rawParagraphs, rawHighlights, rawCollections] = await Promise.all([
    allRows((from, to) =>
      supabase!
        .from('saved_paragraphs')
        .select(
          'id,paragraph_id,article_paragraphs(id,content,paragraph_index,articles(id,title,source,author,url))',
        )
        .eq('user_id', userId)
        .order('id')
        .range(from, to),
    ),
    allRows((from, to) =>
      supabase!
        .from('saved_highlights')
        .select('id,selected_text,articles(id,title,source,author,url)')
        .eq('user_id', userId)
        .order('id')
        .range(from, to),
    ),
    allRows((from, to) =>
      supabase!
        .from('collections')
        .select('id,name,description,updated_at')
        .eq('user_id', userId)
        .order('id')
        .range(from, to),
    ),
  ]);
  const paragraphs = rawParagraphs.map((row) => paragraphSchema.parse(row));
  const highlights = rawHighlights.map((row) => highlightSchema.parse(row));
  const groups = z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().nullable(),
        updated_at: z.string(),
      }),
    )
    .parse(rawCollections);
  const links: {
    collection_id: string;
    paragraph_id?: string;
    highlight_id?: string;
    sort_order: number;
    note?: string | null;
  }[] = [];
  for (let offset = 0; offset < groups.length; offset += 50) {
    const ids = groups.slice(offset, offset + 50).map((group) => group.id);
    const [paragraphLinks, highlightLinks] = await Promise.all([
      allRows((from, to) =>
        supabase!
          .from('collection_paragraphs')
          .select('collection_id,paragraph_id,sort_order,note')
          .in('collection_id', ids)
          .order('collection_id')
          .order('paragraph_id')
          .range(from, to),
      ),
      allRows((from, to) =>
        supabase!
          .from('collection_highlights')
          .select('collection_id,highlight_id,sort_order,note')
          .in('collection_id', ids)
          .order('collection_id')
          .order('highlight_id')
          .range(from, to),
      ),
    ]);
    const linkSchema = z.object({
      collection_id: z.string(),
      paragraph_id: z.string().optional(),
      highlight_id: z.string().optional(),
      sort_order: z.number(),
      note: z.string().nullable(),
    });
    links.push(...[...paragraphLinks, ...highlightLinks].map((row) => linkSchema.parse(row)));
  }
  const current = await supabase.auth.getSession();
  if (current.error || current.data.session?.user.id !== userId)
    throw new Error('读取过程中账号已变化，导入已停止，请重新开始。');
  const records = new Map<string, ReadingRecord>();
  const referenceKeys = new Map<string, string>();
  const add = (
    article: z.infer<typeof originalArticle>,
    text: string,
    id: string,
    reference: string,
    kind: 'paragraph' | 'highlight',
  ) => {
    let record = records.get(article.id);
    if (!record) {
      record = {
        document: articleSchema.parse({
          schemaVersion: 1,
          id: article.id,
          contentVersion: article.id,
          title: `旧版摘录：${article.title}`,
          source: article.source || '',
          author: article.author || '',
          url: /^https?:\/\//i.test(article.url) ? article.url : '',
          publishedAt: '',
          importedAt: new Date().toISOString(),
          completeness: 'partial',
          tags: [],
          warnings: ['从旧段落库迁移，仅包含已收藏文字，不是文章全文。'],
          blocks: [
            {
              id: 'migration-note',
              type: 'paragraph',
              text: '此文档保留旧版收藏与出处；完整正文请从原文重新导入。',
            },
          ],
        }),
        annotations: [],
        expiresAt: null,
        revision: 0,
      };
      records.set(article.id, record);
    }
    const blockId = `legacy-${id}`;
    record.document.blocks.push({ id: blockId, type: 'paragraph', text });
    record.annotations.push({
      id,
      contentVersion: record.document.contentVersion,
      blockId,
      kind,
      start: 0,
      end: text.length,
      text,
      createdAt: new Date().toISOString(),
    });
    referenceKeys.set(reference, excerptKey(record.document.id, id));
  };
  for (const row of paragraphs)
    add(
      row.article_paragraphs.articles,
      row.article_paragraphs.content,
      `paragraph-${row.id}`,
      `paragraph:${row.paragraph_id}`,
      'paragraph',
    );
  for (const row of highlights)
    add(row.articles, row.selected_text, `highlight-${row.id}`, `highlight:${row.id}`, 'highlight');
  // Validate all links before writing anything. Missing rows may indicate legacy
  // RLS restrictions; they must not be silently presented as a complete import.
  const byCollection = new Map<string, typeof links>();
  for (const link of links) {
    const reference = link.paragraph_id
      ? `paragraph:${link.paragraph_id}`
      : `highlight:${link.highlight_id}`;
    if (!referenceKeys.has(reference))
      throw new Error('部分旧素材包关联无法读取。旧资料未修改，请联系维护者核查权限后重试。');
    const entries = byCollection.get(link.collection_id) || [];
    entries.push(link);
    byCollection.set(link.collection_id, entries);
  }
  for (const record of records.values()) articleSchema.parse(record.document);
  const collections: ReadingCollection[] = groups.map((group) => ({
    id: `legacy-${group.id}`,
    name: group.name,
    description: group.description || '',
    updatedAt: new Date(group.updated_at).toISOString(),
    items: (byCollection.get(group.id) || [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((link) => ({
        key: referenceKeys.get(
          link.paragraph_id ? `paragraph:${link.paragraph_id}` : `highlight:${link.highlight_id}`,
        )!,
        note: link.note || '',
      })),
  }));
  collectionsSchema.parse(collections);
  for (const record of records.values()) await importLocalReading(record);
  return { documents: records.size, collections };
}
