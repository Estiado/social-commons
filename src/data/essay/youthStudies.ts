import type { IEssayMaterial } from '../types';
import type { EssayExample } from '../essayExamples';
import { YOUTH_STUDIES, researchCitation } from '../knowledge/youthStudies.ts';

export const YOUTH_ESSAYS: IEssayMaterial[] = YOUTH_STUDIES.map((item) => ({
  id: item.conceptId,
  concept: item.concept,
  category: item.category,
  description: item.summary,
  applicableTopics: item.topics,
  references: [{ title: researchCitation(item.researchSource), url: item.researchSource.url }],
  materials: [],
}));

export const YOUTH_EXAMPLES: EssayExample[] = YOUTH_STUDIES.map((item) => ({
  id: `example-${item.id}`,
  conceptId: item.conceptId,
  title: item.title,
  content: item.content,
  source: researchCitation(item.researchSource),
  sourceUrl: item.researchSource.url,
  usageHint: '',
}));
