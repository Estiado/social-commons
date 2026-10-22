import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAccount } from '@/features/auth/useAccount';
import { EmailLoginDialog } from '@/features/auth/EmailLoginDialog';
import { listGuestArticles } from '@/features/articles/guestRepository';
import { listCloudArticles } from '@/features/articles/cloudRepository';
import type { ReadingSummary } from '@/features/articles/model';
import { supabase } from '@/lib/supabase';
import { errorMessage } from '@/lib/database';
import { BatchExportControls } from '@/features/articles/BatchExportControls';
import { READING_CLOUD_ENABLED } from '@/features/articles/config';

export default function ReadingLibraryPage() {
  const { account, loading: authLoading } = useAccount();
  const [guest, setGuest] = useState<ReadingSummary[]>([]);
  const [cloud, setCloud] = useState<ReadingSummary[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);
  const [search, setSearch] = useState('');
  useEffect(() => {
    if (authLoading) return;
    let active = true;
    Promise.allSettled([
      listGuestArticles(),
      READING_CLOUD_ENABLED && account ? listCloudArticles() : Promise.resolve([]),
    ]).then(([local, remote]) => {
      if (!active) return;
      if (local.status === 'fulfilled') setGuest(local.value);
      if (remote.status === 'fulfilled') setCloud(remote.value);
      else setCloud([]);
      setError(
        [local, remote]
          .filter((result) => result.status === 'rejected')
          .map((result) =>
            errorMessage((result as PromiseRejectedResult).reason, '文章列表加载失败'),
          )
          .join('；'),
      );
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [account?.id, authLoading, account]);
  const cloudIds = new Set(cloud.map((item) => item.id));
  const articles = [
    ...cloud.map((item) => ({ ...item, storage: 'cloud' })),
    ...guest
      .filter((item) => !cloudIds.has(item.id))
      .map((item) => ({ ...item, storage: 'local' })),
  ].filter((item) =>
    `${item.title} ${item.source}`.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()),
  );
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-3 text-xs tracking-widest text-accent">MY READING SPACE</p>
          <h1 className="font-serif text-3xl font-semibold">我的阅读空间</h1>
        </div>
        <Button asChild>
          <Link to="/reading/import">
            <Plus size={16} />
            导入文章
          </Link>
        </Button>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        文章导入后临时保留 7
        天。点击“保存到本机”或收藏即可在本浏览器长期保留，无需登录；清理浏览器数据前请先备份导出。
        {!READING_CLOUD_ENABLED && '当前为本机内测，邮箱登录与跨设备同步暂未开放。'}
      </p>
      <div className="my-6 flex flex-wrap items-center gap-3 text-sm">
        {READING_CLOUD_ENABLED &&
          (account ? (
            <>
              <span>已登录：{account.email}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  const result = await supabase?.auth.signOut();
                  if (result?.error) setError(result.error.message);
                }}
              >
                退出账号
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setLoginOpen(true)}>
              邮箱验证码登录
            </Button>
          ))}
        <Link className="text-accent underline" to="/paragraphs">
          段落库与素材整理
        </Link>
      </div>
      {error && (
        <p role="alert" className="mb-5 rounded-sm border border-amber-300 p-4 text-sm">
          {error}
        </p>
      )}
      <BatchExportControls ownerId={READING_CLOUD_ENABLED ? account?.id : undefined} />
      <Input
        aria-label="搜索我的文章"
        placeholder="搜索标题、来源…"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      {loading ? (
        <p role="status" className="py-12">
          正在读取文章…
        </p>
      ) : !articles.length ? (
        <div className="my-10 rounded-sm border border-dashed p-10 text-center">
          <BookOpen className="mx-auto mb-3 text-accent" />
          <p>还没有文章，先导入一篇开始阅读。</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {articles.map((item) => (
            <Link
              to={`/reading/${item.id}`}
              key={item.id}
              className="block rounded-sm border p-5 hover:border-accent/50"
            >
              <p className="mb-2 text-xs text-accent">
                {item.storage === 'cloud'
                  ? '已云端保存'
                  : item.expiresAt
                    ? '临时文章'
                    : '本机长期保存'}{' '}
                · {item.annotationCount} 条摘录
              </p>
              <h2 className="font-serif text-lg font-semibold">{item.title}</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                {item.source || '来源待核对'}
                {item.expiresAt
                  ? ` · 保留至 ${new Date(item.expiresAt).toLocaleDateString('zh-CN')}`
                  : ''}
              </p>
            </Link>
          ))}
        </div>
      )}
      {cloud.length === 100 && (
        <p className="mt-4 text-xs text-muted-foreground">当前展示最近更新的 100 篇云端文章。</p>
      )}
      <EmailLoginDialog
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSignedIn={() => {}}
      />
    </div>
  );
}
