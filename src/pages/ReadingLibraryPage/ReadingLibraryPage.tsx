import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAccount } from '@/features/auth/useAccount';
import {
  listGuestArticles,
  listReadingExcerpts,
  getGuestArticle,
} from '@/features/reading/guestRepository';
import { listCloudArticles, getCloudArticle } from '@/features/reading/cloudRepository';
import type { ReadingSummary } from '@/features/reading/model';
import type { ReadingExcerpt } from '@/features/reading/excerpts';
import { READING_CLOUD_ENABLED } from '@/features/reading/config';
import { BatchExportControls } from '@/features/reading/BatchExportControls';
import { LegacyReadingImport } from '@/features/reading/LegacyReadingImport';
import { getDraft, listDrafts, saveDraft } from '@/features/reading/writing/repository';
import { newDraft, type DraftSummary } from '@/features/reading/writing/model';
import { composeDraft, type WritingSource } from '@/features/reading/writing/compose';
import { migrateLegacyDrafts } from '@/features/reading/writing/legacyDrafts';
import { ReadingBackupControls } from '@/features/reading/ReadingBackupControls';
import { useItemLocation } from '@/hooks/useItemLocation';
import { searchReadingWorkspace } from '@/features/reading/searchRepository';
import type { WorkspaceMatch } from '@/features/reading/searchIndex';
import { SearchText } from '@/features/reading/SearchText';

interface WorkspaceItem {
  key: string;
  id: string;
  kind: 'article' | 'excerpt' | 'draft';
  title: string;
  source: string;
  preview?: string;
  updatedAt: string;
  href: string;
  storage?: 'local' | 'cloud';
}
const EMPTY_MATCHES = new Map<string, WorkspaceMatch>();
export default function ReadingLibraryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const query =
    typeof location.state?.workspaceQuery === 'string'
      ? location.state.workspaceQuery.slice(0, 200)
      : '';
  const [params] = useSearchParams();
  useItemLocation(params.get('tab') === 'legacy' ? 'backup' : null, 'reading');
  const { account, loading: authLoading } = useAccount();
  const [articles, setArticles] = useState<(ReadingSummary & { storage: 'local' | 'cloud' })[]>([]);
  const [excerpts, setExcerpts] = useState<ReadingExcerpt[]>([]);
  const [drafts, setDrafts] = useState<DraftSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [reload, setReload] = useState(0);
  const [search, setSearch] = useState(query);
  const [searchResult, setSearchResult] = useState<{
    key: string;
    matches: Map<string, WorkspaceMatch>;
    error: string;
  } | null>(null);
  const searchKey = `${reload}:${loading}:${query}`;
  const currentResult = query && searchResult?.key === searchKey ? searchResult : null;
  const searchMatches = currentResult?.matches ?? EMPTY_MATCHES;
  const searching = Boolean(query && !currentResult);
  const searchError = currentResult?.error ?? '';
  const resultsRef = useRef<HTMLHeadingElement>(null);
  const [kind, setKind] = useState('all');
  const [selected, setSelected] = useState<string[]>([]);
  const appendId = params.get('append');
  const topicId = params.get('topic');
  useEffect(() => {
    if (!query || loading) return;
    const operation = new AbortController();
    void searchReadingWorkspace(query, operation.signal)
      .then((matches) => {
        if (operation.signal.aborted) return;
        setSearchResult({ key: searchKey, matches, error: '' });
        requestAnimationFrame(() => {
          resultsRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
          resultsRef.current?.focus({ preventScroll: true });
        });
      })
      .catch((error) => {
        if (!operation.signal.aborted) {
          setSearchResult({
            key: searchKey,
            matches: EMPTY_MATCHES,
            error: error instanceof Error ? error.message : '正文检索失败，请重试',
          });
        }
      });
    return () => operation.abort();
  }, [query, searchKey, loading]);
  useEffect(() => {
    if (authLoading) return;
    let active = true;
    void (async () => {
      const [guest, remote, indexed] = await Promise.all([
        listGuestArticles(),
        READING_CLOUD_ENABLED && account ? listCloudArticles() : Promise.resolve([]),
        listReadingExcerpts(),
      ]);
      let migrationError = '';
      try {
        await migrateLegacyDrafts(indexed);
      } catch (error) {
        migrationError = error instanceof Error ? error.message : '旧资料转换未完成，原件保留。';
      }
      const writing = await listDrafts();
      if (!active) return;
      const ids = new Set(remote.map((item) => item.id));
      setArticles([
        ...remote.map((item) => ({ ...item, storage: 'cloud' as const })),
        ...guest
          .filter((item) => !ids.has(item.id))
          .map((item) => ({ ...item, storage: 'local' as const })),
      ]);
      setExcerpts(indexed);
      setDrafts(writing);
      setError(migrationError);
      setLoading(false);
    })().catch((error) => {
      if (active) {
        setError(error.message);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [account, authLoading, reload]);
  const items = useMemo(() => {
    const matchingIds = new Set(
      articles
        .filter((item) => !topicId || item.topicIds?.includes(topicId))
        .map((item) => item.id),
    );
    const entries: WorkspaceItem[] = [
      ...articles
        .filter((item) => matchingIds.has(item.id))
        .map((item) => ({
          key: 'article:' + item.id,
          id: item.id,
          kind: 'article' as const,
          title: item.title,
          source: item.source,
          updatedAt: item.importedAt,
          href: '/reading/' + item.id,
          storage: item.storage,
        })),
      ...excerpts
        .filter((item) => !topicId || matchingIds.has(item.documentId))
        .map((item) => ({
          key: 'excerpt:' + item.key,
          id: item.key,
          kind: 'excerpt' as const,
          title: item.title,
          source: item.source,
          preview: item.text,
          updatedAt: item.createdAt,
          href: '/reading/' + item.documentId + '#reading-' + item.blockId,
        })),
      ...(!topicId
        ? drafts
            .filter((item) => item.id !== appendId)
            .map((item) => ({
              key: 'draft:' + item.id,
              id: item.id,
              kind: 'draft' as const,
              title: item.title,
              source: '我的文稿',
              updatedAt: item.updatedAt,
              href: '/reading/write/' + item.id,
            }))
        : []),
    ];
    return entries.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [articles, excerpts, drafts, topicId, appendId]);
  const byKey = new Map(items.map((item) => [item.key, item]));
  const selectedKeys = new Set(selected);
  const excerptsByKey = new Map(excerpts.map((item) => [item.key, item]));
  const visible = items.filter(
    (item) =>
      (kind === 'all' || item.kind === kind) &&
      (!query ||
        searchMatches.has(item.key) ||
        (item.title + ' ' + item.source + ' ' + (item.preview || ''))
          .toLocaleLowerCase()
          .includes(query.toLocaleLowerCase())),
  );
  const toggle = (key: string, checked: boolean) =>
    setSelected((previous) =>
      checked ? [...new Set([...previous, key])] : previous.filter((item) => item !== key),
    );
  const write = async (empty = false) => {
    setBusy(true);
    setError('');
    try {
      let draft = newDraft();
      if (!empty) {
        const sources: WritingSource[] = [];
        for (const key of selected) {
          const item = byKey.get(key);
          if (!item) throw new Error('部分所选内容已变化，请刷新后重新选择。');
          if (item.kind === 'excerpt') {
            const excerpt = excerptsByKey.get(item.id);
            if (!excerpt) throw new Error('摘录已移除，请重新选择');
            sources.push({ kind: 'excerpt', excerpt });
          } else if (item.kind === 'draft') {
            const value = await getDraft(item.id);
            if (!value) throw new Error('文稿已移除，请重新选择');
            sources.push({ kind: 'draft', document: value.document });
          } else {
            const record =
              item.storage === 'cloud'
                ? await getCloudArticle(item.id)
                : await getGuestArticle(item.id);
            if (!record) throw new Error('文章已到期或移除，请重新导入');
            sources.push({ kind: 'article', document: record.document });
          }
        }
        draft = composeDraft(sources);
        if (appendId) {
          const current = await getDraft(appendId);
          if (!current) throw new Error('原文稿不在此浏览器，请重新打开');
          draft = {
            ...current,
            document: {
              ...current.document,
              blocks: [...current.document.blocks, ...draft.document.blocks].map(
                (block, index) => ({ ...block, id: 'b' + (index + 1) }),
              ),
            },
          };
        }
      }
      const saved = await saveDraft(draft);
      navigate('/reading/write/' + saved.document.id);
    } catch (error) {
      setError(error instanceof Error ? error.message : '文稿创建失败');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="mx-auto max-w-5xl px-5 py-10 md:px-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 data-tour="reading-intro" className="font-serif text-3xl font-semibold">
            我的阅读空间
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled={busy} onClick={() => void write(true)}>
            新建文稿
          </Button>
          <Button asChild>
            <Link to="/reading/import">导入内容</Link>
          </Button>
        </div>
      </div>
      <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
        文章、段落、语句都在这里。勾选需要的内容，合成一份文稿，在网站内编辑后下载 Word 或
        PDF。保存在当前浏览器，无需登录。
      </p>
      {topicId && (
        <p className="mb-4 text-sm text-accent">
          仅显示当前专题的个人内容。
          <Link className="underline" to="/reading">
            查看全部
          </Link>
        </p>
      )}
      {appendId && (
        <p className="mb-4 rounded-sm border p-3 text-sm">
          正在为已打开的文稿继续选材，选好后将追加到原文稿末尾。
        </p>
      )}
      <div className="mb-5 flex flex-wrap gap-2" aria-label="内容类型">
        {[
          ['all', '全部'],
          ['article', '文章'],
          ['excerpt', '段落与语句'],
          ['draft', '文稿'],
        ].map(([key, label]) => (
          <Button
            key={key}
            size="sm"
            variant={kind === key ? 'default' : 'outline'}
            aria-pressed={kind === key}
            onClick={() => setKind(key)}
          >
            {label}
          </Button>
        ))}
      </div>
      <form
        className="flex gap-2"
        data-tour="reading-search"
        onSubmit={(event) => {
          event.preventDefault();
          navigate(location.pathname + location.search, {
            replace: true,
            state: { ...location.state, workspaceQuery: search.trim().slice(0, 200) },
          });
        }}
      >
        <Input
          aria-label="搜索阅读空间"
          placeholder="搜索标题、正文、摘录、来源…"
          maxLength={200}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Button type="submit">搜索</Button>
      </form>
      <section
        aria-label="选材与编排"
        data-tour="reading-selection"
        className="sticky top-16 z-10 my-5 space-y-3 rounded-sm border bg-background/95 p-4 backdrop-blur"
      >
        <div className="flex flex-wrap items-center gap-3">
          <strong className="text-sm">已选 {selected.length} 条</strong>
          <Button disabled={busy || !selected.length} onClick={() => void write()}>
            {appendId ? '添加到当前文稿' : '编成文稿并编辑'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setSelected((previous) => [
                ...new Set([...previous, ...visible.map((item) => item.key)]),
              ])
            }
          >
            全选当前结果
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setSelected([])}>
            清空选择
          </Button>
        </div>
        {selected.length > 0 && (
          <details>
            <summary className="cursor-pointer text-xs text-muted-foreground">调整选材顺序</summary>
            <ol className="mt-3 space-y-2">
              {selected.map((key, index) => (
                <li key={key} className="flex items-center justify-between gap-2 text-sm">
                  <span className="min-w-0 truncate">
                    {index + 1}. {byKey.get(key)?.title || '原内容已变化'}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={index === 0}
                    aria-label={'上移第' + (index + 1) + '项'}
                    onClick={() =>
                      setSelected((previous) => {
                        const next = [...previous];
                        [next[index - 1], next[index]] = [next[index], next[index - 1]];
                        return next;
                      })
                    }
                  >
                    上移
                  </Button>
                </li>
              ))}
            </ol>
          </details>
        )}
      </section>
      {error && (
        <p role="alert" className="mb-5 rounded-sm border border-amber-400 p-4 text-sm">
          {error}
        </p>
      )}
      {searchError && (
        <p role="alert" className="my-4 text-sm text-accent">
          {searchError}
        </p>
      )}
      {loading || searching ? (
        <p role="status" className="py-10">
          {searching ? '正在检索正文…' : '正在读取内容…'}
        </p>
      ) : (
        <div className="space-y-4">
          <h2
            ref={resultsRef}
            tabIndex={-1}
            className="scroll-mt-24 text-sm text-muted-foreground"
            role="status"
          >
            {query ? `“${query}”找到 ${visible.length} 条结果` : `共 ${visible.length} 条内容`}
          </h2>
          {visible.map((item) => {
            const match = searchMatches.get(item.key);
            const href =
              match?.blockId && item.kind === 'article'
                ? `/reading/${item.id}#reading-${match.blockId}`
                : item.href;
            return (
              <article
                key={item.key}
                data-page-enter="item"
                className="rounded-sm border bg-card p-5"
              >
                <label className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    aria-label={'选择：' + item.title + ' · ' + item.kind}
                    checked={selectedKeys.has(item.key)}
                    onChange={(event) => toggle(item.key, event.target.checked)}
                  />
                  {item.kind === 'article' ? '文章' : item.kind === 'draft' ? '文稿' : '段落与语句'}{' '}
                  · {item.source || '来源待核对'}
                </label>
                <Link
                  className="font-serif text-lg font-semibold hover:text-accent"
                  to={href}
                  state={{ readingQuery: query }}
                >
                  <SearchText text={item.title} query={query} />
                </Link>
                {(match?.snippet || item.preview) && (
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                    <SearchText
                      text={match?.snippet || item.preview!.slice(0, 240)}
                      query={query}
                    />
                    {!match && item.preview!.length > 240 ? '…' : ''}
                  </p>
                )}
              </article>
            );
          })}
          {!visible.length && (
            <p className="py-12 text-center text-muted-foreground">
              暂无匹配内容。可以导入文章，或在阅读时选中文字加入这里。
            </p>
          )}
        </div>
      )}
      <details
        id="reading-backup"
        className="mt-10 scroll-mt-20 rounded-sm border p-4"
        open={params.get('tab') === 'legacy'}
      >
        <summary className="cursor-pointer text-sm">数据与备份</summary>
        <p className="mt-3 text-xs text-muted-foreground">
          临时文章先保留 7 天，保存或收藏后长期保留。清理浏览器数据前，请下载完整备份。
        </p>
        <ReadingBackupControls onRestored={() => setReload((value) => value + 1)} />
        <details className="mt-5 border-t pt-4">
          <summary className="cursor-pointer text-sm text-muted-foreground">
            其他导出与旧版资料
          </summary>
          <BatchExportControls ownerId={READING_CLOUD_ENABLED ? account?.id : undefined} />
          <LegacyReadingImport onImported={() => setReload((value) => value + 1)} />
        </details>
      </details>
    </div>
  );
}
