import { useMemo, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { DAILY_KNOWLEDGE } from '@/data/daily';
import { ContentReader } from '@/features/reading/ContentReader';
import { Input } from '@/components/ui/input';
import { KNOWLEDGE_GROUPS, knowledgeGroup } from '@/data/knowledgeCategories';
import { DAILY_READING_PATHS } from '@/data/readingPaths';
import { ReadingPathSection } from '@/features/discovery/ReadingPathSection';
import { weeklyReadingPath } from '@/features/discovery/selection';
import { useChinaDay } from '@/features/briefing/useChinaDay';

const itemsById = new Map(DAILY_KNOWLEDGE.map((item) => [item.id, item]));

// Catalogue text is normalized once. Keystrokes only filter small descriptors.
const catalogue = DAILY_KNOWLEDGE.map((item) => ({
  item,
  primary: item.category.split(' · ')[0],
  group: knowledgeGroup(item.category.split(' · ')[0]),
  search: [item.title, item.summary, item.content, item.category, item.source]
    .join(' ')
    .toLocaleLowerCase(),
}));
const categories = [
  '全部',
  ...KNOWLEDGE_GROUPS.map((group) => group.name),
  ...(catalogue.some((entry) => entry.group === '其他') ? ['其他'] : []),
];
export default function DailyPage() {
  const [params, setParams] = useSearchParams();
  const weekly = weeklyReadingPath(DAILY_READING_PATHS, useChinaDay());
  const path = DAILY_READING_PATHS.find((item) => item.id === params.get('path')) ?? weekly;
  const [category, setCategory] = useState('全部');
  const [subject, setSubject] = useState('');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState('');
  const [catalogueOpen, setCatalogueOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(18);
  const hasQuery = !!search.trim();
  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return catalogue.filter(
      (entry) =>
        (category === '全部' || entry.group === category) &&
        (!subject || entry.primary === subject) &&
        entry.search.includes(query),
    );
  }, [category, subject, search]);
  if (params.get('id'))
    return <Navigate to={`/daily/${encodeURIComponent(params.get('id')!)}`} replace />;
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 data-tour="daily-intro" className="mb-4 font-serif text-3xl font-semibold">
        日新
      </h1>
      <p className="mb-6 leading-relaxed text-muted-foreground">
        从一个具体问题开始，把相近概念连起来读。时间有限时，先读一组；需要查找时，搜索完整目录。
      </p>
      <Input
        aria-label="搜索通识"
        placeholder="搜索概念、内容、来源…"
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
          setVisibleCount(18);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') document.getElementById('daily-catalogue-results')?.focus();
        }}
      />
      {!hasQuery && (
        <ReadingPathSection
          path={path}
          paths={DAILY_READING_PATHS}
          items={itemsById}
          basePath="/daily"
          weekly={path.id === weekly.id}
          onSelect={(id) => setParams({ path: id }, { preventScrollReset: true })}
        />
      )}
      <details className="mt-7" open={hasQuery || catalogueOpen}>
        <summary
          className="min-h-11 cursor-pointer py-3 font-medium"
          onClick={(event) => {
            event.preventDefault();
            if (!hasQuery) setCatalogueOpen((open) => !open);
          }}
        >
          全部概念与学科筛选（{catalogue.length} 条）
        </summary>
        {(hasQuery || catalogueOpen) && (
          <>
            <div aria-label="通识大类" className="my-5 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
              {categories.map((name) => (
                <button
                  key={name}
                  aria-pressed={category === name}
                  onClick={() => {
                    setCategory(name);
                    setSubject('');
                    setVisibleCount(18);
                  }}
                  className={`rounded-sm border px-3 py-1.5 text-sm ${category === name ? 'border-accent text-accent' : 'text-muted-foreground'}`}
                >
                  {name}
                </button>
              ))}
            </div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                细分类
                <select
                  aria-label="通识细分类"
                  disabled={category === '全部'}
                  className="max-w-48 rounded-sm border bg-background p-2"
                  value={subject}
                  onChange={(event) => {
                    setSubject(event.target.value);
                    setVisibleCount(18);
                  }}
                >
                  <option value="">{category === '全部' ? '先选择领域' : '全部学科'}</option>
                  {[
                    ...new Set(
                      catalogue
                        .filter((entry) => entry.group === category)
                        .map((entry) => entry.primary),
                    ),
                  ].map((name) => (
                    <option key={name}>{name}</option>
                  ))}
                </select>
              </label>
              <span className="text-muted-foreground">共 {filtered.length} 个知识点</span>
            </div>
            <p
              id="daily-catalogue-results"
              tabIndex={-1}
              role="status"
              className="mb-4 text-sm text-muted-foreground focus:outline-none"
            >
              {hasQuery
                ? `“${search.trim()}”找到 ${filtered.length} 条`
                : `当前筛选 ${filtered.length} 条`}
              ，已显示 {Math.min(visibleCount, filtered.length)} 条。
            </p>
            <div className="space-y-5">
              {filtered.slice(0, visibleCount).map(({ item }) => (
                <article key={item.id} data-page-enter="item" className="rounded-sm border bg-card">
                  <button
                    aria-expanded={expanded === item.id}
                    className="block w-full p-6 text-left"
                    onClick={() => setExpanded(expanded === item.id ? '' : item.id)}
                  >
                    <span className="text-xs text-accent">{item.category}</span>
                    <h2 className="my-3 font-serif text-xl font-semibold">{item.title}</h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
                  </button>
                  {expanded === item.id && (
                    <div data-page-enter="panel" className="border-t px-6 py-5">
                      <Link
                        className="mb-5 inline-block text-sm text-accent underline"
                        to={`/daily/${item.id}`}
                      >
                        打开独立页面
                      </Link>
                      <ContentReader kind="daily" id={item.id} />
                    </div>
                  )}
                </article>
              ))}
            </div>
            {filtered.length > visibleCount && (
              <button
                className="my-6 min-h-11 rounded-sm border px-5 text-sm"
                onClick={() => setVisibleCount((count) => count + 18)}
              >
                再显示 18 条
              </button>
            )}
            {!filtered.length && (
              <p className="py-12 text-center text-muted-foreground">没有找到对应内容。</p>
            )}
          </>
        )}
      </details>
    </div>
  );
}
