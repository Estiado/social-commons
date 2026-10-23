import { useParams, Link } from 'react-router-dom';
import { getEventById } from '@/data/events';
import { ContentReader } from '@/features/reading/ContentReader';

export default function EventDetailPage() {
  const { id = '' } = useParams();
  const event = getEventById(id);
  return (
    <article className="mx-auto max-w-4xl px-6 py-12">
      <Link to="/events" className="mb-7 inline-block text-sm text-accent underline">
        返回群鉴
      </Link>
      {event ? (
        <>
          <p className="mb-3 text-sm text-muted-foreground">{event.category}</p>
          <h1 className="mb-8 font-serif text-3xl font-semibold leading-relaxed">{event.title}</h1>
          <ContentReader kind="event" id={id} />
          {event.academicPapers.length > 0 && (
            <section className="mt-10 border-t pt-6" aria-label="文献检索">
              <h2 className="mb-4 font-serif text-xl">核对文献出处</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                以下链接用于检索原始出版物。本站未接入文献下载服务，不将检索条目标为可直接下载的论文。
              </p>
              <ul className="space-y-3">
                {event.academicPapers.map((paper) => (
                  <li key={paper.id}>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-accent underline"
                      href={
                        paper.publisherUrl ||
                        paper.downloadUrl ||
                        (paper.doi
                          ? `https://doi.org/${paper.doi}`
                          : `https://scholar.google.com/scholar?q=${encodeURIComponent(paper.title)}`)
                      }
                    >
                      {paper.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      ) : (
        <h1>未找到这个历史词条</h1>
      )}
    </article>
  );
}
