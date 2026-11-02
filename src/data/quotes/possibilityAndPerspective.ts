import { EDITORIAL } from '../../../.artifacts/editorial/quotes/possibilityAndPerspective.ts';
import type { IQuote } from '../types';

// Public-domain passages; modern interpretation remains attributed separately.
export const POSSIBILITY_READINGS: IQuote[] = [
  {
    id: 'q111',
    author: '苏轼',
    title: '题西林壁',
    source: '《题西林壁》',
    text: '横看成岭侧成峰，远近高低各不同。\n不识庐山真面目，只缘身在此山中。',
    sourceUrl:
      'https://journal-s.scnu.edu.cn/cn/article/pdf/preview/0eb070a9-b1ba-4a41-8383-702739d75511.pdf',
    commentary: {
      text: EDITORIAL['q111.analysis'],
      commentator: '伍晓蔓',
      commentatorSource:
        '《苏轼庐山之行及其“不悟”》，《华南师范大学学报（社会科学版）》2025年第1期，公开摘要',
      status: 'verified',
      url: 'https://journal-s.scnu.edu.cn/cn/article/pdf/preview/0eb070a9-b1ba-4a41-8383-702739d75511.pdf',
      checkedAt: '2026-11-02',
    },
  },
  {
    id: 'q112',
    author: '杜牧',
    title: '题乌江亭',
    source: '《题乌江亭》',
    text: '胜败兵家事不期，包羞忍耻是男儿。\n江东子弟多才俊，卷土重来未可知。',
    sourceUrl: 'https://wyb.chinawriter.com.cn/content/202604/13/content83450.html',
    commentary: {
      text: EDITORIAL['q112.analysis'],
      commentator: '郭华',
      commentatorSource: '《走过乌江亭》，《文艺报》2026年4月13日',
      status: 'verified',
      url: 'https://wyb.chinawriter.com.cn/content/202604/13/content83450.html',
      checkedAt: '2026-11-02',
    },
  },
  {
    id: 'q113',
    author: '王安石',
    title: '叠题乌江亭',
    source: '《叠题乌江亭》',
    text: '百战疲劳壮士哀，中原一败势难回。\n江东子弟今虽在，肯与君王卷土来？',
    sourceUrl: 'https://wyb.chinawriter.com.cn/content/202604/13/content83450.html',
    commentary: {
      text: EDITORIAL['q113.analysis'],
      commentator: '郭华',
      commentatorSource: '《走过乌江亭》，《文艺报》2026年4月13日',
      status: 'verified',
      url: 'https://wyb.chinawriter.com.cn/content/202604/13/content83450.html',
      checkedAt: '2026-11-02',
    },
    sourceNote: EDITORIAL['q113.note'],
  },
  {
    id: 'q114',
    author: '《庄子》作者群',
    title: '秋水·濠梁之辩（节选）',
    source: '《秋水·濠梁之辩（节选）》',
    text: '庄子与惠子游于濠梁之上。庄子曰：“鯈鱼出游从容，是鱼之乐也。”惠子曰：“子非鱼，安知鱼之乐？”庄子曰：“子非我，安知我不知鱼之乐？”\n\n惠子曰：“我非子，固不知子矣；子固非鱼也，子之不知鱼之乐，全矣。”庄子曰：“请循其本。子曰‘汝安知鱼乐’云者，既已知吾知之而问我，我知之濠上也。”',
    sourceUrl: 'https://plato.stanford.edu/entries/zhuangzi/',
    commentary: {
      text: EDITORIAL['q114.analysis'],
      commentator: 'Chad Hansen',
      commentatorSource: '《斯坦福哲学百科》Zhuangzi，第3节对《庄子》17:13濠梁对话的讨论',
      status: 'verified',
      url: 'https://plato.stanford.edu/entries/zhuangzi/',
      checkedAt: '2026-11-02',
    },
    sourceNote: EDITORIAL['q114.note'],
  },
];
