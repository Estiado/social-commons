import { Link, useNavigate } from 'react-router-dom';
import { TOPIC_SPECIALS } from '@/data/topicSpecials';
import { PRESET_ARTICLES } from '@/data/presetArticles';
import { eventsForTopic } from '@/data/guanlan/catalogue';
import { CommentaryCatalogue } from '@/features/reading/CommentaryCatalogue';
import { EventCatalogue } from '@/features/guanlan/EventCatalogue';

export default function GuanlanPage() {
  const navigate = useNavigate();
  const featured = TOPIC_SPECIALS.filter((topic) => eventsForTopic(topic.id).length > 0).slice(
    0,
    6,
  );
  return (
    <div className="mx-auto max-w-5xl px-5 py-10 md:px-6">
      <header data-tour="guanlan-intro" className="mb-8 space-y-4">
        <p className="text-xs tracking-widest text-accent">GUANLAN · READING THE WORLD</p>
        <h1 className="font-serif text-4xl font-semibold">观澜</h1>
        <p className="max-w-3xl leading-relaxed text-muted-foreground">
          从一件事出发，读清来龙去脉，比较不同立意，再看看观点的另一面。时评、研究与名句，沿着事件一起读。
        </p>
      </header>
      <nav aria-label="观澜话题" className="space-y-4 border-y py-5">
        <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm">
          {featured.map((topic) => (
            <Link
              className="text-accent hover:underline"
              key={topic.id}
              to={'/guanlan/topics/' + topic.id}
            >
              {topic.name}
              <span className="ml-1 text-xs text-muted-foreground">
                {eventsForTopic(topic.id).length}篇
              </span>
            </Link>
          ))}
        </div>
        <label className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          按话题进入
          <select
            aria-label="选择观澜话题"
            className="w-full rounded-sm border bg-background p-2 sm:w-auto"
            value=""
            onChange={(event) => {
              if (event.target.value) navigate('/guanlan/topics/' + event.target.value);
            }}
          >
            <option value="">全部话题与相关资料</option>
            {TOPIC_SPECIALS.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name} ·{' '}
                {eventsForTopic(topic.id).length
                  ? `${eventsForTopic(topic.id).length}篇事件精读`
                  : '相关资料'}
              </option>
            ))}
          </select>
        </label>
      </nav>
      <EventCatalogue />
      <details className="my-10 rounded-sm border p-5">
        <summary className="cursor-pointer font-serif text-xl">全部时评资料 · 按媒体查阅</summary>
        <CommentaryCatalogue />
      </details>
      <details className="my-10 rounded-sm border p-5">
        <summary className="cursor-pointer font-serif text-xl">经典文章精读</summary>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {PRESET_ARTICLES.map((article) => (
            <Link
              className="rounded-sm border p-4 hover:border-accent"
              key={article.id}
              to={'/guanlan/preset/' + article.id}
            >
              {article.title}
            </Link>
          ))}
        </div>
      </details>
    </div>
  );
}
