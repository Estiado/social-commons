import type { IEvent } from '../types';

export const SILK_ROAD_EVENT: IEvent = {
  id: 'silk-road',
  title: '丝绸之路：商路、绿洲与求法者',
  date: '古代至中世纪；汉唐时期陆路交流尤为活跃',
  location: '东亚、中亚、西亚、地中海与相关海域',
  category: '世界历史 · 文明交流史',
  summary:
    '“丝绸之路”是后世对连接欧亚多地交通与交流网络的称呼，并不是自古只有一条、路线始终不变的道路。汉代张骞出使西域推动了中原与中亚的联系，但不同地区的交换早已存在。商旅通常分段行进，在绿洲城市和港口转运货物，丝绸之外还有金属、香料、玻璃等商品。僧侣、使节、工匠和迁徙者也沿这些网络往来，带动宗教、知识与技术的传播。道路又受地理环境、政权、战争和税收影响。敦煌、吐鲁番文书与旅行记，让这一宏大名称下面的具体人物、交易和风险重新可见。',
  summarySources: [
    {
      title: '联合国教科文组织：认识丝绸之路',
      url: 'https://www.unesco.org/en/silk-roads/about-silk-roads',
    },
  ],
  perspectives: [
    {
      id: 's1',
      role: '联合国教科文组织的交流史叙述',
      title: '道路带动的不只是丝绸买卖',
      description:
        '联合国教科文组织把丝绸之路解释为彼此连接、持续变化的陆海网络。城市中的商贸活动与知识、信仰和文化交流相伴发生，“丝绸”只是流通货物的一部分。该叙述强调旅行者和交往中心的重要性，而不把历史等同于一条从中国直达欧洲的单线商道。',
      quote: '吸引旅行者的，不仅有贸易，也有知识和文化的交流。',
      original:
        'Travellers along the Silk Roads were attracted not only by trade but also by the intellectual and cultural exchange',
      source: 'UNESCO Silk Roads Programme：About the Silk Roads',
      sourceType: '后世研究',
      sourceUrl: 'https://www.unesco.org/en/silk-roads/about-silk-roads',
      locator: '“Beyond Silk”及文化交流相关段落',
    },
    {
      id: 's3',
      role: 'Valerie Hansen 的地方社会研究',
      title: '把绿洲居民放回商路的中心',
      description:
        'Hansen 利用吐鲁番墓葬中保存的契约、诉讼证词和旅行通行文书，区分长期经商的粟特商人、依赖商贸服务谋生者，以及主要从事本地农业的人群。她关心的不只是商品到了多远，还包括旅店、翻译、官员与普通住民怎样生活；这些微观材料使商路的社会影响有了具体尺度。',
      quote: '这些商路沿线居民的生活是什么样的？',
      original: 'What was life like for the people who lived along the Silk Road?',
      source:
        'Valerie Hansen，The Impact of the Silk Road Trade on a Local Community: The Turfan Oasis, 500–800，2005，载 Les Sogdiens en Chine',
      sourceType: '后世研究',
      sourceUrl: 'https://history.yale.edu/sites/default/files/files/hansen-silk-road-trade.pdf',
      locator: '第283—285页，开篇及三类居民的划分',
      readingId: 'hansen-turfan',
    },
    {
      id: 's2',
      role: '法显的旅行记',
      title: '对求法者而言，道路首先意味着艰难的行旅',
      description:
        '法显于399年从长安出发，为寻求戒律典籍，经西域前往印度，后经海路回国。《佛国记》记载沙漠、寺院、地方风俗和佛教活动；敦煌之后的沙漠段落尤其突出辨路困难与死亡风险。与货物流通的宏观叙述相比，这份亲历文字呈现了宗教目标如何驱动具体的人跨越地域。',
      quote: '仰望天空看不到飞鸟，俯察地面看不到走兽。',
      original:
        'There is not a bird to be seen in the air above, nor an animal on the ground below.',
      source: '法显《佛国记》；James Legge 英译 A Record of Buddhistic Kingdoms，1886',
      sourceType: '史料记载',
      sourceUrl: 'https://www.gutenberg.org/ebooks/2124',
      locator: '第一章，敦煌之后的沙漠行旅',
      readingId: 'faxian-kingdoms',
    },
  ],
  academicPapers: [],
  references: [],
};
