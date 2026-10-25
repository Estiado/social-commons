import {
  EDITORIAL,
  paragraphCopy,
} from '../../../.artifacts/editorial/guanlan/freshmanBelonging.ts';
import type { GuanlanEvent } from './types';
import { GUANLAN_EVENTS } from './catalogue.ts';

const event: GuanlanEvent = {
  ...GUANLAN_EVENTS.find((item) => item.id === 'freshman-belonging')!,
  recap: {
    sourceIds: ['interview'],
    title: EDITORIAL['event.recap.title'],
    paragraphs: paragraphCopy('event.recap.paragraphs'),
  },
  background: {
    sourceIds: ['belonging', 'ties'],
    title: EDITORIAL['event.background.title'],
    paragraphs: paragraphCopy('event.background.paragraphs'),
  },
  perspectives: [
    {
      sourceIds: ['interview'],
      keywords: ['协商', '生活规则', '适应'],
      level: '现象',
      title: EDITORIAL['event.perspectives.0.title'],
      paragraphs: paragraphCopy('event.perspectives.0.paragraphs'),
    },
    {
      sourceIds: ['belonging'],
      keywords: ['解释方式', '身份', '排斥'],
      level: '社会',
      title: EDITORIAL['event.perspectives.1.title'],
      paragraphs: paragraphCopy('event.perspectives.1.paragraphs'),
    },
    {
      sourceIds: ['ties'],
      keywords: ['关系网络', '多种支持', '弱联系'],
      level: '思想',
      title: EDITORIAL['event.perspectives.2.title'],
      paragraphs: paragraphCopy('event.perspectives.2.paragraphs'),
    },
  ],
  reconsiderations: [
    {
      sourceIds: ['interview', 'ties'],
      title: EDITORIAL['event.reconsiderations.0.title'],
      paragraphs: paragraphCopy('event.reconsiderations.0.paragraphs'),
    },
    {
      sourceIds: ['belonging', 'interview'],
      title: EDITORIAL['event.reconsiderations.1.title'],
      paragraphs: paragraphCopy('event.reconsiderations.1.paragraphs'),
    },
  ],
  sources: [
    {
      id: 'interview',
      title: '大学新生如何迈出社交第一步',
      author: '陈友华（受访）；中国青年报记者采访',
      publication: '中国青年报',
      date: '2026-09-17',
      kind: '报道',
      importMode: 'paste',
      url: 'https://txs.youth.cn/xw/202609/t20260917_16873961.htm',
      description: EDITORIAL['event.sources.interview.description'],
      digest: paragraphCopy('event.sources.interview.digest'),
    },
    {
      id: 'belonging',
      title: 'A question of belonging: Race, social fit, and achievement',
      author: 'Gregory M. Walton、Geoffrey L. Cohen',
      publication: 'Journal of Personality and Social Psychology 92(1):82–96',
      date: '2007-01',
      kind: '研究',
      url: 'https://pubmed.ncbi.nlm.nih.gov/17201544/',
      description: EDITORIAL['event.sources.belonging.description'],
      digest: paragraphCopy('event.sources.belonging.digest'),
    },
    {
      id: 'ties',
      title: 'The Strength of Weak Ties',
      author: 'Mark S. Granovetter',
      publication: 'American Journal of Sociology 78(6):1360–1380',
      date: '1973-05',
      kind: '研究',
      url: 'https://doi.org/10.1086/225469',
      description: EDITORIAL['event.sources.ties.description'],
      digest: paragraphCopy('event.sources.ties.digest'),
    },
  ],
  relatedDailyIds: ['d119', 'd120', 'd121'],
  relatedQuoteIds: ['q93', 'q100'],
};

export default event;
