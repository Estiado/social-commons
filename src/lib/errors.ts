export function errorMessage(error: unknown, fallback = '操作失败，请稍后重试'): string {
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string')
    return error.message;
  return fallback;
}
