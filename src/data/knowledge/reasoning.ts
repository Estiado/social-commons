import type { IDailyKnowledge } from '../types';

// Summaries are written for this site, not quotations from the linked works.
// Teaching questions are explicitly editorial; the source supports the concept.
export const REASONING_KNOWLEDGE: IDailyKnowledge[] = [
  {
    id: 'd51',
    date: '2026-10-22',
    title: '机会成本：选择的代价不只在账单上',
    category: '微观经济学 · 选择',
    summary:
      '资源和时间有限，选择一种用途，也意味着放弃另一种用途。机会成本指被放弃的最佳替代选择的价值。',
    content:
      '机会成本不是把所有没选的方案加起来，也不等于已经付出的现金。比较方案时，应先说明资源约束，再找出真正可行的替代方案。\n\n本站教学问题：同样两小时，用于刷题、订正或休息，分别放弃了什么？请说明你的判断条件，不把经济学概念当作只许学习、不许休息的命令。',
    source:
      'OpenStax《Principles of Economics 3e》2.1，本站概述。https://openstax.org/books/principles-economics-3e/pages/2-1-how-individuals-make-choices-based-on-their-budget-constraint',
  },
  {
    id: 'd52',
    date: '2026-10-22',
    title: '损失厌恶：为什么“失去”格外刺痛',
    category: '微观经济学 · 行为经济学',
    summary: '前景理论关注相对于参照点的得失；在许多决策情境中，人们对损失比对同等收益更敏感。',
    content:
      '卡尼曼在诺奖自传中回顾了他与特沃斯基的研究：评价对象由财富总量转向得失变化，参照点随之成为重要因素。这是一种有条件的行为描述，不能推断每个人在每次选择中都遵循固定比例。\n\n本站教学问题：讨论“害怕失去排名”时，怎样区分心理感受、实际后果与可采取的行动？',
    source:
      'Daniel Kahneman，Biographical，NobelPrize.org。https://www.nobelprize.org/prizes/economic-sciences/2002/kahneman/biographical/',
  },
  {
    id: 'd53',
    date: '2026-10-22',
    title: '框架效应：同一事实，为什么选择不同',
    category: '社会心理学 · 判断',
    summary:
      '等价结果若以收益或损失等不同方式表达，人的偏好可能改变。比较措辞前，要先确认数字和条件是否真的相同。',
    content:
      '卡尼曼在研究回顾中将框架效应视为理性选择中“不变性”要求面临的挑战：描述改变，偏好也可能改变。它提示我们检查信息的呈现方式，但不能仅凭某种措辞就断定对方蓄意操控。\n\n本站教学问题：把一则消息分别改写成“获得了什么”与“仍缺少什么”，再核对两版是否隐去了重要条件。',
    source:
      'Daniel Kahneman，Biographical，关于 framing 与 invariance 的论述。https://www.nobelprize.org/prizes/economic-sciences/2002/kahneman/biographical/',
  },
  {
    id: 'd54',
    date: '2026-10-22',
    title: '心理账户：同样的钱为何被区别对待',
    category: '微观经济学 · 行为经济学',
    summary: '人们常把开支、收入放进不同的心理账户，分别衡量，因而忽略整体资源配置。',
    content:
      '2017 年经济学奖说明以心理账户介绍塞勒的贡献：分账户能简化决策，却也可能使人只关注一笔交易的局部影响。讨论这种机制，不等于否定预算管理的实用价值。\n\n本站教学问题：生活费、奖金、意外收入是否让你产生不同的消费冲动？先描述差异，再解释原因。',
    source:
      'NobelPrize.org，2017 年经济学奖新闻稿，本站摘要。https://www.nobelprize.org/prizes/economic-sciences/2017/press-release/',
  },
  {
    id: 'd55',
    date: '2026-10-22',
    title: '有限自控：让计划照顾真实的人',
    category: '社会心理学 · 决策',
    summary:
      '长期目标与眼前诱惑可能发生冲突。行为经济学把自控困难纳入分析，而不是预设人总能执行最优计划。',
    content:
      '塞勒的研究将有限理性、自控问题与社会偏好联系到实际决策。理解这些限制，有助于讨论提醒、默认选项和承诺机制；是否采用某种安排，还要考察自主选择与退出的可能。\n\n本站教学问题：设计一份复习计划时，怎样安排休息、提醒和反馈，让计划更容易持续？请把自己的设计与研究结论分开。',
    source:
      'NobelPrize.org，2017 年经济学奖新闻稿，本站概述。https://www.nobelprize.org/prizes/economic-sciences/2017/press-release/',
  },
  {
    id: 'd56',
    date: '2026-10-22',
    title: '公地治理：共享不必然通向失序',
    category: '环境经济学 · 制度',
    summary:
      '奥斯特罗姆研究了使用者管理共享资源的制度。公共资源问题并非只有私有化或集中管理两种答案。',
    content:
      '诺奖介绍强调，使用者群体可以形成管理共同资源的规则。奥斯特罗姆在访谈中说明，长期稳健制度呈现某些共同原则，但具体规则需要适应不同系统，不是到处照搬一套清单。\n\n本站教学问题：把班级图书角看成一个共享系统，分别讨论借阅边界、维护成本和纠纷处理。这个练习是类比，不能替代真实田野研究。',
    source:
      'Elinor Ostrom，诺奖访谈实录。https://www.nobelprize.org/prizes/economic-sciences/2009/ostrom/164465-ostrom-williamson-interview-transcript/',
  },
  {
    id: 'd57',
    date: '2026-10-22',
    title: '自然实验：从“同时发生”走向因果问题',
    category: '微观经济学 · 研究方法',
    summary:
      '自然实验利用现实中的政策或环境变化研究因果关系，关键在于比较对象能否构成可信的反事实。',
    content:
      '2021 年经济学奖表彰了自然实验及相关因果推断方法。研究者不是只比较两个平均数，而要解释为什么某些群体受到变化影响、另一些群体没有，以及差异是否原本就存在。\n\n本站教学问题：如果某班换了教学方式后成绩提高，哪些其他变化也可能解释结果？请列出需要补充的证据。',
    source:
      'NobelPrize.org，2021 年经济学奖新闻稿。https://www.nobelprize.org/prizes/economic-sciences/2021/press-release/',
  },
  {
    id: 'd58',
    date: '2026-10-22',
    title: '可证伪性：什么证据会让你改变看法',
    category: '西方哲学 · 科学方法',
    summary: '波普尔强调，科学假说应冒被经验反驳的风险；只不断寻找支持例子，不足以检验一个主张。',
    content:
      '《斯坦福哲学百科》同时介绍了证实、证伪以及反对单一科学方法的不同立场。实际研究中，观察、辅助假设与测量也可能出错，不能把一个异常点机械地当作推翻整套理论。\n\n本站教学问题：为“早起一定提高学习效率”写一个可检验的版本，说明观察期限、效率指标与可能的反证。',
    source:
      'Stanford Encyclopedia of Philosophy，Scientific Method。https://plato.stanford.edu/entries/scientific-method/',
  },
  {
    id: 'd59',
    date: '2026-10-22',
    title: '溯因推理：好解释仍需要被检验',
    category: '西方哲学 · 逻辑',
    summary: '溯因推理从现象出发寻找较好的解释。解释得通，和已经证明，是两种不同的认识状态。',
    content:
      '《斯坦福哲学百科》区分溯因、演绎与归纳，并讨论“最佳解释推理”的合理性。一个解释可能简洁、涵盖面广，却仍依赖候选范围与背景知识，必须与竞争解释比较。\n\n本站教学问题：看到教室地面湿了，至少提出三种解释，并写出能区分它们的新证据。不要把最先想到的故事当成唯一答案。',
    source:
      'Stanford Encyclopedia of Philosophy，Abduction。https://plato.stanford.edu/entries/abduction/',
  },
  {
    id: 'd60',
    date: '2026-10-22',
    title: '统计显著：不等于重要，也不等于真实概率',
    category: '社会学 · 研究方法',
    summary: 'p 值描述数据与指定统计模型的相容程度；它不是“假说为真的概率”，也不衡量效果大小。',
    content:
      '美国统计学会 2016 年声明提出六项原则，反对仅用单一阈值决定研究结论。解释结果还需要研究设计、效应量、测量质量和完整报告。\n\n本站教学问题：报道说某种学习法“效果显著”，还应追问样本来自哪里、提升幅度多大、是否存在对照，以及结果的不确定性如何。',
    source:
      'American Statistical Association，Statement on Statistical Significance and P-Values（2016）。https://www.amstat.org/docs/default-source/amstat-documents/p-valuestatement.pdf',
  },
  {
    id: 'd61',
    date: '2026-10-22',
    title: '重复与复现：科学为什么需要别人再做一遍',
    category: '社会学 · 科学共同体',
    summary: '同一数据和方法能否得到相同结果，与重新收集数据能否支持同一结论，是相关但不同的问题。',
    content:
      '美国国家科学院相关报告将前者称为 reproducibility，后者称为 replicability，并说明不同领域的用词可能相反。复现失败需要分析条件和方法，不能立即等同于造假。\n\n本站教学问题：小组调查若只留下结论，下一组能核查什么？请列出问卷、样本说明、处理步骤和匿名化记录各自的作用。',
    source:
      'National Academies，Reproducibility and Replicability in Science（2019），研究简报。https://nap.nationalacademies.org/resource/25303/Combined%20Reproducibility%20Brief%20vs2.pdf',
  },
  {
    id: 'd62',
    date: '2026-10-22',
    title: '证言与信任：我们为何离不开他人的知识',
    category: '西方哲学 · 认识论',
    summary: '大量知识来自他人证言。合理信任既不要求亲自重做每项研究，也不等于放弃核查。',
    content:
      '证言认识论研究听者何时有理由相信说者，并讨论专业判断、背景信息与偏见。因身份成见而不当地贬低一个人的可信度，还涉及认识不公问题。\n\n本站教学问题：引用一位专家之前，怎样检查其专业范围、证据出处和同行争议？如果专家意见不同，哪些比较比“谁名气大”更有帮助？',
    source:
      'Stanford Encyclopedia of Philosophy，Epistemological Problems of Testimony。https://plato.stanford.edu/entries/testimony-episprob/',
  },
  {
    id: 'd63',
    date: '2026-10-22',
    title: '可行能力：拥有资源，也要能够使用',
    category: '政治哲学 · 公平',
    summary: '可行能力进路关注人实际能够做什么、成为什么，而不只比较资源数量或主观满意度。',
    content:
      '森等人的研究区分已经实现的生活状态与真正可选择的机会。相同资源经过个人、社会和环境条件转换，可能带来不同的实际机会。\n\n本站教学问题：一座图书馆“对所有人开放”，是否就代表所有人同样容易使用？从开放时间、无障碍设施和交通条件提出可调查的问题。',
    source:
      'Stanford Encyclopedia of Philosophy，The Capability Approach。https://plato.stanford.edu/entries/capability-approach/',
  },
  {
    id: 'd64',
    date: '2026-10-22',
    title: '开放科学：知识共享也需要规则',
    category: '传播学 · 知识共享',
    summary: '开放科学希望科学知识更容易获取、理解与复用，同时关注基础设施、社会参与和知识多样性。',
    content:
      '联合国教科文组织的说明将开放出版物、数据、教育资源和研究工具纳入开放科学。可以阅读不代表可以任意复制；公开访问、开放许可和个人信息保护需要分别判断。\n\n本站教学问题：整理一份课堂资源清单，分别标注来源、许可、可否修改和引用方式，让下一位使用者能够核查。',
    source: 'UNESCO，Open Science。https://www.unesco.org/en/open-science',
  },
  {
    id: 'd65',
    date: '2026-10-22',
    title: '公共物品：免费使用背后的供给难题',
    category: '微观经济学 · 公共生活',
    summary: '经济学以非排他性与非竞争性描述典型公共物品。“由政府提供”或“不要钱”并不是充分定义。',
    content:
      'OpenStax 以搭便车问题解释公共物品供给的困难：个人希望别人承担成本，整体供给却可能不足。现实设施可能具有混合属性，需要检查拥挤和收费条件。\n\n本站教学问题：灯塔、道路、拥挤的自习室分别符合哪些条件？先分析属性，再讨论筹资办法，避免只给物品贴标签。',
    source:
      'OpenStax《Principles of Economics 3e》13.3 Public Goods。https://openstax.org/books/principles-economics-3e/pages/13-3-public-goods',
  },
  {
    id: 'd66',
    date: '2026-10-22',
    title: '外部性：没有写进价格的影响',
    category: '环境经济学 · 外部性',
    summary: '行为影响了交易之外的人，且这种影响未充分进入决策成本或收益，就需要讨论外部性。',
    content:
      '污染是负外部性的典型例子：私人决策未必承担全部社会成本。识别外部性后，仍需比较不同治理方式的成本、信息要求和实际效果。\n\n本站教学问题：夜间广场活动的参与者与周边住户如何分别描述收益和成本？请提出一项可检验的改进安排，而不是只判断谁“素质低”。',
    source:
      'OpenStax《Principles of Economics 3e》第12章摘要。https://openstax.org/books/principles-economics-3e/pages/12-key-concepts-and-summary',
  },
  {
    id: 'd67',
    date: '2026-10-22',
    title: '比较优势：合作不只发生在能力相当的人之间',
    category: '微观经济学 · 合作',
    summary: '比较优势关注较低的机会成本，绝对优势关注生产效率；二者不能混为一谈。',
    content:
      '即使一方做每件事都更快，双方仍可能在不同任务上拥有不同的机会成本。比较优势提供分析分工的起点，实际合作还要考虑沟通、分配和学习机会。\n\n本站教学问题：小组展示中，擅长写作的人是否应包办所有任务？把短期效率与成员长期成长分别列入讨论，不把模型当成唯一价值判断。',
    source:
      'OpenStax《Principles of Microeconomics 2e》19.1。https://openstax.org/books/principles-microeconomics-2e/pages/19-1-absolute-and-comparative-advantage',
  },
  {
    id: 'd68',
    date: '2026-10-22',
    title: '横向阅读：离开页面，才能看清页面',
    category: '媒介研究 · 信息素养',
    summary: '核查陌生网站时，先到其他可靠来源调查发布者，而不只阅读网站对自己的介绍。',
    content:
      'Digital Inquiry Group 的 Civic Online Reasoning 课程将横向阅读用于中学信息判断：查谁在发布、证据是什么、其他来源怎么说。多个转载页不等于多个独立证据。\n\n本站教学问题：为一条热传消息找到最早出处，把原始材料、转述和评论分开，记录仍无法确认的部分。',
    source:
      'Digital Inquiry Group，A Civic Online Reasoning Module for High School。https://cor.inquirygroup.org/blog/module-for-high-school/',
  },
  {
    id: 'd69',
    date: '2026-10-22',
    title: '算法公平：先说明你在衡量哪一种公平',
    category: '技术哲学 · 算法',
    summary: '公平可以指相同错误率、相同预测含义或不同群体的机会。不同指标未必能够同时满足。',
    content:
      'Ben Green 的论文提出，不应把算法公平限于孤立决策程序的形式指标，还要讨论制度背景及实际后果。这是作者提出的研究立场，不是“算法无法公平”的定论。\n\n本站教学问题：用算法分配学习资源，什么算成功，谁可能被漏掉，谁有权申诉？把技术指标与价值选择分别写出来。',
    source:
      'Ben Green，Escaping the Impossibility of Fairness: From Formal to Substantive Algorithmic Fairness（2021，作者预印本）。https://arxiv.org/abs/2107.04642',
  },
  {
    id: 'd70',
    date: '2026-10-22',
    title: '关怀伦理：把关系与照料放进道德讨论',
    category: '政治哲学 · 伦理',
    summary: '关怀伦理重视依赖、关系和具体处境，让长期容易被忽略的照料劳动进入伦理视野。',
    content:
      '相关理论质疑只凭抽象规则评价所有处境的做法，也讨论关怀与权利、正义如何相处。它不意味着照料天然属于某种性别，更不意味着亲近者可以不受原则约束。\n\n本站教学问题：家人、同学与公共机构分别承担哪些照料责任？设计一个例子，同时讨论关怀的需要和承担者的边界。',
    source:
      'Stanford Encyclopedia of Philosophy，Feminist Ethics，关怀伦理相关章节。https://plato.stanford.edu/entries/feminism-ethics/',
  },
];
