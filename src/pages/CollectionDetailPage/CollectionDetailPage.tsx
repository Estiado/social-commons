import { useLoadEffect } from '@/hooks/useLoadEffect';
import { useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Trash2,
  Download,
  Loader2,
  AlertCircle,
  FileText,
  ExternalLink,
  ChevronDown as ChevronDownIcon,
  FileDown,
  Highlighter,
  Quote,
  Bookmark,
  Lightbulb,
  RefreshCw,
} from 'lucide-react';
import { exportCollection, type ExportFormat } from '@/lib/collectionExport';
import { requireSuccess, errorMessage } from '@/lib/database';
import { supabase } from '@/lib/supabase';
import { useUserSession } from '@/hooks/useUserId';
import { DatabaseNotice } from '@/components/DatabaseNotice';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DAILY_KNOWLEDGE } from '@/data/daily';
import { QUOTES } from '@/data/quotes';

interface CollectionParagraph {
  collection_id: string;
  paragraph_id: string;
  sort_order: number;
  note: string | null;
  article_paragraphs: {
    id: string;
    content: string;
    paragraph_index: number;
    articles: {
      id: string;
      title: string;
      source: string | null;
      author: string | null;
      url: string;
    };
  };
}

interface CollectionHighlight {
  collection_id: string;
  highlight_id: string;
  sort_order: number;
  note: string | null;
  saved_highlights: {
    id: string;
    selected_text: string;
    articles: {
      id: string;
      title: string;
      source: string | null;
      author: string | null;
      url: string;
    };
  };
}

interface Collection {
  id: string;
  name: string;
  description: string | null;
}

export default function CollectionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userId, loading: userLoading, error: authError } = useUserSession();

  const [collection, setCollection] = useState<Collection | null>(null);
  const [paragraphs, setParagraphs] = useState<CollectionParagraph[]>([]);
  const [highlights, setHighlights] = useState<CollectionHighlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);
  const [inspiration, setInspiration] = useState(() => ({ daily: DAILY_KNOWLEDGE[Math.floor(Math.random() * DAILY_KNOWLEDGE.length)], quote: QUOTES[Math.floor(Math.random() * QUOTES.length)] }));

  // 随机获取写作灵感
  const refreshInspiration = useCallback(() => {
    const randomDaily = DAILY_KNOWLEDGE[Math.floor(Math.random() * DAILY_KNOWLEDGE.length)];
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setInspiration({ daily: randomDaily, quote: randomQuote });
  }, []);


  // 获取素材包和段落
  const fetchData = useCallback(async () => {
    if (!supabase || !id || !userId) return;
    try {

      // 获取素材包信息
      const collectionRequest = supabase
        .from('collections')
        .select('id, name, description')
        .eq('id', id)
        .eq('user_id', userId)
        .single();


      // 获取素材包中的段落（按sort_order排序）
      const paragraphRequest = supabase
        .from('collection_paragraphs')
        .select(
          `
          collection_id,
          paragraph_id,
          sort_order,
          note,
          article_paragraphs (
            id,
            content,
            paragraph_index,
            articles (
              id,
              title,
              source,
              author,
              url
            )
          )
        `,
        )
        .eq('collection_id', id)
        .order('sort_order', { ascending: true });

      // 获取素材包中的划线（按sort_order排序）
      const highlightRequest = supabase
        .from('collection_highlights')
        .select(
          `
          collection_id,
          highlight_id,
          sort_order,
          note,
          saved_highlights (
            id,
            selected_text,
            articles (
              id,
              title,
              source,
              author,
              url
            )
          )
        `,
        )
        .eq('collection_id', id)
        .order('sort_order', { ascending: true });

      const [collectionResult, paragraphResult, highlightResult] = await Promise.all([collectionRequest, paragraphRequest, highlightRequest]);
      const { data: colData, error: colError } = collectionResult;
      const { data: paraData, error: paraError } = paragraphResult;
      const { data: highlightData, error: highlightError } = highlightResult;
      if (colError) throw colError;
      if (highlightError) throw highlightError;
      setCollection(colData);
      if (paraError) throw paraError;
      // Supabase关联查询可能返回数组或对象，兼容两种情况
      setParagraphs(
        (paraData || [])
          .map((item: any) => {
            const para = Array.isArray(item.article_paragraphs)
              ? item.article_paragraphs[0]
              : item.article_paragraphs;
            return { ...item, article_paragraphs: para || null };
          })
          .filter((item: any) => item.article_paragraphs) as unknown as CollectionParagraph[],
      );


      setHighlights(
        (highlightData || [])
          .map((item: any) => {
            const hl = Array.isArray(item.saved_highlights)
              ? item.saved_highlights[0]
              : item.saved_highlights;
            return { ...item, saved_highlights: hl || null };
          })
          .filter((item: any) => item.saved_highlights) as unknown as CollectionHighlight[],
      );
    } catch (err) {
      console.error('获取素材包详情失败:', err);
      setLoadError(errorMessage(err, '素材包加载失败'));
    } finally {
      setLoading(false);
    }
  }, [id, userId]);

  useLoadEffect(fetchData);

  // 移动段落（上移/下移）
  const moveParagraph = async (index: number, direction: 'up' | 'down') => {
    if (!supabase || !id) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= paragraphs.length) return;

    const current = paragraphs[index];
    const target = paragraphs[targetIndex];

    setActionId(current.paragraph_id);
    try {
      // 交换sort_order
      await requireSuccess(supabase
        .from('collection_paragraphs')
        .update({ sort_order: target.sort_order })
        .eq('collection_id', id)
        .eq('paragraph_id', current.paragraph_id));

      await requireSuccess(supabase
        .from('collection_paragraphs')
        .update({ sort_order: current.sort_order })
        .eq('collection_id', id)
        .eq('paragraph_id', target.paragraph_id));

      // 本地更新顺序
      const newParagraphs = [...paragraphs];
      newParagraphs[index] = { ...target, sort_order: current.sort_order };
      newParagraphs[targetIndex] = { ...current, sort_order: target.sort_order };
      setParagraphs(newParagraphs);
    } catch (err) {
      console.error('移动段落失败:', err);
      await fetchData();
      alert('排序未完成，已重新加载保存的顺序');
    } finally {
      setActionId(null);
    }
  };

  // 从素材包移除段落
  const removeParagraph = async (paragraphId: string) => {
    if (!supabase || !id) return;
    if (!confirm('从素材包中移除这段？')) return;
    setActionId(paragraphId);
    try {
      await requireSuccess(supabase
        .from('collection_paragraphs')
        .delete()
        .eq('collection_id', id)
        .eq('paragraph_id', paragraphId));
      setParagraphs((prev) => prev.filter((p) => p.paragraph_id !== paragraphId));
    } catch (err) {
      console.error('移除段落失败:', err);
    } finally {
      setActionId(null);
    }
  };

  const removeHighlight = async (highlightId: string) => {
    if (!supabase || !id) return;
    if (!confirm('从素材包中移除这条划线？')) return;
    setActionId(highlightId);
    try {
      await requireSuccess(supabase
        .from('collection_highlights')
        .delete()
        .eq('collection_id', id)
        .eq('highlight_id', highlightId));
      setHighlights((prev) => prev.filter((h) => h.highlight_id !== highlightId));
    } catch (err) {
      console.error('移除划线失败:', err);
    } finally {
      setActionId(null);
    }
  };

  // 生成导出内容的通用数据（段落+划线合并）
  const getExportData = () => {
    const paragraphItems = paragraphs.map((p, i) => {
      const para = p.article_paragraphs;
      const article = para?.articles;
      return {
        index: i + 1,
        type: '段落' as const,
        content: para?.content || '',
        title: article?.title || '未知文章',
        source: article?.source || '未知来源',
        author: article?.author || '',
        url: article?.url || '',
      };
    });
    const highlightItems = highlights.map((h, i) => {
      const hl = h.saved_highlights;
      const article = hl?.articles;
      return {
        index: paragraphs.length + i + 1,
        type: '划线' as const,
        content: hl?.selected_text || '',
        title: article?.title || '未知文章',
        source: article?.source || '未知来源',
        author: article?.author || '',
        url: article?.url || '',
      };
    });
    return [...paragraphItems, ...highlightItems];
  };

  // UI 只管理导出状态，格式生成和下载交给独立模块。
  const handleExport = async (format: ExportFormat) => {
    if (!collection) return;
    setExporting(format);
    try {
      await exportCollection(format, collection, getExportData());
    } catch (error) {
      alert(errorMessage(error, '导出失败，请重试'));
    } finally {
      setExporting(null);
      setShowExportMenu(false);
    }
  };
  const exportTxt = () => handleExport('txt');
  const exportMarkdown = () => handleExport('md');
  const exportDocx = () => handleExport('docx');
  const exportPdf = () => handleExport('pdf');

  if (!supabase || userLoading || authError || loadError) {
    return <DatabaseNotice loading={userLoading} error={authError || loadError} />;
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground">加载中...</p>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground mb-4">素材包不存在或无权访问</p>
        <Button variant="outline" onClick={() => navigate('/collections')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回素材包列表
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      {/* 返回按钮 */}
      <Link
        to="/collections"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        返回素材包
      </Link>

      {/* 素材包头部 */}
      <header className="mb-10 pb-8 border-b border-border/40">
        <h1 className="font-serif text-2xl md:text-3xl font-semibold mb-3">{collection.name}</h1>
        {collection.description && (
          <p className="text-muted-foreground leading-relaxed mb-4">{collection.description}</p>
        )}
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            {paragraphs.length} 段素材
          </span>
          {/* 导出下拉菜单 */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={paragraphs.length + highlights.length === 0 || exporting !== null}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              导出素材包
              <ChevronDownIcon className={`h-3 w-3 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
            </Button>
            {showExportMenu && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-card border border-border/60 rounded-sm shadow-lg z-50 py-1">
                <button
                  onClick={exportTxt}
                  disabled={exporting === 'txt'}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  {exporting === 'txt' ? '导出中...' : 'TXT 纯文本'}
                </button>
                <button
                  onClick={exportMarkdown}
                  disabled={exporting === 'md'}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <FileDown className="h-4 w-4" />
                  {exporting === 'md' ? '导出中...' : 'Markdown'}
                </button>
                <button
                  onClick={exportDocx}
                  disabled={exporting === 'docx'}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  {exporting === 'docx' ? '导出中...' : 'Word 文档'}
                </button>
                <button
                  onClick={exportPdf}
                  disabled={exporting === 'pdf'}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <FileDown className="h-4 w-4" />
                  {exporting === 'pdf' ? '导出中...' : 'PDF（打印）'}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 内容列表 */}
      {paragraphs.length === 0 && highlights.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="mb-2">素材包还是空的</p>
          <p className="text-xs">
            去<Link to="/paragraphs" className="text-accent hover:underline">段落库</Link>
            把收藏的段落或划线加入这个素材包
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 段落列表 */}
          {paragraphs.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Bookmark className="h-4 w-4" />
                段落收藏（{paragraphs.length}）
              </h3>
              <div className="space-y-4">
                {paragraphs.map((cp, index) => {
                  const para = cp.article_paragraphs;
                  const article = para?.articles;
                  if (!para || !article) return null;
                  const isAction = actionId === cp.paragraph_id;
            return (
              <div
                key={cp.paragraph_id}
                className="group border border-border/60 bg-card rounded-sm p-6 hover:border-accent/20 transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* 序号 */}
                  <div className="shrink-0 w-8 h-8 flex items-center justify-center bg-accent/10 text-accent rounded-sm font-serif text-sm font-semibold">
                    {index + 1}
                  </div>
                  {/* 内容 */}
                  <div className="flex-1">
                    <p className="text-foreground/85 leading-relaxed mb-3">{para.content}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      {article.source && (
                        <Badge variant="outline" className="border-accent/30 text-accent">
                          {article.source}
                        </Badge>
                      )}
                      <Link
                        to={`/guanlan/${article.id}`}
                        className="hover:text-accent transition-colors flex items-center gap-1"
                      >
                        <FileText className="h-3 w-3" />
                        {article.title}
                      </Link>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-accent transition-colors flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        原文
                      </a>
                    </div>
                  </div>
                  {/* 操作按钮 */}
                  <div className="flex flex-col gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => moveParagraph(index, 'up')}
                      disabled={index === 0 || isAction}
                      className="p-1 text-muted-foreground hover:text-accent disabled:opacity-30 transition-colors"
                      title="上移"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => moveParagraph(index, 'down')}
                      disabled={index === paragraphs.length - 1 || isAction}
                      className="p-1 text-muted-foreground hover:text-accent disabled:opacity-30 transition-colors"
                      title="下移"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeParagraph(cp.paragraph_id)}
                      disabled={isAction}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                      title="移除"
                    >
                      {isAction ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
              </div>
            </div>
          )}

          {/* 划线列表 */}
          {highlights.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Highlighter className="h-4 w-4" />
                划线收藏（{highlights.length}）
              </h3>
              <div className="space-y-4">
                {highlights.map((ch) => {
                  const hl = ch.saved_highlights;
                  const article = hl?.articles;
                  if (!hl || !article) return null;
                  const isAction = actionId === ch.highlight_id;
                  return (
                    <div key={ch.highlight_id} className="group flex gap-4 border border-border/60 bg-card rounded-sm p-5">
                      <div className="flex-1 min-w-0">
                        <div className="flex gap-2 mb-3">
                          <Quote className="h-4 w-4 text-accent/40 shrink-0 mt-1" />
                          <p className="text-foreground/85 leading-relaxed italic">{hl.selected_text}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          {article.source && (
                            <Badge variant="outline" className="border-accent/30 text-accent">
                              {article.source}
                            </Badge>
                          )}
                          <Link
                            to={`/guanlan/${article.id}`}
                            className="hover:text-accent transition-colors flex items-center gap-1"
                          >
                            <FileText className="h-3 w-3" />
                            {article.title}
                          </Link>
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-accent transition-colors flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            原文
                          </a>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => removeHighlight(ch.highlight_id)}
                          disabled={isAction}
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                          title="移除"
                        >
                          {isAction ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 写作灵感 */}
      {inspiration && (
        <div className="mt-12 p-6 bg-gradient-to-br from-amber-50/50 to-orange-50/50 border border-amber-200/40 rounded-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg font-semibold flex items-center gap-2 text-amber-800">
              <Lightbulb className="h-5 w-5" />
              写作灵感
            </h3>
            <button
              onClick={refreshInspiration}
              className="flex items-center gap-1.5 text-xs text-amber-700 hover:text-amber-900 transition-colors px-3 py-1.5 rounded-sm hover:bg-amber-100/50"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              换一批
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {/* 通识概念 */}
            <Link
              to="/daily"
              className="block p-4 bg-white/60 border border-amber-200/30 rounded-sm hover:border-amber-400/40 transition-all group"
            >
              <p className="text-[10px] text-amber-600 tracking-wider mb-2">通识概念</p>
              <p className="text-sm font-medium text-amber-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                {inspiration.daily.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                {inspiration.daily.summary}
              </p>
            </Link>
            {/* 名句 */}
            <Link
              to="/quotes"
              className="block p-4 bg-white/60 border border-amber-200/30 rounded-sm hover:border-amber-400/40 transition-all group"
            >
              <p className="text-[10px] text-amber-600 tracking-wider mb-2">名家名句</p>
              <p className="text-sm font-serif text-amber-900 group-hover:text-amber-700 transition-colors line-clamp-2">
                「{inspiration.quote.text}」
              </p>
              <p className="text-xs text-muted-foreground mt-1.5">
                —— {inspiration.quote.author}《{inspiration.quote.source}》
              </p>
            </Link>
          </div>
          <p className="text-[11px] text-amber-700/70 mt-4 text-center">
            随机抽取全站通识与名句，为你的写作提供新的角度和灵感
          </p>
        </div>
      )}

      {/* 底部说明 */}
      <div className="mt-12 p-6 bg-muted/30 border border-border/40 rounded-sm">
        <p className="text-xs text-muted-foreground leading-relaxed">
          使用上下箭头调整段落顺序，导出时会按当前顺序复制。导出格式为"段落内容 + 出处"，可直接粘贴到作文中。
          引用时请注明原文作者和来源。
        </p>
      </div>
    </div>
  );
}
