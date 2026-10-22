import { Link, useParams } from 'react-router-dom';
import { TOPIC_SPECIALS } from '@/data/topicSpecials';
import { DAILY_KNOWLEDGE } from '@/data/daily';
import { QUOTES } from '@/data/quotes';
import { ContentReader } from '@/features/reading/ContentReader';
import { CommentaryCatalogue } from '@/features/reading/CommentaryCatalogue';
import { TopicReading } from '@/features/reading/TopicReading';

export default function TopicDetailPage() {
  const { id } = useParams();
  const topic = TOPIC_SPECIALS.find((item) => item.id === id);
  if (!topic)
    return (
      <div className="p-10 text-center">
        <p>专题不存在</p>
        <Link to="/guanlan">返回观澜</Link>
      </div>
    );
  const daily = DAILY_KNOWLEDGE.filter((item) => topic.relatedDailyIds.includes(item.id));
  const quotes = QUOTES.filter((item) => topic.relatedQuoteIds.includes(item.id));
  return (
    <div className="mx-auto max-w-5xl px-5 py-10 md:px-6">
      <Link className="mb-7 inline-block text-sm text-accent underline" to="/guanlan">
        返回观澜
      </Link>
      <header className={'rounded-sm border bg-gradient-to-br p-6 md:p-9 ' + topic.color}>
        <p className="mb-3 text-xs text-accent">{topic.relatedTags.join(' · ')}</p>
        <h1 className="mb-4 font-serif text-3xl font-semibold">{topic.name}</h1>
        <ContentReader kind="topic" id={topic.id} />
      </header>
      <TopicReading key={topic.id} topic={topic} />
      <CommentaryCatalogue key={'catalogue-' + topic.id} topicId={topic.id} />
      <section className="my-10" aria-label="相关通识概念">
        <h2 className="mb-5 font-serif text-2xl font-semibold">相关通识概念</h2>
        <div className="space-y-4">
          {daily.map((item) => (
            <Link
              key={item.id}
              to={'/daily/' + item.id}
              className="block rounded-sm border bg-card p-5 hover:border-accent"
            >
              <p className="mb-2 text-xs text-accent">{item.category}</p>
              <h3 className="mb-2 font-serif text-lg font-semibold">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="my-10" aria-label="相关名句">
        <h2 className="mb-5 font-serif text-2xl font-semibold">相关名句</h2>
        <div className="space-y-4">
          {quotes.map((item) => (
            <Link
              key={item.id}
              to={'/quotes/' + item.id}
              className="block rounded-sm border bg-card p-5 hover:border-accent"
            >
              <blockquote className="mb-3 line-clamp-3 whitespace-pre-line font-serif text-lg leading-relaxed">
                {item.text}
              </blockquote>
              <p className="text-sm text-muted-foreground">
                {item.author} · {item.source}
              </p>
            </Link>
          ))}
        </div>
      </section>
      <p className="rounded-sm border p-5 text-sm leading-relaxed text-muted-foreground">
        阅读时可选择段落、语句加入阅读空间，再勾选编成一份文稿。公共目录保留原文出处，个人导入正文仅在自己的浏览器使用。
      </p>
    </div>
  );
}
