import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { TopicSpecial } from '@/data/topicSpecials';
import { Button } from '@/components/ui/button';
import { listGuestArticles, linkArticleToTopic } from './guestRepository';
import type { ReadingSummary } from './model';

export function TopicReading({ topic }: { topic: TopicSpecial }) {
  const [articles, setArticles] = useState<ReadingSummary[]>([]);
  const [choosing, setChoosing] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    listGuestArticles()
      .then((items) => {
        if (active) setArticles(items);
      })
      .catch((error) => {
        if (active) setNotice(error.message);
      });
    return () => {
      active = false;
    };
  }, [topic.id]);
  const mine = articles.filter((article) => article.topicIds?.includes(topic.id));
  const add = async () => {
    setBusy(true);
    setNotice('');
    try {
      for (const id of selected) await linkArticleToTopic(id, topic.id, topic.relatedTags);
      setArticles(await listGuestArticles());
      setSelected([]);
      setChoosing(false);
      setNotice('已关联到当前专题，正文仍只保存在你的浏览器。');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : '关联未完成，请重试');
    } finally {
      setBusy(false);
    }
  };
  return (
    <section id="my-commentaries" aria-label="我的专题时评" className="my-8 rounded-sm border p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-xl font-semibold">我的专题时评</h2>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link to={'/reading/import?topic=' + encodeURIComponent(topic.id)}>
              添加时评到本专题
            </Link>
          </Button>
          <Button size="sm" variant="outline" onClick={() => setChoosing(!choosing)}>
            从阅读空间选择
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        这里显示你关联的文章，仅当前浏览器可见；不会自动进入公共目录。
      </p>
      {notice && (
        <p role="status" className="my-3 text-sm text-accent">
          {notice}
        </p>
      )}
      {choosing && (
        <div className="my-4 space-y-3 rounded-sm border p-4">
          {articles.map((article) => (
            <label key={article.id} className="flex gap-2 text-sm">
              <input
                type="checkbox"
                checked={selected.includes(article.id)}
                onChange={(event) =>
                  setSelected((previous) =>
                    event.target.checked
                      ? [...previous, article.id]
                      : previous.filter((id) => id !== article.id),
                  )
                }
              />
              {article.title}
            </label>
          ))}
          {!articles.length && (
            <p className="text-sm">阅读空间还没有文章，可先从链接或正文导入。</p>
          )}
          <Button size="sm" disabled={busy || !selected.length} onClick={() => void add()}>
            关联到当前专题
          </Button>
        </div>
      )}
      <div className="mt-4 space-y-3">
        {mine.map((article) => (
          <Link
            key={article.id}
            className="block rounded-sm border p-4 hover:border-accent"
            to={'/reading/' + article.id}
          >
            <h3 className="font-serif font-semibold">{article.title}</h3>
            <p className="mt-2 text-xs text-muted-foreground">{article.source || '个人导入'}</p>
          </Link>
        ))}
      </div>
      {!mine.length && (
        <p className="mt-4 text-sm text-muted-foreground">
          还没有个人时评。添加后会回到本专题，并显示在这里。
        </p>
      )}
    </section>
  );
}
