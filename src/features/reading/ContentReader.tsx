import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArticleContent } from './ArticleContent';
import {
  addAnnotation,
  createAnnotation,
  type ArticleAnnotation,
  type ArticleDocument,
  type ReadingRecord,
} from './model';
import { loadContentDocument, type ContentKind } from './contentDocuments';
import { resolveCatalogueReading } from './catalogueReading';
import { getGuestArticleByUrl, saveGuestArticle, saveLocalReading } from './guestRepository';

/** A catalogue page and the private reader share exactly the same text blocks,
 * paragraph anchors and selection logic. Viewing alone does not save a copy. */
export function ContentReader({
  kind,
  id,
  document: supplied,
}: {
  kind: ContentKind;
  id: string;
  document?: ArticleDocument;
}) {
  const [record, setRecord] = useState<ReadingRecord>();
  const [savedId, setSavedId] = useState('');
  const [loadedKey, setLoadedKey] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [olderId, setOlderId] = useState<string>();
  const key = `${kind}:${id}`;
  useEffect(() => {
    let active = true;
    void (async () => {
      let existing: ReadingRecord | undefined;
      let storageNotice = '';
      let document = supplied || (await loadContentDocument(kind, id));
      let previousId: string | undefined;
      try {
        const resolved = await resolveCatalogueReading(document, getGuestArticleByUrl);
        document = resolved.document;
        existing = resolved.existing;
        previousId = resolved.olderId;
      } catch {
        storageNotice = '当前浏览器无法读取本地存储，仍可阅读和导出；收藏前请检查浏览器设置。';
      }
      if (active) {
        setRecord(existing || { document, annotations: [], revision: 0, expiresAt: null });
        setSavedId(existing?.document.id || '');
        setLoadedKey(key);
        setNotice(storageNotice);
        setOlderId(previousId);
      }
    })().catch((error) => {
      if (active) {
        setNotice(error instanceof Error ? error.message : '条目读取失败');
        setLoadedKey(key);
        setRecord(undefined);
      }
    });
    return () => {
      active = false;
    };
  }, [kind, id, key, supplied]);
  const save = async (annotations: ArticleAnnotation[] = []) => {
    if (!record) return;
    setBusy(true);
    setNotice('');
    try {
      let next = savedId ? record : await saveGuestArticle(record.document);
      for (const item of annotations) {
        const block = next.document.blocks.find((block) => block.id === item.blockId);
        if (!block || !('text' in block) || block.text.slice(item.start, item.end) !== item.text)
          throw new Error('已有版本的正文不同，请打开已保存的文章继续收藏');
        const annotation = createAnnotation(
          next.document,
          item.blockId,
          item.start,
          item.end,
          item.kind,
        );
        const whole =
          item.kind === 'paragraph' &&
          next.annotations.find(
            (entry) => entry.kind === 'paragraph' && entry.blockId === item.blockId,
          );
        next = whole
          ? { ...next, annotations: next.annotations.filter((entry) => entry.id !== whole.id) }
          : addAnnotation(next, annotation);
      }
      next = await saveLocalReading(next);
      setRecord(next);
      setSavedId(next.document.id);
      setNotice(annotations.length ? '已更新摘录并保存到阅读空间' : '已长期保存到阅读空间');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : '本机保存失败');
    } finally {
      setBusy(false);
    }
  };
  const exportFile = async (format: 'docx' | 'pdf') => {
    if (!record) return;
    setBusy(true);
    try {
      const { exportArticle } = await import('./export/articleExport');
      const warnings = await exportArticle(record.document, format);
      setNotice(warnings.length ? warnings.join('；') : '文件已生成');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : '导出失败');
    } finally {
      setBusy(false);
    }
  };
  if (loadedKey !== key)
    return (
      <p role="status" className="py-5 text-sm text-muted-foreground">
        正在准备阅读内容…
      </p>
    );
  return (
    <section aria-label="可收藏正文" className="space-y-6">
      <div data-tour="reader-actions" className="flex flex-wrap items-center gap-3">
        <Button size="sm" disabled={busy || !record} onClick={() => void save()}>
          {savedId ? '已加入阅读空间' : '加入阅读空间'}
        </Button>
        {savedId && (
          <Link className="text-sm text-accent underline" to={`/reading/${savedId}`}>
            打开已保存文章
          </Link>
        )}
        <Button
          size="sm"
          variant="outline"
          disabled={busy || !record}
          onClick={() => void exportFile('docx')}
        >
          Word
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={busy || !record}
          onClick={() => void exportFile('pdf')}
        >
          PDF
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        悬停段落可收藏，选中文字可保存划线；自动进入阅读空间，无需登录。
      </p>
      {kind === 'public-article' && record && (
        <h2 className="font-serif text-3xl font-semibold">{record.document.title}</h2>
      )}
      {notice && (
        <p role="status" className="text-sm text-accent">
          {notice}
        </p>
      )}
      {olderId && (
        <p className="text-sm text-muted-foreground">
          这里展示更新后的内容。
          <Link className="ml-1 text-accent underline" to={`/reading/${olderId}`}>
            查看已保存的旧版和划线
          </Link>
        </p>
      )}
      {record && (
        <ArticleContent
          article={record.document}
          idPrefix={`catalogue-${record.document.id}`}
          annotations={record.annotations}
          busy={busy}
          onSave={(items) => void save(items)}
        />
      )}
    </section>
  );
}
