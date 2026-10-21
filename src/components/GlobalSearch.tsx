import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Feather, Landmark, PenTool, X } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { SEARCH_INDEX } from '@/data/searchIndex';
import { searchDocuments, type SearchType } from '@/lib/search';

const GROUPS = [
  { type: 'daily', heading: '日新 · 通识', label: '日新', icon: Calendar, color: 'text-blue-500' },
  { type: 'quote', heading: '撷英 · 名句', label: '撷英', icon: Feather, color: 'text-amber-500' },
  { type: 'event', heading: '群鉴 · 历史事件', label: '群鉴', icon: Landmark, color: 'text-rose-500' },
  { type: 'essay', heading: '议论文素材', label: '议论文', icon: PenTool, color: 'text-emerald-500' },
] satisfies { type: SearchType; heading: string; label: string; icon: typeof Search; color: string }[];

export function GlobalSearch({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  // 结果是输入的派生值，无需 effect + 第二份 state，减少一次渲染和过期结果。
  const results = useMemo(() => searchDocuments(SEARCH_INDEX, query), [query]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden max-w-2xl">
        <DialogTitle className="sr-only">全站搜索</DialogTitle>
        <DialogDescription className="sr-only">搜索通识、名句、历史事件和议论文素材。</DialogDescription>
        {/* 已按正文检索完成；禁用 cmdk 按 ID 再过滤，否则中文命中会被隐藏。 */}
        <Command shouldFilter={false} className="rounded-lg border shadow-md">
          <div className="relative">
            <CommandInput className="pr-16" placeholder="搜索通识、名句、历史事件、议论文素材..." value={query} onValueChange={setQuery} />
            {query && <button aria-label="清空搜索" onClick={() => setQuery('')} className="absolute right-10 top-1/2 -translate-y-1/2 p-1 text-muted-foreground"><X className="h-4 w-4" /></button>}
          </div>
          <CommandList className="max-h-[400px] overflow-y-auto">
            <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
              {query.trim() ? '未找到相关内容' : '输入关键词开始搜索'}
            </CommandEmpty>
            {GROUPS.map(({ type, heading, label, icon: Icon, color }) => {
              const items = results.filter((result) => result.type === type);
              if (!items.length) return null;
              return (
                <CommandGroup key={type} heading={heading}>
                  {items.map((result) => (
                    <CommandItem key={result.id} value={result.id} onSelect={() => { navigate(result.path); onOpenChange(false); }} className="flex items-start gap-3 px-4 py-2.5 cursor-pointer">
                      <Icon className={`h-4 w-4 ${color}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{result.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
          </CommandList>
          <div className="border-t px-4 py-2 text-[11px] text-muted-foreground flex items-center justify-between">
            <span>显示前 30 条匹配结果</span><span>↑↓ 选择 · Enter 跳转 · Esc 关闭</span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
