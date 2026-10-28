import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  Landmark,
  Feather,
  PenTool,
  Waves,
  User,
  Search,
  Menu,
  MessageSquare,
} from 'lucide-react';
import { feedbackLink } from '@/features/feedback/navigation';
import { shouldOfferTour } from '@/features/onboarding/preferences';
import { useChinaDay } from '@/features/briefing/useChinaDay';
import { ErrorBoundary } from 'react-error-boundary';
const DailyBriefDialog = lazy(() => import('@/features/briefing/DailyBriefDialog'));
const SiteMotion = lazy(() => import('@/features/motion/SiteMotion'));
const GuidedTour = lazy(() => import('@/features/onboarding/GuidedTour'));
const GlobalSearch = lazy(() =>
  import('./GlobalSearch').then((module) => ({ default: module.GlobalSearch })),
);
const NAV_ITEMS = [
  { path: '/', label: '首页', icon: BookOpen, end: true },
  { path: '/daily', label: '日新', icon: Calendar },
  { path: '/events', label: '群鉴', icon: Landmark },
  { path: '/quotes', label: '撷英', icon: Feather },
  { path: '/essay', label: '议论文素材', icon: PenTool },
  { path: '/guanlan', label: '观澜', icon: Waves },
  { path: '/world', label: '知天下', icon: BookOpen },
  { path: '/reading', label: '阅读空间', icon: User },
];

export function Layout() {
  const main = useRef<HTMLElement>(null);
  const location = useLocation();
  const feedbackPath = feedbackLink(location.pathname, location.search);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [briefOpen, setBriefOpen] = useState(true);
  const day = useChinaDay();
  const [tourOpen, setTourOpen] = useState(() => {
    try {
      return shouldOfferTour(localStorage);
    } catch {
      return false;
    }
  });
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if (tourOpen || briefOpen) return;
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', shortcut);
    return () => window.removeEventListener('keydown', shortcut);
  }, [tourOpen, briefOpen]);
  const openBrief = () => {
    setMobileOpen(false);
    setSearchOpen(false);
    setTourOpen(false);
    setBriefOpen(true);
  };
  const openTour = () => {
    setBriefOpen(false);
    setSearchOpen(false);
    setMobileOpen(false);
    setTourOpen(true);
  };
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header
        data-tour-shell
        className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
          <NavLink to="/" className="group flex shrink-0 items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-primary font-serif text-lg font-bold text-primary-foreground group-hover:bg-accent">
              通
            </span>
            <span className="flex flex-col">
              <span className="font-serif text-lg font-semibold leading-none tracking-wide">
                社科通识
              </span>
              <span className="mt-1 text-[10px] tracking-[0.2em] text-muted-foreground">
                SOCIAL · HUMANITIES
              </span>
            </span>
          </NavLink>
          <nav aria-label="主导航" className="hidden items-center gap-1 xl:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                data-tour={'nav-' + (item.path.slice(1) || 'home')}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex min-h-11 items-center whitespace-nowrap rounded-sm px-2 py-2 text-sm ${isActive ? 'bg-accent/5 text-accent' : 'text-muted-foreground hover:text-foreground'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={openBrief}
              data-tour="nav-briefing"
              className="min-h-11 whitespace-nowrap px-2 text-sm text-accent"
            >
              今日简报
            </button>
            <button
              aria-label="搜索全站"
              data-tour="nav-search"
              onClick={() => setSearchOpen(true)}
              className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-sm px-2 text-sm text-foreground/80 hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
            >
              <Search className="h-4 w-4" />
              <span>搜索</span>
            </button>
            <NavLink
              to={feedbackPath}
              data-tour="nav-feedback"
              className={({ isActive }) =>
                `ml-1 flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-sm border border-accent/30 px-2 py-2 text-sm text-accent hover:bg-accent/5 ${isActive ? 'bg-accent/5' : ''}`
              }
            >
              <MessageSquare className="h-4 w-4" />
              内测反馈
            </NavLink>
          </nav>
          <nav aria-label="移动端导航" className="flex shrink-0 items-center gap-1 xl:hidden">
            <NavLink
              aria-label="我的阅读空间"
              to="/reading"
              className="shrink-0 p-2 text-muted-foreground"
            >
              <User className="h-5 w-5" />
            </NavLink>
            <button
              aria-label="搜索全站"
              data-tour="nav-search"
              className="shrink-0 p-2"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              aria-label="网站栏目"
              aria-expanded={mobileOpen}
              aria-controls="mobile-sections"
              className="p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </nav>
        </div>
        {mobileOpen && (
          <nav
            id="mobile-sections"
            aria-label="网站栏目菜单"
            className="grid grid-cols-3 gap-2 border-t px-5 py-4 xl:hidden"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                data-tour={'nav-' + (item.path.slice(1) || 'home')}
                to={item.path}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `rounded-sm border p-3 text-center text-sm ${isActive ? 'text-accent border-accent' : 'text-muted-foreground'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <button
              type="button"
              data-tour="nav-briefing"
              onClick={openBrief}
              className="rounded-sm border p-3 text-center text-sm text-accent"
            >
              今日简报
            </button>
            <Link
              to={feedbackPath}
              data-tour="nav-feedback"
              onClick={() => setMobileOpen(false)}
              className="rounded-sm border p-3 text-center text-sm text-muted-foreground"
            >
              内测反馈
            </Link>
            <button
              type="button"
              className="rounded-sm border p-3 text-center text-sm text-muted-foreground"
              onClick={() => {
                openTour();
              }}
            >
              使用指引
            </button>
          </nav>
        )}
      </header>
      {location.pathname === '/' && (
        <div className="mx-auto w-full max-w-7xl px-6 pt-6 sm:pt-8">
          <button
            type="button"
            aria-label="打开全站搜索"
            onClick={() => setSearchOpen(true)}
            className="flex min-h-14 w-full items-center gap-3 rounded-sm border border-border bg-card px-4 text-left text-foreground/75 hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:min-h-16 sm:px-5"
          >
            <Search className="h-5 w-5 shrink-0" />
            <span className="min-w-0 flex-1 text-sm sm:text-base">
              搜索事件、名句、概念与写作素材
            </span>
            <span className="hidden text-xs text-foreground/60 md:inline">
              支持栏目、标签与来源筛选
            </span>
            <kbd className="hidden shrink-0 rounded-sm border px-1.5 py-1 text-xs text-foreground/65 lg:inline">
              Ctrl / ⌘ K
            </kbd>
          </button>
        </div>
      )}
      <main ref={main} data-tour-shell className="flex-1">
        <Suspense
          fallback={
            <p role="status" className="p-12 text-center text-muted-foreground">
              正在加载页面…
            </p>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <ErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <SiteMotion root={main} route={location.pathname} paused={briefOpen || tourOpen} />
        </Suspense>
      </ErrorBoundary>
      <footer data-tour-shell className="mt-16 border-t border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="mb-2 font-serif font-semibold">社科通识</p>
          <p className="text-sm text-muted-foreground">以多视角阅读世界，以批判性思维理解历史</p>
          <p className="mt-5 text-xs text-muted-foreground">
            本站内容仅供学习交流，引用请核对原始出处。个人文章与摘录保存在当前浏览器。
          </p>
          <div className="mt-4 flex flex-wrap gap-5 text-sm">
            <button type="button" className="text-accent underline" onClick={openBrief}>
              今日简报
            </button>
            <Link to={feedbackPath} className="text-accent underline">
              内测反馈
            </Link>
            <Link to="/reading?tab=legacy" className="text-muted-foreground underline">
              数据与备份
            </Link>
            <button type="button" className="text-muted-foreground underline" onClick={openTour}>
              使用指引
            </button>
          </div>
        </div>
      </footer>
      {searchOpen && (
        <ErrorBoundary
          fallbackRender={() => (
            <div
              role="alert"
              className="fixed bottom-5 left-5 right-5 z-50 rounded-sm border bg-card p-4 text-sm shadow-md sm:left-auto sm:max-w-sm"
            >
              <p>搜索暂时未加载，请检查网络后刷新页面。</p>
              <button
                className="mt-2 min-h-11 px-2 text-accent underline"
                onClick={() => setSearchOpen(false)}
              >
                关闭提示
              </button>
            </div>
          )}
        >
          <Suspense
            fallback={
              <div
                role="status"
                className="fixed bottom-5 right-5 z-50 rounded-sm border bg-card px-5 py-4 text-sm shadow-md"
              >
                正在准备搜索…
              </div>
            }
          >
            <GlobalSearch open onOpenChange={setSearchOpen} />
          </Suspense>
        </ErrorBoundary>
      )}
      {briefOpen && (
        <ErrorBoundary
          fallbackRender={({ resetErrorBoundary }) => (
            <div
              role="status"
              className="fixed bottom-5 right-5 z-50 max-w-sm bg-card p-6 shadow-lg"
            >
              <p>简报暂时无法打开，其他栏目仍可使用。</p>
              <button
                className="mt-3 text-accent underline"
                onClick={() => {
                  setBriefOpen(false);
                  resetErrorBoundary();
                }}
              >
                继续浏览
              </button>
            </div>
          )}
        >
          <Suspense
            fallback={
              <div role="status" className="fixed bottom-5 right-5 z-50 bg-card p-5">
                <p>正在准备每日简报…</p>
                <button className="mt-2 text-accent underline" onClick={() => setBriefOpen(false)}>
                  先浏览网站
                </button>
              </div>
            }
          >
            <DailyBriefDialog
              day={day}
              onClose={() => setBriefOpen(false)}
              onNavigate={() => {
                setBriefOpen(false);
                setTourOpen(false);
              }}
            />
          </Suspense>
        </ErrorBoundary>
      )}
      {tourOpen && !briefOpen && (
        <Suspense fallback={null}>
          <GuidedTour onClose={() => setTourOpen(false)} onMenuChange={setMobileOpen} />
        </Suspense>
      )}
    </div>
  );
}
