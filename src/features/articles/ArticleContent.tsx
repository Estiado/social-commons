import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createAnnotation, type ArticleAnnotation, type ArticleDocument } from './model';
import { articleImageUrl } from './export/assets';

function MarkedText({ text, annotations }: { text: string; annotations: ArticleAnnotation[] }) {
  const boundaries = [...new Set([0, text.length, ...annotations.flatMap((item) => [item.start, item.end])])].sort((a, b) => a - b);
  const fragments: ReactNode[] = [];
  for (let index = 0; index < boundaries.length - 1; index++) {
    const start = boundaries[index]; const end = boundaries[index + 1];
    const saved = annotations.some((item) => item.start <= start && item.end >= end);
    fragments.push(saved ? <mark key={start} className="bg-amber-100 text-inherit dark:bg-amber-900/40">{text.slice(start, end)}</mark> : text.slice(start, end));
  }
  return <>{fragments}</>;
}

function ArticleFigure({ url, alt, caption }: { url: string; alt: string; caption: string }) {
  const [failed, setFailed] = useState(false);
  return <figure className="my-8">
    {failed ? <div className="rounded-sm border border-dashed p-5 text-sm text-muted-foreground">插图暂时无法加载，可在原文核对。<a href={url} target="_blank" rel="noopener noreferrer" className="ml-2 underline">查看插图来源</a></div>
      : <img src={articleImageUrl(url)} alt={alt || caption || '原文插图'} loading="lazy" referrerPolicy="no-referrer" onError={() => setFailed(true)} className="mx-auto max-h-[650px] max-w-full rounded-sm object-contain" />}
    {caption && <figcaption className="mt-3 text-center text-sm text-muted-foreground">{caption}</figcaption>}
  </figure>;
}

export function ArticleContent({ article, annotations = [], onSave, busy = false }: {
  article: ArticleDocument; annotations?: ArticleAnnotation[];
  onSave?(annotations: ArticleAnnotation[]): void; busy?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const annotationsByBlock = useMemo(() => {
    const map = new Map<string, ArticleAnnotation[]>();
    for (const item of annotations) {
      if (item.contentVersion !== article.contentVersion) continue;
      const list = map.get(item.blockId) || []; list.push(item); map.set(item.blockId, list);
    }
    return map;
  }, [annotations, article.contentVersion]);
  const [selection, setSelection] = useState<{ items: ArticleAnnotation[]; x: number; y: number } | null>(null);
  useEffect(() => {
    if (!onSave) return;
    const update = () => {
      const current = window.getSelection();
      if (!current || current.isCollapsed || !current.rangeCount || !root.current?.contains(current.anchorNode) || !root.current?.contains(current.focusNode)) {
        setSelection(null); return;
      }
      const range = current.getRangeAt(0);
      const items: ArticleAnnotation[] = [];
      for (const element of root.current.querySelectorAll<HTMLElement>('[data-reading-text]')) {
        if (!range.intersectsNode(element)) continue;
        const start = document.createRange(); start.selectNodeContents(element);
        const end = start.cloneRange();
        let startOffset = 0; let endOffset = element.textContent?.length || 0;
        if (element.contains(range.startContainer)) { start.setEnd(range.startContainer, range.startOffset); startOffset = start.toString().length; }
        if (element.contains(range.endContainer)) { end.setEnd(range.endContainer, range.endOffset); endOffset = end.toString().length; }
        if (endOffset > startOffset) items.push(createAnnotation(article, element.dataset.blockId!, startOffset, endOffset, 'highlight'));
      }
      if (!items.length || items.every((item) => !item.text.trim())) { setSelection(null); return; }
      const rect = range.getBoundingClientRect();
      setSelection({ items, x: Math.max(95, Math.min(window.innerWidth - 95, rect.left + rect.width / 2)), y: Math.max(80, rect.top - 8) });
    };
    // selectionchange covers keyboard selection and native mobile selection handles.
    document.addEventListener('selectionchange', update);
    window.addEventListener('scroll', update, { passive: true });
    return () => { document.removeEventListener('selectionchange', update); window.removeEventListener('scroll', update); };
  }, [article, onSave]);
  return <>
    <div ref={root} className="font-serif text-[17px] leading-[1.95] break-words">
      {article.blocks.map((block) => {
        if (block.type === 'image') return <ArticleFigure key={block.id} {...block} />;
        const saved = annotationsByBlock.get(block.id) || [];
        const wholeSaved = saved.some((item) => item.kind === 'paragraph');
        const text = <MarkedText text={block.text} annotations={saved} />;
        const attributes = { 'data-reading-text': true, 'data-block-id': block.id, className: 'whitespace-pre-wrap' };
        return <div key={block.id} id={`reading-${block.id}`} className="group relative my-5 scroll-mt-24 rounded-sm hover:bg-accent/[0.025]">
          {block.type === 'heading' ? <h2 {...attributes} className={`font-semibold ${block.level && block.level <= 2 ? 'text-2xl' : 'text-xl'}`}>{text}</h2>
            : block.type === 'quote' ? <blockquote {...attributes} className="border-l-2 border-accent/40 pl-5 text-muted-foreground whitespace-pre-wrap">{text}</blockquote>
              : block.type === 'list-item' ? <div className="flex gap-3"><span aria-hidden="true">•</span><p {...attributes}>{text}</p></div>
                : <p {...attributes}>{text}</p>}
          {onSave && <button type="button" aria-label={wholeSaved ? '取消收藏本段' : '收藏本段'} title={wholeSaved ? '取消收藏本段' : '收藏本段'} disabled={busy}
            className={`my-1 inline-flex items-center gap-1.5 rounded px-2 py-1 font-sans text-xs transition-opacity lg:absolute lg:-right-2 lg:top-0 lg:translate-x-full lg:opacity-0 lg:group-hover:opacity-100 lg:focus:opacity-100 ${wholeSaved ? 'text-accent lg:opacity-100' : 'text-muted-foreground hover:text-accent'}`}
            onClick={() => onSave([createAnnotation(article, block.id, 0, block.text.length, 'paragraph')])}>
            {wholeSaved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}{wholeSaved ? '已收藏' : '收藏'}
          </button>}
        </div>;
      })}
    </div>
    {selection && onSave && <div className="fixed z-[60] -translate-x-1/2 -translate-y-full rounded-sm border bg-card p-1 shadow-md" style={{ left: selection.x, top: selection.y }} onPointerDown={(event) => event.preventDefault()}>
      <Button size="sm" disabled={busy} onClick={() => { onSave(selection.items); setSelection(null); window.getSelection()?.removeAllRanges(); }}>收藏划线{selection.items.length > 1 ? `（${selection.items.length} 段）` : ''}</Button>
    </div>}
  </>;
}
