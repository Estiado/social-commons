import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ESSAY_MATERIALS } from '@/data/essay';
import { useAccount } from '@/features/auth/useAccount';
import { EmailLoginDialog } from '@/features/auth/EmailLoginDialog';
import { RecommendedMaterials } from '@/features/essay/RecommendedMaterials';
import { Button } from '@/components/ui/button';
import { READING_CLOUD_ENABLED } from '@/features/articles/config';

export default function EditorMaterialsPage() {
  const { account, loading } = useAccount();
  const [loginOpen, setLoginOpen] = useState(false);
  const [conceptId, setConceptId] = useState(ESSAY_MATERIALS[0]?.id || '');
  return <div className="mx-auto max-w-3xl space-y-6 px-6 py-12">
    <Link className="text-sm text-accent underline" to="/essay">返回议论文素材</Link>
    <h1 className="font-serif text-3xl font-semibold">站方推荐管理</h1>
    <p className="text-sm leading-relaxed text-muted-foreground">推荐素材会公开给所有访客。请使用获得站方编辑权限的邮箱账号登录，并为每条素材提供真实来源；普通读者的个人素材继续仅保存在本机。</p>
    {!READING_CLOUD_ENABLED ? <p className="text-sm text-muted-foreground">当前为本机内测，站方在线发布将在邮箱账号验收后开放。现有推荐随站点版本发布；个人素材已可本地增改和备份。</p> : loading ? <p role="status">正在核对账号…</p> : !account ? <Button onClick={() => setLoginOpen(true)}>编辑账号登录</Button> : <p className="text-sm">当前账号：{account.email}。获得站方授权后，所选概念下将显示发布按钮。</p>}
    <label className="block text-sm">选择素材概念<select value={conceptId} onChange={(event) => setConceptId(event.target.value)} className="mt-2 block w-full rounded-sm border bg-background p-3">{ESSAY_MATERIALS.map((item) => <option key={item.id} value={item.id}>{item.concept}</option>)}</select></label>
    <RecommendedMaterials key={conceptId} conceptId={conceptId} />
    <EmailLoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} onSignedIn={() => {}} />
  </div>;
}
