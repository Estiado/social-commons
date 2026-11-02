import { Link } from 'react-router-dom';
import type { ReadingPath } from '@/data/readingPaths';

type ReadingItem = { id: string; title: string };

/** A short ordered reading list; article text remains in the original reader. */
export function ReadingPathSection({
  path,
  paths,
  items,
  basePath,
  onSelect,
  weekly,
}: {
  path: ReadingPath;
  paths: readonly ReadingPath[];
  items: ReadonlyMap<string, ReadingItem>;
  basePath: '/daily' | '/events';
  onSelect(id: string): void;
  weekly: boolean;
}) {
  return (
    <section aria-labelledby="reading-path-title" className="my-8 border-y py-7 sm:py-8">
      <h2
        id="reading-path-title"
        className="font-serif text-2xl font-semibold leading-relaxed sm:text-3xl"
      >
        {path.title}
      </h2>
      <p className="mt-3 text-sm text-muted-foreground">
        {weekly ? '本周推荐' : '当前阅读线'}，共 {path.steps.length} 篇。按顺序读，也可以只选一篇。
      </p>
      <p className="mt-4 max-w-prose leading-8">{path.intro}</p>
      <ol className="my-5 divide-y">
        {path.steps.map((step, index) => {
          const item = items.get(step.id);
          if (!item) return null;
          return (
            <li key={step.id} className="py-4">
              <Link
                to={`${basePath}/${item.id}?path=${path.id}`}
                className="inline-block py-1 font-serif text-lg font-semibold leading-relaxed underline decoration-border underline-offset-4 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                {index + 1}. {item.title}
              </Link>
              <p className="mt-2 max-w-prose text-sm leading-7 text-muted-foreground">
                {step.note}
              </p>
            </li>
          );
        })}
      </ol>
      <p className="max-w-prose leading-8">{path.connection}</p>
      <label className="mt-6 flex flex-wrap items-center gap-3 text-sm">
        换一条阅读线
        <select
          value={path.id}
          onChange={(event) => onSelect(event.target.value)}
          className="min-h-11 w-full max-w-full rounded-sm border bg-background px-3 sm:w-auto sm:max-w-md"
        >
          {paths.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
      </label>
    </section>
  );
}

export function ReadingPathNavigation({
  path,
  id,
  basePath,
  items,
}: {
  path: ReadingPath;
  id: string;
  basePath: '/daily' | '/events';
  items: ReadonlyMap<string, ReadingItem>;
}) {
  const position = path.steps.findIndex((step) => step.id === id);
  if (position < 0) return null;
  return (
    <nav aria-label="接着阅读" className="mt-10 border-t pt-6">
      <h2 className="font-serif text-xl font-semibold">把这篇放回一起读</h2>
      <Link
        to={`${basePath}?path=${path.id}`}
        className="mt-3 inline-block py-2 text-accent underline underline-offset-4"
      >
        {path.title}
      </Link>
      <p className="my-3 leading-8">{path.connection}</p>
      <ul className="space-y-3">
        {path.steps
          .filter((step) => step.id !== id)
          .map((step) => (
            <li key={step.id}>
              <Link
                to={`${basePath}/${step.id}?path=${path.id}`}
                className="inline-block py-2 font-medium underline underline-offset-4 hover:text-accent"
              >
                {items.get(step.id)?.title}
              </Link>
              <p className="text-sm leading-7 text-muted-foreground">{step.note}</p>
            </li>
          ))}
      </ul>
    </nav>
  );
}
