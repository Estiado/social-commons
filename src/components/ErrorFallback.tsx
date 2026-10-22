import type { FallbackProps } from 'react-error-boundary';
import { isModuleLoadError } from '@/lib/moduleLoadError';

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const outdated = isModuleLoadError(error);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-xl font-semibold">{outdated ? '页面需要重新加载' : '页面出错了'}</h1>
      {outdated && (
        <p className="max-w-xl text-muted-foreground">
          页面版本或开发依赖已更新。重新加载后可继续阅读，已保存的本机内容会保留。
        </p>
      )}
      <pre className="max-w-full overflow-auto rounded-md bg-muted p-4 text-left text-sm text-muted-foreground">
        {error instanceof Error ? error.message : String(error)}
      </pre>
      <button
        type="button"
        className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        onClick={() => (outdated ? window.location.reload() : resetErrorBoundary())}
      >
        {outdated ? '重新加载页面' : '重试'}
      </button>
    </div>
  );
}
