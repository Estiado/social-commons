import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Waves, Search, Link2, ExternalLink, Tag, Clock, User, Loader2, AlertCircle, Newspaper } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TOPICS } from '@/data/topics';
import { PRESET_ARTICLES } from '@/data/presetArticles';

interface Article {
  id: string;
  url: string;
  title: string;
  author: string | null;
  source: string | null;
  published_at: string | null;
  excerpt: string | null;
  tags: string[];
  created_at: string;
  is_preset?: boolean;
}

export default function GuanlanPage() {
  const [searchParams] = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitUrl, setSubmitUrl] = useState('');
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSource, setActiveSource] = useState<string>('全部');
  const [activeTopic, setActiveTopic] = useState<string>(() => {
    // 从URL参数读取初始话题
    const topicParam = searchParams.get('topic');
    return topicParam || '全部';
  });

  // 获取文章列表（合并预置文章和用户提交的文章）
  const fetchArticles = useCallback(
    async (query: string, source: string, topic: string): Promise<Article[]> => {
      let dbArticles: Article[] = [];

      if (supabase) {
        let dbQuery = supabase
          .from('articles')
          .select('id, url, title, author, source, published_at, excerpt, tags, created_at')
          .eq('is_public', true)
          .order('created_at', { ascending: false });

        if (query.trim()) {
          dbQuery = dbQuery.or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,tags.cs.{${query}}`);
        }

        if (source !== '全部') {
          dbQuery = dbQuery.eq('source', source);
        }

        if (topic !== '全部') {
          dbQuery = dbQuery.contains('tags', [topic]);
        }

        const { data, error } = await dbQuery.limit(50);
        if (error) throw error;
        dbArticles = data || [];
      }

      // 筛选预置文章
      const lowerQuery = query.trim().toLowerCase();
      const presetArticles: Article[] = PRESET_ARTICLES.filter((a) => {
        if (source !== '全部' && a.source !== source) return false;
        if (topic !== '全部' && !a.tags.includes(topic)) return false;
        if (lowerQuery) {
          const searchText = `${a.title} ${a.author} ${a.source} ${a.excerpt} ${a.tags.join(' ')}`.toLowerCase();
          if (!searchText.includes(lowerQuery)) return false;
        }
        return true;
      }).map((a) => ({
        id: a.id,
        url: a.url,
        title: a.title,
        author: a.author,
        source: a.source,
        published_at: a.published_at,
        excerpt: a.excerpt,
        tags: a.tags,
        created_at: a.published_at,
        is_preset: true,
      }));

      // 合并并按时间排序（预置文章在前，因为是经典内容）
      const allArticles = [...presetArticles, ...dbArticles];
      allArticles.sort((a, b) => {
        // 预置文章优先
        if (a.is_preset && !b.is_preset) return -1;
        if (!a.is_preset && b.is_preset) return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      return allArticles.slice(0, 60);
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    fetchArticles(searchQuery, activeSource, activeTopic)
      .then((data) => {
        if (!cancelled) setArticles(data);
      })
      .catch((err) => console.error('获取文章失败:', err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchArticles, searchQuery, activeSource, activeTopic]);

  // 提交链接
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitUrl.trim()) return;

    setSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch('/.netlify/functions/extract-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: submitUrl.trim() }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitMessage({ type: 'success', text: result.message || '提取成功！' });
        setSubmitUrl('');
        // 刷新列表
        const data = await fetchArticles(searchQuery, activeSource, activeTopic);
        setArticles(data);
      } else {
        setSubmitMessage({ type: 'error', text: result.error || '提取失败，请检查链接是否正确' });
      }
    } catch {
      setSubmitMessage({ type: 'error', text: '网络错误，请稍后重试' });
    } finally {
      setSubmitting(false);
    }
  };

  // 获取所有来源媒体
  const sources = ['全部', ...Array.from(new Set(articles.map((a) => a.source).filter(Boolean) as string[]))];

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* 页头 */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Waves className="h-4 w-4 text-accent" />
          <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">Guanlan · 观澜</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-3">观澜</h1>
        <p className="text-muted-foreground max-w-2xl leading-relaxed">
          观水有术，必观其澜。汇聚主流媒体时评，按话题分类整理，为议论文写作提供鲜活的时事素材。
          提交文章链接，自动提取标题、摘要和来源，点击跳原文阅读。
        </p>
      </div>

      {/* Supabase 未配置提示 */}
      {!isSupabaseConfigured && (
        <div className="mb-8 p-5 border border-amber-500/30 bg-amber-500/5 rounded-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-800 mb-1">观澜功能需要配置数据库</h3>
              <p className="text-sm text-amber-700 leading-relaxed">
                当前为纯静态模式，观澜的文章提交和存储功能暂不可用。
                请配置 Supabase 环境变量（<code className="bg-amber-100 px-1 rounded">VITE_SUPABASE_URL</code> 和{' '}
                <code className="bg-amber-100 px-1 rounded">VITE_SUPABASE_ANON_KEY</code>）后即可使用。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 提交链接表单 */}
      {isSupabaseConfigured && (
        <div className="mb-8 p-5 border border-accent/30 bg-accent/5 rounded-sm">
          <h3 className="font-serif text-lg font-semibold mb-3 flex items-center gap-2">
            <Link2 className="h-4 w-4 text-accent" />
            提交时评链接
          </h3>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <Input
              type="url"
              placeholder="粘贴文章链接，如 https://www.thepaper.cn/newsDetail_..."
              value={submitUrl}
              onChange={(e) => setSubmitUrl(e.target.value)}
              className="flex-1"
              disabled={submitting}
            />
            <Button type="submit" disabled={submitting || !submitUrl.trim()} className="gap-2">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Newspaper className="h-4 w-4" />}
              提取文章
            </Button>
          </form>
          {submitMessage && (
            <p
              className={`mt-3 text-sm ${
                submitMessage.type === 'success' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {submitMessage.text}
            </p>
          )}
        </div>
      )}

      {/* 搜索 + 来源筛选 */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索标题、摘要、标签..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* 话题筛选 */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
          <Tag className="h-3 w-3" />
          按话题筛选
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTopic('全部')}
            className={`px-3 py-1 text-xs rounded-sm transition-colors ${
              activeTopic === '全部'
                ? 'bg-accent/15 text-accent border border-accent/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            全部话题
          </button>
          {TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setActiveTopic(topic.name)}
              className={`px-3 py-1 text-xs rounded-sm transition-colors ${
                activeTopic === topic.name
                  ? 'bg-accent/15 text-accent border border-accent/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {topic.name}
            </button>
          ))}
        </div>
      </div>

      {/* 来源筛选 */}
      {sources.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {sources.map((source) => (
            <button
              key={source}
              onClick={() => setActiveSource(source)}
              className={`px-3 py-1 text-xs rounded-sm transition-colors ${
                activeSource === source
                  ? 'bg-accent/15 text-accent border border-accent/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {source}
            </button>
          ))}
        </div>
      )}

      {/* 文章列表 */}
      {loading ? (
        <div className="text-center py-20 text-muted-foreground">
          <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin" />
          <p>加载中...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Waves className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>{isSupabaseConfigured ? '暂无文章，提交一个链接开始吧' : '配置数据库后即可使用'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <Link
              key={article.id}
              to={article.is_preset ? `/guanlan/preset/${article.id}` : `/guanlan/${article.id}`}
              className="block border border-border/60 bg-card rounded-sm p-6 hover:border-accent/30 hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    {article.is_preset && (
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200">经典</Badge>
                    )}
                    {article.source && (
                      <Badge variant="outline" className="border-accent/30 text-accent">
                        {article.source}
                      </Badge>
                    )}
                    {article.author && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        {article.author}
                      </span>
                    )}
                    {(article.published_at || article.created_at) && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDate(article.published_at || article.created_at)}
                      </span>
                    )}
                  </div>
                  <h2 className="font-serif text-lg font-semibold mb-2 group-hover:text-accent transition-colors">
                    {article.title}
                  </h2>
                  {article.excerpt && (
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                      {article.excerpt}
                    </p>
                  )}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {article.tags.slice(0, 5).map((tag) => (
                        <button
                          key={tag}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setActiveTopic(tag);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-muted/60 text-muted-foreground rounded-sm hover:bg-accent/10 hover:text-accent transition-colors"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 mt-1 group-hover:text-accent transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* 底部说明 */}
      <div className="mt-12 p-6 bg-muted/30 border border-border/40 rounded-sm">
        <p className="text-xs text-muted-foreground leading-relaxed">
          观澜聚合时评文章元数据。点击卡片进入文章详情，可逐段阅读并收藏精彩段落。原文链接在详情页顶部，点击跳转原文阅读。
          内容版权归原作者和原媒体所有，本站仅作学习交流用途。
        </p>
      </div>
    </div>
  );
}
