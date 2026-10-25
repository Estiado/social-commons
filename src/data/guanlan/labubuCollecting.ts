import {
  EDITORIAL,
  paragraphCopy,
} from '../../../.artifacts/editorial/guanlan/labubuCollecting.ts';
import type { GuanlanEvent } from './types';
import { GUANLAN_EVENTS } from './catalogue.ts';

const event: GuanlanEvent = {
  ...GUANLAN_EVENTS.find((item) => item.id === 'labubu-collecting')!,
  recap: {
    sourceIds: ['release'],
    title: EDITORIAL['event.recap.title'],
    paragraphs: paragraphCopy('event.recap.paragraphs'),
  },
  background: {
    sourceIds: ['ownership', 'uncertainty'],
    title: EDITORIAL['event.background.title'],
    paragraphs: paragraphCopy('event.background.paragraphs'),
  },
  perspectives: [
    {
      sourceIds: ['release'],
      keywords: ['品牌叙事', '日常用途', '审美'],
      level: '现象',
      title: EDITORIAL['event.perspectives.0.title'],
      paragraphs: paragraphCopy('event.perspectives.0.paragraphs'),
    },
    {
      sourceIds: ['uncertainty'],
      keywords: ['过程体验', '不确定', '投入'],
      level: '社会',
      title: EDITORIAL['event.perspectives.1.title'],
      paragraphs: paragraphCopy('event.perspectives.1.paragraphs'),
    },
    {
      sourceIds: ['ownership'],
      keywords: ['自我投入', '熟悉', '认领'],
      level: '思想',
      title: EDITORIAL['event.perspectives.2.title'],
      paragraphs: paragraphCopy('event.perspectives.2.paragraphs'),
    },
  ],
  reconsiderations: [
    {
      sourceIds: ['release', 'uncertainty'],
      title: EDITORIAL['event.reconsiderations.0.title'],
      paragraphs: paragraphCopy('event.reconsiderations.0.paragraphs'),
    },
    {
      sourceIds: ['ownership', 'uncertainty'],
      title: EDITORIAL['event.reconsiderations.1.title'],
      paragraphs: paragraphCopy('event.reconsiderations.1.paragraphs'),
    },
  ],
  sources: [
    {
      id: 'release',
      title: '泡泡玛特寻找LABUBU系列衍生品发售',
      author: 'POPMART泡泡玛特认证账号',
      publication: '新浪新闻·微博发布页',
      date: '2026-08-28',
      kind: '自述',
      importMode: 'paste',
      url: 'https://www.sina.cn/news/detail/5336858151879471.html',
      description: EDITORIAL['event.sources.release.description'],
      digest: paragraphCopy('event.sources.release.digest'),
    },
    {
      id: 'uncertainty',
      title:
        'The Motivating-Uncertainty Effect: Uncertainty Increases Resource Investment in the Process of Reward Pursuit',
      author: 'Luxi Shen、Ayelet Fishbach、Christopher K. Hsee',
      publication: 'Journal of Consumer Research 41(5):1301–1315',
      date: '2015-02',
      kind: '研究',
      url: 'https://doi.org/10.1086/679418',
      fullText: {
        title:
          'The Motivating-Uncertainty Effect: Uncertainty Increases Resource Investment in the Process of Reward Pursuit · 电子版',
        url: 'https://luxi-shen-4unh.squarespace.com/s/2015_ShenFishbachHsee_Uncertainty_GoalPersuit_JCR.pdf',
      },
      description: EDITORIAL['event.sources.uncertainty.description'],
      digest: paragraphCopy('event.sources.uncertainty.digest'),
    },
    {
      id: 'ownership',
      title: 'Toward a Theory of Psychological Ownership in Organizations',
      author: 'Jon L. Pierce、Tatiana Kostova、Kurt T. Dirks',
      publication: 'Academy of Management Review 26(2):298–310',
      date: '2001-04',
      kind: '研究',
      url: 'https://journals.aom.org/doi/abs/10.5465/amr.2001.4378028',
      description: EDITORIAL['event.sources.ownership.description'],
      digest: paragraphCopy('event.sources.ownership.digest'),
    },
  ],
  relatedDailyIds: ['d123', 'd124', 'd125', 'd131'],
  relatedQuoteIds: ['q94', 'q106'],
};

export default event;
