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
import { FEEDBACK_EXPECTATIONS, FEEDBACK_PAGES } from '@/features/feedback/options';
import {
  clearFeedbackDraft,
  FEEDBACK_DRAFT_KEY,
  parseFeedbackDraft,
  saveFeedbackDraft,
} from '@/features/feedback/draft';
import { feedbackPagePath } from '@/features/feedback/navigation';

export default function FeedbackPage() {
  const [params] = useSearchParams();
  const [initial] = useState(() => {
    try {
      const raw = localStorage.getItem(FEEDBACK_DRAFT_KEY);
      return { raw, draft: parseFeedbackDraft(raw), available: true };
    } catch {
      return { raw: null, draft: null, available: false };
    }
  });
  const [fields, setFields] = useState<FeedbackFields>(
    initial.draft?.fields || {
      kind: '使用问题',
      page: feedbackPagePath(params.get('page') || ''),
      description: '',
      expected: '',
    },
  );
  const fieldsRef = useRef(fields);
  const draftRaw = useRef(initial.raw);
  const [draftNotice, setDraftNotice] = useState(
    initial.draft
      ? '已恢复上次未提交的草稿，相关页面保留为上次填写的内容。'
      : '填写内容会暂存在当前浏览器，刷新后可继续。',
  );
  const [customPage, setCustomPage] = useState(
    () => Boolean(fields.page) && !FEEDBACK_PAGES.some((option) => option.value === fields.page),
  );
  const [website, setWebsite] = useState('');
  const [sending, setSending] = useState(false);
  const [receipt, setReceipt] = useState('');
  const [status, setStatus] = useState('');
  const attempt = useRef<{ fingerprint: string; id: string } | null>(
    initial.draft?.request || null,
  );
  const persistDraft = (next: FeedbackFields, request?: { fingerprint: string; id: string }) => {
    try {
      if (!initial.available) throw new Error('浏览器未允许保存草稿；请保留此页或下载副本。');
      draftRaw.current = saveFeedbackDraft(localStorage, draftRaw.current, next, request);
      setDraftNotice('草稿已保存在当前浏览器，尚未提交。');
    } catch (error) {
      setDraftNotice(error instanceof Error ? error.message : '草稿未能保存，请下载副本。');
    }
  };
  const report = () => feedbackReport(fields);
  const updateField = (field: keyof FeedbackFields, value: string) => {
    const next = { ...fieldsRef.current, [field]: value };
    fieldsRef.current = next;
    setFields(next);
    persistDraft(next);
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
      <h1 data-tour="feedback-intro" className="font-serif text-3xl font-semibold">
        内测反馈
      </h1>
      <p className="my-4 text-sm leading-relaxed text-muted-foreground">
        告诉我们哪里不顺手，或哪条内容需要核对。点击提交即可发送给维护者，无需登录。
      </p>
      <p className="mb-5 text-xs text-muted-foreground" role="status">
        {draftNotice}
      </p>
      <form
        data-page-enter="form"
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
          persistDraft(fields, attempt.current);
          setSending(true);
          setStatus('正在提交，请稍候…');
          try {
            const id = await submitFeedback(normalized, attempt.current.id, website);
            setReceipt(id);
            setStatus('反馈已提交，维护者可以在后台查看。谢谢你的反馈！');
            try {
              if (clearFeedbackDraft(localStorage, draftRaw.current)) draftRaw.current = null;
              setDraftNotice('反馈已提交。');
            } catch {
              setDraftNotice('反馈已提交，本机草稿未能清理。');
            }
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
          <div className="space-y-2 text-sm">
            <label htmlFor="feedback-page" className="block">
              相关页面（选填）
            </label>
            <select
              id="feedback-page"
              value={customPage ? 'custom' : fields.page}
              onChange={(event) => {
                const choice = event.target.value;
                setCustomPage(choice === 'custom');
                updateField('page', choice === 'custom' ? fields.page : choice);
              }}
              className="block w-full rounded-sm border bg-background p-2"
            >
              <option value="">不指定页面</option>
              {FEEDBACK_PAGES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
              <option value="custom">其他页面或具体条目</option>
            </select>
            {customPage && (
              <label className="block text-muted-foreground">
                具体页面链接或路径
                <Input
                  className="mt-2"
                  value={fields.page}
                  maxLength={500}
                  placeholder="粘贴页面地址，例如 /quotes/q82"
                  onChange={(event) => updateField('page', event.target.value)}
                />
              </label>
            )}
          </div>
          <label className="block text-sm">
            问题或建议
            <Textarea
              className="mt-2"
              required
              minLength={5}
              maxLength={5000}
              rows={6}
              value={fields.description}
              placeholder="做了什么操作，出现了什么情况？请写清步骤和看到的问题。"
              onChange={(event) => updateField('description', event.target.value)}
            />
          </label>
          <div className="space-y-2 text-sm">
            <label htmlFor="feedback-expected" className="block">
              期望结果（选填）
            </label>
            <select
              aria-label="常见期望结果"
              value={
                FEEDBACK_EXPECTATIONS.some((option) => option.value === fields.expected)
                  ? fields.expected
                  : ''
              }
              onChange={(event) => updateField('expected', event.target.value)}
              className="block w-full rounded-sm border bg-background p-2"
            >
              <option value="">自行填写或暂不填写</option>
              {FEEDBACK_EXPECTATIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Textarea
              id="feedback-expected"
              maxLength={2000}
              rows={3}
              placeholder="选一项快速填写，也可以在这里补充或修改。"
              value={fields.expected}
              onChange={(event) => updateField('expected', event.target.value)}
            />
          </div>
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
