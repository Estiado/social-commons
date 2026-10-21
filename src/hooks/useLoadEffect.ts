import { useEffect } from 'react';

/**
 * 在 effect 完成后发起异步读取。StrictMode 首次试挂载会先清理，避免重复请求。
 * load 应使用 useCallback 固定引用，并自行处理网络结果与错误状态。
 */
export function useLoadEffect(load: () => Promise<void>) {
  useEffect(() => {
    let cancelled = false;
    void Promise.resolve().then(() => {
      if (!cancelled) return load();
    }).catch((error) => console.error('加载数据失败:', error));
    return () => { cancelled = true; };
  }, [load]);
}
