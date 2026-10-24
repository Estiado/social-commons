import { z } from 'zod';
import { feedbackSchema, normalizeFeedback, type FeedbackFields } from './report.ts';

export const FEEDBACK_DRAFT_KEY = 'social-commons:feedback-draft-v1';
const draftSchema = z.object({
  schemaVersion: z.literal(1),
  fields: feedbackSchema.extend({ description: z.string().max(5000) }),
  request: z.object({ id: z.uuid(), fingerprint: z.string().max(9000) }).optional(),
});
export type FeedbackDraft = z.infer<typeof draftSchema>;

export function parseFeedbackDraft(raw: string | null): FeedbackDraft | null {
  if (!raw) return null;
  try {
    const draft = draftSchema.parse(JSON.parse(raw));
    const valid = feedbackSchema.safeParse(draft.fields);
    if (
      !valid.success ||
      draft.request?.fingerprint !== JSON.stringify(normalizeFeedback(valid.data))
    )
      delete draft.request;
    return draft;
  } catch {
    return null;
  }
}

/** Compare the last snapshot before replacing it, so a second tab cannot silently
 * overwrite an unrelated draft. A pending request ID also survives a refresh. */
export function saveFeedbackDraft(
  storage: Pick<Storage, 'getItem' | 'setItem'>,
  expectedRaw: string | null,
  fields: FeedbackFields,
  request?: FeedbackDraft['request'],
) {
  if (storage.getItem(FEEDBACK_DRAFT_KEY) !== expectedRaw)
    throw new Error('另一标签页修改了反馈草稿；此页内容仍可提交或下载副本。');
  if (expectedRaw && !parseFeedbackDraft(expectedRaw))
    throw new Error('已有反馈草稿无法读取，暂不覆盖。请先保留当前内容或下载副本。');
  const raw = JSON.stringify(draftSchema.parse({ schemaVersion: 1, fields, request }));
  storage.setItem(FEEDBACK_DRAFT_KEY, raw);
  return raw;
}

export function clearFeedbackDraft(storage: Storage, expectedRaw: string | null) {
  if (storage.getItem(FEEDBACK_DRAFT_KEY) !== expectedRaw) return false;
  storage.removeItem(FEEDBACK_DRAFT_KEY);
  return true;
}
