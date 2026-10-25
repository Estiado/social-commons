import { EDITORIAL, paragraphCopy } from '../../../.artifacts/editorial/guanlan/facebookEmotion.ts';
import type { GuanlanEvent } from './types';
import { GUANLAN_EVENTS } from './catalogue.ts';

const event: GuanlanEvent = {
  ...GUANLAN_EVENTS.find((item) => item.id === 'facebook-emotion')!,
  recap: {
    sourceIds: ['experiment', 'concern'],
    title: EDITORIAL['event.recap.title'],
    paragraphs: paragraphCopy('event.recap.paragraphs'),
  },
  background: {
    sourceIds: ['ethics', 'concern'],
    title: EDITORIAL['event.background.title'],
    paragraphs: paragraphCopy('event.background.paragraphs'),
  },
  perspectives: [
    {
      sourceIds: ['experiment'],
      keywords: ['实验', '文本测量', '因果识别'],
      level: '现象',
      title: EDITORIAL['event.perspectives.0.title'],
      paragraphs: paragraphCopy('event.perspectives.0.paragraphs'),
    },
    {
      sourceIds: ['concern'],
      keywords: ['知情同意', '退出', '参与者'],
      level: '社会',
      title: EDITORIAL['event.perspectives.1.title'],
      paragraphs: paragraphCopy('event.perspectives.1.paragraphs'),
    },
    {
      sourceIds: ['ethics'],
      keywords: ['透明', '研究边界', '信任'],
      level: '思想',
      title: EDITORIAL['event.perspectives.2.title'],
      paragraphs: paragraphCopy('event.perspectives.2.paragraphs'),
    },
  ],
  reconsiderations: [
    {
      sourceIds: ['concern', 'ethics'],
      title: EDITORIAL['event.reconsiderations.0.title'],
      paragraphs: paragraphCopy('event.reconsiderations.0.paragraphs'),
    },
    {
      sourceIds: ['experiment', 'concern'],
      title: EDITORIAL['event.reconsiderations.1.title'],
      paragraphs: paragraphCopy('event.reconsiderations.1.paragraphs'),
    },
  ],
  sources: [
    {
      id: 'experiment',
      title: 'Experimental evidence of massive-scale emotional contagion through social networks',
      author: 'Adam D. I. Kramer、Jamie E. Guillory、Jeffrey T. Hancock',
      publication: 'PNAS 111(24):8788–8790',
      date: '2014-06',
      kind: '研究',
      url: 'https://doi.org/10.1073/pnas.1320040111',
      fullText: {
        title:
          'Experimental evidence of massive-scale emotional contagion through social networks · 电子版',
        url: 'https://www.pnas.org/content/pnas/111/24/8788.full.pdf',
      },
      description: EDITORIAL['event.sources.experiment.description'],
      digest: paragraphCopy('event.sources.experiment.digest'),
    },
    {
      id: 'concern',
      title:
        'Editorial Expression of Concern: Experimental evidence of massive-scale emotional contagion through social networks',
      author: 'PNAS编辑部',
      publication: 'PNAS 111(29):10779',
      date: '2014-07-22',
      kind: '评论',
      importMode: 'paste',
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4115552/',
      description: EDITORIAL['event.sources.concern.description'],
      digest: paragraphCopy('event.sources.concern.digest'),
    },
    {
      id: 'ethics',
      title: 'Do research ethics need updating for the digital age?',
      author: 'Michael W. Ross',
      publication: 'Monitor on Psychology 45(9):64',
      date: '2014-10',
      kind: '评论',
      importMode: 'paste',
      url: 'https://www.apa.org/monitor/2014/10/research-ethics',
      description: EDITORIAL['event.sources.ethics.description'],
      digest: paragraphCopy('event.sources.ethics.digest'),
    },
  ],
  relatedDailyIds: ['d116', 'd122', 'd130'],
  relatedQuoteIds: ['q99', 'q105'],
};

export default event;
