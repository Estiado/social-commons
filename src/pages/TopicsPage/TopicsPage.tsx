import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight, Sparkles } from 'lucide-react';
import { TOPIC_SPECIALS } from '@/data/topicSpecials';

export default function TopicsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {/* 页头 */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-accent" />
          <span className="text-xs tracking-[0.3em] text-muted-foreground uppercase">Topics · 专题</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-4">议论文专题</h1>
        <p className="text-muted-foreground max-w-2xl leading-relaxed">
          按高考常考话题整合素材——每个专题聚合相关时评、通识知识和名句，写作文时一站式找齐论据。
        </p>
      </div>

      {/* 专题卡片网格 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOPIC_SPECIALS.map((topic) => (
          <Link
            key={topic.id}
            to={`/topics/${topic.id}`}
            className={`group relative overflow-hidden border border-border/60 bg-card rounded-sm p-8 hover:border-accent/30 hover:shadow-lg transition-all duration-300 bg-gradient-to-br ${topic.color}`}
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-4 w-4 text-accent" />
                <span className="text-xs text-muted-foreground">{topic.relatedTags.length} 个话题标签</span>
              </div>
              <h2 className="font-serif text-2xl font-semibold mb-2 group-hover:text-accent transition-colors">
                {topic.name}
              </h2>
              <p className="text-sm text-muted-foreground mb-4">{topic.subtitle}</p>
              <p className="text-sm text-muted-foreground/80 leading-relaxed line-clamp-3 mb-6">
                {topic.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>{topic.relatedDailyIds.length} 条通识</span>
                  <span>{topic.relatedQuoteIds.length} 句名句</span>
                </div>
                <span className="flex items-center gap-1 text-sm text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                  进入专题 <ChevronRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 底部说明 */}
      <div className="mt-16 p-6 bg-muted/30 border border-border/40 rounded-sm">
        <p className="text-xs text-muted-foreground leading-relaxed">
          专题内容持续更新中。相关时评文章来自观澜库，通识知识来自日新，名句来自撷英。
          如需新增专题或调整内容，可在本地数据文件 <code className="bg-muted px-1.5 py-0.5 rounded">src/data/topicSpecials.ts</code> 中配置。
        </p>
      </div>
    </div>
  );
}
