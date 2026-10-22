import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Newspaper,
  Calendar,
  Feather,
  ChevronRight,
  Loader2,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { TOPIC_SPECIALS } from '@/data/topicSpecials';
import { ContentReader } from '@/features/reading/ContentReader';
import { DAILY_KNOWLEDGE } from '@/data/daily';
import { QUOTES } from '@/data/quotes';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';

interface RelatedArticle {
  id: string;
  title: string;
  source: string | null;
  excerpt: string | null;
  tags: string[];
  created_at: string;
}

export default function TopicDetailPage() {
  const { id } = useParams<{ id: string }>();
  const topic = TOPIC_SPECIALS.find((t) => t.id === id);

  const [articles, setArticles] = useState<RelatedArticle[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(Boolean(supabase));

  // 查找相关的日新通识
  const relatedDaily = DAILY_KNOWLEDGE.filter((d) => topic?.relatedDailyIds.includes(d.id));

  // 查找相关的撷英名句
  const relatedQuotes = QUOTES.filter((q) => topic?.relatedQuoteIds.includes(q.id));

  // 查询相关话题标签的文章
  useEffect(() => {
    if (!supabase || !isSupabaseConfigured || !topic) {
      return;
    }

    const fetchArticles = async () => {
      try {
        // 用第一个话题标签查询
        const tag = topic.relatedTags[0];
        const { data, error } = await supabase
          .from('articles')
          .select('id, title, source, excerpt, tags, created_at')
          .eq('is_public', true)
          .contains('tags', [tag])
          .order('created_at', { ascending: false })
          .limit(10);
        if (!error && data) {
          setArticles(data);
        }
      } catch (err) {
        console.error('获取专题文章失败:', err);
      } finally {
        setArticlesLoading(false);
      }
    };

    fetchArticles();
  }, [topic]);

  if (!topic) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground mb-4">专题不存在</p>
        <Link to="/topics" className="text-accent hover:underline">
          返回专题列表
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* 返回按钮 */}
      <Link
        to="/topics"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        返回专题列表
      </Link>

      {/* 专题头部 */}
      <header
        className={`mb-12 p-8 md:p-10 border border-border/60 rounded-sm bg-gradient-to-br ${topic.color}`}
      >
        <div className="flex items-center gap-2 mb-4">
          {topic.relatedTags.map((tag) => (
            <Badge key={tag} variant="outline" className="border-accent/30 text-accent">
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-3">{topic.name}</h1>
        <ContentReader kind="topic" id={topic.id} />
      </header>

      {/* 相关时评 */}
      <section className="mb-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Newspaper className="h-4 w-4 text-accent" />
              <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                时评素材
              </span>
            </div>
            <h2 className="font-serif text-2xl font-semibold">相关时评</h2>
          </div>
          <Link
            to={`/guanlan?topic=${encodeURIComponent(topic.relatedTags[0])}`}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            查看全部 <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {articlesLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            <Loader2 className="h-6 w-6 mx-auto mb-3 animate-spin" />
            <p className="text-sm">加载中...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border border-dashed border-border/60 rounded-sm">
            <Newspaper className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm mb-2">该话题暂无相关时评</p>
            <Link to="/guanlan" className="text-sm text-accent hover:underline">
              去观澜提交相关文章 →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {articles.map((article) => (
              <Link
                key={article.id}
                to={`/guanlan/${article.id}`}
                className="group block border border-border/60 bg-card p-5 rounded-sm hover:border-accent/30 hover:bg-accent/5 transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  {article.source && (
                    <span className="text-xs px-2 py-0.5 bg-accent/10 text-accent rounded-sm">
                      {article.source}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {new Date(article.created_at).toLocaleDateString('zh-CN', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <h3 className="font-serif text-base font-semibold group-hover:text-accent transition-colors line-clamp-2">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {article.excerpt}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 相关通识 */}
      {relatedDaily.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="h-4 w-4 text-accent" />
            <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
              通识素材
            </span>
          </div>
          <h2 className="font-serif text-2xl font-semibold mb-6">相关通识</h2>
          <div className="space-y-4">
            {relatedDaily.map((d) => (
              <Link
                key={d.id}
                to={`/daily/${d.id}`}
                className="group block border border-border/60 bg-card p-6 rounded-sm hover:border-accent/30 transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-2 py-0.5 bg-accent/10 text-accent rounded-sm">
                    {d.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{d.date}</span>
                </div>
                <h3 className="font-serif text-lg font-semibold group-hover:text-accent transition-colors mb-2">
                  {d.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {d.summary}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 相关名句 */}
      {relatedQuotes.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Feather className="h-4 w-4 text-accent" />
            <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
              名句素材
            </span>
          </div>
          <h2 className="font-serif text-2xl font-semibold mb-6">相关名句</h2>
          <div className="space-y-4">
            {relatedQuotes.map((q) => (
              <Link
                key={q.id}
                to={`/quotes/${q.id}`}
                className="group block border border-border/60 bg-card p-6 rounded-sm hover:border-accent/30 transition-all"
              >
                <blockquote className="font-serif text-lg text-foreground mb-3 leading-relaxed">
                  "{q.text}"
                </blockquote>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="font-medium">{q.author}</span>
                  <span className="text-muted-foreground/60">·</span>
                  <span>{q.source}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 底部提示 */}
      <div className="mt-12 p-6 bg-muted/30 border border-border/40 rounded-sm">
        <p className="text-xs text-muted-foreground leading-relaxed">
          本专题聚合了时评、通识、名句三类素材，可直接用于议论文写作。
          时评文章可进入详情页收藏段落/划线，加入个人素材包后导出使用。
        </p>
      </div>
    </div>
  );
}
