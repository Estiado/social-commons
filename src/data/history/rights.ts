import { EDITORIAL } from '../../../.artifacts/editorial/history/rights.ts';
import type { IEvent } from '../types';

export const RIGHTS_EVENTS: IEvent[] = [
  {
    id: 'declaration-1776',
    title: '1776年独立宣言：平等的承诺与被排除的人',
    date: '1776年及其后续争论',
    location: '北美十三殖民地与美国',
    category: '政治与权利',
    summary: EDITORIAL['RIGHTS_EVENTS.declaration-1776.summary'],
    summarySources: [
      {
        title: '美国国家档案馆：《独立宣言》历史与原件',
        url: 'https://www.archives.gov/milestone-documents/declaration-of-independence',
      },
      {
        title: '美国国家公园管理局：《独立宣言》概览',
        url: 'https://www.nps.gov/inde/learn/education/classrooms/resources-declarationoverview.htm',
      },
    ],
    perspectives: [
      {
        id: 'declaration-consent',
        role: '大陆会议通过的政治宣言',
        title: '权力的正当性来自哪里',
        description:
          EDITORIAL['RIGHTS_EVENTS.declaration-1776.perspectives.declaration-consent.description'],
        quote: '政府的正当权力，来自被统治者的同意。',
        original: 'deriving their just powers from the consent of the governed',
        source: '《独立宣言》，1776；美国国家档案馆转录本',
        sourceType: '史料记载',
        sourceUrl: 'https://www.archives.gov/founding-docs/declaration-transcript',
        locator: '第二段：政府与权利',
        readingId: 'declaration-transcript',
      },
      {
        id: 'adams-ladies',
        role: '阿比盖尔·亚当斯，书信作者',
        title: '新法律应当记住女性',
        description:
          EDITORIAL['RIGHTS_EVENTS.declaration-1776.perspectives.adams-ladies.description'],
        quote: '记住女性，要比你们的祖先待她们更宽厚、更有利。',
        original:
          'Remember the Ladies, and be more generous and favourable to them than your ancestors.',
        source: 'Abigail Adams 致 John Adams，1776-03-31—04-05；马萨诸塞历史学会电子档案',
        sourceType: '史料记载',
        sourceUrl:
          'https://chnm.gmu.edu/mcpstah/wordpress/wp-content/themes/tah/files/adams_remember-the-ladies_1776.pdf',
        locator: '电子版第2页，Remember the Ladies 段',
        readingId: 'adams-ladies',
      },
      {
        id: 'douglass-july',
        role: '弗雷德里克·道格拉斯，废奴主义者',
        title: '谁能够共享独立的喜悦',
        description:
          EDITORIAL['RIGHTS_EVENTS.declaration-1776.perspectives.douglass-july.description'],
        quote: '这个七月四日是你们的，不是我的。',
        original: 'This Fourth of July is yours, not mine.',
        source:
          'Frederick Douglass，What to the Slave Is the Fourth of July?；美国国家公园管理局引录',
        sourceType: '史料记载',
        sourceUrl:
          'https://www.nps.gov/inde/learn/education/classrooms/resources-declarationoverview.htm',
        locator: '概览中关于1852年演说的一节',
      },
    ],
    academicPapers: [],
    references: [],
  },
  {
    id: 'udhr-1948',
    title: '1948年世界人权宣言：共同尺度怎样进入日常生活',
    date: '1948年12月10日',
    location: '巴黎，联合国大会',
    category: '政治与权利',
    summary: EDITORIAL['RIGHTS_EVENTS.udhr-1948.summary'],
    summarySources: [
      {
        title: '联合国：《宣言》的历史',
        url: 'https://www.un.org/en/about-us/udhr/history-of-the-declaration',
      },
      {
        title: '联合国图书馆：《世界人权宣言》起草委员会',
        url: 'https://research.un.org/en/undhr/draftingcommittee',
      },
    ],
    perspectives: [
      {
        id: 'udhr-dignity',
        role: '联合国大会通过的宣言',
        title: '尊严与权利的共同起点',
        description: EDITORIAL['RIGHTS_EVENTS.udhr-1948.perspectives.udhr-dignity.description'],
        quote:
          '人人生而自由，在尊严和权利上一律平等。他们赋有理性和良心，并应以兄弟关系的精神相对待。',
        translated: false,
        original: 'All human beings are born free and equal in dignity and rights.',
        source: '《世界人权宣言》第一条，联合国中文本',
        sourceType: '史料记载',
        sourceUrl:
          'https://2017-2021.state.gov/wp-content/uploads/2020/04/CHN-Universal-Declaration-of-Human-Rights.pdf',
        locator: '第一条',
        readingId: 'udhr-chinese',
      },
      {
        id: 'santa-cruz',
        role: '埃尔南·圣克鲁斯，起草分委员会成员',
        title: '人的价值不以权力的授予为起点',
        description: EDITORIAL['RIGHTS_EVENTS.udhr-1948.perspectives.santa-cruz.description'],
        quote: '人的至高价值，不是源自世俗权力的决定，而是源自存在本身。',
        original:
          'a value that did not originate in the decision of a worldly power, but rather in the fact of existing',
        source: 'Hernán Santa Cruz 回忆，联合国《宣言的历史》引录',
        sourceType: '史料记载',
        sourceUrl: 'https://www.un.org/en/about-us/udhr/history-of-the-declaration',
        locator: 'The Drafting Process 中圣克鲁斯引文',
      },
      {
        id: 'roosevelt-home',
        role: '埃莉诺·罗斯福，联合国人权委员会前主席',
        title: '人权从贴近生活的地方开始',
        description: EDITORIAL['RIGHTS_EVENTS.udhr-1948.perspectives.roosevelt-home.description'],
        quote: '究竟，普遍人权从哪里开始？从贴近家园的小地方开始。',
        original:
          'Where, after all, do universal human rights begin? In small places, close to home',
        source: 'Eleanor Roosevelt，1958-03-27发言；联合国图书馆出处考证',
        sourceType: '史料记载',
        sourceUrl: 'https://ask.un.org/faq/323626',
        locator: 'Where can I find this quote? 首段及出处说明',
      },
    ],
    academicPapers: [],
    references: [],
  },
];
