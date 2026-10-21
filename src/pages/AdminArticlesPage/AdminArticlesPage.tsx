import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Trash2, Loader2, AlertCircle, Newspaper, ExternalLink, Clock, User, Eye } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface AdminArticle {
  id: string;
  url: string;
  title: string;
  author: string | null;
  source: string | null;
  published_at: string | null;
  excerpt: string | null;
  tags: string[];
  created_at: string;
  is_public: boolean;
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 获取所有文章
  const fetchArticles = useCallback(async (query: string) => {
    if (!supabase) return;
    try {
      setLoading(true);
      let dbQuery = supabase
        .from('articles')
        .select('id, url, title, author, source, published_at, excerpt, tags, created_at, is_public')
        .order('created_at', { ascending: false });

      if (query.trim()) {
        dbQuery = dbQuery.or(`title.ilike.%${query}%,source.ilike.%${query}%`);
      }

      const { data, error } = await dbQuery.limit(100);
      if (error) throw error;
      setArticles(data || []);
    } catch (err) {
      console.error('获取文章列表失败:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => { void fetchArticles(searchQuery); }, 250);
    return () => clearTimeout(timer);
  }, [fetchArticles, searchQuery]);

  // 删除文章（级联删除段落、收藏，手动删除划线）
  const deleteArticle = async (articleId: string, title: string) => {
    if (!supabase) return;
    if (!confirm(`确定删除文章「${title}」？\n\n相关的段落、收藏、划线都会被删除，此操作不可撤销。`)) return;

    setDeletingId(articleId);
    try {
      // 外键负责级联；返回实际删除行，RLS 拒绝时不能假装成功。
      const { error } = await supabase.from('articles').delete().eq('id', articleId).select('id').single();
      if (error) throw error;

      setArticles((prev) => prev.filter((a) => a.id !== articleId));
    } catch (err) {
      console.error('删除文章失败:', err);
      alert('删除失败，请重试');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-20 text-center">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-amber-600 opacity-70" />
        <p className="text-muted-foreground">文章管理需要配置Supabase数据库后使用</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      {/* 页头 */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Newspaper className="h-4 w-4 text-accent" />
          <span className="text-xs tracking-[0.3em] text-muted-foreground uppercase">Admin · 文章管理</span>
        </div>
        <h1 className="font-serif text-3xl font-semibold mb-2">文章管理</h1>
        <p className="text-muted-foreground text-sm">
          管理观澜库中的所有文章。共 {articles.length} 篇（显示最近100篇）。
        </p>
      </div>

      {/* 搜索 */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="搜索文章标题、来源..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* 文章列表 */}
      {loading ? (
        <div className="text-center py-20 text-muted-foreground">
          <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin" />
          <p>加载中...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border border-dashed border-border/60 rounded-sm">
          <Newspaper className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">没有找到文章</p>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <div
              key={article.id}
              className="group border border-border/60 bg-card rounded-sm p-5 hover:border-accent/20 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {article.source && (
                      <Badge variant="outline" className="border-accent/30 text-accent text-xs">
                        {article.source}
                      </Badge>
                    )}
                    {article.author && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        {article.author}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDate(article.created_at)}
                    </span>
                    {!article.is_public && (
                      <Badge variant="outline" className="border-amber-500/30 text-amber-600 text-xs">
                        未公开
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-serif text-base font-semibold mb-2 line-clamp-1">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{article.excerpt}</p>
                  )}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {article.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-0.5 text-xs bg-muted/60 text-muted-foreground rounded-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <Link
                    to={`/guanlan/${article.id}`}
                    className="p-2 text-muted-foreground hover:text-accent transition-colors"
                    title="查看文章"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-muted-foreground hover:text-accent transition-colors"
                    title="打开原文"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => deleteArticle(article.id, article.title)}
                    disabled={deletingId === article.id}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    title="删除文章"
                  >
                    {deletingId === article.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 底部说明 */}
      <div className="mt-12 p-5 bg-muted/30 border border-border/40 rounded-sm">
        <p className="text-xs text-muted-foreground leading-relaxed">
          删除文章会级联删除相关的段落、收藏和划线。此操作不可撤销，请谨慎操作。
          文章管理页面暂未设置访问权限，请勿公开此页面链接。
        </p>
      </div>
    </div>
  );
}
