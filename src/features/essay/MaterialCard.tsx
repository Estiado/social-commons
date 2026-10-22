import type { ReactNode } from 'react';
import type { MaterialFields } from './materials';

export function MaterialCard({
  material,
  children,
}: {
  material: MaterialFields;
  children?: ReactNode;
}) {
  return (
    <article className="rounded-sm border bg-muted/20 p-5">
      <h4 className="mb-3 font-serif text-lg font-semibold">{material.title}</h4>
      <p className="whitespace-pre-line text-sm leading-relaxed">{material.content}</p>
      <p className="mt-3 text-xs text-muted-foreground">来源：{material.source}</p>
      {material.sourceUrl && (
        <a
          href={material.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-xs text-accent underline"
        >
          核对原始来源
        </a>
      )}
      {material.usageHint && (
        <p className="mt-3 text-sm text-accent">使用提示（整理者观点）：{material.usageHint}</p>
      )}
      {children}
    </article>
  );
}
