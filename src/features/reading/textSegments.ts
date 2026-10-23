import type { ArticleAnnotation, TextBlock } from './model.ts';

export interface TextSegment {
  text: string;
  saved: boolean;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  href?: string;
}

/** Sweep annotation and formatting boundaries together. Links keep their
 * original label and offsets, including when a highlight crosses a link. */
export function readingTextSegments(
  block: TextBlock,
  annotations: ArticleAnnotation[],
): TextSegment[] {
  const changes = new Map<number, number>([
    [0, 0],
    [block.text.length, 0],
  ]);
  for (const item of annotations) {
    changes.set(item.start, (changes.get(item.start) || 0) + 1);
    changes.set(item.end, (changes.get(item.end) || 0) - 1);
  }
  const spans = block.spans || [];
  for (const span of spans) {
    if (!changes.has(span.start)) changes.set(span.start, 0);
    if (!changes.has(span.end)) changes.set(span.end, 0);
  }
  const boundaries = [...changes.keys()].sort((a, b) => a - b);
  const segments: TextSegment[] = [];
  let active = 0;
  let spanIndex = 0;
  for (let index = 0; index < boundaries.length - 1; index++) {
    const start = boundaries[index];
    const end = boundaries[index + 1];
    active += changes.get(start) || 0;
    while (spanIndex < spans.length && spans[spanIndex].end <= start) spanIndex++;
    const span = spans[spanIndex];
    segments.push({
      ...(span && span.start <= start ? span : {}),
      text: block.text.slice(start, end),
      saved: active > 0,
    });
  }
  return segments;
}
