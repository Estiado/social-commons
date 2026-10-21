import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';

const LOCAL_CHANGE = 'social-commons:storage-change';

/** 同标签组件与其他标签页都读取同一份快照；函数更新使用最新值，避免闭包覆盖。 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const storageKey = `social-commons:${key}`;
  const [fallback] = useState(() => initialValue);
  const read = useCallback(() => {
    try { return window.localStorage.getItem(storageKey); }
    catch { return null; }
  }, [storageKey]);
  const subscribe = useCallback((notify: () => void) => {
    const onStorage = (event: StorageEvent) => {
      if ((event.key === null || event.key === storageKey) && event.storageArea === window.localStorage) notify();
    };
    const onLocal = (event: Event) => {
      if ((event as CustomEvent<string>).detail === storageKey) notify();
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener(LOCAL_CHANGE, onLocal);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(LOCAL_CHANGE, onLocal);
    };
  }, [storageKey]);
  const raw = useSyncExternalStore(subscribe, read, () => null);
  const storedValue = useMemo(() => {
    try { return raw === null ? fallback : JSON.parse(raw) as T; }
    catch { return fallback; }
  }, [raw, fallback]);

  const setValue = useCallback((value: T | ((previous: T) => T)) => {
    let previous = fallback;
    try {
      const latest = read();
      if (latest !== null) previous = JSON.parse(latest) as T;
    } catch { /* 已损坏的 JSON 使用调用方的初始值。 */ }
    const next = typeof value === 'function' ? (value as (previous: T) => T)(previous) : value;
    // 写失败时不伪装成持久化成功；调用方可捕获并提示用户备份。
    window.localStorage.setItem(storageKey, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(LOCAL_CHANGE, { detail: storageKey }));
  }, [fallback, read, storageKey]);

  return [storedValue, setValue] as const;
}
