import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { listReadingExcerpts } from './guestRepository';
import type { ReadingExcerpt } from './excerpts';
import {
  addCollectionItems,
  collectionDocument,
  collectionsSchema,
  mergeCollections,
  type ReadingCollection,
} from './collections';
import { downloadArticleFile } from './export/assets';

export function ReadingOrganiser({ mode }: { mode: 'excerpts' | 'collections' | 'legacy' }) {
  const [excerpts, setExcerpts] = useState<ReadingExcerpt[]>([]);
  const [loading, setLoading] = useState(true);
  const [stored, setStored] = useLocalStorage<unknown>('reading-collections-v1', []);
  const parsed = useMemo(() => collectionsSchema.safeParse(stored), [stored]);
  const groups = parsed.success ? parsed.data : [];
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [groupId, setGroupId] = useState('');
  const [name, setName] = useState('');
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    listReadingExcerpts()
      .then((items) => {
        if (active) setExcerpts(items);
      })
      .catch((error) => {
        if (active) setNotice(error.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [mode]);
  const edit = (update: (groups: ReadingCollection[]) => ReadingCollection[]) => {
    try {
      setStored((previous) => collectionsSchema.parse(update(collectionsSchema.parse(previous))));
      return true;
    } catch (error) {
      setNotice(error instanceof Error ? error.message : '素材包保存失败');
      return false;
    }
  };
  const current = groups.find((group) => group.id === groupId) || groups[0];
  const byKey = new Map(excerpts.map((item) => [item.key, item]));
  const create = () => {
    if (!name.trim()) {
      setNotice('请填写素材包名称');
      return;
    }
    const group: ReadingCollection = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: '',
      updatedAt: new Date().toISOString(),
      items: [...selected].map((key) => ({ key, note: '' })),
    };
    if (!edit((previous) => [...previous, group])) return;
    setGroupId(group.id);
    setName('');
    setSelected(new Set());
  };
  const exportGroup = async (format: 'docx' | 'pdf') => {
    if (!current) return;
    setBusy(true);
    try {
      const { exportArticle } = await import('./export/articleExport');
      await exportArticle(collectionDocument(current, excerpts), format);
      setNotice('素材包已导出，包含出处与使用备注');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : '导出失败');
    } finally {
      setBusy(false);
    }
  };
  const importLegacy = async () => {
    if (!parsed.success) return;
    setBusy(true);
    setNotice('正在读取本浏览器原有身份的旧资料…');
    try {
      const { importLegacyWorkspace } = await import('./legacyImport');
      const result = await importLegacyWorkspace();
      if (!edit((previous) => mergeCollections(previous, result.collections)))
        throw new Error('文章摘录已保留，但素材包未能写入；请检查浏览器空间后重试。旧版原件保留。');
      setExcerpts(await listReadingExcerpts());
      setNotice(
        `已导入 ${result.documents} 篇摘录文档与 ${result.collections.length} 个素材包；旧版原件保留。`,
      );
    } catch (error) {
      setNotice(error instanceof Error ? error.message : '旧资料导入失败，原件未改变');
    } finally {
      setBusy(false);
    }
  };
  return (
    <section
      aria-label={
        mode === 'excerpts' ? '全部摘录' : mode === 'collections' ? '我的素材包' : '旧资料导入'
      }
      className="my-7 space-y-5"
    >
      {notice && (
        <p role="status" className="rounded-sm border p-3 text-sm">
          {notice}
        </p>
      )}
      {!parsed.success && (
        <p role="alert">素材包备份格式异常，已停止覆盖写入。请先备份浏览器数据并联系维护者。</p>
      )}
      {mode === 'legacy' ? (
        <>
          <h2 className="font-serif text-xl">导入旧段落库与素材包</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            使用本浏览器已有的旧账号身份，只读取属于你的收藏、划线、素材包及备注，复制到当前阅读空间。不创建新账号，不删除或修改旧版原件；重复导入会保留本机已有备注和排序。
          </p>
          <Button disabled={busy || !parsed.success} onClick={() => void importLegacy()}>
            导入我的旧资料
          </Button>
        </>
      ) : loading ? (
        <p role="status">正在读取摘录…</p>
      ) : (
        <>
          {mode === 'excerpts' && (
            <>
              <h2 className="font-serif text-xl">全部摘录 · {excerpts.length}</h2>
              <Input
                aria-label="搜索摘录"
                placeholder="搜索文字、标题、来源…"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <div className="flex flex-wrap gap-3">
                <Input
                  className="max-w-xs"
                  aria-label="新素材包名称"
                  placeholder="新素材包名称"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
                <Button disabled={!parsed.success} onClick={create}>
                  用已选摘录新建素材包
                </Button>
                {groups.length > 0 && (
                  <>
                    <select
                      aria-label="添加到素材包"
                      className="max-w-full rounded border bg-background px-3 py-2 text-sm"
                      value={current?.id}
                      onChange={(event) => setGroupId(event.target.value)}
                    >
                      {groups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                    <Button
                      variant="outline"
                      disabled={!selected.size || !parsed.success}
                      onClick={() => {
                        edit((previous) =>
                          previous.map((group) =>
                            group.id === current.id
                              ? addCollectionItems(group, [...selected])
                              : group,
                          ),
                        );
                        setSelected(new Set());
                      }}
                    >
                      添加已选摘录
                    </Button>
                  </>
                )}
              </div>
              {excerpts
                .filter((item) =>
                  `${item.text} ${item.title} ${item.source}`.includes(search.trim()),
                )
                .map((item) => (
                  <article key={item.key} className="rounded-sm border p-5">
                    <label className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <input
                        type="checkbox"
                        aria-label={`选择摘录：${item.text.slice(0, 30)}`}
                        checked={selected.has(item.key)}
                        onChange={(event) =>
                          setSelected((previous) => {
                            const next = new Set(previous);
                            if (event.target.checked) next.add(item.key);
                            else next.delete(item.key);
                            return next;
                          })
                        }
                      />
                      {item.kind === 'paragraph' ? '段落收藏' : '划线收藏'}
                    </label>
                    <p className="whitespace-pre-wrap font-serif leading-relaxed">{item.text}</p>
                    <Link
                      className="mt-4 inline-block text-sm text-accent underline"
                      to={`/reading/${item.documentId}#reading-${item.blockId}`}
                    >
                      {item.title} · {item.source || '来源待核对'}
                    </Link>
                  </article>
                ))}
              {!excerpts.length && (
                <p className="py-8 text-muted-foreground">
                  在日新、撷英、群鉴或文章正文中收藏一段文字，就会显示在这里。
                </p>
              )}
            </>
          )}
          {mode === 'collections' && (
            <>
              <h2 className="font-serif text-xl">我的素材包</h2>
              <div className="flex flex-wrap gap-3">
                <Input
                  className="max-w-xs"
                  aria-label="新素材包名称"
                  placeholder="新素材包名称"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
                <Button disabled={!parsed.success} onClick={create}>
                  新建素材包
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {groups.map((group) => (
                  <Button
                    key={group.id}
                    size="sm"
                    variant={group.id === current?.id ? 'default' : 'outline'}
                    onClick={() => setGroupId(group.id)}
                  >
                    {group.name} · {group.items.length}
                  </Button>
                ))}
              </div>
              {current ? (
                <article className="space-y-5 rounded-sm border p-5">
                  <Input
                    aria-label="素材包名称"
                    value={current.name}
                    onChange={(event) =>
                      edit((previous) =>
                        previous.map((group) =>
                          group.id === current.id
                            ? {
                                ...group,
                                name: event.target.value,
                                updatedAt: new Date().toISOString(),
                              }
                            : group,
                        ),
                      )
                    }
                  />
                  <div className="flex flex-wrap gap-3">
                    <Button disabled={busy} onClick={() => void exportGroup('docx')}>
                      素材包 Word
                    </Button>
                    <Button
                      variant="outline"
                      disabled={busy}
                      onClick={() => void exportGroup('pdf')}
                    >
                      素材包 PDF
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        downloadArticleFile(
                          new Blob(
                            [
                              JSON.stringify(
                                { schemaVersion: 1, collections: groups, excerpts },
                                null,
                                2,
                              ),
                            ],
                            { type: 'application/json' },
                          ),
                          '阅读空间素材包备份.json',
                          'application/json',
                        )
                      }
                    >
                      备份全部素材包
                    </Button>
                  </div>
                  {current.items.map((reference, index) => {
                    const item = byKey.get(reference.key);
                    return (
                      <section key={reference.key} className="space-y-3 border-t pt-4">
                        <p className="whitespace-pre-wrap font-serif leading-relaxed">
                          {item?.text || '此条摘录已取消收藏或无法读取，请检查原文。'}
                        </p>
                        {item && (
                          <Link
                            className="text-xs text-accent underline"
                            to={`/reading/${item.documentId}#reading-${item.blockId}`}
                          >
                            {item.title}
                          </Link>
                        )}
                        <textarea
                          className="block w-full rounded border bg-background p-3 text-sm"
                          aria-label={`第${index + 1}条摘录的使用备注`}
                          placeholder="我的使用备注"
                          value={reference.note}
                          maxLength={2000}
                          onChange={(event) =>
                            edit((previous) =>
                              previous.map((group) =>
                                group.id === current.id
                                  ? {
                                      ...group,
                                      items: group.items.map((entry) =>
                                        entry.key === reference.key
                                          ? { ...entry, note: event.target.value }
                                          : entry,
                                      ),
                                    }
                                  : group,
                              ),
                            )
                          }
                        />
                        <div className="flex gap-4 text-xs">
                          <button
                            disabled={index === 0}
                            onClick={() =>
                              edit((previous) =>
                                previous.map((group) => {
                                  if (group.id !== current.id) return group;
                                  const items = [...group.items];
                                  [items[index - 1], items[index]] = [
                                    items[index],
                                    items[index - 1],
                                  ];
                                  return { ...group, items };
                                }),
                              )
                            }
                          >
                            上移
                          </button>
                          <button
                            onClick={() =>
                              edit((previous) =>
                                previous.map((group) =>
                                  group.id === current.id
                                    ? {
                                        ...group,
                                        items: group.items.filter(
                                          (entry) => entry.key !== reference.key,
                                        ),
                                      }
                                    : group,
                                ),
                              )
                            }
                          >
                            从素材包移除
                          </button>
                        </div>
                      </section>
                    );
                  })}
                  {!current.items.length && (
                    <Link className="text-sm text-accent underline" to="/reading?tab=excerpts">
                      去摘录中选择内容
                    </Link>
                  )}
                </article>
              ) : (
                <p>还没有素材包，先创建一个主题。</p>
              )}
            </>
          )}
        </>
      )}
    </section>
  );
}
