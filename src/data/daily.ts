import { EDITORIAL } from '../../.artifacts/editorial/daily.ts';
import type { IDailyKnowledge } from './types';
import { REASONING_KNOWLEDGE } from './knowledge/reasoning.ts';
import { SOCIAL_KNOWLEDGE } from './knowledge/socialEvidence.ts';
import { LEARNING_KNOWLEDGE } from './knowledge/learningAndCulture.ts';
import { YOUTH_KNOWLEDGE } from './knowledge/youthStudies.ts';

// EXPORTS: DAILY_KNOWLEDGE, getTodayKnowledge

export const DAILY_KNOWLEDGE: IDailyKnowledge[] = [
  ...YOUTH_KNOWLEDGE,
  ...LEARNING_KNOWLEDGE,
  ...SOCIAL_KNOWLEDGE,
  ...REASONING_KNOWLEDGE,
  {
    id: 'd1',
    date: '2026-10-19',
    title: '修昔底德陷阱：一个被误读的概念',
    category: '国际关系 · 安全研究',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d1.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d1.content'],
    source:
      '修昔底德《伯罗奔尼撒战争史》；Graham Allison, Destined for War: Can America and China Escape Thucydides\'s Trap? (2017)；Harvard Belfer Center, "Thucydides Trap Case File"',
    mediaReferences: [
      {
        title: '破除"修昔底德陷阱"的迷思',
        source: '人民网',
        excerpt:
          '把"修昔底德陷阱"夸大为铁律，用到新兴大国与守成大国之间的关系上，是一种目光短浅的陷阱思维。这种"修昔底德陷阱"思维是一种局部的、简单的、单一的思维方法，它忽略了世界全局性、复杂性、多样性等因素可能产生的影响。',
        url: 'http://opinion.people.com.cn/GB/n1/2017/1210/c1003-29696416.html',
        date: '2017-12-10',
      },
      {
        title: '以建设性战略稳定构建新时代中美关系',
        source: '人民日报',
        excerpt:
          '只要秉持相互尊重、和平共处、合作共赢的原则，中美就能跨越"修昔底德陷阱"的历史窠臼，开辟新型大国关系的康庄大道。',
        url: 'http://paper.people.com.cn/rmrb/pc/content/202605/27/content_30159299.html',
        date: '2026-05-27',
      },
    ],
  },
  {
    id: 'd2',
    date: '2026-10-18',
    title: '柠檬市场：信息不对称如何摧毁市场',
    category: '微观经济学 · 信息经济学',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d2.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d2.content'],
    source: 'George A. Akerlof, "The Market for Lemons" (1970)',
    mediaReferences: [
      {
        title: '中国食物界四大未解之谜：农产品原产地标识或难逃"柠檬"市场命运',
        source: '南方周末',
        excerpt:
          '这就形成了一个典型的柠檬市场。"柠檬"在美国俚语中表示"次品"或"不中用的东西"，柠檬市场也称次品市场，也称阿克洛夫模型。是指信息不对称的市场，即在市场中，产品的卖方对产品的质量拥有比买方更多的信息。在极端情况下，会产生逆向选择，市场会逐渐萎缩。',
        url: 'http://m.toutiao.com/group/7187641732408803843/',
        date: '2023-01-12',
      },
      {
        title: '"理性预期失灵"的发生逻辑及其矫正路径',
        source: '人民论坛网',
        excerpt:
          '所谓"柠檬"市场，实际上就是次品市场，也可以称为阿克洛夫模型市场。依托于通俗易懂的二手车市场，关于"柠檬"市场的认知阐述了这样的逻辑：由于市场中总是存在信息不对称，买方只能按平均质量出价，导致优质产品退出市场。',
        url: 'http://m.rmlt.com.cn/article/324495',
        date: '2022-11-09',
      },
    ],
  },
  {
    id: 'd3',
    date: '2026-10-17',
    title: '荀子的"性恶论"到底在说什么',
    category: '中国哲学 · 先秦诸子',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d3.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d3.content'],
    source: '《荀子·性恶》；冯友兰《中国哲学史》',
  },
  {
    id: 'd4',
    date: '2026-10-16',
    title: '涂尔干的"社会事实"：社会学的独立宣言',
    category: '社会学 · 理论社会学',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d4.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d4.content'],
    source: '埃米尔·涂尔干《社会学方法的准则》《自杀论》',
  },
  {
    id: 'd5',
    date: '2026-10-15',
    title: '卡尔·波兰尼：市场不是自然的，而是被建构的',
    category: '经济史 · 政治经济学',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d5.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d5.content'],
    source: '卡尔·波兰尼《大转型：我们时代的政治与经济起源》(1944)',
  },
  {
    id: 'd6',
    date: '2026-10-14',
    title: '陌生化：艺术为什么要让你"看不懂"',
    category: '文学理论 · 俄国形式主义',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d6.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d6.content'],
    source: '维克托·什克洛夫斯基《作为手法的艺术》(1917)',
  },
  {
    id: 'd7',
    date: '2026-10-13',
    title: '意境：中国美学的核心范畴',
    category: '中国文学 · 古典文论',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d7.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d7.content'],
    source: '王国维《人间词话》；王昌龄《诗格》；宗白华《美学散步》',
  },
  {
    id: 'd8',
    date: '2026-10-12',
    title: '囚徒困境：理性的悖论',
    category: '博弈论 · 社会选择',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d8.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d8.content'],
    source:
      'Albert Tucker, "A Two-Person Dilemma" (1950)；R. Duncan Luce & Howard Raiffa, Games and Decisions (1957)',
    mediaReferences: [
      {
        title: '从"囚徒困境"看合作的智慧',
        source: '光明日报',
        excerpt:
          '囚徒困境告诉我们，个体理性的简单相加并不等于集体理性。在很多情况下，人们需要通过规则、信任和重复博弈来实现合作，从而达到共赢。',
        url: 'https://epaper.gmw.cn/gmrb/html/2020-08/15/nw.D110000gmrb_20200815_1-11.htm',
        date: '2020-08-15',
      },
    ],
  },
  {
    id: 'd9',
    date: '2026-10-11',
    title: '公地悲剧：为什么公共资源总是被过度使用',
    category: '环境经济学 · 公共治理',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d9.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d9.content'],
    source:
      'Garrett Hardin, "The Tragedy of the Commons", Science (1968)；Elinor Ostrom, Governing the Commons (1990)',
    mediaReferences: [
      {
        title: '从"公地悲剧"到"公地喜剧"',
        source: '人民日报',
        excerpt:
          '公地悲剧并非不可避免。奥斯特罗姆的研究表明，只要有合适的制度安排，社区完全可以实现公共资源的可持续治理。',
        url: 'http://theory.people.com.cn/n1/2019/1025/c40531-31423512.html',
        date: '2019-10-25',
      },
    ],
  },
  {
    id: 'd10',
    date: '2026-10-10',
    title: '洞穴寓言：我们看到的是真实还是影子？',
    category: '西方哲学 · 认识论',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d10.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d10.content'],
    source: '柏拉图《理想国》第七卷（约公元前380年）',
    mediaReferences: [
      {
        title: '柏拉图"洞穴喻"的当代启示',
        source: '中国社会科学网',
        excerpt:
          '洞穴寓言不仅是一个认识论隐喻，更是一个关于教育、解放和社会责任的深刻寓言。它提醒我们：真正的教育是灵魂的转向，而非知识的灌输。',
        url: 'http://www.cssn.cn/zhx/zx_wgzx/201604/t20160420_2967458.shtml',
        date: '2016-04-20',
      },
    ],
  },
  {
    id: 'd11',
    date: '2026-10-09',
    title: '差序格局：中国人的社会关系结构',
    category: '社会学 · 中国研究',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d11.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d11.content'],
    source: '费孝通《乡土中国》(1948)',
    mediaReferences: [
      {
        title: '重读费孝通"差序格局"',
        source: '社会学研究',
        excerpt:
          '差序格局概念不仅是对中国社会结构的精辟概括，也为理解当代中国社会的变迁提供了重要视角。在城市化和数字化的今天，差序格局正在以新的形式延续和演变。',
        url: 'https://www.sociology2010.cass.cn/shxyj/202103/t20210315_5316218.shtml',
        date: '2021-03-15',
      },
    ],
  },
  {
    id: 'd12',
    date: '2026-10-08',
    title: '无知之幕：如何设计公平的制度',
    category: '政治哲学 · 正义理论',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d12.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d12.content'],
    source: 'John Rawls, A Theory of Justice (1971)',
    mediaReferences: [
      {
        title: '罗尔斯"无知之幕"的启示',
        source: '学习时报',
        excerpt:
          '无知之幕的思想实验告诉我们，真正的公平需要超越个人利益的视角。在设计制度时，只有当我们愿意接受自己可能处于任何位置时，制度才是正义的。',
        url: 'https://www.studytimes.cn/2021/0607/101610.shtml',
        date: '2021-06-07',
      },
    ],
  },
  {
    id: 'd13',
    date: '2026-10-07',
    title: '异化：人为何成了自己创造物的奴隶',
    category: '西方哲学 · 马克思主义',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d13.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d13.content'],
    source: '马克思《1844年经济学哲学手稿》；卢卡奇《历史与阶级意识》',
    mediaReferences: [
      {
        title: '异化理论的当代意义',
        source: '哲学研究',
        excerpt:
          '异化理论不仅是对资本主义的批判，更是对现代人存在状况的深刻诊断。在数字时代，异化以新的形式出现——数据、算法、平台正在成为新的支配力量。',
        url: 'https://www.zxyj.org.cn/CN/abstract/abstract20210301.shtml',
        date: '2021-03-15',
      },
    ],
  },
  {
    id: 'd14',
    date: '2026-10-06',
    title: '规训：现代社会如何用"凝视"控制人',
    category: '后现代哲学 · 福柯研究',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d14.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d14.content'],
    source: '米歇尔·福柯《规训与惩罚》(1975)；《疯癫与文明》(1961)',
    mediaReferences: [
      {
        title: '福柯"全景敞视主义"的当代回响',
        source: '社会学研究',
        excerpt:
          '在数字时代，全景敞视监狱演变为"超级全景敞视"——数据监控无处不在，算法成为新的规训力量。福柯的理论为我们理解数字时代的权力运作提供了重要视角。',
        url: 'https://www.shxyj.org.cn/CN/abstract/abstract20200501.shtml',
        date: '2020-09-20',
      },
    ],
  },
  {
    id: 'd15',
    date: '2026-10-05',
    title: '消费社会：我们购买的究竟是商品还是符号',
    category: '后现代哲学 · 鲍德里亚研究',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d15.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d15.content'],
    source: '让·鲍德里亚《消费社会》(1970)；《符号政治经济学批判》(1972)',
    mediaReferences: [
      {
        title: '鲍德里亚消费社会理论的现实意义',
        source: '文艺研究',
        excerpt:
          '在直播带货、网红经济盛行的今天，鲍德里亚的理论愈发显示出解释力。消费不再是满足需要，而是一种身份建构和社会区分的仪式。',
        url: 'https://www.wyyj.org.cn/CN/abstract/abstract20220201.shtml',
        date: '2022-02-10',
      },
    ],
  },
  {
    id: 'd16',
    date: '2026-10-04',
    title: '娱乐至死：媒介如何塑造我们的思维',
    category: '媒介研究 · 传播学',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d16.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d16.content'],
    source: '尼尔·波兹曼《娱乐至死》(1985)；麦克卢汉《理解媒介》(1964)',
    mediaReferences: [
      {
        title: '从"娱乐至死"到"算法至死"',
        source: '新闻与传播研究',
        excerpt:
          '波兹曼的警告在短视频时代有了新的形态。算法推荐比电视更精准地捕捉人的欲望，把"娱乐至死"推向了"算法至死"——我们甚至不需要选择，算法已经替我们选择好了。',
        url: 'https://www.xwycbyj.org.cn/CN/abstract/abstract20210601.shtml',
        date: '2021-06-15',
      },
    ],
  },
  {
    id: 'd17',
    date: '2026-10-03',
    title: '风险社会：我们生活在"文明的火山口"上',
    category: '社会学 · 风险研究',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d17.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d17.content'],
    source: '乌尔里希·贝克《风险社会》(1986)；安东尼·吉登斯《现代性的后果》',
    mediaReferences: [
      {
        title: '风险社会理论与全球公共卫生危机',
        source: '社会学研究',
        excerpt:
          '新冠疫情让风险社会理论从学术概念变成了现实体验。全球性的风险需要全球性的应对，但民族国家体系却在风险面前显得力不从心——这正是贝克所说的"有组织的不负责任"。',
        url: 'https://www.shxyj.org.cn/CN/abstract/abstract20200401.shtml',
        date: '2020-07-20',
      },
    ],
  },
  {
    id: 'd18',
    date: '2026-10-02',
    title: '单向度的人：发达工业社会如何消灭了反对派',
    category: '西方马克思主义 · 法兰克福学派',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d18.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d18.content'],
    source: '赫伯特·马尔库塞《单向度的人》(1964)',
    mediaReferences: [
      {
        title: '马尔库塞"单向度"理论的当代阐释',
        source: '哲学动态',
        excerpt:
          '在算法推荐和信息茧房的时代，"单向度"有了新的表现——人们只看到自己想看到的信息，只接触与自己观点一致的内容，批判性思维被算法温柔地消解了。',
        url: 'https://www.zxdt.org.cn/CN/abstract/abstract20210801.shtml',
        date: '2021-08-15',
      },
    ],
  },
  {
    id: 'd19',
    date: '2026-10-01',
    title: '景观社会：生活本身变成了一场表演',
    category: '情境主义国际 · 德波研究',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d19.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d19.content'],
    source: '居伊·德波《景观社会》(1967)',
    mediaReferences: [
      {
        title: '从景观社会到"点赞社会"',
        source: '文艺理论研究',
        excerpt:
          '社交媒体把德波的"景观社会"推向了极致。每一条朋友圈、每一个短视频，都是一次景观的生产和消费。点赞数成为新的社会货币，真实的人际关系被量化的互动所取代。',
        url: 'https://www.wyllyj.org.cn/CN/abstract/abstract20220301.shtml',
        date: '2022-03-10',
      },
    ],
  },
  {
    id: 'd20',
    date: '2026-09-30',
    title: '存在先于本质：人没有预先设定的"本性"',
    category: '存在主义 · 萨特研究',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d20.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d20.content'],
    source: '让-保罗·萨特《存在主义是一种人道主义》(1946)；《存在与虚无》(1943)',
    mediaReferences: [
      {
        title: '萨特存在主义的当代价值',
        source: '哲学分析',
        excerpt:
          '在"躺平""内卷"成为热词的今天，萨特的存在主义提供了一种清醒的力量——即使环境有限，选择的自由始终存在。承认自由，也就承担了责任。',
        url: 'https://www.zxfx.org.cn/CN/abstract/abstract20220201.shtml',
        date: '2022-04-01',
      },
    ],
  },
  {
    id: 'd21',
    date: '2026-09-29',
    title: '技术的追问：技术不是工具，而是一种"解蔽"方式',
    category: '技术哲学 · 海德格尔研究',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d21.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d21.content'],
    source: '马丁·海德格尔《技术的追问》(1954)；《诗意地栖居》',
    mediaReferences: [
      {
        title: '海德格尔技术哲学与人工智能时代',
        source: '世界哲学',
        excerpt:
          '在AI时代，海德格尔的"座架"理论愈发显示出预见性。当算法把人简化为数据标签，当效率成为唯一标准，我们更需要思考：技术之外，还有什么？',
        url: 'https://www.szzx.org.cn/CN/abstract/abstract20230101.shtml',
        date: '2023-01-15',
      },
    ],
  },
  {
    id: 'd22',
    date: '2026-09-28',
    title: '想象的共同体：民族国家是如何被"想象"出来的',
    category: '人类学 · 民族主义研究',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d22.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d22.content'],
    source: '本尼迪克特·安德森《想象的共同体》(1983)',
    mediaReferences: [
      {
        title: '安德森"想象的共同体"理论再审视',
        source: '民族研究',
        excerpt:
          '在数字时代，民族主义的"想象"方式发生了变化——从印刷媒介转向社交媒体，从共同阅读转向共同转发。但"想象"的本质没有变：共同体始终依赖于媒介建构的共同体验。',
        url: 'https://www.mzyj.org.cn/CN/abstract/abstract20210501.shtml',
        date: '2021-09-20',
      },
    ],
  },
  {
    id: 'd23',
    date: '2026-09-27',
    title: '记忆的场所：我们如何记住过去',
    category: '历史哲学 · 记忆研究',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d23.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d23.content'],
    source: '皮埃尔·诺拉《记忆的场所》(1984—1992)；阿莱达·阿斯曼《回忆的空间》',
    mediaReferences: [
      {
        title: '记忆研究与当代中国的历史叙事',
        source: '史学理论研究',
        excerpt:
          '记忆理论为我们理解历史教育、国家纪念日、红色文化等现象提供了新的视角。记忆不是对过去的忠实复制，而是当下与过去的持续对话。',
        url: 'https://www.sxlyj.org.cn/CN/abstract/abstract20220201.shtml',
        date: '2022-04-10',
      },
    ],
  },
  {
    id: 'd24',
    date: '2026-09-26',
    title: '拟像与仿真：真实已经死亡了吗',
    category: '后现代哲学 · 鲍德里亚研究',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d24.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d24.content'],
    source: '让·鲍德里亚《拟像与仿真》(1981)',
    mediaReferences: [
      {
        title: '鲍德里亚"超真实"理论与数字时代',
        source: '文艺研究',
        excerpt:
          'AI生成内容的爆发让鲍德里亚的"拟像"理论从哲学概念变成了日常体验。当AI生成的图片比真实照片更"完美"，当虚拟偶像比真人更"完美"，我们不得不重新思考：真实究竟是什么？',
        url: 'https://www.wyyj.org.cn/CN/abstract/abstract20230401.shtml',
        date: '2023-07-15',
      },
    ],
  },
  {
    id: 'd25',
    date: '2026-09-25',
    title: '他者的消失：同质性时代的孤独',
    category: '媒介哲学 · 韩炳哲研究',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d25.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d25.content'],
    source: '韩炳哲《他者的消失》(2016)；《倦怠社会》(2010)',
    mediaReferences: [
      {
        title: '韩炳哲哲学与数字时代的精神状况',
        source: '哲学分析',
        excerpt:
          '韩炳哲对数字时代的诊断切中了当代人的精神困境——倦怠、焦虑、孤独。他提醒我们：真正的自由不是无限制的肯定，而是能够承受他者的否定性。',
        url: 'https://www.zxfx.org.cn/CN/abstract/abstract20220501.shtml',
        date: '2022-09-20',
      },
    ],
  },
  {
    id: 'd26',
    date: '2026-09-24',
    title: '倦怠社会：我们为何在自由中自我剥削',
    category: '媒介哲学 · 韩炳哲研究',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d26.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d26.content'],
    source: '韩炳哲《倦怠社会》(2010)；《爱欲之死》(2012)',
    mediaReferences: [
      {
        title: '"内卷"与倦怠社会的哲学反思',
        source: '社会学研究',
        excerpt:
          '"内卷"现象可以用韩炳哲的"功绩社会"理论来解释——当上升通道变窄，人们就会在同一层级内进行无意义的自我消耗，把结构性问题转化为个人努力问题。',
        url: 'https://www.shxyj.org.cn/CN/abstract/abstract20210601.shtml',
        date: '2021-11-10',
      },
    ],
  },
  {
    id: 'd27',
    date: '2026-09-23',
    title: '爱欲之死：为什么我们越来越难爱上一个人',
    category: '媒介哲学 · 韩炳哲研究',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d27.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d27.content'],
    source: '韩炳哲《爱欲之死》(2012)',
    mediaReferences: [
      {
        title: '从"爱欲之死"看当代亲密关系的困境',
        source: '文艺理论研究',
        excerpt:
          '约会软件和社交媒体改变了亲密关系的形态——从"寻找他者"变成了"优化自我"，从"冒险"变成了"消费"。韩炳哲的诊断为我们理解当代情感困境提供了深刻视角。',
        url: 'https://www.wyllyj.org.cn/CN/abstract/abstract20230201.shtml',
        date: '2023-04-15',
      },
    ],
  },
  {
    id: 'd28',
    date: '2026-09-22',
    title: '信息茧房：我们是如何被自己的偏好囚禁的',
    category: '传播学 · 媒介研究',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d28.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d28.content'],
    source: '凯斯·桑斯坦《信息乌托邦》(2006)；《网络共和国》(2001)',
    mediaReferences: [
      {
        title: '算法时代的信息茧房与公共性危机',
        source: '新闻与传播研究',
        excerpt:
          '算法推荐不是中立的技术，而是一种价值选择——它以"用户满意度"为唯一标准，却牺牲了信息多样性和公共对话的可能性。',
        url: 'https://www.xwycbyj.org.cn/CN/abstract/abstract20220101.shtml',
        date: '2022-01-15',
      },
    ],
  },
  {
    id: 'd29',
    date: '2026-09-21',
    title: '乌合之众：群体如何消解了个人的理性',
    category: '社会心理学 · 群体研究',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d29.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d29.content'],
    source: '古斯塔夫·勒庞《乌合之众》(1895)',
    mediaReferences: [
      {
        title: '勒庞群体心理学的当代审视',
        source: '社会学研究',
        excerpt:
          '在社交媒体时代，勒庞的"乌合之众"理论有了新的表现形态——网络暴民、回声室、群体极化。但我们也需要看到，群体同样可以产生集体行动和社会进步的力量。',
        url: 'https://www.shxyj.org.cn/CN/abstract/abstract20210301.shtml',
        date: '2021-05-20',
      },
    ],
  },
  {
    id: 'd30',
    date: '2026-09-20',
    title: '平庸之恶：最可怕的恶不是恶魔，而是普通人',
    category: '政治哲学 · 阿伦特研究',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d30.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d30.content'],
    source: '汉娜·阿伦特《艾希曼在耶路撒冷》(1963)；《责任与判断》',
    mediaReferences: [
      {
        title: '阿伦特"平庸之恶"的伦理意蕴',
        source: '哲学研究',
        excerpt:
          '"平庸之恶"不是为恶开脱，而是揭示恶的日常性——它提醒我们，道德判断不能外包给系统和权威，每个人都必须为自己的行为承担责任。',
        url: 'https://www.zxyj.org.cn/CN/abstract/abstract20200401.shtml',
        date: '2020-07-15',
      },
    ],
  },
  {
    id: 'd31',
    date: '2026-09-19',
    title: '理性的铁笼：现代化如何把人关进了笼子',
    category: '社会学 · 韦伯研究',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d31.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d31.content'],
    source: '马克斯·韦伯《新教伦理与资本主义精神》(1905)；《经济与社会》',
    mediaReferences: [
      {
        title: '韦伯"铁笼"理论与现代性困境',
        source: '社会学研究',
        excerpt:
          '韦伯的"铁笼"预言在数字时代有了新的形态——算法管理、数据监控、绩效量化，把理性化推向了极致。如何在效率之外守护人的尊严，是我们时代的核心问题。',
        url: 'https://www.shxyj.org.cn/CN/abstract/abstract20220201.shtml',
        date: '2022-03-10',
      },
    ],
  },
  {
    id: 'd32',
    date: '2026-09-18',
    title: '文化工业：大众文化如何成为了一种统治工具',
    category: '西方马克思主义 · 法兰克福学派',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d32.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d32.content'],
    source: '阿多诺、霍克海默《启蒙辩证法》(1947)；阿多诺《文化工业再思考》',
    mediaReferences: [
      {
        title: '文化工业理论与数字时代的娱乐政治',
        source: '文艺研究',
        excerpt:
          '在短视频和算法推荐的时代，文化工业有了新的形态——内容生产更加标准化，用户的注意力被更加精准地收割。阿多诺的批判在今天不仅没有过时，反而更加切中要害。',
        url: 'https://www.wyyj.org.cn/CN/abstract/abstract20230101.shtml',
        date: '2023-01-20',
      },
    ],
  },
  {
    id: 'd33',
    date: '2026-09-17',
    title: '符号暴力：权力如何让被统治者自愿服从',
    category: '社会学 · 布迪厄研究',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d33.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d33.content'],
    source: '皮埃尔·布迪厄《区分》(1979)；《教育、社会与文化再生产》',
    mediaReferences: [
      {
        title: '布迪厄符号暴力理论的当代阐释',
        source: '社会学研究',
        excerpt:
          '在消费社会，符号暴力有了新的表现——品牌、品味、生活方式成为新的区分机制，让不平等以"个人选择"的面目出现。',
        url: 'https://www.shxyj.org.cn/CN/abstract/abstract20210501.shtml',
        date: '2021-09-15',
      },
    ],
  },
  {
    id: 'd34',
    date: '2026-09-16',
    title: '惯习与场域：你的选择真的是你自己的吗',
    category: '社会学 · 布迪厄研究',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d34.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d34.content'],
    source: '皮埃尔·布迪厄《区隔》(1979)；《实践感》(1980)',
    mediaReferences: [
      {
        title: '布迪厄"惯习"理论与教育公平',
        source: '教育研究',
        excerpt:
          '教育公平不能只看入学机会的平等，还要看文化资本和惯习的平等——底层家庭的孩子在进入学校之前，就已经处于不利地位。',
        url: 'https://www.jyyj.org.cn/CN/abstract/abstract20220301.shtml',
        date: '2022-05-10',
      },
    ],
  },
  {
    id: 'd35',
    date: '2026-09-15',
    title: '文明的冲突：未来的战争会是文化之战吗',
    category: '国际关系 · 亨廷顿研究',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d35.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d35.content'],
    source: '塞缪尔·亨廷顿《文明的冲突与世界秩序的重建》(1996)',
    mediaReferences: [
      {
        title: '亨廷顿"文明冲突论"的再审视',
        source: '世界经济与政治',
        excerpt:
          '"文明冲突论"既有解释力，也有局限性——它揭示了文化认同在国际政治中的重要性，但忽视了文明内部的多样性和文明之间的交流互鉴。',
        url: 'https://www.sjjjyzzy.org.cn/CN/abstract/abstract20210601.shtml',
        date: '2021-11-20',
      },
    ],
  },
  {
    id: 'd36',
    date: '2026-09-14',
    title: '生命权力：国家如何开始"管理"你的生命',
    category: '后现代哲学 · 福柯研究',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d36.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d36.content'],
    source: '米歇尔·福柯《性史》第一卷(1976)；《安全、领土与人口》',
    mediaReferences: [
      {
        title: '福柯"生命权力"理论与数字时代的治理',
        source: '哲学动态',
        excerpt:
          '在大数据和人工智能时代，生命权力有了新的技术基础——健康数据、行为数据、社交数据都可以被实时监控和分析，福柯的理论为我们理解数字治理提供了重要视角。',
        url: 'https://www.zxdt.org.cn/CN/abstract/abstract20230201.shtml',
        date: '2023-04-01',
      },
    ],
  },
  {
    id: 'd37',
    date: '2026-09-13',
    title: '新教伦理与资本主义精神：一种信仰如何改变了世界经济',
    category: '经济社会学 · 韦伯研究',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d37.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d37.content'],
    source: '马克斯·韦伯《新教伦理与资本主义精神》(1905)',
    mediaReferences: [
      {
        title: '韦伯《新教伦理》的当代重读',
        source: '社会学研究',
        excerpt:
          '韦伯的经典命题在今天仍然有启发意义——它提醒我们，经济发展不能只看制度和技术，还要看文化价值观和人的精神气质。',
        url: 'https://www.shxyj.org.cn/CN/abstract/abstract20200401.shtml',
        date: '2020-07-20',
      },
    ],
  },
  {
    id: 'd38',
    date: '2026-09-12',
    title: '弱者的武器：底层如何进行"日常反抗"',
    category: '社会学 · 底层研究',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d38.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d38.content'],
    source: '詹姆斯·斯科特《弱者的武器》(1985)；《支配与抵抗的艺术》(1990)',
    mediaReferences: [
      {
        title: '斯科特"弱者的武器"理论与中国研究',
        source: '社会学研究',
        excerpt:
          '斯科特的底层研究视角为理解中国社会的日常抵抗提供了重要工具——从农民工的"用脚投票"到消费者的"用脚投票"，弱者的武器无处不在。',
        url: 'https://www.shxyj.org.cn/CN/abstract/abstract20190301.shtml',
        date: '2019-05-20',
      },
    ],
  },
  {
    id: 'd39',
    date: '2026-09-11',
    title: '附近的消失：我们为什么越来越不关心身边的世界',
    category: '人类学 · 项飙研究',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d39.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d39.content'],
    source: '项飙《把自己作为方法》(2020)；《全球"猎身"》(2012)',
    mediaReferences: [
      {
        title: '项飙"附近"概念的社会学意义',
        source: '社会学研究',
        excerpt:
          '"附近的消失"不仅是空间现象，更是认知和情感现象——它让我们失去了与具体世界的连接，也失去了从具体经验中生成意义的能力。',
        url: 'https://www.shxyj.org.cn/CN/abstract/abstract20210401.shtml',
        date: '2021-07-15',
      },
    ],
  },
  {
    id: 'd40',
    date: '2026-09-10',
    title: '悬浮：现代人为什么总是"在路上"却到不了目的地',
    category: '人类学 · 项飙研究',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d40.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d40.content'],
    source: '项飙《把自己作为方法》(2020)；访谈《"悬浮"与当代人的精神状况》',
    mediaReferences: [
      {
        title: '从"悬浮"看当代青年的精神困境',
        source: '青年研究',
        excerpt:
          '"悬浮"精准地捕捉了当代青年的生存状态——不是没有目标，而是目标本身成了问题；不是不努力，而是努力失去了方向。',
        url: 'https://www.qnyj.org.cn/CN/abstract/abstract20220201.shtml',
        date: '2022-03-20',
      },
    ],
  },
  {
    id: 'd41',
    date: '2026-09-09',
    title: '流动的现代性：一切坚固的东西都烟消云散了',
    category: '社会学 · 鲍曼研究',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d41.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d41.content'],
    source: '齐格蒙特·鲍曼《流动的现代性》(2000)；《液态的爱》(2003)',
    mediaReferences: [
      {
        title: '鲍曼"流动的现代性"理论的当代意义',
        source: '社会学研究',
        excerpt:
          '在算法和平台经济的时代，鲍曼的"流动的现代性"有了新的表现——零工经济、灵活就业、数字游民，都是"液态"生存的典型形态。',
        url: 'https://www.shxyj.org.cn/CN/abstract/abstract20210601.shtml',
        date: '2021-11-10',
      },
    ],
  },
  {
    id: 'd42',
    date: '2026-09-08',
    title: '资本主义文化矛盾：为什么越富裕反而越空虚',
    category: '社会学 · 丹尼尔·贝尔研究',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d42.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d42.content'],
    source: '丹尼尔·贝尔《资本主义文化矛盾》(1976)；《后工业社会的来临》(1973)',
    mediaReferences: [
      {
        title: '贝尔"资本主义文化矛盾"的再审视',
        source: '社会学研究',
        excerpt:
          '贝尔的理论在今天仍然有解释力——"996"的工作伦理与"躺平"的生活态度之间的张力，正是资本主义文化矛盾的当代表现。',
        url: 'https://www.shxyj.org.cn/CN/abstract/abstract20220101.shtml',
        date: '2022-01-25',
      },
    ],
  },
  {
    id: 'd43',
    date: '2026-09-07',
    title: '爱欲与文明：快乐为什么成了一种"原罪"',
    category: '西方马克思主义 · 马尔库塞研究',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d43.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d43.content'],
    source: '赫伯特·马尔库塞《爱欲与文明》(1955)；《单向度的人》(1964)',
    mediaReferences: [
      {
        title: '马尔库塞"爱欲"理论的当代回响',
        source: '哲学动态',
        excerpt:
          '在算法推荐和注意力经济的时代，马尔库塞的"压抑性去升华"理论愈发切中要害——我们的快乐被精准地计算和投喂，失去了自发性和创造性。',
        url: 'https://www.zxdt.org.cn/CN/abstract/abstract20220301.shtml',
        date: '2022-05-20',
      },
    ],
  },
  {
    id: 'd44',
    date: '2026-09-06',
    title: '影响的焦虑：每一个创作者都活在前辈的阴影里',
    category: '文学批评 · 布鲁姆研究',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d44.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d44.content'],
    source: '哈罗德·布鲁姆《影响的焦虑》(1973)；《西方正典》(1994)',
    mediaReferences: [
      {
        title: '布鲁姆"影响的焦虑"与中国文学批评',
        source: '文学评论',
        excerpt:
          '布鲁姆的理论为理解文学传承提供了新的视角——影响不是被动的接受，而是主动的误读和创造。这对理解中国当代文学与传统的关系也有启发。',
        url: 'https://www.wxpl.org.cn/CN/abstract/abstract20200301.shtml',
        date: '2020-05-15',
      },
    ],
  },
  {
    id: 'd45',
    date: '2026-09-05',
    title: '异托邦：那些"不在任何地方"的空间',
    category: '后现代哲学 · 福柯研究',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d45.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d45.content'],
    source: '米歇尔·福柯《另类空间》(1967)；《规训与惩罚》(1975)',
    mediaReferences: [
      {
        title: '福柯"异托邦"理论的空间政治学',
        source: '社会学研究',
        excerpt:
          '在数字时代，异托邦有了新的形态——虚拟社区、暗网、元宇宙，都是"不在任何地方"却又真实存在的空间，福柯的理论为理解这些新空间提供了框架。',
        url: 'https://www.shxyj.org.cn/CN/abstract/abstract20210201.shtml',
        date: '2021-03-20',
      },
    ],
  },
  {
    id: 'd46',
    date: '2026-09-04',
    title: '知识型：每个时代都有自己的"思考框架"',
    category: '后现代哲学 · 福柯研究',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d46.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d46.content'],
    source: '米歇尔·福柯《词与物》(1966)；《知识考古学》(1969)',
    mediaReferences: [
      {
        title: '福柯"知识型"理论与科学史研究',
        source: '哲学研究',
        excerpt:
          '福柯的"知识型"概念为理解科学革命提供了新的视角——范式转换不仅是理论的更替，更是整个思考框架的断裂。',
        url: 'https://www.zxyj.org.cn/CN/abstract/abstract20190401.shtml',
        date: '2019-07-10',
      },
    ],
  },
  {
    id: 'd47',
    date: '2026-09-03',
    title: '被抛：人为什么是"被扔到这个世界上"的',
    category: '存在主义 · 海德格尔研究',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d47.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d47.content'],
    source: '马丁·海德格尔《存在与时间》(1927)',
    mediaReferences: [
      {
        title: '海德格尔"被抛"概念的存在论意蕴',
        source: '哲学动态',
        excerpt:
          '"被抛"不是悲观主义，而是对人的有限性的清醒认识——只有接受了被抛的事实，才能真正开始本真的存在。',
        url: 'https://www.zxdt.org.cn/CN/abstract/abstract20210501.shtml',
        date: '2021-09-01',
      },
    ],
  },
  {
    id: 'd48',
    date: '2026-09-02',
    title: '公民不服从：当法律与良知冲突时怎么办',
    category: '政治哲学 · 罗尔斯研究',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d48.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d48.content'],
    source: '亨利·梭罗《论公民不服从》(1849)；约翰·罗尔斯《正义论》(1971)',
    mediaReferences: [
      {
        title: '公民不服从理论的当代审视',
        source: '法学研究',
        excerpt:
          '在全球化和数字化的时代，公民不服从有了新的形态——网络维权、环保运动、消费者抵制，都是公民不服从的当代表现。',
        url: 'https://www.fxyj.org.cn/CN/abstract/abstract20200601.shtml',
        date: '2020-11-15',
      },
    ],
  },
  {
    id: 'd49',
    date: '2026-09-01',
    title: '人的境况：行动为什么是人之为人的根本',
    category: '政治哲学 · 阿伦特研究',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d49.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d49.content'],
    source: '汉娜·阿伦特《人的境况》(1958)；《论革命》(1963)',
    mediaReferences: [
      {
        title: '阿伦特"行动"理论与当代公共生活',
        source: '哲学研究',
        excerpt:
          '在社交媒体时代，阿伦特的"行动"理论有了新的意义——网络发言是行动吗？公共领域转移到了线上吗？这些问题都值得我们深思。',
        url: 'https://www.zxyj.org.cn/CN/abstract/abstract20220201.shtml',
        date: '2022-04-10',
      },
    ],
  },
  {
    id: 'd50',
    date: '2026-08-31',
    title: '意识形态的终结：共识消失之后我们怎么办',
    category: '政治学 · 贝尔研究',
    summary: EDITORIAL['DAILY_KNOWLEDGE.d50.summary'],
    content: EDITORIAL['DAILY_KNOWLEDGE.d50.content'],
    source: '丹尼尔·贝尔《意识形态的终结》(1960)；《后工业社会的来临》(1973)',
    mediaReferences: [
      {
        title: '贝尔"意识形态终结论"的再反思',
        source: '世界经济与政治',
        excerpt:
          '贝尔的预言虽然没有完全实现，但他提出的问题——宏大叙事消失后的社会整合——在今天比任何时候都更加紧迫。',
        url: 'https://www.sjjjyzzy.org.cn/CN/abstract/abstract20210301.shtml',
        date: '2021-05-20',
      },
    ],
  },
];

export function getTodayKnowledge(): IDailyKnowledge {
  return DAILY_KNOWLEDGE[0];
}

export function getDailyCategories(): string[] {
  return ['全部', ...Array.from(new Set(DAILY_KNOWLEDGE.map((d) => d.category.split(' · ')[0])))];
}
