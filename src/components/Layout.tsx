import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { BookOpen, Calendar, Landmark, Feather } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { path: '/', label: '首页', icon: BookOpen, end: true },
  { path: '/daily', label: '每日通识', icon: Calendar },
  { path: '/events', label: '事件精读', icon: Landmark },
  { path: '/quotes', label: '每日一句', icon: Feather },
];

export const Layout = () => {
  const location = useLocation();

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
            </nav>

            {/* 移动端菜单按钮 - 简化版 */}
            <nav className="flex md:hidden items-center gap-2">
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
                      'p-2 rounded-sm transition-colors',
                      isActive ? 'text-accent bg-accent/5' : 'text-muted-foreground'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-1">
        <Outlet />
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
    </div>
  );
};
