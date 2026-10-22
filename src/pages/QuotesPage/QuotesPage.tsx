import { useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { QUOTES } from '@/data/quotes';
import { ContentReader } from '@/features/reading/ContentReader';
import { Button } from '@/components/ui/button';

export default function QuotesPage() {
  const [params] = useSearchParams();
  const [index, setIndex] = useState(() => Math.floor(Date.now() / 86400000) % QUOTES.length);
  if (params.get('id'))
    return <Navigate to={`/quotes/${encodeURIComponent(params.get('id')!)}`} replace />;
  const current = QUOTES[index];
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <p className="mb-3 text-center text-xs tracking-widest text-accent">QUOTE OF THE DAY</p>
      <h1 className="mb-4 text-center font-serif text-3xl font-semibold">撷英</h1>
      <p className="mb-8 text-center text-muted-foreground">
        含英咀华。在文字的微光里，感受文学与思想。
      </p>
      <article className="rounded-sm border bg-card p-6 md:p-12">
        <h2 className="mb-6 font-serif text-xl">
          {current.author} · {current.source}
        </h2>
        <ContentReader kind="quote" id={current.id} />
        <Link
          className="mt-6 inline-block text-sm text-accent underline"
          to={`/quotes/${current.id}`}
        >
          打开这条名句的独立页面
        </Link>
      </article>
      <div className="my-7 flex flex-wrap justify-center gap-3">
        <Button
          variant="outline"
          onClick={() => setIndex((index - 1 + QUOTES.length) % QUOTES.length)}
        >
          上一句
        </Button>
        <Button
          onClick={() =>
            setIndex((index + 1 + Math.floor(Math.random() * (QUOTES.length - 1))) % QUOTES.length)
          }
        >
          随机一句
        </Button>
        <Button variant="outline" onClick={() => setIndex((index + 1) % QUOTES.length)}>
          下一句
        </Button>
      </div>
      <h2 className="mb-4 font-serif text-xl">全部名句</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {QUOTES.map((quote) => (
          <Link
            to={`/quotes/${quote.id}`}
            className="rounded-sm border p-4 text-sm leading-relaxed hover:border-accent"
            key={quote.id}
          >
            {quote.text}
            <span className="mt-2 block text-xs text-muted-foreground">{quote.author}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
