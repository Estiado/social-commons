import type { IEssayMaterial } from '../types';
import type { EssayExample } from '../essayExamples';
import { LEARNING_AND_CULTURE } from '../knowledge/learningAndCulture.ts';

export const LEARNING_ESSAYS: IEssayMaterial[] = LEARNING_AND_CULTURE.map((item) => ({
  id: item.conceptId,
  concept: item.concept,
  category: item.category,
  description: item.summary,
  applicableTopics: [...item.topics],
  references: [{ title: item.sourceTitle, url: item.url }],
  materials: [],
}));

export const LEARNING_EXAMPLES: EssayExample[] = LEARNING_AND_CULTURE.map((item) => ({
  id: `example-${item.id}`,
  conceptId: item.conceptId,
  title: item.title,
  content: item.content,
  source: item.sourceTitle,
  sourceUrl: item.url,
  usageHint: '',
}));
