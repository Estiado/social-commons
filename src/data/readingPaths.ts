import { EDITORIAL } from '../../.artifacts/editorial/readingPaths.ts';

export interface ReadingPath {
  id: string;
  title: string;
  intro: string;
  connection: string;
  steps: readonly { id: string; note: string }[];
}

export const DAILY_READING_PATHS: readonly ReadingPath[] = [
  {
    id: 'choice',
    title: EDITORIAL['daily.choice.title'],
    intro: EDITORIAL['daily.choice.intro'],
    connection: EDITORIAL['daily.choice.connection'],
    steps: [
      { id: 'd140', note: EDITORIAL['daily.choice.step0'] },
      { id: 'd143', note: EDITORIAL['daily.choice.step1'] },
      { id: 'd147', note: EDITORIAL['daily.choice.step2'] },
    ],
  },
  {
    id: 'evidence',
    title: EDITORIAL['daily.evidence.title'],
    intro: EDITORIAL['daily.evidence.intro'],
    connection: EDITORIAL['daily.evidence.connection'],
    steps: [
      { id: 'd135', note: EDITORIAL['daily.evidence.step0'] },
      { id: 'd90', note: EDITORIAL['daily.evidence.step1'] },
      { id: 'd81', note: EDITORIAL['daily.evidence.step2'] },
    ],
  },
  {
    id: 'labels',
    title: EDITORIAL['daily.labels.title'],
    intro: EDITORIAL['daily.labels.intro'],
    connection: EDITORIAL['daily.labels.connection'],
    steps: [
      { id: 'd144', note: EDITORIAL['daily.labels.step0'] },
      { id: 'd145', note: EDITORIAL['daily.labels.step1'] },
      { id: 'd146', note: EDITORIAL['daily.labels.step2'] },
    ],
  },
  {
    id: 'learning',
    title: EDITORIAL['daily.learning.title'],
    intro: EDITORIAL['daily.learning.intro'],
    connection: EDITORIAL['daily.learning.connection'],
    steps: [
      { id: 'd89', note: EDITORIAL['daily.learning.step0'] },
      { id: 'd134', note: EDITORIAL['daily.learning.step1'] },
      { id: 'd86', note: EDITORIAL['daily.learning.step2'] },
    ],
  },
  {
    id: 'others',
    title: EDITORIAL['daily.others.title'],
    intro: EDITORIAL['daily.others.intro'],
    connection: EDITORIAL['daily.others.connection'],
    steps: [
      { id: 'd122', note: EDITORIAL['daily.others.step0'] },
      { id: 'd119', note: EDITORIAL['daily.others.step1'] },
      { id: 'd71', note: EDITORIAL['daily.others.step2'] },
    ],
  },
  {
    id: 'technology',
    title: EDITORIAL['daily.technology.title'],
    intro: EDITORIAL['daily.technology.intro'],
    connection: EDITORIAL['daily.technology.connection'],
    steps: [
      { id: 'd83', note: EDITORIAL['daily.technology.step0'] },
      { id: 'd85', note: EDITORIAL['daily.technology.step1'] },
      { id: 'd100', note: EDITORIAL['daily.technology.step2'] },
    ],
  },
];

export const HISTORY_READING_PATHS: readonly ReadingPath[] = [
  {
    id: 'progress',
    title: EDITORIAL['events.progress.title'],
    intro: EDITORIAL['events.progress.intro'],
    connection: EDITORIAL['events.progress.connection'],
    steps: [
      { id: 'industrial-revolution', note: EDITORIAL['events.progress.step0'] },
      { id: 'penicillin-discovery', note: EDITORIAL['events.progress.step1'] },
    ],
  },
  {
    id: 'exchange',
    title: EDITORIAL['events.exchange.title'],
    intro: EDITORIAL['events.exchange.intro'],
    connection: EDITORIAL['events.exchange.connection'],
    steps: [
      { id: 'silk-road', note: EDITORIAL['events.exchange.step0'] },
      { id: 'printing-connections', note: EDITORIAL['events.exchange.step1'] },
    ],
  },
  {
    id: 'investigation',
    title: EDITORIAL['events.investigation.title'],
    intro: EDITORIAL['events.investigation.intro'],
    connection: EDITORIAL['events.investigation.connection'],
    steps: [
      { id: 'snow-london-1854', note: EDITORIAL['events.investigation.step0'] },
      { id: 'eclipse-1919', note: EDITORIAL['events.investigation.step1'] },
      { id: 'lorenz-predictability', note: EDITORIAL['events.investigation.step2'] },
    ],
  },
  {
    id: 'rights',
    title: EDITORIAL['events.rights.title'],
    intro: EDITORIAL['events.rights.intro'],
    connection: EDITORIAL['events.rights.connection'],
    steps: [
      { id: 'enlightenment-18th', note: EDITORIAL['events.rights.step0'] },
      { id: 'seneca-falls-1848', note: EDITORIAL['events.rights.step1'] },
    ],
  },
];

// Editorial entry points only; all stable events stay in the searchable catalogue.
export const HISTORY_MAIN_IDS = [
  'industrial-revolution',
  'silk-road',
  'enlightenment-18th',
  'udhr-1948',
] as const;
