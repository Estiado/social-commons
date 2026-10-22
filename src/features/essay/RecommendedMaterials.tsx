import { useEffect, useState } from 'react';
import { ESSAY_EXAMPLES, type EssayExample } from '@/data/essayExamples';
import { supabase } from '@/lib/supabase';
import { useAccount } from '@/features/auth/useAccount';
import { Button } from '@/components/ui/button';
import { MaterialForm } from './MaterialForm';
import { MaterialCard } from './MaterialCard';
import { materialFieldsSchema, type MaterialFields } from './materials';
import { READING_CLOUD_ENABLED } from '@/features/articles/config';

interface ExampleRow { id: string; concept_id: string; title: string; content: string; source: string; source_url: string; usage_hint: string }
const fromRow = (row: ExampleRow): EssayExample => ({ ...materialFieldsSchema.parse({ ...row, sourceUrl: row.source_url, usageHint: row.usage_hint }), id: row.id, conceptId: row.concept_id });

export function RecommendedMaterials({ conceptId }: { conceptId: string }) {
  const { account } = useAccount();
  const [examples, setExamples] = useState(() => ESSAY_EXAMPLES.filter((item) => item.conceptId === conceptId));
  const [editorId, setEditorId] = useState(''); const [error, setError] = useState('');
  const editor = Boolean(READING_CLOUD_ENABLED && account && account.id === editorId);
  const [editing, setEditing] = useState<EssayExample | 'new' | null>(null);
  useEffect(() => {
    let active = true;
    if (!supabase) return;
    void (async () => {
      const { data, error } = await supabase.from('essay_examples').select('id,concept_id,title,content,source,source_url,usage_hint').eq('concept_id', conceptId).order('created_at');
      if (active && !error && data) setExamples(data.map(fromRow));
      if (account) {
        const result = await supabase.from('site_editors').select('user_id').eq('user_id', account.id).maybeSingle();
        if (active) setEditorId(!result.error && result.data ? account.id : '');
      }
    })().catch(() => { if (active) setError('站方素材暂时无法更新，当前显示随站点发布的示例。'); });
    return () => { active = false; };
  }, [conceptId, account]);
  const publish = async (fields: MaterialFields) => {
    if (!supabase || !editor) throw new Error('当前账号没有站方编辑权限');
    const id = editing && editing !== 'new' ? editing.id : crypto.randomUUID();
    const { data, error } = await supabase.from('essay_examples').upsert({ id, concept_id: conceptId,
      title: fields.title, content: fields.content, source: fields.source, source_url: fields.sourceUrl, usage_hint: fields.usageHint })
      .select('id,concept_id,title,content,source,source_url,usage_hint').single();
    if (error) throw new Error('推荐素材未发布，请检查账号权限或稍后重试');
    const saved = fromRow(data); setExamples((items) => [...items.filter((item) => item.id !== id), saved]); setEditing(null);
  };
  return <section aria-label="站方推荐示例" className="space-y-4 border-t pt-6">
    <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-serif text-xl font-semibold">站方推荐示例</h3>{editor && <Button size="sm" onClick={() => setEditing('new')}>发布推荐素材</Button>}</div>
    <p className="text-xs text-muted-foreground">由站方维护，所有访客可读。个人素材不会自动发布到这里。</p>
    {error && <p role="alert" className="text-sm text-amber-800">{error}</p>}
    {examples.map((example) => <MaterialCard material={example} key={example.id}>{editor && <button className="mt-4 text-xs underline" onClick={() => setEditing(example)}>编辑推荐素材</button>}</MaterialCard>)}
    {!examples.length && <p className="text-sm text-muted-foreground">本站暂未推荐该概念的素材。你可以先在上方整理自己的内容。</p>}
    {editor && editing && <MaterialForm key={editing === 'new' ? 'new' : editing.id} initial={editing === 'new' ? undefined : editing} onSave={publish} onCancel={() => setEditing(null)} />}
  </section>;
}
