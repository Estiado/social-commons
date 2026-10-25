import { EDITORIAL, paragraphCopy } from '../../../.artifacts/editorial/guanlan/reverseTourism.ts';
import type { GuanlanEvent } from './types';
import { GUANLAN_EVENTS } from './catalogue.ts';

const event: GuanlanEvent = {
  ...GUANLAN_EVENTS.find((item) => item.id === 'reverse-tourism')!,
  recap: {
    sourceIds: ['data', 'visit'],
    title: EDITORIAL['event.recap.title'],
    paragraphs: paragraphCopy('event.recap.paragraphs'),
  },
  background: {
    sourceIds: ['authenticity', 'visit'],
    title: EDITORIAL['event.background.title'],
    paragraphs: paragraphCopy('event.background.paragraphs'),
  },
  perspectives: [
    {
      sourceIds: ['data'],
      keywords: ['统计口径', '增幅', '承载'],
      level: '现象',
      title: EDITORIAL['event.perspectives.0.title'],
      paragraphs: paragraphCopy('event.perspectives.0.paragraphs'),
    },
    {
      sourceIds: ['visit'],
      keywords: ['地方差异', '走访', '停留'],
      level: '社会',
      title: EDITORIAL['event.perspectives.1.title'],
      paragraphs: paragraphCopy('event.perspectives.1.paragraphs'),
    },
    {
      sourceIds: ['authenticity'],
      keywords: ['真实感', '观看', '居民'],
      level: '思想',
      title: EDITORIAL['event.perspectives.2.title'],
      paragraphs: paragraphCopy('event.perspectives.2.paragraphs'),
    },
  ],
  reconsiderations: [
    {
      sourceIds: ['authenticity', 'visit'],
      title: EDITORIAL['event.reconsiderations.0.title'],
      paragraphs: paragraphCopy('event.reconsiderations.0.paragraphs'),
    },
    {
      sourceIds: ['data', 'visit'],
      title: EDITORIAL['event.reconsiderations.1.title'],
      paragraphs: paragraphCopy('event.reconsiderations.1.paragraphs'),
    },
  ],
  sources: [
    {
      id: 'data',
      title: '有数｜国庆日均国内游人次增长6.3%，县域旅游成新热点',
      author: '杜海燕、王亚赛',
      publication: '澎湃新闻·美数课',
      date: '2026-10-09',
      kind: '报道',
      importMode: 'paste',
      url: 'https://m.thepaper.cn/newsDetail_forward_34123204',
      description: EDITORIAL['event.sources.data.description'],
      digest: paragraphCopy('event.sources.data.digest'),
    },
    {
      id: 'visit',
      title: '“县”在出发｜避开人潮赴千年怀府，河南沁阳如何接住这波“县城游”流量？',
      author: '郭净净',
      publication: '界面新闻',
      date: '2026-10-04',
      kind: '报道',
      importMode: 'paste',
      url: 'https://www.jiemian.com/article/15160824.html',
      description: EDITORIAL['event.sources.visit.description'],
      digest: paragraphCopy('event.sources.visit.digest'),
    },
    {
      id: 'authenticity',
      title: 'Staged Authenticity: Arrangements of Social Space in Tourist Settings',
      author: 'Dean MacCannell',
      publication: 'American Journal of Sociology 79(3):589–603',
      date: '1973-11',
      kind: '研究',
      url: 'https://doi.org/10.1086/225585',
      description: EDITORIAL['event.sources.authenticity.description'],
      digest: paragraphCopy('event.sources.authenticity.digest'),
    },
  ],
  relatedDailyIds: ['d113', 'd132', 'd121'],
  relatedQuoteIds: ['q102', 'q106'],
};

export default event;
