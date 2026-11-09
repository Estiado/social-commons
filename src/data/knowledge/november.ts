import { EDITORIAL } from '../../../.artifacts/editorial/knowledge/november.ts';
import type { IDailyKnowledge, IEssayMaterial } from '../types';
import type { EssayExample } from '../essayExamples';

const readings = [
  {
    id: 'd148',
    conceptId: 'e118',
    concept: '多波段接力',
    category: '天文学 · 多波段观测',
    title: EDITORIAL['d148.title'],
    summary: EDITORIAL['d148.summary'],
    content: EDITORIAL['d148.content'],
    source: 'NASA’s Swift Mission Ends, Leaves Behind Scientific Bonanza',
    url: 'https://science.nasa.gov/missions/swift/nasas-swift-mission-ends/',
    topics: ['科学协作', '证据互补'],
    usageHint: EDITORIAL['d148.usageHint'],
  },
  {
    id: 'd149',
    conceptId: 'e119',
    concept: '文献校勘',
    category: '文献学 · 版本校勘',
    title: EDITORIAL['d149.title'],
    summary: EDITORIAL['d149.summary'],
    content: EDITORIAL['d149.content'],
    source: '四库全书本《东坡诗集注》卷九〈赠刘景文〉',
    url: 'https://zh.wikisource.org/wiki/東坡詩集註_(四庫全書本)/卷09',
    topics: ['史料核验', '文字传承'],
    usageHint: EDITORIAL['d149.usageHint'],
  },
  {
    id: 'd150',
    conceptId: 'e120',
    concept: '气温距平',
    category: '气候科学 · 气温距平',
    title: EDITORIAL['d150.title'],
    summary: EDITORIAL['d150.summary'],
    content: EDITORIAL['d150.content'],
    source: 'Copernicus Climate Change Service：Surface air temperature for October 2026',
    url: 'https://climate.copernicus.eu/surface-air-temperature-october-2026',
    topics: ['统计口径', '气候证据'],
    usageHint: EDITORIAL['d150.usageHint'],
  },
];

export const NOVEMBER_KNOWLEDGE: IDailyKnowledge[] = readings.map((item) => ({
  id: item.id,
  date: '2026-11-09',
  title: item.title,
  category: item.category,
  summary: item.summary,
  content: item.content,
  source: item.source + ' ' + item.url,
}));

export const NOVEMBER_ESSAYS: IEssayMaterial[] = readings.map((item) => ({
  id: item.conceptId,
  concept: item.concept,
  category: item.category,
  description: item.summary,
  applicableTopics: item.topics,
  references: [{ title: item.source, url: item.url }],
  materials: [],
}));

export const NOVEMBER_EXAMPLES: EssayExample[] = readings.map((item) => ({
  id: 'example-' + item.id,
  conceptId: item.conceptId,
  title: item.title,
  content: item.content,
  source: item.source,
  sourceUrl: item.url,
  usageHint: item.usageHint,
}));
