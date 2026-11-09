import { DAILY_KNOWLEDGE } from '../../data/daily.ts';
import { QUOTE_CATALOGUE } from '../../data/quotes.ts';
import { GUANLAN_EVENTS } from '../../data/guanlan/catalogue.ts';
import { WORLD_STORIES } from '../../data/world/catalogue.ts';
import { chinaDay, dayNumber } from './calendar.ts';

// News remains dated source material, not automatically generated breaking news.
const news = [
  ...WORLD_STORIES.map((item) => ({
    id: 'world-' + item.id,
    title: item.title,
    text: item.summary,
    date: item.latestEventDate,
    path: '/world/' + item.id,
    source: '知天下 · 事件脉络',
  })),
  ...GUANLAN_EVENTS.filter((item) => item.sortDate >= '2026-07-01').map((item) => ({
    id: item.id,
    title: item.title,
    text: item.summary,
    date: item.sortDate,
    path: '/guanlan/events/' + item.id,
    source: '观澜 · 事件精读',
  })),
].sort((a, b) => b.date.localeCompare(a.date));
// Complete, sourced classical works; no clipping a long poem into a single slogan.
const poems = QUOTE_CATALOGUE.filter((item) => /^q1(?:0\d|1[0-8])$/u.test(item.id));
const concepts = DAILY_KNOWLEDGE.filter((item) => /^d1(?:1[5-9]|[234]\d|50)$/u.test(item.id));
const newsDates = [...new Set(news.map((item) => item.date))].sort();

function newsForDay(day: string, dayIndex: number) {
  let available: typeof news = [];
  let anchor = 0;
  let offset = 0;
  for (const date of newsDates) {
    if (date > day) break;
    const start = dayNumber(date);
    const previous = available.length
      ? available[(start - anchor - 1 + offset) % available.length]
      : undefined;
    available = news.filter((item) => item.date <= date).slice(0, 5);
    anchor = start;
    // Start each updated pool with its newest story unless readers saw it yesterday.
    offset = available.length > 1 && available[0].id === previous?.id ? 1 : 0;
  }
  return available.length ? available[(dayIndex - anchor + offset) % available.length] : undefined;
}

export function briefingEdition(day = chinaDay()) {
  const number = dayNumber(day);
  // Keep the digest tied to the newest editorial material. Older July stories
  // remain in Guanlan, rather than filling today's news slot merely by rotation.
  const article = newsForDay(day, number);
  if (!article || !poems.length || !concepts.length)
    throw new Error('这个日期尚无简报内容');
  const pick = <T>(items: T[]) => items[((number % items.length) + items.length) % items.length];
  return {
    day,
    news: article,
    quote: pick(poems),
    concept: pick(concepts),
  };
}

export type BriefingEdition = ReturnType<typeof briefingEdition>;
