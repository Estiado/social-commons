import { Link, useParams } from 'react-router-dom';
import { DAILY_KNOWLEDGE } from '@/data/daily';
import { DailyContent } from '@/features/knowledge/DailyContent';

export default function DailyDetailPage() {
  const { id } = useParams();
  const item = DAILY_KNOWLEDGE.find((item) => item.id === id);
  return <article className="mx-auto max-w-3xl px-6 py-12">
    <Link to="/daily" className="mb-7 inline-block text-sm text-accent underline">返回日新通识</Link>
    {item ? <>
      <p className="mb-3 text-sm text-muted-foreground">{item.category}</p>
      <h1 className="mb-5 font-serif text-3xl font-semibold leading-relaxed">{item.title}</h1>
      <p className="mb-8 border-b pb-6 leading-relaxed text-muted-foreground">{item.summary}</p>
      <DailyContent item={item} />
    </> : <h1 className="font-serif text-2xl">未找到这个通识词条</h1>}
  </article>;
}
