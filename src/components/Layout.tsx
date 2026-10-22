import { lazy, Suspense, useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  Landmark,
  Feather,
  PenTool,
  Waves,
  User,
  Sparkles,
  Search,
} from 'lucide-react';
const GlobalSearch = lazy(() =>
  import('./GlobalSearch').then((module) => ({ default: module.GlobalSearch })),
);
const NAV_ITEMS = [
  { path: '/', label: '首页', icon: BookOpen, end: true },
  { path: '/daily', label: '日新', icon: Calendar },
  { path: '/events', label: '群鉴', icon: Landmark },
  { path: '/quotes', label: '撷英', icon: Feather },
  { path: '/topics', label: '专题', icon: Sparkles },
  { path: '/essay', label: '议论文素材', icon: PenTool },
  { path: '/guanlan', label: '观澜', icon: Waves },
  { path: '/reading', label: '阅读空间', icon: User },
];

export function Layout() {
  const [searchOpen, setSearchOpen] = useState(false);
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
                  `flex items-center gap-1.5 rounded-sm px-3 py-2 text-sm ${isActive ? 'bg-accent/5 text-accent' : 'text-muted-foreground hover:text-foreground'}`
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
          </nav>
          <nav
            aria-label="移动端导航"
            className="flex max-w-[55vw] items-center gap-1 overflow-x-auto lg:hidden"
          >
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
            {NAV_ITEMS.filter((item) => item.path !== '/reading').map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                aria-label={item.label}
                className={({ isActive }) =>
                  `shrink-0 rounded-sm p-2 ${isActive ? 'text-accent' : 'text-muted-foreground'}`
                }
              >
                <item.icon className="h-5 w-5" />
              </NavLink>
            ))}
          </nav>
        </div>
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
