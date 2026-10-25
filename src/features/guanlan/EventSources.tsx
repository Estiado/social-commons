import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { GuanlanEvent } from '@/data/guanlan/types';

/** Filtering changes only this reference list, never the saved reading text. */
export function EventSources({
  event,
  anchors,
}: {
  event: GuanlanEvent;
  anchors: Record<string, string>;
}) {
  const [publication, setPublication] = useState('');
  const publications = [...new Set(event.sources.map((source) => source.publication))];
  const sources = event.sources.filter(
    (source) => !publication || source.publication === publication,
  );
  return (
    <section aria-label="按媒体查阅事件资料" className="my-12 border-t pt-7">
      <h2 className="font-serif text-2xl font-semibold">原文与电子文献</h2>
      <label className="my-5 flex flex-wrap items-center gap-3 text-sm">
        按媒体或期刊查阅
        <select
          aria-label="事件资料来源"
          value={publication}
          onChange={(e) => setPublication(e.target.value)}
          className="w-full max-w-md rounded-sm border bg-background p-2"
        >
          <option value="">全部来源</option>
          {publications.map((name) => (
            <option key={name}>{name}</option>
          ))}
        </select>
      </label>
      <p role="status" className="mb-4 text-xs text-muted-foreground">
        {sources.length} 份资料
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {sources.map((source) => (
          <article key={source.id} className="rounded-sm border bg-card p-5">
            <p className="text-xs leading-relaxed text-muted-foreground">
              {source.kind} · {source.date} · {source.publication}
            </p>
            <h3 className="my-3 font-serif text-lg font-semibold">
              <a
                className="text-accent underline underline-offset-4"
                href={source.url}
                target="_blank"
                rel="noreferrer"
              >
                {source.title}
              </a>
            </h3>
            <p className="mb-3 text-xs text-muted-foreground">{source.author}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">{source.description}</p>
            <a
              href={anchors[source.id]}
              className="mt-4 inline-block text-sm text-accent underline"
            >
              阅读站内提要 →
            </a>
            {source.fullText && (
              <a
                className="mt-4 block text-sm text-accent underline"
                href={source.fullText.url}
                target="_blank"
                rel="noreferrer"
              >
                {source.fullText.title}
              </a>
            )}
            {source.kind !== '研究' && (
              <Link
                className="mt-4 inline-block text-sm text-accent underline"
                to={
                  '/reading/import?' +
                  new URLSearchParams({
                    url: source.url,
                    event: event.id,
                    ...(source.importMode ? { mode: source.importMode } : {}),
                  })
                }
              >
                {source.importMode === 'paste' ? '粘贴这篇正文到事件 →' : '导入这篇原文到事件 →'}
              </Link>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
