import { z } from 'zod';
import { normalizeFeedback } from './report.ts';

type FeedbackTransport = (
  parameters: Record<string, string>,
  signal: AbortSignal,
) => PromiseLike<{ data: unknown; error: { code?: string } | null }>;

/** A retry uses the same receipt ID. Only the server's matching receipt is success. */
export function createFeedbackSubmitter(send: FeedbackTransport) {
  return async (input: unknown, requestId: string, website = '') => {
    const fields = normalizeFeedback(input);
    const id = z.uuid().parse(requestId);
    let response: Awaited<ReturnType<FeedbackTransport>>;
    try {
      response = await send(
        {
          p_id: id,
          p_kind: fields.kind,
          p_page: fields.page,
          p_description: fields.description,
          p_expected: fields.expected,
          p_website: website,
        },
        AbortSignal.timeout(15_000),
      );
    } catch {
      throw new Error('网络未确认提交结果，内容仍保留。请重试，同一份反馈不会重复入库。');
    }
    if (response.error) {
      if (response.error.code === 'PT429')
        throw new Error('当前反馈提交较多，请稍后重试。填写的内容仍保留。');
      if (response.error.code === 'PT409')
        throw new Error('反馈编号冲突，请修改内容后重新提交。原内容仍保留。');
      throw new Error('暂未收到后台确认，填写的内容仍保留。请重试或下载副本。');
    }
    if (response.data !== id) throw new Error('后台未返回有效回执，请重试或下载副本。');
    return id;
  };
}

export async function submitFeedback(input: unknown, requestId: string, website = '') {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('在线反馈暂未配置，请先复制或下载副本。');
  const { createClient } = await import('@supabase/supabase-js');
  // Feedback is public write-only. It must not revive a reader's old login session.
  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return createFeedbackSubmitter((parameters, signal) =>
    client.rpc('submit_beta_feedback', parameters).abortSignal(signal),
  )(input, requestId, website);
}
