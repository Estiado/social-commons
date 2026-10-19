import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText, User, Calendar, MapPin, BookOpen, Quote, ExternalLink, Search, GraduationCap } from 'lucide-react';
import { getEventById } from '@/data/events';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const event = id ? getEventById(id) : undefined;

  if (!event) {
    return <Navigate to="/events" replace />;
  }

  const handleDownload = (paperId: string) => {
    // 模拟下载 - 实际项目中可调用baixiao_get_pdf获取下载链接
    alert(`文献 "${paperId}" 的PDF下载功能：在完整版本中，将通过百晓智能API获取公开文献的下载链接。版权受限文献将引导至原平台获取。`);
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* 返回链接 */}
      <Link
        to="/events"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        返回事件列表
      </Link>

      {/* 事件头部 */}
      <header className="mb-12">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge variant="outline" className="border-accent/30 text-accent">
            {event.category}
          </Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" /> {event.date}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" /> {event.location}
          </span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold leading-tight mb-6">
          {event.title}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">{event.summary}</p>
      </header>

      <Separator className="mb-12" />

      {/* 多视角 Tab */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="h-5 w-5 text-accent" />
          <h2 className="font-serif text-2xl font-semibold">多方视角</h2>
          <span className="text-sm text-muted-foreground">（{event.perspectives.length} 个视角）</span>
        </div>

        <Tabs defaultValue={event.perspectives[0]?.id} className="w-full">
          <TabsList className="flex flex-wrap h-auto gap-1 bg-transparent border-b border-border/60 rounded-none p-0 mb-8">
            {event.perspectives.map((p) => (
              <TabsTrigger
                key={p.id}
                value={p.id}
                className="data-[state=active]:bg-transparent data-[state=active]:text-accent data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium transition-colors"
              >
                {p.role}
              </TabsTrigger>
            ))}
          </TabsList>

          {event.perspectives.map((p) => (
            <TabsContent key={p.id} value={p.id} className="mt-0">
              <div className="border border-border/60 bg-card p-8 rounded-sm">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-serif text-xl font-semibold">{p.title}</h3>
                  <Badge variant="secondary" className="shrink-0 ml-4">
                    {p.sourceType}
                  </Badge>
                </div>

                <p className="text-muted-foreground leading-relaxed mb-6">{p.description}</p>

                {p.quote && (
                  <div className="border-l-2 border-accent/40 bg-accent/5 pl-6 pr-4 py-4 my-6">
                    <Quote className="h-4 w-4 text-accent mb-2" />
                    <p className="font-serif text-base italic leading-relaxed text-foreground/90">
                      "{p.quote}"
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4 border-t border-border/40">
                  <User className="h-3 w-3" />
                  <span>来源：{p.source}</span>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* 学术论文 */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="h-5 w-5 text-accent" />
          <h2 className="font-serif text-2xl font-semibold">学术文献</h2>
          <span className="text-sm text-muted-foreground">（{event.academicPapers.length} 篇）</span>
        </div>

        <div className="space-y-4">
          {event.academicPapers.map((paper) => (
            <div
              key={paper.id}
              className="border border-border/60 bg-card p-6 rounded-sm hover:border-accent/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-serif text-lg font-semibold mb-2">{paper.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" /> {paper.authors.join('、')}
                    </span>
                    <span>·</span>
                    <span>{paper.year}</span>
                    <span>·</span>
                    <span className="italic">{paper.venue}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{paper.abstract}</p>

                  {/* 多渠道获取入口 */}
                  <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border/40">
                    {paper.downloadUrl && (
                      <a
                        href={paper.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-accent/10 text-accent rounded-sm hover:bg-accent/20 transition-colors"
                      >
                        <Download className="h-3 w-3" />
                        开放获取PDF
                      </a>
                    )}
                    {paper.pdfDownloadable && (
                      <button
                        onClick={() => handleDownload(paper.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-accent/10 text-accent rounded-sm hover:bg-accent/20 transition-colors"
                      >
                        <Download className="h-3 w-3" />
                        百晓语料库下载
                      </button>
                    )}
                    {paper.publisherUrl && (
                      <a
                        href={paper.publisherUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border text-muted-foreground rounded-sm hover:border-accent/50 hover:text-accent transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        出版社官网
                      </a>
                    )}
                    {paper.doi && (
                      <a
                        href={`https://doi.org/${paper.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border text-muted-foreground rounded-sm hover:border-accent/50 hover:text-accent transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        DOI: {paper.doi}
                      </a>
                    )}
                    <a
                      href={`https://kns.cnki.net/kns8s/defaultresult/index?kw=${encodeURIComponent(paper.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border text-muted-foreground rounded-sm hover:border-accent/50 hover:text-accent transition-colors"
                    >
                      <Search className="h-3 w-3" />
                      知网检索
                    </a>
                    <a
                      href={`https://scholar.google.com/scholar?q=${encodeURIComponent(paper.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border text-muted-foreground rounded-sm hover:border-accent/50 hover:text-accent transition-colors"
                    >
                      <GraduationCap className="h-3 w-3" />
                      Google Scholar
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 下载说明 */}
        <div className="mt-6 p-4 bg-muted/40 border border-border/40 rounded-sm">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">文献获取说明：</strong>
            每篇文献提供多种获取渠道——"开放获取PDF"指向出版社或学术机构的免费全文；
            "百晓语料库下载"通过百晓智能获取公开文献；"出版社官网"和"DOI"指向原始出版平台；
            "知网检索"和"Google Scholar"可查找中文及英文文献的更多版本。
            版权受限的文献请通过所在机构图书馆或出版社正式渠道获取。所有引用请注明原始出处。
          </p>
        </div>
      </section>

      {/* 参考资料 */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="h-5 w-5 text-accent" />
          <h2 className="font-serif text-2xl font-semibold">参考资料</h2>
        </div>
        <ul className="space-y-2">
          {event.references.map((ref, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
              <span className="text-accent font-serif shrink-0">[{idx + 1}]</span>
              <span>{ref.title}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 底部导航 */}
      <div className="flex justify-between items-center pt-8 border-t border-border/60">
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          浏览更多事件
        </Link>
        <Link
          to="/daily"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
        >
          今日通识
          <ArrowLeft className="h-4 w-4 rotate-180" />
        </Link>
      </div>
    </div>
  );
}
