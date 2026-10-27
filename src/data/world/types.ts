export interface WorldStorySummary {
  id: string;
  title: string;
  summary: string;
  category: '冲突与和平' | '全球行动' | '社会与公共生活';
  period: string;
  updatedAt: string;
  latestEventDate: string;
  keywords: string[];
}

export interface WorldSource {
  id: string;
  title: string;
  publication: string;
  date: string;
  url: string;
  author?: string;
}

export interface WorldExplanation {
  title: string;
  paragraphs: string[];
  sourceIds: string[];
}

/** A short verbatim passage; the quote and source locator stay outside editorial prose. */
export interface WorldExcerpt {
  text: string;
  sourceId: string;
  locator: string;
}

export interface WorldTimelinePoint {
  id: string;
  /** Sort key; dateLabel preserves the source's actual day/month/year precision. */
  date: string;
  dateLabel: string;
  title: string;
  what: string[];
  why: string;
  sourceIds: string[];
}

export interface WorldStory extends WorldStorySummary {
  intro: string[];
  context: WorldExplanation[];
  excerpts: WorldExcerpt[];
  latest: string[];
  terms: { term: string; definition: string }[];
  timeline: WorldTimelinePoint[];
  perspectives: { title: string; paragraphs: string[]; sourceIds: string[] }[];
  questions: WorldExplanation[];
  watch: string[];
  sources: WorldSource[];
  relatedEventIds: string[];
}
