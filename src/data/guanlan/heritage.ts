import type { GuanlanEvent } from './types';
import { GUANLAN_EVENTS } from './catalogue.ts';

const event: GuanlanEvent = {
  ...GUANLAN_EVENTS.find((item) => item.id === 'heritage-short-video')!,
  recap: {
    title: '从屏幕上的铁花开始',
    paragraphs: [
      '2026年10月23日，张涛甫在澎湃新闻发表书评，从打铁花被剪成短视频的传播现象切入，讨论非遗如何在数字环境中延续。铁花的视觉吸引力扩大了观看范围，技艺有没有后继者、实践者怎样维持生活，却需要另外的证据。',
      '这篇精读以相关报道和研究组织问题。短视频走红是观察起点，观看、学习与文化延续分别对应不同的过程。',
    ],
    sourceIds: ['zhang'],
  },
  background: {
    title: '保存下来的材料，怎样重新进入生活',
    paragraphs: [
      '影像、画稿和数字档案可以让后来者重新接近一段文化经验。常沙娜讲述与家人整理旧稿、辨认年代和筹备展览的过程，呈现了资料如何在共同工作中重新获得意义。',
      '文化遗产研究还把注意力放在实践者与生活环境上。Barbara Kirshenblatt-Gimblett讨论的保护对象，包括技艺，也包括让它持续被实践的社会条件。',
    ],
    sourceIds: ['chang', 'barbara'],
  },
  perspectives: [
    {
      level: '现象',
      title: '热度是入口，学习需要更多条件',
      keywords: ['观看与实践', '身体经验', '传播效果'],
      paragraphs: [
        '张涛甫区分了看见动作与掌握技艺。视频有助于观察和比较，练习仍需要材料、纠错与时间。因此，传播效果不能只用播放量代替，也需要观察学习与持续实践。',
      ],
      sourceIds: ['zhang'],
      quote: { text: '视频可以重播，手艺却得由后来者继承。', sourceId: 'zhang', speaker: '张涛甫' },
    },
    {
      level: '社会',
      title: '传承发生在具体的人与共同工作中',
      keywords: ['代际关系', '共同实践', '个人选择'],
      paragraphs: [
        '常沙娜的自述把传承落到辨认画稿、交流经验和合作呈现作品的细节。她也谈到尊重儿子的生活选择。文化经验的延续，可以经由共同参与形成，不必预设后来者完全重复前人的道路。',
      ],
      sourceIds: ['chang'],
    },
    {
      level: '思想',
      title: '文化在变化中延续，实践者也有自己的意愿',
      keywords: ['活态传承', '主体性', '变化与保存'],
      paragraphs: [
        'Kirshenblatt-Gimblett指出，文化实践者具有意愿和反思能力，不能只被理解为替他人保存传统的容器。保护措施本身也会改变人与文化的关系；判断一种变化，需要把实践者的处境纳入讨论。',
      ],
      sourceIds: ['barbara'],
    },
  ],
  reconsiderations: [
    {
      title: '反对唯流量，不等于拒绝数字记录',
      paragraphs: [
        '记录与传播能够保存材料、建立接触的机会；它们与技艺学习的效果应分别考察。数字工具的价值，需要在具体使用过程中判断。',
      ],
      sourceIds: ['zhang', 'barbara'],
    },
    {
      title: '承认传统会变，也需要讨论由谁决定怎样变',
      paragraphs: [
        '实践者主动调整表达，与为了迎合观看要求而被迫改变，可能呈现相似形式，却有不同的关系与代价。尊重创新，也应保留当事人选择、协商和拒绝的空间。',
      ],
      sourceIds: ['zhang', 'barbara'],
    },
  ],
  sources: [
    {
      id: 'zhang',
      title: '当打铁花被截成十几秒：流量时代的非遗，如何真正“活着”？',
      author: '张涛甫',
      publication: '澎湃新闻',
      date: '2026-10-23',
      kind: '评论',
      url: 'https://www.thepaper.cn/newsDetail_forward_34273575',
      description: '书评从传播效果、身体经验及实践者处境讨论非遗的数字传播。',
    },
    {
      id: 'chang',
      title: '你是敦煌人吗？',
      author: '常沙娜',
      publication: '澎湃新闻',
      date: '2026-10-20',
      kind: '自述',
      url: 'https://www.thepaper.cn/newsDetail_forward_34236648',
      description: '从整理画稿与家人合作的经历，呈现文化记忆与代际关系。',
    },
    {
      id: 'barbara',
      title: 'Intangible Heritage as Metacultural Production',
      author: 'Barbara Kirshenblatt-Gimblett',
      publication: 'Museum International 56(1–2):52–65',
      date: '2004-06-24',
      kind: '研究',
      url: 'https://doi.org/10.1111/j.1350-0775.2004.00458.x',
      description: '文化遗产、实践者及保存活动之间的关系，重点参见原刊第53页及第58—59页。',
      fullText: {
        title: '论文公开电子版（Stellenbosch Heritage Foundation，英文）',
        url: 'https://www.stellenboschheritage.co.za/wp-content/uploads/Intangible-Heritage.pdf',
      },
    },
  ],
  relatedDailyIds: ['d94', 'd97'],
  relatedQuoteIds: ['q65', 'q90'],
};

export default event;
