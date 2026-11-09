import { EDITORIAL, paragraphCopy } from '../../../.artifacts/editorial/guanlan/rareDisciplines.ts';
import { GUANLAN_EVENTS } from './catalogue.ts';
import type { GuanlanEvent } from './types';

const event: GuanlanEvent = {
  ...GUANLAN_EVENTS.find((item) => item.id === 'rare-disciplines-2026')!,
  recap: {
    title: EDITORIAL['recap.title'],
    paragraphs: paragraphCopy('recap.paragraphs'),
    sourceIds: ['people', 'htu'],
  },
  background: {
    title: EDITORIAL['background.title'],
    paragraphs: paragraphCopy('background.paragraphs'),
    sourceIds: ['interview'],
  },
  perspectives: [
    {
      title: EDITORIAL['views.0.title'],
      paragraphs: paragraphCopy('views.0.paragraphs'),
      sourceIds: ['htu', 'interview'],
      level: '现象',
      keywords: ['数字人文', '图像检索'],
    },
    {
      title: EDITORIAL['views.1.title'],
      paragraphs: paragraphCopy('views.1.paragraphs'),
      sourceIds: ['people', 'htu'],
      level: '社会',
      keywords: ['人才培养', '学术协作'],
    },
    {
      title: EDITORIAL['views.2.title'],
      paragraphs: paragraphCopy('views.2.paragraphs'),
      sourceIds: ['paper', 'interview'],
      level: '思想',
      keywords: ['历史证据', '文献传承'],
    },
  ],
  reconsiderations: [
    {
      title: EDITORIAL['rethink.title'],
      paragraphs: paragraphCopy('rethink.paragraphs'),
      sourceIds: ['interview', 'htu'],
    },
  ],
  sources: [
    {
      id: 'people',
      title: '中国社会科学院大学冷门绝学学院成立暨全国冷门绝学联盟启动',
      author: '刘颖颖',
      publication: '人民网',
      date: '2026-11-07',
      kind: '报道',
      url: 'https://ent.people.com.cn/n1/2026/1107/c1012-40829684.html',
      description: EDITORIAL['sources.people.description'],
      digest: paragraphCopy('sources.people.digest'),
      importMode: 'paste',
    },
    {
      id: 'htu',
      title: '我校教师应邀参加全国冷门绝学联盟启动大会',
      author: '韩燕彪、张续等',
      publication: '河南师范大学',
      date: '2026-11-07',
      kind: '自述',
      url: 'https://www.htu.edu.cn/dangzhengban/2026/1109/c3282a411968/page.htm',
      description: EDITORIAL['sources.htu.description'],
      digest: paragraphCopy('sources.htu.digest'),
      importMode: 'paste',
    },
    {
      id: 'interview',
      title: '冷门绝学“绝”在哪？专访川大吴毅强：古文字学难在认字，更难在读懂古人',
      author: '封面新闻采访吴毅强',
      publication: '川观新闻',
      date: '2026-11-08',
      kind: '报道',
      url: 'https://cbgc.scol.com.cn/news/8126086',
      description: EDITORIAL['sources.interview.description'],
      digest: paragraphCopy('sources.interview.digest'),
      importMode: 'paste',
    },
    {
      id: 'paper',
      title: '马上评｜“绝学”何以继？“冷门”何以兴？',
      author: '澎湃评论',
      publication: '澎湃新闻',
      date: '2026-11-09',
      kind: '评论',
      url: 'https://www.thepaper.cn/newsDetail_forward_34438247',
      description: EDITORIAL['sources.paper.description'],
      digest: paragraphCopy('sources.paper.digest'),
      importMode: 'paste',
    },
  ],
  relatedDailyIds: ['d149'],
  relatedQuoteIds: ['q116', 'q117'],
};
export default event;
