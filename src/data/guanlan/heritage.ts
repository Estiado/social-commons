import { EDITORIAL, paragraphCopy } from '../../../.artifacts/editorial/guanlan/heritage.ts';
import type { GuanlanEvent } from './types';
import { GUANLAN_EVENTS } from './catalogue.ts';

const event: GuanlanEvent = {
  ...GUANLAN_EVENTS.find((item) => item.id === 'heritage-short-video')!,
  recap: {
    title: EDITORIAL['event.recap.title'],
    paragraphs: paragraphCopy('event.recap.paragraphs'),
    sourceIds: ['zhang'],
  },
  background: {
    title: EDITORIAL['event.background.title'],
    paragraphs: paragraphCopy('event.background.paragraphs'),
    sourceIds: ['chang', 'barbara'],
  },
  perspectives: [
    {
      level: '现象',
      title: EDITORIAL['event.perspectives.0.title'],
      keywords: ['观看与实践', '身体经验', '传播效果'],
      paragraphs: paragraphCopy('event.perspectives.0.paragraphs'),
      sourceIds: ['zhang'],
      quote: { text: '视频可以重播，手艺却得由后来者继承。', sourceId: 'zhang', speaker: '张涛甫' },
    },
    {
      level: '社会',
      title: EDITORIAL['event.perspectives.1.title'],
      keywords: ['代际关系', '共同实践', '个人选择'],
      paragraphs: paragraphCopy('event.perspectives.1.paragraphs'),
      sourceIds: ['chang'],
    },
    {
      level: '思想',
      title: EDITORIAL['event.perspectives.2.title'],
      keywords: ['活态传承', '主体性', '变化与保存'],
      paragraphs: paragraphCopy('event.perspectives.2.paragraphs'),
      sourceIds: ['barbara'],
    },
  ],
  reconsiderations: [
    {
      title: EDITORIAL['event.reconsiderations.0.title'],
      paragraphs: paragraphCopy('event.reconsiderations.0.paragraphs'),
      sourceIds: ['zhang', 'barbara'],
    },
    {
      title: EDITORIAL['event.reconsiderations.1.title'],
      paragraphs: paragraphCopy('event.reconsiderations.1.paragraphs'),
      sourceIds: ['zhang', 'barbara'],
    },
  ],
  sources: [
    {
      id: 'zhang',
      digest: paragraphCopy('event.sources.zhang.digest'),
      title: '当打铁花被截成十几秒：流量时代的非遗，如何真正“活着”？',
      author: '张涛甫',
      publication: '澎湃新闻',
      date: '2026-10-23',
      kind: '评论',
      url: 'https://www.thepaper.cn/newsDetail_forward_34273575',
      description: EDITORIAL['event.sources.zhang.description'],
    },
    {
      id: 'chang',
      digest: paragraphCopy('event.sources.chang.digest'),
      title: '你是敦煌人吗？',
      author: '常沙娜',
      publication: '澎湃新闻',
      date: '2026-10-20',
      kind: '自述',
      url: 'https://www.thepaper.cn/newsDetail_forward_34236648',
      description: EDITORIAL['event.sources.chang.description'],
    },
    {
      id: 'barbara',
      digest: paragraphCopy('event.sources.barbara.digest'),
      title: 'Intangible Heritage as Metacultural Production',
      author: 'Barbara Kirshenblatt-Gimblett',
      publication: 'Museum International 56(1–2):52–65',
      date: '2004-06-24',
      kind: '研究',
      url: 'https://doi.org/10.1111/j.1350-0775.2004.00458.x',
      description: EDITORIAL['event.sources.barbara.description'],
      fullText: {
        title: '论文公开电子版（Stellenbosch Heritage Foundation，英文）',
        url: 'https://www.stellenboschheritage.co.za/wp-content/uploads/Intangible-Heritage.pdf',
      },
    },
  ],
  relatedDailyIds: ['d94', 'd96', 'd97'],
  relatedQuoteIds: ['q65', 'q90'],
};

export default event;
