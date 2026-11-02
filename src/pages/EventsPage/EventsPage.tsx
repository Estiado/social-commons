import { Link, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { EVENTS } from '@/data/events';
import { HISTORY_MAIN_IDS, HISTORY_READING_PATHS } from '@/data/readingPaths';
import { ReadingPathSection } from '@/features/discovery/ReadingPathSection';
import { weeklyReadingPath } from '@/features/discovery/selection';
import { useChinaDay } from '@/features/briefing/useChinaDay';

const itemsById = new Map(EVENTS.map((item) => [item.id, item]));
const catalogue = EVENTS.map((item) => ({
  item,
  search: [item.title, item.summary, item.category, item.date, item.location]
    .join(' ')
    .toLocaleLowerCase(),
}));

export default function EventsPage() {
  const [params, setParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [catalogueOpen, setCatalogueOpen] = useState(false);
  const query = searchQuery.trim().toLocaleLowerCase();
  const weekly = weeklyReadingPath(HISTORY_READING_PATHS, useChinaDay());
  const path = HISTORY_READING_PATHS.find((item) => item.id === params.get('path')) ?? weekly;
  const filtered = catalogue.filter((entry) => entry.search.includes(query));

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* 页头 */}
      <h1 className="mb-4 font-serif text-3xl font-semibold">群鉴</h1>
      <p className="mb-6 max-w-prose leading-relaxed text-muted-foreground">
        先读清一个事件，再比较它的不同解释。每周推荐一组并读，小案例接在相关主文后面，完整史料与出处仍可展开查看。
      </p>
      {/* 搜索框 */}
      <div data-tour="events-search" className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="search"
          aria-label="搜索全部历史事件"
          placeholder="搜索全部事件、关键词…"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter')
              document.getElementById('history-catalogue-results')?.focus();
          }}
          className="min-h-11 w-full rounded-sm border bg-card pl-10 pr-4 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        />
      </div>
      {!query && (
        <>
          <ReadingPathSection
            path={path}
            paths={HISTORY_READING_PATHS}
            items={itemsById}
            basePath="/events"
            weekly={path.id === weekly.id}
            onSelect={(id) => setParams({ path: id }, { preventScrollReset: true })}
          />
          <section aria-labelledby="history-main-title" className="my-8">
            <h2 id="history-main-title" className="mb-3 font-serif text-xl font-semibold">
              从这些历史长读开始
            </h2>
            <ul className="divide-y">
              {HISTORY_MAIN_IDS.map((id) => {
                const item = itemsById.get(id)!;
                return (
                  <li key={id} className="py-4">
                    <Link
                      className="inline-block py-2 font-serif text-lg font-semibold underline decoration-border underline-offset-4 hover:text-accent"
                      to={`/events/${id}`}
                    >
                      {item.title}
                    </Link>
                    <p className="text-sm leading-7 text-muted-foreground">{item.summary}</p>
                  </li>
                );
              })}
            </ul>
          </section>
        </>
      )}
      {/* 事件列表 */}
      <details className="mt-8 border-t pt-3" open={!!query || catalogueOpen}>
        <summary
          className="min-h-11 cursor-pointer py-3 font-medium"
          onClick={(event) => {
            event.preventDefault();
            if (!query) setCatalogueOpen((open) => !open);
          }}
        >
          全部事件与补充案例（{EVENTS.length} 条）
        </summary>
        {(query || catalogueOpen) && (
          <>
            <p
              id="history-catalogue-results"
              tabIndex={-1}
              role="status"
              className="my-4 text-sm text-muted-foreground focus:outline-none"
            >
              {query
                ? `“${searchQuery.trim()}”找到 ${filtered.length} 条`
                : `共 ${filtered.length} 条，按需要选择`}
              。
            </p>
            <ul className="divide-y">
              {filtered.map(({ item }) => (
                <li key={item.id} className="py-5">
                  <Link
                    to={`/events/${item.id}`}
                    className="inline-block py-2 font-serif text-xl font-semibold underline decoration-border underline-offset-4 hover:text-accent"
                  >
                    {item.title}
                  </Link>
                  <p className="my-2 text-sm text-muted-foreground">
                    {item.date} · {item.location}
                  </p>
                  <p className="max-w-prose leading-8 text-muted-foreground">{item.summary}</p>
                </li>
              ))}
            </ul>
            {!filtered.length && (
              <p className="py-8 text-muted-foreground">
                没有找到匹配事件。可以缩短关键词，或清空搜索查看目录。
              </p>
            )}
          </>
        )}
      </details>
    </div>
  );
}
