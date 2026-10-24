import type { IDailyKnowledge } from '../types';

/** Shared bibliography for 日新 and the corresponding writing materials. */
export const LEARNING_AND_CULTURE = [
  {
    id: 'd83',
    conceptId: 'e53',
    concept: '生产率 J 曲线',
    category: '经济学 · 技术',
    title: '生产率 J 曲线：新工具为什么没有立刻带来效率',
    summary: '技术的收益往往需要流程、技能和组织配合；购买工具与形成能力之间，还有一段投入过程。',
    content:
      '布林约尔松、罗克和西弗森研究通用技术时指出，企业除了购置设备，还要投入培训、流程和商业模式等无形资产。这些投入未被充分计量时，早期生产率表现可能低于实际积累，随后才逐步显现收益。\n\nJ 曲线讨论的是技术与互补投入的关系，并不保证所有投资最终成功。评价工具，要同时观察学习成本、流程变化与实际产出，不能仅凭刚上线时的速度或一时的宣传热度作判断。',
    topics: ['技术与生活', '积累', '效率'],
    sourceTitle:
      'Brynjolfsson、Rock、Syverson：The Productivity J-Curve（NBER 25148；2021年期刊版）',
    url: 'https://www.nber.org/papers/w25148',
  },
  {
    id: 'd84',
    conceptId: 'e54',
    concept: '增强与替代',
    category: '技术哲学 · 人工智能',
    title: '图灵陷阱：像人，是否就是技术的唯一目标',
    summary:
      '布林约尔松提出，应同时关注技术扩展人的能力、创造新活动的可能，而不只衡量它能替代多少人。',
    content:
      '《图灵陷阱》把“模仿人的智能”与“增强人的能力”区分开来。作者认为，只追求用机器完成已有工作，可能忽视新产品、新服务与新的合作方式，并改变劳动者的议价能力。\n\n这是关于技术方向的论证，不是对每项自动化的否定。同一种工具可以用来压缩岗位，也可以辅助人完成原来做不到的事；实际结果取决于设计目标、任务安排与收益如何分配。',
    topics: ['人与技术', '创造', '主体性'],
    sourceTitle: 'Erik Brynjolfsson：The Turing Trap（2022）',
    url: 'https://arxiv.org/abs/2201.04200',
  },
  {
    id: 'd85',
    conceptId: 'e55',
    concept: '自动化与新任务',
    category: '经济学 · 劳动',
    title: '工作会消失，也会改变：从职业名称转向具体任务',
    summary: '自动化替代部分任务，新任务又可能增加对人的需求；生产率增长与就业变化不是同一个指标。',
    content:
      '阿西莫格鲁与雷斯特雷波在《自动化与新任务》中，用任务分配解释技术与劳动的关系。机器承担原有任务会产生替代效应，新任务的出现则可能让劳动重新进入生产过程。\n\n因此，“某种职业会不会消失”往往需要拆开讨论：哪些环节改变了，哪些能力仍被需要，是否出现新的分工。总产出增加并不意味着每个人都受益，任务创造也不能自动弥补所有人的转型成本。',
    topics: ['变化与适应', '劳动', '技术创新'],
    sourceTitle: 'Daron Acemoglu、Pascual Restrepo：Automation and New Tasks，JEP 33(2)，2019',
    url: 'https://www.aeaweb.org/articles?id=10.1257/jep.33.2.3',
  },
  {
    id: 'd86',
    conceptId: 'e56',
    concept: '提取练习与迁移',
    category: '认知心理学 · 学习',
    title: '能回忆，能否就能运用？提取练习的迁移边界',
    summary: '主动回忆有助于保持知识，但把知识用于新问题，还受到任务形式和已有掌握程度的影响。',
    content:
      'Pan 与 Rickard 汇总了提取练习的迁移研究：与重新学习相比，测试式回忆整体上能促进后续迁移，但效果随问题类型和练习条件而变化。回忆某个答案，与在新情境中推理，并非完全相同的活动。\n\n熟悉不等于能够独立提取，提取成功也不等于已经掌握所有应用。理解研究时，应区分记住原题、解释原理和解决新问题，避免把一种有效方法说成适用于一切内容的捷径。',
    topics: ['知与行', '学习', '迁移'],
    sourceTitle:
      'Steven C. Pan、Timothy C. Rickard：Transfer of test-enhanced learning，Psychological Bulletin，2018',
    url: 'https://pubmed.ncbi.nlm.nih.gov/29733621/',
  },
  {
    id: 'd87',
    conceptId: 'e57',
    concept: '间隔效应',
    category: '认知心理学 · 学习',
    title: '为什么隔一段时间再读，可能比连续重读更有用',
    summary: '分散学习与长期保持有关，但合适的间隔依赖内容、任务和希望记住的时间。',
    content:
      'Cepeda 等人的元分析比较了分散学习与集中学习。研究表明，学习间隔和最终保持时间共同影响记忆表现：希望保持得越久，较合适的间隔通常也会随之变化。\n\n这不是一张适用于所有人的固定复习日历。材料难度、原有知识和反馈方式都会影响效果；同样的总时长，怎样分配与隔多久检查一次理解，都是学习过程的一部分。',
    topics: ['时间', '积累', '学习方法'],
    sourceTitle:
      'Nicholas J. Cepeda 等：Distributed practice in verbal recall tasks，Psychological Bulletin，2006',
    url: 'https://pubmed.ncbi.nlm.nih.gov/16719566/',
  },
  {
    id: 'd88',
    conceptId: 'e58',
    concept: '认知卸载',
    category: '认知心理学 · 工具',
    title: '把记忆交给纸笔和手机以后',
    summary: '记录、提醒和外部工具可以减轻认知负担，也会改变我们如何分配注意、判断自己记住了什么。',
    content:
      'Risko 与 Gilbert 将借助外部行动改变信息处理要求的做法称为认知卸载。写下待办、设置提醒、调整物体位置，都可能让环境承担部分原本需要在头脑中完成的工作。\n\n综述关心两个问题：人何时决定使用工具，使用之后又有什么后果。外部帮助并不天然损害思考，但对工具的依赖也可能建立在不准确的自我判断上。工具是否可靠、内容是否容易找回，与“存下来了”同样值得关注。',
    topics: ['工具与人', '记忆', '自主性'],
    sourceTitle:
      'Evan F. Risko、Sam J. Gilbert：Cognitive Offloading，Trends in Cognitive Sciences，2016',
    url: 'https://samgilbert.net/pubs/Risko2016TiCS.pdf',
  },
  {
    id: 'd89',
    conceptId: 'e59',
    concept: '解释深度错觉',
    category: '认知心理学 · 判断',
    title: '“我知道”与“我能解释清楚”之间',
    summary: '熟悉一个装置或概念，可能让人高估自己对其运作机制的理解。',
    content:
      'Rozenblit 与 Keil 研究人们对日常事物的理解判断。参与者尝试详细解释运作机制后，往往会下调原先对自己理解程度的评价。识别名称和用途，与说明内部因果过程，需要不同层次的知识。\n\n这种落差不等于人们有意夸大。只有真正展开解释，缺少的环节才可能暴露出来。结论来自特定任务，不能据此断言所有自信都不可靠；它提示我们让“懂了”的感觉接受具体解释的检验。',
    topics: ['自我认识', '求知', '谦逊'],
    sourceTitle:
      'Leonid Rozenblit、Frank Keil：The misunderstood limits of folk science，Cognitive Science，2002',
    url: 'https://cogdevlab.yale.edu/sites/default/files/files/rozenblit%20%26%20keil%20%202002.pdf',
  },
  {
    id: 'd90',
    conceptId: 'e60',
    concept: '确认偏误',
    category: '认知心理学 · 判断',
    title: '为什么我们总能找到支持自己的证据',
    summary: '信息选择与解释可能偏向既有信念；证据的数量，并不能代替对证据质量和反例的检查。',
    content:
      'Nickerson 的综述把确认偏误概括为搜寻或解释证据时偏向已有信念、期待或假设。偏向既可能出现在“看什么”上，也可能出现在面对同一材料时“怎样理解”上。\n\n这不意味着支持自己观点的证据都无效。关键是同样严格地对待有利与不利信息，并允许结论随证据调整。寻找反例也不是为了刻意唱反调，而是弄清原来的判断在什么条件下才成立。',
    topics: ['独立思考', '证据', '纠错'],
    sourceTitle: 'Raymond S. Nickerson：Confirmation Bias，Review of General Psychology 2(2)，1998',
    url: 'https://doi.org/10.1037/1089-2680.2.2.175',
  },
  {
    id: 'd91',
    conceptId: 'e61',
    concept: '感觉、知觉与注意',
    category: '认知心理学 · 注意',
    title: '眼前有，不等于已经看见',
    summary: '感官接收刺激，知觉组织并解释刺激；注意和经验参与了我们对世界的理解。',
    content:
      'OpenStax 区分感觉与知觉：前者涉及感官对刺激的接收，后者涉及信息如何被组织和解释。注意、动机与已有经验，会影响进入意识的内容。\n\n因此，看到同一个场景的人未必注意到相同细节。观察遗漏不能简单证明一个人不诚实，而主观确信也不能保证记录完整。讨论目击、阅读或日常分歧时，需要区分外部刺激、注意到的部分与后来作出的解释。',
    topics: ['观察', '理解差异', '注意力'],
    sourceTitle: 'OpenStax《Psychology 2e》5.1：Sensation versus Perception',
    url: 'https://openstax.org/books/psychology-2e/pages/5-1-sensation-versus-perception',
  },
  {
    id: 'd92',
    conceptId: 'e62',
    concept: '记忆的编码、储存与提取',
    category: '认知心理学 · 记忆',
    title: '记不起来，是否就等于没有记住',
    summary: '记忆包含信息进入、保存与重新取用的过程，不同环节的问题会产生相似的“想不起来”。',
    content:
      'OpenStax 用编码、储存与提取描述记忆过程。信息需要经过加工才能进入记忆，已有知识和意义联系也参与其中；后来能否取出，还涉及线索与情境。\n\n把记忆想成存放文件的柜子，容易忽略这些过程之间的差别。认出熟悉内容、自由回忆和重新学习，并不是同一种表现。评价自己的掌握程度时，需要看具体任务，不能只靠再次阅读时的熟悉感。',
    topics: ['学习', '理解', '记忆'],
    sourceTitle: 'OpenStax《Psychology 2e》8.1：How Memory Functions',
    url: 'https://openstax.org/books/psychology-2e/pages/8-1-how-memory-functions',
  },
  {
    id: 'd93',
    conceptId: 'e63',
    concept: '记忆的重构',
    category: '认知心理学 · 记忆',
    title: '回忆不是把录像重新播放',
    summary: '记忆可能受后来信息、提问方式和原有经验影响；真诚回忆也可能出现偏差。',
    content:
      'OpenStax 在讨论记忆问题时介绍了误导信息与目击者研究。后来接触的描述可能影响人对原先经历的回忆，个人也可能把推断与实际见闻混在一起。\n\n因此，回忆的生动程度不等于准确程度。这并不否定所有个人经验，而是说明重要叙述需要与当时记录及其他独立材料互相核对。记忆既维系一个人的经历，也在不断被重新组织。',
    topics: ['记忆与真实', '经验', '证据'],
    sourceTitle: 'OpenStax《Psychology 2e》8.3：Problems with Memory',
    url: 'https://openstax.org/books/psychology-2e/pages/8-3-problems-with-memory',
  },
  {
    id: 'd94',
    conceptId: 'e64',
    concept: '内在与外在动机',
    category: '心理学 · 动机',
    title: '为了喜欢而做，还是为了奖励而做',
    summary: '活动本身的满足与外部奖励都能推动行动；两者如何作用，要放回具体任务和关系中理解。',
    content:
      'OpenStax 将内在动机与活动本身带来的满足联系起来，将外在动机与奖励、评价等外部结果联系起来。同一行动可以同时具有不同动机，二者不是非此即彼的身份标签。\n\n奖励的意义也与情境有关：它可能提供反馈，也可能让注意转向外部评价。不能把所有奖励都说成有害，或把所有坚持都归结为意志。人的兴趣、目标与环境支持需要放在一起观察。',
    topics: ['热爱', '坚持', '自我成长'],
    sourceTitle: 'OpenStax《Psychology 2e》10.1：Motivation',
    url: 'https://openstax.org/books/psychology-2e/pages/10-1-motivation',
  },
  {
    id: 'd95',
    conceptId: 'e65',
    concept: '成长型思维与环境',
    category: '心理学 · 成长',
    title: '“能力可以发展”以后，还需要什么',
    summary: '相信能力可以发展，可能改变面对困难的方式；支持性环境与有效策略仍然重要。',
    content:
      'Yeager 等人在美国学校开展的大规模研究，考察了简短成长型思维干预的效果。结果显示，影响并不对所有学生和环境完全一致，同伴规范等学校条件与效果有关。\n\n因此，成长型思维不能被简化为“只要努力就能成功”。承认能力可以发展，还需要允许试错的环境、反馈与可调整的方法。把受挫都归咎于个人心态，反而会遮蔽资源和处境的差异。',
    topics: ['成长', '努力与方法', '个人与环境'],
    sourceTitle:
      'David S. Yeager 等：A national experiment reveals where a growth mindset improves achievement，Nature，2019',
    url: 'https://www.nature.com/articles/s41586-019-1466-y',
  },
  {
    id: 'd96',
    conceptId: 'e66',
    concept: '日常审美',
    category: '美学 · 日常生活',
    title: '美不只在美术馆里',
    summary: '日常美学将普通物品、环境和活动纳入审美讨论，关注生活中常被忽略的感受与选择。',
    content:
      '《斯坦福哲学百科》的“日常美学”条目讨论了艺术作品以外的审美经验：生活环境、普通物品和日常活动，也会带来感受、判断与价值问题。\n\n扩大审美范围，并不是要求每件日用品都变成艺术品。它使人重新注意习以为常的质感、秩序与氛围，也让审美与照料环境、使用物品的方式联系起来。日常生活既有愉悦的经验，也有杂乱、粗糙等不悦感受。',
    topics: ['发现美', '生活', '感受力'],
    sourceTitle: 'Stanford Encyclopedia of Philosophy：Aesthetics of the Everyday',
    url: 'https://plato.stanford.edu/entries/aesthetics-of-everyday/',
  },
  {
    id: 'd97',
    conceptId: 'e67',
    concept: '叙述视角',
    category: '文学理论 · 叙事',
    title: '谁在讲述，决定了我们能知道多少',
    summary: '第一人称、限知与全知叙述对信息的分配不同；叙述者知道什么，与作者知道什么需要区分。',
    content:
      'OpenStax 写作教材比较不同人称与叙述视角。第一人称让读者接近讲述者的经验；第三人称可以局限于一个人物，也可以进入多个角色的思想。选择视角，同时是在安排信息的边界。\n\n因此，一段叙事中的沉默、误解和悬念，可能来自讲述位置。理解人物时，要留意哪些是亲见，哪些是推断，哪些经历没有进入叙述。视角改变的不只是代词，也改变了读者与人物的距离。',
    topics: ['多元视角', '理解他人', '叙事'],
    sourceTitle: 'OpenStax《Writing Guide》4.6：Characterization and Point of View',
    url: 'https://openstax.org/books/writing-guide/pages/4-6-editing-focus-more-on-characterization-and-point-of-view',
  },
  {
    id: 'd98',
    conceptId: 'e68',
    concept: '隐喻与理解',
    category: '语言哲学 · 文学',
    title: '把一种事物看作另一种：隐喻怎样改变理解',
    summary: '隐喻不只是装饰语句，也涉及语言如何表达、引导联想并组织经验。',
    content:
      '《斯坦福哲学百科》的“隐喻”条目梳理了语义、语用等不同解释路径。用一种事物谈论另一种，不能简单还原成字面上的相等；语境和读者的理解活动参与了意义的形成。\n\n一种隐喻会突出某些相似性，同时淡化其他方面。它可以打开新的感受，也可能使某种描述显得理所当然。阅读隐喻时，既可以体会它带来的联想，也要留意它没有解释的部分。',
    topics: ['语言的力量', '想象', '思维方式'],
    sourceTitle: 'Stanford Encyclopedia of Philosophy：Metaphor',
    url: 'https://plato.stanford.edu/entries/metaphor/',
  },
  {
    id: 'd99',
    conceptId: 'e69',
    concept: '史料的出处与互证',
    category: '历史学 · 阅读方法',
    title: '同一件往事，为什么会留下不同的记载',
    summary: '历史阅读需要追问作者、时间、写作目的与所处环境，并比较彼此独立的材料。',
    content:
      'Digital Inquiry Group 的历史思维资料强调出处分析、情境化、互证与细读。材料由谁写成、面向谁、距离事件多久，都影响它能够说明什么。\n\n多份文字内容相同，不一定构成独立支持，它们也可能转引同一来源。相反，差异不必然意味着有人造假，也可能来自位置与目的不同。把材料放回产生的情境，才能区分当时人的认识、后来人的解释和仍然未知的部分。',
    topics: ['历史与记忆', '证据', '多方视角'],
    sourceTitle: 'Digital Inquiry Group：Historical Thinking Chart',
    url: 'https://www.inquirygroup.org/history-lessons/historical-thinking-chart',
  },
  {
    id: 'd100',
    conceptId: 'e70',
    concept: '技术效果的异质性',
    category: '经济学 · 人工智能',
    title: '同一款 AI，为什么对不同人的帮助不一样',
    summary:
      '客服现场研究发现，生成式 AI 的效果随工作经验和原有能力而不同；平均值不能代替个体差异。',
    content:
      'Brynjolfsson、Danielle Li 与 Raymond 的《工作中的生成式 AI》研究客服人员使用对话辅助工具的情况。研究中，经验较少的人员获益更明显，而有经验的高技能人员变化较小。\n\n这使“工具能提升多少效率”变成了更具体的问题：对谁、在什么任务中、采用什么指标。结论来自特定工作环境，不能直接外推到所有职业，更不能把完成任务更快等同于已经学会独立完成。',
    topics: ['技术与能力', '平均与差异', '学习'],
    sourceTitle:
      'Erik Brynjolfsson、Danielle Li、Lindsey R. Raymond：Generative AI at Work，NBER 31161（2023年修订版）',
    url: 'https://www.nber.org/papers/w31161',
  },
];

export const LEARNING_KNOWLEDGE: IDailyKnowledge[] = LEARNING_AND_CULTURE.map((item) => ({
  id: item.id,
  date: '2026-10-24',
  // Keep the canonical concept searchable even when the editorial title is figurative.
  title: item.title.includes(item.concept) ? item.title : `${item.concept}：${item.title}`,
  category: item.category,
  summary: item.summary,
  content: item.content,
  source: `${item.sourceTitle}：${item.url}`,
}));
