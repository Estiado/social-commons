import { useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { downloadArticleFile } from '@/features/articles/export/assets';
import {
  materialBackupSchema,
  localMaterialsSchema,
  mergeMaterials,
  type LocalMaterial,
  type MaterialFields,
} from './materials';
import { MaterialForm } from './MaterialForm';
import { MaterialCard } from './MaterialCard';
import { RecommendedMaterials } from './RecommendedMaterials';

export function ConceptMaterials({
  conceptId,
  legacy = [],
}: {
  conceptId: string;
  legacy?: MaterialFields[];
}) {
  const [stored, setStored] = useLocalStorage<unknown>('concept-materials-v1', []);
  const result = useMemo(() => localMaterialsSchema.safeParse(stored), [stored]);
  const entries = result.success ? result.data : [];
  const [editing, setEditing] = useState<LocalMaterial | 'new' | null>(null);
  const [notice, setNotice] = useState('');
  const restoreInput = useRef<HTMLInputElement>(null);
  const save = (next: LocalMaterial[]) => {
    localMaterialsSchema.parse(next);
    setStored(next);
    setNotice('已保存到本浏览器');
  };
  return (
    <div className="space-y-7">
      <section aria-label="我的素材" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-serif text-xl font-semibold">我的素材</h3>
          <Button size="sm" disabled={!result.success} onClick={() => setEditing('new')}>
            添加我的素材
          </Button>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          仅保存在当前浏览器，其他访客看不到。换设备或清理浏览器前请备份。
        </p>
        {!result.success && (
          <p role="alert" className="text-sm text-amber-800">
            本机素材格式异常，已停止覆盖写入。请先备份现有数据，再联系维护者。
          </p>
        )}
        {notice && (
          <p role="status" className="text-sm text-accent">
            {notice}
          </p>
        )}
        {entries
          .filter((item) => item.conceptId === conceptId)
          .map((item) => (
            <MaterialCard key={item.id} material={item}>
              <div className="mt-4 flex gap-4 text-xs">
                <button className="underline" onClick={() => setEditing(item)}>
                  编辑我的素材
                </button>
                <button
                  className="text-red-700 underline"
                  onClick={() => {
                    if (!window.confirm('删除这条本地素材？建议先备份。')) return;
                    try {
                      save(entries.filter((entry) => entry.id !== item.id));
                    } catch {
                      setNotice('删除未能保存，本机内容未改变');
                    }
                  }}
                >
                  删除我的素材
                </button>
              </div>
            </MaterialCard>
          ))}
        {!entries.some((item) => item.conceptId === conceptId) && (
          <p className="text-sm text-muted-foreground">
            还没有个人素材，可以摘录文章，也可以写下自己的整理并注明来源。
          </p>
        )}
        {legacy.map((item, index) => (
          <MaterialCard key={`legacy-${index}`} material={item}>
            <button
              className="mt-4 text-xs underline"
              onClick={() =>
                setEditing({
                  ...item,
                  id: crypto.randomUUID(),
                  conceptId,
                  updatedAt: new Date().toISOString(),
                })
              }
            >
              复制到可编辑素材
            </button>
          </MaterialCard>
        ))}
        {editing && (
          <MaterialForm
            key={editing === 'new' ? 'new' : editing.id}
            initial={editing === 'new' ? undefined : editing}
            onCancel={() => setEditing(null)}
            onSave={(fields) => {
              const next = {
                ...fields,
                id: editing === 'new' ? crypto.randomUUID() : editing.id,
                conceptId,
                updatedAt: new Date().toISOString(),
              };
              save([...entries.filter((entry) => entry.id !== next.id), next]);
              setEditing(null);
            }}
          />
        )}
        <div className="flex flex-wrap gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              downloadArticleFile(
                new Blob(
                  [
                    JSON.stringify(
                      { schemaVersion: 1, materials: result.success ? entries : stored },
                      null,
                      2,
                    ),
                  ],
                  { type: 'application/json' },
                ),
                '我的全部概念素材.json',
                'application/json',
              )
            }
          >
            备份我的全部素材
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={!result.success}
            onClick={() => restoreInput.current?.click()}
          >
            从备份恢复
          </Button>
          <input
            ref={restoreInput}
            type="file"
            accept="application/json,.json"
            className="hidden"
            aria-label="选择素材备份"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              event.target.value = '';
              if (!file) return;
              try {
                if (file.size > 5 * 1024 * 1024) throw new Error('备份超过 5 MB，请分批恢复');
                const backup = materialBackupSchema.parse(JSON.parse(await file.text()));
                save(mergeMaterials(entries, backup.materials));
              } catch {
                setNotice('备份无法恢复：请检查文件格式与浏览器剩余空间。原有素材未改变。');
              }
            }}
          />
        </div>
      </section>
      <RecommendedMaterials conceptId={conceptId} />
    </div>
  );
}
