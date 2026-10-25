import { EDITORIAL } from '../../../.artifacts/editorial/history/publicLife.ts';
import type { IEvent } from '../types';

export const PUBLIC_LIFE_EVENTS: IEvent[] = [
  {
    id: 'printing-connections',
    title: '从《金刚经》到古登堡：印刷史的多条线索',
    date: '7世纪起；868年、1377年与约1455年是重要实物节点',
    location: '东亚与欧洲',
    category: '技术与文化',
    summary: EDITORIAL['PUBLIC_LIFE_EVENTS.printing-connections.summary'],
    summarySources: [
      {
        title: 'Jacob Nadal、Dan Paterson：From Jikji to Gutenberg',
        url: 'https://blogs.loc.gov/preservation/2023/05/jikji-gutenberg/',
      },
    ],
    perspectives: [
      {
        id: 'printing-scholarship',
        role: 'Jacob Nadal 的学术会议致辞',
        title: '让东亚与欧洲的实物进入同一部印刷史',
        description:
          EDITORIAL[
            'PUBLIC_LIFE_EVENTS.printing-connections.perspectives.printing-scholarship.description'
          ],
        quote: '好的学术也是具有包容性的学术。',
        original: 'good scholarship is also inclusive scholarship',
        source:
          'Jacob Nadal 开幕致辞，载 Jacob Nadal、Dan Paterson：From Jikji to Gutenberg，2023-05-22',
        sourceType: '后世研究',
        sourceUrl: 'https://blogs.loc.gov/preservation/2023/05/jikji-gutenberg/',
        locator: '开幕致辞第2段',
      },
      {
        id: 'printing-jikji',
        role: '《直指》的文献遗产申报',
        title: '具体版本怎样成为技术史的证据',
        description:
          EDITORIAL[
            'PUBLIC_LIFE_EVENTS.printing-connections.perspectives.printing-jikji.description'
          ],
        quote: '这部书是现存可见的最早金属活字印刷证据。',
        original:
          'this book, Jikji, is the world’s oldest movable metal type printing evidence available',
        source: '韩国《直指》世界记忆名录申报表，UNESCO 保存；2001年列入名录',
        sourceType: '考古发现',
        sourceUrl:
          'https://media.unesco.org/sites/default/files/webform/mow001/korea_buljo_jikj_simch_yo_jeol.pdf',
        locator: '申报表第1页，Part A',
        readingId: 'jikji-nomination',
      },
      {
        id: 'printing-pagodas',
        role: 'Cameron Penwell 的馆藏研究',
        title: '印刷也是宗教实践与大规模组织',
        description:
          EDITORIAL[
            'PUBLIC_LIFE_EVENTS.printing-connections.perspectives.printing-pagodas.description'
          ],
        quote: '这项计划既是一种虔敬的宗教行为，也是一项需要大量资源的国家工程。',
        original:
          'The project was at once a devotional act and a vast state undertaking requiring extensive resources.',
        source:
          'Cameron Penwell：1 Million Pagodas and Prayers，Library of Congress Magazine，2023年1—2月，第5页',
        sourceType: '后世研究',
        sourceUrl: 'https://www.loc.gov/lcm/pdf/LCM_2023_0102.pdf',
        locator: '纸面第5页（PDF第7页）',
        readingId: 'loc-printing-2023',
      },
    ],
    academicPapers: [],
    references: [],
  },
  {
    id: 'seneca-falls-1848',
    title: '塞尼卡福尔斯会议与《情感宣言》',
    date: '1848年7月19—20日',
    location: '美国纽约州塞尼卡福尔斯',
    category: '权利与公共生活',
    summary: EDITORIAL['PUBLIC_LIFE_EVENTS.seneca-falls-1848.summary'],
    summarySources: [
      {
        title: '1848年妇女权利会议报告，美国国家公园管理局转录',
        url: 'https://www.nps.gov/wori/learn/historyculture/report-of-the-womans-rights-convention.htm',
      },
      {
        title: 'Arlene Balkansky：1848年的报刊如何报道妇女权利宣言',
        url: 'https://blogs.loc.gov/headlinesandheroes/2019/07/american-womens-declaration-newspaper-coverage-1848/',
      },
    ],
    perspectives: [
      {
        id: 'seneca-report',
        role: '斯坦顿与《情感宣言》',
        title: '把普遍权利的语言用于女性的实际处境',
        description:
          EDITORIAL['PUBLIC_LIFE_EVENTS.seneca-falls-1848.perspectives.seneca-report.description'],
        quote: '我们认为这些真理是不言而喻的：所有男人和女人生而平等。',
        original:
          'We hold these truths to be self-evident; that all men and women are created equal',
        source: '伊丽莎白·卡迪·斯坦顿等：《情感宣言》，1848；NPS 转录',
        sourceType: '史料记载',
        sourceUrl: 'https://www.nps.gov/wori/learn/historyculture/declaration-of-sentiments.htm',
        locator: '宣言第2段及权利诉求清单',
        readingId: 'seneca-report',
      },
      {
        id: 'seneca-resolution',
        role: '会议决议',
        title: '选举权与公共表达被提出为行动要求',
        description:
          EDITORIAL[
            'PUBLIC_LIFE_EVENTS.seneca-falls-1848.perspectives.seneca-resolution.description'
          ],
        quote: '为自己争取神圣的选举权，是这个国家妇女的责任。',
        original: 'secure to themselves their sacred right to the elective franchise',
        source:
          'Report of the Woman’s Rights Convention，1848，The North Star Office 印行；NPS 转录',
        sourceType: '史料记载',
        sourceUrl:
          'https://www.nps.gov/wori/learn/historyculture/report-of-the-womans-rights-convention.htm',
        locator: '决议中关于 elective franchise 的条目',
        readingId: 'seneca-report',
      },
      {
        id: 'seneca-press',
        role: 'Arlene Balkansky 的报刊史研究',
        title: '宣言的传播同时引发认同与嘲讽',
        description:
          EDITORIAL['PUBLIC_LIFE_EVENTS.seneca-falls-1848.perspectives.seneca-press.description'],
        quote: '最初的新闻报道往往是直接陈述性的。',
        original: 'Initial press coverage was often straightforward',
        source:
          'Arlene Balkansky：American Women’s Declaration of Independence: Newspaper coverage, 1848，2019-07-11，美国国会图书馆',
        sourceType: '后世研究',
        sourceUrl:
          'https://blogs.loc.gov/headlinesandheroes/2019/07/american-womens-declaration-newspaper-coverage-1848/',
        locator: '早期报道、嘲讽与反奴隶制报刊支持的对照段落',
      },
    ],
    academicPapers: [],
    references: [],
  },
  {
    id: 'snow-london-1854',
    title: '1854年伦敦霍乱调查：斯诺与他的同时代人',
    date: '1854年8—9月及随后调查',
    location: '英国伦敦苏活区与南伦敦',
    category: '科学与社会',
    summary: EDITORIAL['PUBLIC_LIFE_EVENTS.snow-london-1854.summary'],
    summarySources: [
      {
        title: 'CDC：斯诺与水泵把手事件150周年',
        url: 'https://www.cdc.gov/mmwr/preview/mmwrhtml/mm5334a1.htm',
      },
    ],
    perspectives: [
      {
        id: 'snow-fieldwork',
        role: 'CDC 的流行病学史回顾',
        title: '从住户访问与死亡记录走向公共行动',
        description:
          EDITORIAL['PUBLIC_LIFE_EVENTS.snow-london-1854.perspectives.snow-fieldwork.description'],
        quote: '斯诺查阅了当地死于霍乱居民的死亡记录，并访问了其家庭成员。',
        original:
          'Snow reviewed death records of area residents who died from cholera and interviewed household members',
        source: 'CDC：150th Anniversary of John Snow and the Pump Handle，MMWR，2004，53(34):783',
        sourceType: '后世研究',
        sourceUrl: 'https://www.cdc.gov/mmwr/preview/mmwrhtml/mm5334a1.htm',
        locator: '第783页首篇文章',
        readingId: 'cdc-snow-2004',
      },
      {
        id: 'snow-critique',
        role: 'Tom Koch 的医学史批评',
        title: '孤独天才的故事会遮住科学共同体',
        description:
          EDITORIAL['PUBLIC_LIFE_EVENTS.snow-london-1854.perspectives.snow-critique.description'],
        quote: '我们所说的约翰·斯诺霍乱研究，并不是一个孤立个体完成的工作。',
        original: 'John Snow’s cholera studies were not the work of a lone individual',
        source:
          'Tom Koch：John Snow, hero of cholera: RIP，CMAJ，2008，178(13):1736；节自Warburg Institute 演讲',
        sourceType: '后世研究',
        sourceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2413317/',
        locator: '讨论科学共同体的结尾段落',
      },
      {
        id: 'snow-reanalysis',
        role: 'Shiode 等人的空间分析',
        title: '补入人口与时间数据，重新检验经典地图',
        description:
          EDITORIAL['PUBLIC_LIFE_EVENTS.snow-london-1854.perspectives.snow-reanalysis.description'],
        quote: '水泵附近的高死亡率，与斯诺关于霍乱经受污染饮水传播的理论一致。',
        original:
          'The high mortality rates identified around the Broad Street pump are consistent with Snow’s theory',
        source:
          'Narushige Shiode 等：The mortality rates and the space-time patterns of John Snow’s cholera epidemic map，International Journal of Health Geographics，2015，14:21',
        sourceType: '后世研究',
        sourceUrl: 'https://doi.org/10.1186/s12942-015-0011-y',
        locator: '摘要结论；另见2015-11-16图件勘误',
        readingId: 'shiode-snow-2015',
      },
    ],
    academicPapers: [],
    references: [],
  },
  {
    id: 'montreal-protocol-1987',
    title: '《蒙特利尔议定书》与臭氧层保护',
    date: '1987年9月16日通过，1989年生效',
    location: '加拿大蒙特利尔及全球',
    category: '环境与合作',
    summary: EDITORIAL['PUBLIC_LIFE_EVENTS.montreal-protocol-1987.summary'],
    summarySources: [
      {
        title: 'UNEP OzonAction：蒙特利尔议定书及多边基金',
        url: 'https://www.unep.org/ozonaction/who-we-are/about-montreal-protocol',
      },
      {
        title: '臭氧秘书处：蒙特利尔议定书',
        url: 'https://ozone.unep.org/treaties/montreal-protocol',
      },
    ],
    perspectives: [
      {
        id: 'montreal-rules',
        role: 'UNEP 的制度说明',
        title: '共同目标被写成有时间表、可衡量的承诺',
        description:
          EDITORIAL[
            'PUBLIC_LIFE_EVENTS.montreal-protocol-1987.perspectives.montreal-rules.description'
          ],
        quote: '两类国家都承担具有约束力、有明确期限且可衡量的承诺。',
        original:
          'both groups of countries have binding, time-targeted, and measurable commitments',
        source: 'UNEP OzonAction：About Montreal Protocol，“The Montreal Protocol”部分',
        sourceType: '后世研究',
        sourceUrl: 'https://www.unep.org/ozonaction/who-we-are/about-montreal-protocol',
        locator: '关于不同国家责任与承诺的段落',
      },
      {
        id: 'montreal-science',
        role: '国际科学评估组',
        title: '以观测检验恢复，同时保留地区差异与不确定性',
        description:
          EDITORIAL[
            'PUBLIC_LIFE_EVENTS.montreal-protocol-1987.perspectives.montreal-science.description'
          ],
        quote: '科学一直是《蒙特利尔议定书》取得成功的基础之一。',
        original: 'Science has been one of the foundations of the Montreal Protocol’s success.',
        source:
          'WMO、UNEP、NOAA、NASA 等：Scientific Assessment of Ozone Depletion: 2022，Executive Summary，GAW Report No.278',
        sourceType: '后世研究',
        sourceUrl:
          'https://ozone.unep.org/system/files/documents/Scientific-Assessment-of-Ozone-Depletion-2022-Executive-Summary.pdf',
        locator: 'Highlights，第1页；“Current Scientific and Policy Challenges”',
        readingId: 'ozone-assessment-2022',
      },
      {
        id: 'montreal-support',
        role: 'UNEP 的履约机制说明',
        title: '发展中国家的转型需要资金和技术支持',
        description:
          EDITORIAL[
            'PUBLIC_LIFE_EVENTS.montreal-protocol-1987.perspectives.montreal-support.description'
          ],
        quote: '向发展中国家缔约方提供资金和技术援助。',
        original: 'provide financial and technical assistance to developing country parties',
        source: 'UNEP OzonAction：About Montreal Protocol，“The Multilateral Fund”部分',
        sourceType: '后世研究',
        sourceUrl: 'https://www.unep.org/ozonaction/who-we-are/about-montreal-protocol',
        locator: '“The Multilateral Fund”第1—3段',
      },
    ],
    academicPapers: [],
    references: [],
  },
];
