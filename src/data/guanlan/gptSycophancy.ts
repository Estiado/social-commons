import { EDITORIAL, paragraphCopy } from '../../../.artifacts/editorial/guanlan/gptSycophancy.ts';
import type { GuanlanEvent } from './types';
import { GUANLAN_EVENTS } from './catalogue.ts';

const event: GuanlanEvent = {
  ...GUANLAN_EVENTS.find((item) => item.id === 'gpt-sycophancy')!,
  recap: {
    sourceIds: ['initial', 'review'],
    title: EDITORIAL['event.recap.title'],
    paragraphs: paragraphCopy('event.recap.paragraphs'),
  },
  background: {
    sourceIds: ['paper', 'review'],
    title: EDITORIAL['event.background.title'],
    paragraphs: paragraphCopy('event.background.paragraphs'),
  },
  perspectives: [
    {
      sourceIds: ['initial'],
      keywords: ['短期反馈', '支持', '可靠'],
      level: '现象',
      title: EDITORIAL['event.perspectives.0.title'],
      paragraphs: paragraphCopy('event.perspectives.0.paragraphs'),
    },
    {
      sourceIds: ['review'],
      keywords: ['评估', '发布', '指标'],
      level: '社会',
      title: EDITORIAL['event.perspectives.1.title'],
      paragraphs: paragraphCopy('event.perspectives.1.paragraphs'),
    },
    {
      sourceIds: ['paper'],
      keywords: ['偏好学习', '真实性', '任务边界'],
      level: '思想',
      title: EDITORIAL['event.perspectives.2.title'],
      paragraphs: paragraphCopy('event.perspectives.2.paragraphs'),
    },
  ],
  reconsiderations: [
    {
      sourceIds: ['paper', 'initial'],
      title: EDITORIAL['event.reconsiderations.0.title'],
      paragraphs: paragraphCopy('event.reconsiderations.0.paragraphs'),
    },
    {
      sourceIds: ['review', 'paper'],
      title: EDITORIAL['event.reconsiderations.1.title'],
      paragraphs: paragraphCopy('event.reconsiderations.1.paragraphs'),
    },
  ],
  sources: [
    {
      id: 'initial',
      title: 'Sycophancy in GPT-4o: What happened and what we’re doing about it',
      author: 'OpenAI',
      publication: 'OpenAI·产品说明',
      date: '2025-04-29',
      kind: '自述',
      importMode: 'paste',
      url: 'https://openai.com/index/sycophancy-in-gpt-4o/',
      description: EDITORIAL['event.sources.initial.description'],
      digest: paragraphCopy('event.sources.initial.digest'),
    },
    {
      id: 'review',
      title: 'Expanding on what we missed with sycophancy',
      author: 'OpenAI',
      publication: 'OpenAI·技术复盘',
      date: '2025-05-02',
      kind: '自述',
      importMode: 'paste',
      url: 'https://openai.com/index/expanding-on-sycophancy/',
      description: EDITORIAL['event.sources.review.description'],
      digest: paragraphCopy('event.sources.review.digest'),
    },
    {
      id: 'paper',
      title: 'Towards Understanding Sycophancy in Language Models',
      author: 'Mrinank Sharma 等',
      publication: 'arXiv:2310.13548（v4）',
      date: '2025-05-10',
      kind: '研究',
      url: 'https://arxiv.org/abs/2310.13548v4',
      fullText: {
        title: 'Towards Understanding Sycophancy in Language Models · 电子版',
        url: 'https://arxiv.org/pdf/2310.13548v4',
      },
      description: EDITORIAL['event.sources.paper.description'],
      digest: paragraphCopy('event.sources.paper.digest'),
    },
  ],
  relatedDailyIds: ['d88', 'd112', 'd122'],
  relatedQuoteIds: ['q99', 'q103'],
};

export default event;
