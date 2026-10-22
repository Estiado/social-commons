import type { IQuote } from '@/data/types';

/** Only reviewed entries are published. A book title or an unspecified
 * "researcher" is not evidence that a paragraph was actually said by them. */
export function QuoteCommentary({ quote }: { quote: IQuote }) {
  const commentary = quote.commentary;
  if (!commentary || commentary.status !== 'verified') return <p className="mt-7 border-l-2 border-border pl-4 text-sm leading-relaxed text-muted-foreground">评析待核验。暂不展示未能对应到具体出版物或公开页面的旧评述。</p>;
  return <section className="mt-7 space-y-3 border-l-2 border-accent/30 pl-4" aria-label="有出处的评析">
    <p className="text-xs font-medium text-accent">资料摘要 · 依据已发布资料整理，非逐字引语</p>
    <p className="text-sm leading-relaxed">{commentary.text}</p>
    <p className="text-xs text-muted-foreground">作者 / 评述者：{commentary.commentator}</p>
    <p className="text-xs text-muted-foreground">{commentary.commentatorSource}</p>
    <a href={commentary.url} target="_blank" rel="noopener noreferrer" className="inline-block text-sm text-accent underline">核对评析原文</a>
    <p className="text-xs text-muted-foreground">核验日期：{commentary.checkedAt}。资料观点不等于唯一解释。</p>
  </section>;
}
