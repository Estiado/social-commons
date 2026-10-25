import type { GuanlanEvent } from './types';
import { GUANLAN_EVENTS } from './catalogue.ts';

const event: GuanlanEvent = {
  ...GUANLAN_EVENTS.find((item) => item.id === 'ai-at-work')!,
  recap: {
    title: '一种工具，为什么成了工作中的压力',
    paragraphs: [
      '2026年10月13日，新周刊发表嗡嗡的文章，记录年轻人对职场中泛谈AI、把复杂任务简单交给工具的吐槽。报道所关注的矛盾，是新技术的语言进入了工作，责任与具体办法却未必一起更新。',
      '这些叙述呈现一部分人的职场经验，不能据此推算所有公司的情况。理解争议，还需要把实际效果、学习成本和工作安排放到一起看。',
    ],
    sourceIds: ['weekly'],
  },
  background: {
    title: '工具进入组织，还有流程、技能与分工',
    paragraphs: [
      'Brynjolfsson、Rock与Syverson讨论通用技术时，把培训和组织流程等互补投入纳入分析。工具的引进与能力的形成之间，可能有一段难以直接计量的积累过程。',
      '孙一洲的劳动史文章把目光放回计算员、分工与机械化：技术设计与劳动组织长期相互影响。理解今天的AI，也可以观察哪些任务被拆开、谁掌握知识、谁承担核查。',
    ],
    sourceIds: ['jcurve', 'history'],
  },
  perspectives: [
    {
      level: '现象',
      title: '技术语言怎样替代了具体沟通',
      keywords: ['工作经验', '形式与效果', '沟通责任'],
      paragraphs: [
        '嗡嗡的报道把批评指向一种使用方式：以新概念包装能力，把本需说明的任务、判断与沟通交给一句笼统的AI指令。工具被谈论得很多，实际问题仍可能没有得到处理。',
      ],
      sourceIds: ['weekly'],
    },
    {
      level: '社会',
      title: '技术收益需要组织配合',
      keywords: ['互补投入', '培训', '流程变化'],
      paragraphs: [
        '生产率J曲线研究说明，通用技术通常需要组织与技能上的互补投入。仅凭刚引进工具时的速度，难以判断能力是否已经形成；持续低效也不能因此自动被解释成未来一定成功。',
      ],
      sourceIds: ['jcurve'],
    },
    {
      level: '思想',
      title: '把人重新放回技术的历史',
      keywords: ['知识与劳动', '分工', '人的位置'],
      paragraphs: [
        '孙一洲回顾计算从人的职业到机器功能的变化，提示技术所吸收的知识来自长期协作与劳动。讨论智能时，除了机器能做什么，还可以考察人在任务设计、运行和检查中的位置。',
      ],
      sourceIds: ['history'],
    },
  ],
  reconsiderations: [
    {
      title: '批评形式主义，也要容纳工具有效的证据',
      paragraphs: [
        'Brynjolfsson、Li与Raymond研究客服场景中逐步引入AI助手的过程，发现生产率平均提高，但不同经验水平的劳动者收益不同。特定任务上的证据，有助于把对使用方式的批评，与对技术效果的判断分开。',
      ],
      sourceIds: ['work'],
    },
    {
      title: '一次有效应用，不能替所有岗位作保证',
      paragraphs: [
        '客服场景的效果不能直接推及写作、科研或所有组织。比较效率时，需要交代任务、质量要求、核查成本与谁获得收益，而不只统计生成速度。',
      ],
      sourceIds: ['work', 'jcurve'],
    },
  ],
  sources: [
    {
      id: 'weekly',
      title: '“AI挂在嘴边，实际一事无成”，年轻人正在被“AI登”逼疯',
      author: '嗡嗡',
      publication: '新周刊',
      date: '2026-10-13',
      kind: '报道',
      url: 'https://eu.36kr.com/zh/p/4023610911362949',
      importMode: 'paste',
      description: '36氪经授权刊载的新周刊文章，从职场经验讨论AI热与形式主义。',
    },
    {
      id: 'jcurve',
      title: 'The Productivity J-Curve: How Intangibles Complement General Purpose Technologies',
      author: 'Erik Brynjolfsson、Daniel Rock、Chad Syverson',
      publication: 'American Economic Journal: Macroeconomics 13(1):333–372',
      date: '2021-01',
      kind: '研究',
      url: 'https://www.aeaweb.org/articles?id=10.1257/mac.20180386',
      description: '讨论培训、组织变革等无形资产与通用技术的互补关系。',
    },
    {
      id: 'history',
      title: '从人力智能到人造智能：人工智能的劳动史',
      author: '孙一洲',
      publication: '澎湃新闻',
      date: '2026-10-21',
      kind: '评论',
      url: 'https://www.thepaper.cn/newsDetail_forward_34261996',
      description: '从人力计算、机械化和劳动分工，讨论人工智能的知识与组织背景。',
    },
    {
      id: 'work',
      title: 'Generative AI at Work（2023年11月修订工作论文）',
      author: 'Erik Brynjolfsson、Danielle Li、Lindsey R. Raymond',
      publication: 'NBER Working Paper 31161',
      date: '2023-11',
      kind: '研究',
      url: 'https://www.nber.org/papers/w31161',
      description: '客服AI助手研究，效果随劳动者经验而变化。',
    },
  ],
  relatedDailyIds: ['d83', 'd84', 'd85', 'd100'],
  relatedQuoteIds: ['q39', 'q65'],
};

export default event;
