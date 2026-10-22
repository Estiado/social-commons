import { strToU8, zipSync } from 'fflate';
import type { ReadingRecord } from '../model.ts';

export interface ExportSource {
  id: string;
  title: string;
  storage: 'guest' | 'cloud' | 'draft';
}
interface ExportResult {
  bytes: Uint8Array;
  warnings: string[];
}
interface BatchDependencies {
  extraFiles?: Record<string, Uint8Array>;
  load(source: ExportSource): Promise<ReadingRecord | undefined>;
  render(record: ReadingRecord): Promise<ExportResult>;
  writePart(bytes: Uint8Array, part: number): void | Promise<void>;
  progress(done: number, total: number): void;
  signal: AbortSignal;
}
export const safeExportName = (name: string) =>
  Array.from(name, (character) =>
    character.charCodeAt(0) < 32 || '<>:"/\\|?*'.includes(character) ? '_' : character,
  )
    .join('')
    .replace(/\.+$/g, '')
    .slice(0, 100) || '文章';

/** Only one article and one bounded archive part are held at once. PDF/DOCX
 * are already compressed, so storing ZIP entries avoids redundant deflation. */
export async function createReadingArchives(
  sources: ExportSource[],
  extension: 'docx' | 'pdf' | 'json',
  dependencies: BatchDependencies,
  partLimit = 25 * 1024 * 1024,
) {
  let files: Record<string, Uint8Array> = {};
  let size = 0;
  let part = 0;
  let exported = 0;
  const results: {
    id: string;
    title: string;
    status: 'ok' | 'failed';
    part?: number;
    warnings?: string[];
    error?: string;
  }[] = [];
  const flush = async (final = false) => {
    dependencies.signal.throwIfAborted();
    if (!size && !final) return;
    files['导出清单.json'] = strToU8(
      JSON.stringify(
        { exportedAt: new Date().toISOString(), part: part + 1, final, results },
        null,
        2,
      ),
    );
    files['使用说明.txt'] = strToU8(
      '这是个人阅读空间的私有导出。每篇附有原文出处与 JSON 数据，JSON 包含原始结构及个人摘录。节选不等于全文；插图失败会记入清单。多个 ZIP 分卷应一并保存，最后一卷包含最终完整清单。',
    );
    await dependencies.writePart(
      zipSync({ ...dependencies.extraFiles, ...files }, { level: 0 }),
      ++part,
    );
    files = {};
    size = 0;
  };
  for (const [index, source] of sources.entries()) {
    dependencies.signal.throwIfAborted();
    try {
      const record = await dependencies.load(source);
      if (!record) throw new Error('文章已过期、已移除，或当前账号无权读取');
      const backup = strToU8(JSON.stringify({ schemaVersion: 1, record }));
      const rendered = extension === 'json' ? undefined : await dependencies.render(record);
      dependencies.signal.throwIfAborted();
      const nextSize = backup.byteLength + (rendered?.bytes.byteLength || 0);
      if (nextSize > 40 * 1024 * 1024) throw new Error('单篇导出超过 40 MB，请在阅读页面单独导出');
      if (size && size + nextSize > partLimit) await flush();
      const base = `${String(index + 1).padStart(4, '0')}-${safeExportName(source.title)}-${source.id.slice(0, 8)}`;
      files[`${base}/文章与摘录.json`] = backup;
      if (rendered) files[`${base}/${safeExportName(source.title)}.${extension}`] = rendered.bytes;
      size += nextSize;
      exported++;
      results.push({
        id: source.id,
        title: source.title,
        status: 'ok',
        part: part + 1,
        warnings: rendered?.warnings || [],
      });
    } catch (error) {
      dependencies.signal.throwIfAborted();
      results.push({
        id: source.id,
        title: source.title,
        status: 'failed',
        error: error instanceof Error ? error.message : '文章导出失败',
      });
    }
    dependencies.progress(index + 1, sources.length);
  }
  await flush(true);
  return { exported, failed: sources.length - exported, parts: part };
}
