import { useState } from 'react';
import { Link } from 'react-router-dom';
import { eventsForTopic } from '@/data/guanlan/catalogue';
import { TOPIC_SPECIALS } from '@/data/topicSpecials';
import { Input } from '@/components/ui/input';

export function EventCatalogue({ topicId }: { topicId?: string }) {
  const [query, setQuery] = useState('');
  const events = eventsForTopic(topicId);
  const normalized = query.trim().toLocaleLowerCase();
  const visible = events.filter((event) =>
    [event.title, event.summary, event.question, ...event.keywords]
      .join(' ')
      .toLocaleLowerCase()
      .includes(normalized),
  );
  return (
    <section aria-label="事件精读" className="my-8 space-y-5">
      <div className="flex items-end justify-between gap-3">
        <h2 className="font-serif text-2xl font-semibold">事件精读</h2>
        <span role="status" className="text-sm text-muted-foreground">
          {visible.length} 篇
        </span>
      </div>
      {events.length > 0 && (
        <Input
          aria-label="搜索观澜事件"
          placeholder="搜索事件、现象或关键词…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      )}
      <div className="space-y-4">
        {visible.map((event) => (
          <article
            key={event.id}
            data-page-enter="item"
            className="rounded-sm border bg-card p-5 md:p-7"
          >
            <p className="text-xs leading-relaxed text-muted-foreground">{event.dateLabel}</p>
            <Link to={'/guanlan/events/' + event.id} className="group block">
              <h3 className="my-3 font-serif text-xl font-semibold leading-relaxed group-hover:text-accent">
                {event.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{event.summary}</p>
              <p className="mt-4 text-sm text-accent">{event.question}</p>
              <span className="mt-4 inline-block text-sm underline underline-offset-4">
                进入事件精读 →
              </span>
            </Link>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t pt-3 text-xs text-muted-foreground">
              {event.topicIds.map((id) => (
                <Link key={id} to={'/guanlan/topics/' + id} className="hover:text-accent">
                  {TOPIC_SPECIALS.find((topic) => topic.id === id)?.name}
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
      {!visible.length && (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {events.length
            ? '没有匹配的事件，可换一个关键词。'
            : '本话题的既有文章、通识与名句保留在下方相关资料中。'}
        </p>
      )}
    </section>
  );
}
