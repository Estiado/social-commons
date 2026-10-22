import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CURATED_COMMENTARIES } from '@/data/curatedCommentaries';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { commentaryTopics } from './commentaryTopics';

export function CommentaryCatalogue({ topicId }: { topicId?: string }) {
  const [media, setMedia] = useState('');
  const [month, setMonth] = useState('');
  const [search, setSearch] = useState('');
  const catalogue = useMemo(
    () =>
      CURATED_COMMENTARIES.filter(
        (item) => !topicId || commentaryTopics(item).includes(topicId),
      ).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
    [topicId],
  );
  const sources = [...new Set(catalogue.map((item) => item.source))];
  const query = search.trim().toLocaleLowerCase();
  const visible = catalogue.filter(
    (item) =>
      (!media || item.source === media) &&
      (!month || item.publishedAt.startsWith(month)) &&
      [item.title, item.source, item.author, ...item.writingTags, ...item.generalTags]
        .join(' ')
        .toLocaleLowerCase()
        .includes(query),
  );
  return (
    <section aria-label="按媒体检索时评" className="my-8 space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-2 text-xs tracking-widest text-accent">COMMENTARY · MEDIA</p>
          <h2 className="font-serif text-2xl font-semibold">
            {topicId ? '本专题时评' : '时评检索'}
          </h2>
        </div>
        <span className="text-sm text-muted-foreground">{visible.length} 篇</span>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        2026 年 7—10 月已发布文章。推荐理由与教学标签为本站整理；全文导入个人空间后使用。
      </p>
      <Input
        aria-label="搜索时评"
        placeholder="搜索标题、媒体、作者、议题…"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <div className="flex flex-wrap gap-3">
        <label className="text-sm">
          媒体{' '}
          <select
            aria-label="时评媒体"
            className="rounded-sm border bg-background p-2"
            value={media}
            onChange={(event) => setMedia(event.target.value)}
          >
            <option value="">全部媒体</option>
            {sources.map((source) => (
              <option key={source}>{source}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          月份{' '}
          <select
            aria-label="时评月份"
            className="rounded-sm border bg-background p-2"
            value={month}
            onChange={(event) => setMonth(event.target.value)}
          >
            <option value="">7—10 月</option>
            {['07', '08', '09', '10'].map((value) => (
              <option key={value} value={'2026-' + value}>
                {Number(value)} 月
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {visible.map((article) => (
          <article key={article.id} className="flex flex-col rounded-sm border bg-card p-5">
            <p className="text-xs text-muted-foreground">
              {article.source} · {article.publishedAt}
              {article.author ? ' · ' + article.author : ''}
            </p>
            <h3 className="my-3 font-serif text-lg font-semibold leading-relaxed">
              <a href={article.url} target="_blank" rel="noreferrer" className="hover:text-accent">
                {article.title}
              </a>
            </h3>
            <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
              {article.recommendation}
            </p>
            <p className="mb-4 text-xs text-accent">{article.writingTags.join(' · ')}</p>
            <div className="mt-auto flex flex-wrap gap-3">
              <Button asChild size="sm">
                <Link
                  to={
                    '/reading/import?' +
                    new URLSearchParams({
                      url: article.url,
                      ...(topicId ? { topic: topicId } : {}),
                    })
                  }
                >
                  导入我的阅读空间
                </Link>
              </Button>
              <a
                className="self-center text-sm text-accent underline"
                href={article.url}
                target="_blank"
                rel="noreferrer"
              >
                阅读原文
              </a>
            </div>
          </article>
        ))}
      </div>
      {!visible.length && (
        <p className="rounded-sm border border-dashed p-8 text-center text-sm text-muted-foreground">
          当前条件暂无收录，可调整筛选，或添加自己的时评。
        </p>
      )}
    </section>
  );
}
