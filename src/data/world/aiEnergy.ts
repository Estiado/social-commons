import { EDITORIAL, paragraphCopy } from '../../../.artifacts/editorial/world/aiEnergy.ts';
import type { WorldStory } from './types';
import { WORLD_STORIES } from './catalogue.ts';
const story: WorldStory = {
  ...WORLD_STORIES.find((item) => item.id === 'ai-energy')!,
  ...{
    intro: paragraphCopy('intro'),
    narrative: [
      {
        title: EDITORIAL['chapters.0.title'],
        paragraphs: paragraphCopy('chapters.0.paragraphs'),
        sourceIds: ['iea2025'],
        id: 'machines',
        timelineIds: ['year2024'],
      },
      {
        title: EDITORIAL['chapters.1.title'],
        paragraphs: paragraphCopy('chapters.1.paragraphs'),
        sourceIds: ['iea2025', 'ieaOctober'],
        id: 'connection',
        timelineIds: ['report2025'],
      },
      {
        title: EDITORIAL['chapters.2.title'],
        paragraphs: paragraphCopy('chapters.2.paragraphs'),
        sourceIds: ['ieaApril', 'ieaOctober'],
        id: 'efficiency',
        timelineIds: ['year2025', 'april2026'],
      },
      {
        title: EDITORIAL['chapters.3.title'],
        paragraphs: paragraphCopy('chapters.3.paragraphs'),
        sourceIds: ['ieaOctober', 'ieaApril'],
        id: 'contracts',
        timelineIds: ['october2026'],
      },
      {
        title: EDITORIAL['chapters.4.title'],
        paragraphs: paragraphCopy('chapters.4.paragraphs'),
        sourceIds: ['unece', 'ieaOctober'],
        id: 'local-life',
        timelineIds: ['september2026'],
      },
      {
        title: EDITORIAL['chapters.5.title'],
        paragraphs: paragraphCopy('chapters.5.paragraphs'),
        sourceIds: ['xinhua', 'ieaApril', 'ieaOctober'],
        id: 'next-evidence',
        timelineIds: ['electricity2026'],
      },
    ],
    context: [
      {
        title: EDITORIAL['context.0.title'],
        paragraphs: paragraphCopy('context.0.paragraphs'),
        sourceIds: ['iea2025', 'ieaOctober'],
      },
      {
        title: EDITORIAL['context.1.title'],
        paragraphs: paragraphCopy('context.1.paragraphs'),
        sourceIds: ['iea2025', 'ieaApril'],
      },
      {
        title: EDITORIAL['context.2.title'],
        paragraphs: paragraphCopy('context.2.paragraphs'),
        sourceIds: ['ieaOctober', 'xinhua'],
      },
    ],
    excerpts: [
      {
        text: '没有能源，就没有人工智能。',
        sourceId: 'iea2025',
        locator:
          '《Energy and AI》发布页About this report，英文原句“There is no AI without energy”；此处为中文翻译。',
      },
    ],
    latest: paragraphCopy('latest'),
    terms: [
      { term: '数据中心', definition: EDITORIAL['terms.0'] },
      { term: '训练与推理', definition: EDITORIAL['terms.1'] },
      { term: '接网容量', definition: EDITORIAL['terms.2'] },
      { term: '有条件连接', definition: EDITORIAL['terms.3'] },
    ],
    timeline: [
      {
        id: 'year2024',
        date: '2024-12-31',
        dateLabel: '2024年统计期',
        title: EDITORIAL['time.0'],
        sourceIds: ['iea2025'],
      },
      {
        id: 'report2025',
        date: '2025-04-10',
        dateLabel: '2025年4月10日',
        title: EDITORIAL['time.1'],
        sourceIds: ['iea2025'],
      },
      {
        id: 'year2025',
        date: '2025-12-31',
        dateLabel: '2025年统计期',
        title: EDITORIAL['time.2'],
        sourceIds: ['ieaApril'],
      },
      {
        id: 'electricity2026',
        date: '2026-02-07',
        dateLabel: '2026年2月7日',
        title: EDITORIAL['time.3'],
        sourceIds: ['xinhua'],
      },
      {
        id: 'april2026',
        date: '2026-04-16',
        dateLabel: '2026年4月16日',
        title: EDITORIAL['time.4'],
        sourceIds: ['ieaApril'],
      },
      {
        id: 'september2026',
        date: '2026-09-01',
        dateLabel: '2026年9月发布',
        title: EDITORIAL['time.5'],
        sourceIds: ['unece'],
      },
      {
        id: 'october2026',
        date: '2026-10-14',
        dateLabel: '2026年10月14日',
        title: EDITORIAL['time.6'],
        sourceIds: ['ieaOctober'],
      },
    ],
    perspectives: [
      {
        title: EDITORIAL['perspectives.0.title'],
        paragraphs: paragraphCopy('perspectives.0.paragraphs'),
        sourceIds: ['iea2025', 'ieaApril'],
      },
      {
        title: EDITORIAL['perspectives.1.title'],
        paragraphs: paragraphCopy('perspectives.1.paragraphs'),
        sourceIds: ['ieaOctober', 'unece'],
      },
    ],
    questions: [
      {
        title: EDITORIAL['questions.0.title'],
        paragraphs: paragraphCopy('questions.0.paragraphs'),
        sourceIds: ['ieaApril'],
      },
      {
        title: EDITORIAL['questions.1.title'],
        paragraphs: paragraphCopy('questions.1.paragraphs'),
        sourceIds: ['ieaApril', 'ieaOctober'],
      },
      {
        title: EDITORIAL['questions.2.title'],
        paragraphs: paragraphCopy('questions.2.paragraphs'),
        sourceIds: ['ieaOctober'],
      },
    ],
    watch: paragraphCopy('watch'),
    sources: [
      {
        id: 'iea2025',
        title: 'Energy and AI：执行摘要与2024年估计基准',
        publication: '国际能源署（IEA）',
        date: '2025-04-10',
        url: 'https://www.iea.org/reports/energy-and-ai/executive-summary',
      },
      {
        id: 'ieaApril',
        title: 'Key Questions on Energy and AI：执行摘要与2026年更新',
        publication: '国际能源署（IEA）',
        date: '2026-04-16',
        url: 'https://www.iea.org/reports/key-questions-on-energy-and-ai/executive-summary',
      },
      {
        id: 'ieaOctober',
        title: 'Powering Artificial Intelligence：接网、运营与费用安排',
        publication: '国际能源署（IEA）',
        date: '2026-10-14',
        url: 'https://www.iea.org/reports/powering-artificial-intelligence/executive-summary',
      },
      {
        id: 'xinhua',
        title: '国际能源署：可再生能源与核电2030年将提供全球一半电力',
        publication: '新华社',
        author: '罗毓',
        date: '2026-02-07；电稿2月6日',
        url: 'https://www.news.cn/20260207/83e42771d36b42bf9d135626a29932a9/c.html',
      },
      {
        id: 'unece',
        title: 'Aligning Data Centres and Large Loads Growth With Grid Resilience',
        publication: '联合国欧洲经济委员会（UNECE）',
        date: '2026-09；本文使用公开发布摘要',
        url: 'https://unece.org/info/publications/pub/416640',
      },
    ],
    relatedEventIds: ['ai-at-work', 'global-risk-2026', 'short-drama-overseas'],
  },
};
export default story;
