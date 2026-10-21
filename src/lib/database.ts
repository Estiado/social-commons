import { supabase } from './supabase';

/** Supabase 默认返回 { error }，不会抛异常；在更新界面前显式检查结果。 */
export async function requireSuccess<T extends { error: unknown }>(request: PromiseLike<T>): Promise<T> {
  const result = await request;
  if (result.error) throw result.error;
  return result;
}

export async function setParagraphSaved(userId: string, paragraphId: string, saved: boolean) {
  if (!supabase || !userId) throw new Error('请先完成登录，再保存段落');
  const table = supabase.from('saved_paragraphs');
  await requireSuccess(saved
    ? table.upsert({ user_id: userId, paragraph_id: paragraphId }, { onConflict: 'user_id,paragraph_id', ignoreDuplicates: true })
    : table.delete().eq('user_id', userId).eq('paragraph_id', paragraphId));
}

export function errorMessage(error: unknown, fallback = '操作失败，请稍后重试'): string {
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') return error.message;
  return fallback;
}
