import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getGuanlanEvent } from '@/data/guanlan';
import type { GuanlanEvent } from '@/data/guanlan/types';
import { TOPIC_SPECIALS } from '@/data/topicSpecials';
import { guanlanEventDocument } from '@/features/guanlan/eventDocument';
import { EventSources } from '@/features/guanlan/EventSources';
import { EventRelatedReadings } from '@/features/guanlan/EventRelatedReadings';
import { ContentReader } from '@/features/reading/ContentReader';
import { ReadingAssociations } from '@/features/reading/ReadingAssociations';

export default function GuanlanEventPage() {
  const { id = '' } = useParams();
  const { hash } = useLocation();
  const [loaded, setLoaded] = useState<{ id: string; event?: GuanlanEvent; error?: string }>();
  useEffect(() => {
    let active = true;
    getGuanlanEvent(id)
      .then((event) => {
        if (active) setLoaded({ id, event });
      })
      .catch(() => {
        if (active) setLoaded({ id, error: '事件内容暂时无法加载，请刷新后重试。' });
      });
    return () => {
      active = false;
    };
  }, [id]);
  const event = loaded?.id === id ? loaded.event : undefined;
  const document = useMemo(() => (event ? guanlanEventDocument(event) : undefined), [event]);
  useEffect(() => {
    // The private materials anchor is mounted after the lazy event body arrives.
    if (event && hash === '#my-event-materials')
      window.document.getElementById('my-event-materials')?.scrollIntoView({ block: 'start' });
  }, [event, hash]);
  if (loaded?.id !== id)
    return (
      <p role="status" className="p-10 text-center">
        正在打开事件精读…
      </p>
    );
  if (!event || !document)
    return (
      <div className="p-10 text-center">
        <p>{loaded.error || '未找到这个事件'}</p>
        <Link className="text-accent underline" to="/guanlan">
          返回观澜
        </Link>
      </div>
    );
  const prefix = `guanlan-${id}`;
  const sections = document.blocks.filter((block) => block.type === 'heading' && block.level === 2);
  return (
    <article className="mx-auto max-w-4xl px-5 py-9 md:px-8">
      <Link className="text-sm text-accent underline" to="/guanlan">
        返回观澜
      </Link>
      <header className="my-7 space-y-5 border-b pb-7">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-accent">
          {event.topicIds.map((topicId) => (
            <Link key={topicId} to={'/guanlan/topics/' + topicId}>
              {TOPIC_SPECIALS.find((topic) => topic.id === topicId)?.name}
            </Link>
          ))}
        </div>
        <h1 className="font-serif text-3xl font-semibold leading-relaxed md:text-4xl">
          {event.title}
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">{event.dateLabel}</p>
        <p className="leading-relaxed">{event.summary}</p>
      </header>
      <nav
        aria-label="事件阅读目录"
        className="mb-7 flex flex-wrap gap-x-5 gap-y-3 border-b pb-5 text-sm"
      >
        {sections.map((section) => (
          <a
            key={section.id}
            className="text-accent underline underline-offset-4"
            href={`#${prefix}-${section.id}`}
          >
            {'text' in section ? section.text : ''}
          </a>
        ))}
      </nav>
      <ContentReader key={id} kind="guanlan-event" id={id} document={document} idPrefix={prefix} />
      <EventSources key={id} event={event} />
      <EventRelatedReadings key={id} event={event} />
      <ReadingAssociations event={event} />
    </article>
  );
}
