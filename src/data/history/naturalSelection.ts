import type { IEvent } from '../types';

const paper = 'https://darwin-online.org.uk/converted/published/1858_species_F350.html';

export const NATURAL_SELECTION_EVENT: IEvent = {
  id: 'darwin-wallace-1858',
  title: '达尔文与华莱士：自然选择怎样进入公共讨论',
  date: '1858年7月1日联合宣读；1859年《物种起源》初版出版',
  location: '伦敦林奈学会；英国与马来群岛的通信网络',
  category: '科学与自然',
  summary:
    '19世纪中叶，达尔文在长期观察、育种研究和通信中形成了以自然选择解释物种变化的思路。1858年，正在马来群岛考察的华莱士将一篇讨论变种如何偏离原型的文章寄给他，两人的解释有重要相似之处。莱尔和胡克整理达尔文早期手稿、致 Asa Gray 的文字与华莱士的论文，于7月1日在伦敦林奈学会共同宣读。1859年，达尔文出版《物种起源》，更系统地展开变异、选择、地理分布与共同祖先等论证。这一过程依靠长期记录、跨地通信与公开发表，不能缩成某一刻突然想通的故事。1858年的文本也不等于今天的全部进化生物学，其中有关遗传等问题的认识仍有当时的局限。',
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
      description:
        '达尔文从个体差异、环境变化和后代存活的差别展开解释。他把育种者积累差异的经验与自然条件下的选择相比较，并将时间尺度延长到许多世代。这一视角关注可遗传差异与生存、繁殖的关系，而不是个体主动决定变成另一种生物。',
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
      description:
        '华莱士比较野生动物与家养动物的处境，讨论变种是否一定返回原型。他特别指出，物理环境变化可能使先前占优的类型变得不利。适应因此与具体条件相关，不能把“较适应”理解成脱离环境、永远不变的高低等级。',
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
        '莱尔与胡克在发表说明中承认两位自然研究者独立形成解释，列出达尔文早期手稿、1857年文字和华莱士文章的时间线，并说明共同提交的安排。与理论内部的论证相比，这段文字呈现知识如何通过书信、见证者与学会程序进入公开交流。',
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
