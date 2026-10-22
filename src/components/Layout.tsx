import { lazy, Suspense, useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, Link } from 'react-router-dom';
import { BookOpen, Calendar, Landmark, Feather, PenTool, Waves, User, Bookmark, FolderOpen, ChevronDown, Sparkles, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
const GlobalSearch = lazy(() => import('./GlobalSearch').then((module) => ({ default: module.GlobalSearch })));

const NAV_ITEMS = [
  { path: '/', label: '首页', icon: BookOpen, end: true },
  { path: '/daily', label: '日新', icon: Calendar },
  { path: '/events', label: '群鉴', icon: Landmark },
  { path: '/quotes', label: '撷英', icon: Feather },
  { path: '/topics', label: '专题', icon: Sparkles },
  { path: '/essay', label: '议论文素材', icon: PenTool },
  { path: '/guanlan', label: '观澜', icon: Waves },
];

export const Layout = () => {
  const location = useLocation();
  const [myMenuOpen, setMyMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const isMyActive = ['/paragraphs', '/collections', '/reading'].some((path) => location.pathname.startsWith(path));

  // 快捷键：Ctrl+K / Cmd+K 打开搜索
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-3 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-primary text-primary-foreground font-serif text-lg font-bold tracking-wider group-hover:bg-accent transition-colors">
                通
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg font-semibold tracking-wide leading-none">社科通识</span>
                <span className="text-[10px] text-muted-foreground tracking-[0.2em] mt-0.5">SOCIAL · HUMANITIES</span>
              </div>
            </NavLink>

            {/* 导航链接 */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = item.end
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path);
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-sm transition-all duration-200',
                      isActive
                        ? 'text-accent bg-accent/5 border-b-2 border-accent'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                );
              })}
              {/* 搜索按钮 */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-sm transition-all duration-200"
              >
                <Search className="h-4 w-4" />
                <span className="hidden lg:inline">搜索</span>
                <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded border border-border/60 bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                  ⌘K
                </kbd>
              </button>
              {/* 我的 - 下拉菜单 */}
              <div className="relative">
                <button
                  onClick={() => setMyMenuOpen(!myMenuOpen)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-sm transition-all duration-200',
                    isMyActive
                      ? 'text-accent bg-accent/5 border-b-2 border-accent'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  <User className="h-4 w-4" />
                  我的
                  <ChevronDown className={cn('h-3 w-3 transition-transform', myMenuOpen && 'rotate-180')} />
                </button>
                {myMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-44 bg-card border border-border/60 rounded-sm shadow-lg z-50 py-1">
                    <Link to="/reading" onClick={() => setMyMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50"><BookOpen className="h-4 w-4" />阅读空间</Link>
                    <Link
                      to="/paragraphs"
                      onClick={() => setMyMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    >
                      <Bookmark className="h-4 w-4" />
                      段落库
                    </Link>
                    <Link
                      to="/collections"
                      onClick={() => setMyMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    >
                      <FolderOpen className="h-4 w-4" />
                      素材包
                    </Link>
                  </div>
                )}
              </div>
            </nav>

            {/* 移动端菜单按钮 - 简化版 */}
            <nav aria-label="移动端导航" className="flex md:hidden items-center gap-1 max-w-[55vw] overflow-x-auto">
              <NavLink to="/reading" aria-label="我的阅读空间" className="shrink-0 p-2 text-muted-foreground"><User className="h-5 w-5" /></NavLink>
              <button aria-label="搜索全站" onClick={() => setSearchOpen(true)} className="shrink-0 p-2 text-muted-foreground">
                <Search className="h-5 w-5" />
              </button>
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = item.end
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path);
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    aria-label={item.label}
                    className={cn(
                      'p-2 rounded-sm transition-colors',
                      isActive ? 'text-accent bg-accent/5' : 'text-muted-foreground'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </NavLink>
                );
              })}
              <NavLink
                to="/paragraphs"
                aria-label="段落库"
                className={cn(
                  'p-2 rounded-sm transition-colors',
                  location.pathname.startsWith('/paragraphs') ? 'text-accent bg-accent/5' : 'text-muted-foreground'
                )}
              >
                <Bookmark className="h-5 w-5" />
              </NavLink>
              <NavLink
                to="/collections"
                aria-label="素材包"
                className={cn(
                  'p-2 rounded-sm transition-colors',
                  location.pathname.startsWith('/collections') ? 'text-accent bg-accent/5' : 'text-muted-foreground'
                )}
              >
                <FolderOpen className="h-5 w-5" />
              </NavLink>
            </nav>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-1">
        <Suspense fallback={<p role="status" className="p-12 text-center text-muted-foreground">正在加载页面…</p>}>
          <Outlet key={location.pathname + location.search} />
        </Suspense>
      </main>

      {/* 底部 */}
      <footer className="border-t border-border/60 mt-16">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="font-serif text-base font-semibold mb-1">社科通识</p>
              <p className="text-sm text-muted-foreground">以多视角阅读世界，以批判性思维理解历史</p>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>内容来源：学术文献 · 史料记载 · 权威研究</p>
              <p>本站内容仅供学习交流，引用请注明出处</p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border/40 text-center text-xs text-muted-foreground">
            读万卷书，行万里路 — 社科通识 · 2026
          </div>
        </div>
      </footer>

      {/* 全站搜索 */}
      {searchOpen && (
        <Suspense fallback={<p role="status" className="fixed bottom-4 right-4 rounded bg-card p-3 shadow">正在加载搜索…</p>}>
          <GlobalSearch open onOpenChange={setSearchOpen} />
        </Suspense>
      )}
    </div>
  );
};
