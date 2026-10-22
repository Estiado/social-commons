import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { materialFieldsSchema, type MaterialFields } from './materials';

export function MaterialForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: MaterialFields;
  onSave(fields: MaterialFields): Promise<void> | void;
  onCancel(): void;
}) {
  const [fields, setFields] = useState<MaterialFields>(
    initial || { title: '', content: '', source: '', sourceUrl: '', usageHint: '' },
  );
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="space-y-4 rounded-sm border p-5"
      onSubmit={async (event) => {
        event.preventDefault();
        setError('');
        setBusy(true);
        try {
          const parsed = materialFieldsSchema.safeParse(fields);
          if (!parsed.success) throw new Error(parsed.error.issues[0]?.message || '请检查输入内容');
          await onSave(parsed.data);
        } catch (error) {
          setError(error instanceof Error ? error.message : '素材未保存，请重试');
        } finally {
          setBusy(false);
        }
      }}
    >
      <label className="block text-sm">
        素材标题
        <Input
          required
          maxLength={200}
          value={fields.title}
          onChange={(event) => setFields({ ...fields, title: event.target.value })}
          className="mt-2"
        />
      </label>
      <label className="block text-sm">
        素材正文
        <Textarea
          required
          maxLength={30000}
          value={fields.content}
          onChange={(event) => setFields({ ...fields, content: event.target.value })}
          className="mt-2 min-h-40"
        />
      </label>
      <label className="block text-sm">
        作者与出处
        <Input
          required
          maxLength={500}
          value={fields.source}
          placeholder="书籍、文章作者与名称；原创请填写“本人整理”"
          onChange={(event) => setFields({ ...fields, source: event.target.value })}
          className="mt-2"
        />
      </label>
      <label className="block text-sm">
        出处链接（可选）
        <Input
          type="url"
          maxLength={2048}
          value={fields.sourceUrl}
          onChange={(event) => setFields({ ...fields, sourceUrl: event.target.value })}
          className="mt-2"
        />
      </label>
      <label className="block text-sm">
        适用论点 / 使用提示（可选）
        <Textarea
          maxLength={2000}
          value={fields.usageHint}
          onChange={(event) => setFields({ ...fields, usageHint: event.target.value })}
          className="mt-2"
        />
      </label>
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="flex gap-3">
        <Button disabled={busy} type="submit">
          {busy ? '保存中…' : '保存素材'}
        </Button>
        <Button variant="outline" disabled={busy} type="button" onClick={onCancel}>
          取消
        </Button>
      </div>
    </form>
  );
}
