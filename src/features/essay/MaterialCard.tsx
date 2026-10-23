import { useMemo, type ReactNode } from 'react';
import type { MaterialFields } from './materials';
import { ContentReader } from '@/features/reading/ContentReader';
import { createContentDocument, SITE_ORIGIN } from '@/features/reading/contentDocuments';
import { referenceParagraph } from '@/features/reading/references';

export function MaterialCard({
  material,
  children,
  readingKey,
}: {
  material: MaterialFields & { id?: string };
  readingKey?: string;
  children?: ReactNode;
}) {
  const id = material.id || readingKey || material.title;
  const document = useMemo(
    () =>
      createContentDocument(
        material.title,
        material.source,
        `${SITE_ORIGIN}/essay#material-${encodeURIComponent(id)}`,
        [
          { type: 'heading', level: 2, text: material.title },
          { type: 'paragraph', text: material.content },
          material.sourceUrl
            ? referenceParagraph(material.source, material.sourceUrl, '来源：')
            : { type: 'paragraph', text: `来源：${material.source}` },
          ...(material.usageHint
            ? [
                {
                  type: 'paragraph' as const,
                  text: `使用提示（整理者观点）：${material.usageHint}`,
                },
              ]
            : []),
        ],
      ),
    [id, material.title, material.source, material.content, material.sourceUrl, material.usageHint],
  );
  return (
    <article className="rounded-sm border bg-muted/20 p-5">
      <ContentReader kind="essay" id={`material-${id}`} document={document} />
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
