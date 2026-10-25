import { EDITORIAL } from '../../../.artifacts/editorial/history/colonial.ts';
import type { IEvent } from '../types';

export const MAYFLOWER_EVENT: IEvent = {
  id: 'mayflower-1620',
  title: '五月花号登陆与《五月花公约》',
  date: '1620年11月（公约署旧历11月11日）',
  location: '科德角与普利茅斯，今美国马萨诸塞州',
  category: '世界历史 · 殖民史',
  summary: EDITORIAL['MAYFLOWER_EVENT.summary'],
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
      description: EDITORIAL['MAYFLOWER_EVENT.perspectives.p1.description'],
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
      description: EDITORIAL['MAYFLOWER_EVENT.perspectives.p2.description'],
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
      description: EDITORIAL['MAYFLOWER_EVENT.perspectives.p4.description'],
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
