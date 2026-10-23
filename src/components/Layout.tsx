import { lazy, Suspense, useEffect, useState } from 'react';
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
  { path: '/reading', label: '阅读空间', icon: User },
];

export function Layout() {
  const location = useLocation();
  const feedbackPath = '/feedback?page=' + encodeURIComponent(location.pathname);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', shortcut);
    return () => window.removeEventListener('keydown', shortcut);
  }, []);
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
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
          <nav aria-label="主导航" className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 whitespace-nowrap rounded-sm px-2 py-2 text-sm ${isActive ? 'bg-accent/5 text-accent' : 'text-muted-foreground hover:text-foreground'}`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
            <button
              aria-label="搜索全站"
              onClick={() => setSearchOpen(true)}
              className="p-2 text-muted-foreground"
            >
              <Search className="h-4 w-4" />
            </button>
            <NavLink
              to={feedbackPath}
              className={({ isActive }) =>
                `ml-1 flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-sm border border-accent/30 px-2 py-2 text-sm text-accent hover:bg-accent/5 ${isActive ? 'bg-accent/5' : ''}`
              }
            >
              <MessageSquare className="h-4 w-4" />
              内测反馈
            </NavLink>
          </nav>
          <nav aria-label="移动端导航" className="flex shrink-0 items-center gap-1 lg:hidden">
            <NavLink
              aria-label="我的阅读空间"
              to="/reading"
              className="shrink-0 p-2 text-muted-foreground"
            >
              <User className="h-5 w-5" />
            </NavLink>
            <button
              aria-label="搜索全站"
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
            className="grid grid-cols-3 gap-2 border-t px-5 py-4 lg:hidden"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
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
            <Link
              to={feedbackPath}
              onClick={() => setMobileOpen(false)}
              className="rounded-sm border p-3 text-center text-sm text-muted-foreground"
            >
              内测反馈
            </Link>
          </nav>
        )}
      </header>
      <main className="flex-1">
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
      <footer className="mt-16 border-t border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="mb-2 font-serif font-semibold">社科通识</p>
          <p className="text-sm text-muted-foreground">以多视角阅读世界，以批判性思维理解历史</p>
          <p className="mt-5 text-xs text-muted-foreground">
            本站内容仅供学习交流，引用请核对原始出处。个人文章与摘录保存在当前浏览器。
          </p>
          <div className="mt-4 flex gap-5 text-sm">
            <Link to={feedbackPath} className="text-accent underline">
              内测反馈
            </Link>
            <Link to="/reading?tab=legacy" className="text-muted-foreground underline">
              数据与备份
            </Link>
          </div>
        </div>
      </footer>
      {searchOpen && (
        <Suspense fallback={null}>
          <GlobalSearch open onOpenChange={setSearchOpen} />
        </Suspense>
      )}
    </div>
  );
}
