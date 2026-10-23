import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { downloadFile } from '@/lib/downloadFile';
import { feedbackReport } from '@/features/feedback/report';

export default function FeedbackPage() {
  const [params] = useSearchParams();
  const [kind, setKind] = useState('使用问题');
  const [page, setPage] = useState(params.get('page') || '');
  const [description, setDescription] = useState('');
  const [expected, setExpected] = useState('');
  const [status, setStatus] = useState('');
  const report = () => feedbackReport({ kind, page, description, expected });
  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <h1 className="font-serif text-3xl font-semibold">内测反馈</h1>
      <p className="my-4 text-sm leading-relaxed text-muted-foreground">
        告诉我们哪里不顺手，或哪条内容需要核对。填写后复制或下载，发给邀请你内测的人。
      </p>
      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          try {
            downloadFile(
              new Blob([report()], { type: 'text/plain;charset=utf-8' }),
              `社科通识反馈-${new Date().toISOString().slice(0, 10)}.txt`,
            );
            setStatus('反馈文件已生成，尚未发送。请将下载的文件发给维护者。');
          } catch {
            setStatus('请至少写五个字，说明遇到的问题。');
          }
        }}
      >
        <label className="block text-sm">
          反馈类型
          <select
            value={kind}
            onChange={(event) => setKind(event.target.value)}
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
            value={page}
            maxLength={500}
            placeholder="例如 /essay"
            onChange={(event) => setPage(event.target.value)}
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
            value={description}
            placeholder="做了什么操作，出现了什么情况？可以另外附上截图。"
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
        <label className="block text-sm">
          期望结果（可选）
          <Textarea
            className="mt-2"
            maxLength={2000}
            rows={3}
            value={expected}
            onChange={(event) => setExpected(event.target.value)}
          />
        </label>
        <div className="flex flex-wrap gap-3">
          <Button type="submit">下载反馈文件</Button>
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
                .then(() => setStatus('反馈已复制，尚未发送。请粘贴给维护者。'))
                .catch(() => setStatus('浏览器未允许复制，请下载反馈文件。'));
            }}
          >
            复制反馈
          </Button>
        </div>
        {status && (
          <p role="status" className="rounded-sm border p-3 text-sm">
            {status}
          </p>
        )}
      </form>
      <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
        反馈不会自动上传，也不会读取你的阅读文章或设备信息。关闭页面前请先复制或下载。
      </p>
      <Link to="/reading" className="mt-5 inline-block text-sm text-accent underline">
        返回阅读空间
      </Link>
    </div>
  );
}
