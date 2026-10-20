import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Feather, Landmark, PenTool, X } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { DAILY_KNOWLEDGE } from '@/data/daily';
import { QUOTES } from '@/data/quotes';
import { EVENTS } from '@/data/events';
import { ESSAY_MATERIALS } from '@/data/essay';

interface SearchResult {
  id: string;
  type: 'daily' | 'quote' | 'event' | 'essay';
  title: string;
  subtitle: string;
  path: string;
}

export function GlobalSearch({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  const search = useCallback((q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    const lower = q.toLowerCase();
    const res: SearchResult[] = [];

    // 搜索日新通识
    DAILY_KNOWLEDGE.forEach((d) => {
      if (
        d.title.toLowerCase().includes(lower) ||
        d.content.toLowerCase().includes(lower) ||
        d.category.toLowerCase().includes(lower) ||
        d.summary.toLowerCase().includes(lower)
      ) {
        res.push({
          id: `daily-${d.id}`,
          type: 'daily',
          title: d.title,
          subtitle: d.category,
          path: `/daily`,
        });
      }
    });

    // 搜索撷英名句
    QUOTES.forEach((q) => {
      if (
        q.text.toLowerCase().includes(lower) ||
        q.author.toLowerCase().includes(lower) ||
        q.source.toLowerCase().includes(lower) ||
        (q.commentary?.text?.toLowerCase().includes(lower) ?? false)
      ) {
        res.push({
          id: `quote-${q.id}`,
          type: 'quote',
          title: q.text,
          subtitle: `${q.author} · ${q.source}`,
          path: `/quotes`,
        });
      }
    });

    // 搜索群鉴事件
    EVENTS.forEach((e) => {
      if (
        e.title.toLowerCase().includes(lower) ||
        e.summary.toLowerCase().includes(lower) ||
        e.category.toLowerCase().includes(lower) ||
        e.perspectives.some((p) => p.title.toLowerCase().includes(lower) || p.description.toLowerCase().includes(lower))
      ) {
        res.push({
          id: `event-${e.id}`,
          type: 'event',
          title: e.title,
          subtitle: e.category,
          path: `/events/${e.id}`,
        });
      }
    });

    // 搜索议论文素材
    ESSAY_MATERIALS.forEach((e) => {
      if (
        e.concept.toLowerCase().includes(lower) ||
        e.description.toLowerCase().includes(lower) ||
        e.category.toLowerCase().includes(lower) ||
        e.applicableTopics.some((t) => t.toLowerCase().includes(lower))
      ) {
        res.push({
          id: `essay-${e.id}`,
          type: 'essay',
          title: e.concept,
          subtitle: e.category,
          path: `/essay`,
        });
      }
    });

    setResults(res.slice(0, 30));
  }, []);

  useEffect(() => {
    search(query);
  }, [query, search]);

  useEffect(() => {
    if (!open) {
      setQuery('');
    }
  }, [open]);

  const handleSelect = (result: SearchResult) => {
    navigate(result.path);
    onOpenChange(false);
  };

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'daily':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'quote':
        return <Feather className="h-4 w-4 text-amber-500" />;
      case 'event':
        return <Landmark className="h-4 w-4 text-rose-500" />;
      case 'essay':
        return <PenTool className="h-4 w-4 text-emerald-500" />;
    }
  };

  const getTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'daily':
        return '日新';
      case 'quote':
        return '撷英';
      case 'event':
        return '群鉴';
      case 'essay':
        return '议论文';
    }
  };

  const dailyResults = results.filter((r) => r.type === 'daily');
  const quoteResults = results.filter((r) => r.type === 'quote');
  const eventResults = results.filter((r) => r.type === 'event');
  const essayResults = results.filter((r) => r.type === 'essay');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden max-w-2xl">
        <Command className="rounded-lg border shadow-md">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <CommandInput
              placeholder="搜索通识、名句、历史事件、议论文素材..."
              value={query}
              onValueChange={setQuery}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <CommandList className="max-h-[400px] overflow-y-auto">
            <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
              未找到相关内容
            </CommandEmpty>
            {dailyResults.length > 0 && (
              <CommandGroup heading="日新 · 通识">
                {dailyResults.map((r) => (
                  <CommandItem
                    key={r.id}
                    value={r.id}
                    onSelect={() => handleSelect(r)}
                    className="flex items-start gap-3 px-4 py-2.5 cursor-pointer"
                  >
                    {getTypeIcon(r.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{r.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{r.subtitle}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {getTypeLabel(r.type)}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {quoteResults.length > 0 && (
              <CommandGroup heading="撷英 · 名句">
                {quoteResults.map((r) => (
                  <CommandItem
                    key={r.id}
                    value={r.id}
                    onSelect={() => handleSelect(r)}
                    className="flex items-start gap-3 px-4 py-2.5 cursor-pointer"
                  >
                    {getTypeIcon(r.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate font-serif">{r.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{r.subtitle}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {getTypeLabel(r.type)}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {eventResults.length > 0 && (
              <CommandGroup heading="群鉴 · 历史事件">
                {eventResults.map((r) => (
                  <CommandItem
                    key={r.id}
                    value={r.id}
                    onSelect={() => handleSelect(r)}
                    className="flex items-start gap-3 px-4 py-2.5 cursor-pointer"
                  >
                    {getTypeIcon(r.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{r.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{r.subtitle}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {getTypeLabel(r.type)}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {essayResults.length > 0 && (
              <CommandGroup heading="议论文素材">
                {essayResults.map((r) => (
                  <CommandItem
                    key={r.id}
                    value={r.id}
                    onSelect={() => handleSelect(r)}
                    className="flex items-start gap-3 px-4 py-2.5 cursor-pointer"
                  >
                    {getTypeIcon(r.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{r.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{r.subtitle}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {getTypeLabel(r.type)}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
          <div className="border-t px-4 py-2 text-[11px] text-muted-foreground flex items-center justify-between">
            <span>输入关键词搜索全站内容</span>
            <span>↑↓ 选择 · Enter 跳转 · Esc 关闭</span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
