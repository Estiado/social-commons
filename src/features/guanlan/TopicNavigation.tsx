import { Link, useSearchParams } from 'react-router-dom';
import { TOPIC_GROUPS } from '@/data/navigationTaxonomy';
import { TOPIC_SPECIALS } from '@/data/topicSpecials';

export function TopicNavigation() {
  const [params, setParams] = useSearchParams();
  const current = TOPIC_GROUPS.some((group) => group.id === params.get('group'))
    ? params.get('group')!
    : '';
  return (
    <nav aria-label="观澜主题" className="space-y-3 border-y py-4">
      <div className="flex flex-wrap gap-2">
        {[{ id: '', name: '全部' }, ...TOPIC_GROUPS].map((group) => (
          <button
            type="button"
            key={group.id}
            aria-pressed={current === group.id}
            onClick={() => setParams(group.id ? { group: group.id } : {}, { replace: true })}
            className={`rounded-sm px-3 text-sm ${current === group.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
          >
            {group.name}
          </button>
        ))}
      </div>
      <details>
        <summary className="text-sm text-muted-foreground">细分话题与既有资料</summary>
        <div className="grid gap-5 py-4 sm:grid-cols-2">
          {TOPIC_GROUPS.map((group) => (
            <section key={group.id}>
              <h2 className="mb-2 text-sm font-medium">{group.name}</h2>
              {TOPIC_SPECIALS.filter((topic) =>
                (group.topicIds as readonly string[]).includes(topic.id),
              ).map((topic) => (
                <Link
                  key={topic.id}
                  className="block py-2 text-sm text-accent underline"
                  to={'/guanlan/topics/' + topic.id}
                >
                  {topic.name}
                </Link>
              ))}
            </section>
          ))}
        </div>
      </details>
    </nav>
  );
}
