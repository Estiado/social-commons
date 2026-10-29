import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import type { ArticleBlock } from './model';
import { readingHierarchy, revealReadingTarget, type ReadingNode } from './hierarchy';

export function ReadingHierarchy({
  blocks,
  renderBlock,
  legacyCatalogue = false,
}: {
  blocks: ArticleBlock[];
  legacyCatalogue?: boolean;
  renderBlock(block: ArticleBlock, displayLevel?: number): ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  const nodes = useMemo(() => readingHierarchy(blocks, legacyCatalogue), [blocks, legacyCatalogue]);
  const hasSections = nodes.some((node) => node.kind === 'section');
  useEffect(() => {
    let frame = 0;
    const reveal = (hash = location.hash) => {
      let id: string;
      try {
        id = decodeURIComponent(hash.slice(1));
      } catch {
        return;
      }
      const target = document.getElementById(id);
      if (!target || !root.current?.contains(target)) return;
      revealReadingTarget(target);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
    };
    const changed = () => reveal();
    const click = (event: MouseEvent) => {
      const anchor = (event.target as Element).closest?.('a[href^="#"]');
      if (anchor) reveal(anchor.getAttribute('href')!);
    };
    reveal();
    window.addEventListener('hashchange', changed);
    document.addEventListener('click', click, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('hashchange', changed);
      document.removeEventListener('click', click, true);
    };
  }, [blocks]);

  const render = (items: ReadingNode[]): ReactNode =>
    items.map((node) =>
      node.kind === 'block' ? (
        renderBlock(node.block)
      ) : (
        <details
          key={node.heading.id}
          className="reading-section"
          open={node.defaultOpen}
          data-reading-default={node.defaultOpen ? 'open' : 'closed'}
        >
          {renderBlock(node.heading, node.level)}
          <div className="reading-section-body">{render(node.children)}</div>
        </details>
      ),
    );
  const setExpanded = (all: boolean) => {
    root.current?.querySelectorAll<HTMLDetailsElement>('.reading-section').forEach((section) => {
      section.open = all || section.dataset.readingDefault === 'open';
    });
  };
  return (
    <div ref={root}>
      {hasSections && (
        <div className="reading-disclosure-controls" aria-label="阅读层级">
          <span>点章节标题可展开或收起</span>
          <button type="button" onClick={() => setExpanded(true)}>
            展开全部
          </button>
          <button type="button" onClick={() => setExpanded(false)}>
            收起补充
          </button>
        </div>
      )}
      {render(nodes)}
    </div>
  );
}
