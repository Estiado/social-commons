import { Link, useParams } from 'react-router-dom';
import { getQuoteById } from '@/data/quotes';
import { QuoteCommentary } from '@/features/quotes/QuoteCommentary';

export default function QuoteDetailPage() {
  const { id = '' } = useParams();
  const quote = getQuoteById(id);
  return <article className="mx-auto max-w-3xl px-6 py-12">
    <Link to="/quotes" className="mb-8 inline-block text-sm text-accent underline">返回撷英名句</Link>
    {quote ? <>
      <h1 className="font-serif text-3xl font-semibold leading-relaxed">{quote.text}</h1>
      <p className="mt-6 text-lg">{quote.author}</p>
      <p className="mt-2 text-sm text-muted-foreground">{quote.source}</p>
      {quote.sourceNote && <p className="mt-3 text-sm text-amber-800">出处核验提示：{quote.sourceNote}</p>}
      <QuoteCommentary quote={quote} />
    </> : <h1 className="font-serif text-2xl">未找到这条名句</h1>}
  </article>;
}
