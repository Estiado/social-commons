import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { errorMessage } from '@/lib/database';

const STORAGE_KEY = 'social-commons:user-id';
let initialization: Promise<string> | undefined;

function getLocalId(): string {
  const generated = crypto.randomUUID();
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) return existing;
    localStorage.setItem(STORAGE_KEY, generated);
  } catch { /* 存储被禁用时，本次页面会话仍可使用本地身份。 */ }
  return generated;
}

async function initializeUser(): Promise<string> {
  if (!supabase) return getLocalId();
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  if (session?.user.id) return session.user.id;
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  if (!data.user) throw new Error('登录未返回用户身份');
  return data.user.id;
}

/** 共用初始化 Promise，防止 StrictMode 和多个组件同时创建匿名账号。
 * 已配置数据库时，登录失败必须提示；本地 UUID 无法替代 auth.uid() 通过 RLS。
 */
export function useUserSession() {
  const [state, setState] = useState({ userId: '', loading: true, error: '' });
  useEffect(() => {
    let cancelled = false;
    initialization ??= initializeUser().catch((error) => { initialization = undefined; throw error; });
    initialization.then(
      (userId) => { if (!cancelled) setState({ userId, loading: false, error: '' }); },
      (error) => { if (!cancelled) setState({ userId: '', loading: false, error: errorMessage(error, '登录失败，请稍后重试') }); },
    );
    const listener = supabase?.auth.onAuthStateChange((_event, session) => {
      if (session?.user.id) {
        initialization = Promise.resolve(session.user.id);
        if (!cancelled) setState({ userId: session.user.id, loading: false, error: '' });
      } else if (_event === 'SIGNED_OUT') {
        initialization = undefined;
        if (!cancelled) setState({ userId: '', loading: false, error: '登录已结束，请刷新页面重新登录' });
      }
    });
    return () => { cancelled = true; listener?.data.subscription.unsubscribe(); };
  }, []);
  return state;
}

export function useUserId(): string {
  return useUserSession().userId;
}
