import { useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { QUOTE_CATALOGUE as QUOTES } from '@/data/quotes';
import { ContentReader } from '@/features/reading/ContentReader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PAGE_SIZE = 12;

export default function QuotesPage() {
  const [params] = useSearchParams();
  const [index, setIndex] = useState(() => Math.floor(Date.now() / 86400000) % QUOTES.length);
  const [search, setSearch] = useState('');
  const [reviewedOnly, setReviewedOnly] = useState(false);
  const [page, setPage] = useState(0);
  if (params.get('id'))
    return <Navigate to={`/quotes/${encodeURIComponent(params.get('id')!)}`} replace />;
  const current = QUOTES[index];
  const query = search.trim().toLocaleLowerCase();
  const matches = QUOTES.filter(
    (quote) =>
      (!reviewedOnly || quote.commentary) &&
      [quote.text, quote.author, quote.source, quote.commentary?.commentator]
        .join(' ')
        .toLocaleLowerCase()
        .includes(query),
  );
  const pageCount = Math.ceil(matches.length / PAGE_SIZE);
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <p className="mb-3 text-center text-xs tracking-widest text-accent">WORDS IN CONTEXT</p>
      <h1 className="mb-4 text-center font-serif text-3xl font-semibold">撷英</h1>
      <p className="mb-8 text-center text-muted-foreground">连着读，才看得见文字的来处与回响。</p>
      <p className="mb-8 text-center text-sm text-muted-foreground">
        {QUOTES.length} 篇摘读 · {QUOTES.filter((quote) => quote.commentary).length}{' '}
        篇附有出处的解读
      </p>
      <article className="rounded-sm border bg-card p-6 md:p-12">
        <h2 className="mb-6 font-serif text-xl">
          {current.author} · {current.title || current.source}
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
          上一篇
        </Button>
        <Button
          onClick={() =>
            setIndex((index + 1 + Math.floor(Math.random() * (QUOTES.length - 1))) % QUOTES.length)
          }
        >
          随机摘读
        </Button>
        <Button variant="outline" onClick={() => setIndex((index + 1) % QUOTES.length)}>
          下一篇
        </Button>
      </div>
      <h2 className="mb-4 font-serif text-xl">找一篇，慢慢读</h2>
      <Input
        aria-label="搜索摘读"
        placeholder="搜索作品、作者、原句或评述者…"
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
          setPage(0);
        }}
      />
      <div className="my-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={reviewedOnly}
            onChange={(event) => {
              setReviewedOnly(event.target.checked);
              setPage(0);
            }}
          />
          只看附有出处解读的作品
        </label>
        <span role="status">找到 {matches.length} 篇</span>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {matches.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map((quote) => (
          <Link
            to={`/quotes/${quote.id}`}
            className="rounded-sm border p-4 text-sm leading-relaxed hover:border-accent"
            key={quote.id}
          >
            <h3 className="font-serif text-lg">{quote.title || quote.source}</h3>
            <p className="my-3 line-clamp-3 whitespace-pre-line text-muted-foreground">
              {quote.text}
            </p>
            <span className="mt-2 block text-xs text-muted-foreground">
              {quote.author}
              {quote.commentary ? ' · 附资料解读' : ''}
            </span>
          </Link>
        ))}
      </div>
      {!matches.length && (
        <p className="py-8 text-center text-muted-foreground">
          没有找到，可换作者或作品关键词试试。
        </p>
      )}
      {pageCount > 1 && (
        <nav aria-label="摘读目录分页" className="mt-6 flex items-center justify-center gap-4">
          <Button variant="outline" disabled={!page} onClick={() => setPage(page - 1)}>
            上一页
          </Button>
          <span className="text-sm">
            {page + 1} / {pageCount}
          </span>
          <Button
            variant="outline"
            disabled={page >= pageCount - 1}
            onClick={() => setPage(page + 1)}
          >
            下一页
          </Button>
        </nav>
      )}
    </div>
  );
}
