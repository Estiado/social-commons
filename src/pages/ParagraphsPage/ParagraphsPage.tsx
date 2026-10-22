import { useLoadEffect } from '@/hooks/useLoadEffect';
import { requireSuccess } from '@/lib/database';
import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  Search,
  ExternalLink,
  Trash2,
  Loader2,
  AlertCircle,
  FileText,
  Clock,
  FolderPlus,
  Highlighter,
  Quote,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useUserSession } from '@/hooks/useUserId';
import { DatabaseNotice } from '@/components/DatabaseNotice';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface SavedParagraph {
  id: string;
  paragraph_id: string;
  created_at: string;
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

interface SavedHighlight {
  id: string;
  selected_text: string;
  created_at: string;
  articles: {
    id: string;
    title: string;
    source: string | null;
    author: string | null;
    url: string;
  };
}

export default function ParagraphsPage() {
  const { userId, loading: userLoading, error: authError } = useUserSession();
  const [paragraphs, setParagraphs] = useState<SavedParagraph[]>([]);
  const [highlights, setHighlights] = useState<SavedHighlight[]>([]);
  const [activeTab, setActiveTab] = useState<'paragraphs' | 'highlights'>('paragraphs');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSource, setActiveSource] = useState<string>('全部');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [collections, setCollections] = useState<{ id: string; name: string }[]>([]);
  const [showMenuFor, setShowMenuFor] = useState<string | null>(null);
  const [showHighlightMenuFor, setShowHighlightMenuFor] = useState<string | null>(null);
  const [addingToId, setAddingToId] = useState<string | null>(null);

  // 获取用户的素材包列表
  const fetchCollections = useCallback(async () => {
    if (!supabase || !userId) return;
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('id, name')
        .eq('user_id', userId)
        .order('name', { ascending: true });
      if (error) throw error;
      setCollections(data || []);
    } catch (err) {
      console.error('获取素材包列表失败:', err);
    }
  }, [userId]);

  // 获取收藏的段落（多表关联查询）
  const fetchParagraphs = useCallback(async () => {
    if (!supabase || !userId) return;
    try {
      const { data, error } = await supabase
        .from('saved_paragraphs')
        .select(
          `
          id,
          paragraph_id,
          created_at,
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
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Supabase关联查询可能返回数组或对象，兼容两种情况
      setParagraphs(
        (data || [])
          .map((item: any) => {
            const para = Array.isArray(item.article_paragraphs)
              ? item.article_paragraphs[0]
              : item.article_paragraphs;
            return { ...item, article_paragraphs: para || null };
          })
          .filter((item: any) => item.article_paragraphs) as unknown as SavedParagraph[],
      );
    } catch (err) {
      console.error('获取收藏段落失败:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // 获取划线收藏
  const fetchHighlights = useCallback(async () => {
    if (!supabase || !userId) return;
    try {
      const { data, error } = await supabase
        .from('saved_highlights')
        .select(
          `
          id,
          selected_text,
          created_at,
          articles (
            id,
            title,
            source,
            author,
            url
          )
        `,
        )
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHighlights(
        (data || [])
          .map((item: any) => {
            const article = Array.isArray(item.articles) ? item.articles[0] : item.articles;
            return { ...item, articles: article || null };
          })
          .filter((item: any) => item.articles) as unknown as SavedHighlight[],
      );
    } catch (err) {
      console.error('获取划线收藏失败:', err);
    }
  }, [userId]);

  // 删除划线收藏
  const deleteHighlight = async (highlightId: string) => {
    if (!supabase || !userId) return;
    if (!confirm('删除这条划线收藏？')) return;
    setDeletingId(highlightId);
    try {
      await requireSuccess(supabase.from('saved_highlights').delete().eq('id', highlightId).eq('user_id', userId));
      setHighlights((prev) => prev.filter((h) => h.id !== highlightId));
    } catch (err) {
      console.error('删除划线失败:', err);
    } finally {
      setDeletingId(null);
    }
  };

  // 划线加入素材包
  const addHighlightToCollection = async (highlightId: string, collectionId: string) => {
    if (!supabase || !userId) return;
    setAddingToId(highlightId);
    try {
      const { data: existing } = await supabase
        .from('collection_highlights')
        .select('sort_order')
        .eq('collection_id', collectionId)
        .order('sort_order', { ascending: false })
        .limit(1);
      const nextOrder = (existing?.[0]?.sort_order || 0) + 1;

      await requireSuccess(supabase.from('collection_highlights').insert({
        collection_id: collectionId,
        highlight_id: highlightId,
        sort_order: nextOrder,
      }));
      setShowHighlightMenuFor(null);
    } catch (err) {
      console.error('加入素材包失败:', err);
      alert('该划线可能已在素材包中');
    } finally {
      setAddingToId(null);
    }
  };

  useLoadEffect(fetchParagraphs);
  useLoadEffect(fetchHighlights);
  useLoadEffect(fetchCollections);

  // 加入素材包
  const addToCollection = async (paragraphId: string, collectionId: string) => {
    if (!supabase || !userId) return;
    setAddingToId(paragraphId);
    try {
      // 获取当前最大sort_order
      const { data: existing } = await supabase
        .from('collection_paragraphs')
        .select('sort_order')
        .eq('collection_id', collectionId)
        .order('sort_order', { ascending: false })
        .limit(1);
      const nextOrder = (existing?.[0]?.sort_order || 0) + 1;

      await requireSuccess(supabase.from('collection_paragraphs').insert({
        collection_id: collectionId,
        paragraph_id: paragraphId,
        sort_order: nextOrder,
      }));
      setShowMenuFor(null);
    } catch (err) {
      console.error('加入素材包失败:', err);
      alert('该段落可能已在素材包中');
    } finally {
      setAddingToId(null);
    }
  };

  // 取消收藏
  const handleDelete = async (savedId: string) => {
    if (!supabase || !userId) return;
    setDeletingId(savedId);
    try {
      await requireSuccess(supabase.from('saved_paragraphs').delete().eq('id', savedId).eq('user_id', userId));
      setParagraphs((prev) => prev.filter((p) => p.id !== savedId));
    } catch (err) {
      console.error('取消收藏失败:', err);
    } finally {
      setDeletingId(null);
    }
  };

  // 搜索和筛选（段落）
  const filtered = paragraphs.filter((p) => {
    if (activeSource !== '全部') {
      if (p.article_paragraphs?.articles?.source !== activeSource) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const content = p.article_paragraphs?.content?.toLowerCase() || '';
      const title = p.article_paragraphs?.articles?.title?.toLowerCase() || '';
      if (!content.includes(q) && !title.includes(q)) return false;
    }
    return true;
  });

  // 搜索和筛选（划线）
  const filteredHighlights = highlights.filter((h) => {
    if (activeSource !== '全部') {
      if (h.articles?.source !== activeSource) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const content = h.selected_text?.toLowerCase() || '';
      const title = h.articles?.title?.toLowerCase() || '';
      if (!content.includes(q) && !title.includes(q)) return false;
    }
    return true;
  });

  // 所有来源媒体（合并段落和划线）
  const sources = [
    '全部',
    ...Array.from(
      new Set([
        ...paragraphs.map((p) => p.article_paragraphs?.articles?.source).filter(Boolean),
        ...highlights.map((h) => h.articles?.source).filter(Boolean),
      ]),
    ) as string[],
  ];

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  if (!supabase || userLoading || authError) {
    return <DatabaseNotice loading={userLoading} error={authError} />;
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-amber-600 opacity-70" />
        <p className="text-muted-foreground">段落库需要配置Supabase数据库后使用</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      {/* 页头 */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Bookmark className="h-4 w-4 text-accent" />
          <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">My Paragraphs</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-3">我的段落库</h1>
        <Link to="/reading" className="mb-4 inline-block text-sm text-accent underline">查看导入文章的个人摘录与阅读空间</Link>
        <p className="text-muted-foreground max-w-2xl leading-relaxed">
          你在文章中收藏的所有精彩段落都在这里。按内容搜索、按来源筛选，写作文时快速找到需要的素材。每段都保留原文出处。
        </p>
      </div>

      {/* 搜索 + 来源筛选 */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索内容、文章标题..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* 标签切换 */}
      <div className="flex gap-2 mb-6 border-b border-border/40">
        <button
          onClick={() => setActiveTab('paragraphs')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'paragraphs'
              ? 'text-accent border-accent'
              : 'text-muted-foreground border-transparent hover:text-foreground'
          }`}
        >
          <Bookmark className="h-4 w-4" />
          段落收藏
          <span className="text-xs bg-muted/60 px-1.5 py-0.5 rounded-sm">{paragraphs.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('highlights')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'highlights'
              ? 'text-accent border-accent'
              : 'text-muted-foreground border-transparent hover:text-foreground'
          }`}
        >
          <Highlighter className="h-4 w-4" />
          划线收藏
          <span className="text-xs bg-muted/60 px-1.5 py-0.5 rounded-sm">{highlights.length}</span>
        </button>
      </div>

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

      {/* 统计 */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
        <span className="flex items-center gap-1">
          <FileText className="h-4 w-4" />
          {activeTab === 'paragraphs' ? `共 ${filtered.length} 段收藏` : `共 ${filteredHighlights.length} 条划线`}
        </span>
      </div>

      {/* 列表区域 */}
      {loading ? (
        <div className="text-center py-20">
          <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      ) : activeTab === 'paragraphs' ? (
        // 段落收藏列表
        filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Bookmark className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="mb-2">{paragraphs.length === 0 ? '还没有收藏任何段落' : '没有匹配的段落'}</p>
            <p className="text-xs">
              {paragraphs.length === 0 ? (
                <>
                  去<Link to="/guanlan" className="text-accent hover:underline">观澜</Link>
                  打开一篇文章，悬停段落点击收藏
                </>
              ) : (
                '试试其他关键词或来源'
              )}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((saved) => {
              const para = saved.article_paragraphs;
              const article = para?.articles;
              if (!para || !article) return null;
              return (
                <div
                  key={saved.id}
                  className="group border border-border/60 bg-card rounded-sm p-6 hover:border-accent/20 transition-all"
                >
                  <p className="text-foreground/85 leading-relaxed mb-4">{para.content}</p>
                  <div className="flex flex-wrap items-center justify-between gap-3">
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
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        收藏于 {formatDate(saved.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 relative">
                      <button
                        onClick={() => setShowMenuFor(showMenuFor === saved.id ? null : saved.id)}
                        className="p-1.5 text-muted-foreground hover:text-accent transition-colors opacity-0 group-hover:opacity-100"
                        title="加入素材包"
                      >
                        {addingToId === para.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <FolderPlus className="h-4 w-4" />
                        )}
                      </button>
                      {showMenuFor === saved.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border/60 rounded-sm shadow-lg z-10 py-1">
                          {collections.length === 0 ? (
                            <p className="px-3 py-2 text-xs text-muted-foreground">
                              暂无素材包，<Link to="/collections" className="text-accent hover:underline">去创建</Link>
                            </p>
                          ) : (
                            collections.map((col) => (
                              <button
                                key={col.id}
                                onClick={() => addToCollection(para.id, col.id)}
                                className="w-full text-left px-3 py-2 text-xs hover:bg-muted/50 transition-colors"
                              >
                                {col.name}
                              </button>
                            ))
                          )}
                        </div>
                      )}
                      <button
                        onClick={() => handleDelete(saved.id)}
                        disabled={deletingId === saved.id}
                        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                        title="取消收藏"
                      >
                        {deletingId === saved.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        // 划线收藏列表
        filteredHighlights.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Highlighter className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="mb-2">{highlights.length === 0 ? '还没有收藏任何划线' : '没有匹配的划线'}</p>
            <p className="text-xs">
              {highlights.length === 0 ? (
                <>
                  去<Link to="/guanlan" className="text-accent hover:underline">观澜</Link>
                  打开文章，选中文字点击"收藏划线"
                </>
              ) : (
                '试试其他关键词或来源'
              )}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHighlights.map((highlight) => {
              const article = highlight.articles;
              if (!article) return null;
              return (
                <div
                  key={highlight.id}
                  className="group border border-border/60 bg-card rounded-sm p-6 hover:border-accent/20 transition-all"
                >
                  <div className="flex gap-3 mb-4">
                    <Quote className="h-5 w-5 text-accent/40 shrink-0 mt-1" />
                    <p className="text-foreground/85 leading-relaxed italic">{highlight.selected_text}</p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
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
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        收藏于 {formatDate(highlight.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 relative">
                      <button
                        onClick={() => setShowHighlightMenuFor(showHighlightMenuFor === highlight.id ? null : highlight.id)}
                        className="p-1.5 text-muted-foreground hover:text-accent transition-colors opacity-0 group-hover:opacity-100"
                        title="加入素材包"
                      >
                        {addingToId === highlight.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <FolderPlus className="h-4 w-4" />
                        )}
                      </button>
                      {showHighlightMenuFor === highlight.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border/60 rounded-sm shadow-lg z-10 py-1">
                          {collections.length === 0 ? (
                            <p className="px-3 py-2 text-xs text-muted-foreground">
                              暂无素材包，<Link to="/collections" className="text-accent hover:underline">去创建</Link>
                            </p>
                          ) : (
                            collections.map((col) => (
                              <button
                                key={col.id}
                                onClick={() => addHighlightToCollection(highlight.id, col.id)}
                                className="w-full text-left px-3 py-2 text-xs hover:bg-muted/50 transition-colors"
                              >
                                {col.name}
                              </button>
                            ))
                          )}
                        </div>
                      )}
                      <button
                        onClick={() => deleteHighlight(highlight.id)}
                        disabled={deletingId === highlight.id}
                        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                        title="删除划线"
                      >
                        {deletingId === highlight.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* 底部说明 */}
      <div className="mt-12 p-6 bg-muted/30 border border-border/40 rounded-sm">
        <p className="text-xs text-muted-foreground leading-relaxed">
          段落收藏与你的浏览器绑定（匿名用户ID）。清除浏览器数据或换设备会丢失收藏。
          第三期将接入注册登录，实现跨设备同步。引用段落时请注明原文出处。
        </p>
      </div>
    </div>
  );
}
