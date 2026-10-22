import { getGuestArticle, listGuestArticles } from '../guestRepository';
import { getCloudArticle, listAllCloudArticles } from '../cloudRepository';
import { prepareArticleExport } from '../model';
import { supabase } from '@/lib/supabase';
import { createReadingArchives, type ExportSource } from './batchArchive';
import { downloadArticleFile } from './assets';
import { collectionsSchema } from '../collections';

export async function exportReadingLibrary(
  format: 'docx' | 'pdf' | 'json',
  ownerId: string | undefined,
  signal: AbortSignal,
  progress: (done: number, total: number) => void,
) {
  const guest = await listGuestArticles();
  const cloud = ownerId ? await listAllCloudArticles() : [];
  const sources: ExportSource[] = cloud.map((item) => ({ ...item, storage: 'cloud' }));
  const cloudIds = new Set(cloud.map((item) => item.id));
  sources.push(
    ...guest
      .filter((item) => !cloudIds.has(item.id))
      .map((item) => ({ ...item, storage: 'guest' as const })),
  );
  if (!sources.length) throw new Error('阅读空间里还没有可导出的文章');
  let fontBytes: Uint8Array | undefined;
  if (format === 'pdf') {
    const response = await fetch('/fonts/NotoSansSC-Regular.ttf', { signal });
    if (!response.ok) throw new Error('中文字体加载失败');
    fontBytes = new Uint8Array(await response.arrayBuffer());
  }
  return createReadingArchives(sources, format, {
    extraFiles: {
      '阅读空间素材包.json': new TextEncoder().encode(
        JSON.stringify({
          schemaVersion: 1,
          collections: collectionsSchema.parse(
            JSON.parse(localStorage.getItem('social-commons:reading-collections-v1') || '[]'),
          ),
        }),
      ),
    },
    signal,
    progress,
    load: async (source) => {
      // Changing accounts during a long export must stop the operation; no
      // documents from a second identity can be mixed into the same archive.
      if (ownerId && supabase) {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        const current = data.session?.user;
        if ((current && !current.is_anonymous ? current.id : undefined) !== ownerId)
          throw new Error('账号已变化，请重新开始导出');
      }
      return source.storage === 'cloud' ? getCloudArticle(source.id) : getGuestArticle(source.id);
    },
    render: async (record) => {
      const article = prepareArticleExport(record.document);
      if (format === 'docx') {
        const { buildArticleDocx } = await import('./exportDocx');
        const result = await buildArticleDocx(article);
        return {
          bytes: new Uint8Array(await result.blob.arrayBuffer()),
          warnings: result.warnings,
        };
      }
      const { buildArticlePdf } = await import('./exportPdf');
      return buildArticlePdf(article, fontBytes);
    },
    writePart: (bytes, part) =>
      downloadArticleFile(bytes, `阅读空间-${format}-第${part}卷.zip`, 'application/zip'),
  });
}
