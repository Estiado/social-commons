import { EDITORIAL, paragraphCopy } from '../../../.artifacts/editorial/guanlan/concertCities.ts';
import type { GuanlanEvent } from './types';
import { GUANLAN_EVENTS } from './catalogue.ts';

const event: GuanlanEvent = {
  ...GUANLAN_EVENTS.find((item) => item.id === 'concert-cities')!,
  recap: {
    sourceIds: ['market'],
    title: EDITORIAL['event.recap.title'],
    paragraphs: paragraphCopy('event.recap.paragraphs'),
  },
  background: {
    sourceIds: ['ritual', 'art'],
    title: EDITORIAL['event.background.title'],
    paragraphs: paragraphCopy('event.background.paragraphs'),
  },
  perspectives: [
    {
      sourceIds: ['market'],
      keywords: ['平台数据', '城市行程', '消费'],
      level: '现象',
      title: EDITORIAL['event.perspectives.0.title'],
      paragraphs: paragraphCopy('event.perspectives.0.paragraphs'),
    },
    {
      sourceIds: ['ritual'],
      keywords: ['共同情绪', '社会联系', '现场'],
      level: '社会',
      title: EDITORIAL['event.perspectives.1.title'],
      paragraphs: paragraphCopy('event.perspectives.1.paragraphs'),
    },
    {
      sourceIds: ['art'],
      keywords: ['协作', '艺术劳动', '惯例'],
      level: '思想',
      title: EDITORIAL['event.perspectives.2.title'],
      paragraphs: paragraphCopy('event.perspectives.2.paragraphs'),
    },
  ],
  reconsiderations: [
    {
      sourceIds: ['market', 'ritual'],
      title: EDITORIAL['event.reconsiderations.0.title'],
      paragraphs: paragraphCopy('event.reconsiderations.0.paragraphs'),
    },
    {
      sourceIds: ['art', 'market'],
      title: EDITORIAL['event.reconsiderations.1.title'],
      paragraphs: paragraphCopy('event.reconsiderations.1.paragraphs'),
    },
  ],
  sources: [
    {
      id: 'market',
      title: '从“看演出”到“赴一座城”：2026暑期演出市场数据折射消费新趋势',
      author: '摩天轮（平台数据发布）',
      publication: '界面新闻·商业资讯',
      date: '2026',
      kind: '自述',
      importMode: 'paste',
      url: 'https://www.jiemian.com/article/15110227.html',
      description: EDITORIAL['event.sources.market.description'],
      digest: paragraphCopy('event.sources.market.digest'),
    },
    {
      id: 'ritual',
      title:
        'Synchronized arousal between performers and related spectators in a fire-walking ritual',
      author: 'Ivana Konvalinka 等',
      publication: 'PNAS 108(20):8514–8519',
      date: '2011-05',
      kind: '研究',
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3100954/',
      description: EDITORIAL['event.sources.ritual.description'],
      digest: paragraphCopy('event.sources.ritual.digest'),
    },
    {
      id: 'art',
      title: 'Art Worlds, 25th Anniversary Edition',
      author: 'Howard S. Becker',
      publication: 'University of California Press',
      date: '2008',
      kind: '研究',
      url: 'https://www.ucpress.edu/book/9780520256361/art-worlds-25th-anniversary-edition',
      description: EDITORIAL['event.sources.art.description'],
      digest: paragraphCopy('event.sources.art.digest'),
    },
  ],
  relatedDailyIds: ['d128', 'd123', 'd131'],
  relatedQuoteIds: ['q102', 'q105'],
};

export default event;
