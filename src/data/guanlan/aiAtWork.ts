import { EDITORIAL, paragraphCopy } from '../../../.artifacts/editorial/guanlan/aiAtWork.ts';
import type { GuanlanEvent } from './types';
import { GUANLAN_EVENTS } from './catalogue.ts';

const event: GuanlanEvent = {
  ...GUANLAN_EVENTS.find((item) => item.id === 'ai-at-work')!,
  recap: {
    title: EDITORIAL['event.recap.title'],
    paragraphs: paragraphCopy('event.recap.paragraphs'),
    sourceIds: ['weekly'],
  },
  background: {
    title: EDITORIAL['event.background.title'],
    paragraphs: paragraphCopy('event.background.paragraphs'),
    sourceIds: ['jcurve', 'history'],
  },
  perspectives: [
    {
      level: '现象',
      title: EDITORIAL['event.perspectives.0.title'],
      keywords: ['工作经验', '形式与效果', '沟通责任'],
      paragraphs: paragraphCopy('event.perspectives.0.paragraphs'),
      sourceIds: ['weekly'],
    },
    {
      level: '社会',
      title: EDITORIAL['event.perspectives.1.title'],
      keywords: ['互补投入', '培训', '流程变化'],
      paragraphs: paragraphCopy('event.perspectives.1.paragraphs'),
      sourceIds: ['jcurve'],
    },
    {
      level: '思想',
      title: EDITORIAL['event.perspectives.2.title'],
      keywords: ['知识与劳动', '分工', '人的位置'],
      paragraphs: paragraphCopy('event.perspectives.2.paragraphs'),
      sourceIds: ['history'],
    },
  ],
  reconsiderations: [
    {
      title: EDITORIAL['event.reconsiderations.0.title'],
      paragraphs: paragraphCopy('event.reconsiderations.0.paragraphs'),
      sourceIds: ['work'],
    },
    {
      title: EDITORIAL['event.reconsiderations.1.title'],
      paragraphs: paragraphCopy('event.reconsiderations.1.paragraphs'),
      sourceIds: ['work', 'jcurve'],
    },
  ],
  sources: [
    {
      id: 'weekly',
      digest: paragraphCopy('event.sources.weekly.digest'),
      title: '“AI挂在嘴边，实际一事无成”，年轻人正在被“AI登”逼疯',
      author: '嗡嗡',
      publication: '新周刊',
      date: '2026-10-13',
      kind: '报道',
      url: 'https://eu.36kr.com/zh/p/4023610911362949',
      importMode: 'paste',
      description: EDITORIAL['event.sources.weekly.description'],
    },
    {
      id: 'jcurve',
      digest: paragraphCopy('event.sources.jcurve.digest'),
      title: 'The Productivity J-Curve: How Intangibles Complement General Purpose Technologies',
      author: 'Erik Brynjolfsson、Daniel Rock、Chad Syverson',
      publication: 'American Economic Journal: Macroeconomics 13(1):333–372',
      date: '2021-01',
      kind: '研究',
      url: 'https://www.aeaweb.org/articles?id=10.1257/mac.20180386',
      description: EDITORIAL['event.sources.jcurve.description'],
    },
    {
      id: 'history',
      digest: paragraphCopy('event.sources.history.digest'),
      title: '从人力智能到人造智能：人工智能的劳动史',
      author: '孙一洲',
      publication: '澎湃新闻',
      date: '2026-10-21',
      kind: '评论',
      url: 'https://www.thepaper.cn/newsDetail_forward_34261996',
      description: EDITORIAL['event.sources.history.description'],
    },
    {
      id: 'work',
      digest: paragraphCopy('event.sources.work.digest'),
      title: 'Generative AI at Work（2023年11月修订工作论文）',
      author: 'Erik Brynjolfsson、Danielle Li、Lindsey R. Raymond',
      publication: 'NBER Working Paper 31161',
      date: '2023-11',
      kind: '研究',
      url: 'https://www.nber.org/papers/w31161',
      description: EDITORIAL['event.sources.work.description'],
    },
  ],
  relatedDailyIds: ['d83', 'd84', 'd85', 'd100'],
  relatedQuoteIds: ['q39', 'q65'],
};

export default event;
