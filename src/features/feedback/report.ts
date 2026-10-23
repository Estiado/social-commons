import { z } from 'zod';

export const feedbackSchema = z.object({
  kind: z.enum(['使用问题', '内容纠错', '功能建议']),
  description: z.string().trim().min(5, '请至少写五个字，说明遇到的问题。').max(5000),
  expected: z.string().trim().max(2000),
  page: z.string().trim().max(500),
});
export type FeedbackFields = z.infer<typeof feedbackSchema>;

export function normalizeFeedback(input: unknown): FeedbackFields {
  const fields = feedbackSchema.parse(input);
  let page = '';
  try {
    const url = new URL(fields.page, 'https://social-commons.pages.dev');
    if (fields.page && url.origin === 'https://social-commons.pages.dev') page = url.pathname;
  } catch {
    // An optional page address must never add query tokens or external URLs.
  }
  return { ...fields, page };
}
/** A portable report, with no article bodies, identifiers, browsing history or automatic upload. */
export function feedbackReport(input: unknown, createdAt = new Date().toISOString()) {
  const fields = normalizeFeedback(input);
  return [
    '社科通识 · 内测反馈',
    `时间：${createdAt}`,
    `类型：${fields.kind}`,
    `页面：${fields.page || '未填写'}`,
    '',
    '问题或建议：',
    fields.description,
    '',
    '期望结果：',
    fields.expected || '未填写',
  ].join('\n');
}
