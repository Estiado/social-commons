import type { IDailyKnowledge } from '../types';

// One source ledger feeds the knowledge page and its related writing concept.
// Explanations are editorial summaries; bibliographic links remain explicit.
export const SOCIAL_EVIDENCE = [
  {
    id: 'd71',
    conceptId: 'e41',
    concept: '归因与处境',
    category: '社会心理学 · 判断',
    title: '基本归因错误：看见行为，也看见处境',
    summary:
      '解释他人的行为时，人容易高估性格因素，低估情境的影响。了解一个人，需要把行动放回他所处的条件中。',
    content:
      'OpenStax 将人的行为放在个体特征与环境的共同作用中理解。基本归因错误指观察者偏向用性格解释他人行为，却忽视具体处境；行动者与观察者掌握的信息也可能不同。\n\n这不意味着个人没有责任，而是提醒解释者区分事实、动机推断与环境约束。“他迟到了”是观察，“他不尊重人”则已经加入了性格判断。充分的解释应允许新的证据改变判断。',
    topics: ['理解他人', '偏见', '个人与环境'],
    sourceTitle: 'OpenStax《Psychology 2e》12.1：社会心理学与归因',
    url: 'https://openstax.org/books/psychology-2e/pages/12-1-what-is-social-psychology',
  },
  {
    id: 'd72',
    conceptId: 'e42',
    concept: '认知失调与自我解释',
    category: '社会心理学 · 态度',
    title: '认知失调：当行动与信念互相冲突',
    summary: '信念、态度与行为不一致时，人可能感到不适，并通过改变行为或解释来减轻这种冲突。',
    content:
      '费斯廷格提出的认知失调理论关注内部不一致带来的心理张力。教材讨论了人如何调整态度、减少矛盾信息的重要性，或为既有行动寻找新的解释。\n\n“说服自己”有时是适应，也可能让人回避错误。理解这一机制时，应区分真正改变行动与仅仅更换理由，不能凭一句辩解就诊断一个人的内心。态度改变还受到信息、关系和情境影响。',
    topics: ['诚实面对自己', '改变', '反思'],
    sourceTitle: 'OpenStax《Psychology 2e》12.3：态度与说服',
    url: 'https://openstax.org/books/psychology-2e/pages/12-3-attitudes-and-persuasion',
  },
  {
    id: 'd73',
    conceptId: 'e43',
    concept: '从众与独立判断',
    category: '社会心理学 · 群体',
    title: '从众：多数人的意见为什么有力量',
    summary:
      '人可能为获得群体接纳而附和，也可能在不确定时把他人当作信息来源。这两种影响需要分别理解。',
    content:
      '教材借阿希的线段判断实验说明，即使任务相对清楚，群体的一致回答仍可能影响个体。规范性影响关联被接纳的需要，信息性影响则关联对正确答案的判断。\n\n实验所呈现的是特定条件中的行为变化，不代表“多数意见总是错误”。独立判断也不是为反对而反对：需要检查证据、表达异议的成本，以及群体是否允许纠错。',
    topics: ['独立思考', '个人与群体', '勇气'],
    sourceTitle: 'OpenStax《Psychology 2e》12.4：从众、顺从与服从',
    url: 'https://openstax.org/books/psychology-2e/pages/12-4-conformity-compliance-and-obedience',
  },
  {
    id: 'd74',
    conceptId: 'e44',
    concept: '刻板印象、偏见与歧视',
    category: '社会心理学 · 群体关系',
    title: '从印象到排斥：三种不同的问题',
    summary:
      '刻板印象涉及对群体的概括，偏见涉及态度，歧视涉及不平等对待。概念相关，却不能混为一谈。',
    content:
      '教材把刻板印象、偏见与歧视分别放在认知、情感和行为层面。把群体特征直接套在某个人身上，会忽略群体内部的差异；态度与行为之间也并非总是一一对应。\n\n理解差异，需要具体考察信息来源、接触条件与制度安排。仅仅赞美“包容”还不够：日常语言怎样分类人，机会怎样分配，受影响的人能否表达和申诉，都是可以观察的问题。',
    topics: ['平等', '尊重差异', '语言与行动'],
    sourceTitle: 'OpenStax《Psychology 2e》12.5：偏见与歧视',
    url: 'https://openstax.org/books/psychology-2e/pages/12-5-prejudice-and-discrimination',
  },
  {
    id: 'd75',
    conceptId: 'e45',
    concept: '镜中自我与社会互动',
    category: '社会学 · 自我',
    title: '镜中自我：我们怎样借他人的目光认识自己',
    summary: '库利的“镜中自我”关注人如何想象自己在他人眼中的形象，并据此形成自我感受。',
    content:
      '社会学教材介绍，自我并不只来自孤立的内省。人会想象别人怎样看自己、怎样评价自己，再产生自豪、羞惭等感受。这里的关键是对评价的理解，它未必等于他人的真实想法。\n\n米德则强调互动与角色承担。把自我理解放在社会关系中，可以看见认可的力量，也能警惕用单一评价限定自己。一个人在不同关系中呈现不同侧面，并不必然意味着虚伪。',
    topics: ['自我认识', '他人目光', '成长'],
    sourceTitle: 'OpenStax《Introduction to Sociology 3e》5.1：自我发展的理论',
    url: 'https://openstax.org/books/introduction-sociology-3e/pages/5-1-theories-of-self-development',
  },
  {
    id: 'd76',
    conceptId: 'e46',
    concept: '情境定义与社会现实',
    category: '社会学 · 日常生活',
    title: '社会建构：共同承认的意义也会产生后果',
    summary:
      '身份、规则与日常互动中的许多意义，依靠人们的共同理解维持。社会建构不等于一切都是假的。',
    content:
      '教材通过角色、情境定义和自我呈现解释社会现实如何被维持。人对情境的理解会影响行动，而行动又可能使原先的判断产生实际后果。\n\n这类分析不是否认物质条件。钱币的材料与它的支付资格是不同问题：后者离不开共同承认和制度。讨论建构过程，应进一步追问谁有权命名、规则如何改变，以及哪些人承担改变的成本。',
    topics: ['规则', '共识', '身份'],
    sourceTitle: 'OpenStax《Introduction to Sociology 3e》4.3：现实的社会建构',
    url: 'https://openstax.org/books/introduction-sociology-3e/pages/4-3-social-constructions-of-reality',
  },
  {
    id: 'd77',
    conceptId: 'e47',
    concept: '文化理解与评价尺度',
    category: '人类学 · 文化',
    title: '文化相对主义：理解之前，先暂缓熟悉的尺度',
    summary:
      '理解一种实践，可以先考察它所处的文化环境。用自己的习惯作唯一标准，容易把陌生误认成落后。',
    content:
      '教材比较文化中心主义与文化相对主义：前者倾向以自身文化判断他者，后者努力在当地文化背景中理解信念与实践。物质文化与价值、规范等非物质文化也相互关联。\n\n理解背景并不自动解决价值冲突，更不意味着任何行为都无需批评。它首先要求描述准确、听见当地人的不同声音，再说明自己采用什么评价尺度，避免把整个群体想成只有一种生活。',
    topics: ['文化交流', '理解与判断', '多样性'],
    sourceTitle: 'OpenStax《Introduction to Sociology 3e》3.1：文化是什么',
    url: 'https://openstax.org/books/introduction-sociology-3e/pages/3-1-what-is-culture',
  },
  {
    id: 'd78',
    conceptId: 'e48',
    concept: '弹性与选择空间',
    category: '微观经济学 · 市场',
    title: '需求弹性：价格变了，人有多少调整余地',
    summary:
      '需求价格弹性衡量需求量对价格变化的敏感程度，关注百分比变化的比率，而不是价格本身的高低。',
    content:
      '同样涨价，不同商品的需求量反应可能相差很大。教材用弹性区分这些反应，并提醒计算时比较相应的百分比变化。弹性不是需求曲线斜率的另一个名称。\n\n一种商品是否容易替代、人们有多少调整时间，会影响选择余地。讨论消费行为时，不能只问人是否愿意改变，也要问他能否找到替代办法；短期约束与长期适应应分别分析。',
    topics: ['选择与约束', '变化', '生活成本'],
    sourceTitle: 'OpenStax《Principles of Economics 3e》5.1：需求与供给的价格弹性',
    url: 'https://openstax.org/books/principles-economics-3e/pages/5-1-price-elasticity-of-demand-and-price-elasticity-of-supply',
  },
  {
    id: 'd79',
    conceptId: 'e49',
    concept: '微观、宏观与分析尺度',
    category: '经济学 · 方法',
    title: '分析尺度：一个人的选择不等于整个社会的结果',
    summary:
      '微观经济学研究个人、企业等主体，宏观经济学关注就业、物价、增长等整体现象。两种尺度相互联系。',
    content:
      '教材把微观与宏观比作观察经济的不同视角。理解家庭如何决策，与理解整体失业和通胀，都很必要；但不能简单用家庭收支类比整个国家，也不能把总量变化当成每个人的共同经历。\n\n从个体推到整体，需要说明互动、制度和反馈。同一种行动被很多人同时采取后，可能改变原本的条件。分析尺度的转换，应有证据和中间机制，而不是把“小道理”直接放大。',
    topics: ['个人与社会', '整体与局部', '方法'],
    sourceTitle: 'OpenStax《Principles of Economics 3e》1.2：微观经济学与宏观经济学',
    url: 'https://openstax.org/books/principles-economics-3e/pages/1-2-microeconomics-and-macroeconomics',
  },
  {
    id: 'd80',
    conceptId: 'e50',
    concept: '平均数与代表性',
    category: '社会学 · 数据阅读',
    title: '平均数与中位数：一个数字能代表谁',
    summary: '平均数利用所有数值，中位数位于排序后的中间位置。它们描述数据中心的方式不同。',
    content:
      '教材比较平均数与中位数，并说明分布形态会影响两者的关系。少数极大或极小的值可能明显拉动平均数，而中位数对这种变化相对不敏感。\n\n读收入、时间或成绩数据时，应核对指标定义、样本范围和分布。均值上升不等于每个人都改善了；中位数稳定也不等于没有差距变化。中心位置与内部差异是两类信息。',
    topics: ['数据与真实', '公平', '代表性'],
    sourceTitle: 'OpenStax《Introductory Statistics 2e》2.5：数据的中心',
    url: 'https://openstax.org/books/introductory-statistics-2e/pages/2-5-measures-of-the-center-of-the-data',
  },
  {
    id: 'd81',
    conceptId: 'e51',
    concept: '抽样与以偏概全',
    category: '社会学 · 研究方法',
    title: '抽样偏差：问了很多人，仍可能问错了人',
    summary: '样本数量与样本代表性是不同问题。便利抽样、自愿回应或遗漏部分群体，都可能影响结论。',
    content:
      '统计教材介绍随机、分层、整群、系统与便利等抽样方法，并讨论抽样变异。只访问容易联系或愿意回答的人，所得结果可能系统偏离目标总体。\n\n“大量评论”首先反映留下评论的人，不能自动代表全部使用者。阅读调查时，应检查谁被纳入、谁被排除、何时收集以及问题如何表述。扩大一个有偏样本，不一定能消除偏差。',
    topics: ['以偏概全', '网络舆论', '证据'],
    sourceTitle: 'OpenStax《Introductory Statistics 2e》1.2：数据、抽样与变异',
    url: 'https://openstax.org/books/introductory-statistics-2e/pages/1-2-data-sampling-and-variation-in-data-and-sampling',
  },
  {
    id: 'd82',
    conceptId: 'e52',
    concept: '差异与分布',
    category: '社会学 · 数据阅读',
    title: '离散程度：均值相同，生活可能很不相同',
    summary: '离散程度描述数值分散的情况。只报告平均水平，会遗漏稳定性、差距及极端值等重要信息。',
    content:
      '教材以标准差等指标描述数据相对均值的分散程度。两组数据即使平均数相同，也可能一组集中、另一组分化；这些差异会改变我们对“典型情况”的理解。\n\n标准差带有原数据的单位，比较时应核对测量尺度与样本条件。它本身不解释差异为何产生，也不自动给出公平判断。描述分布、解释原因和作价值评价，需要分步完成。',
    topics: ['差异', '公平与效率', '事实与评价'],
    sourceTitle: 'OpenStax《Introductory Statistics 2e》2.7：数据的离散程度',
    url: 'https://openstax.org/books/introductory-statistics-2e/pages/2-7-measures-of-the-spread-of-the-data',
  },
] as const;

export const SOCIAL_KNOWLEDGE: IDailyKnowledge[] = SOCIAL_EVIDENCE.map((item) => ({
  id: item.id,
  date: '2026-10-23',
  title: item.title,
  category: item.category,
  summary: item.summary,
  content: item.content,
  source: `${item.sourceTitle}。${item.url}`,
}));
