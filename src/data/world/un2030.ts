import { EDITORIAL } from '../../../.artifacts/editorial/world/un2030.ts';
import type { WorldStory } from './types';
import { WORLD_STORIES } from './catalogue.ts';

const story: WorldStory = {
  ...WORLD_STORIES.find((item) => item.id === 'un-2030')!,
  ...{
    intro: [EDITORIAL['intro.0'], EDITORIAL['intro.1']],
    latest: [EDITORIAL['latest.0'], EDITORIAL['latest.1']],
    terms: [
      { term: EDITORIAL['terms.0.term'], definition: EDITORIAL['terms.0.definition'] },
      { term: EDITORIAL['terms.1.term'], definition: EDITORIAL['terms.1.definition'] },
      { term: EDITORIAL['terms.2.term'], definition: EDITORIAL['terms.2.definition'] },
      { term: EDITORIAL['terms.3.term'], definition: EDITORIAL['terms.3.definition'] },
      { term: EDITORIAL['terms.4.term'], definition: EDITORIAL['terms.4.definition'] },
    ],
    timeline: [
      {
        id: 'mdg',
        date: '2000-09-01',
        dateLabel: '2000年9月',
        title: EDITORIAL['timeline.0.title'],
        sourceIds: ['xinhua-background'],
      },
      {
        id: 'adopt',
        date: '2015-09-25',
        dateLabel: '2015年9月25日',
        title: EDITORIAL['timeline.1.title'],
        sourceIds: ['agenda', 'xinhua-background'],
      },
      {
        id: 'begin',
        date: '2016-01-01',
        dateLabel: '2016年1月',
        title: EDITORIAL['timeline.2.title'],
        sourceIds: ['faq', 'goals'],
      },
      {
        id: 'midpoint',
        date: '2023-09-18',
        dateLabel: '2023年9月18日至19日',
        title: EDITORIAL['timeline.3.title'],
        sourceIds: ['summit'],
      },
      {
        id: 'future-pact',
        date: '2024-09-22',
        dateLabel: '2024年9月22日',
        title: EDITORIAL['timeline.4.title'],
        sourceIds: ['pact'],
      },
      {
        id: 'progress2026',
        date: '2026-07-07',
        dateLabel: '2026年7月7日',
        title: EDITORIAL['timeline.5.title'],
        sourceIds: ['xinhua-progress', 'un-progress'],
      },
      {
        id: 'risk2026',
        date: '2026-09-15',
        dateLabel: '2026年9月15日',
        title: EDITORIAL['timeline.6.title'],
        sourceIds: ['risk-news'],
      },
    ],
    perspectives: [
      {
        title: EDITORIAL['perspectives.0.title'],
        paragraphs: [
          EDITORIAL['perspectives.0.paragraphs.0'],
          EDITORIAL['perspectives.0.paragraphs.1'],
        ],
        sourceIds: ['xinhua-progress'],
      },
      {
        title: EDITORIAL['perspectives.1.title'],
        paragraphs: [
          EDITORIAL['perspectives.1.paragraphs.0'],
          EDITORIAL['perspectives.1.paragraphs.1'],
        ],
        sourceIds: ['un-progress'],
      },
      {
        title: EDITORIAL['perspectives.2.title'],
        paragraphs: [
          EDITORIAL['perspectives.2.paragraphs.0'],
          EDITORIAL['perspectives.2.paragraphs.1'],
        ],
        sourceIds: ['pact', 'risk-news'],
      },
    ],
    watch: [EDITORIAL['watch.0'], EDITORIAL['watch.1'], EDITORIAL['watch.2']],
    sources: [
      {
        id: 'xinhua-background',
        title: '新闻背景：2030年可持续发展议程',
        publication: '新华社',
        date: '2016-09-20',
        url: 'https://www.xinhuanet.com/world/2016-09/20/c_1119595242.htm',
      },
      {
        id: 'goals',
        title: 'The Sustainable Development Goals',
        publication: '联合国可持续发展',
        date: '常设资料',
        url: 'https://www.un.org/sustainabledevelopment/development-goals/',
      },
      {
        id: 'summit',
        title: '2023年可持续发展高级别政治论坛政治宣言',
        publication: '联合国',
        date: '2023-09-18',
        url: 'https://www.un.org/zh/node/234473',
      },
      {
        id: 'pact',
        title: '《未来契约》与两个附件',
        publication: '联合国',
        date: '2024-09-22',
        url: 'https://www.un.org/zh/node/222205',
      },
      {
        id: 'xinhua-progress',
        title: '联合国报告：可持续发展目标进展缓慢',
        publication: '新华社',
        date: '2026-07-08',
        url: 'https://www.xinhuanet.com/20260708/aeee6377f6814a56b3d7256afb47e69f/c.html',
      },
      {
        id: 'un-progress',
        title: 'The Sustainable Development Goals Report 2026',
        publication: '联合国统计司',
        date: '2026-07-07',
        url: 'https://unstats.un.org/sdgs/report/2026/',
      },
      {
        id: 'risk-news',
        title: '联合国报告：大规模战争在全球风险排名中迅速攀升',
        publication: '新华社',
        date: '2026-09-16',
        url: 'https://www.xinhuanet.com/20260916/7e49cfe6a05b4e9b905999717ca93726/c.html',
      },
      {
        id: 'agenda',
        title: '变革我们的世界：2030年可持续发展议程（第70/1号决议）',
        publication: '联合国大会',
        date: '2015-09-25',
        url: 'https://www.un.org/en/node/182243',
      },
      {
        id: 'faq',
        title: '可持续发展议程：目标、执行与约束力问答',
        publication: '联合国可持续发展',
        date: '常设问答',
        url: 'https://www.un.org/sustainabledevelopment/zh/development-agenda/',
      },
      {
        id: 'progress-release',
        title: 'For over a decade, the Sustainable Development Goals have delivered results',
        publication: '联合国2026年可持续发展目标报告发布资料',
        date: '2026-07-07',
        url: 'https://www.un.org/sw/node/245382',
      },
    ],
    relatedEventIds: ['global-risk-2026'],
    context: [
      {
        title: EDITORIAL['context.0.title'],
        paragraphs: [EDITORIAL['context.0.paragraphs.0'], EDITORIAL['context.0.paragraphs.1']],
        sourceIds: ['agenda', 'faq', 'un-progress'],
      },
      {
        title: EDITORIAL['context.1.title'],
        paragraphs: [EDITORIAL['context.1.paragraphs.0'], EDITORIAL['context.1.paragraphs.1']],
        sourceIds: ['faq', 'agenda'],
      },
      {
        title: EDITORIAL['context.2.title'],
        paragraphs: [EDITORIAL['context.2.paragraphs.0'], EDITORIAL['context.2.paragraphs.1']],
        sourceIds: ['un-progress', 'faq'],
      },
    ],
    excerpts: [
      {
        text: '不让任何一个人掉队',
        sourceId: 'agenda',
        locator: '《变革我们的世界：2030年可持续发展议程》，联大第70/1号决议，宣言第4段，节引。',
      },
    ],
    questions: [
      {
        title: EDITORIAL['questions.0.title'],
        paragraphs: [EDITORIAL['questions.0.paragraphs.0']],
        sourceIds: ['agenda', 'faq'],
      },
      {
        title: EDITORIAL['questions.1.title'],
        paragraphs: [EDITORIAL['questions.1.paragraphs.0']],
        sourceIds: ['faq', 'un-progress'],
      },
      {
        title: EDITORIAL['questions.2.title'],
        paragraphs: [EDITORIAL['questions.2.paragraphs.0']],
        sourceIds: ['agenda', 'goals'],
      },
    ],
    narrative: [
      {
        id: 'from-mdgs-to-sdgs',
        title: EDITORIAL['narrative.0.title'],
        paragraphs: [
          EDITORIAL['narrative.0.paragraphs.0'],
          EDITORIAL['narrative.0.paragraphs.1'],
          EDITORIAL['narrative.0.paragraphs.2'],
          EDITORIAL['narrative.0.paragraphs.3'],
          EDITORIAL['narrative.0.paragraphs.4'],
        ],
        sourceIds: ['xinhua-background', 'agenda', 'goals'],
        timelineIds: ['mdg', 'adopt'],
      },
      {
        id: 'implementation-chain',
        title: EDITORIAL['narrative.1.title'],
        paragraphs: [
          EDITORIAL['narrative.1.paragraphs.0'],
          EDITORIAL['narrative.1.paragraphs.1'],
          EDITORIAL['narrative.1.paragraphs.2'],
          EDITORIAL['narrative.1.paragraphs.3'],
          EDITORIAL['narrative.1.paragraphs.4'],
        ],
        sourceIds: ['faq', 'agenda', 'goals'],
        timelineIds: ['begin'],
      },
      {
        id: 'finance-and-shocks',
        title: EDITORIAL['narrative.2.title'],
        paragraphs: [
          EDITORIAL['narrative.2.paragraphs.0'],
          EDITORIAL['narrative.2.paragraphs.1'],
          EDITORIAL['narrative.2.paragraphs.2'],
          EDITORIAL['narrative.2.paragraphs.3'],
          EDITORIAL['narrative.2.paragraphs.4'],
        ],
        sourceIds: ['summit', 'pact', 'faq', 'un-progress'],
        timelineIds: ['midpoint', 'future-pact'],
      },
      {
        id: 'reading-the-data',
        title: EDITORIAL['narrative.3.title'],
        paragraphs: [
          EDITORIAL['narrative.3.paragraphs.0'],
          EDITORIAL['narrative.3.paragraphs.1'],
          EDITORIAL['narrative.3.paragraphs.2'],
          EDITORIAL['narrative.3.paragraphs.3'],
          EDITORIAL['narrative.3.paragraphs.4'],
        ],
        sourceIds: ['xinhua-progress', 'un-progress', 'progress-release'],
        timelineIds: ['progress2026'],
      },
      {
        id: 'risk-and-development',
        title: EDITORIAL['narrative.4.title'],
        paragraphs: [
          EDITORIAL['narrative.4.paragraphs.0'],
          EDITORIAL['narrative.4.paragraphs.1'],
          EDITORIAL['narrative.4.paragraphs.2'],
          EDITORIAL['narrative.4.paragraphs.3'],
        ],
        sourceIds: ['risk-news', 'un-progress', 'pact'],
        timelineIds: ['risk2026'],
      },
    ],
  },
};
export default story;
