import type { IEssayMaterial } from '../types';
import type { EssayExample } from '../essayExamples';
import { CHOICE_STUDIES } from '../knowledge/choiceAndLabels.ts';

export const CHOICE_ESSAYS: IEssayMaterial[] = CHOICE_STUDIES.map((item) => ({
  id: item.conceptId,
  concept: item.concept,
  category: item.category,
  description: item.summary,
  applicableTopics: item.topics,
  references: [
    { title: item.sourceTitle, url: item.url },
    ...('references' in item ? item.references : []),
  ],
  materials: [],
}));
export const CHOICE_EXAMPLES: EssayExample[] = CHOICE_STUDIES.map((item) => ({
  id: 'example-' + item.id,
  conceptId: item.conceptId,
  title: item.title,
  content: item.content,
  source: item.sourceTitle,
  sourceUrl: item.url,
  usageHint: '',
}));
