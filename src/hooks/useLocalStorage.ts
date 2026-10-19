import { useState, useEffect, useCallback } from 'react';

/**
 * useLocalStorage — 带命名空间的本地存储hook
 * 用于存储用户自定义的标签、词条等数据
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const storageKey = `social-commons:${key}`;

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(storageKey);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`useLocalStorage: 读取 ${storageKey} 失败`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(storageKey, JSON.stringify(valueToStore));
      } catch (error) {
        console.warn(`useLocalStorage: 写入 ${storageKey} 失败`, error);
      }
    },
    [storageKey, storedValue],
  );

  // 跨标签页同步
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue) as T);
        } catch {
          // 忽略解析错误
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [storageKey]);

  return [storedValue, setValue] as const;
}
