import { EDITORIAL } from '../../../.artifacts/editorial/world/palestine.ts';
import type { WorldStory } from './types';
import { WORLD_STORIES } from './catalogue.ts';
const story: WorldStory = {
  ...WORLD_STORIES.find((item) => item.id === 'palestine')!,
  ...{
    intro: [EDITORIAL['intro.0'], EDITORIAL['intro.1']],
    latest: [EDITORIAL['latest.0'], EDITORIAL['latest.1']],
    terms: [
      {
        term: EDITORIAL['terms.0.term'],
        definition: EDITORIAL['terms.0.definition'],
      },
      {
        term: EDITORIAL['terms.1.term'],
        definition: EDITORIAL['terms.1.definition'],
      },
      {
        term: EDITORIAL['terms.2.term'],
        definition: EDITORIAL['terms.2.definition'],
      },
      {
        term: EDITORIAL['terms.3.term'],
        definition: EDITORIAL['terms.3.definition'],
      },
      {
        term: EDITORIAL['terms.4.term'],
        definition: EDITORIAL['terms.4.definition'],
      },
      {
        term: EDITORIAL['terms.5.term'],
        definition: EDITORIAL['terms.5.definition'],
      },
    ],
    timeline: [
      {
        id: 'partition',
        date: '1947-11-29',
        dateLabel: '1947年11月29日',
        title: EDITORIAL['timeline.0.title'],
        what: [EDITORIAL['timeline.0.what.0']],
        why: EDITORIAL['timeline.0.why'],
        sourceIds: ['un-timeline'],
      },
      {
        id: 'war1948',
        date: '1948-05-14',
        dateLabel: '1948年5月起',
        title: EDITORIAL['timeline.1.title'],
        what: [EDITORIAL['timeline.1.what.0'], EDITORIAL['timeline.1.what.1']],
        why: EDITORIAL['timeline.1.why'],
        sourceIds: ['cctv-history', 'un-history'],
      },
      {
        id: 'war1967',
        date: '1967-06-05',
        dateLabel: '1967年6月',
        title: EDITORIAL['timeline.2.title'],
        what: [EDITORIAL['timeline.2.what.0'], EDITORIAL['timeline.2.what.1']],
        why: EDITORIAL['timeline.2.why'],
        sourceIds: ['un-history'],
      },
      {
        id: 'oslo',
        date: '1993-09-13',
        dateLabel: '1993年9月13日',
        title: EDITORIAL['timeline.3.title'],
        what: [EDITORIAL['timeline.3.what.0'], EDITORIAL['timeline.3.what.1']],
        why: EDITORIAL['timeline.3.why'],
        sourceIds: ['oslo', 'final-status'],
      },
      {
        id: 'division',
        date: '2007-06-01',
        dateLabel: '2007年6月',
        title: EDITORIAL['timeline.4.title'],
        what: [EDITORIAL['timeline.4.what.0']],
        why: EDITORIAL['timeline.4.why'],
        sourceIds: ['xinhua-keywords'],
      },
      {
        id: 'october7',
        date: '2023-10-07',
        dateLabel: '2023年10月7日',
        title: EDITORIAL['timeline.5.title'],
        what: [EDITORIAL['timeline.5.what.0']],
        why: EDITORIAL['timeline.5.why'],
        sourceIds: ['xinhua-2026'],
      },
      {
        id: 'resolution2728',
        date: '2024-03-25',
        dateLabel: '2024年3月25日',
        title: EDITORIAL['timeline.6.title'],
        what: [EDITORIAL['timeline.6.what.0']],
        why: EDITORIAL['timeline.6.why'],
        sourceIds: ['resolution'],
      },
      {
        id: 'ceasefire2025',
        date: '2025-10-10',
        dateLabel: '2025年10月10日',
        title: EDITORIAL['timeline.7.title'],
        what: [EDITORIAL['timeline.7.what.0']],
        why: EDITORIAL['timeline.7.why'],
        sourceIds: ['ceasefire'],
      },
      {
        id: 'one-year',
        date: '2026-10-15',
        dateLabel: '2026年10月15日',
        title: EDITORIAL['timeline.8.title'],
        what: [EDITORIAL['timeline.8.what.0']],
        why: EDITORIAL['timeline.8.why'],
        sourceIds: ['un-current', 'cri-current'],
      },
    ],
    perspectives: [
      {
        title: EDITORIAL['perspectives.0.title'],
        paragraphs: [
          EDITORIAL['perspectives.0.paragraphs.0'],
          EDITORIAL['perspectives.0.paragraphs.1'],
        ],
        sourceIds: ['xinhua-2026'],
      },
      {
        title: EDITORIAL['perspectives.1.title'],
        paragraphs: [
          EDITORIAL['perspectives.1.paragraphs.0'],
          EDITORIAL['perspectives.1.paragraphs.1'],
        ],
        sourceIds: ['resolution'],
      },
      {
        title: EDITORIAL['perspectives.2.title'],
        paragraphs: [
          EDITORIAL['perspectives.2.paragraphs.0'],
          EDITORIAL['perspectives.2.paragraphs.1'],
        ],
        sourceIds: ['un-current', 'cri-current'],
      },
    ],
    watch: [EDITORIAL['watch.0'], EDITORIAL['watch.1'], EDITORIAL['watch.2']],
    sources: [
      {
        id: 'un-timeline',
        title: '巴勒斯坦问题：历史时间线',
        publication: '联合国',
        date: '历史资料',
        url: 'https://www.un.org/unispal/zh/historical-timeline/',
      },
      {
        id: 'un-history',
        title: '巴勒斯坦问题的历史',
        publication: '联合国',
        date: '历史资料',
        url: 'https://www.un.org/unispal/zh/history/',
      },
      {
        id: 'cctv-history',
        title: '巴以冲突持续升级 · 新闻背景',
        publication: '央视网',
        date: '历史资料',
        url: 'https://news.cntv.cn/special/bayiconflict/index.shtml',
      },
      {
        id: 'xinhua-2026',
        title: '多点连线｜三年之后：巴以冲突改变了什么？',
        publication: '新华社',
        date: '2026-10-07',
        url: 'https://www.news.cn/20261007/a97f92f8bf3b4d64840626207f6d3d2f/c.html',
      },
      {
        id: 'resolution',
        title: '安全理事会第2728号决议：立即停火与人道援助',
        publication: '联合国安全理事会',
        date: '2024-03-25',
        url: 'https://www.un.org/unispal/document/sc-adopted-resolution-2728-2024-demanding-for-an-immediate-ceasefire-during-the-month-of-ramadan-25mar24/',
      },
      {
        id: 'ceasefire',
        title: '加沙停火 困局与出路｜深度国际',
        publication: 'CCTV中文',
        date: '2025-10-27',
        url: 'https://www.youtube.com/watch?v=1QGwJPhbNQY',
      },
      {
        id: 'cri-current',
        title: '深观察｜三年战火留下什么？加沙停火近一年仍前路渺茫',
        publication: '国际在线',
        date: '2026-10-07',
        url: 'https://news.cri.cn/20261007/ddbe6f55-5b3e-40ef-a4ff-bed4da0f3bb1.html',
      },
      {
        id: 'un-current',
        title: '联合国官员警告加沙重陷战争风险上升，呼吁重启真正和平进程',
        publication: '联合国新闻',
        date: '2026-10-15',
        url: 'https://www.un.org/zh/249214',
      },
      {
        id: 'xinhua-keywords',
        title: '新一轮巴以冲突七大关键词',
        publication: '新华社',
        date: '2023-10-30',
        url: 'https://www.xinhuanet.com/2023-10/30/c_1129948133.htm',
      },
      {
        id: 'oslo',
        title: '关于临时自治安排的原则声明（奥斯陆协定）',
        publication: '联合国文件库',
        date: '1993-09-13',
        url: 'https://www.un.org/unispal/document/auto-insert-180015/',
      },
      {
        id: 'final-status',
        title: 'Key issues at stake：最终地位谈判的关键问题',
        publication: '联合国巴勒斯坦问题资料',
        date: '常设背景资料',
        url: 'https://www.un.org/unispal/permanent-status-issues/',
      },
    ],
    relatedEventIds: ['global-risk-2026'],
    context: [
      {
        title: EDITORIAL['context.0.title'],
        paragraphs: [EDITORIAL['context.0.paragraphs.0'], EDITORIAL['context.0.paragraphs.1']],
        sourceIds: ['un-history', 'final-status'],
      },
      {
        title: EDITORIAL['context.1.title'],
        paragraphs: [EDITORIAL['context.1.paragraphs.0'], EDITORIAL['context.1.paragraphs.1']],
        sourceIds: ['xinhua-keywords', 'oslo'],
      },
      {
        title: EDITORIAL['context.2.title'],
        paragraphs: [EDITORIAL['context.2.paragraphs.0'], EDITORIAL['context.2.paragraphs.1']],
        sourceIds: ['xinhua-2026', 'resolution', 'un-current'],
      },
    ],
    excerpts: [
      {
        text: '立即无条件释放所有人质',
        sourceId: 'resolution',
        locator:
          '安理会第2728号决议，2024年3月25日，第1段，中文短语节引；同段还提出停火与扩大人道援助要求。',
      },
    ],
    questions: [
      {
        title: EDITORIAL['questions.0.title'],
        paragraphs: [EDITORIAL['questions.0.paragraphs.0']],
        sourceIds: ['xinhua-keywords', 'resolution'],
      },
      {
        title: EDITORIAL['questions.1.title'],
        paragraphs: [EDITORIAL['questions.1.paragraphs.0']],
        sourceIds: ['final-status', 'oslo'],
      },
      {
        title: EDITORIAL['questions.2.title'],
        paragraphs: [EDITORIAL['questions.2.paragraphs.0']],
        sourceIds: ['un-current', 'cri-current', 'resolution'],
      },
    ],
  },
};
export default story;
