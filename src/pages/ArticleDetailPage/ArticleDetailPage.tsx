import { useLoadEffect } from '@/hooks/useLoadEffect';
import { requireSuccess, setParagraphSaved } from '@/lib/database';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  User,
  Clock,
  Tag,
  Bookmark,
  BookmarkCheck,
  Loader2,
  AlertCircle,
  FileText,
  Highlighter,
  Check,
  Calendar,
  Feather,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useUserSession } from '@/hooks/useUserId';
import { DatabaseNotice } from '@/components/DatabaseNotice';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DAILY_KNOWLEDGE } from '@/data/daily';
import { QUOTES } from '@/data/quotes';

interface Article {
  id: string;
  url: string;
  title: string;
  author: string | null;
  source: string | null;
  published_at: string | null;
  excerpt: string | null;
  content: string | null;
  tags: string[];
  created_at: string;
}

interface Paragraph {
  id: string;
  article_id: string;
  paragraph_index: number;
  content: string;
}

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userId, loading: userLoading, error: authError } = useUserSession();

  const [article, setArticle] = useState<Article | null>(null);
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
  const [savedParagraphIds, setSavedParagraphIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  // 划线收藏相关状态
  const [selectedText, setSelectedText] = useState<string>('');
  const [selectedParagraphId, setSelectedParagraphId] = useState<string>('');
  const [toolbarPos, setToolbarPos] = useState<{ x: number; y: number } | null>(null);
  const [savingHighlight, setSavingHighlight] = useState(false);
  const [highlightSaved, setHighlightSaved] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState<Array<{ id: string; title: string; source: string | null }>>([]);
  const [relatedDaily, setRelatedDaily] = useState<typeof DAILY_KNOWLEDGE>([]);
  const [relatedQuotes, setRelatedQuotes] = useState<typeof QUOTES>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  // 获取文章详情和段落
  const fetchArticle = useCallback(async () => {
    if (!supabase || !id || !userId) return;
    try {

      // 同时查询文章、段落、用户收藏
      const [articleRes, paragraphsRes, savedRes] = await Promise.all([
        supabase.from('articles').select('*').eq('id', id).single(),
        supabase
          .from('article_paragraphs')
          .select('*')
          .eq('article_id', id)
          .order('paragraph_index', { ascending: true }),
        userId
          ? supabase.from('saved_paragraphs').select('paragraph_id, article_paragraphs!inner(article_id)').eq('user_id', userId).eq('article_paragraphs.article_id', id)
          : Promise.resolve({ data: [], error: null }),
      ]);

      if (articleRes.error) throw articleRes.error;
      if (paragraphsRes.error) throw paragraphsRes.error;
      if (savedRes.error) throw savedRes.error;

      setArticle(articleRes.data);
      setParagraphs(paragraphsRes.data || []);
      setSavedParagraphIds(new Set((savedRes.data || []).map((s: { paragraph_id: string }) => s.paragraph_id)));

      // 查询相关文章（基于话题标签）
      const tags = articleRes.data?.tags || [];
      if (tags.length > 0 && supabase) {
        // 用第一个话题标签查询相关文章
        const { data: relatedData } = await supabase
          .from('articles')
          .select('id, title, source')
          .eq('is_public', true)
          .neq('id', id)
          .contains('tags', [tags[0]])
          .order('created_at', { ascending: false })
          .limit(5);
        setRelatedArticles(relatedData || []);
      } else {
        setRelatedArticles([]);
      }

      // 匹配相关日新通识和名句
      const articleText = `${articleRes.data?.title || ''} ${articleRes.data?.excerpt || ''} ${tags.join(' ')}`.toLowerCase();
      const matchedDaily = DAILY_KNOWLEDGE.filter((d) => {
        const dText = `${d.title} ${d.category} ${d.summary} ${d.content}`.toLowerCase();
        return tags.some((tag) => dText.includes(tag.toLowerCase())) ||
          d.title.split('：')[0].split('——')[0].split(' ').some((word) => word.length >= 2 && articleText.includes(word.toLowerCase()));
      }).slice(0, 3);
      setRelatedDaily(matchedDaily);

      const matchedQuotes = QUOTES.filter((q) => {
        const qText = `${q.text} ${q.author} ${q.source} ${q.commentary?.text || ''}`.toLowerCase();
        return tags.some((tag) => qText.includes(tag.toLowerCase())) ||
          (q.author && articleText.includes(q.author.toLowerCase()));
      }).slice(0, 3);
      setRelatedQuotes(matchedQuotes);
    } catch (err) {
      console.error('获取文章失败:', err);
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, [id, userId]);

  useLoadEffect(fetchArticle);

  // 收藏/取消收藏段落
  const toggleSave = async (paragraphId: string) => {
    if (!supabase || !userId) return;
    setSavingId(paragraphId);

    try {
      const isSaved = savedParagraphIds.has(paragraphId);

      await setParagraphSaved(userId, paragraphId, !isSaved);
      setSavedParagraphIds((previous) => {
        const next = new Set(previous);
        if (isSaved) next.delete(paragraphId); else next.add(paragraphId);
        return next;
      });
    } catch (err) {
      console.error('收藏操作失败:', err);
      alert('收藏未保存，请检查网络后重试');
    } finally {
      setSavingId(null);
    }
  };

  // 监听鼠标选中文字
  const handleMouseUp = useCallback(() => {
    setTimeout(() => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || selection.toString().trim().length < 2) {
        setToolbarPos(null);
        setSelectedText('');
        return;
      }

      const text = selection.toString().trim();
      // 检查选中是否在段落内容区域内
      const anchorNode = selection.anchorNode;
      if (!anchorNode || !contentRef.current?.contains(anchorNode)) {
        setToolbarPos(null);
        return;
      }

      // 找到所属段落
      let paragraphEl: HTMLElement | null = null;
      let el: HTMLElement | null = anchorNode.parentElement;
      while (el && contentRef.current.contains(el)) {
        if (el.dataset && el.dataset.paragraphId) {
          paragraphEl = el;
          break;
        }
        el = el.parentElement;
      }

      if (!paragraphEl) {
        setToolbarPos(null);
        return;
      }

      // 获取选区位置，显示浮动工具栏
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectedText(text);
      setSelectedParagraphId(paragraphEl.dataset.paragraphId || '');
      setToolbarPos({
        x: rect.left + rect.width / 2,
        y: rect.top + window.scrollY - 10,
      });
      setHighlightSaved(false);
    }, 10);
  }, []);

  // 保存划线收藏
  const saveHighlight = async () => {
    if (!supabase || !userId || !selectedText || !id) return;
    setSavingHighlight(true);
    try {
      await requireSuccess(supabase.from('saved_highlights').insert({
        user_id: userId,
        article_id: id,
        paragraph_id: selectedParagraphId || null,
        selected_text: selectedText,
      }));
      setHighlightSaved(true);
      setTimeout(() => {
        setToolbarPos(null);
        setSelectedText('');
      }, 1500);
    } catch (err: any) {
      if (err?.code === '23505') {
        // 唯一约束冲突，说明已经收藏过
        setHighlightSaved(true);
        setTimeout(() => {
          setToolbarPos(null);
          setSelectedText('');
        }, 1500);
      } else {
        console.error('保存划线失败:', err);
        alert('保存失败，请重试');
      }
    } finally {
      setSavingHighlight(false);
    }
  };

  // 点击其他地方隐藏工具栏
  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseUp]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return '';
    }
  };

  if (!supabase || userLoading || authError) {
    return <DatabaseNotice loading={userLoading} error={authError} />;
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground">加载文章中...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground mb-4">{error || '文章不存在'}</p>
        <Button variant="outline" onClick={() => navigate('/guanlan')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回观澜
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      {/* 返回按钮 */}
      <Link
        to="/guanlan"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        返回观澜
      </Link>

      {/* 文章头部 */}
      <header className="mb-10 pb-8 border-b border-border/40">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {article.source && (
            <Badge variant="outline" className="border-accent/30 text-accent">
              {article.source}
            </Badge>
          )}
          {article.author && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              {article.author}
            </span>
          )}
          {(article.published_at || article.created_at) && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {formatDate(article.published_at || article.created_at)}
            </span>
          )}
        </div>
        <h1 className="font-serif text-2xl md:text-3xl font-semibold mb-4 leading-tight">{article.title}</h1>
        {article.excerpt && (
          <p className="text-muted-foreground leading-relaxed mb-4">{article.excerpt}</p>
        )}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map((tag) => (
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
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
        >
          阅读原文 <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </header>

      {/* 段落列表 */}
      {paragraphs.length > 0 ? (
        <div className="space-y-1" ref={contentRef}>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
            <FileText className="h-3.5 w-3.5" />
            <span>共 {paragraphs.length} 段，悬停段落可收藏整段，选中文字可收藏划线</span>
          </div>
          {paragraphs.map((para) => {
            const isSaved = savedParagraphIds.has(para.id);
            const isSaving = savingId === para.id;
            return (
              <div
                key={para.id}
                data-paragraph-id={para.id}
                className={`group relative px-4 py-3 rounded-sm transition-all duration-200 ${
                  isSaved ? 'bg-accent/5 border-l-2 border-accent' : 'hover:bg-muted/30 border-l-2 border-transparent'
                }`}
              >
                <p className="text-foreground/85 leading-relaxed pr-12 select-text">{para.content}</p>
                <button
                  onClick={() => toggleSave(para.id)}
                  disabled={isSaving}
                  className={`absolute right-3 top-3 p-1.5 rounded-sm transition-all ${
                    isSaved
                      ? 'text-accent opacity-100'
                      : 'text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-accent hover:bg-accent/10'
                  }`}
                  title={isSaved ? '取消收藏' : '收藏这段'}
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isSaved ? (
                    <BookmarkCheck className="h-4 w-4" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">该文章暂无分段内容</p>
          <p className="text-xs mt-1">可能是提取时未获取到正文，可点击上方"阅读原文"查看</p>
        </div>
      )}

      {/* 相关文章推荐 */}
      {relatedArticles.length > 0 && (
        <div className="mt-12 pt-8 border-t border-border/40">
          <h3 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4 text-accent" />
            同话题推荐
          </h3>
          <div className="space-y-3">
            {relatedArticles.map((ra) => (
              <Link
                key={ra.id}
                to={`/guanlan/${ra.id}`}
                className="block p-4 border border-border/40 rounded-sm hover:border-accent/30 hover:bg-accent/5 transition-all group"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium group-hover:text-accent transition-colors line-clamp-1">
                    {ra.title}
                  </p>
                  {ra.source && (
                    <Badge variant="outline" className="border-accent/20 text-accent text-xs shrink-0">
                      {ra.source}
                    </Badge>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 相关日新通识 */}
      {relatedDaily.length > 0 && (
        <div className="mt-12 pt-8 border-t border-border/40">
          <h3 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            相关通识概念
          </h3>
          <div className="space-y-3">
            {relatedDaily.map((d) => (
              <Link
                key={d.id}
                to={`/daily/${d.id}`}
                className="block p-4 border border-border/40 rounded-sm hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group"
              >
                <p className="text-sm font-medium group-hover:text-blue-600 transition-colors line-clamp-1">
                  {d.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{d.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 相关名句 */}
      {relatedQuotes.length > 0 && (
        <div className="mt-12 pt-8 border-t border-border/40">
          <h3 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
            <Feather className="h-4 w-4 text-amber-500" />
            相关名句
          </h3>
          <div className="space-y-3">
            {relatedQuotes.map((q) => (
              <Link
                key={q.id}
                to={`/quotes/${q.id}`}
                className="block p-4 border border-border/40 rounded-sm hover:border-amber-500/30 hover:bg-amber-500/5 transition-all group"
              >
                <p className="text-sm font-serif font-medium group-hover:text-amber-700 transition-colors line-clamp-2">
                  「{q.text}」
                </p>
                <p className="text-xs text-muted-foreground mt-1">—— {q.author}《{q.source}》</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 底部提示 */}
      <div className="mt-12 p-5 bg-muted/30 border border-border/40 rounded-sm">
        <p className="text-xs text-muted-foreground leading-relaxed">
          收藏的段落和划线会进入"我的段落库"，可以在那里按话题筛选、创建素材包、导出使用。
          每段都保留原文出处，引用时请注明来源。
        </p>
      </div>

      {/* 划线收藏浮动工具栏 */}
      {toolbarPos && (
        <div
          className="fixed z-50 flex items-center gap-1 bg-card border border-border/60 rounded-sm shadow-lg px-2 py-1.5"
          style={{
            left: toolbarPos.x,
            top: toolbarPos.y,
            transform: 'translate(-50%, -100%)',
          }}
        >
          {highlightSaved ? (
            <span className="flex items-center gap-1 text-xs text-green-600 px-2 py-1">
              <Check className="h-3.5 w-3.5" />
              已收藏
            </span>
          ) : (
            <button
              onClick={saveHighlight}
              disabled={savingHighlight}
              className="flex items-center gap-1 text-xs text-foreground hover:text-accent px-2 py-1 transition-colors"
            >
              {savingHighlight ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Highlighter className="h-3.5 w-3.5" />
              )}
              收藏划线
            </button>
          )}
        </div>
      )}
    </div>
  );
}
