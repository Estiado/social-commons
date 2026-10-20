import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Waves,
  Search,
  Link2,
  ExternalLink,
  Tag,
  Clock,
  User,
  Loader2,
  AlertCircle,
  Newspaper,
  ChevronRight,
  LayoutGrid,
  List,
  Flame,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PRESET_ARTICLES } from '@/data/presetArticles';
import { EXTERNAL_ARTICLES } from '@/data/externalArticles';
import { HOT_TOPICS, matchHotTopic, type HotTopic } from '@/data/hotTopics';

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
  is_external?: boolean;
  hot_topic?: string; // 所属热点话题ID
}

export default function GuanlanPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitUrl, setSubmitUrl] = useState('');
  const [submitTopic, setSubmitTopic] = useState<string>('');
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeHotTopic, setActiveHotTopic] = useState<string>(() => {
    return searchParams.get('hotTopic') || '';
  });
  const [viewMode, setViewMode] = useState<'topics' | 'list'>('topics');

  // 获取文章列表（合并预置文章和用户提交的文章）
  const fetchArticles = useCallback(
    async (query: string, hotTopicId: string): Promise<Article[]> => {
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

        const { data, error } = await dbQuery.limit(100);
        if (error) throw error;
        dbArticles = data || [];
      }

      // 转换预置文章
      const presetArticles: Article[] = PRESET_ARTICLES.map((a) => ({
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

      // 转换外链时评
      const externalArticles: Article[] = EXTERNAL_ARTICLES.map((a) => ({
        id: a.id,
        url: a.url,
        title: a.title,
        author: a.author,
        source: a.source,
        published_at: a.published_at,
        excerpt: a.excerpt,
        tags: a.tags,
        created_at: a.published_at,
        is_external: true,
        hot_topic: a.hot_topic,
      }));

      // 合并所有文章
      const allArticles = [...presetArticles, ...externalArticles, ...dbArticles];

      // 为每篇文章匹配热点话题
      const articlesWithTopic = allArticles.map((a) => {
        const matched = matchHotTopic(a.tags || []);
        return { ...a, hot_topic: matched?.id };
      });

      // 按热点话题筛选
      let filtered = articlesWithTopic;
      if (hotTopicId) {
        filtered = filtered.filter((a) => a.hot_topic === hotTopicId);
      }

      // 按搜索词筛选
      const lowerQuery = query.trim().toLowerCase();
      if (lowerQuery) {
        filtered = filtered.filter((a) => {
          const searchText = `${a.title} ${a.author || ''} ${a.source || ''} ${a.excerpt || ''} ${(a.tags || []).join(' ')}`.toLowerCase();
          return searchText.includes(lowerQuery);
        });
      }

      // 排序：预置文章在前，然后按时间
      filtered.sort((a, b) => {
        if (a.is_preset && !b.is_preset) return -1;
        if (!a.is_preset && b.is_preset) return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      return filtered.slice(0, 60);
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchArticles(searchQuery, activeHotTopic)
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
  }, [fetchArticles, searchQuery, activeHotTopic]);

  // 切换热点话题
  const selectHotTopic = (topicId: string) => {
    setActiveHotTopic(topicId);
    setViewMode('list');
    if (topicId) {
      setSearchParams({ hotTopic: topicId });
    } else {
      setSearchParams({});
    }
  };

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
        // 如果选择了热点话题，将话题关键词添加到文章标签中
        if (submitTopic) {
          const topic = HOT_TOPICS.find((t) => t.id === submitTopic);
          if (topic && result.article_id) {
            // 更新文章标签，添加话题关键词
            await supabase
              .from('articles')
              .update({ tags: [...(result.tags || []), topic.name, ...topic.keywords.slice(0, 2)] })
              .eq('id', result.article_id);
          }
        }
        setSubmitMessage({ type: 'success', text: result.message || '提取成功！已归类到对应话题' });
        setSubmitUrl('');
        setSubmitTopic('');
        // 刷新列表
        const data = await fetchArticles(searchQuery, activeHotTopic);
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

  // 计算每个话题下的文章数量
  const getTopicArticleCount = (topicId: string): number => {
    return articles.filter((a) => a.hot_topic === topicId).length;
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return '';
    }
  };

  const currentTopic = HOT_TOPICS.find((t) => t.id === activeHotTopic);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      {/* 页头 */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Waves className="h-4 w-4 text-accent" />
          <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">Guanlan · 观澜</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-3">观澜</h1>
        <p className="text-muted-foreground max-w-2xl leading-relaxed">
          观水有术，必观其澜。以时事热点为纲，汇聚多家媒体时评，同一事件不同视角，为议论文写作提供鲜活素材。
        </p>
      </div>

      {/* 提交链接表单 */}
      {isSupabaseConfigured && (
        <div className="mb-8 p-5 border border-accent/30 bg-accent/5 rounded-sm">
          <h3 className="font-serif text-lg font-semibold mb-3 flex items-center gap-2">
            <Link2 className="h-4 w-4 text-accent" />
            提交时评链接
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
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
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground shrink-0">归类到话题：</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setSubmitTopic('')}
                  className={`px-2.5 py-1 text-xs rounded-sm transition-colors ${
                    submitTopic === ''
                      ? 'bg-accent/15 text-accent border border-accent/30'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  自动匹配
                </button>
                {HOT_TOPICS.slice(0, 6).map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => setSubmitTopic(topic.id)}
                    className={`px-2.5 py-1 text-xs rounded-sm transition-colors ${
                      submitTopic === topic.id
                        ? 'bg-accent/15 text-accent border border-accent/30'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    {topic.name}
                  </button>
                ))}
              </div>
            </div>
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

      {/* 搜索 + 视图切换 */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索文章标题、摘要、标签..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setViewMode('topics')}
            className={`px-3 py-2 text-xs rounded-sm flex items-center gap-1.5 transition-colors ${
              viewMode === 'topics'
                ? 'bg-accent/15 text-accent border border-accent/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            话题视图
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-2 text-xs rounded-sm flex items-center gap-1.5 transition-colors ${
              viewMode === 'list'
                ? 'bg-accent/15 text-accent border border-accent/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent'
            }`}
          >
            <List className="h-3.5 w-3.5" />
            文章列表
          </button>
        </div>
      </div>

      {/* 话题视图 */}
      {viewMode === 'topics' && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg font-semibold flex items-center gap-2">
              <Flame className="h-5 w-5 text-accent" />
              热点话题
            </h2>
            <span className="text-xs text-muted-foreground">共 {HOT_TOPICS.length} 个话题</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {HOT_TOPICS.map((topic) => {
              const count = getTopicArticleCount(topic.id);
              return (
                <button
                  key={topic.id}
                  onClick={() => selectHotTopic(topic.id)}
                  className="text-left p-5 border border-border/60 bg-card rounded-sm hover:border-accent/40 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-serif text-base font-semibold group-hover:text-accent transition-colors">
                      {topic.name}
                    </h3>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {count} 篇
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                    {topic.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {topic.keywords.slice(0, 3).map((kw) => (
                        <span
                          key={kw}
                          className="text-[10px] px-1.5 py-0.5 bg-muted/60 text-muted-foreground rounded-sm"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 文章列表视图 */}
      {viewMode === 'list' && (
        <div>
          {/* 当前话题标题 */}
          {currentTopic && (
            <div className="mb-6 p-4 bg-accent/5 border border-accent/20 rounded-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-xl font-semibold mb-1">{currentTopic.name}</h2>
                  <p className="text-sm text-muted-foreground">{currentTopic.description}</p>
                </div>
                <button
                  onClick={() => selectHotTopic('')}
                  className="text-xs text-muted-foreground hover:text-accent transition-colors flex items-center gap-1"
                >
                  查看全部话题
                  <ChevronRight className="h-3 w-3 rotate-180" />
                </button>
              </div>
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
              <p className="mb-2">该话题下暂无文章</p>
              <p className="text-xs">提交一个时评链接，自动归类到对应话题</p>
            </div>
          ) : (
            <div className="space-y-4">
              {articles.map((article) => {
                // 外链文章在新标签页打开
                if (article.is_external) {
                  return (
                    <a
                      key={article.id}
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block border border-border/60 bg-card rounded-sm p-6 hover:border-accent/30 hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">时评</Badge>
                            {article.hot_topic && (
                              <Badge variant="outline" className="border-accent/40 text-accent">
                                {HOT_TOPICS.find((t) => t.id === article.hot_topic)?.name}
                              </Badge>
                            )}
                            {article.source && (
                              <Badge variant="outline" className="border-border/60 text-muted-foreground">
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
                              {article.tags.slice(0, 4).map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-muted/60 text-muted-foreground rounded-sm"
                                >
                                  <Tag className="h-3 w-3" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 mt-1 group-hover:text-accent transition-colors" />
                      </div>
                    </a>
                  );
                }

                return (
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
                        {article.hot_topic && (
                          <Badge variant="outline" className="border-accent/40 text-accent">
                            {HOT_TOPICS.find((t) => t.id === article.hot_topic)?.name}
                          </Badge>
                        )}
                        {article.source && (
                          <Badge variant="outline" className="border-border/60 text-muted-foreground">
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
                          {article.tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-muted/60 text-muted-foreground rounded-sm"
                            >
                              <Tag className="h-3 w-3" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 mt-1 group-hover:text-accent transition-colors" />
                  </div>
                </Link>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 底部说明 */}
      <div className="mt-12 p-6 bg-muted/30 border border-border/40 rounded-sm">
        <p className="text-xs text-muted-foreground leading-relaxed">
          观澜以时事热点为纲聚合时评文章。提交链接时系统会自动匹配话题，也可手动选择归类。
          点击文章进入详情页，可逐段阅读并收藏精彩段落。内容版权归原作者和原媒体所有，本站仅作学习交流用途。
        </p>
      </div>
    </div>
  );
}
