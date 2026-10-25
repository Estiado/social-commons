import type { GuanlanEvent } from './types';
import { GUANLAN_EVENTS } from './catalogue.ts';

const event: GuanlanEvent = {
  ...GUANLAN_EVENTS.find((item) => item.id === 'academic-bars')!,
  recap: {
    title: '学术讲座被搬进酒吧之后',
    paragraphs: [
      '2024年，围绕学术分享组织的酒吧活动受到关注。南京大学新潮学生记者的现场报道记录了南京的相关活动：听众在讲座、交流与消费的共同场景中相遇，经营者也在寻找维持活动的办法。',
      '此后，2025—2026年的青年研究从互动仪式、知识消费和临时共同体等方向，进一步解释这些相遇如何发生，以及关系能否延续。',
    ],
    sourceIds: ['report', 'ritual', 'community'],
  },
  background: {
    title: '知识活动也在组织一种相处方式',
    paragraphs: [
      '覃鑫渊以网络民族志、参与式观察与访谈研究相关活动，关注共同在场如何产生情感能量。王健则通过网络文本，讨论消费空间里的知识分享如何提供短暂归属。',
      '两项研究有不同的材料和问题意识。它们与记者记录的价格、讲座内容和参与体验对照，可以帮助理解热度背后的多种期待。',
    ],
    sourceIds: ['ritual', 'community', 'report'],
  },
  perspectives: [
    {
      level: '现象',
      title: '共同在场，使知识分享成为一次交往',
      keywords: ['身体在场', '共同关注', '互动仪式'],
      paragraphs: [
        '覃鑫渊从互动仪式链的角度理解活动：人们围绕同一话题聚集、讨论，在知识分享中获得社交体验与情绪价值。吸引力由内容与相处方式共同形成，不能只看讲座题目的新奇程度。',
      ],
      sourceIds: ['ritual'],
    },
    {
      level: '社会',
      title: '同一个空间，容纳着不同的参与条件',
      keywords: ['消费门槛', '知识质量', '不同需求'],
      paragraphs: [
        '新潮记者的报道同时呈现了交流愿望与实际分歧：有人在意讲座内容，有人不喝酒而觉得消费方式不合适。把这些经验保留下来，可以避免用一种参与者的感受代替所有人的需求。',
      ],
      sourceIds: ['report'],
    },
    {
      level: '思想',
      title: '短暂的归属，也受到消费逻辑塑造',
      keywords: ['临时共同体', '认同', '消费与关系'],
      paragraphs: [
        '王健用“衣帽间式的共同体”描述这类情境化联系：它能成为情感停靠点，也会受到符号消费和文化资本的影响。短暂连接可以有意义，却未必自然发展为长期支持。',
      ],
      sourceIds: ['community'],
    },
  ],
  reconsiderations: [
    {
      title: '轻松的交流，不必承担正式学术研究的全部任务',
      paragraphs: [
        '初次接触知识、结识同好和开展持续研究，是不同层次的需求。评价活动时可以说明自己关心的是哪一种，再考察内容、互动和后续机会是否与之相符。',
      ],
      sourceIds: ['report', 'ritual'],
    },
    {
      title: '一次热闹之后，还需要看谁能继续参与',
      paragraphs: [
        '场所是否持续开放、消费方式是否友好、分享内容能否更新，会影响相遇能否延续。愿意参与的人有不同经济条件与社交习惯，不能把某种消费方式当成知识兴趣的资格证明。',
      ],
      sourceIds: ['report', 'community'],
    },
  ],
  sources: [
    {
      id: 'report',
      title: '当学术酒吧的热度褪去',
      author: '刘珈宜、史羽梵、孙士雯、张鑫茹（新潮学生记者）',
      publication: '新潮／澎湃号',
      date: '2024-11-16',
      kind: '报道',
      url: 'https://m.thepaper.cn/newsDetail_forward_29354214',
      description: '南京大学新闻传播学院实践报道，记录活动组织、参与者体验与经营问题。',
    },
    {
      id: 'ritual',
      title: '在酒吧讨论学术：互动仪式链视域下青年参与“学术酒吧”现象研究',
      author: '覃鑫渊',
      publication: '青年发展论坛 2025,35(5):5–13',
      date: '2025-09-25',
      kind: '研究',
      url: 'https://jxst.cbpt.cnki.net/portal/journal/portal/client/paper/8b35dcf51e6045b2054ad17decf3b6b1',
      description: '通过网络民族志、参与式观察与半结构化访谈，考察共同在场、知识分享与交往体验。',
    },
    {
      id: 'community',
      title: '“衣帽间式的共同体”：青年社交困境纾解的消费主义逻辑——以“学术酒吧”为例',
      author: '王健',
      publication: '北京青年研究 2026,35(4):86–93',
      date: '2026-07-10',
      kind: '研究',
      url: 'https://bjqz.cbpt.cnki.net/portal/journal/portal/client/paper/d00fdac81d2ed1b492cfbda25a492bcf',
      description: '以网络文本研究消费空间与临时归属；不等同于全部参与者的经验。',
    },
  ],
  relatedDailyIds: ['d109', 'd101', 'd114'],
  relatedQuoteIds: ['q16', 'q61'],
};

export default event;
