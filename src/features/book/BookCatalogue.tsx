import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react';
import type { BookChapter, BookEntry } from './chapters';
import { filterBookEntries } from './chapters';
import { loadBookCatalogue } from './catalogue';

gsap.registerPlugin(Flip, useGSAP);
const PAGE_SIZE = 8;
const ALL = '~all';
export default function BookCatalogue({ chapter }: { chapter: BookChapter }) {
  const [params, setParams] = useSearchParams();
  const [entries, setEntries] = useState<BookEntry[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const pending = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const pendingId = useRef('');
  const pendingFocus = useRef(false);
  const query = params.get('q') || '';
  const group = params.get('category') || '';
  const overview = !group;
  const filtered = useMemo(() => filterBookEntries(entries, query, ''), [entries, query]);
  const facets = useMemo(() => {
    const counts = new Map<string, number>();
    filtered.forEach((entry) =>
      entry.groups.forEach((name) => counts.set(name, (counts.get(name) || 0) + 1)),
    );
    return [...counts].map(([name, count]) => ({ name, count }));
  }, [filtered]);
  const matches = useMemo(
    () => filterBookEntries(entries, query, group === ALL ? '' : group),
    [entries, query, group],
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
  const chooseCategory = (name: string, label?: HTMLElement) => {
    pendingId.current = name || group;
    pendingFocus.current = true;
    if (label && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      pending.current = Flip.getState(label);
    }
    change(
      {
        category: name,
        page: name ? '' : params.get('directoryPage') || '',
        directoryPage: name ? (page ? String(page) : '') : '',
        selected: '',
      },
      !name,
    );
  };
  useGSAP(
    () => {
      const state = pending.current;
      pending.current = null;
      if (!pendingFocus.current) return;
      pendingFocus.current = false;
      const focus = () => {
        const target = overview
          ? root.current
              ?.querySelector<HTMLElement>(`[data-flip-id="${CSS.escape(pendingId.current)}"]`)
              ?.closest('button')
          : heading.current;
        target?.focus({ preventScroll: true });
      };
      if (!state || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        focus();
        return;
      }
      const labels = root.current!.querySelectorAll('[data-category-label]');
      Flip.from(state, {
        targets: labels,
        scale: true,
        duration: 0.72,
        ease: 'power3.inOut',
        absolute: true,
        onComplete: focus,
      });
      const rows = root.current!.querySelectorAll('.book-entry-list li');
      if (rows.length)
        gsap.from(rows, {
          opacity: 0.2,
          y: 8,
          duration: 0.4,
          stagger: 0.035,
          delay: 0.2,
          clearProps: 'opacity,transform',
        });
    },
    { scope: root, dependencies: [group], revertOnUpdate: true },
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
    >
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
        <div className="book-index-page">
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
          <div className="book-index-stage">
            {!overview && (
              <button
                className="book-category-back"
                onClick={() => chooseCategory('', heading.current || undefined)}
              >
                <ArrowLeft size={15} />
                返回{chapter.id === 'quotes' ? '作者' : '分类'}目录
              </button>
            )}
            <h2
              ref={heading}
              tabIndex={-1}
              className="book-category-title"
              data-category-label
              data-flip-id={overview ? undefined : group}
            >
              {overview
                ? chapter.id === 'quotes'
                  ? '作者目录'
                  : '分类目录'
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
                  ? `${facets.length} 个${chapter.id === 'quotes' ? '作者' : '分类'}，${filtered.length} 篇`
                  : `${matches.length} 篇`}
              </p>
              {overview ? (
                <>
                  <ul className="book-category-list" aria-label={chapter.label + '分类'}>
                    {facets.slice(page * pageSize, (page + 1) * pageSize).map((facet) => (
                      <li key={facet.name}>
                        <button
                          onClick={(event) =>
                            chooseCategory(
                              facet.name,
                              event.currentTarget.querySelector<HTMLElement>(
                                '[data-category-label]',
                              )!,
                            )
                          }
                        >
                          <span data-category-label data-flip-id={facet.name}>
                            {facet.name}
                          </span>
                          <span className="book-category-count">
                            {facet.count} 篇 <ArrowRight size={16} />
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    className="book-browse-all"
                    onClick={(event) => chooseCategory(ALL, event.currentTarget)}
                    data-category-label
                    data-flip-id={ALL}
                  >
                    浏览全部篇目
                  </button>
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
              {!overview && !matches.length && filtered.length > 0 && (
                <div className="book-index-notice">
                  <p>这个分类下没有匹配篇目。</p>
                  <button onClick={() => chooseCategory('')}>返回分类目录</button>
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
            <p className="book-preview-empty">从左页选择一篇</p>
          )}
        </div>
      </div>
    </section>
  );
}
