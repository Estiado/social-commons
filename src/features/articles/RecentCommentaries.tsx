import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CURATED_COMMENTARIES, recentCommentaries, type CuratedCommentary } from '@/data/curatedCommentaries';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export function RecentCommentaries() {
  const [catalogue, setCatalogue] = useState(CURATED_COMMENTARIES);
  const [archive, setArchive] = useState(false); const [filter, setFilter] = useState('');
  useEffect(() => {
    if (!supabase) return;
    let active = true;
    supabase.from('reading_catalogue').select('id,title,url,source,author,published_at,checked_at,recommendation,writing_tags,general_tags,verification_url')
      .eq('status', 'published').order('published_at', { ascending: false }).limit(50).then(({ data, error }) => {
        if (!active || error || !data?.length) return;
        setCatalogue(data.map((item) => ({ id: item.id, title: item.title, url: item.url, source: item.source, author: item.author,
          publishedAt: item.published_at, checkedAt: item.checked_at, recommendation: item.recommendation, writingTags: item.writing_tags, generalTags: item.general_tags, verificationUrl: item.verification_url })) as CuratedCommentary[]);
      });
    return () => { active = false; };
  }, []);
  const articles = useMemo(() => (archive ? catalogue : recentCommentaries(catalogue)).filter((item) => !filter || item.source === filter), [catalogue, archive, filter]);
  return <section className="mb-10 rounded-sm border border-accent/20 p-5" aria-label="近期时评精选">
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-serif text-xl font-semibold">近期时评精选</h2><button className="text-xs text-accent underline" onClick={() => setArchive(!archive)}>{archive ? '只看最近 30 天' : '查看往期精选'}</button></div>
    <p className="my-3 text-sm text-muted-foreground">围绕近期议题选材，兼顾议论文写作与通识阅读。推荐理由和教学标签由本站编辑整理。</p>
    <div className="mb-5 flex flex-wrap gap-2"><Button size="sm" variant={!filter ? 'default' : 'outline'} onClick={() => setFilter('')}>全部</Button>{[...new Set(catalogue.map((item) => item.source))].map((source) => <Button size="sm" key={source} variant={filter === source ? 'default' : 'outline'} onClick={() => setFilter(source)}>{source}</Button>)}</div>
    {!articles.length && <p className="py-5 text-sm text-muted-foreground">该范围暂无已核验的近期文章，可查看往期精选或导入自己的文章。</p>}
    <div className="grid gap-4 md:grid-cols-2">{articles.map((article) => <article key={article.id} className="rounded-sm border bg-card p-4">
      <p className="text-xs text-muted-foreground">{article.source} · {article.publishedAt}{article.author ? ` · ${article.author}` : ''}</p>
      <h3 className="my-3 font-serif font-semibold leading-relaxed"><a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent">{article.title}</a></h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{article.recommendation}</p>
      <p className="mt-3 text-xs text-muted-foreground">写作：{article.writingTags.join(' / ')}<br />通识：{article.generalTags.join(' / ')}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3"><Button size="sm" variant="outline" asChild><Link to={`/reading/import?${new URLSearchParams({ url: article.url })}`}>导入我的阅读空间</Link></Button><a className="text-xs text-accent underline" href={article.url} target="_blank" rel="noopener noreferrer">查看原文</a>{article.verificationUrl && <a className="text-xs text-accent underline" href={article.verificationUrl} target="_blank" rel="noopener noreferrer">媒体刊载核验页</a>}</div>
    </article>)}</div>
  </section>;
}
