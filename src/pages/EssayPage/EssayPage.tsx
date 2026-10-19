import { useState } from 'react';
import { PenTool, Tag, Lightbulb, BookOpen, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { ESSAY_MATERIALS, getEssayCategories } from '@/data/essay';
import { Badge } from '@/components/ui/badge';

export default function EssayPage() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = getEssayCategories();
  const filtered =
    activeCategory === '全部'
      ? ESSAY_MATERIALS
      : ESSAY_MATERIALS.filter((m) => m.category.startsWith(activeCategory));

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* 页头 */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <PenTool className="h-4 w-4 text-accent" />
          <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">Essay · 议论文素材</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-3">高考议论文素材库</h1>
        <p className="text-muted-foreground max-w-2xl leading-relaxed">
          每个通识概念都可以成为议论文的优质素材。这里整理了概念的适用话题和素材框架，
          你可以从网上摘抄优秀文段填入，积累属于自己的素材库。
        </p>
      </div>

      {/* 分类筛选 */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 text-sm rounded-sm transition-colors ${
              activeCategory === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 概念列表 */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <article
              key={item.id}
              className="border border-border/60 bg-card rounded-sm overflow-hidden"
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
                      <span className="text-xs text-muted-foreground">
                        {item.materials.length} 条素材
                      </span>
                    </div>
                    <h2 className="font-serif text-xl font-semibold mb-2">{item.concept}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {item.applicableTopics.map((topic) => (
                        <span
                          key={topic}
                          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-muted/60 text-muted-foreground rounded-sm"
                        >
                          <Lightbulb className="h-3 w-3" />
                          {topic}
                        </span>
                      ))}
                    </div>
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

              {/* 展开的素材列表 */}
              {isExpanded && (
                <div className="px-6 pb-6 border-t border-border/40 pt-5">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium">素材列表</span>
                  </div>
                  <div className="space-y-4">
                    {item.materials.map((material, idx) => (
                      <div
                        key={idx}
                        className="border border-border/40 bg-muted/20 rounded-sm p-5"
                      >
                        <h3 className="font-serif text-base font-semibold mb-3">
                          {material.title}
                        </h3>
                        <p className="text-sm text-foreground/80 leading-relaxed mb-3 whitespace-pre-line">
                          {material.content}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            来源：{material.source}
                          </span>
                          {material.usageHint && (
                            <span className="flex items-center gap-1 text-accent/80">
                              <Lightbulb className="h-3 w-3" />
                              {material.usageHint}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 添加素材提示 */}
                  <div className="mt-5 p-4 border border-dashed border-border/60 rounded-sm">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">添加素材：</strong>
                      在 <code className="bg-muted px-1.5 py-0.5 rounded text-xs">src/data/essay.ts</code> 中
                      找到对应概念，在 <code className="bg-muted px-1.5 py-0.5 rounded text-xs">materials</code> 数组里
                      添加新对象即可。格式：<code className="bg-muted px-1.5 py-0.5 rounded text-xs">{'{ title, content, source, usageHint }'}</code>
                    </p>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <PenTool className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>该分类下暂无素材</p>
        </div>
      )}
    </div>
  );
}
