import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  User,
  Clock,
  Tag,
  Bookmark,
  BookmarkCheck,
  FileText,
  Calendar,
  Feather,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useUserId } from '@/hooks/useUserId';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PRESET_ARTICLES, getPresetParagraphs } from '@/data/presetArticles';
import { DAILY_KNOWLEDGE } from '@/data/daily';
import { QUOTES } from '@/data/quotes';

export default function PresetArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = useUserId();

  const article = PRESET_ARTICLES.find((a) => a.id === id);
  const paragraphs = article ? getPresetParagraphs(article.id) : [];

  const [savedParagraphs, setSavedParagraphs] = useState<Set<string>>(new Set());
  const [syncingId, setSyncingId] = useState<string | null>(null);

  // 加载已收藏的段落
  useEffect(() => {
    if (!supabase || !userId || !article) return;
    const fetchSaved = async () => {
      const { data } = await supabase
        .from('saved_paragraphs')
        .select('paragraph_id')
        .eq('user_id', userId);
      if (data) {
        setSavedParagraphs(new Set(data.map((d) => d.paragraph_id)));
      }
    };
    fetchSaved();
  }, [userId, article]);

  // 将预置文章同步到Supabase
  const syncArticleToSupabase = useCallback(async () => {
    if (!supabase || !article) return null;

    // 检查文章是否已存在
    const { data: existing } = await supabase
      .from('articles')
      .select('id')
      .eq('url', article.url)
      .single();

    if (existing) return existing.id;

    // 创建文章
    const { data: newArticle, error: articleError } = await supabase
      .from('articles')
      .insert({
        url: article.url,
        title: article.title,
        author: article.author,
        source: article.source,
        published_at: article.published_at,
        excerpt: article.excerpt,
        tags: article.tags,
        is_public: true,
        is_preset: true,
      })
      .select('id')
      .single();

    if (articleError || !newArticle) return null;

    // 创建段落
    const paraData = paragraphs.map((p, i) => ({
      article_id: newArticle.id,
      paragraph_index: i,
      content: p.content,
    }));

    await supabase.from('article_paragraphs').insert(paraData);

    return newArticle.id;
  }, [article, paragraphs]);

  // 收藏/取消收藏段落
  const toggleParagraphSave = async (paragraphIndex: number) => {
    if (!supabase || !userId || !article) {
      alert('需要配置数据库才能使用收藏功能');
      return;
    }

    setSyncingId(`p${paragraphIndex}`);
    try {
      // 先同步文章到Supabase
      const articleId = await syncArticleToSupabase();
      if (!articleId) {
        alert('同步文章失败');
        return;
      }

      // 获取段落ID
      const { data: paraData } = await supabase
        .from('article_paragraphs')
        .select('id')
        .eq('article_id', articleId)
        .eq('paragraph_index', paragraphIndex)
        .single();

      if (!paraData) return;

      const paraId = paraData.id;
      const isSaved = savedParagraphs.has(paraId);

      if (isSaved) {
        await supabase
          .from('saved_paragraphs')
          .delete()
          .eq('user_id', userId)
          .eq('paragraph_id', paraId);
        setSavedParagraphs((prev) => {
          const next = new Set(prev);
          next.delete(paraId);
          return next;
        });
      } else {
        await supabase.from('saved_paragraphs').insert({
          user_id: userId,
          paragraph_id: paraId,
        });
        setSavedParagraphs((prev) => new Set(prev).add(paraId));
      }
    } finally {
      setSyncingId(null);
    }
  };

  // 相关通识概念
  const relatedDaily = article
    ? DAILY_KNOWLEDGE.filter((d) => {
        const tags = article.tags.join(' ');
        return (
          tags.includes(d.category) ||
          d.title.split('').some((char) => article.title.includes(char))
        );
      }).slice(0, 3)
    : [];

  // 相关名句
  const relatedQuotes = article
    ? QUOTES.filter((q) => {
        return article.tags.some((tag) => q.text.includes(tag.charAt(0)) || q.author.includes(tag.charAt(0)));
      }).slice(0, 3)
    : [];

  if (!article) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="text-muted-foreground mb-4">未找到该文章</p>
        <Button onClick={() => navigate('/guanlan')} variant="outline">
          返回观澜
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      {/* 返回按钮 */}
      <button
        onClick={() => navigate('/guanlan')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        返回观澜
      </button>

      {/* 文章头部 */}
      <header className="mb-10 pb-8 border-b border-border/60">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">经典时评</Badge>
          <Badge variant="outline" className="border-accent/30 text-accent">
            {article.source}
          </Badge>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold leading-tight mb-4">
          {article.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            {article.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {article.published_at}
          </span>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-accent transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            阅读原文
          </a>
        </div>
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-muted/60 text-muted-foreground rounded-sm"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* 摘要 */}
      <div className="mb-10 p-6 bg-amber-50/50 border-l-4 border-amber-400 rounded-r-sm">
        <p className="text-amber-900 font-serif text-lg leading-relaxed italic">
          {article.excerpt}
        </p>
      </div>

      {/* 正文段落 */}
      <article className="space-y-6 mb-16">
        {paragraphs.map((para, index) => {
          const isSaved = savedParagraphs.has(para.id);
          const isSyncing = syncingId === `p${index}`;
          return (
            <div
              key={para.id}
              className="group relative pl-4 border-l-2 border-transparent hover:border-accent/30 transition-all"
            >
              <p className="text-foreground/85 leading-loose text-[15px] font-serif">
                {para.content}
              </p>
              <button
                onClick={() => toggleParagraphSave(index)}
                disabled={isSyncing}
                className={`absolute -left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-sm transition-all opacity-0 group-hover:opacity-100 ${
                  isSaved
                    ? 'opacity-100 text-accent bg-accent/10'
                    : 'text-muted-foreground hover:text-accent hover:bg-accent/5'
                }`}
                title={isSaved ? '取消收藏' : '收藏段落'}
              >
                {isSyncing ? (
                  <div className="h-4 w-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                ) : isSaved ? (
                  <BookmarkCheck className="h-4 w-4" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </button>
            </div>
          );
        })}
      </article>

      {/* 相关推荐 */}
      <div className="space-y-8">
        {/* 相关通识概念 */}
        {relatedDaily.length > 0 && (
          <section>
            <h3 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              相关通识概念
            </h3>
            <div className="grid gap-3">
              {relatedDaily.map((d) => (
                <Link
                  key={d.id}
                  to="/daily"
                  className="block p-4 border border-border/60 rounded-sm hover:border-accent/30 hover:bg-accent/5 transition-all group"
                >
                  <p className="font-medium text-sm group-hover:text-accent transition-colors mb-1">
                    {d.title}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{d.summary}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 相关名句 */}
        {relatedQuotes.length > 0 && (
          <section>
            <h3 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
              <Feather className="h-5 w-5 text-accent" />
              相关名句
            </h3>
            <div className="space-y-3">
              {relatedQuotes.map((q) => (
                <Link
                  key={q.id}
                  to="/quotes"
                  className="block p-4 border border-border/60 rounded-sm hover:border-accent/30 hover:bg-accent/5 transition-all group"
                >
                  <p className="font-serif text-sm italic text-foreground/80 group-hover:text-accent transition-colors mb-1">
                    「{q.text}」
                  </p>
                  <p className="text-xs text-muted-foreground">
                    —— {q.author}《{q.source}》
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* 底部说明 */}
      <div className="mt-16 p-6 bg-muted/30 border border-border/40 rounded-sm">
        <p className="text-xs text-muted-foreground leading-relaxed">
          本文为预置经典时评，内容版权归原作者所有。段落收藏功能会自动将文章同步至数据库，
          收藏后可在「我的段落库」中查看和管理。引用时请注明原文作者和来源。
        </p>
      </div>
    </div>
  );
}
