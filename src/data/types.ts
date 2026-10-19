// EXPORTS: IPerspective, IAcademicPaper, IEvent, IDailyKnowledge, IQuote, IPerspectiveSourceType

export type IPerspectiveSourceType = '史料记载' | '口述传统' | '考古发现' | '后世研究';

export interface IPerspective {
  id: string;
  role: string;
  title: string;
  description: string;
  quote?: string;
  source: string;
  sourceType: IPerspectiveSourceType;
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
  perspectives: IPerspective[];
  academicPapers: IAcademicPaper[];
  references: { title: string; url?: string }[];
}

export interface IDailyKnowledge {
  id: string;
  date: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  source: string;
}

export interface IQuote {
  id: string;
  text: string;
  author: string;
  source: string;
  context?: string;
  commentary?: {
    text: string;
    commentator: string;
    commentatorSource: string;
  };
}

export interface IEssayMaterial {
  id: string;
  concept: string;
  category: string;
  description: string;
  applicableTopics: string[];
  materials: {
    title: string;
    content: string;
    source: string;
    usageHint?: string;
  }[];
}
