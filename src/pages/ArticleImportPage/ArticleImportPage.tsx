import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, FileText, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  articleSchema,
  canonicalArticleUrl,
  isPartialArticle,
  type ArticleDocument,
} from '@/features/reading/model';
import {
  saveGuestArticle,
  linkArticleToTopic,
  linkArticleToEvent,
} from '@/features/reading/guestRepository';
import { TOPIC_SPECIALS } from '@/data/topicSpecials';
import { GUANLAN_EVENTS } from '@/data/guanlan/catalogue';
import { isBlockedDocument, SourceVerificationError } from '@/features/reading/sourceAccess';
import { ArticleContent } from '@/features/reading/ArticleContent';
import { errorMessage } from '@/lib/errors';
import { getCloudArticle, saveCloudArticle } from '@/features/reading/cloudRepository';

export default function ArticleImportPage() {
  const [parameters] = useSearchParams();
  const navigate = useNavigate();
  const topic = TOPIC_SPECIALS.find((item) => item.id === parameters.get('topic'));
  const event = GUANLAN_EVENTS.find((item) => item.id === parameters.get('event'));
  const [mode, setMode] = useState<'url' | 'paste'>(
    parameters.get('mode') === 'paste' ? 'paste' : 'url',
  );
  const [url, setUrl] = useState(parameters.get('url') || '');
  const [text, setText] = useState('');
  const [richHtml, setRichHtml] = useState('');
  const [article, setArticle] = useState<ArticleDocument | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [complete, setComplete] = useState(false);

  const extract = async () => {
    setBusy(true);
    setError('');
    setArticle(null);
    setComplete(false);
    try {
      if (mode === 'paste') {
        const parser = await import('@/features/reading/parseArticle');
        const result = richHtml
          ? parser.parseArticleHtml(richHtml, url ? canonicalArticleUrl(url) : '')
          : parser.parsePlainArticle(text);
        setArticle({ ...result, url: url ? canonicalArticleUrl(url) : '' });
      } else {
        const response = await fetch('/api/extract-article', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: canonicalArticleUrl(url) }),
          signal: AbortSignal.timeout(25_000),
        });
        if (!response.headers.get('content-type')?.includes('application/json'))
          throw new Error('提取接口暂不可用，可切换到粘贴正文');
        const result = await response.json();
        if (!response.ok || !result.success)
          throw new Error(result.error || '提取失败，请粘贴正文导入');
        const parsed = articleSchema.parse(result.article);
        if (isBlockedDocument(parsed)) throw new SourceVerificationError();
        setArticle(parsed);
      }
    } catch (error) {
      setError(errorMessage(error, '导入失败，请检查输入内容'));
    } finally {
      setBusy(false);
    }
  };
  const beginReading = async () => {
    if (!article) return;
    setBusy(true);
    setError('');
    try {
      if (isBlockedDocument(article)) throw new SourceVerificationError();
      if (parameters.get('event') && !event)
        throw new Error('关联事件不存在，请从观澜重新选择事件。');
      const replaceId = parameters.get('replace');
      if (replaceId) {
        if (!complete) throw new Error('替换节选前，请先勾选已对照原文确认完整');
        const existing = await getCloudArticle(replaceId);
        if (!existing) throw new Error('原文章不存在或当前账号无权修改');
        if (
          !window.confirm(
            '将用已核对的完整正文替换旧文章，旧版本摘录将清除。请先导出旧摘录备份。确定替换？',
          )
        )
          return;
        const saved = await saveCloudArticle({
          ...existing,
          document: articleSchema.parse({
            ...article,
            id: existing.document.id,
            completeness: 'user-confirmed',
          }),
          annotations: [],
        });
        navigate(`/reading/${saved.document.id}`);
        return;
      }
      const record = await saveGuestArticle(
        articleSchema.parse({
          ...article,
          completeness: complete ? 'user-confirmed' : article.completeness,
        }),
      );
      if (event) {
        await linkArticleToEvent(record.document.id, event);
        navigate(`/guanlan/events/${event.id}#my-event-materials`);
      } else if (topic) {
        await linkArticleToTopic(record.document.id, topic.id, topic.relatedTags);
        navigate(`/guanlan/topics/${topic.id}#my-commentaries`);
      } else navigate(`/reading/${record.document.id}`);
    } catch (error) {
      setError(errorMessage(error, '浏览器未能保存文章，请检查存储空间或退出无痕模式后重试'));
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link
        to={
          event ? `/guanlan/events/${event.id}` : topic ? `/guanlan/topics/${topic.id}` : '/guanlan'
        }
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground"
      >
        <ArrowLeft size={16} />
        {event ? '返回事件精读' : topic ? `返回${topic.name}` : '返回观澜'}
      </Link>
      <h1 className="font-serif text-3xl font-semibold">把文章带进阅读空间</h1>
      {event ? (
        <p className="mt-4 rounded-sm border border-accent/30 p-4 text-sm">
          正在添加到“{event.title}”。保存后返回本事件，文章仅在你的浏览器可见。
        </p>
      ) : (
        topic && (
          <p className="mt-4 rounded-sm border border-accent/30 p-4 text-sm">
            正在添加到“{topic.name}”。保存后返回本专题，文章仅在你的浏览器可见。
          </p>
        )
      )}
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        粘贴原文链接，整理成适合阅读和备课的格式。免登录阅读与导出，临时保留 7
        天；点击“保存到本机”或收藏可在当前浏览器长期保留。
      </p>
      <div className="my-7 flex gap-3" role="group" aria-label="导入方式">
        <Button
          variant={mode === 'url' ? 'default' : 'outline'}
          onClick={() => {
            setMode('url');
            setError('');
          }}
        >
          <Link2 size={16} />
          链接提取
        </Button>
        <Button
          variant={mode === 'paste' ? 'default' : 'outline'}
          onClick={() => {
            setMode('paste');
            setError('');
          }}
        >
          <FileText size={16} />
          粘贴正文
        </Button>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void extract();
        }}
        className="space-y-4 rounded-sm border p-5"
      >
        <label className="block text-sm">
          原文链接{mode === 'paste' ? '（可选，建议保留出处）' : ''}
          <Input
            type="url"
            required={mode === 'url'}
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://…"
            className="mt-2"
          />
        </label>
        {mode === 'paste' && (
          <label className="block text-sm">
            文章正文
            <Textarea
              required
              value={text}
              onChange={(event) => {
                setText(event.target.value);
                setRichHtml('');
              }}
              onPaste={(event) => {
                const html = event.clipboardData.getData('text/html');
                if (html) {
                  event.preventDefault();
                  setRichHtml(html);
                  setText(event.clipboardData.getData('text/plain'));
                }
              }}
              placeholder="从原文复制正文到这里。网页复制的标题层级、插图和图注会尽量保留。"
              className="mt-2 min-h-52"
              maxLength={160000}
            />
          </label>
        )}
        <Button type="submit" disabled={busy}>
          {busy ? '正在整理…' : '整理并预览'}
        </Button>
        {mode === 'url' && (
          <p className="text-xs leading-relaxed text-muted-foreground">
            支持人民日报、澎湃新闻、浙江宣传公众号、新周刊、南方周末等来源的可读取正文。无法读取或只有摘要时，可切换到粘贴正文。
          </p>
        )}
      </form>
      {error && (
        <div
          role="alert"
          className="mt-4 space-y-3 rounded-sm border border-red-200 p-4 text-sm text-red-700"
        >
          <p>{error}</p>
          {mode === 'url' && (
            <Button
              variant="outline"
              onClick={() => {
                setMode('paste');
                setArticle(null);
              }}
            >
              切换到粘贴正文
            </Button>
          )}
        </div>
      )}
      {article && (
        <section className="mt-9" aria-label="文章预览">
          <h2 className="mb-4 font-serif text-xl font-semibold">核对文章信息</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {(['title', 'author', 'source', 'publishedAt'] as const).map((key) => (
              <label
                key={key}
                className={`block text-sm ${key === 'title' ? 'sm:col-span-2' : ''}`}
              >
                {
                  {
                    title: '标题',
                    author: '作者',
                    source: '媒体 / 账号名称',
                    publishedAt: '原文发布日期（未识别时可留空）',
                  }[key]
                }
                <Input
                  value={article[key]}
                  maxLength={key === 'title' ? 500 : key === 'publishedAt' ? 80 : 300}
                  onChange={(event) => setArticle({ ...article, [key]: event.target.value })}
                  className="mt-2"
                />
              </label>
            ))}
          </div>
          {!!article.warnings.length && (
            <div
              role="status"
              className="mt-5 space-y-1 rounded-sm bg-amber-50 p-4 text-sm text-amber-900"
            >
              {article.warnings.map((warning) => (
                <p key={warning}>{warning}</p>
              ))}
            </div>
          )}
          <p className="my-4 text-xs text-muted-foreground">
            请核对正文是否完整；来源和作者未识别时不会自动补写。
          </p>
          {isPartialArticle(article) ? (
            <div role="alert" className="space-y-3 rounded-sm border border-amber-500 p-4 text-sm">
              <p className="font-medium">当前是公开节选，尚未取得全文。</p>
              <p>原站要求登录或订阅，服务器无法读取其后的内容。请在原站正常阅读后复制完整正文。</p>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => {
                    setMode('paste');
                    setArticle(null);
                    setText('');
                    setRichHtml('');
                  }}
                >
                  粘贴完整正文
                </Button>
                <Button variant="outline" disabled={busy} onClick={() => void beginReading()}>
                  {topic ? '保存节选并回到专题' : '仅保存可见节选'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={complete}
                  onChange={(event) => setComplete(event.target.checked)}
                />
                我已对照原文，确认正文完整（可选）
              </label>
              <Button onClick={() => void beginReading()} disabled={busy || !article.title.trim()}>
                {topic ? '保存并回到专题' : '确认并开始阅读'}
              </Button>
            </div>
          )}
          <div className="mt-7 max-h-[600px] overflow-y-auto rounded-sm border px-6">
            <ArticleContent article={article} />
          </div>
        </section>
      )}
    </div>
  );
}
