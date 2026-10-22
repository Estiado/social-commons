import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { READING_CLOUD_ENABLED } from './config';

export function BatchExportControls({ ownerId }: { ownerId?: string }) {
  const controller = useRef<AbortController | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  useEffect(() => () => controller.current?.abort(), [ownerId]);
  const start = async (format: 'docx' | 'pdf' | 'json') => {
    const operation = new AbortController();
    controller.current = operation;
    setBusy(true);
    setNotice('正在读取全部文章目录…');
    try {
      const { exportReadingLibrary } = await import('./export/exportLibrary');
      const result = await exportReadingLibrary(format, ownerId, operation.signal, (done, total) =>
        setNotice(`正在整理 ${done} / ${total} 篇…`),
      );
      setNotice(
        `已导出 ${result.exported} 篇，${result.parts} 个 ZIP 文件${result.failed ? `；${result.failed} 篇失败，请查看最后一卷的导出清单` : '，含出处与个人摘录备份'}。`,
      );
    } catch (error) {
      setNotice(
        operation.signal.aborted
          ? '已取消；此前下载的分卷仍可使用。'
          : error instanceof Error
            ? error.message
            : '批量导出失败',
      );
    } finally {
      setBusy(false);
      controller.current = null;
    }
  };
  return (
    <section aria-label="导出全部阅读文章" className="my-6 space-y-3 rounded-sm border p-5">
      <h2 className="font-serif text-lg font-semibold">导出全部文章</h2>
      <p className="text-xs leading-relaxed text-muted-foreground">
        包含本浏览器的临时文章和长期保存文章
        {ownerId
          ? '，以及本账号全部云端文章（含列表之外的文章）'
          : READING_CLOUD_ENABLED
            ? '；登录后也可导出本账号的云端文章'
            : ''}
        ，不受当前搜索筛选影响。逐篇生成，约 25 MB
        自动分卷；请允许本站下载多个文件。每卷附文章结构、摘录和导出清单，缺图或失败会如实标注。
      </p>
      <div className="flex flex-wrap gap-3">
        <Button size="sm" disabled={busy} onClick={() => void start('docx')}>
          全部 Word · ZIP
        </Button>
        <Button size="sm" variant="outline" disabled={busy} onClick={() => void start('pdf')}>
          全部 PDF · ZIP
        </Button>
        <Button size="sm" variant="outline" disabled={busy} onClick={() => void start('json')}>
          全部原始数据 · ZIP
        </Button>
        {busy && (
          <Button size="sm" variant="ghost" onClick={() => controller.current?.abort()}>
            取消导出
          </Button>
        )}
      </div>
      {notice && (
        <p role="status" className="text-sm leading-relaxed">
          {notice}
        </p>
      )}
    </section>
  );
}
