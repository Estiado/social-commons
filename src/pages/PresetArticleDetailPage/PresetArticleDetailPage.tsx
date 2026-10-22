import { Link, useParams } from 'react-router-dom';
import { PRESET_ARTICLES } from '@/data/presetArticles';
import { ContentReader } from '@/features/reading/ContentReader';
import { RelatedContent } from '@/features/reading/RelatedContent';

export default function PresetArticleDetailPage() {
  const { id = '' } = useParams();
  const item = PRESET_ARTICLES.find((item) => item.id === id);
  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <Link className="mb-6 inline-block text-sm text-accent underline" to="/guanlan">
        返回观澜
      </Link>
      {item ? (
        <>
          <h1 className="mb-3 font-serif text-3xl font-semibold">{item.title}</h1>
          <p className="mb-7 text-sm text-muted-foreground">
            {item.author} · {item.source}
          </p>
          <ContentReader kind="preset" id={id} />
          <RelatedContent tags={item.tags} />
        </>
      ) : (
        <h1>未找到这篇文章</h1>
      )}
    </article>
  );
}
