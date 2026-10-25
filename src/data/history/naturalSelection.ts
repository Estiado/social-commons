import { EDITORIAL } from '../../../.artifacts/editorial/history/naturalSelection.ts';
import type { IEvent } from '../types';

const paper = 'https://darwin-online.org.uk/converted/published/1858_species_F350.html';

export const NATURAL_SELECTION_EVENT: IEvent = {
  id: 'darwin-wallace-1858',
  title: '达尔文与华莱士：自然选择怎样进入公共讨论',
  date: '1858年7月1日联合宣读；1859年《物种起源》初版出版',
  location: '伦敦林奈学会；英国与马来群岛的通信网络',
  category: '科学与自然',
  summary: EDITORIAL['NATURAL_SELECTION_EVENT.summary'],
  summarySources: [
    {
      title: '林奈学会：1858年达尔文—华莱士论文宣读160周年',
      url: 'https://www.linnean.org/news/2018/07/01/1st-july-2018-160th-anniversary-of-the-presentation-of-on-the-tendency-of-species-to-form-varieties',
    },
    { title: 'Darwin Online：1858年联合发表文本及版本记录', url: paper },
  ],
  perspectives: [
    {
      id: 'selection-darwin',
      role: '达尔文的论证',
      title: '细微差异怎样在许多世代中积累',
      description: EDITORIAL['NATURAL_SELECTION_EVENT.perspectives.selection-darwin.description'],
      quote: '每年出生的个体多于能够存活的数量。',
      translated: true,
      original: 'Yearly more are bred than can survive;',
      source: 'Charles Darwin：1858年联合发表文本，第I部分，原刊第49页',
      sourceType: '史料记载',
      sourceUrl: paper,
      locator: '第I部分，第49页，以 Yearly more are bred 开头的句子',
      readingId: 'darwin-origin-first',
    },
    {
      id: 'selection-wallace',
      role: '华莱士的论证',
      title: '环境改变时，原来的优势也可能改变',
      description: EDITORIAL['NATURAL_SELECTION_EVENT.perspectives.selection-wallace.description'],
      quote: '不过，我们并不主张这种结果一成不变。',
      translated: true,
      original: 'It is not, however, contended that this result would be invariable;',
      source:
        'Alfred Russel Wallace：On the Tendency of Varieties to depart indefinitely from the Original Type，1858',
      sourceType: '史料记载',
      sourceUrl: paper,
      locator: '第III部分，第59页，以 It is not, however 开头的段落',
      readingId: 'darwin-wallace-paper',
    },
    {
      id: 'selection-lyell-hooker',
      role: '莱尔与胡克的发表说明',
      title: '独立提出的想法，怎样共同进入科学交流',
      description:
        EDITORIAL['NATURAL_SELECTION_EVENT.perspectives.selection-lyell-hooker.description'],
      quote: '两人都可以合理地主张，自己是这一重要研究方向上的独创思考者。',
      translated: true,
      original:
        'may both fairly claim the merit of being original thinkers in this important line of inquiry',
      source: 'Charles Lyell、Joseph Dalton Hooker：1858年6月30日提交说明',
      sourceType: '史料记载',
      sourceUrl: paper,
      locator: '联合发表文本开篇提交说明，第45页',
      readingId: 'darwin-wallace-paper',
    },
  ],
  academicPapers: [],
  references: [
    { title: '达尔文《物种起源》1859年初版英文全本', url: 'https://www.gutenberg.org/ebooks/1228' },
  ],
};
