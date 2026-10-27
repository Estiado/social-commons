import { EDITORIAL } from '../../../.artifacts/editorial/guanlan/globalRisk.ts';
import type { GuanlanEvent } from './types';
import { GUANLAN_EVENTS } from './catalogue.ts';
const event: GuanlanEvent = {
  ...GUANLAN_EVENTS.find((item) => item.id === 'global-risk-2026')!,
  ...{
    recap: {
      title: EDITORIAL['recap.title'],
      paragraphs: [
        EDITORIAL['recap.paragraphs.0'],
        EDITORIAL['recap.paragraphs.1'],
        EDITORIAL['recap.paragraphs.2'],
      ],
      sourceIds: ['report', 'news'],
    },
    background: {
      title: EDITORIAL['background.title'],
      paragraphs: [
        EDITORIAL['background.paragraphs.0'],
        EDITORIAL['background.paragraphs.1'],
        EDITORIAL['background.paragraphs.2'],
      ],
      sourceIds: ['report', 'method'],
    },
    perspectives: [
      {
        title: EDITORIAL['perspectives.0.title'],
        paragraphs: [
          EDITORIAL['perspectives.0.paragraphs.0'],
          EDITORIAL['perspectives.0.paragraphs.1'],
        ],
        sourceIds: ['news', 'report'],
        level: '现象',
        keywords: ['注意力', '时间区间', '新闻概括'],
      },
      {
        title: EDITORIAL['perspectives.1.title'],
        paragraphs: [
          EDITORIAL['perspectives.1.paragraphs.0'],
          EDITORIAL['perspectives.1.paragraphs.1'],
        ],
        sourceIds: ['report', 'method'],
        level: '社会',
        keywords: ['预警', '能力', '资源', '协调'],
      },
      {
        title: EDITORIAL['perspectives.2.title'],
        paragraphs: [
          EDITORIAL['perspectives.2.paragraphs.0'],
          EDITORIAL['perspectives.2.paragraphs.1'],
        ],
        sourceIds: ['method', 'regional'],
        level: '思想',
        keywords: ['样本', '风险网络', '因果边界'],
      },
    ],
    reconsiderations: [
      {
        title: EDITORIAL['reconsiderations.0.title'],
        paragraphs: [
          EDITORIAL['reconsiderations.0.paragraphs.0'],
          EDITORIAL['reconsiderations.0.paragraphs.1'],
        ],
        sourceIds: ['report', 'method'],
      },
      {
        title: EDITORIAL['reconsiderations.1.title'],
        paragraphs: [
          EDITORIAL['reconsiderations.1.paragraphs.0'],
          EDITORIAL['reconsiderations.1.paragraphs.1'],
        ],
        sourceIds: ['report'],
      },
      {
        title: EDITORIAL['reconsiderations.2.title'],
        paragraphs: [
          EDITORIAL['reconsiderations.2.paragraphs.0'],
          EDITORIAL['reconsiderations.2.paragraphs.1'],
        ],
        sourceIds: ['report', 'method'],
      },
    ],
    sources: [
      {
        id: 'report',
        title: 'UN Global Risk Report 2026 · 正文，印刷页2—35',
        author: '联合国秘书长执行办公室',
        publication: 'United Nations',
        date: '2026-09-15',
        kind: '研究',
        url: 'https://www.un.org/en/global-risk-report',
        fullText: {
          title: '联合国《全球风险报告2026》原文与下载',
          url: 'https://www.preventionweb.net/publication/documents-and-publications/un-global-risk-report-2026',
        },
        description: EDITORIAL['sources.0.description'],
        digest: [EDITORIAL['sources.0.digest.0'], EDITORIAL['sources.0.digest.1']],
      },
      {
        id: 'method',
        title: 'UN Global Risk Report 2026 · Annex 2，印刷页40—43',
        author: '联合国全球风险调查研究团队',
        publication: 'United Nations · 方法附录',
        date: '2026-09-15',
        kind: '研究',
        url: 'https://www.un.org/en/global-risk-report',
        description: EDITORIAL['sources.1.description'],
        digest: [EDITORIAL['sources.1.digest.0'], EDITORIAL['sources.1.digest.1']],
      },
      {
        id: 'news',
        title: '联合国报告：大规模战争在全球风险排名中迅速攀升',
        author: '尚绪谦',
        publication: '新华社',
        date: '2026-09-16',
        kind: '报道',
        importMode: 'paste',
        url: 'https://www.xinhuanet.com/20260916/7e49cfe6a05b4e9b905999717ca93726/c.html',
        description: EDITORIAL['sources.2.description'],
        digest: [EDITORIAL['sources.2.digest.0'], EDITORIAL['sources.2.digest.1']],
      },
      {
        id: 'regional',
        title:
          'UN Global Risk Report 2026: Asia faces rising security and AI threats as climate concerns slip down priority list',
        author: '新加坡国立大学风险公众理解研究所（IPUR）',
        publication: 'NUS · IPUR',
        date: '2026-09-16',
        kind: '研究',
        url: 'https://ipur.nus.edu.sg/un-global-risk-report-2026-asia-faces-rising-security-and-ai-threats-as-climate-concerns-slip-down-priority-list/',
        description: EDITORIAL['sources.3.description'],
        digest: [EDITORIAL['sources.3.digest.0'], EDITORIAL['sources.3.digest.1']],
      },
    ],
    relatedDailyIds: ['d116', 'd118', 'd130'],
    relatedQuoteIds: ['q99', 'q104'],
  },
};
export default event;
