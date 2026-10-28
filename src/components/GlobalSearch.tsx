import { Fragment, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, SlidersHorizontal, X } from 'lucide-react';
import { Command, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { SEARCH_INDEX } from '@/data/searchIndex';
import {
  searchDocuments,
  searchHighlights,
  type SearchFilters,
  type SearchType,
} from '@/lib/search';

const SECTIONS = [
  { type: 'guanlan-event', label: '观澜', detail: '事件精读' },
  { type: 'world', label: '知天下', detail: '长期时事' },
  { type: 'daily', label: '日新', detail: '通识概念' },
  { type: 'quote', label: '撷英', detail: '诗文与名句' },
  { type: 'event', label: '群鉴', detail: '历史事件' },
  { type: 'essay', label: '议论文素材', detail: '概念与例证' },
] satisfies { type: SearchType; label: string; detail: string }[];
const sectionLabels = new Map(SECTIONS.map((section) => [section.type, section.label]));
const SUGGESTIONS = ['AI 学习', '时间', '苏轼', '青年', '公平', '旅行'];
const PAGE_SIZE = 30;
const controlClass =
  'min-h-11 rounded-sm border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring';

function Highlight({ text, query }: { text: string; query: string }) {
  const ranges = searchHighlights(text, query);
  return (
    <>
      {ranges.map((range, index) => (
        <Fragment key={range.start}>
          {text.slice(ranges[index - 1]?.end ?? 0, range.start)}
          <mark className="rounded-xs bg-accent/10 px-0.5 text-foreground">
            {text.slice(range.start, range.end)}
          </mark>
        </Fragment>
      ))}
      {text.slice(ranges.at(-1)?.end ?? 0)}
    </>
  );
}

export function GlobalSearch({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [advanced, setAdvanced] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const hasFilters = Object.values(filters).some(Boolean);

  // Rank all matches before choosing a section or a displayed batch.
  const allMatches = useMemo(
    () =>
      searchDocuments(
        SEARCH_INDEX,
        query,
        Infinity,
        { ...filters, type: undefined },
        Boolean(filters.type),
      ),
    [query, filters],
  );
  const results = useMemo(
    () => (filters.type ? allMatches.filter((item) => item.type === filters.type) : allMatches),
    [allMatches, filters.type],
  );
  const counts = useMemo(() => {
    const tally = new Map<SearchType, number>();
    for (const item of allMatches) tally.set(item.type, (tally.get(item.type) || 0) + 1);
    return tally;
  }, [allMatches]);
  const facets = useMemo(() => {
    // Offer real catalogue values, including the active choice even when it has no matches.
    const scope = filters.type
      ? SEARCH_INDEX.filter((item) => item.type === filters.type)
      : SEARCH_INDEX;
    const unique = (values: (string | undefined)[]) =>
      [...new Set(values.filter((value): value is string => Boolean(value)))].sort((a, b) =>
        a.localeCompare(b, 'zh-CN'),
      );
    return {
      categories: unique(scope.map((item) => item.category)),
      tags: unique(scope.flatMap((item) => item.tags || [])),
      sources: unique(
        scope.flatMap((item) => (item.sourceNames?.length ? item.sourceNames : [item.source])),
      ),
    };
  }, [filters.type]);
  const updateQuery = (value: string) => {
    setQuery(value.slice(0, 200));
    setVisibleCount(PAGE_SIZE);
  };
  const updateFilters = (next: SearchFilters) => {
    setFilters(next);
    setVisibleCount(PAGE_SIZE);
  };
  const reset = () => {
    updateQuery('');
    updateFilters({});
  };
  const searching = Boolean(query.trim() || hasFilters);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex h-[min(88dvh,820px)] max-h-[90dvh] flex-col gap-0 overflow-hidden p-0 sm:max-w-4xl max-sm:max-w-[calc(100%-1rem)]"
      >
        <button
          type="button"
          aria-label="关闭搜索"
          onClick={() => onOpenChange(false)}
          className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-sm text-foreground/70 hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="shrink-0 px-5 pt-5 pb-4 pr-14 sm:px-7 sm:pt-6">
          <DialogTitle className="font-serif text-2xl font-semibold">全站搜索</DialogTitle>
          <DialogDescription className="mt-2 text-sm leading-relaxed text-foreground/70">
            按词语、作者或主题找材料，先看摘要，再决定读哪一篇。
          </DialogDescription>
        </div>
        <Command
          shouldFilter={false}
          className="min-h-0 flex-1 rounded-none bg-background text-foreground"
        >
          <div className="relative mx-4 shrink-0 rounded-sm border border-border bg-card focus-within:border-accent sm:mx-6 [&_[data-slot=command-input-wrapper]]:h-14 [&_[data-slot=command-input-wrapper]]:border-0 [&_[data-slot=command-input-wrapper]]:px-4">
            <CommandInput
              autoFocus
              aria-label="搜索关键词"
              placeholder="试试“AI 学习”“苏轼”或“公平”"
              className="h-14 pr-12 text-base caret-accent placeholder:text-foreground/70 sm:text-lg"
              value={query}
              onValueChange={updateQuery}
              maxLength={200}
            />
            {query && (
              <button
                type="button"
                aria-label="清空搜索词"
                onClick={() => updateQuery('')}
                className="absolute right-1 top-1 flex h-12 w-12 items-center justify-center rounded-sm text-foreground/70 hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="shrink-0 border-b border-border/70 px-4 pt-3 pb-3 sm:px-6">
            <div
              role="group"
              aria-label="按栏目筛选"
              className="grid grid-cols-4 gap-1 pb-1 sm:flex sm:overflow-x-auto"
            >
              {[{ type: undefined, label: '全部' }, ...SECTIONS].map((section) => {
                const active = filters.type === section.type;
                const count = section.type ? counts.get(section.type) || 0 : allMatches.length;
                return (
                  <button
                    key={section.type || 'all'}
                    type="button"
                    aria-pressed={active}
                    onClick={() => updateFilters({ ...filters, type: section.type })}
                    className={`flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-sm px-2 text-sm focus-visible:outline-2 focus-visible:outline-ring sm:justify-start sm:px-3 ${active ? 'bg-primary text-primary-foreground' : 'text-foreground/70 hover:bg-muted'}`}
                  >
                    {section.label === '议论文素材' ? '议论文' : section.label}
                    {searching && <span className="text-xs tabular-nums opacity-75">{count}</span>}
                  </button>
                );
              })}
            </div>
            <div className="mt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                aria-expanded={advanced}
                aria-controls="global-search-filters"
                onClick={() => setAdvanced(!advanced)}
                className="flex min-h-11 items-center gap-2 rounded-sm text-sm text-foreground/80 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
              >
                <SlidersHorizontal className="h-4 w-4" />
                分类、标签与来源
                {hasFilters && <span className="text-accent">已筛选</span>}
              </button>
              {hasFilters && (
                <button
                  type="button"
                  onClick={() => updateFilters({})}
                  className="min-h-11 rounded-sm px-2 text-sm text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                >
                  清除筛选
                </button>
              )}
            </div>
            {advanced && (
              <div id="global-search-filters" className="grid grid-cols-3 gap-2 pt-2 sm:gap-3">
                {(
                  [
                    ['category', '所属分类', facets.categories],
                    ['tag', '内容标签', facets.tags],
                    ['source', '作者或来源', facets.sources],
                  ] as const
                ).map(([key, label, values]) => (
                  <label
                    key={key}
                    className="flex min-w-0 flex-col gap-1.5 text-xs text-foreground/75"
                  >
                    {label}
                    <select
                      aria-label={label}
                      onKeyDown={(event) => event.stopPropagation()}
                      value={filters[key] || ''}
                      onChange={(event) =>
                        updateFilters({ ...filters, [key]: event.target.value || undefined })
                      }
                      className={`${controlClass} w-full min-w-0 max-w-full`}
                    >
                      <option value="">不限</option>
                      {filters[key] && !values.includes(filters[key]!) && (
                        <option value={filters[key]}>{filters[key]}</option>
                      )}
                      {values.map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="shrink-0 px-5 py-3 text-xs text-foreground/70 sm:px-7"
          >
            {searching
              ? `找到 ${results.length} 条${results.length > visibleCount ? `，先显示 ${visibleCount} 条` : ''} · 按相关程度排列`
              : '覆盖观澜、知天下、日新、撷英、群鉴和议论文素材'}
          </div>
          <CommandList
            aria-label="全站搜索结果"
            className="min-h-0 max-h-none flex-1 overscroll-contain px-2 sm:px-4"
          >
            {!searching ? (
              <div className="px-3 py-4 sm:px-3">
                <p className="mb-3 text-sm font-medium">从一个词语开始</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((word) => (
                    <button
                      key={word}
                      type="button"
                      onClick={() => updateQuery(word)}
                      className={`${controlClass} hover:bg-muted`}
                    >
                      {word}
                    </button>
                  ))}
                </div>
                <p className="mt-6 max-w-lg text-sm leading-7 text-foreground/70">
                  多个词语用空格隔开，例如“AI 学习”。也可以先选栏目，再用分类或标签缩小范围。
                </p>
                <p className="mt-3 text-xs leading-6 text-foreground/70">
                  这里检索公开内容；自己的文章与文稿，请到阅读空间检索。
                </p>
              </div>
            ) : !results.length ? (
              <div className="px-3 py-8 text-center">
                <p className="font-serif text-xl">没有找到匹配内容</p>
                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-foreground/70">
                  试试更短的词语、作品名或作者名；同时选了多个条件时，可以先清除筛选。
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className={`${controlClass} mt-5 hover:bg-muted`}
                >
                  重新搜索
                </button>
              </div>
            ) : (
              results.slice(0, visibleCount).map((result) => (
                <CommandItem
                  key={result.id}
                  value={result.id}
                  onSelect={() => {
                    navigate(result.path);
                    onOpenChange(false);
                  }}
                  className="mb-1 block cursor-pointer rounded-sm border-b border-border/50 px-3 py-4 data-[selected=true]:bg-muted data-[selected=true]:text-foreground sm:px-3 sm:py-5"
                >
                  <div className="flex items-start justify-between gap-3 text-xs leading-5 text-foreground/70">
                    <span className="min-w-0 break-words">
                      {sectionLabels.get(result.type)}
                      {result.category && ` / ${result.category}`}
                    </span>
                    <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  </div>
                  <p className="mt-1.5 break-words font-serif text-lg font-semibold leading-7 sm:text-xl">
                    <Highlight text={result.title} query={query} />
                  </p>
                  {result.summary && (
                    <p className="mt-2 line-clamp-2 break-words text-sm leading-6 text-foreground/80">
                      <Highlight text={result.summary} query={query} />
                    </p>
                  )}
                  <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs leading-5 text-foreground/70">
                    {result.source && (
                      <span className="max-w-full truncate" title={result.source}>
                        {result.source}
                      </span>
                    )}
                    {result.tags?.slice(0, 3).map((tag) => (
                      <span key={tag} className="max-w-full truncate" title={tag}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </CommandItem>
              ))
            )}
            {results.length > visibleCount && (
              <div className="px-3 py-4">
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                  className={`${controlClass} w-full hover:bg-muted`}
                >
                  再显示 {Math.min(PAGE_SIZE, results.length - visibleCount)} 条
                </button>
              </div>
            )}
          </CommandList>
          <div className="flex shrink-0 items-center justify-between gap-3 border-t px-5 py-3 text-xs leading-5 text-foreground/70 sm:px-7">
            <span>点击结果直接阅读</span>
            <span className="hidden sm:inline">↑↓ 选择 · Enter 打开 · Esc 关闭</span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
