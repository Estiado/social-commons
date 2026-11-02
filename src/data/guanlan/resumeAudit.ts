import { EDITORIAL, paragraphCopy } from '../../../.artifacts/editorial/guanlan/resumeAudit.ts';
import type { GuanlanEvent } from './types';
import { GUANLAN_EVENTS } from './catalogue.ts';

const event: GuanlanEvent = {
  ...GUANLAN_EVENTS.find((item) => item.id === 'resume-label-audit')!,
  ...{
    recap: {
      title: EDITORIAL['recap.title'],
      paragraphs: paragraphCopy('recap.paragraphs'),
      sourceIds: ['uw', 'audit'],
    },
    background: {
      title: EDITORIAL['background.title'],
      paragraphs: paragraphCopy('background.paragraphs'),
      sourceIds: ['audit', 'shades'],
    },
    perspectives: [
      {
        title: EDITORIAL['views.0.title'],
        paragraphs: paragraphCopy('views.0.paragraphs'),
        sourceIds: ['audit', 'uw'],
        level: '现象',
        keywords: ['代理信息', '能力与分数'],
      },
      {
        title: EDITORIAL['views.1.title'],
        paragraphs: paragraphCopy('views.1.paragraphs'),
        sourceIds: ['shades', 'audit'],
        level: '社会',
        keywords: ['交叉群体', '公平', '评估尺度'],
      },
      {
        title: EDITORIAL['views.2.title'],
        paragraphs: paragraphCopy('views.2.paragraphs'),
        sourceIds: ['datasheets', 'audit'],
        level: '思想',
        keywords: ['分类边界', '责任', '可纠错'],
      },
    ],
    reconsiderations: [
      {
        title: EDITORIAL['rethink.0.title'],
        paragraphs: paragraphCopy('rethink.0.paragraphs'),
        sourceIds: ['audit', 'datasheets'],
      },
      {
        title: EDITORIAL['rethink.1.title'],
        paragraphs: paragraphCopy('rethink.1.paragraphs'),
        sourceIds: ['uw', 'audit'],
      },
    ],
    sources: [
      {
        id: 'audit',
        title:
          'Gender, Race, and Intersectional Bias in Resume Screening via Language Model Retrieval',
        author: 'Kyra Wilson、Aylin Caliskan',
        publication: 'AIES 2024；arXiv:2407.20371',
        date: '2024-07-29预印本；10月会议',
        kind: '研究',
        url: 'https://arxiv.org/abs/2407.20371',
        importMode: 'paste',
        fullText: {
          title: '论文PDF · arXiv',
          url: 'https://arxiv.org/pdf/2407.20371',
        },
        description: EDITORIAL['sources.audit.description'],
        digest: paragraphCopy('sources.audit.digest'),
      },
      {
        id: 'uw',
        title:
          'AI tools show biases in ranking job applicants’ names according to perceived race and gender',
        author: 'Stefan Milne',
        publication: 'UW News，华盛顿大学',
        date: '2024-10-31',
        kind: '报道',
        url: 'https://www.washington.edu/news/2024/10/31/ai-bias-resume-screening-race-gender/',
        importMode: 'paste',
        description: EDITORIAL['sources.uw.description'],
        digest: paragraphCopy('sources.uw.digest'),
      },
      {
        id: 'shades',
        title:
          'Gender Shades: Intersectional Accuracy Disparities in Commercial Gender Classification',
        author: 'Joy Buolamwini、Timnit Gebru',
        publication: 'PMLR 81，2018，77–91页',
        date: '2018-02-23—24会议',
        kind: '研究',
        url: 'https://proceedings.mlr.press/v81/buolamwini18a.html',
        importMode: 'paste',
        fullText: {
          title: '论文PDF · PMLR',
          url: 'https://proceedings.mlr.press/v81/buolamwini18a/buolamwini18a.pdf',
        },
        description: EDITORIAL['sources.shades.description'],
        digest: paragraphCopy('sources.shades.digest'),
      },
      {
        id: 'datasheets',
        title: 'Datasheets for Datasets',
        author: 'Timnit Gebru、Jamie Morgenstern、Briana Vecchione等',
        publication: 'Communications of the ACM 64(12)，2021，86–92页',
        date: '2018年初稿；2021年刊载',
        kind: '研究',
        url: 'https://arxiv.org/abs/1803.09010',
        importMode: 'paste',
        description: EDITORIAL['sources.datasheets.description'],
        digest: paragraphCopy('sources.datasheets.digest'),
      },
    ],
    relatedDailyIds: ['d144', 'd145', 'd146', 'd71'],
    relatedQuoteIds: ['q111', 'q114', 'q100'],
  },
};
export default event;
