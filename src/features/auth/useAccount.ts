import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

/** Reading a public page never creates an anonymous cloud account. */
export function useAccount() {
  const [account, setAccount] = useState<User | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [error, setError] = useState('');
  useEffect(() => {
    if (!supabase) return;
    let active = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      setAccount(data.session?.user && !data.session.user.is_anonymous ? data.session.user : null);
      setError(error?.message || ''); setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) { setAccount(session?.user && !session.user.is_anonymous ? session.user : null); setLoading(false); }
    });
    return () => { active = false; data.subscription.unsubscribe(); };
  }, []);
  return { account, loading, error };
}
