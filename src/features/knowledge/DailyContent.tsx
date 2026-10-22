import type { IDailyKnowledge } from '@/data/types';

export function DailyContent({ item }: { item: IDailyKnowledge }) {
  return (
    <div className="space-y-6">
      <p className="font-serif leading-loose whitespace-pre-line">{item.content}</p>
      {!!item.mediaReferences?.length && (
        <section aria-label="延伸阅读" className="space-y-4">
          <h2 className="font-serif text-xl font-semibold">延伸阅读</h2>
          {item.mediaReferences.map((reference, index) => (
            <article className="rounded-sm border p-5" key={index}>
              <h3 className="font-medium">{reference.title}</h3>
              <p className="my-2 text-xs text-muted-foreground">
                {reference.source}
                {reference.date ? ` · ${reference.date}` : ''}
              </p>
              <p className="text-sm leading-relaxed">{reference.excerpt}</p>
              {reference.url && (
                <a
                  href={reference.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm text-accent underline"
                >
                  查看出处
                </a>
              )}
            </article>
          ))}
        </section>
      )}
      <p className="border-t pt-4 text-sm text-muted-foreground">参考资料：{item.source}</p>
    </div>
  );
}
