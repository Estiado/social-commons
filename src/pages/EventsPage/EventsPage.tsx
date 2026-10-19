import { Link } from 'react-router-dom';
import { Landmark, BookOpen, MapPin, Calendar, ArrowRight, Search } from 'lucide-react';
import { useState } from 'react';
import { EVENTS } from '@/data/events';

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = EVENTS.filter(
    (e) =>
      e.title.includes(searchQuery) ||
      e.summary.includes(searchQuery) ||
      e.category.includes(searchQuery)
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {/* 页头 */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Landmark className="h-4 w-4 text-accent" />
          <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">Events · 事件精读</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-3">多视角读史</h1>
        <p className="text-muted-foreground max-w-2xl leading-relaxed">
          每一个历史事件都不止一种叙述。这里汇集各方史料记载、原住民口述传统、后世学者研究，
          让你在比较中理解历史的复杂性。
        </p>
      </div>

      {/* 搜索框 */}
      <div className="relative mb-10 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="搜索事件、关键词..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-border bg-card rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent/50 transition-colors"
        />
      </div>

      {/* 事件列表 */}
      <div className="space-y-6">
        {filtered.map((event) => (
          <Link
            key={event.id}
            to={`/events/${event.id}`}
            className="group block border border-border/60 bg-card rounded-sm overflow-hidden hover:border-accent/30 transition-all duration-300 hover:shadow-md"
          >
            <div className="p-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="inline-block px-3 py-1 text-xs font-medium bg-accent/10 text-accent rounded-sm">
                  {event.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {event.date}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {event.location}
                </span>
              </div>
              <h2 className="font-serif text-xl md:text-2xl font-semibold mb-3 group-hover:text-accent transition-colors">
                {event.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-5">{event.summary}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5" />
                    {event.perspectives.length} 个视角
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Landmark className="h-3.5 w-3.5" />
                    {event.academicPapers.length} 篇学术文献
                  </span>
                </div>
                <span className="flex items-center gap-1 text-sm text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                  进入精读 <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <Landmark className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>未找到匹配的事件</p>
        </div>
      )}
    </div>
  );
}
