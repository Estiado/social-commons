import { EDITORIAL, paragraphCopy } from '../../../.artifacts/editorial/guanlan/shortDrama.ts';
import type { GuanlanEvent } from './types';
import { GUANLAN_EVENTS } from './catalogue.ts';
const event: GuanlanEvent = {
  ...GUANLAN_EVENTS.find((item) => item.id === 'short-drama-overseas')!,
  ...{
    recap: {
      title: EDITORIAL['recap.title'],
      paragraphs: paragraphCopy('recap.paragraphs'),
      sourceIds: ['sensor', 'report'],
    },
    background: {
      title: EDITORIAL['background.title'],
      paragraphs: paragraphCopy('background.paragraphs'),
      sourceIds: ['report', 'sensor', 'adjust'],
    },
    perspectives: [
      {
        title: EDITORIAL['views.0.title'],
        paragraphs: paragraphCopy('views.0.paragraphs'),
        sourceIds: ['report'],
        level: '现象',
        keywords: ['译制', '本地化', '叙事'],
      },
      {
        title: EDITORIAL['views.1.title'],
        paragraphs: paragraphCopy('views.1.paragraphs'),
        sourceIds: ['sensor'],
        level: '社会',
        keywords: ['数据口径', '平台', '市场差异'],
      },
      {
        title: EDITORIAL['views.2.title'],
        paragraphs: paragraphCopy('views.2.paragraphs'),
        sourceIds: ['adjust', 'sensor'],
        level: '思想',
        keywords: ['留存', '商业评价', '文化价值'],
      },
    ],
    reconsiderations: [
      {
        title: EDITORIAL['rethink.0.title'],
        paragraphs: paragraphCopy('rethink.0.paragraphs'),
        sourceIds: ['sensor', 'report'],
      },
      {
        title: EDITORIAL['rethink.1.title'],
        paragraphs: paragraphCopy('rethink.1.paragraphs'),
        sourceIds: ['report', 'adjust'],
      },
    ],
    sources: [
      {
        id: 'report',
        title: 'AI赋能微短剧走向世界',
        author: '人民日报海外版采编；报道采访林启文、臧楠、周莹等从业者',
        publication: '人民日报海外版／新华网',
        date: '2026-09-07',
        kind: '报道',
        url: 'https://www.news.cn/ent/20260907/968935b4d7c94f578a9bcd2ea8366641/c.html',
        description: EDITORIAL['sources.report.description'],
        digest: paragraphCopy('sources.report.digest'),
      },
      {
        id: 'sensor',
        title: 'State of Short Drama Apps 2026',
        author: 'Donny Kristianto／Sensor Tower',
        publication: 'Sensor Tower',
        date: '2026-06；包含2026年第一季度数据',
        kind: '研究',
        url: 'https://sensortower.com/blog/state-of-short-drama-apps-2026-report',
        description: EDITORIAL['sources.sensor.description'],
        digest: paragraphCopy('sources.sensor.digest'),
        importMode: 'paste',
      },
      {
        id: 'adjust',
        title: 'The short drama apps report',
        author: 'Adjust',
        publication: 'Adjust官方报告发布页',
        date: '2026年；统计包含2026年第一季度',
        kind: '研究',
        url: 'https://www.adjust.com/blog/short-drama-apps-report/',
        description: EDITORIAL['sources.adjust.description'],
        digest: paragraphCopy('sources.adjust.digest'),
        importMode: 'paste',
      },
    ],
    relatedDailyIds: ['d133', 'd135', 'd116'],
    relatedQuoteIds: ['q108', 'q109'],
  },
};
export default event;
