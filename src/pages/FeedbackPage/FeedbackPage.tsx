import { useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { downloadFile } from '@/lib/downloadFile';
import {
  feedbackReport,
  feedbackSchema,
  normalizeFeedback,
  type FeedbackFields,
} from '@/features/feedback/report';
import { submitFeedback } from '@/features/feedback/submit';

export default function FeedbackPage() {
  const [params] = useSearchParams();
  const [fields, setFields] = useState<FeedbackFields>({
    kind: '使用问题',
    page: params.get('page') || '',
    description: '',
    expected: '',
  });
  const [website, setWebsite] = useState('');
  const [sending, setSending] = useState(false);
  const [receipt, setReceipt] = useState('');
  const [status, setStatus] = useState('');
  const attempt = useRef<{ fingerprint: string; id: string } | null>(null);
  const report = () => feedbackReport(fields);
  const updateField = (field: keyof FeedbackFields, value: string) => {
    setFields((current) => ({ ...current, [field]: value }));
    setReceipt('');
    setStatus('');
  };
  const downloadCopy = () => {
    try {
      downloadFile(
        new Blob([report()], { type: 'text/plain;charset=utf-8' }),
        `社科通识反馈-${new Date().toISOString().slice(0, 10)}.txt`,
      );
      setStatus(receipt ? '副本已生成，在线反馈已提交。' : '副本已生成，尚未在线提交。');
    } catch {
      setStatus('请至少写五个字，说明遇到的问题。');
    }
  };
  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <h1 className="font-serif text-3xl font-semibold">内测反馈</h1>
      <p className="my-4 text-sm leading-relaxed text-muted-foreground">
        告诉我们哪里不顺手，或哪条内容需要核对。点击提交即可发送给维护者，无需登录。
      </p>
      <form
        className="space-y-5"
        onSubmit={async (event) => {
          event.preventDefault();
          if (sending || receipt) return;
          const parsed = feedbackSchema.safeParse(fields);
          if (!parsed.success) {
            setStatus(parsed.error.issues[0].message);
            return;
          }
          const normalized = normalizeFeedback(parsed.data);
          const fingerprint = JSON.stringify(normalized);
          if (attempt.current?.fingerprint !== fingerprint)
            attempt.current = { fingerprint, id: crypto.randomUUID() };
          setSending(true);
          setStatus('正在提交，请稍候…');
          try {
            const id = await submitFeedback(normalized, attempt.current.id, website);
            setReceipt(id);
            setStatus('反馈已提交，维护者可以在后台查看。谢谢你的反馈！');
          } catch (error) {
            setStatus(error instanceof Error ? error.message : '提交失败，内容仍保留，请重试。');
          } finally {
            setSending(false);
          }
        }}
      >
        <fieldset disabled={sending} className="space-y-5">
          <label className="hidden" aria-hidden="true">
            Website
            <input
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
            />
          </label>
          <label className="block text-sm">
            反馈类型
            <select
              value={fields.kind}
              onChange={(event) => updateField('kind', event.target.value)}
              className="mt-2 block w-full rounded-sm border bg-background p-2"
            >
              {['使用问题', '内容纠错', '功能建议'].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            相关页面（可选）
            <Input
              className="mt-2"
              value={fields.page}
              maxLength={500}
              placeholder="例如 /essay"
              onChange={(event) => updateField('page', event.target.value)}
            />
          </label>
          <label className="block text-sm">
            问题或建议
            <Textarea
              className="mt-2"
              required
              minLength={5}
              maxLength={5000}
              rows={6}
              value={fields.description}
              placeholder="做了什么操作，出现了什么情况？可以另外附上截图。"
              onChange={(event) => updateField('description', event.target.value)}
            />
          </label>
          <label className="block text-sm">
            期望结果（可选）
            <Textarea
              className="mt-2"
              maxLength={2000}
              rows={3}
              value={fields.expected}
              onChange={(event) => updateField('expected', event.target.value)}
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={sending || Boolean(receipt)}>
              {sending ? '正在提交…' : receipt ? '已提交' : '提交反馈'}
            </Button>
            <Button type="button" variant="outline" onClick={downloadCopy}>
              下载副本
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                let text: string;
                try {
                  text = report();
                } catch {
                  setStatus('请至少写五个字，说明遇到的问题。');
                  return;
                }
                void navigator.clipboard
                  .writeText(text)
                  .then(() =>
                    setStatus(
                      receipt ? '副本已复制，在线反馈已提交。' : '副本已复制，尚未在线提交。',
                    ),
                  )
                  .catch(() => setStatus('浏览器未允许复制，请下载反馈文件。'));
              }}
            >
              复制反馈
            </Button>
          </div>
        </fieldset>
        {status && (
          <p role="status" className="rounded-sm border p-3 text-sm">
            {status}
          </p>
        )}
        {receipt && <p className="break-all text-xs text-muted-foreground">回执编号：{receipt}</p>}
      </form>
      <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
        仅在你点击提交后上传表单内容，由维护者在后台查看，不向其他访客公开。不会读取你的阅读文章或设备信息。请勿填写密码等敏感信息；提交失败可重试或保留副本。
      </p>
      <Link to="/reading" className="mt-5 inline-block text-sm text-accent underline">
        返回阅读空间
      </Link>
    </div>
  );
}
