import { useState, useEffect } from 'react';

const STORAGE_KEY = 'social-commons:user-id';

/**
 * 生成一个简单的唯一ID（UUID v4格式的简化版）
 * 原理：利用随机数和时间戳生成几乎不可能重复的字符串
 */
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * useUserId — 匿名用户标识hook
 *
 * 工作原理：
 * 1. 组件挂载时，从localStorage读取已有的用户ID
 * 2. 如果没有（第一次访问），生成一个新ID并存入localStorage
 * 3. 返回这个ID，所有收藏/素材包操作都带上它
 *
 * 注意：这是匿名标识，不是真正的用户账号。
 * 换浏览器、清除缓存会丢失。第三期会接入真正的注册登录。
 */
export function useUserId(): string {
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    try {
      let id = localStorage.getItem(STORAGE_KEY);
      if (!id) {
        id = generateId();
        localStorage.setItem(STORAGE_KEY, id);
      }
      setUserId(id);
    } catch (error) {
      // localStorage不可用时，用内存中的临时ID
      console.warn('localStorage不可用，使用临时用户ID');
      setUserId(generateId());
    }
  }, []);

  return userId;
}
