import { EDITORIAL, paragraphCopy } from '../../../.artifacts/editorial/guanlan/aiLearning.ts';
import type { GuanlanEvent } from './types';
import { GUANLAN_EVENTS } from './catalogue.ts';
const event: GuanlanEvent = {
  ...GUANLAN_EVENTS.find((item) => item.id === 'ai-learning-guardrails')!,
  ...{
    recap: {
      title: EDITORIAL['recap.title'],
      paragraphs: paragraphCopy('recap.paragraphs'),
      sourceIds: ['report', 'trial'],
    },
    background: {
      title: EDITORIAL['background.title'],
      paragraphs: paragraphCopy('background.paragraphs'),
      sourceIds: ['trial', 'generation'],
    },
    perspectives: [
      {
        title: EDITORIAL['views.0.title'],
        paragraphs: paragraphCopy('views.0.paragraphs'),
        sourceIds: ['trial'],
        level: '现象',
        keywords: ['随机对照', '独立测验', '证据边界'],
      },
      {
        title: EDITORIAL['views.1.title'],
        paragraphs: paragraphCopy('views.1.paragraphs'),
        sourceIds: ['report'],
        level: '社会',
        keywords: ['使用场景', '理解过程', '信息判断'],
      },
      {
        title: EDITORIAL['views.2.title'],
        paragraphs: paragraphCopy('views.2.paragraphs'),
        sourceIds: ['generation'],
        level: '思想',
        keywords: ['主动加工', '生成效应', '迁移限制'],
      },
    ],
    reconsiderations: [
      {
        title: EDITORIAL['rethink.0.title'],
        paragraphs: paragraphCopy('rethink.0.paragraphs'),
        sourceIds: ['trial', 'generation'],
      },
      {
        title: EDITORIAL['rethink.1.title'],
        paragraphs: paragraphCopy('rethink.1.paragraphs'),
        sourceIds: ['trial', 'report'],
      },
    ],
    sources: [
      {
        id: 'report',
        title: '如何引导中小学生用好AI帮手',
        author: '姜伟超、白丽萍、王俊杰',
        publication: '新华社',
        date: '2025-05-23',
        kind: '报道',
        url: 'https://www.news.cn/20250523/84cd267d4a764019ab0e7d8efd698c0f/c.html',
        description: EDITORIAL['sources.report.description'],
        digest: paragraphCopy('sources.report.digest'),
      },
      {
        id: 'trial',
        title:
          'Generative AI without guardrails can harm learning: Evidence from high school mathematics',
        author: 'Hamsa Bastani、Osbert Bastani、Alp Sungu等',
        publication: 'PNAS 122(26), e2422633122',
        date: '2025-06-25；8月更正作者单位',
        kind: '研究',
        url: 'https://doi.org/10.1073/pnas.2422633122',
        description: EDITORIAL['sources.trial.description'],
        digest: paragraphCopy('sources.trial.digest'),
        importMode: 'paste',
      },
      {
        id: 'generation',
        title: 'The generation effect: Delineation of a phenomenon；附作者1992年回顾',
        author: 'Norman J. Slamecka、Peter Graf；回顾作者Norman J. Slamecka',
        publication:
          'Journal of Experimental Psychology: Human Learning and Memory 4(6):592–604；Citation Classic',
        date: '1978；作者回顾1992',
        kind: '研究',
        url: 'https://garfield.library.upenn.edu/classics1992/A1992HQ13900001.pdf',
        description: EDITORIAL['sources.generation.description'],
        digest: paragraphCopy('sources.generation.digest'),
        importMode: 'paste',
      },
    ],
    relatedDailyIds: ['d134', 'd135', 'd136'],
    relatedQuoteIds: ['q109', 'q99'],
  },
};
export default event;
