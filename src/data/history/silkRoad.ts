import { EDITORIAL } from '../../../.artifacts/editorial/history/silkRoad.ts';
import type { IEvent } from '../types';

export const SILK_ROAD_EVENT: IEvent = {
  id: 'silk-road',
  title: '丝绸之路：商路、绿洲与求法者',
  date: '古代至中世纪；汉唐时期陆路交流尤为活跃',
  location: '东亚、中亚、西亚、地中海与相关海域',
  category: '世界历史 · 文明交流史',
  summary: EDITORIAL['SILK_ROAD_EVENT.summary'],
  summarySources: [
    {
      title: '联合国教科文组织：认识丝绸之路',
      url: 'https://www.unesco.org/en/silk-roads/about-silk-roads',
    },
  ],
  perspectives: [
    {
      id: 's1',
      role: '联合国教科文组织的交流史叙述',
      title: '道路带动的不只是丝绸买卖',
      description: EDITORIAL['SILK_ROAD_EVENT.perspectives.s1.description'],
      quote: '吸引旅行者的，不仅有贸易，也有知识和文化的交流。',
      original:
        'Travellers along the Silk Roads were attracted not only by trade but also by the intellectual and cultural exchange',
      source: 'UNESCO Silk Roads Programme：About the Silk Roads',
      sourceType: '后世研究',
      sourceUrl: 'https://www.unesco.org/en/silk-roads/about-silk-roads',
      locator: '“Beyond Silk”及文化交流相关段落',
    },
    {
      id: 's3',
      role: 'Valerie Hansen 的地方社会研究',
      title: '把绿洲居民放回商路的中心',
      description: EDITORIAL['SILK_ROAD_EVENT.perspectives.s3.description'],
      quote: '这些商路沿线居民的生活是什么样的？',
      original: 'What was life like for the people who lived along the Silk Road?',
      source:
        'Valerie Hansen，The Impact of the Silk Road Trade on a Local Community: The Turfan Oasis, 500–800，2005，载 Les Sogdiens en Chine',
      sourceType: '后世研究',
      sourceUrl: 'https://history.yale.edu/sites/default/files/files/hansen-silk-road-trade.pdf',
      locator: '第283—285页，开篇及三类居民的划分',
      readingId: 'hansen-turfan',
    },
    {
      id: 's2',
      role: '法显的旅行记',
      title: '对求法者而言，道路首先意味着艰难的行旅',
      description: EDITORIAL['SILK_ROAD_EVENT.perspectives.s2.description'],
      quote: '仰望天空看不到飞鸟，俯察地面看不到走兽。',
      original:
        'There is not a bird to be seen in the air above, nor an animal on the ground below.',
      source: '法显《佛国记》；James Legge 英译 A Record of Buddhistic Kingdoms，1886',
      sourceType: '史料记载',
      sourceUrl: 'https://www.gutenberg.org/ebooks/2124',
      locator: '第一章，敦煌之后的沙漠行旅',
      readingId: 'faxian-kingdoms',
    },
  ],
  academicPapers: [],
  references: [],
};
