import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const STORAGE_KEY = 'social-commons:user-id';

/**
 * 生成一个简单的唯一ID（UUID v4格式的简化版）
 * 用于Supabase未配置时的降级方案
 */
function generateLocalId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * useUserId — 用户标识hook
 *
 * 工作原理：
 * 1. 如果配置了Supabase，调用匿名登录(signInAnonymously)获取auth.uid()
 *    - 匿名用户会获得authenticated角色，RLS策略中auth.uid()能正常匹配
 *    - session存在浏览器localStorage，刷新不丢失
 *    - 以后可以升级为正式账号（邮箱/手机号登录），数据会保留
 * 2. 如果未配置Supabase，降级为本地生成UUID存在localStorage
 *
 * 注意：匿名登录需要在Supabase控制台启用
 * Authentication → Sign In / Providers → Allow anonymous sign-ins
 */
export function useUserId(): string {
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    let cancelled = false;

    async function initUser() {
      // 方案一：Supabase匿名登录
      if (supabase) {
        try {
          // 先检查是否已有session
          const { data: { session } } = await supabase.auth.getSession();

          if (session?.user?.id) {
            if (!cancelled) setUserId(session.user.id);
            return;
          }

          // 没有session，发起匿名登录
          const { data, error } = await supabase.auth.signInAnonymously();
          if (error) throw error;
          if (data.user?.id && !cancelled) {
            setUserId(data.user.id);
          }
        } catch (err) {
          console.warn('Supabase匿名登录失败，降级为本地ID:', err);
          // 降级到本地方案
          fallbackToLocal();
        }
      } else {
        // 方案二：本地生成ID（Supabase未配置时）
        fallbackToLocal();
      }
    }

    function fallbackToLocal() {
      try {
        let id = localStorage.getItem(STORAGE_KEY);
        if (!id) {
          id = generateLocalId();
          localStorage.setItem(STORAGE_KEY, id);
        }
        if (!cancelled) setUserId(id);
      } catch {
        if (!cancelled) setUserId(generateLocalId());
      }
    }

    initUser();

    // 监听auth状态变化
    const { data: authListener } = supabase?.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.id && !cancelled) {
        setUserId(session.user.id);
      }
    }) || { data: null };

    return () => {
      cancelled = true;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return userId;
}
