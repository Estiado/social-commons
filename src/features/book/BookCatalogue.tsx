import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import type { BookChapter, BookEntry } from './chapters';
import { filterBookEntries } from './chapters';
import { loadBookCatalogue } from './catalogue';
import { quoteDirectory } from './quoteDirectory';
import {
  captureCatalogueDeparture,
  catalogueArrival,
  type CatalogueDeparture,
} from './catalogueArrival';

gsap.registerPlugin(useGSAP);
const PAGE_SIZE = 8;
const ALL = '~all';
const singlePage = () => window.matchMedia('(max-width: 700px)').matches;
const subscribePageWidth = (changed: () => void) => {
  const media = window.matchMedia('(max-width: 700px)');
  media.addEventListener('change', changed);
  return () => media.removeEventListener('change', changed);
};
export default function BookCatalogue({ chapter }: { chapter: BookChapter }) {
  const narrow = useSyncExternalStore(subscribePageWidth, singlePage, () => false);
  const [params, setParams] = useSearchParams();
  const [entries, setEntries] = useState<BookEntry[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const indexPane = useRef<HTMLDivElement>(null);
  const indexView = useRef<HTMLDivElement>(null);
  const pending = useRef<{
    departure?: CatalogueDeparture;
    returning: boolean;
    key: string;
  } | null>(null);
  const directoryPages = useRef(new Map<string, number>());
  const query = params.get('q') || '';
  const group = params.get('category') || '';
  const filtered = useMemo(() => filterBookEntries(entries, query, ''), [entries, query]);
  const quoteIndex = useMemo(
    () => (chapter.id === 'quotes' ? quoteDirectory(filtered, group) : null),
    [chapter.id, filtered, group],
  );
  const overview = quoteIndex ? !quoteIndex.works : !group;
  const facets = useMemo(() => {
    if (quoteIndex) return quoteIndex.facets;
    const counts = new Map<string, number>();
    filtered.forEach((entry) =>
      entry.groups.forEach((name) => counts.set(name, (counts.get(name) || 0) + 1)),
    );
    return [...counts].map(([name, count]) => ({ name, key: name, count }));
  }, [filtered, quoteIndex]);
  const matches = useMemo(
    () => quoteIndex?.matches || filterBookEntries(entries, query, group === ALL ? '' : group),
    [entries, query, group, quoteIndex],
  );
  const pageSize = overview ? 6 : PAGE_SIZE;
  const pageCount = Math.max(1, Math.ceil((overview ? facets.length : matches.length) / pageSize));
  const page = Math.max(0, Math.min(pageCount - 1, Math.trunc(Number(params.get('page'))) || 0));
  const visible = matches.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const selected =
    matches.find((item) => item.id === params.get('selected')) ||
    (overview ? matches[0] : visible[0]);
  const change = (values: Record<string, string>, replace = true) => {
    const next = new URLSearchParams(params);
    Object.entries(values).forEach(([key, value]) =>
      value ? next.set(key, value) : next.delete(key),
    );
    setParams(next, { replace, preventScrollReset: true });
  };
  const chooseCategory = (name: string, label?: HTMLElement, returning = false) => {
    directoryPages.current.set(group, page);
    pending.current = {
      departure: captureCatalogueDeparture(label),
      returning,
      key: quoteIndex?.key || group,
    };
    change(
      {
        category: name,
        page: returning
          ? String(directoryPages.current.get(name) ?? Number(params.get('directoryPage') || 0))
          : '',
        directoryPage: !quoteIndex && !returning && page ? String(page) : '',
        selected: '',
      },
      returning,
    );
  };
  useGSAP(
    () => {
      const state = pending.current;
      pending.current = null;
      const pane = indexPane.current!;
      // Old lists must not carry their scroll offset or anchoring into a new hierarchy level.
      pane.scrollTop = 0;
      if (pane.getBoundingClientRect().top < 0)
        pane.scrollIntoView({ block: 'start', behavior: 'instant' });
      if (!state) return;
      const returnLabel = state.returning
        ? pane.querySelector<HTMLElement>(`[data-flip-id="${CSS.escape(state.key)}"]`)
        : null;
      const focus = () => {
        const rect = returnLabel?.getBoundingClientRect();
        const bounds = pane.getBoundingClientRect();
        const visible =
          rect && rect.top >= bounds.top && rect.bottom <= Math.min(bounds.bottom, innerHeight);
        const target = visible ? returnLabel?.closest('button') : heading.current;
        target?.focus({ preventScroll: true });
      };
      return catalogueArrival(
        pane,
        indexView.current!,
        state.returning ? returnLabel : heading.current,
        state.departure,
        focus,
      );
    },
    { scope: root, dependencies: [group, page], revertOnUpdate: true },
  );
  useEffect(() => {
    let active = true;
    loadBookCatalogue(chapter.id)
      .then((items) => {
        if (active) {
          setEntries(items);
          setStatus('ready');
        }
      })
      .catch(() => {
        if (active) setStatus('error');
      });
    return () => {
      active = false;
    };
  }, [chapter.id, attempt]);
  return (
    <section
      ref={root}
      className="book-catalogue"
      aria-labelledby="chapter-heading"
      data-book-scene
      data-book-ready={status === 'ready'}
    >
      <div className="book-photo-base" aria-hidden="true">
        <img
          src={narrow ? '/book/materials/book-photo-left.webp' : '/book/materials/book-photo.webp'}
          width={narrow ? 1280 : 2560}
          height="1700"
          alt=""
        />
      </div>
      <header className="book-catalogue-heading">
        <Link to="/" className="book-back-link">
          <ArrowLeft size={17} />
          总目录
        </Link>
        <h1 id="chapter-heading" data-book-letter>
          {chapter.label}
        </h1>
        <Link to={chapter.path + '?view=all'} className="book-all-link">
          {chapter.id === 'essay'
            ? '全部素材与管理'
            : chapter.id === 'guanlan'
              ? '全部事件与资料'
              : '完整目录'}
        </Link>
      </header>
      <div className="book-catalogue-spread">
        <div ref={indexPane} className="book-index-page">
          <div className="book-index-controls" data-tour="book-index-controls">
            <label className="book-index-search">
              <Search size={17} aria-hidden="true" />
              <input
                type="search"
                aria-label={'搜索' + chapter.label}
                placeholder="查找篇目、关键词"
                value={query}
                onChange={(event) => change({ q: event.target.value, page: '', selected: '' })}
              />
            </label>
          </div>
          <div
            key={group + ':' + page}
            ref={indexView}
            className="book-index-view"
            data-book-directory={group || 'root'}
          >
            <div className="book-index-stage">
              {quoteIndex && quoteIndex.ancestors.length > 0 && (
                <nav className="book-quote-path" aria-label="撷英目录路径">
                  {quoteIndex.ancestors.map((ancestor, i) => (
                    <button
                      key={ancestor.key}
                      onClick={() =>
                        chooseCategory(ancestor.key, heading.current || undefined, true)
                      }
                    >
                      {i === 0 ? (
                        <ArrowLeft size={14} aria-hidden="true" />
                      ) : (
                        <span aria-hidden="true">/</span>
                      )}
                      {ancestor.name}
                    </button>
                  ))}
                </nav>
              )}
              {!quoteIndex && !overview && (
                <button
                  className="book-category-back"
                  onClick={() => chooseCategory('', heading.current || undefined, true)}
                >
                  <ArrowLeft size={15} />
                  返回分类目录
                </button>
              )}
              <h2
                ref={heading}
                tabIndex={-1}
                className="book-category-title"
                data-category-label
                data-flip-id={quoteIndex?.key || (overview ? undefined : group)}
              >
                {quoteIndex
                  ? quoteIndex.title
                  : overview
                    ? '分类目录'
                    : group === ALL
                      ? '全部篇目'
                      : group}
              </h2>
            </div>
            {status === 'loading' && (
              <p className="book-index-notice" role="status">
                正在翻到这一章…
              </p>
            )}
            {status === 'error' && (
              <div className="book-index-notice" role="alert">
                <p>篇目未能加载。</p>
                <button
                  onClick={() => {
                    setStatus('loading');
                    setAttempt((value) => value + 1);
                  }}
                >
                  重新加载
                </button>
              </div>
            )}
            {status === 'ready' && (
              <>
                <p className="book-result-count" role="status">
                  {overview
                    ? quoteIndex && !group
                      ? `${facets.length} 卷，${matches.length} 篇`
                      : `${facets.length} 个${quoteIndex?.unit || '分类'}，${quoteIndex ? matches.length : filtered.length} 篇`
                    : `${matches.length} 篇`}
                </p>
                {overview ? (
                  <>
                    <ul className="book-category-list" aria-label={chapter.label + '分类'}>
                      {facets.slice(page * pageSize, (page + 1) * pageSize).map((facet) => (
                        <li key={facet.key}>
                          <button
                            onClick={(event) =>
                              chooseCategory(
                                facet.key,
                                event.currentTarget.querySelector<HTMLElement>(
                                  '[data-category-label]',
                                )!,
                              )
                            }
                          >
                            <span data-category-label data-flip-id={facet.key}>
                              {facet.name}
                            </span>
                            <span className="book-category-count">
                              {facet.count} 篇 <ArrowRight size={16} />
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                    {(!quoteIndex || !group) && (
                      <button
                        className="book-browse-all"
                        onClick={(event) =>
                          chooseCategory(
                            ALL,
                            event.currentTarget.querySelector<HTMLElement>(
                              '[data-category-label]',
                            )!,
                          )
                        }
                      >
                        浏览
                        <span data-category-label data-flip-id={ALL}>
                          全部篇目
                        </span>
                      </button>
                    )}
                  </>
                ) : (
                  <ul className="book-entry-list" aria-label={chapter.label + '篇目'}>
                    {visible.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          aria-pressed={selected?.id === item.id}
                          className={selected?.id === item.id ? 'is-selected' : ''}
                          onClick={() => {
                            change({ selected: item.id });
                            if (window.matchMedia('(max-width: 700px)').matches)
                              preview.current?.scrollIntoView({
                                behavior: window.matchMedia('(prefers-reduced-motion: reduce)')
                                  .matches
                                  ? 'instant'
                                  : 'smooth',
                                block: 'start',
                              });
                          }}
                        >
                          {item.title}
                          <ArrowRight size={16} aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {!filtered.length && (
                  <div className="book-index-notice">
                    <p>没有找到匹配篇目。</p>
                    <button onClick={() => change({ q: '', category: '', page: '', selected: '' })}>
                      清空筛选
                    </button>
                  </div>
                )}
                {(!overview || !!group) && !matches.length && filtered.length > 0 && (
                  <div className="book-index-notice">
                    <p>这个分类下没有匹配篇目。</p>
                    <button onClick={() => chooseCategory('', undefined, true)}>
                      返回分类目录
                    </button>
                  </div>
                )}
                <nav className="book-pagination" aria-label={overview ? '分类分页' : '篇目分页'}>
                  <button
                    aria-label={overview ? '上一页分类' : '上一页篇目'}
                    disabled={!page}
                    onClick={() => change({ page: String(page - 1), selected: '' })}
                  >
                    <ArrowLeft size={17} />
                  </button>
                  <span>
                    {page + 1} / {pageCount}
                  </span>
                  <button
                    aria-label={overview ? '下一页分类' : '下一页篇目'}
                    disabled={page + 1 >= pageCount}
                    onClick={() => change({ page: String(page + 1), selected: '' })}
                  >
                    <ArrowRight size={17} />
                  </button>
                </nav>
              </>
            )}
          </div>
        </div>
        <div ref={preview} className="book-preview-page" aria-live="polite" aria-atomic="true">
          {selected ? (
            <article key={selected.id} className="book-entry-preview">
              <h2>{selected.title}</h2>
              <p className="book-entry-meta">{selected.metadata}</p>
              <p className="book-entry-summary">
                {selected.summary.length > 260
                  ? selected.summary.slice(0, 260) + '…'
                  : selected.summary}
              </p>
              <Link to={selected.path} className="book-read-entry">
                翻开阅读
                <ArrowRight size={19} />
              </Link>
            </article>
          ) : (
            <p className="book-preview-empty">
              {filtered.length ? '请选择一篇阅读' : '清空筛选后继续浏览'}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
