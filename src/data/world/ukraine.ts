import { EDITORIAL } from '../../../.artifacts/editorial/world/ukraine.ts';
import type { WorldStory } from './types';
import { WORLD_STORIES } from './catalogue.ts';
const detail = {
  intro: [EDITORIAL['intro.0'], EDITORIAL['intro.1']],
  latest: [EDITORIAL['latest.0'], EDITORIAL['latest.1']],
  terms: [
    {
      term: '顿巴斯',
      definition: EDITORIAL['terms.0.definition'],
    },
    {
      term: '明斯克协议',
      definition: EDITORIAL['terms.1.definition'],
    },
    {
      term: '安全保障',
      definition: EDITORIAL['terms.2.definition'],
    },
    {
      term: '人道主义停火',
      definition: EDITORIAL['terms.3.definition'],
    },
  ],
  timeline: [
    {
      id: 'donbas',
      date: '2014-03-01',
      dateLabel: '2014年春',
      title: EDITORIAL['timeline.0.title'],
      what: [EDITORIAL['timeline.0.what.0']],
      why: EDITORIAL['timeline.0.why'],
      sourceIds: ['background', 'territory'],
    },
    {
      id: 'minsk-one',
      date: '2014-09-05',
      dateLabel: '2014年9月',
      title: EDITORIAL['timeline.1.title'],
      what: [EDITORIAL['timeline.1.what.0']],
      why: EDITORIAL['timeline.1.why'],
      sourceIds: ['background'],
    },
    {
      id: 'minsk-two',
      date: '2015-02-12',
      dateLabel: '2015年2月',
      title: EDITORIAL['timeline.2.title'],
      what: [EDITORIAL['timeline.2.what.0']],
      why: EDITORIAL['timeline.2.why'],
      sourceIds: ['background'],
    },
    {
      id: 'recognition',
      date: '2022-02-21',
      dateLabel: '2022年2月21日',
      title: EDITORIAL['timeline.3.title'],
      what: [EDITORIAL['timeline.3.what.0']],
      why: EDITORIAL['timeline.3.why'],
      sourceIds: ['background'],
    },
    {
      id: 'full-war',
      date: '2022-02-24',
      dateLabel: '2022年2月24日',
      title: EDITORIAL['timeline.4.title'],
      what: [EDITORIAL['timeline.4.what.0']],
      why: EDITORIAL['timeline.4.why'],
      sourceIds: ['war'],
    },
    {
      id: 'grain-start',
      date: '2022-07-22',
      dateLabel: '2022年7月22日',
      title: EDITORIAL['timeline.5.title'],
      what: [EDITORIAL['timeline.5.what.0']],
      why: EDITORIAL['timeline.5.why'],
      sourceIds: ['grain'],
    },
    {
      id: 'grain-end',
      date: '2023-07-17',
      dateLabel: '2023年7月17日',
      title: EDITORIAL['timeline.6.title'],
      what: [EDITORIAL['timeline.6.what.0']],
      why: EDITORIAL['timeline.6.why'],
      sourceIds: ['grain'],
    },
    {
      id: 'un-debate',
      date: '2026-02-24',
      dateLabel: '2026年2月24日',
      title: EDITORIAL['timeline.7.title'],
      what: [EDITORIAL['timeline.7.what.0']],
      why: EDITORIAL['timeline.7.why'],
      sourceIds: ['un-debate'],
    },
    {
      id: 'talks-signal',
      date: '2026-10-25',
      dateLabel: '2026年10月25日',
      title: EDITORIAL['timeline.8.title'],
      what: [EDITORIAL['timeline.8.what.0']],
      why: EDITORIAL['timeline.8.why'],
      sourceIds: ['latest'],
    },
  ],
  perspectives: [
    {
      title: EDITORIAL['perspectives.0.title'],
      paragraphs: [
        EDITORIAL['perspectives.0.paragraphs.0'],
        EDITORIAL['perspectives.0.paragraphs.1'],
      ],
      sourceIds: ['latest'],
    },
    {
      title: EDITORIAL['perspectives.1.title'],
      paragraphs: [
        EDITORIAL['perspectives.1.paragraphs.0'],
        EDITORIAL['perspectives.1.paragraphs.1'],
      ],
      sourceIds: ['un-debate'],
    },
    {
      title: EDITORIAL['perspectives.2.title'],
      paragraphs: [
        EDITORIAL['perspectives.2.paragraphs.0'],
        EDITORIAL['perspectives.2.paragraphs.1'],
      ],
      sourceIds: ['grain'],
    },
  ],
  watch: [EDITORIAL['watch.0'], EDITORIAL['watch.1'], EDITORIAL['watch.2']],
  sources: [
    {
      id: 'territory',
      title: '联大第68/262号决议：乌克兰领土完整',
      publication: '联合国大会',
      date: '2014-03-27',
      url: 'https://www.un.org/en/ga/68/resolutions.shtml',
    },
    {
      id: 'background',
      title: '乌克兰危机来龙去脉',
      publication: '新华社',
      date: '2022-02-23',
      url: 'https://www.xinhuanet.com/world/2022-02/23/c_1211584373.htm',
    },
    {
      id: 'war',
      title: '全球连线｜普京决定“行动” 乌克兰进入战时状态',
      publication: '新华社',
      date: '2022-02-24',
      url: 'https://www.xinhuanet.com/world/2022-02/24/c_1128412358.htm',
    },
    {
      id: 'grain',
      title: 'Black Sea Grain Initiative · Frequently asked questions',
      publication: '联合国',
      date: '机制运行：2022—2023年',
      url: 'https://www.un.org/en/black-sea-grain-initiative/faq',
    },
    {
      id: 'un-debate',
      title: '安全理事会第10110次会议逐字记录 S/PV.10110',
      publication: '联合国安全理事会',
      date: '2026-02-24',
      url: 'https://documents.un.org/doc/undoc/pro/n26/032/95/pdf/n2603295.pdf',
    },
    {
      id: 'latest',
      title: '俄美乌三方谈判在即：人道停火释放积极信号但难破局',
      publication: '总台央视新闻 · 国际在线',
      date: '2026-10-26',
      url: 'https://news.cri.cn/20261026/4cf2fded-aa82-42fe-9856-911bfef2dfbd.html',
    },
  ],
  relatedEventIds: ['global-risk-2026'],
};
const story: WorldStory = { ...WORLD_STORIES.find((s) => s.id === 'ukraine')!, ...detail };
export default story;
