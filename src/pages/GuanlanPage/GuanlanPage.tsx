import { Link, useSearchParams } from 'react-router-dom';
import { TopicNavigation } from '@/features/guanlan/TopicNavigation';
import { PRESET_ARTICLES } from '@/data/presetArticles';

import { CommentaryCatalogue } from '@/features/reading/CommentaryCatalogue';
import { EventCatalogue } from '@/features/guanlan/EventCatalogue';

export default function GuanlanPage() {
  const [params] = useSearchParams();
  return (
    <div className="mx-auto max-w-5xl px-5 py-10 md:px-6">
      <header data-tour="guanlan-intro" className="mb-8 space-y-4">
        <h1 className="font-serif text-4xl font-semibold">观澜</h1>
        <p className="max-w-3xl leading-relaxed text-muted-foreground">
          从一件事出发，读清来龙去脉，比较不同立意，再看看观点的另一面。时评、研究与名句，沿着事件一起读。
        </p>
      </header>
      <TopicNavigation />
      <EventCatalogue groupId={params.get('group') || undefined} />
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
