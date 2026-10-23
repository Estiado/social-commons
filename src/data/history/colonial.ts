import type { IEvent } from '../types';

export const MAYFLOWER_EVENT: IEvent = {
  id: 'mayflower-1620',
  title: '五月花号登陆与《五月花公约》',
  date: '1620年11月（公约署旧历11月11日）',
  location: '科德角与普利茅斯，今美国马萨诸塞州',
  category: '世界历史 · 殖民史',
  summary:
    '1620年，五月花号载着英国移民抵达北美科德角。乘客既有寻求宗教生活的分离派信徒，也有其他移民。他们原拟在弗吉尼亚殖民特许范围内定居，实际停泊处却在其外，船上因此发生对服从关系的争论。41名成年男子签署一份结成政治共同体、遵守共同法律的协议，后来称为《五月花公约》。移民随后在普利茅斯建立定居点，第一年冬季大量人员因疾病和匮乏死亡。这里并非无人之地：万帕诺亚格人早已生活于此，并在欧洲人抵达前后经历了疫病、结盟和殖民扩张。公约的自治叙述与原住民的历史记忆，成为后世理解同一事件的不同入口。',
  summarySources: [
    {
      title: '美国国家公园管理局：五月花号乘客与科德角',
      url: 'https://www.nps.gov/caco/learn/historyculture/pilgrims.htm',
    },
    { title: '布拉福德《普利茅斯殖民史》第二卷', url: 'https://www.gutenberg.org/ebooks/69871' },
  ],
  perspectives: [
    {
      id: 'p1',
      role: '殖民者的政治约定',
      title: '在特许范围以外，怎样形成共同权威',
      description:
        '公约将签署者组织成“政治共同体”，承诺制定并服从适合殖民地共同利益的法律；文本同时保留对詹姆斯国王的效忠和基督教事业的表述。它解决的是船上移民如何维持秩序的问题，并非一份宣布独立、赋予所有居民普遍平等权利的宪法。',
      quote: '彼此立约，联合成为一个政治共同体，以便更好地组织和保存我们自身。',
      original:
        'covenant and combine ourselves into a civil body politic, for our better ordering and preservation',
      source: '《五月花公约》，1620；载布拉福德《普利茅斯殖民史》，Harold Paget 现代英语整理本',
      sourceType: '史料记载',
      sourceUrl: 'https://www.gutenberg.org/ebooks/69871',
      locator: '第二卷，1620年记事，公约全文',
      readingId: 'bradford-plymouth',
    },
    {
      id: 'p2',
      role: '殖民者的亲历记录',
      title: '共同体的建立也伴随着疾病和脆弱',
      description:
        '布拉福德记下首冬的疾病、住房不足和死亡，也记下少数健康者照料病人的劳动。他的叙述以宗教共同体的生存为中心，既能说明移民的困境，也呈现记录者如何评价团结、秩序与信仰。它与后来仅强调登陆和公约的纪念叙事并不相同。',
      quote: '在两三个月的时间里，他们的同伴有一半死去了。',
      original: 'In two or three months’ time half of their company died',
      source: '威廉·布拉福德《普利茅斯殖民史》，Harold Paget 整理本，1920',
      sourceType: '史料记载',
      sourceUrl: 'https://www.gutenberg.org/ebooks/69871',
      locator: '第二卷，1620年记事，首冬疾病段落',
      readingId: 'bradford-plymouth',
    },
    {
      id: 'p4',
      role: '万帕诺亚格人的历史记忆',
      title: '被纪念的“开始”，也可能是失去土地的开始',
      description:
        '万帕诺亚格人弗兰克·詹姆斯为1970年登陆纪念活动准备的演讲没有在原定庆典上发表。演讲从土地丧失、殖民关系和原住民持续存在的经验出发，拒绝把事件讲成单纯的友好相遇。他所强调的是原住民仍保有文化和行动能力，而不是已经从历史中消失。',
      quote: '我们仍有精神，仍有独特的文化，仍有意愿。',
      original:
        'we still have the spirit, we still have the unique culture, we still have the will',
      source: 'Wamsutta（Frank B. James）：为1970年普利茅斯纪念活动准备的演讲；UAINE 保存',
      sourceType: '口述传统',
      sourceUrl: 'https://www.uaine.org/wmsuta.htm',
      locator: '1970年9月10日稿，末段',
    },
  ],
  academicPapers: [],
  references: [],
};
