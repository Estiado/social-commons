import { Fragment } from 'react';
import { searchRanges } from './searchIndex';

export function SearchText({ text, query }: { text: string; query: string }) {
  const ranges = searchRanges(text, query);
  const pieces = ranges.map((range, index) => {
    const before = text.slice(ranges[index - 1]?.end ?? 0, range.start);
    return (
      <Fragment key={range.start}>
        {before}
        <mark className="bg-sky-100 text-inherit">{text.slice(range.start, range.end)}</mark>
      </Fragment>
    );
  });
  return (
    <>
      {pieces}
      {text.slice(ranges.at(-1)?.end ?? 0)}
    </>
  );
}
