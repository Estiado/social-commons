import type { IEssayMaterial } from '../types';
import type { EssayExample } from '../essayExamples';
import { SOCIAL_EVIDENCE } from '../knowledge/socialEvidence.ts';

export const SOCIAL_ESSAYS: IEssayMaterial[] = SOCIAL_EVIDENCE.map((item) => ({
  id: item.conceptId,
  concept: item.concept,
  category: item.category,
  description: item.summary,
  applicableTopics: [...item.topics],
  materials: [],
  references: [{ title: item.sourceTitle, url: item.url }],
}));

export const SOCIAL_EXAMPLES: EssayExample[] = SOCIAL_EVIDENCE.map((item) => ({
  id: `example-${item.id}`,
  conceptId: item.conceptId,
  title: item.title,
  content: item.content,
  source: item.sourceTitle,
  sourceUrl: item.url,
  usageHint: '',
}));
