// EXPORTS: IPerspective, IAcademicPaper, IEvent, IDailyKnowledge, IQuote, IPerspectiveSourceType

export type IPerspectiveSourceType = '史料记载' | '口述传统' | '考古发现' | '后世研究';

export interface IPerspective {
  id: string;
  role: string;
  title: string;
  description: string;
  quote?: string;
  translated?: boolean;
  source: string;
  sourceType: IPerspectiveSourceType;
  sourceUrl: string;
  original: string;
  locator: string;
  readingId?: string;
}

export interface IAcademicPaper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  venue: string;
  abstract: string;
  downloadUrl?: string;
  externalId?: string;
  pdfDownloadable?: boolean;
  doi?: string;
  publisherUrl?: string;
  cnkiUrl?: string;
  openAccessUrl?: string;
}

export interface IEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  category: string;
  summary: string;
  summarySources: { title: string; url: string }[];
  perspectives: IPerspective[];
  academicPapers: IAcademicPaper[];
  references: { title: string; url?: string }[];
}

export interface IMediaReference {
  title: string;
  source: string;
  excerpt: string;
  url?: string;
  date?: string;
}

export interface IDailyKnowledge {
  id: string;
  date: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  source: string;
  researchSource?: IResearchSource;
  mediaReferences?: IMediaReference[];
}

/** Bibliographic publication dates are distinct from the site's entry date. */
export interface IResearchSource {
  title: string;
  authors: string[];
  journal: string;
  year: number;
  volume?: number;
  issue: string;
  pages: string;
  url: string;
  fullTextUrl?: string;
}

export interface IQuote {
  id: string;
  text: string;
  author: string;
  source: string;
  context?: string;
  title?: string;
  sourceNote?: string;
  sourceUrl?: string;
  /** Catalogue aliases preserve old deep links without repeating a work. */
  canonicalId?: string;
  commentary?: {
    text: string;
    commentator: string;
    commentatorSource: string;
    status: 'verified';
    url: string;
    checkedAt: string;
  };
}

export interface IEssayMaterial {
  id: string;
  concept: string;
  category: string;
  description: string;
  applicableTopics: string[];
  references?: { title: string; url: string }[];
  materials: {
    title: string;
    content: string;
    source: string;
    usageHint?: string;
  }[];
}
