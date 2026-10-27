export interface WorldStorySummary {
  id: string;
  title: string;
  summary: string;
  category: '冲突与和平' | '全球行动';
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
  latest: string[];
  terms: { term: string; definition: string }[];
  timeline: WorldTimelinePoint[];
  perspectives: { title: string; paragraphs: string[]; sourceIds: string[] }[];
  watch: string[];
  sources: WorldSource[];
  relatedEventIds: string[];
}
