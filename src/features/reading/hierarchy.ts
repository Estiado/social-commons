import type { ArticleBlock, TextBlock } from './model.ts';

export type ReadingNode =
  | { kind: 'block'; block: ArticleBlock }
  | {
      kind: 'section';
      heading: TextBlock;
      level: number;
      children: ReadingNode[];
      defaultOpen: boolean;
    };

const SUPPLEMENT_SECTIONS = new Set([
  '前因与参与者',
  '从原文读起',
  '读懂关键词',
  '不同视角',
  '把几个问题讲清楚',
  '资料来源',
  '媒体评论与研究',
  '参考资料',
  '学术文献目录',
]);

// Older catalogue snapshots use H2 for every reference/view. Interpret those
// known containers at display time, leaving stored blocks and exports intact.
const FLAT_CONTAINERS = new Set(['多方视角', '学术文献目录', '参考资料']);
const MAIN_BOUNDARIES = new Set([
  '事件概述',
  ...FLAT_CONTAINERS,
  '作品赏析',
  '素材列表',
  '适用话题',
]);

/** A linear, display-only tree. Blocks and their IDs remain the canonical export
 * sequence; no text, annotation offsets or stored snapshots are rewritten. */
export function readingHierarchy(
  blocks: readonly ArticleBlock[],
  legacyCatalogue = false,
): ReadingNode[] {
  const roots: ReadingNode[] = [];
  const stack: Extract<ReadingNode, { kind: 'section' }>[] = [];
  let flatContainer = false;
  for (const block of blocks) {
    if (block.type !== 'heading') {
      (stack.at(-1)?.children || roots).push({ kind: 'block', block });
      continue;
    }
    if (legacyCatalogue && MAIN_BOUNDARIES.has(block.text))
      flatContainer = FLAT_CONTAINERS.has(block.text);
    const level =
      flatContainer && !MAIN_BOUNDARIES.has(block.text)
        ? Math.max(3, block.level || 2)
        : Math.max(2, block.level || 2);
    while (stack.length && stack.at(-1)!.level >= level) stack.pop();
    const parent = stack.at(-1);
    const section: Extract<ReadingNode, { kind: 'section' }> = {
      kind: 'section',
      heading: block,
      level,
      children: [],
      defaultOpen:
        level === 2
          ? !SUPPLEMENT_SECTIONS.has(block.text)
          : ['新闻回放', '深度背景', '事件概述'].includes(parent?.heading.text || ''),
    };
    (parent?.children || roots).push(section);
    stack.push(section);
  }
  return roots;
}

export function revealReadingTarget(target: HTMLElement) {
  let parent = target.parentElement;
  while (parent) {
    if (parent instanceof HTMLDetailsElement) parent.open = true;
    parent = parent.parentElement;
  }
}
