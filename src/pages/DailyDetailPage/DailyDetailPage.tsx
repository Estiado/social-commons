import { Link, useParams, useSearchParams } from 'react-router-dom';
import { DAILY_KNOWLEDGE } from '@/data/daily';
import { ContentReader } from '@/features/reading/ContentReader';
import { DAILY_READING_PATHS } from '@/data/readingPaths';
import { readingPathForItem } from '@/features/discovery/selection';
import { ReadingPathNavigation } from '@/features/discovery/ReadingPathSection';

const itemsById = new Map(DAILY_KNOWLEDGE.map((item) => [item.id, item]));

export default function DailyDetailPage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const item = itemsById.get(id ?? '');
  const path = readingPathForItem(DAILY_READING_PATHS, id ?? '', params.get('path'));
  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <Link to="/daily" className="mb-7 inline-block text-sm text-accent underline">
        返回日新通识
      </Link>
      {item ? (
        <>
          <p className="mb-3 text-sm text-muted-foreground">{item.category}</p>
          <h1 className="mb-5 font-serif text-3xl font-semibold leading-relaxed">{item.title}</h1>
          <ContentReader kind="daily" id={item.id} />
          {path && (
            <ReadingPathNavigation path={path} id={item.id} basePath="/daily" items={itemsById} />
          )}
        </>
      ) : (
        <h1 className="font-serif text-2xl">未找到这个通识词条</h1>
      )}
    </article>
  );
}
