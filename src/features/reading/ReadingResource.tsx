import { useState } from 'react';
import type { TextBlock } from './model';

export function ReadingResource({ resource }: { resource: NonNullable<TextBlock['resource']> }) {
  const [open, setOpen] = useState(false);
  const url = new URL(resource.url);
  const local =
    url.origin === 'https://social-commons.pages.dev' &&
    /^\/readings\/history\/[a-z0-9-]+\.(pdf|txt)$/u.test(url.pathname);
  const href = local ? url.pathname : resource.url;
  return (
    <aside
      aria-label={`电子文献：${resource.title}`}
      className="mt-3 rounded-sm border border-border bg-card p-4 font-sans text-sm"
    >
      <p className="text-xs leading-relaxed text-muted-foreground">
        {resource.format} · {resource.edition}
      </p>
      <div className="mt-3 flex flex-wrap gap-4">
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent underline">
          打开电子版
        </a>
        {local && (
          <a href={href} download className="text-accent underline">
            下载电子版
          </a>
        )}
        {resource.sourceUrl !== resource.url && (
          <a
            href={resource.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground underline"
          >
            出版来源
          </a>
        )}
      </div>
      {resource.license === 'CC BY 4.0' && (
        <p className="mt-2 text-xs text-muted-foreground">CC BY 4.0</p>
      )}
      {local && (
        <details className="mt-3" onToggle={(event) => setOpen(event.currentTarget.open)}>
          <summary className="cursor-pointer text-accent">在此展开阅读</summary>
          {open && (
            <iframe
              src={href}
              title={resource.title}
              loading="lazy"
              className="mt-3 h-[32rem] w-full rounded-sm border bg-white"
            />
          )}
        </details>
      )}
    </aside>
  );
}
