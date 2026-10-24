import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { downloadFile } from '@/lib/downloadFile';
import { MAX_BACKUP_BYTES } from './backup';
import { createPersonalBackup, restorePersonalBackup, LAST_BACKUP_KEY } from './personalBackup';

export function ReadingBackupControls({ onRestored }: { onRestored(): void }) {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [lastGenerated, setLastGenerated] = useState(() => {
    try {
      const value = localStorage.getItem(LAST_BACKUP_KEY);
      return value && Number.isFinite(Date.parse(value)) ? value : '';
    } catch {
      return '';
    }
  });
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
    <section
      data-tour="reading-backup-controls"
      aria-label="可恢复的阅读备份"
      className="my-4 space-y-3"
    >
      <p className="text-sm">
        文章、划线、文稿，以及个人素材、自建词条和标签，一次备份到同一个文件。
      </p>
      <p className="text-xs text-muted-foreground">
        {lastGenerated
          ? `上次生成备份：${new Date(lastGenerated).toLocaleString('zh-CN')}`
          : '尚未生成全部个人内容的备份。'}
      </p>
      <div className="flex flex-wrap gap-3">
        <Button
          disabled={busy}
          variant="outline"
          onClick={() =>
            void run(async () => {
              downloadFile(
                await createPersonalBackup(),
                `社科通识全部个人内容-${new Date().toISOString().slice(0, 10)}.json`,
              );
              const generatedAt = new Date().toISOString();
              setLastGenerated(generatedAt);
              setStatus('备份已生成，请在浏览器下载列表中确认。');
              try {
                localStorage.setItem(LAST_BACKUP_KEY, generatedAt);
              } catch {
                setStatus('备份已生成，请在下载列表确认；浏览器未能记录生成时间。');
              }
            })
          }
        >
          一键备份全部个人内容
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
                  try {
                    const result = await restorePersonalBackup(await file.text());
                    setStatus(
                      `已恢复 ${result.restored} 条；已有或到期的 ${result.skipped} 条未覆盖。`,
                    );
                  } finally {
                    onRestored();
                  }
                });
            }}
          />
        </label>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        备份当前浏览器的个人内容，不含云端或已提交的反馈。旧阅读备份和素材备份也能恢复；只添加缺失条目，保留本机编辑和临时文章的原到期时间。请妥善保管含私人正文的备份文件。
      </p>
      {status && (
        <p role="status" className="text-sm">
          {status}
        </p>
      )}
    </section>
  );
}
