import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { downloadFile } from '@/lib/downloadFile';
import { createReadingBackup, restoreReadingBackup, MAX_BACKUP_BYTES } from './backup';

export function ReadingBackupControls({ onRestored }: { onRestored(): void }) {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setStatus('');
    try {
      await action();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : '备份操作失败，现有数据保留。');
    } finally {
      setBusy(false);
    }
  };
  return (
    <section aria-label="可恢复的阅读备份" className="my-4 space-y-3">
      <p className="text-sm">文章、划线与文稿可以备份为一个文件，换浏览器时再恢复。</p>
      <div className="flex flex-wrap gap-3">
        <Button
          disabled={busy}
          variant="outline"
          onClick={() =>
            void run(async () => {
              downloadFile(
                await createReadingBackup(),
                `社科通识阅读备份-${new Date().toISOString().slice(0, 10)}.json`,
              );
              setStatus('备份已生成，请在浏览器下载列表中确认。');
            })
          }
        >
          下载可恢复备份
        </Button>
        <label className="inline-flex cursor-pointer items-center rounded-sm border px-3 py-2 text-sm">
          恢复备份文件
          <input
            type="file"
            accept=".json,application/json"
            className="sr-only"
            aria-label="恢复阅读备份"
            disabled={busy}
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = '';
              if (file)
                void run(async () => {
                  if (file.size > MAX_BACKUP_BYTES)
                    throw new Error('请选择不超过 50 MB 的备份文件。');
                  const result = await restoreReadingBackup(await file.text());
                  setStatus(
                    `已恢复 ${result.restored} 条；已有或到期的 ${result.skipped} 条未覆盖。`,
                  );
                  onRestored();
                });
            }}
          />
        </label>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        只备份当前浏览器的阅读空间，不含云端与议论文页面的自定义素材；素材区另有备份。恢复只添加缺失条目，已有内容和七天临时期限保留。
      </p>
      {status && (
        <p role="status" className="text-sm">
          {status}
        </p>
      )}
    </section>
  );
}
