import { EDITORIAL, paragraphCopy } from '../../../.artifacts/editorial/guanlan/onlinePersonas.ts';
import type { GuanlanEvent } from './types';
import { GUANLAN_EVENTS } from './catalogue.ts';

const event: GuanlanEvent = {
  ...GUANLAN_EVENTS.find((item) => item.id === 'online-personas')!,
  recap: {
    sourceIds: ['survey'],
    title: EDITORIAL['event.recap.title'],
    paragraphs: paragraphCopy('event.recap.paragraphs'),
  },
  background: {
    sourceIds: ['context', 'audience'],
    title: EDITORIAL['event.background.title'],
    paragraphs: paragraphCopy('event.background.paragraphs'),
  },
  perspectives: [
    {
      sourceIds: ['survey'],
      keywords: ['自我侧面', '兴趣交往', '回应'],
      level: '现象',
      title: EDITORIAL['event.perspectives.0.title'],
      paragraphs: paragraphCopy('event.perspectives.0.paragraphs'),
    },
    {
      sourceIds: ['context'],
      keywords: ['语境', '可见性', '关系边界'],
      level: '社会',
      title: EDITORIAL['event.perspectives.1.title'],
      paragraphs: paragraphCopy('event.perspectives.1.paragraphs'),
    },
    {
      sourceIds: ['privacy'],
      keywords: ['隐私', '传播目的', '公共利益'],
      level: '思想',
      title: EDITORIAL['event.perspectives.2.title'],
      paragraphs: paragraphCopy('event.perspectives.2.paragraphs'),
    },
  ],
  reconsiderations: [
    {
      sourceIds: ['survey', 'privacy'],
      title: EDITORIAL['event.reconsiderations.0.title'],
      paragraphs: paragraphCopy('event.reconsiderations.0.paragraphs'),
    },
    {
      sourceIds: ['context', 'audience'],
      title: EDITORIAL['event.reconsiderations.1.title'],
      paragraphs: paragraphCopy('event.reconsiderations.1.paragraphs'),
    },
  ],
  sources: [
    {
      id: 'survey',
      title: '75.4%受访青年会在不同社交平台打造不同“线上形象”',
      author: '戴瑶',
      publication: '中国青年报',
      date: '2026-09-10',
      kind: '报道',
      importMode: 'paste',
      url: 'https://news.youth.cn/sh/202609/t20260910_16861503.htm',
      description: EDITORIAL['event.sources.survey.description'],
      digest: paragraphCopy('event.sources.survey.digest'),
    },
    {
      id: 'context',
      title:
        'I tweet honestly, I tweet passionately: Twitter users, context collapse, and the imagined audience',
      author: 'Alice E. Marwick、danah boyd',
      publication: 'New Media & Society 13(1):114–133',
      date: '2011-02',
      kind: '研究',
      url: 'https://doi.org/10.1177/1461444810365313',
      description: EDITORIAL['event.sources.context.description'],
      digest: paragraphCopy('event.sources.context.digest'),
    },
    {
      id: 'audience',
      title: "Knock, Knock. Who's There? The Imagined Audience",
      author: 'Eden Litt',
      publication: 'Journal of Broadcasting & Electronic Media 56(3):330–345',
      date: '2012',
      kind: '研究',
      url: 'https://doi.org/10.1080/08838151.2012.705195',
      description: EDITORIAL['event.sources.audience.description'],
      digest: paragraphCopy('event.sources.audience.digest'),
    },
    {
      id: 'privacy',
      title: 'Privacy as Contextual Integrity',
      author: 'Helen Nissenbaum',
      publication: 'Washington Law Review 79(1):119–158',
      date: '2004',
      kind: '研究',
      url: 'https://digitalcommons.law.uw.edu/wlr/vol79/iss1/10/',
      fullText: {
        title: 'Privacy as Contextual Integrity · 电子版',
        url: 'https://nissenbaum.tech.cornell.edu/papers/H.%20Nissenbaum%2C%20_Privacy%20as%20Contextual%20Integrity.pdf',
      },
      description: EDITORIAL['event.sources.privacy.description'],
      digest: paragraphCopy('event.sources.privacy.digest'),
    },
  ],
  relatedDailyIds: ['d116', 'd117', 'd118'],
  relatedQuoteIds: ['q94', 'q99'],
};

export default event;
