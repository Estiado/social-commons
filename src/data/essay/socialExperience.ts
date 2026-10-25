import type { IEssayMaterial } from '../types';
import type { EssayExample } from '../essayExamples';
import { SOCIAL_EXPERIENCES } from '../knowledge/socialExperience.ts';
import { researchCitation } from '../knowledge/youthStudies.ts';

export const EXPERIENCE_ESSAYS: IEssayMaterial[] = SOCIAL_EXPERIENCES.map((item) => ({
  id: item.conceptId,
  concept: item.concept,
  category: item.category,
  description: item.summary,
  applicableTopics: item.topics,
  references: [{ title: researchCitation(item.researchSource), url: item.researchSource.url }],
  materials: [],
}));

export const EXPERIENCE_EXAMPLES: EssayExample[] = SOCIAL_EXPERIENCES.map((item) => ({
  id: `example-${item.id}`,
  conceptId: item.conceptId,
  title: item.title,
  content: item.content,
  source: researchCitation(item.researchSource),
  sourceUrl: item.researchSource.url,
  usageHint: '',
}));
