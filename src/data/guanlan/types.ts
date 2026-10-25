export interface GuanlanEventSummary {
  id: string;
  title: string;
  summary: string;
  question: string;
  /** Sorting follows the dated report/research named by dateLabel, not an invented event date. */
  sortDate: string;
  dateLabel: string;
  topicIds: string[];
  keywords: string[];
}

export interface EventSource {
  id: string;
  title: string;
  author: string;
  publication: string;
  date: string;
  kind: '报道' | '评论' | '研究' | '自述';
  url: string;
  description: string;
  /** Attributed reading notes, stored with the rest of the site's editorial copy. */
  digest: string[];
  /** Sources outside the supported extraction adapters start in the paste form. */
  importMode?: 'paste';
  fullText?: { title: string; url: string };
}

export interface EventSection {
  title: string;
  paragraphs: string[];
  sourceIds: string[];
}

export interface EventPerspective extends EventSection {
  level: '现象' | '社会' | '思想';
  keywords: string[];
  quote?: { text: string; sourceId: string; speaker: string };
}

export interface GuanlanEvent extends GuanlanEventSummary {
  recap: EventSection;
  background: EventSection;
  perspectives: EventPerspective[];
  /** These syntheses are signed by the editor, never attributed to a source author. */
  reconsiderations: EventSection[];
  sources: EventSource[];
  relatedDailyIds: string[];
  relatedQuoteIds: string[];
}
