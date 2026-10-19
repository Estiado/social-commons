import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Landmark, Feather, BookOpen, ChevronRight } from 'lucide-react';
import { getTodayKnowledge } from '@/data/daily';
import { EVENTS } from '@/data/events';
import { QUOTES } from '@/data/quotes';
import type { IQuote } from '@/data/types';

export default function HomePage() {
  const todayKnowledge = getTodayKnowledge();
  const [heroQuote] = useState<IQuote>(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    return QUOTES[dayOfYear % QUOTES.length];
  });

  return (
    <div>
      {/* Hero 区 - 每日一句 */}
      <section className="relative overflow-hidden">
        {/* 宣纸纹理背景 */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-32">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-8">
              <Feather className="h-4 w-4 text-accent" />
              <span className="text-xs tracking-[0.3em] text-muted-foreground uppercase">
                今日一句 · {new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}
              </span>
            </div>
            <blockquote className="font-serif text-3xl md:text-5xl font-medium leading-relaxed text-foreground mb-8">
              "{heroQuote.text}"
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-accent/60" />
              <div>
                <p className="font-serif text-base text-foreground">{heroQuote.author}</p>
                <p className="text-sm text-muted-foreground">{heroQuote.source}</p>
              </div>
            </div>
            {heroQuote.context && (
              <p className="mt-6 text-sm text-muted-foreground max-w-xl leading-relaxed border-l-2 border-accent/30 pl-4">
                {heroQuote.context}
              </p>
            )}
          </div>
        </div>
        {/* 底部渐变分隔 */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </section>

      {/* 今日通识 */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-accent" />
              <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">Today · 每日通识</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold">今日知识</h2>
          </div>
          <Link
            to="/daily"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            全部通识 <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <Link to="/daily" className="block group">
          <div className="border border-border/60 bg-card p-8 md:p-10 rounded-sm hover:border-accent/30 transition-all duration-300 hover:shadow-md">
            <div className="flex items-start justify-between mb-4">
              <span className="inline-block px-3 py-1 text-xs font-medium bg-accent/10 text-accent rounded-sm">
                {todayKnowledge.category}
              </span>
              <span className="text-xs text-muted-foreground">{todayKnowledge.date}</span>
            </div>
            <h3 className="font-serif text-xl md:text-2xl font-semibold mb-3 group-hover:text-accent transition-colors">
              {todayKnowledge.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">{todayKnowledge.summary}</p>
            <p className="text-xs text-muted-foreground/70">来源：{todayKnowledge.source}</p>
          </div>
        </Link>
      </section>

      {/* 精选事件 */}
      <section className="mx-auto max-w-6xl px-6 py-16 border-t border-border/40">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Landmark className="h-4 w-4 text-accent" />
              <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">Featured · 事件精读</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold">多视角读史</h2>
          </div>
          <Link
            to="/events"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            全部事件 <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {EVENTS.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="group block border border-border/60 bg-card rounded-sm overflow-hidden hover:border-accent/30 transition-all duration-300 hover:shadow-md"
            >
              <div className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-sm">
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
                  <span>{event.perspectives.length} 个视角 · {event.academicPapers.length} 篇文献</span>
                </div>
              </div>
              <div className="px-8 py-3 bg-muted/30 border-t border-border/40 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{event.location}</span>
                <span className="flex items-center gap-1 text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                  进入精读 <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 引导区 */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="border border-border/60 bg-card p-10 md:p-14 rounded-sm text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative">
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
                开始事件精读
              </Link>
              <Link
                to="/quotes"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-sm text-sm font-medium hover:border-accent hover:text-accent transition-colors"
              >
                <Feather className="h-4 w-4" />
                浏览每日一句
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
