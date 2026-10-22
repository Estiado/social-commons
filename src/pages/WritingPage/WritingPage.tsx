import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { WritingEditor } from '@/features/reading/writing/WritingEditor';
import { getDraft } from '@/features/reading/writing/repository';
import type { WritingDraft } from '@/features/reading/writing/model';

export default function WritingPage() {
  const { id = '' } = useParams();
  const [loaded, setLoaded] = useState<{ id: string; draft?: WritingDraft; error?: string }>();
  useEffect(() => {
    let active = true;
    getDraft(id)
      .then((draft) => {
        if (active)
          setLoaded({
            id,
            draft,
            error: draft ? undefined : '这份文稿不在当前浏览器中，请返回阅读空间重新选材。',
          });
      })
      .catch((error) => {
        if (active) setLoaded({ id, error: error.message });
      });
    return () => {
      active = false;
    };
  }, [id]);
  if (loaded?.id !== id)
    return (
      <p role="status" className="p-10">
        正在打开文稿…
      </p>
    );
  if (!loaded.draft)
    return (
      <div className="mx-auto max-w-3xl p-10">
        <p role="alert">{loaded.error}</p>
        <Link className="mt-4 block text-accent underline" to="/reading">
          返回阅读空间
        </Link>
      </div>
    );
  return <WritingEditor key={id} initial={loaded.draft} />;
}
