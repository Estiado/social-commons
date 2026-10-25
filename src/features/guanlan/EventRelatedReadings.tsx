import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DAILY_KNOWLEDGE } from '@/data/daily';
import { getQuoteById } from '@/data/quotes';
import type { GuanlanEvent } from '@/data/guanlan/types';
import { ContentReader } from '@/features/reading/ContentReader';

function RelatedReading({
  kind,
  id,
  title,
  label,
}: {
  kind: 'daily' | 'quote';
  id: string;
  title: string;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <details
      className="rounded-sm border bg-card p-4"
      onToggle={(e) => setOpen(e.currentTarget.open)}
    >
      <summary className="cursor-pointer font-serif leading-relaxed">
        <span className="mb-1 block font-sans text-xs text-muted-foreground">{label}</span>
        {title}
      </summary>
      {open && (
        <div className="mt-5 border-t pt-4">
          <Link
            className="text-sm text-accent underline"
            to={`/${kind === 'quote' ? 'quotes' : 'daily'}/${id}`}
          >
            打开独立页面 →
          </Link>
          <ContentReader kind={kind} id={id} idPrefix={`event-related-${id}`} />
        </div>
      )}
    </details>
  );
}

/** Closed references do not initialize their readers or access private storage. */
export function EventRelatedReadings({ event }: { event: GuanlanEvent }) {
  return (
    <section aria-label="事件关联阅读" className="my-10 space-y-5 border-t pt-7">
      <h2 className="font-serif text-2xl font-semibold">相关通识与名句</h2>
      <p className="text-sm text-muted-foreground">展开即可阅读、划线或保存到阅读空间。</p>
      {event.relatedDailyIds.map((id) => {
        const item = DAILY_KNOWLEDGE.find((entry) => entry.id === id);
        return item ? (
          <RelatedReading
            key={id}
            kind="daily"
            id={id}
            title={item.title}
            label={`日新 · ${item.category}`}
          />
        ) : null;
      })}
      {event.relatedQuoteIds.map((id) => {
        const item = getQuoteById(id);
        return item ? (
          <RelatedReading
            key={id}
            kind="quote"
            id={id}
            title={item.title || item.source}
            label={`撷英 · ${item.author}`}
          />
        ) : null;
      })}
    </section>
  );
}
