import { EDITORIAL, paragraphCopy } from '../../../.artifacts/editorial/guanlan/kakeya.ts';
import type { GuanlanEvent } from './types';
import { GUANLAN_EVENTS } from './catalogue.ts';

const event: GuanlanEvent = {
  ...GUANLAN_EVENTS.find((item) => item.id === 'kakeya-proof')!,
  ...{
    recap: {
      title: EDITORIAL['recap.title'],
      paragraphs: paragraphCopy('recap.paragraphs'),
      sourceIds: ['original', 'simplified', 'ias'],
    },
    background: {
      title: EDITORIAL['background.title'],
      paragraphs: paragraphCopy('background.paragraphs'),
      sourceIds: ['ias', 'original'],
    },
    perspectives: [
      {
        title: EDITORIAL['views.0.title'],
        paragraphs: paragraphCopy('views.0.paragraphs'),
        sourceIds: ['original', 'ias'],
        level: '现象',
        keywords: ['概念边界', '体积与维数'],
      },
      {
        title: EDITORIAL['views.1.title'],
        paragraphs: paragraphCopy('views.1.paragraphs'),
        sourceIds: ['ias', 'simplified'],
        level: '社会',
        keywords: ['合作', '知识积累', '公开核对'],
      },
      {
        title: EDITORIAL['views.2.title'],
        paragraphs: paragraphCopy('views.2.paragraphs'),
        sourceIds: ['original', 'simplified'],
        level: '思想',
        keywords: ['方向与方法', '结果偏误', '证据'],
      },
    ],
    reconsiderations: [
      {
        title: EDITORIAL['rethink.0.title'],
        paragraphs: paragraphCopy('rethink.0.paragraphs'),
        sourceIds: ['ias', 'original'],
      },
      {
        title: EDITORIAL['rethink.1.title'],
        paragraphs: paragraphCopy('rethink.1.paragraphs'),
        sourceIds: ['ias', 'original'],
      },
    ],
    sources: [
      {
        id: 'original',
        title:
          'Volume estimates for unions of convex sets, and the Kakeya set conjecture in three dimensions',
        author: 'Hong Wang、Joshua Zahl',
        publication: 'arXiv:2502.17655',
        date: '2025-02-24',
        kind: '研究',
        url: 'https://arxiv.org/abs/2502.17655',
        importMode: 'paste',
        fullText: {
          title: '原论文PDF · 127页 · CC BY 4.0原件',
          url: 'https://social-commons.pages.dev/readings/research/kakeya-wang-zahl-2025.pdf',
        },
        description: EDITORIAL['sources.original.description'],
        digest: paragraphCopy('sources.original.digest'),
      },
      {
        id: 'simplified',
        title: 'A streamlined proof of the Kakeya set conjecture in R³',
        author: 'Larry Guth、Hong Wang、Joshua Zahl',
        publication: 'arXiv:2601.14411v2；注明将刊于Mathematika',
        date: '2026-01-20；v2 2026-10-11',
        kind: '研究',
        url: 'https://arxiv.org/abs/2601.14411v2',
        importMode: 'paste',
        fullText: {
          title: '简化证明PDF · 49页 · CC BY 4.0原件',
          url: 'https://social-commons.pages.dev/readings/research/kakeya-streamlined-2026.pdf',
        },
        description: EDITORIAL['sources.simplified.description'],
        digest: paragraphCopy('sources.simplified.digest'),
      },
      {
        id: 'ias',
        title: 'A Three-Dimensional Breakthrough',
        author: 'Institute for Advanced Study编辑部',
        publication: 'The Institute Letter，2025年春季',
        date: '2025年春季',
        kind: '报道',
        url: 'https://www.ias.edu/ideas/three-dimensional-breakthrough',
        importMode: 'paste',
        description: EDITORIAL['sources.ias.description'],
        digest: paragraphCopy('sources.ias.digest'),
      },
    ],
    relatedDailyIds: ['d141', 'd143', 'd147'],
    relatedQuoteIds: ['q112', 'q113', 'q111'],
  },
};
export default event;
