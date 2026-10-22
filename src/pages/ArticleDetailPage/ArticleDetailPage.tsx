import { Link, useParams } from 'react-router-dom';
import { ContentReader } from '@/features/reading/ContentReader';

/** Legacy public articles are read-only source material. New annotations always
 * go to the private workspace, never back into the old public article cache. */
export default function ArticleDetailPage() {
  const { id = '' } = useParams();
  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <Link to="/guanlan" className="mb-6 inline-block text-sm text-accent underline">
        返回观澜
      </Link>
      <h1 className="mb-7 font-serif text-2xl">时评阅读</h1>
      <ContentReader kind="public-article" id={id} />
    </article>
  );
}
