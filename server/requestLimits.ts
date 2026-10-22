import type { ExtractEnvironment } from './extractArticle.ts';

const windows = new Map<string, { count: number; resetAt: number }>();
/** Local bounds protect each worker instance. Configure the optional binding
 * for a distributed limit before promoting a busy public site. */
export async function allowArticleRequest(request: Request, env: ExtractEnvironment, category: 'extract' | 'image' = 'extract'): Promise<boolean> {
  const key = `${category}:${request.headers.get('cf-connecting-ip') || 'local'}`;
  if (env.EXTRACTION_RATE_LIMITER) return (await env.EXTRACTION_RATE_LIMITER.limit({ key })).success;
  const now = Date.now();
  if (windows.size >= 2000) for (const [address, window] of windows) if (window.resetAt <= now) windows.delete(address);
  const current = windows.get(key);
  if (!current || current.resetAt <= now) {
    if (!current && windows.size >= 2000) return false;
    windows.set(key, { count: 1, resetAt: now + 60_000 }); return true;
  }
  current.count += 1;
  return current.count <= (category === 'image' ? 120 : 10);
}
