import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { briefingEdition } from '@/features/briefing/edition';
import { briefingDocument } from '@/features/briefing/document';
import { useChinaDay } from '@/features/briefing/useChinaDay';
import { ContentReader } from '@/features/reading/ContentReader';
import '@/features/briefing/briefing.css';

export default function BriefingPage() {
  const today = useChinaDay();
  const [params] = useSearchParams();
  const day = params.get('date') || today;
  const prepared = useMemo(() => {
    try {
      if (day > today) throw new Error('未来日期的简报尚未开放');
      return { document: briefingDocument(briefingEdition(day)), error: '' };
    } catch (error) {
      return {
        document: undefined,
        error: error instanceof Error ? error.message : '简报暂时无法打开',
      };
    }
  }, [day, today]);
  return (
    <article className="brief-page">
      <Link to="/">返回首页</Link>
      <header>
        <h1>每日简报</h1>
        <p className="mt-3">{day} · 北京时间</p>
        <p className="mt-3 text-sm leading-relaxed">
          每日轮换选读，时事保留资料日期。整份简报、段落和划线均可加入阅读空间。
        </p>
      </header>
      {prepared.document ? (
        <ContentReader key={day} kind="briefing" id={day} document={prepared.document} />
      ) : (
        <div role="status">
          <p>{prepared.error}</p>
          <Link to="/briefing" className="text-accent underline">
            查看今日简报
          </Link>
        </div>
      )}
    </article>
  );
}
