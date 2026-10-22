import { Link } from 'react-router-dom';
import { TOPIC_SPECIALS } from '@/data/topicSpecials';
import { CURATED_COMMENTARIES } from '@/data/curatedCommentaries';
import { PRESET_ARTICLES } from '@/data/presetArticles';
import { CommentaryCatalogue } from '@/features/reading/CommentaryCatalogue';
import { commentaryTopics } from '@/features/reading/commentaryTopics';
import { Button } from '@/components/ui/button';

const counts = new Map<string, number>();
for (const article of CURATED_COMMENTARIES)
  for (const topic of commentaryTopics(article)) counts.set(topic, (counts.get(topic) || 0) + 1);
export default function GuanlanPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-6">
      <header className="mb-8">
        <p className="mb-3 text-xs tracking-widest text-accent">GUANLAN · READING THE WORLD</p>
        <h1 className="mb-4 font-serif text-4xl font-semibold">观澜</h1>
        <p className="max-w-3xl leading-relaxed text-muted-foreground">
          从一个主题出发，读时评、通识与名句。比较不同媒体的论证，把有出处的文字带进自己的文稿。
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/reading/import">导入自己的时评</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/reading">打开阅读空间</Link>
          </Button>
        </div>
      </header>
      <section aria-label="观澜主题" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOPIC_SPECIALS.map((topic) => (
          <Link
            key={topic.id}
            to={'/guanlan/topics/' + topic.id}
            className={
              'rounded-sm border bg-gradient-to-br p-6 transition-colors hover:border-accent ' +
              topic.color
            }
          >
            <h2 className="mb-2 font-serif text-xl font-semibold">{topic.name}</h2>
            <p className="mb-4 text-sm text-muted-foreground">{topic.subtitle}</p>
            <p className="text-xs text-accent">
              {counts.get(topic.id) || 0} 篇时评 · {topic.relatedDailyIds.length} 条通识 ·{' '}
              {topic.relatedQuoteIds.length} 句名句
            </p>
          </Link>
        ))}
      </section>
      <CommentaryCatalogue />
      <details className="my-10 rounded-sm border p-5">
        <summary className="cursor-pointer font-serif text-xl">经典文章精读</summary>
        <p className="my-4 text-sm text-muted-foreground">
          保留原有经典阅读内容，与近期时评分开标示。
        </p>
        <div className="grid gap-3 md:grid-cols-2">
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
