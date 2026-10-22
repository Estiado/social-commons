import { Link } from 'react-router-dom';
import { TOPIC_SPECIALS } from '@/data/topicSpecials';
import { DAILY_KNOWLEDGE } from '@/data/daily';
import { QUOTES } from '@/data/quotes';

/** Curated topic relationships replace single-character guesses, which produced
 * unrelated recommendations and loaded the wrong module for readers. */
export function RelatedContent({ tags }: { tags: string[] }) {
  const topics = TOPIC_SPECIALS.filter((topic) =>
    topic.relatedTags.some((tag) => tags.includes(tag)),
  );
  const dailyIds = new Set(topics.flatMap((topic) => topic.relatedDailyIds));
  const quoteIds = new Set(topics.flatMap((topic) => topic.relatedQuoteIds));
  const daily = DAILY_KNOWLEDGE.filter((item) => dailyIds.has(item.id)).slice(0, 3);
  const quotes = QUOTES.filter((item) => quoteIds.has(item.id)).slice(0, 3);
  return (
    <aside className="mt-12 space-y-6 border-t pt-6">
      {daily.length > 0 && (
        <section>
          <h2 className="mb-4 font-serif text-xl">相关通识概念</h2>
          {daily.map((item) => (
            <Link
              key={item.id}
              className="mb-3 block rounded-sm border p-4 hover:border-accent"
              to={`/daily/${item.id}`}
            >
              {item.title}
            </Link>
          ))}
        </section>
      )}
      {quotes.length > 0 && (
        <section>
          <h2 className="mb-4 font-serif text-xl">相关名句</h2>
          {quotes.map((item) => (
            <Link
              key={item.id}
              className="mb-3 block rounded-sm border p-4 hover:border-accent"
              to={`/quotes/${item.id}`}
            >
              {item.text} — {item.author}
            </Link>
          ))}
        </section>
      )}
    </aside>
  );
}
