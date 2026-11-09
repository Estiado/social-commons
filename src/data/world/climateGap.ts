import { EDITORIAL, paragraphCopy } from '../../../.artifacts/editorial/world/climateGap.ts';
import { WORLD_STORIES } from './catalogue.ts';
import type { WorldStory } from './types';

const story: WorldStory = {
  ...WORLD_STORIES.find((item) => item.id === 'cop31-climate-gap')!,
  intro: paragraphCopy('intro'),
  narrative: [
    {
      id: 'framework',
      title: EDITORIAL['chapters.framework.title'],
      paragraphs: paragraphCopy('chapters.framework.paragraphs'),
      sourceIds: ['convention', 'paris'],
      timelineIds: ['convention-1992', 'paris-2015', 'paris-2016'],
    },
    {
      id: 'emissions',
      title: EDITORIAL['chapters.emissions.title'],
      paragraphs: paragraphCopy('chapters.emissions.paragraphs'),
      sourceIds: ['emissions'],
      timelineIds: ['emissions-2026'],
    },
    {
      id: 'adaptation',
      title: EDITORIAL['chapters.adaptation.title'],
      paragraphs: paragraphCopy('chapters.adaptation.paragraphs'),
      sourceIds: ['adapt', 'wmo'],
      timelineIds: ['adaptation-2026'],
    },
    {
      id: 'october',
      title: EDITORIAL['chapters.october.title'],
      paragraphs: paragraphCopy('chapters.october.paragraphs'),
      sourceIds: ['c3s', 'carbon', 'paris'],
      timelineIds: ['october-2026'],
    },
    {
      id: 'antalya',
      title: EDITORIAL['chapters.antalya.title'],
      paragraphs: paragraphCopy('chapters.antalya.paragraphs'),
      sourceIds: ['xinhua', 'opening', 'wmo'],
      timelineIds: ['cop31-2026'],
    },
  ],
  context: [
    {
      title: EDITORIAL['context.0.title'],
      paragraphs: paragraphCopy('context.0.paragraphs'),
      sourceIds: ['convention', 'paris', 'opening'],
    },
    {
      title: EDITORIAL['context.1.title'],
      paragraphs: paragraphCopy('context.1.paragraphs'),
      sourceIds: ['c3s', 'carbon'],
    },
    {
      title: EDITORIAL['context.2.title'],
      paragraphs: paragraphCopy('context.2.paragraphs'),
      sourceIds: ['emissions', 'adapt'],
    },
  ],
  excerpts: [
    {
      text: 'pursuing efforts to limit the temperature increase to 1.5 °C above pre-industrial levels',
      sourceId: 'paris',
      locator: 'Article 2, paragraph 1(a)',
    },
  ],
  latest: paragraphCopy('latest'),
  terms: [
    { term: '国家自主贡献（NDC）', definition: EDITORIAL['terms.ndc'] },
    { term: '气温距平', definition: EDITORIAL['terms.anomaly'] },
    { term: '适应', definition: EDITORIAL['terms.adaptation'] },
  ],
  timeline: [
    {
      id: 'convention-1992',
      date: '1992-05-09',
      dateLabel: '1992年5月9日',
      title: EDITORIAL['timeline.convention-1992'],
      sourceIds: ['convention'],
    },
    {
      id: 'paris-2015',
      date: '2015-12-12',
      dateLabel: '2015年12月12日',
      title: EDITORIAL['timeline.paris-2015'],
      sourceIds: ['paris'],
    },
    {
      id: 'paris-2016',
      date: '2016-11-04',
      dateLabel: '2016年11月4日',
      title: EDITORIAL['timeline.paris-2016'],
      sourceIds: ['paris'],
    },
    {
      id: 'emissions-2026',
      date: '2026-10-21',
      dateLabel: '2026年10月21日',
      title: EDITORIAL['timeline.emissions-2026'],
      sourceIds: ['emissions'],
    },
    {
      id: 'adaptation-2026',
      date: '2026-11-04',
      dateLabel: '2026年11月4日',
      title: EDITORIAL['timeline.adaptation-2026'],
      sourceIds: ['adapt'],
    },
    {
      id: 'october-2026',
      date: '2026-11-05',
      dateLabel: '2026年11月5日',
      title: EDITORIAL['timeline.october-2026'],
      sourceIds: ['c3s'],
    },
    {
      id: 'cop31-2026',
      date: '2026-11-09',
      dateLabel: '2026年11月9日',
      title: EDITORIAL['timeline.cop31-2026'],
      sourceIds: ['opening', 'xinhua'],
    },
  ],
  perspectives: [
    {
      title: EDITORIAL['perspectives.0.title'],
      paragraphs: paragraphCopy('perspectives.0.paragraphs'),
      sourceIds: ['c3s', 'carbon'],
    },
    {
      title: EDITORIAL['perspectives.1.title'],
      paragraphs: paragraphCopy('perspectives.1.paragraphs'),
      sourceIds: ['adapt', 'wmo'],
    },
    {
      title: EDITORIAL['perspectives.2.title'],
      paragraphs: paragraphCopy('perspectives.2.paragraphs'),
      sourceIds: ['opening', 'xinhua', 'paris'],
    },
  ],
  questions: [
    {
      title: EDITORIAL['questions.0.title'],
      paragraphs: paragraphCopy('questions.0.paragraphs'),
      sourceIds: ['paris', 'c3s'],
    },
    {
      title: EDITORIAL['questions.1.title'],
      paragraphs: paragraphCopy('questions.1.paragraphs'),
      sourceIds: ['emissions', 'adapt'],
    },
    {
      title: EDITORIAL['questions.2.title'],
      paragraphs: paragraphCopy('questions.2.paragraphs'),
      sourceIds: ['opening', 'xinhua', 'adapt'],
    },
  ],
  watch: paragraphCopy('watch'),
  sources: [
    {
      id: 'convention',
      title: '《联合国气候变化框架公约》',
      publication: '联合国气候变化框架公约',
      date: '1992-05-09',
      url: 'https://unfccc.int/documents/649617',
    },
    {
      id: 'paris',
      title: '《巴黎协定》及通过决定',
      publication: '联合国气候变化框架公约',
      date: '2015-12-12 通过',
      url: 'https://unfccc.int/sites/default/files/parisagreement_publication.pdf',
    },
    {
      id: 'emissions',
      title: 'Emissions Gap Report 2026',
      publication: '联合国环境规划署',
      date: '2026-10-21',
      url: 'https://www.unep.org/en/publications/report/emissions-gap-report-2026',
    },
    {
      id: 'adapt',
      title: 'Adaptation Gap Report 2026 发布会',
      publication: '联合国环境规划署',
      date: '2026-11-04',
      url: 'https://www.unep.org/en/events/press-conference/press-conference-official-launch-adaptation-gap-report-2026',
    },
    {
      id: 'carbon',
      title: 'State of the climate: 2026 likely to tie with 2024 as the warmest year on record',
      publication: 'Carbon Brief',
      date: '2026-11-03',
      url: 'https://www.carbonbrief.org/state-of-the-climate-2026-likely-to-tie-with-2024-as-the-warmest-year-on-record',
      author: 'Zeke Hausfather',
    },
    {
      id: 'c3s',
      title: 'Surface air temperature for October 2026',
      publication: '哥白尼气候变化服务',
      date: '2026-11-05',
      url: 'https://climate.copernicus.eu/surface-air-temperature-october-2026',
    },
    {
      id: 'wmo',
      title: 'World Meteorological Organization activities during COP31',
      publication: '世界气象组织',
      date: '2026-11-03',
      url: 'https://wmo.int/media/announcement/world-meteorological-organization-activities-during-cop31',
    },
    {
      id: 'opening',
      title: 'Arrangements for the Opening of COP 31',
      publication: '联合国气候变化框架公约',
      date: '2026-11-05',
      url: 'https://unfccc.int/cop31/observer-organizations',
    },
    {
      id: 'xinhua',
      title: '新华社安塔利亚 COP31 会前报道',
      publication: '新华社',
      date: '2026-11-09',
      url: 'https://www.news.cn/world/20261109/51dfc0e9e3b042a0bb50d39ec3e8b661/c.html',
    },
  ],
  relatedEventIds: ['cop31-november-2026'],
};
export default story;
