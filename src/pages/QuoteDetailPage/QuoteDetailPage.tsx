import { Link, useParams } from 'react-router-dom';
import { getQuoteById } from '@/data/quotes';
import { ContentReader } from '@/features/reading/ContentReader';

export default function QuoteDetailPage() {
  const { id = '' } = useParams();
  const quote = getQuoteById(id);
  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <Link to="/quotes" className="mb-8 inline-block text-sm text-accent underline">
        返回撷英名句
      </Link>
      {quote ? (
        <>
          <h1 className="font-serif text-3xl font-semibold leading-relaxed">
            {quote.title || quote.source}
          </h1>
          <p className="my-4 text-muted-foreground">{quote.author}</p>
          {quote.canonicalId && (
            <p className="mb-4 text-sm text-muted-foreground">
              同一作品已合并整理，原有链接仍可使用。
            </p>
          )}
          <ContentReader kind="quote" id={quote.id} />
        </>
      ) : (
        <h1 className="font-serif text-2xl">未找到这条名句</h1>
      )}
    </article>
  );
}
