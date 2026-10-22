import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { collectionsSchema, mergeCollections } from './collections';
import { listReadingExcerpts } from './guestRepository';
import { migrateLegacyDrafts } from './writing/legacyDrafts';

export function LegacyReadingImport({ onImported }: { onImported: () => void }) {
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const importOld = async () => {
    setBusy(true);
    try {
      const { importLegacyWorkspace } = await import('./legacyImport');
      const result = await importLegacyWorkspace();
      const previous = collectionsSchema.parse(
        JSON.parse(localStorage.getItem('social-commons:reading-collections-v1') || '[]'),
      );
      const groups = mergeCollections(previous, result.collections);
      localStorage.setItem('social-commons:reading-collections-v1', JSON.stringify(groups));
      await migrateLegacyDrafts(await listReadingExcerpts(), groups);
      setNotice('旧资料已加入阅读空间，原有素材包已转为可编辑文稿，旧版原件保留。');
      onImported();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : '旧资料导入失败，原件保留。');
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="my-5 space-y-3">
      <p className="text-sm text-muted-foreground">
        读取这个浏览器原有账号保存的旧资料，复制到阅读空间。旧版原件和本地备份保留。
      </p>
      <Button variant="outline" disabled={busy} onClick={() => void importOld()}>
        {busy ? '正在导入…' : '读取我的旧资料'}
      </Button>
      {notice && (
        <p role="status" className="text-sm">
          {notice}
        </p>
      )}
    </section>
  );
}
