import { EDITORIAL, paragraphCopy } from '../../../.artifacts/editorial/guanlan/academicBars.ts';
import type { GuanlanEvent } from './types';
import { GUANLAN_EVENTS } from './catalogue.ts';

const event: GuanlanEvent = {
  ...GUANLAN_EVENTS.find((item) => item.id === 'academic-bars')!,
  recap: {
    title: EDITORIAL['event.recap.title'],
    paragraphs: paragraphCopy('event.recap.paragraphs'),
    sourceIds: ['report', 'ritual', 'community'],
  },
  background: {
    title: EDITORIAL['event.background.title'],
    paragraphs: paragraphCopy('event.background.paragraphs'),
    sourceIds: ['ritual', 'community', 'report'],
  },
  perspectives: [
    {
      level: '现象',
      title: EDITORIAL['event.perspectives.0.title'],
      keywords: ['身体在场', '共同关注', '互动仪式'],
      paragraphs: paragraphCopy('event.perspectives.0.paragraphs'),
      sourceIds: ['ritual'],
    },
    {
      level: '社会',
      title: EDITORIAL['event.perspectives.1.title'],
      keywords: ['消费门槛', '知识质量', '不同需求'],
      paragraphs: paragraphCopy('event.perspectives.1.paragraphs'),
      sourceIds: ['report'],
    },
    {
      level: '思想',
      title: EDITORIAL['event.perspectives.2.title'],
      keywords: ['临时共同体', '认同', '消费与关系'],
      paragraphs: paragraphCopy('event.perspectives.2.paragraphs'),
      sourceIds: ['community'],
    },
  ],
  reconsiderations: [
    {
      title: EDITORIAL['event.reconsiderations.0.title'],
      paragraphs: paragraphCopy('event.reconsiderations.0.paragraphs'),
      sourceIds: ['report', 'ritual'],
    },
    {
      title: EDITORIAL['event.reconsiderations.1.title'],
      paragraphs: paragraphCopy('event.reconsiderations.1.paragraphs'),
      sourceIds: ['report', 'community'],
    },
  ],
  sources: [
    {
      id: 'report',
      digest: paragraphCopy('event.sources.report.digest'),
      title: '当学术酒吧的热度褪去',
      author: '刘珈宜、史羽梵、孙士雯、张鑫茹（新潮学生记者）',
      publication: '新潮／澎湃号',
      date: '2024-11-16',
      kind: '报道',
      url: 'https://m.thepaper.cn/newsDetail_forward_29354214',
      description: EDITORIAL['event.sources.report.description'],
    },
    {
      id: 'ritual',
      digest: paragraphCopy('event.sources.ritual.digest'),
      title: '在酒吧讨论学术：互动仪式链视域下青年参与“学术酒吧”现象研究',
      author: '覃鑫渊',
      publication: '青年发展论坛 2025,35(5):5–13',
      date: '2025-09-25',
      kind: '研究',
      url: 'https://jxst.cbpt.cnki.net/portal/journal/portal/client/paper/8b35dcf51e6045b2054ad17decf3b6b1',
      description: EDITORIAL['event.sources.ritual.description'],
    },
    {
      id: 'community',
      digest: paragraphCopy('event.sources.community.digest'),
      title: '“衣帽间式的共同体”：青年社交困境纾解的消费主义逻辑——以“学术酒吧”为例',
      author: '王健',
      publication: '北京青年研究 2026,35(4):86–93',
      date: '2026-07-10',
      kind: '研究',
      url: 'https://bjqz.cbpt.cnki.net/portal/journal/portal/client/paper/d00fdac81d2ed1b492cfbda25a492bcf',
      description: EDITORIAL['event.sources.community.description'],
    },
  ],
  relatedDailyIds: ['d109', 'd101', 'd114'],
  relatedQuoteIds: ['q16', 'q61'],
};

export default event;
