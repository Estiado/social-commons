import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Landmark, Feather, BookOpen, ChevronRight, Tag } from 'lucide-react';
import { getTodayKnowledge } from '@/data/daily';
import { EVENTS } from '@/data/events';
import { QUOTE_CATALOGUE as QUOTES } from '@/data/quotes';
import { TOPIC_GROUPS } from '@/data/navigationTaxonomy';
import { GUANLAN_EVENTS } from '@/data/guanlan/catalogue';
import type { IQuote } from '@/data/types';
import { nameCatalogueReferences } from '@/features/reading/references';
import { readingTextSegments } from '@/features/reading/textSegments';
import BookContents from '@/features/book/BookContents';
// Keep the home preview short as the full event catalogue grows.
const latestEvents = [...GUANLAN_EVENTS]
  .sort((a, b) => b.sortDate.localeCompare(a.sortDate))
  .slice(0, 3);

export default function HomePage() {
  const todayKnowledge = getTodayKnowledge();
  const source = nameCatalogueReferences({ type: 'paragraph', text: todayKnowledge.source });
  const sourceRuns = readingTextSegments({ ...source, id: 'home-source' }, []);
  const [heroQuote] = useState<IQuote>(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
    );
    return QUOTES[dayOfYear % QUOTES.length];
  });
  return (
    <div>
      <BookContents />
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 pt-6 text-sm">
        <Link to="/briefing" className="min-h-11 py-3 text-accent underline underline-offset-4">
          阅读今日简报
        </Link>
        <Link to="/world" className="min-h-11 py-3 text-foreground underline underline-offset-4">
          知天下 · 长期事件时间线
        </Link>
      </div>
      {/* Hero 区 - 撷英 */}
      <section data-page-enter="section" className="relative overflow-hidden">
        <div className="relative mx-auto max-w-6xl px-6 py-10 md:py-16">
          <div className="max-w-3xl">
            <h2 className="mb-3 font-serif text-2xl font-semibold">今日摘读</h2>
            <p className="mb-8 text-sm text-muted-foreground">
              {new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}
            </p>
            <blockquote
              data-tour="home-quote"
              className="whitespace-pre-line font-serif text-2xl md:text-3xl font-medium leading-[1.8] text-foreground mb-6"
            >
              {heroQuote.text.length > 100 ? `${heroQuote.text.slice(0, 96)}……` : heroQuote.text}
            </blockquote>
            <Link
              className="mb-6 inline-block text-sm text-accent underline"
              to={`/quotes/${heroQuote.id}`}
            >
              阅读全文与有出处的解读
            </Link>
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-accent/60" />
              <div>
                <p className="font-serif text-base text-foreground">{heroQuote.author}</p>
                <p className="text-sm text-muted-foreground">{heroQuote.source}</p>
              </div>
            </div>
            {heroQuote.context && (
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {heroQuote.context}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 今日通识 */}
      <section data-page-enter="section" className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 data-tour="home-daily" className="font-serif text-2xl md:text-3xl font-semibold">
              今日日新
            </h2>
          </div>
          <Link
            to="/daily"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            全部通识 <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="group max-w-3xl">
          <Link to={`/daily/${todayKnowledge.id}`} className="block">
            <div className="flex items-start justify-between mb-4">
              <span className="paper-kicker">
                {todayKnowledge.category}
              </span>
              <span className="text-xs text-muted-foreground">{todayKnowledge.date}</span>
            </div>
            <h3 className="font-serif text-xl md:text-2xl font-semibold mb-3 group-hover:text-accent transition-colors">
              {todayKnowledge.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">{todayKnowledge.summary}</p>
          </Link>
          <p className="break-words text-xs leading-relaxed text-muted-foreground/70">
            来源：
            {sourceRuns.map((run, index) =>
              run.href ? (
                <a
                  key={index}
                  href={run.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent underline underline-offset-4"
                >
                  {run.text}
                </a>
              ) : (
                <span key={index}>{run.text}</span>
              ),
            )}
          </p>
        </div>
      </section>

      {/* 最新观澜 */}
      <section
        data-page-enter="section"
        className="mx-auto max-w-6xl px-6 py-16 border-t border-border/40"
      >
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2
              data-tour="home-commentaries"
              className="font-serif text-2xl md:text-3xl font-semibold"
            >
              事件精读
            </h2>
          </div>
          <Link
            to="/guanlan"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            走进观澜 <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
          {latestEvents.map((event) => (
            <Link
              key={event.id}
              to={'/guanlan/events/' + event.id}
              className="group block"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs leading-relaxed text-muted-foreground">
                  {event.dateLabel}
                </span>
              </div>
              <h3 className="font-serif text-lg font-semibold mb-2 group-hover:text-accent transition-colors line-clamp-2">
                {event.title}
              </h3>
              {event.summary && (
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                  {event.summary}
                </p>
              )}
              {event.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {event.keywords.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-muted/60 text-muted-foreground rounded-sm"
                    >
                      <Tag className="h-2.5 w-2.5" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* 热门话题 */}
      <section
        data-page-enter="section"
        className="mx-auto max-w-6xl px-6 py-16 border-t border-border/40"
      >
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 data-tour="home-topics" className="font-serif text-2xl md:text-3xl font-semibold">
              按话题读事件
            </h2>
          </div>
          <Link
            to="/guanlan"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            查看全部 <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TOPIC_GROUPS.map((topic) => (
            <Link
              key={topic.id}
              to={'/guanlan?group=' + topic.id}
              className="group block px-3 py-2 text-center hover:text-accent"
            >
              <p className="font-serif text-base font-medium group-hover:text-accent transition-colors">
                {topic.name}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 精选事件 */}
      <section
        data-page-enter="section"
        className="mx-auto max-w-6xl px-6 py-16 border-t border-border/40"
      >
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 data-tour="home-events" className="font-serif text-2xl md:text-3xl font-semibold">
              群鉴
            </h2>
          </div>
          <Link
            to="/events"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            全部事件 <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
          {EVENTS.slice(0, 3).map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="group block"
            >
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="paper-kicker">
                    {event.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{event.date}</span>
                </div>
                <h3 className="font-serif text-xl font-semibold mb-3 group-hover:text-accent transition-colors">
                  {event.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                  {event.summary}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>
                    {event.perspectives.length} 个视角 · {event.academicPapers.length} 篇文献
                  </span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">{event.location}</span>
                <span className="flex items-center gap-1 text-xs text-accent group-hover:underline">
                  进入精读 <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section
        aria-label="个人阅读与素材"
        className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-2 md:gap-10"
      >
        <Link
          data-tour="home-reading"
          to="/reading"
          className="group"
        >
          <h2 className="my-3 font-serif text-2xl font-semibold">把读过的文字，整理成自己的文稿</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            保存文章与划线，选择需要的材料，编辑后下载 Word 或 PDF。
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm text-accent group-hover:underline">
            打开阅读空间 <ArrowRight size={16} />
          </span>
        </Link>
        <Link
          data-tour="home-essay"
          to="/essay"
          className="group"
        >
          <h2 className="my-3 font-serif text-2xl font-semibold">
            从一个概念出发，积累有出处的材料
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            阅读概念与推荐示例，也可以添加自己的词条、标签和个人素材。
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm text-accent group-hover:underline">
            进入素材页 <ArrowRight size={16} />
          </span>
        </Link>
      </section>
      {/* 引导区 */}
      <section data-page-enter="section" className="mx-auto max-w-6xl px-6 py-16">
        <div className="text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
            读史使人明智，读诗使人灵秀
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
            在这里，每一个历史事件都不止一种叙述。我们汇集各方史料、学者论文与不同文明的视角，
            让你在比较中学会思考，在阅读中拓宽视野。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-sm text-sm font-medium hover:bg-accent transition-colors"
            >
              <Landmark className="h-4 w-4" />
              进入群鉴
            </Link>
            <Link
              to="/quotes"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-accent hover:underline"
            >
              <Feather className="h-4 w-4" />
              浏览撷英
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
