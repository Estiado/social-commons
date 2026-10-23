import type { IEvent } from '../types';

export const RIGHTS_EVENTS: IEvent[] = [
  {
    id: 'declaration-1776',
    title: '1776年独立宣言：平等的承诺与被排除的人',
    date: '1776年及其后续争论',
    location: '北美十三殖民地与美国',
    category: '政治与权利',
    summary:
      '1776年7月4日，大陆会议通过《独立宣言》，宣布十三个殖民地脱离英国。文本以自然权利和被统治者同意说明政府的正当性，也列举了对英王的控诉。它首先是一项独立的政治声明，不能理解为当日便让所有居民获得平等权利。当时奴隶制仍然存在，妇女也未得到与男性同等的政治地位。阿比盖尔·亚当斯在同年书信中要求制定新法时记住女性；1852年，废奴主义者弗雷德里克·道格拉斯又在独立日演说中质问庆典与奴役之间的矛盾。把这几份文本放在一起，可以看见原则如何被提出，也看见被排除者如何借原则提出要求。',
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
          '宣言把权利与政府的目的联系起来，提出政府应保障权利，其正当权力来自被统治者同意。阅读时也应留意，这些普遍措辞与当时实际权利分配之间存在距离。',
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
          '亚当斯在丈夫参与大陆会议期间提出女性的处境。她没有等待后世的权利运动才发问，而是在新秩序形成时就要求限制丈夫的专断权力。书信使宏大的独立叙事进入家庭与法律关系。',
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
          '道格拉斯于1852年7月5日在罗切斯特发表演说，以独立原则反问奴隶制现实。这里的“你们”与“我”呈现了庆典参与者和被奴役者之间的断裂，并不是否认自由的价值。',
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
    summary:
      '第二次世界大战及其暴行使建立国际人权共同标准成为迫切议题。1948年12月10日，联合国大会通过《世界人权宣言》。它从人的尊严和平等出发，列出公民政治权利以及经济、社会和文化权利；起草涉及来自不同国家、文化与思想背景的代表。宣言本身不等于各国已经完成落实，也不能把它与之后具有特定缔约义务的国际公约混为一谈。起草参与者圣克鲁斯回忆了对人的价值形成共识的意义；埃莉诺·罗斯福在后来谈人权时，则把目光放到邻里、学校与工作场所。三份文字分别呈现规范文本、协商记忆与日常实践之间的联系。',
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
        description:
          '第一条以尊严、平等、理性与良心为起点。它既陈述个人的地位，也提出人与人如何相待的要求。后续条文才将这一起点展开为不同方面的权利。',
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
        description:
          '联合国的起草史引录圣克鲁斯的回忆。他强调人的价值来自存在本身，并将其与免于匮乏和压迫、发展人格的权利联系起来。这段回忆呈现一位参与者对共同工作的理解。',
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
        description:
          '联合国图书馆追索的这段1958年发言，把人权落实与邻里、学校和工作场所联系起来。图书馆说明尚未找到完整原始讲稿，现存依据包括当时报刊及联合国后续出版物中的引文。',
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
