import { useState } from 'react';
import { Calendar, BookOpen, ChevronDown, ChevronUp, Tag, Clock, Newspaper, ExternalLink } from 'lucide-react';
import { DAILY_KNOWLEDGE } from '@/data/daily';
import { Badge } from '@/components/ui/badge';

export default function DailyPage() {
  const [expandedId, setExpandedId] = useState<string | null>(DAILY_KNOWLEDGE[0]?.id || null);
  const [activePrimary, setActivePrimary] = useState<string>('全部');
  const [activeSub, setActiveSub] = useState<string>('全部');

  // 提取一级分类
  const primaryCategories = ['全部', ...Array.from(new Set(DAILY_KNOWLEDGE.map((d) => d.category.split(' · ')[0])))];

  // 提取当前一级分类下的二级标签
  const subCategories =
    activePrimary === '全部'
      ? []
      : ['全部', ...Array.from(new Set(DAILY_KNOWLEDGE.filter((d) => d.category.startsWith(activePrimary)).map((d) => d.category.split(' · ')[1] || d.category)))];

  // 筛选逻辑
  const filtered = DAILY_KNOWLEDGE.filter((d) => {
    if (activePrimary === '全部') return true;
    if (!d.category.startsWith(activePrimary)) return false;
    if (activeSub === '全部') return true;
    return d.category === `${activePrimary} · ${activeSub}`;
  });

  const handlePrimaryChange = (cat: string) => {
    setActivePrimary(cat);
    setActiveSub('全部');
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* 页头 */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-4 w-4 text-accent" />
          <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">Daily · 每日通识</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-3">每日知识</h1>
        <p className="text-muted-foreground max-w-2xl leading-relaxed">
          每天一个知识点，覆盖哲学、历史、经济、社会学、文学等领域。积跬步以至千里，每天拓宽一点点认知的边界。
        </p>
      </div>

      {/* 一级分类筛选 */}
      <div className="flex flex-wrap gap-2 mb-3">
        {primaryCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => handlePrimaryChange(cat)}
            className={`px-4 py-1.5 text-sm rounded-sm transition-colors ${
              activePrimary === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 二级分类筛选（仅当选中一级分类时显示） */}
      {subCategories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-10 pl-2 border-l-2 border-accent/20">
          <span className="text-xs text-muted-foreground mr-1">细分：</span>
          {subCategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSub(sub)}
              className={`px-3 py-1 text-xs rounded-sm transition-colors ${
                activeSub === sub
                  ? 'bg-accent/15 text-accent border border-accent/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {subCategories.length === 0 && <div className="mb-10" />}

      {/* 知识卡片列表 */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <article
              key={item.id}
              className="border border-border/60 bg-card rounded-sm overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="w-full text-left p-6 hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <Badge variant="outline" className="border-accent/30 text-accent">
                        <Tag className="h-3 w-3 mr-1" />
                        {item.category}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {item.date}
                      </span>
                    </div>
                    <h2 className="font-serif text-xl font-semibold mb-2">{item.title}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.summary}</p>
                  </div>
                  <div className="shrink-0 mt-1">
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </button>

              {/* 展开内容 */}
              {isExpanded && (
                <div className="px-6 pb-6 border-t border-border/40 pt-5">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-foreground/85 leading-relaxed whitespace-pre-line">
                      {item.content}
                    </p>
                  </div>

                  {/* 媒体引用栏目 */}
                  {item.mediaReferences && item.mediaReferences.length > 0 && (
                    <div className="mt-6 pt-5 border-t border-border/40">
                      <div className="flex items-center gap-2 mb-4">
                        <Newspaper className="h-4 w-4 text-accent" />
                        <span className="text-sm font-medium">主流媒体评论</span>
                        <span className="text-xs text-muted-foreground">（{item.mediaReferences.length} 条）</span>
                      </div>
                      <div className="space-y-3">
                        {item.mediaReferences.map((ref, idx) => (
                          <div key={idx} className="border border-border/40 bg-muted/20 rounded-sm p-4">
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="text-xs font-medium text-accent">{ref.source}</span>
                              {ref.date && <span className="text-xs text-muted-foreground">{ref.date}</span>}
                            </div>
                            <h4 className="text-sm font-medium mb-2">{ref.title}</h4>
                            <p className="text-xs text-foreground/75 leading-relaxed mb-2">{ref.excerpt}</p>
                            {ref.url && (
                              <a
                                href={ref.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
                              >
                                阅读原文 <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-5 pt-4 border-t border-border/40 flex items-center gap-2 text-xs text-muted-foreground">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>来源：{item.source}</span>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>该分类下暂无内容</p>
        </div>
      )}

      {/* 底部说明 */}
      <div className="mt-12 p-6 bg-muted/30 border border-border/40 rounded-sm">
        <p className="text-xs text-muted-foreground leading-relaxed">
          每日通识内容基于学术文献、权威著作和可靠资料整理。媒体评论栏目收录人民日报、南方周末等主流媒体的相关论述，供多视角参考。
          如需深入研究，建议查阅原始来源。内容持续更新中，更多学科领域的知识正在路上。
        </p>
      </div>
    </div>
  );
}
