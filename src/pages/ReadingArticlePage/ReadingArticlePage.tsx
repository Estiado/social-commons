import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useItemLocation } from '@/hooks/useItemLocation';
import { ArrowLeft, Download, CloudUpload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArticleContent } from '@/features/reading/ArticleContent';
import {
  addAnnotation,
  isExpired,
  isPartialArticle,
  type ArticleAnnotation,
  type ReadingRecord,
} from '@/features/reading/model';
import {
  getGuestArticle,
  removeGuestArticle,
  saveLocalReading,
} from '@/features/reading/guestRepository';
import { getCloudArticle, saveCloudArticle } from '@/features/reading/cloudRepository';
import { useAccount } from '@/features/auth/useAccount';
import { EmailLoginDialog } from '@/features/auth/EmailLoginDialog';
import { errorMessage } from '@/lib/errors';
import { supabase } from '@/lib/supabase';
import { READING_CLOUD_ENABLED } from '@/features/reading/config';

export default function ReadingArticlePage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { account, loading: accountLoading } = useAccount();
  const [record, setRecord] = useState<ReadingRecord | null>(null);
  const [loadedOwner, setLoadedOwner] = useState('');
  const [loadedId, setLoadedId] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loginOpen, setLoginOpen] = useState(false);
  const pending = useRef<ArticleAnnotation[]>([]);
  const loginAction = useRef<'save' | 'suggest'>('save');
  const accountId = account?.id;
  useItemLocation(
    !loading && loadedId === id && record ? location.hash.replace(/^#reading-/, '') : null,
    'reading',
  );

  useEffect(() => {
    if (accountLoading) return;
    let active = true;
    const load = async () => {
      const local = await getGuestArticle(id);
      if (local) return { record: local, owner: '' };
      if (!READING_CLOUD_ENABLED)
        throw new Error('当前浏览器没有这篇文章，可能已到期或被清理。请重新导入。');
      const cloud = await getCloudArticle(id);
      if (!cloud) throw new Error('文章不存在、已到期，或当前账号无权访问');
      return { record: cloud, owner: accountId || '' };
    };
    load()
      .then((result) => {
        if (active) {
          setRecord(result.record);
          setLoadedOwner(result.owner);
          setError('');
        }
      })
      .catch((error) => {
        if (active) {
          setRecord(null);
          setError(errorMessage(error, '文章读取失败'));
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
          setLoadedId(id);
        }
      });
    return () => {
      active = false;
    };
  }, [id, accountLoading, accountId]);

  useEffect(() => {
    if (!record?.expiresAt) return;
    const expire = () => {
      setRecord(null);
      setError('这篇临时文章已满 7 天，请重新导入，或打开已保存的云端版本');
    };
    const timer = window.setTimeout(expire, Math.max(0, record.expiresAt - Date.now()));
    return () => window.clearTimeout(timer);
  }, [record?.expiresAt]);

  const persist = useCallback(
    async (annotations: ArticleAnnotation[] = [], destination: 'local' | 'cloud' = 'local') => {
      if (!record) return;
      setBusy(true);
      setError('');
      setNotice('');
      try {
        if (isExpired(record)) throw new Error('临时文章已到期，请重新导入');
        let next = record;
        for (const annotation of annotations) {
          const savedParagraph =
            annotation.kind === 'paragraph' &&
            next.annotations.find(
              (item) => item.kind === 'paragraph' && item.blockId === annotation.blockId,
            );
          next = savedParagraph
            ? {
                ...next,
                annotations: next.annotations.filter((item) => item.id !== savedParagraph.id),
              }
            : addAnnotation(next, annotation);
        }
        if (destination === 'local') {
          const saved = await saveLocalReading(next);
          setRecord(saved);
          setLoadedOwner('');
          setNotice(
            annotations.length
              ? '收藏已保存到本机，可从本篇摘录区或整库导出。'
              : '已长期保存到本浏览器；换设备或清理数据前请备份。',
          );
          return;
        }
        const saved = await saveCloudArticle(next);
        const { data } = await supabase!.auth.getSession();
        setRecord(saved);
        setLoadedOwner(data.session?.user.id || '');
        // The cloud row has committed before the local copy is removed. A cleanup
        // failure does not misreport the successful save as a failed cloud write.
        try {
          await removeGuestArticle(record.document.id);
        } catch {
          /* Expiry cleanup retries next visit. */
        }
        if (saved.document.id !== id) navigate(`/reading/${saved.document.id}`, { replace: true });
        setNotice(
          annotations.length
            ? '收藏已保存到个人阅读空间'
            : '已长期保存，可在其他设备登录后继续阅读',
        );
      } catch (error) {
        setError(errorMessage(error, '保存失败，本机临时文章仍保留'));
      } finally {
        setBusy(false);
      }
    },
    [record, id, navigate],
  );

  const requestSave = useCallback(
    (annotations: ArticleAnnotation[] = []) => {
      void persist(annotations, record?.revision ? 'cloud' : 'local');
    },
    [record?.revision, persist],
  );

  const requestCloudSave = () => {
    if (account) void persist([], 'cloud');
    else {
      loginAction.current = 'save';
      pending.current = [];
      setLoginOpen(true);
    }
  };

  const exportFile = async (format: 'docx' | 'pdf', excerpts = false) => {
    if (!record) return;
    setBusy(true);
    setError('');
    setNotice(format === 'pdf' ? '正在准备 PDF，首次导出需要加载中文字体…' : '正在准备 Word…');
    try {
      if (isExpired(record)) throw new Error('临时文章已到期，请重新导入');
      const { exportArticle } = await import('@/features/reading/export/articleExport');
      const article = excerpts
        ? {
            ...record.document,
            title: `${record.document.title} · 我的摘录`,
            blocks: record.annotations.map((item, index) => ({
              id: `excerpt-${index}`,
              type: 'paragraph' as const,
              text: item.text,
            })),
          }
        : record.document;
      const warnings = await exportArticle(article, format);
      setNotice(
        warnings.length
          ? `文件已导出，${warnings.length} 张插图未能嵌入，文件中已标注原图地址。`
          : '文件已生成，包含原文出处。',
      );
    } catch (error) {
      setError(errorMessage(error, '导出失败，请稍后重试'));
      setNotice('');
    } finally {
      setBusy(false);
    }
  };

  const suggest = async (verifiedOwnerId = account?.id) => {
    if (!record || !supabase) return;
    if (!verifiedOwnerId) {
      loginAction.current = 'suggest';
      setLoginOpen(true);
      return;
    }
    setBusy(true);
    setError('');
    try {
      const { error } = await supabase.from('reading_submissions').insert({
        owner_id: verifiedOwnerId,
        title: record.document.title,
        url: record.document.url,
        source: record.document.source,
      });
      if (error?.code === '23505') setNotice('这篇文章已经提交，等待维护者审核');
      else if (error) throw error;
      else setNotice('已提交标题和原文链接供审核；个人正文和收藏不会公开');
    } catch {
      setError('精选推荐未能提交，请稍后重试；个人文章不受影响');
    } finally {
      setBusy(false);
    }
  };

  const canRead =
    record && record.document.id === id && (record.revision === 0 || loadedOwner === account?.id);
  const isLoading = loading || loadedId !== id || accountLoading;
  return (
    <div className="mx-auto max-w-3xl px-6 py-10 md:px-10">
      <Link
        to="/reading"
        className="mb-7 inline-flex items-center gap-2 text-sm text-muted-foreground"
      >
        <ArrowLeft size={16} />
        我的阅读空间
      </Link>
      {isLoading && <p role="status">正在打开文章…</p>}
      {error && loadedId === id && (
        <p role="alert" className="mb-5 rounded-sm border border-red-200 p-4 text-sm text-red-700">
          {error}
        </p>
      )}
      {!isLoading && record && !canRead && <p>请使用保存这篇文章的账号登录后阅读。</p>}
      {canRead && (
        <>
          <header className="mb-7 border-b pb-6">
            <p className="mb-3 text-xs tracking-widest text-accent">
              {record.revision
                ? '个人文章 · 已云端保存'
                : record.expiresAt
                  ? '临时文章 · 仅本浏览器'
                  : '本机文章 · 已长期保存'}
            </p>
            <h1 className="font-serif text-3xl leading-relaxed font-semibold">
              {record.document.title}
            </h1>
            <p
              className={`mt-3 text-sm ${isPartialArticle(record.document) ? 'font-medium text-amber-800' : 'text-muted-foreground'}`}
            >
              {isPartialArticle(record.document)
                ? '公开节选 · 不是全文'
                : record.document.completeness === 'user-confirmed'
                  ? '导入者已核对正文完整性'
                  : '原页可读正文 · 完整性尚未经人工核验'}
            </p>
            {isPartialArticle(record.document) && (
              <Link
                className="mt-2 inline-block text-sm text-accent underline"
                to={`/reading/import?${new URLSearchParams({ url: record.document.url, mode: 'paste', ...(record.revision ? { replace: record.document.id } : {}) })}`}
              >
                重新粘贴完整正文
              </Link>
            )}
            <p className="mt-4 text-sm text-muted-foreground">
              {[record.document.author, record.document.source, record.document.publishedAt]
                .filter(Boolean)
                .join(' · ') || '来源信息待核对'}
            </p>
            {record.document.url && (
              <a
                href={record.document.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm text-accent underline"
              >
                阅读原文
              </a>
            )}
            {record.expiresAt && (
              <p className="mt-3 text-xs text-muted-foreground">
                临时保留至 {new Date(record.expiresAt).toLocaleString('zh-CN')}
                。清理浏览器数据也会移除临时文章。
              </p>
            )}
          </header>
          <div className="mb-6 flex flex-wrap gap-2">
            <Button disabled={busy} onClick={() => requestSave()}>
              <CloudUpload size={16} />
              {record.revision ? '保存同步' : '保存到本机'}
            </Button>
            {READING_CLOUD_ENABLED && !record.revision && (
              <Button variant="outline" disabled={busy} onClick={requestCloudSave}>
                同步到云端
              </Button>
            )}
            <Button variant="outline" disabled={busy} onClick={() => void exportFile('docx')}>
              <Download size={16} />
              Word
            </Button>
            <Button variant="outline" disabled={busy} onClick={() => void exportFile('pdf')}>
              <Download size={16} />
              PDF
            </Button>
          </div>
          {notice && (
            <p role="status" className="mb-5 rounded-sm bg-accent/5 p-4 text-sm">
              {notice}
            </p>
          )}
          {!!record.document.warnings.length && (
            <div className="mb-7 space-y-1 border-l-2 border-amber-500 pl-4 text-sm text-muted-foreground">
              {record.document.warnings.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          )}
          <ArticleContent
            article={record.document}
            annotations={record.annotations}
            onSave={requestSave}
            busy={busy}
          />
          <section className="mt-12 border-t pt-7" aria-label="本篇收藏">
            <h2 className="font-serif text-xl font-semibold">
              我的摘录 · {record.annotations.length}
            </h2>
            {!record.annotations.length && (
              <p className="mt-3 text-sm text-muted-foreground">
                悬停段落或选中文字，即可收藏。手机可点击段落下方的收藏按钮。
              </p>
            )}
            {record.annotations.map((item) => (
              <div key={item.id} className="mt-4 rounded-sm border p-4 text-sm">
                <a href={`#reading-${item.blockId}`} className="whitespace-pre-wrap">
                  {item.text}
                </a>
                <button
                  disabled={busy}
                  className="mt-2 block text-xs text-muted-foreground underline"
                  onClick={() => {
                    setBusy(true);
                    setError('');
                    const save = record.revision ? saveCloudArticle : saveLocalReading;
                    save({
                      ...record,
                      annotations: record.annotations.filter((entry) => entry.id !== item.id),
                    })
                      .then(setRecord)
                      .catch((error) => setError(errorMessage(error, '取消收藏失败')))
                      .finally(() => setBusy(false));
                  }}
                >
                  取消收藏
                </button>
              </div>
            ))}
            {!!record.annotations.length && (
              <div className="mt-5 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  disabled={busy}
                  onClick={() => void exportFile('docx', true)}
                >
                  摘录导出 Word
                </Button>
                <Button
                  variant="outline"
                  disabled={busy}
                  onClick={() => void exportFile('pdf', true)}
                >
                  摘录导出 PDF
                </Button>
              </div>
            )}
          </section>
          {READING_CLOUD_ENABLED && record.document.url && (
            <div className="mt-9 border-t pt-6">
              <Button variant="ghost" disabled={busy} onClick={() => void suggest()}>
                推荐到近期精选（需审核）
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                只推荐文章信息与原文链接，个人全文和摘录继续保持私有。
              </p>
            </div>
          )}
        </>
      )}
      <EmailLoginDialog
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSignedIn={() => {
          if (loginAction.current === 'suggest') {
            void supabase?.auth.getSession().then(({ data }) => suggest(data.session?.user.id));
          } else {
            void persist(pending.current, 'cloud');
          }
          pending.current = [];
        }}
      />
    </div>
  );
}
