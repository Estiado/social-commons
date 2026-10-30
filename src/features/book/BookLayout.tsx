import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { BookOpen, Menu, Search, X } from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';
import { RouteArrival } from '@/components/RouteArrival';
import { feedbackLink } from '@/features/feedback/navigation';
import { useChinaDay } from '@/features/briefing/useChinaDay';
import { BookMotion } from './BookMotion';
import { BOOK_CHAPTERS, chapterForPath, showBookCatalogue } from './chapters';
import { BOOK_TOUR_ROUTES } from './tour';
import './book.css';

const BookCatalogue = lazy(() => import('./BookCatalogue'));
const DailyBriefDialog = lazy(() => import('@/features/briefing/DailyBriefDialog'));
const GuidedTour = lazy(() => import('@/features/onboarding/GuidedTour'));
const GlobalSearch = lazy(() =>
  import('@/components/GlobalSearch').then((module) => ({ default: module.GlobalSearch })),
);

export function Layout() {
  const location = useLocation();
  const main = useRef<HTMLElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [briefOpen, setBriefOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const day = useChinaDay();
  const chapter = chapterForPath(location.pathname);
  const catalogue = showBookCatalogue(location.pathname, location.search);
  const home = location.pathname === '/';
  const changeSearch = useCallback((open: boolean) => {
    if (open) opener.current = document.activeElement as HTMLElement | null;
    setMenuOpen(false);
    setSearchOpen(open);
    if (!open) requestAnimationFrame(() => opener.current?.focus({ preventScroll: true }));
  }, []);
  useEffect(() => {
    const keys = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === 'k' &&
        !briefOpen &&
        !tourOpen
      ) {
        event.preventDefault();
        changeSearch(true);
      }
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', keys);
    return () => window.removeEventListener('keydown', keys);
  }, [briefOpen, tourOpen, changeSearch]);
  const openBrief = () => {
    setSearchOpen(false);
    setTourOpen(false);
    setMenuOpen(false);
    setBriefOpen(true);
  };
  const openTour = () => {
    setSearchOpen(false);
    setBriefOpen(false);
    setMenuOpen(false);
    setTourOpen(true);
  };

  return (
    <div className={'book-site' + (home ? ' book-site-home' : '')}>
      <RouteArrival paused={tourOpen} />
      <a href="#main-content" className="skip-link">
        跳到正文
      </a>
      <BookMotion>
        <header className="book-header" data-tour-shell>
          <Link to="/" className="book-brand" aria-label="社科通识总目录">
            社科通识
          </Link>
          <div className="book-header-actions">
            {!home && (
              <Link to="/" className="book-header-contents">
                总目录
              </Link>
            )}
            <button
              className="book-search-button"
              type="button"
              onClick={() => changeSearch(true)}
              data-tour="nav-search"
            >
              <Search size={18} />
              <span>搜索</span>
            </button>
            <NavLink
              to="/reading"
              aria-label="阅读空间"
              data-tour="nav-reading"
              className="book-library-link"
            >
              <BookOpen size={18} />
              <span>阅读空间</span>
            </NavLink>
            <button
              className="book-menu-toggle"
              type="button"
              aria-label="网站栏目"
              aria-expanded={menuOpen}
              aria-controls="book-section-menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
          {menuOpen && (
            <nav id="book-section-menu" className="book-section-menu" aria-label="网站栏目菜单">
              {BOOK_CHAPTERS.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  data-tour={'nav-' + item.id}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
              <button type="button" onClick={openBrief}>
                今日简报
              </button>
              <Link
                to={feedbackLink(location.pathname, location.search)}
                onClick={() => setMenuOpen(false)}
              >
                内测反馈
              </Link>
            </nav>
          )}
        </header>
        {!home && (
          <nav className="book-section-tabs" aria-label="章节导航">
            {BOOK_CHAPTERS.map((item) => (
              <NavLink key={item.id} to={item.path} data-tour={'nav-' + item.id}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}
        <main
          ref={main}
          id="main-content"
          data-book-path={location.pathname}
          tabIndex={-1}
          className={
            home ? 'book-home-main' : catalogue ? 'book-catalogue-main' : 'book-reading-main'
          }
        >
          <Suspense
            fallback={
              <div className="book-loading" data-book-loading role="status">
                正在翻开书页…
              </div>
            }
          >
            {catalogue && chapter ? (
              <BookCatalogue key={chapter.id} chapter={chapter} />
            ) : (
              <Outlet />
            )}
          </Suspense>
        </main>
        <footer className="book-footer" data-tour-shell>
          <span>独立预览</span>
          <div>
            {home && (
              <a
                href="https://commons.wikimedia.org/wiki/File:NLC892-312002092935-327932_千字文_清道光二十六年刻本.pdf"
                target="_blank"
                rel="noopener noreferrer"
                data-no-book-turn
              >
                纸面出处
              </a>
            )}
            <button onClick={openBrief} type="button" data-tour="book-briefing">
              今日简报
            </button>
            <Link to={feedbackLink(location.pathname, location.search)} data-tour="nav-feedback">
              内测反馈
            </Link>
            <button onClick={openTour} type="button">
              使用指引
            </button>
            <a href="https://social-commons.pages.dev" data-no-book-turn>
              返回正式版
            </a>
          </div>
        </footer>
      </BookMotion>
      <ErrorBoundary
        fallback={
          <p className="book-overlay-error" role="alert">
            界面暂未加载，请刷新后重试。
          </p>
        }
      >
        <Suspense
          fallback={
            <div className="book-overlay-error" role="status">
              正在准备…
            </div>
          }
        >
          {searchOpen && <GlobalSearch open onOpenChange={changeSearch} />}
          {briefOpen && (
            <DailyBriefDialog
              day={day}
              onClose={() => setBriefOpen(false)}
              onNavigate={() => {
                setBriefOpen(false);
                setTourOpen(false);
              }}
            />
          )}
          {tourOpen && (
            <GuidedTour
              routes={BOOK_TOUR_ROUTES}
              onClose={() => setTourOpen(false)}
              onMenuChange={setMenuOpen}
            />
          )}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
