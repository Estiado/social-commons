import type { IEvent } from '../types';

// Keep museum/archival evidence separate from editorial discussion questions.
// No invented papers or reconstructed speeches are attached to these entries.
export const PUBLIC_LIFE_EVENTS: IEvent[] = [
  {
    id: 'printing-connections',
    title: '从《金刚经》到古登堡：印刷史的多条线索',
    date: '868—约1455年',
    location: '中国、朝鲜半岛与欧洲',
    category: '技术与文化',
    summary:
      '印刷史并非一个人突然发明、世界随即改变的单线故事。不同地区的书籍实物，让我们比较材料、技术、传播与阅读需求。',
    perspectives: [
      {
        id: 'printing-objects',
        role: '馆藏与保存',
        title: '从实物确认技术，区分不同印刷方式',
        description:
          '美国国会图书馆介绍的跨机构研究项目并置了 868 年中国木版《金刚经》、1377 年朝鲜半岛金属活字《直指》与约 1455 年古登堡《圣经》。木版与活字不是同一种技术，“现存最早”也不等于能够确定全部发明过程。',
        source: 'Library of Congress，From Jikji to Gutenberg（2023）',
        sourceType: '后世研究',
      },
      {
        id: 'printing-book',
        role: '书籍史',
        title: '先看一本具体的书',
        description:
          '国会图书馆对古登堡《圣经》的说明指出，其文本为拉丁文武加大译本，约于 1455 年在美因茨完成印制。具体版本、材料和制作过程，比笼统地把所有变化归为“印刷革命”更容易核查。',
        source: 'Library of Congress，The Gutenberg Bible 展览说明',
        sourceType: '后世研究',
      },
      {
        id: 'printing-questions',
        role: '课堂讨论',
        title: '技术能解释多少变化？',
        description:
          '本站讨论题：印刷数量增加，是否自动意味着每个人都有阅读机会？请分别考察语言、识字、价格和传播渠道。进一步区分“时间先后”“可能的传播联系”与“已经证明的技术传承”。这些问题为本站设计，不是馆方结论。',
        source: '本站根据所列馆藏资料设计的教学问题',
        sourceType: '后世研究',
      },
    ],
    academicPapers: [],
    references: [
      {
        title: 'Library of Congress：From Jikji to Gutenberg',
        url: 'https://blogs.loc.gov/preservation/2023/05/jikji-gutenberg/',
      },
      {
        title: 'Library of Congress：The Gutenberg Bible',
        url: 'https://www.loc.gov/exhibits/bibles/the-gutenberg-bible.html',
      },
    ],
  },
  {
    id: 'seneca-falls-1848',
    title: '塞尼卡福尔斯会议：谁能进入“人人”的范围',
    date: '1848年7月19—20日',
    location: '美国纽约州塞尼卡福尔斯',
    category: '权利与公共生活',
    summary:
      '《情感宣言》借用权利宣言的语言，把女性处境带进公共争论。讨论它的历史意义，也应看到不同群体参与权利运动的复杂关系。',
    perspectives: [
      {
        id: 'seneca-report',
        role: '会议记录',
        title: '从诉求清单理解“平等”',
        description:
          '美国国家公园管理局保存的会议报告记录了会议的时间、地点及讨论程序。宣言针对妇女在社会、公民与宗教生活中的处境提出诉求。阅读时应区分当时提出的要求与后来才逐步改变的制度。',
        source: 'NPS，Report of the Woman’s Rights Convention，1848 年会议报告',
        sourceType: '史料记载',
      },
      {
        id: 'seneca-movements',
        role: '社会运动史',
        title: '妇女权利运动与废奴运动的联系',
        description:
          'NPS 的专题说明追溯了组织者与废奴运动的关系，并指出《情感宣言》的题名也与反奴隶制运动有关。这种联系提醒我们，不同权利诉求可能互相支持，也不能被简单合并为完全相同的经验。',
        source: 'NPS，The Underground Railroad and the First Women’s Rights Convention',
        sourceType: '后世研究',
      },
      {
        id: 'seneca-questions',
        role: '课堂讨论',
        title: '一种普遍原则如何被扩大理解？',
        description:
          '本站讨论题：当一个群体借用既有权利语言提出新诉求，是在重复旧观念，还是揭示旧观念未被兑现的部分？请从宣言中找证据，也考察当时还有谁未能平等参与。',
        source: '本站设计的比较阅读问题',
        sourceType: '后世研究',
      },
    ],
    academicPapers: [],
    references: [
      {
        title: 'NPS：1848 年会议报告',
        url: 'https://www.nps.gov/wori/learn/historyculture/report-of-the-womans-rights-convention.htm',
      },
      {
        title: 'NPS：地下铁路与首次妇女权利会议',
        url: 'https://www.nps.gov/wori/learn/historyculture/the-underground-railroad-and-the-first-womens-rights-convention.htm',
      },
      {
        title: 'NPS：《情感宣言》的历史说明',
        url: 'https://www.nps.gov/articles/declaration-of-sentiments.htm',
      },
    ],
  },
  {
    id: 'snow-london-1854',
    title: '1854年伦敦霍乱调查：地图之外还有什么证据',
    date: '1854年',
    location: '英国伦敦',
    category: '科学与社会',
    summary:
      '约翰·斯诺的调查常被简化为“一张地图、一根水泵把手”。完整的方法故事还包括访谈、例外案例与不同供水地区的比较。',
    perspectives: [
      {
        id: 'snow-fieldwork',
        role: '调查方法',
        title: '分布图帮助提问，访谈帮助核查',
        description:
          'CDC 的流行病学教材介绍，斯诺调查患者从何处取水，检视病例分布，并追查不符合最初印象的个案。水泵与病例的空间接近是线索，仍需核查实际用水情况。',
        source: 'CDC，Principles of Epidemiology，Lesson 1 Section 2',
        sourceType: '后世研究',
      },
      {
        id: 'snow-comparison',
        role: '比较研究',
        title: '不同供水系统提供另一条证据',
        description:
          '同一教材还介绍了 1854 年夏季不同供水公司服务地区的死亡情况比较。它让我们看到，历史中的因果判断并不只依靠一个醒目的现场行动，而需要不同证据相互支持。',
        source: 'CDC，Principles of Epidemiology，Lesson 1 Section 2',
        sourceType: '后世研究',
      },
      {
        id: 'snow-questions',
        role: '课堂讨论',
        title: '怎样避免把科学史写成英雄传说？',
        description:
          '本站讨论题：分别列出地图、访谈和比较数据能够回答与不能回答的问题。把“有助于提出假说”“支持一种解释”与“排除全部其他原因”区分开。这是方法史阅读，不是医疗建议。',
        source: '本站设计的史料与论证练习',
        sourceType: '后世研究',
      },
    ],
    academicPapers: [],
    references: [
      {
        title: 'CDC：Historical Evolution of Epidemiology（存档教材）',
        url: 'https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson1/section2.html',
      },
      {
        title: 'CDC Stacks：Principles of Epidemiology in Public Health Practice',
        url: 'https://stacks.cdc.gov/view/cdc/6914',
      },
    ],
  },
  {
    id: 'montreal-protocol-1987',
    title: '《蒙特利尔议定书》：全球问题怎样形成共同规则',
    date: '1987年通过，1989年生效',
    location: '加拿大蒙特利尔及全球',
    category: '环境与合作',
    summary:
      '保护臭氧层的合作，把科学认识、国际规则、产业转型和资金技术支持联系在一起。它提供一份具体的合作案例，而不是所有环境问题的现成模板。',
    perspectives: [
      {
        id: 'montreal-rules',
        role: '国际制度',
        title: '从框架到控制措施',
        description:
          'UNEP 说明，1985 年《维也纳公约》建立合作框架，1987 年议定书进一步控制消耗臭氧层物质。读一项协议，要分别确认通过、生效与落实，不能将签字视为问题已被解决。',
        source: 'UNEP，The Montreal Protocol: triumph by treaty；Ozone Secretariat 条约说明',
        sourceType: '后世研究',
      },
      {
        id: 'montreal-support',
        role: '实施条件',
        title: '共同目标还需要不同能力之间的支持',
        description:
          'UNEP 的说明介绍了多边基金及实施机构对发展中国家的支持。共同责任如何转化为可执行措施，需要同时考虑技术、成本与履约能力。不能只用一次会议的共识解释长期变化。',
        source: 'UNEP OzonAction，About Montreal Protocol',
        sourceType: '后世研究',
      },
      {
        id: 'montreal-questions',
        role: '课堂讨论',
        title: '成功案例能否直接复制？',
        description:
          '本站讨论题：比较臭氧层保护与另一项环境议题，分别列出污染来源、替代技术、受益范围和成本分配。哪些条件相似，哪些不同？避免把一个案例改写成“只要合作就能解决一切”。',
        source: '本站设计的比较讨论题',
        sourceType: '后世研究',
      },
    ],
    academicPapers: [],
    references: [
      {
        title: 'UNEP：The Montreal Protocol: triumph by treaty',
        url: 'https://www.unep.org/en/news-and-stories/story/montreal-protocol-triumph-treaty',
      },
      {
        title: 'UNEP OzonAction：About Montreal Protocol',
        url: 'https://www.unep.org/ozonaction/who-we-are/about-montreal-protocol',
      },
      {
        title: 'Ozone Secretariat：条约与生效时间',
        url: 'https://ozone.unep.org/treaties/montreal-protocol',
      },
    ],
  },
];
