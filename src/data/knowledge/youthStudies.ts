import type { IDailyKnowledge, IResearchSource } from '../types';

interface YouthStudy {
  id: string;
  conceptId: string;
  concept: string;
  category: string;
  title: string;
  summary: string;
  content: string;
  topics: string[];
  researchSource: IResearchSource;
}

/** One reviewed bibliography feeds 日新, 观澜 and writing materials.
 * Scope of review and full-text availability are recorded in CONTENT_SOURCES.md.
 * Do not infer unreported sample sizes or methods from a paper's title. */
export const YOUTH_STUDIES: YouthStudy[] = [
  {
    id: 'd101',
    conceptId: 'e71',
    concept: '认得与认可',
    category: '社会学 · 承认',
    title: '认得与认可：成绩之外，一个人怎样被理解',
    summary: '项飙、康岚区分两种承认：按外部标准获得肯定，与在具体关系中被了解，并不是同一回事。',
    content:
      '项飙、康岚以“认得”与“认可”解释证明自我价值为何令人疲惫。“认可”依赖评价者与既定标准，“认得”则强调平等主体之间的了解。一个人获得了成绩、头衔或录取资格，仍可能感到自己的经历与感受没有被看见。\n\n两位作者关注的是：当外部评价成为价值感的主要支点，人与自己的关系如何变化。文章提出在具体交往中重新平衡两种承认，让对人的了解不被单一的成功标准替代。\n\n这是一种关于社会关系的分析框架，不是人群调查所得的比例，也不意味着成绩和评价没有意义。它把“我是否达标”与“我是否被理解”这两个容易混在一起的问题区分开来。',
    topics: ['自我价值', '评价与理解', '人与人的关系'],
    researchSource: {
      title: '关于承认的两种模式：认得与认可',
      authors: ['项飙', '康岚'],
      journal: '当代青年研究',
      year: 2025,
      issue: '4',
      pages: '1–21',
      url: 'https://qing.cbpt.cnki.net/portal/journal/portal/client/paper/d1e2af27446d83938a303387bcb52a6d',
    },
  },
  {
    id: 'd102',
    conceptId: 'e72',
    concept: '考研与自我身份',
    category: '社会学 · 教育与身份',
    title: '考研与自我身份：“上岸”之后，我是谁',
    summary: '孙孝孝讨论考研成功叙事如何塑造自我想象，以及长期备考中风险与成长并存的经验。',
    content:
      '孙孝孝研究考研者如何理解“上岸”。当高分与录取成为共同的成功想象，自律和追赶目标不只是一套备考行动，也逐渐参与塑造“我应该成为怎样的人”。对确定结果的追求，可能转化为对外部认可的依赖。\n\n文章同时保留了另一面：在封闭、重复而不确定的生活中，部分个体仍通过微小行动维系日常秩序，重新寻找可感知的意义。压力并未消除所有能动性，成长也不意味着压力本身值得赞美。\n\n作者分析的是身份与生活经验之间的张力，并没有把考研判定为普遍有害。录取能回答一次选拔的结果，却未必独自回答一个人的全部价值与生活方向。',
    topics: ['考研', '确定与不确定', '自我认同'],
    researchSource: {
      title: '“悬搁的自我”：考研“上岸生”的身份建构与自我失落风险',
      authors: ['孙孝孝'],
      journal: '当代青年研究',
      year: 2026,
      issue: '5',
      pages: '68–84',
      url: 'https://qing.cbpt.cnki.net/portal/journal/portal/client/paper/281d253c23c85aa68faacc5d533699a2',
    },
  },
  {
    id: 'd103',
    conceptId: 'e73',
    concept: '青年的内在性转向',
    category: '人类学 · 青年文化',
    title: '青年的内在性转向：为什么越来越在意自己的感受',
    summary: '阎云翔、康岚从代际与社会变化讨论青年对内心、情绪和个人边界的关注。',
    content:
      '阎云翔、康岚用“内在性转向”讨论一种变化：生活意义的重心，由外部角色与成功叙事，更多转向内心感受、心理一致性与自我理解。这种变化发生在家庭期待、机会的不确定性和数字交往共同构成的生活环境中。\n\n在这一解释中，强调边界与情绪并不能简单归为自私或脆弱。它包含重新掌握生活的努力，也伴随意义支点不稳定、个人与外部世界如何连接等新问题。\n\n文章提供的是理解代际经验的理论视角，并不表示同一年龄的人拥有相同心态。重视内心与参与公共生活之间，也不必被预设成非此即彼的选择。',
    topics: ['代际经验', '情绪与自我', '个人边界'],
    researchSource: {
      title: '退守内心（上）：Z世代的内在性转向与“情感革命”',
      authors: ['阎云翔', '康岚'],
      journal: '当代青年研究',
      year: 2026,
      issue: '2',
      pages: '1–22',
      url: 'https://qing.cbpt.cnki.net/portal/journal/portal/client/paper/f36e042a2a69f3cc1a4cc1c807c4b662',
    },
  },
  {
    id: 'd104',
    conceptId: 'e74',
    concept: '好学生心态与自我价值',
    category: '社会学 · 教育与成长',
    title: '好学生心态与自我价值：优秀为何会有不同的体验',
    summary: '温丽蔚、江淑玲通过深度访谈，比较以外部优绩与自身成长为重心的不同学习心态。',
    content:
      '温丽蔚、江淑玲区分“优绩本位”与“自我本位”两种分析类型。前者更依赖外部成绩与竞争位置，后者更强调学习与个人成长的联系。同样获得好成绩，学习、交往与自我感受仍可能很不一样。\n\n深度访谈把这种差异放回家庭期待、代际交换与身份建构之中。研究关注竞争如何进入日常，以及人在何种关系里把评价标准变成对自己的要求，而不只追问个人够不够坚强。\n\n这两种类型是理解经验的工具，不是给学生贴上终身标签。研究并不反对努力或追求优秀，而是讨论：当成绩成为唯一价值尺度，成长中的其他部分如何被挤压。',
    topics: ['优秀与成长', '家庭期待', '自我价值'],
    researchSource: {
      title: '“优绩本位”与“自我本位”：“好学生”心态分化及其形成机制',
      authors: ['温丽蔚', '江淑玲'],
      journal: '当代青年研究',
      year: 2025,
      issue: '4',
      pages: '22–37',
      url: 'https://qing.cbpt.cnki.net/portal/journal/portal/client/paper/37ecbe49024a5c3b93ae39be3474c6f9',
    },
  },
  {
    id: 'd105',
    conceptId: 'e75',
    concept: '松弛感与自我呈现',
    category: '社会心理学 · 青年心态',
    title: '松弛感与自我呈现：自在，还是必须显得自在',
    summary: '孟志雷、宋一婷将认知、情感与行为分开观察，呈现“松弛感”内部并不一致的体验。',
    content:
      '孟志雷、宋一婷采用质性研究，从认知、情感和行为三个维度分析大学生的“松弛感”。研究区分悦纳自己与表演自在，也注意到从容和内耗可能同时存在，口头上的轻松并不必然对应生活中的轻松。\n\n作者把这种复杂心态与优绩评价、媒介符号及主体性重建联系起来。建设性的放松与形式上的摆烂，在行为层面也可能走向不同方向，不能只凭一个流行标签判断。\n\n这项研究提供了拆解经验的方式，而不是要求每个人成为某种“松弛的人”。当自在本身变成需要展示的标准，它也可能参与新的比较。',
    topics: ['松弛感', '内耗', '自我呈现'],
    researchSource: {
      title: '当代大学生的松弛感：现实图景、生成逻辑与引导策略',
      authors: ['孟志雷', '宋一婷'],
      journal: '当代青年研究',
      year: 2026,
      issue: '4',
      pages: '17–33',
      url: 'https://qing.cbpt.cnki.net/portal/journal/portal/client/paper/f3c6c3758c74daf6a30dd3e56ec174ef',
    },
  },
  {
    id: 'd106',
    conceptId: 'e76',
    concept: '时间的过度道德化',
    category: '社会学 · 时间',
    title: '时间的过度道德化：为什么休息也会有负罪感',
    summary: '孙元涛、祖宇轩研究研究生的时间体验：事情做不完之外，还有“时间必须有产出”的自我要求。',
    content:
      '孙元涛、祖宇轩通过质性研究讨论研究生的时间焦虑。在任务增加、节奏加快的生活中，时间容量与任务要求发生冲突；被动等待、同时处理多项工作和同辈比较，又使“没有在产出”的时间显得难以容忍。\n\n研究将时间的过度道德化与压力的自我再生产联系起来：效率不再只是安排事务的方法，还可能变成评价一个人是否足够努力的尺度。于是，闲暇也需要不断证明自己的正当性。\n\n这里的焦虑指向特定教育环境中的时间体验，不是对所有研究生的心理诊断。把问题全部归因于个人拖延，会遮蔽任务组织与评价节奏的作用。',
    topics: ['时间压力', '效率与生活', '同辈比较'],
    researchSource: {
      title: '“加速社会”中研究生群体的时间焦虑——一项关于“时间体验”的质性研究',
      authors: ['孙元涛', '祖宇轩'],
      journal: '教育科学',
      year: 2025,
      volume: 41,
      issue: '3',
      pages: '52–59',
      url: 'https://jykx.lnnu.edu.cn/CN/abstract/abstract502.shtml',
    },
  },
  {
    id: 'd107',
    conceptId: 'e77',
    concept: '校园招聘的体验机制',
    category: '社会学 · 求职',
    title: '校园招聘的体验机制：岗位信息之外，选择怎样发生',
    summary: '盛春、周蓉从上海十所高校的招聘会出发，研究信息理解、情感体验与就业意愿之间的联系。',
    content:
      '盛春、周蓉考察2022—2023年上海十所高校的招聘会，把招聘看作毕业生与企业相互作用的过程。岗位信息是否贴合需求、交流中的情感连接以及行动意愿，并不是彼此孤立的环节。\n\n研究区分主动寻找、比较选择和随意参与等不同体验。相同的企业展示，对处于不同求职阶段的人可能具有不同意义；招聘会因此不只是企业信息的陈列，也在互动中塑造吸引力。\n\n这项研究关注就业意愿及其形成过程，不能直接当作入职后的满意度或工作表现证据。它的具体场景也提醒我们，城市、学校与招聘形式变化后，结论需要重新检验。',
    topics: ['就业选择', '信息与体验', '职业想象'],
    researchSource: {
      title: '“人才吸引战”：校园招聘“认知—情感—行为”体验模式对毕业生就业意愿的影响',
      authors: ['盛春', '周蓉'],
      journal: '当代青年研究',
      year: 2025,
      issue: '6',
      pages: '20–35',
      url: 'https://qing.cbpt.cnki.net/portal/journal/portal/client/paper/d252bf25d104cc399cd7559d55d3463f',
    },
  },
  {
    id: 'd108',
    conceptId: 'e78',
    concept: '实习中的不确定性',
    category: '社会学 · 数字劳动',
    title: '实习中的不确定性：大厂经历怎样改变职业想象',
    summary:
      '顾楚丹、文军从劳动过程理解互联网实习：企业与实习生都在应对不确定性，拥有的资源却不对等。',
    content:
      '顾楚丹、文军考察互联网“大厂”实习生的数字劳动。企业需要处理用工与工作过程的不确定性，实习生则面对能力、职业前景和自我价值的不确定性，两者在同一劳动过程中相遇。\n\n研究注意到组织品牌、赋能与控制之间的联系，也讨论实习生借助关系网络与社群应对处境的方式。名企经历不仅是简历上的一行文字，还涉及对工作规则、个人位置与未来可能性的理解。\n\n这种劳动过程分析不等于所有互联网实习的共同结局，更不能证明一个组织标签就能保证职业发展。它让“获得了什么经历”与“怎样参与其中”同时进入视野。',
    topics: ['实习', '数字劳动', '职业身份'],
    researchSource: {
      title: '应对不确定性：互联网“大厂”实习生的数字劳动过程',
      authors: ['顾楚丹', '文军'],
      journal: '华东师范大学学报（哲学社会科学版）',
      year: 2022,
      volume: 54,
      issue: '5',
      pages: '121–132',
      url: 'https://xbzs.ecnu.edu.cn/CN/abstract/abstract11827.shtml',
      fullTextUrl:
        'https://xbzs.ecnu.edu.cn/CN/article/downloadArticleFile.do?attachType=PDF&id=11827',
    },
  },
  {
    id: 'd109',
    conceptId: 'e79',
    concept: '临时共同体与消费空间',
    category: '社会学 · 消费与共同体',
    title: '临时共同体与消费空间：学术酒吧里的相遇能留下什么',
    summary: '王健以学术酒吧为例，研究知识消费如何提供短暂归属，也如何受到商业空间的塑造。',
    content:
      '王健以网络文本为材料，将学术酒吧放在青年交往与消费文化的关系中理解。围绕知识话题的线下聚会，让陌生人在校园与职场之外获得暂时的连接，共同参与本身也具有情感意义。\n\n文章用“衣帽间式的共同体”讨论这种短暂、情境化的归属。活动可以成为情感停靠点，但关系又受到消费场景、文化资本和仪式安排的影响，不必然延伸为稳定的日常支持。\n\n这一视角没有证明所有参与者都孤独，也不意味着付费活动中的关系就是虚假的。短暂相遇的价值，与它能否承载长期关系，是两个不同的问题。',
    topics: ['归属感', '消费空间', '知识与交往'],
    researchSource: {
      title: '“衣帽间式的共同体”：青年社交困境纾解的消费主义逻辑——以“学术酒吧”为例',
      authors: ['王健'],
      journal: '北京青年研究',
      year: 2026,
      volume: 35,
      issue: '4',
      pages: '86–93',
      url: 'https://bjqz.cbpt.cnki.net/portal/journal/portal/client/paper/d00fdac81d2ed1b492cfbda25a492bcf',
    },
  },
  {
    id: 'd110',
    conceptId: 'e80',
    concept: '亲密关系的数字边界',
    category: '社会学 · 亲密关系',
    title: '亲密关系的数字边界：查看手机，究竟意味着什么',
    summary: '路阳访谈上海十四位青年，分析伴侣如何围绕查看手机协商信任、隐私与关系意义。',
    content:
      '路阳以十四位上海青年的经验研究伴侣间的手机查看行为。互相查看、单方面查看和不查看，并不只是一项设备使用安排，也承载了对信任、亲密和个人边界的不同理解。\n\n从象征互动的角度看，同一个行为在不同关系中可能有不同含义：双方如何解释、接受或拒绝，以及这些解释如何变化，都是关系建构的一部分。手机中的信息并不能脱离交往情境自行说明一切。\n\n小规模访谈能展示协商过程，不能据此推断某种行为在青年中有多普遍，更不能把查看或不查看手机当作爱与不爱的统一测试。',
    topics: ['亲密关系', '隐私与信任', '关系边界'],
    researchSource: {
      title: '数字时代亲密关系的象征互动与意义建构',
      authors: ['路阳'],
      journal: '中北大学学报（社会科学版）',
      year: 2024,
      volume: 40,
      issue: '6',
      pages: '46–52',
      url: 'https://cjournal.hep.com.cn/1673-1646/CN/1200838558677607036',
    },
  },
  {
    id: 'd111',
    conceptId: 'e81',
    concept: '算法依恋',
    category: '媒介研究 · 人机关系',
    title: '算法依恋：被回应的感觉，怎样变成亲密',
    summary: '关茹之、毛春通过参与式观察和深度访谈，研究AI陪伴中的自我表露、情感连接与关系不对称。',
    content:
      '关茹之、毛春借助社会渗透理论，讨论人如何与AI形成情感联结。可定制、可回应的互动降低了部分交往风险，持续的自我表露又让使用者感到被接纳，关系因此可能超出单纯的工具使用。\n\n研究同时关注这种亲近感背后的不对称：回应由平台与算法组织，个人却可能投入真实情绪与私密信息。主体认同、数据关系与情感劳动，因而成为理解人机陪伴的重要部分。\n\n参与观察和访谈可以解释某些连接如何形成，并不证明AI具有人的感受，也不是人机陪伴必然造成伤害的因果实验。体验到的亲密，与关系背后的技术安排，需要同时理解。',
    topics: ['AI陪伴', '情感与技术', '自我表露'],
    researchSource: {
      title: '算法依恋：社会渗透理论视域下的人机情感联结研究',
      authors: ['关茹之', '毛春'],
      journal: '视听',
      year: 2026,
      issue: '1',
      pages: '110–114',
      url: 'https://shit.cbpt.cnki.net/portal/journal/portal/client/paper/89eb8a4573452bd6d2f872cdfc47f60f',
    },
  },
  {
    id: 'd112',
    conceptId: 'e82',
    concept: '数字素养与情绪消费',
    category: '经济学 · 数字消费',
    title: '数字素养与情绪消费：会用技术，是否就更会消费',
    summary: '葛晨等利用五轮家庭追踪调查数据，讨论数字素养、情绪与青年线上消费之间的差异化联系。',
    content:
      '葛晨、李兴申、付一、王海军使用2014—2022年五轮中国家庭追踪调查数据，分析数字素养与青年线上消费。研究将情绪纳入解释，发现相关联系会随负面情绪的出现频率而变化。\n\n在较少出现负面情绪的群体中，数字素养与线上消费增加的联系更明显。收入、社会网络与流动性等条件，也参与塑造差异；因此，设备操作能力并不能单独解释所有消费行为。\n\n这是一项基于调查数据的实证分析，不能改写成“会用手机就会乱花钱”，也不能把消费额直接当作理性程度。便利、情绪与资源条件之间的关系，比单一的技术熟练度更复杂。',
    topics: ['情绪消费', '数字素养', '选择与资源'],
    researchSource: {
      title: '数字素养促进了青年线上消费吗？——基于情绪视角的分析',
      authors: ['葛晨', '李兴申', '付一', '王海军'],
      journal: '上海财经大学学报',
      year: 2026,
      volume: 28,
      issue: '2',
      pages: '109–123',
      url: 'https://qks.sufe.edu.cn/J/CDXB/Article/Details/A0eaXU3Id8-UvVp-G2PS-WJuC-L5KTZyennHUD/CN',
      fullTextUrl: 'https://qks.sufe.edu.cn/J/PDFFull/A0eaXU3Id8-UvVp-G2PS-WJuC-L5KTZyennHUD.pdf',
    },
  },
  {
    id: 'd113',
    conceptId: 'e83',
    concept: '本真性与体验消费',
    category: '社会学 · 文化消费',
    title: '本真性与体验消费：年轻人为什么在旅行中“主动求苦”',
    summary: '刘笑明、雷濛以乡村体验游为例，讨论身体劳作、逃离日常、自我表达与商业场景之间的张力。',
    content:
      '刘笑明、雷濛分析莫干山与丹寨的乡村体验游，关注青年主动选择身体付出的旅游实践。自我投射、暂时逃离日常和社会展示等动机交织，使辛苦不只作为成本，也被赋予体验与意义。\n\n研究讨论身体感受如何通过文化理解转化为归属与自我叙述，同时保留主体能动性与商业景观之间的张力。“真实生活”的追求，也可能被组织成可购买、可展示的体验。\n\n这并不意味着苦本身更高贵，也不能将短期体验等同于当地人的长期生活。文章解释的是特定消费实践如何产生意义，而不是推荐以受苦证明自我。',
    topics: ['体验消费', '本真性', '日常与远方'],
    researchSource: {
      title: '“主动求苦”：Z世代乡村体验游的消费动机、实践逻辑与意义建构',
      authors: ['刘笑明', '雷濛'],
      journal: '当代青年研究',
      year: 2026,
      issue: '5',
      pages: '50–67',
      url: 'https://qing.cbpt.cnki.net/portal/journal/portal/client/paper/d4240a8da3f90525ba3dabeb23a7c3ef',
    },
  },
  {
    id: 'd114',
    conceptId: 'e84',
    concept: '搭子社交的关系边界',
    category: '社会学 · 社交关系',
    title: '搭子社交的关系边界：一起做事，是否也能彼此靠近',
    summary: '张健分析以具体活动为纽带的轻量关系，讨论明确边界、功能配合与情感发展的多种可能。',
    content:
      '张健从形态与变化路径分析“搭子社交”：人们围绕某项活动建立联系，以较明确的功能期待和可协商的亲密边界共同参与。数字平台让这种情境性的相遇更容易发生。\n\n关系并不只有一次合作后立即消散这一种结局。它可能保留为较弱的联系，也可能在持续相处中加深情感。工具性需求与情感可能性，可以存在于同一段交往之中。\n\n这是一种社交形式的分析，不是所有青年的关系调查。把搭子一概理解成冷漠的交易，或把一次共同活动直接当作深度友谊，都会忽略关系形成的过程与双方的期待。',
    topics: ['搭子社交', '弱连接', '关系边界'],
    researchSource: {
      title: '“搭子社交”：青年群体的关系调适与社交适应',
      authors: ['张健'],
      journal: '新媒体研究',
      year: 2025,
      issue: '12',
      pages: '104–108',
      url: 'https://www.xmtyj.org.cn/zh/article/doi/10.16604/j.cnki.issn2096-0360.2025.12.009/',
    },
  },
];

export function researchCitation(source: IResearchSource): string {
  return `${source.authors.join('、')}：《${source.title}》，《${source.journal}》${source.year}${source.volume ? `, ${source.volume}` : ''}(${source.issue})，${source.pages}页`;
}

export const YOUTH_KNOWLEDGE: IDailyKnowledge[] = YOUTH_STUDIES.map((item) => ({
  id: item.id,
  date: '2026-10-24',
  title: item.title,
  category: item.category,
  summary: item.summary,
  content: item.content,
  source: `${researchCitation(item.researchSource)}：${item.researchSource.url}`,
  researchSource: item.researchSource,
}));
