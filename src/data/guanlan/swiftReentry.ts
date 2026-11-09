import { EDITORIAL, paragraphCopy } from '../../../.artifacts/editorial/guanlan/swiftReentry.ts';
import { GUANLAN_EVENTS } from './catalogue.ts';
import type { GuanlanEvent } from './types';

const event: GuanlanEvent = {
  ...GUANLAN_EVENTS.find((item) => item.id === 'swift-reentry-2026')!,
  recap: {
    title: EDITORIAL['recap.title'],
    paragraphs: paragraphCopy('recap.paragraphs'),
    sourceIds: ['reentry', 'mission'],
  },
  background: {
    title: EDITORIAL['background.title'],
    paragraphs: paragraphCopy('background.paragraphs'),
    sourceIds: ['reentry', 'mission'],
  },
  perspectives: [
    {
      title: EDITORIAL['views.0.title'],
      paragraphs: paragraphCopy('views.0.paragraphs'),
      sourceIds: ['reentry', 'mission'],
      level: '现象',
      keywords: ['及时预警', '多波段'],
    },
    {
      title: EDITORIAL['views.1.title'],
      paragraphs: paragraphCopy('views.1.paragraphs'),
      sourceIds: ['mission', 'apod'],
      level: '社会',
      keywords: ['科学档案', '重复核验'],
    },
    {
      title: EDITORIAL['views.2.title'],
      paragraphs: paragraphCopy('views.2.paragraphs'),
      sourceIds: ['apod', 'mission'],
      level: '思想',
      keywords: ['科学积累', '证据链'],
    },
  ],
  reconsiderations: [
    {
      title: EDITORIAL['rethink.title'],
      paragraphs: paragraphCopy('rethink.paragraphs'),
      sourceIds: ['reentry'],
    },
  ],
  sources: [
    {
      id: 'reentry',
      title: 'NASA’s Swift Observatory Re-Entered Atmosphere',
      author: 'Alise Fisher',
      publication: 'NASA Science',
      date: '2026-11-04（更新）',
      kind: '报道',
      url: 'https://science.nasa.gov/blogs/swift/2026/11/02/nasas-swift-observatory-to-re-enter-atmosphere/',
      description: EDITORIAL['sources.reentry.description'],
      digest: paragraphCopy('sources.reentry.digest'),
      importMode: 'paste',
    },
    {
      id: 'mission',
      title: 'NASA’s Swift Mission Ends, Leaves Behind Scientific Bonanza',
      author: 'NASA Science 任务团队',
      publication: 'NASA Science',
      date: '2026-10-23',
      kind: '报道',
      url: 'https://science.nasa.gov/missions/swift/nasas-swift-mission-ends/',
      description: EDITORIAL['sources.mission.description'],
      digest: paragraphCopy('sources.mission.digest'),
      importMode: 'paste',
    },
    {
      id: 'apod',
      title: 'A Farewell to Swift',
      author: 'Astronomy Picture of the Day',
      publication: 'NASA Science',
      date: '2026-11-06',
      kind: '评论',
      url: 'https://science.nasa.gov/image-article/apod-2026-november-6-a-farewell-to-swift/',
      description: EDITORIAL['sources.apod.description'],
      digest: paragraphCopy('sources.apod.digest'),
      importMode: 'paste',
    },
  ],
  relatedDailyIds: ['d148'],
  relatedQuoteIds: ['q118'],
};
export default event;
