import type { IEssayMaterial } from '../types';
import type { EssayExample } from '../essayExamples';
import { ATTENTION_STUDIES } from '../knowledge/attentionAndSystems.ts';
import { researchCitation } from '../knowledge/youthStudies.ts';
export const ATTENTION_ESSAYS: IEssayMaterial[] = ATTENTION_STUDIES.map((item) => ({
  id: item.conceptId,
  concept: item.concept,
  category: item.category,
  description: item.summary,
  applicableTopics: item.topics,
  references: [{ title: researchCitation(item.researchSource), url: item.researchSource.url }],
  materials: [],
}));
export const ATTENTION_EXAMPLES: EssayExample[] = ATTENTION_STUDIES.map((item) => ({
  id: 'example-' + item.id,
  conceptId: item.conceptId,
  title: item.title,
  content: item.content,
  source: researchCitation(item.researchSource),
  sourceUrl: item.researchSource.url,
  usageHint: '',
}));
