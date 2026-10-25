import { EDITORIAL, paragraphCopy } from '../../../.artifacts/editorial/guanlan/xibeiTrust.ts';
import type { GuanlanEvent } from './types';
import { GUANLAN_EVENTS } from './catalogue.ts';

const event: GuanlanEvent = {
  ...GUANLAN_EVENTS.find((item) => item.id === 'xibei-trust')!,
  recap: {
    sourceIds: ['timeline', 'followup'],
    title: EDITORIAL['event.recap.title'],
    paragraphs: paragraphCopy('event.recap.paragraphs'),
  },
  background: {
    sourceIds: ['information', 'followup'],
    title: EDITORIAL['event.background.title'],
    paragraphs: paragraphCopy('event.background.paragraphs'),
  },
  perspectives: [
    {
      sourceIds: ['timeline'],
      keywords: ['分类', '工序', '回应'],
      level: '现象',
      title: EDITORIAL['event.perspectives.0.title'],
      paragraphs: paragraphCopy('event.perspectives.0.paragraphs'),
    },
    {
      sourceIds: ['followup'],
      keywords: ['价值感', '价格', '信任'],
      level: '社会',
      title: EDITORIAL['event.perspectives.1.title'],
      paragraphs: paragraphCopy('event.perspectives.1.paragraphs'),
    },
    {
      sourceIds: ['information'],
      keywords: ['信息不对称', '体验', '透明'],
      level: '思想',
      title: EDITORIAL['event.perspectives.2.title'],
      paragraphs: paragraphCopy('event.perspectives.2.paragraphs'),
    },
  ],
  reconsiderations: [
    {
      sourceIds: ['timeline', 'information'],
      title: EDITORIAL['event.reconsiderations.0.title'],
      paragraphs: paragraphCopy('event.reconsiderations.0.paragraphs'),
    },
    {
      sourceIds: ['followup', 'timeline'],
      title: EDITORIAL['event.reconsiderations.1.title'],
      paragraphs: paragraphCopy('event.reconsiderations.1.paragraphs'),
    },
  ],
  sources: [
    {
      id: 'timeline',
      title: '西贝陷“预制菜”风波，一文追踪最新动态',
      author: '21世纪经济报道编辑部',
      publication: '21财经·事件追踪',
      date: '2025-09',
      kind: '报道',
      importMode: 'paste',
      url: 'https://m.21jingji.com/journal/206.html',
      description: EDITORIAL['event.sources.timeline.description'],
      digest: paragraphCopy('event.sources.timeline.digest'),
    },
    {
      id: 'followup',
      title: '预制菜风波一年，“倒闭”缠住西贝',
      author: '张晓翀、阎侠',
      publication: '新京报贝壳财经（21财经转载）',
      date: '2026-09-21',
      kind: '报道',
      importMode: 'paste',
      url: 'https://m.21jingji.com/article/20260921/herald/870dd5ffdad892e498e4bc56dc218902.html',
      description: EDITORIAL['event.sources.followup.description'],
      digest: paragraphCopy('event.sources.followup.digest'),
    },
    {
      id: 'information',
      title: 'Information and Consumer Behavior',
      author: 'Phillip Nelson',
      publication: 'Journal of Political Economy 78(2):311–329',
      date: '1970-03',
      kind: '研究',
      url: 'https://doi.org/10.1086/259630',
      description: EDITORIAL['event.sources.information.description'],
      digest: paragraphCopy('event.sources.information.digest'),
    },
  ],
  relatedDailyIds: ['d2', 'd126', 'd127'],
  relatedQuoteIds: ['q99', 'q94'],
};

export default event;
