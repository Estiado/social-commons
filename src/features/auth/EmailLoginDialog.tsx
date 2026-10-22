import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { errorMessage } from '@/lib/database';

export function EmailLoginDialog({ open, onClose, onSignedIn }: { open: boolean; onClose(): void; onSignedIn(): void }) {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [sent, setSent] = useState(false);
  const [mode, setMode] = useState<'email' | 'email_change'>('email');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [resendAt, setResendAt] = useState(0);
  const [existingAccount, setExistingAccount] = useState(false);

  const sendCode = async () => {
    setError('');
    if (!supabase) { setError('邮箱登录尚未配置，仍可免登录阅读和导出'); return; }
    if (Date.now() < resendAt) { setError('验证码已发送，请稍候再重发'); return; }
    setBusy(true);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      // Upgrade an old anonymous identity in place so existing collections keep
      // their owner. A conflict never silently strands that identity's data.
      if (session?.user.is_anonymous && !existingAccount) {
        const { error } = await supabase.auth.updateUser({ email: email.trim() });
        if (error) throw new Error(`${error.message}。如该邮箱已有账号，可选择下方“登录已有账号”；原匿名收藏不会自动合并，请先导出备份。`);
        setMode('email_change');
      } else {
        const { error } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { shouldCreateUser: true } });
        if (error) throw error;
        setMode('email');
      }
      setSent(true); setResendAt(Date.now() + 60_000);
    } catch (error) { setError(errorMessage(error, '验证码发送失败，请稍后重试')); }
    finally { setBusy(false); }
  };
  const verify = async () => {
    if (!supabase) return;
    setBusy(true); setError('');
    try {
      const { data, error } = await supabase.auth.verifyOtp({ email: email.trim(), token: token.trim(), type: mode });
      if (error) throw error;
      if (!data.session || data.user?.is_anonymous) throw new Error('邮箱尚未验证成功，请检查验证码');
      onClose(); onSignedIn();
    } catch (error) { setError(errorMessage(error, '验证码验证失败')); }
    finally { setBusy(false); }
  };
  return <Dialog open={open} onOpenChange={(value) => { if (!value && !busy) onClose(); }}>
    <DialogContent className="max-w-md">
      <DialogHeader><DialogTitle>保存到我的阅读空间</DialogTitle><DialogDescription>通过邮箱验证码登录，长期保存文章和收藏，并在其他设备继续阅读。</DialogDescription></DialogHeader>
      <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); void (sent ? verify() : sendCode()); }}>
        {!supabase && <p role="status" className="text-sm text-muted-foreground">邮箱登录尚未配置，仍可免登录阅读和导出。</p>}
        <label className="block text-sm">邮箱<Input type="email" autoComplete="email" required value={email} disabled={sent || busy} onChange={(event) => setEmail(event.target.value)} className="mt-2" /></label>
        {sent && <label className="block text-sm">邮箱验证码<Input autoComplete="one-time-code" inputMode="numeric" required value={token} onChange={(event) => setToken(event.target.value)} className="mt-2" /></label>}
        {error && <p role="alert" className="text-sm text-red-700 break-words">{error}</p>}
        <Button type="submit" disabled={busy || !supabase} className="w-full">{busy ? '正在处理…' : sent ? '验证并继续' : '发送验证码'}</Button>
        {sent && <div className="flex justify-between text-sm"><button type="button" disabled={busy} onClick={() => { setSent(false); setToken(''); }}>修改邮箱</button><button type="button" disabled={busy} onClick={() => void sendCode()}>重新发送验证码</button></div>}
        {!sent && <label className="flex items-start gap-2 text-xs text-muted-foreground"><input type="checkbox" checked={existingAccount} onChange={(event) => setExistingAccount(event.target.checked)} />登录已有账号（旧匿名收藏需先导出，新导入文章可在登录后保存）</label>}
        <p className="text-xs text-muted-foreground">未登录的临时文章仍保留在本浏览器，登录操作不会清除它们。</p>
      </form>
    </DialogContent>
  </Dialog>;
}
