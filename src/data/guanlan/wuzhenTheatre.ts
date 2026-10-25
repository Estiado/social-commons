import { EDITORIAL, paragraphCopy } from '../../../.artifacts/editorial/guanlan/wuzhenTheatre.ts';
import type { GuanlanEvent } from './types';
import { GUANLAN_EVENTS } from './catalogue.ts';

const event: GuanlanEvent = {
  ...GUANLAN_EVENTS.find((item) => item.id === 'wuzhen-theatre')!,
  recap: {
    sourceIds: ['opening'],
    title: EDITORIAL['event.recap.title'],
    paragraphs: paragraphCopy('event.recap.paragraphs'),
  },
  background: {
    sourceIds: ['art', 'tourism'],
    title: EDITORIAL['event.background.title'],
    paragraphs: paragraphCopy('event.background.paragraphs'),
  },
  perspectives: [
    {
      sourceIds: ['opening'],
      keywords: ['节日', '持续相遇', '进入机会'],
      level: '现象',
      title: EDITORIAL['event.perspectives.0.title'],
      paragraphs: paragraphCopy('event.perspectives.0.paragraphs'),
    },
    {
      sourceIds: ['art'],
      keywords: ['协作网络', '惯例', '艺术生产'],
      level: '社会',
      title: EDITORIAL['event.perspectives.1.title'],
      paragraphs: paragraphCopy('event.perspectives.1.paragraphs'),
    },
    {
      sourceIds: ['tourism'],
      keywords: ['旅游观看', '日常生活', '空间边界'],
      level: '思想',
      title: EDITORIAL['event.perspectives.2.title'],
      paragraphs: paragraphCopy('event.perspectives.2.paragraphs'),
    },
  ],
  reconsiderations: [
    {
      sourceIds: ['opening', 'art'],
      title: EDITORIAL['event.reconsiderations.0.title'],
      paragraphs: paragraphCopy('event.reconsiderations.0.paragraphs'),
    },
    {
      sourceIds: ['art', 'tourism'],
      title: EDITORIAL['event.reconsiderations.1.title'],
      paragraphs: paragraphCopy('event.reconsiderations.1.paragraphs'),
    },
  ],
  sources: [
    {
      id: 'opening',
      title: '澹远之境，万象入戏！第十三届乌镇戏剧节开幕',
      author: '梁美琪、王春燕',
      publication: '新快报（经济观察网转载）',
      date: '2026-10-17',
      kind: '报道',
      importMode: 'paste',
      url: 'https://jg-static.eeo.com.cn/article/info?id=ce8aceac5c5de495e4336e153565b251',
      description: EDITORIAL['event.sources.opening.description'],
      digest: paragraphCopy('event.sources.opening.digest'),
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
    {
      id: 'tourism',
      title: 'Staged Authenticity: Arrangements of Social Space in Tourist Settings',
      author: 'Dean MacCannell',
      publication: 'American Journal of Sociology 79(3):589–603',
      date: '1973-11',
      kind: '研究',
      url: 'https://doi.org/10.1086/225585',
      description: EDITORIAL['event.sources.tourism.description'],
      digest: paragraphCopy('event.sources.tourism.digest'),
    },
  ],
  relatedDailyIds: ['d128', 'd132', 'd121'],
  relatedQuoteIds: ['q102', 'q104', 'q105'],
};

export default event;
