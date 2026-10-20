import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Trash2,
  Download,
  Check,
  Loader2,
  AlertCircle,
  FileText,
  ExternalLink,
  Clock,
  ChevronDown as ChevronDownIcon,
  FileDown,
} from 'lucide-react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { supabase } from '@/lib/supabase';
import { useUserId } from '@/hooks/useUserId';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

interface Collection {
  id: string;
  name: string;
  description: string | null;
}

export default function CollectionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = useUserId();

  const [collection, setCollection] = useState<Collection | null>(null);
  const [paragraphs, setParagraphs] = useState<CollectionParagraph[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);

  // 获取素材包和段落
  const fetchData = useCallback(async () => {
    if (!supabase || !id || !userId) return;
    try {
      setLoading(true);

      // 获取素材包信息
      const { data: colData, error: colError } = await supabase
        .from('collections')
        .select('id, name, description')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (colError) throw colError;
      setCollection(colData);

      // 获取素材包中的段落（按sort_order排序）
      const { data: paraData, error: paraError } = await supabase
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
    } catch (err) {
      console.error('获取素材包详情失败:', err);
    } finally {
      setLoading(false);
    }
  }, [id, userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      await supabase
        .from('collection_paragraphs')
        .update({ sort_order: target.sort_order })
        .eq('collection_id', id)
        .eq('paragraph_id', current.paragraph_id);

      await supabase
        .from('collection_paragraphs')
        .update({ sort_order: current.sort_order })
        .eq('collection_id', id)
        .eq('paragraph_id', target.paragraph_id);

      // 本地更新顺序
      const newParagraphs = [...paragraphs];
      [newParagraphs[index], newParagraphs[targetIndex]] = [newParagraphs[targetIndex], newParagraphs[index]];
      setParagraphs(newParagraphs);
    } catch (err) {
      console.error('移动段落失败:', err);
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
      await supabase
        .from('collection_paragraphs')
        .delete()
        .eq('collection_id', id)
        .eq('paragraph_id', paragraphId);
      setParagraphs((prev) => prev.filter((p) => p.paragraph_id !== paragraphId));
    } catch (err) {
      console.error('移除段落失败:', err);
    } finally {
      setActionId(null);
    }
  };

  // 生成导出内容的通用数据
  const getExportData = () => {
    return paragraphs.map((p, i) => {
      const para = p.article_paragraphs;
      const article = para?.articles;
      return {
        index: i + 1,
        content: para?.content || '',
        title: article?.title || '未知文章',
        source: article?.source || '未知来源',
        author: article?.author || '',
        url: article?.url || '',
      };
    });
  };

  // 通用下载函数
  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 导出TXT
  const exportTxt = () => {
    if (paragraphs.length === 0) return;
    setExporting('txt');
    const data = getExportData();
    const content = data
      .map((d) => `${d.index}. ${d.content}\n   —— 摘自《${d.title}》（${d.source}）`)
      .join('\n\n');
    const fullText = `【${collection?.name || '素材包'}】\n\n${content}\n\n—— 由社科通识·素材包导出`;
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, `${collection?.name || '素材包'}.txt`);
    setExporting(null);
    setShowExportMenu(false);
  };

  // 导出Markdown
  const exportMarkdown = () => {
    if (paragraphs.length === 0) return;
    setExporting('md');
    const data = getExportData();
    const content = data
      .map((d) => `### ${d.index}. ${d.content}\n\n> 摘自《${d.title}》（${d.source}）${d.author ? ` · ${d.author}` : ''}\n\n[原文链接](${d.url})`)
      .join('\n\n---\n\n');
    const fullText = `# ${collection?.name || '素材包'}\n\n${collection?.description ? `> ${collection.description}\n\n` : ''}${content}\n\n---\n\n*由社科通识·素材包导出*`;
    const blob = new Blob([fullText], { type: 'text/markdown;charset=utf-8' });
    downloadBlob(blob, `${collection?.name || '素材包'}.md`);
    setExporting(null);
    setShowExportMenu(false);
  };

  // 导出DOCX
  const exportDocx = async () => {
    if (paragraphs.length === 0) return;
    setExporting('docx');
    try {
      const data = getExportData();
      const children: Paragraph[] = [];

      // 标题
      children.push(
        new Paragraph({
          text: collection?.name || '素材包',
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
      );

      // 描述
      if (collection?.description) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: collection.description, italics: true, color: '666666' })],
            spacing: { after: 300 },
          }),
        );
      }

      // 段落内容
      data.forEach((d) => {
        children.push(
          new Paragraph({
            text: `${d.index}. ${d.content}`,
            spacing: { before: 200, after: 100 },
          }),
        );
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `—— 摘自《${d.title}》（${d.source}）${d.author ? ` · ${d.author}` : ''}`,
                size: 20,
                color: '888888',
              }),
            ],
            spacing: { after: 200 },
          }),
        );
      });

      // 页脚
      children.push(
        new Paragraph({
          children: [new TextRun({ text: '由社科通识·素材包导出', size: 18, color: 'AAAAAA' })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 400 },
        }),
      );

      const doc = new Document({
        sections: [{ properties: {}, children }],
      });

      const blob = await Packer.toBlob(doc);
      downloadBlob(blob, `${collection?.name || '素材包'}.docx`);
    } catch (err) {
      console.error('导出DOCX失败:', err);
      alert('导出失败，请重试');
    } finally {
      setExporting(null);
      setShowExportMenu(false);
    }
  };

  // 导出PDF（通过浏览器打印功能）
  const exportPdf = () => {
    if (paragraphs.length === 0) return;
    setExporting('pdf');
    const data = getExportData();
    const content = data
      .map(
        (d) => `
        <div style="margin-bottom: 24px;">
          <p style="font-size: 14px; line-height: 1.8; margin: 0 0 8px 0;">${d.index}. ${d.content}</p>
          <p style="font-size: 12px; color: #666; margin: 0;">—— 摘自《${d.title}》（${d.source}）${d.author ? ` · ${d.author}` : ''}</p>
        </div>
      `,
      )
      .join('');

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('请允许弹出窗口以导出PDF');
      setExporting(null);
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${collection?.name || '素材包'}</title>
        <style>
          body { font-family: 'Noto Serif SC', 'SimSun', serif; max-width: 700px; margin: 40px auto; padding: 0 20px; color: #333; }
          h1 { text-align: center; font-size: 24px; margin-bottom: 8px; }
          .desc { text-align: center; color: #666; font-size: 14px; margin-bottom: 32px; font-style: italic; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 40px; border-top: 1px solid #eee; padding-top: 16px; }
          @media print { body { margin: 20px; } }
        </style>
      </head>
      <body>
        <h1>${collection?.name || '素材包'}</h1>
        ${collection?.description ? `<p class="desc">${collection.description}</p>` : ''}
        ${content}
        <div class="footer">由社科通识·素材包导出</div>
        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `);
    printWindow.document.close();
    setExporting(null);
    setShowExportMenu(false);
  };

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
              disabled={paragraphs.length === 0}
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

      {/* 段落列表 */}
      {paragraphs.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="mb-2">素材包还是空的</p>
          <p className="text-xs">
            去<Link to="/paragraphs" className="text-accent hover:underline">段落库</Link>
            把收藏的段落加入这个素材包
          </p>
        </div>
      ) : (
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
