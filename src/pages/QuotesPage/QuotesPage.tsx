import { useState } from 'react';
import { Feather, RefreshCw, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { QUOTES } from '@/data/quotes';
import type { IQuote } from '@/data/types';

export default function QuotesPage() {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    return dayOfYear % QUOTES.length;
  });
  const [isAnimating, setIsAnimating] = useState(false);

  const current: IQuote = QUOTES[currentIndex];

  const goTo = (index: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((index + QUOTES.length) % QUOTES.length);
      setIsAnimating(false);
    }, 200);
  };

  const randomQuote = () => {
    let next = Math.floor(Math.random() * QUOTES.length);
    if (next === currentIndex) next = (next + 1) % QUOTES.length;
    goTo(next);
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* 页头 */}
      <div className="mb-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Feather className="h-4 w-4 text-accent" />
          <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">Quote of the Day · 每日一句</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-3">句读</h1>
        <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
          一句话，一个世界。在文字的微光里，感受文学的温度与思想的重量。
        </p>
      </div>

      {/* 主卡片 */}
      <div className="relative mb-8">
        {/* 装饰性背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent rounded-sm" />

        <div className="relative border border-border/60 bg-card rounded-sm p-10 md:p-16 min-h-[400px] flex flex-col justify-center">
          {/* 大引号装饰 */}
          <div className="absolute top-6 left-8 font-serif text-8xl text-accent/10 leading-none select-none">
            "
          </div>

          <div
            className={`transition-opacity duration-200 ${
              isAnimating ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <blockquote className="font-serif text-2xl md:text-3xl font-medium leading-relaxed text-foreground mb-10 relative z-10">
              {current.text}
            </blockquote>

            <div className="flex items-center gap-4 relative z-10">
              <div className="h-px w-16 bg-accent/50" />
              <div>
                <p className="font-serif text-lg font-medium text-foreground">{current.author}</p>
                <p className="text-sm text-muted-foreground">{current.source}</p>
              </div>
            </div>

            {current.context && (
              <p className="mt-8 text-sm text-muted-foreground leading-relaxed border-l-2 border-accent/30 pl-4 relative z-10 max-w-xl">
                {current.context}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="flex items-center justify-center gap-4 mb-12">
        <button
          onClick={() => goTo(currentIndex - 1)}
          className="flex items-center gap-2 px-5 py-2.5 border border-border rounded-sm text-sm hover:border-accent hover:text-accent transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          上一句
        </button>
        <button
          onClick={randomQuote}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-sm text-sm hover:bg-accent transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          随机一句
        </button>
        <button
          onClick={() => goTo(currentIndex + 1)}
          className="flex items-center gap-2 px-5 py-2.5 border border-border rounded-sm text-sm hover:border-accent hover:text-accent transition-colors"
        >
          下一句
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* 进度指示 */}
      <div className="flex items-center justify-center gap-2 mb-12">
        <span className="text-xs text-muted-foreground">
          {currentIndex + 1} / {QUOTES.length}
        </span>
      </div>

      {/* 全部句子列表 */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="h-4 w-4 text-accent" />
          <h2 className="font-serif text-xl font-semibold">全部句读</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {QUOTES.map((quote, index) => (
            <button
              key={quote.id}
              onClick={() => goTo(index)}
              className={`text-left p-5 border rounded-sm transition-all duration-200 ${
                index === currentIndex
                  ? 'border-accent/50 bg-accent/5'
                  : 'border-border/60 bg-card hover:border-accent/30'
              }`}
            >
              <p className="font-serif text-sm leading-relaxed text-foreground/85 mb-2 line-clamp-2">
                "{quote.text}"
              </p>
              <p className="text-xs text-muted-foreground">
                —— {quote.author}《{quote.source}》
              </p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
