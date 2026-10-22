import type { EssayExample } from '../essayExamples';

export const REASONING_EXAMPLES: EssayExample[] = [
  {
    id: 'example-opportunity',
    conceptId: 'e26',
    title: '同样两小时，如何比较不同用途？',
    content:
      '课堂设例（非实证研究）：两小时可以用于订正、继续刷题或休息。选择订正的机会成本，应与最佳可行替代方案比较，不能把其他所有方案的收益相加。',
    source: '本站依据 OpenStax 机会成本定义编写的教学设例。',
    sourceUrl:
      'https://openstax.org/books/principles-economics-3e/pages/2-1-how-individuals-make-choices-based-on-their-budget-constraint',
    usageHint: '先交代约束与目的；不预设休息的价值为零。',
  },
  {
    id: 'example-loss',
    conceptId: 'e27',
    title: '得失判断中的参照点',
    content:
      '卡尼曼回顾前景理论时说明，评价得失需要参照点，损失与收益的心理权重往往不对称。这里是对判断机制的概述，不代表可以为每个人的情绪设定统一倍数。',
    source: '本站依据卡尼曼诺奖自传整理，非原话。',
    sourceUrl: 'https://www.nobelprize.org/prizes/economic-sciences/2002/kahneman/biographical/',
    usageHint: '可分析排名、预期和得失；不要将研究当作心理诊断。',
  },
  {
    id: 'example-framing',
    conceptId: 'e28',
    title: '把分母和期限写出来',
    content:
      '课堂设例（虚构数据）：同一活动“90%完成”和“10%未完成”在数字上等价，却可能使读者产生不同印象。若统计范围或时间不同，两句话就不再等价，不能用“框架效应”掩盖事实差异。',
    source: '本站依据框架效应编写的设例；概念来源为卡尼曼研究回顾。',
    sourceUrl: 'https://www.nobelprize.org/prizes/economic-sciences/2002/kahneman/biographical/',
    usageHint: '适合练习信息改写与核查，虚构数字不能当调查结果引用。',
  },
  {
    id: 'example-commons',
    conceptId: 'e29',
    title: '不存在处处通用的一套公地规则',
    content:
      '奥斯特罗姆在诺奖访谈中解释，长期稳健的共享系统存在共同设计原则，但没有一套具体规则在所有系统中通用。制度需要依据当地条件落实。',
    source: '本站依据 Elinor Ostrom 访谈整理，非原话。',
    sourceUrl:
      'https://www.nobelprize.org/prizes/economic-sciences/2009/ostrom/164465-ostrom-williamson-interview-transcript/',
    usageHint: '从“人人自觉”推进到规则如何参与、执行和调整。',
  },
  {
    id: 'example-causal',
    conceptId: 'e30',
    title: '政策变化能否帮助识别因果？',
    content:
      '2021 年经济学奖说明，自然实验可以帮助回答教育、劳动等社会问题。比较结果前，需要分析受影响与未受影响群体是否具有可比性，不能把一前一后的变化都归于政策。',
    source: '本站依据 2021 年经济学奖新闻稿概述，非原话。',
    sourceUrl: 'https://www.nobelprize.org/prizes/economic-sciences/2021/press-release/',
    usageHint: '论证时补反事实和竞争解释，不编造实验数据。',
  },
  {
    id: 'example-falsification',
    conceptId: 'e31',
    title: '一句“总有例外”会保护什么？',
    content:
      '课堂设例：若“这种方法对所有人都有效”在遇到失败时总被改成“只是你不够努力”，它就回避了反证。可以改为明确适用对象、期限和结果指标，再接受检验。',
    source: '本站根据科学方法中可证伪性的讨论编写的设例。',
    sourceUrl: 'https://plato.stanford.edu/entries/scientific-method/',
    usageHint: '反对的是拒绝检验的表达；不能据此断定某个真实方法一定无效。',
  },
  {
    id: 'example-abduction',
    conceptId: 'e32',
    title: '地面湿了，不一定是下雨',
    content:
      '课堂设例：雨水、清洁或漏水都可能解释地面潮湿。需要观察窗户、清洁记录和水迹位置，比较各解释的支持证据。一个故事听起来合理，并不足以排除其他原因。',
    source: '本站根据溯因推理概念编写的设例。',
    sourceUrl: 'https://plato.stanford.edu/entries/abduction/',
    usageHint: '练习从“可能”到“更可信”的推理，不把比喻当史实。',
  },
  {
    id: 'example-statistics',
    conceptId: 'e33',
    title: '显著性不是效果大小',
    content:
      '美国统计学会 2016 年声明指出，p 值不衡量效果大小或结果的重要性，也不表示假说为真的概率。研究结论需要结合设计、背景和完整报告。',
    source: '本站依据 ASA 声明摘要整理，非原话。',
    sourceUrl: 'https://www.amstat.org/docs/default-source/amstat-documents/p-valuestatement.pdf',
    usageHint: '遇到“科学证明”时继续核对原研究，不用单个数字替代论证。',
  },
  {
    id: 'example-replication',
    conceptId: 'e34',
    title: '让下一组能看懂调查过程',
    content:
      '课堂设例：两组得到不同结果，可能来自样本、测量或处理方式差异。保留匿名问卷、抽样说明与处理步骤，才能比较差异；仅保存最后一张图表不够。',
    source: '本站依据 National Academies 关于重复与复现的定义编写的设例。',
    sourceUrl:
      'https://nap.nationalacademies.org/resource/25303/Combined%20Reproducibility%20Brief%20vs2.pdf',
    usageHint: '讨论透明与合作，也注意个人信息保护。',
  },
  {
    id: 'example-testimony',
    conceptId: 'e35',
    title: '相信专业，也检查专业边界',
    content:
      '课堂设例：同一位学者对自己研究领域的判断，与对陌生领域的随口评论，需要不同的信任依据。核查论证和证据，比只比较头衔更能帮助判断。',
    source: '本站依据证言认识论编写的设例，非特定学者事迹。',
    sourceUrl: 'https://plato.stanford.edu/entries/testimony-episprob/',
    usageHint: '避免由“专家也会错”推到“专业知识没有意义”。',
  },
  {
    id: 'example-capability',
    conceptId: 'e36',
    title: '同一张入场券，不同的实际机会',
    content:
      '课堂设例：图书馆免费开放，但交通、开放时间和无障碍条件可能使不同使用者面对不同门槛。资源数量相同，未必已经转化为同等机会。',
    source: '本站依据可行能力进路编写的设例。',
    sourceUrl: 'https://plato.stanford.edu/entries/capability-approach/',
    usageHint: '从抽象公平推进到具体条件，不把设例当作真实统计。',
  },
  {
    id: 'example-open-science',
    conceptId: 'e37',
    title: '开放知识不只有免费论文',
    content:
      'UNESCO 把开放出版物、研究数据、教育资源、软件和基础设施等纳入开放科学，并关注社会参与。共享需要可获取，也需要让使用者理解许可和复用条件。',
    source: '本站依据 UNESCO Open Science 页面概述，非原话。',
    sourceUrl: 'https://www.unesco.org/en/open-science',
    usageHint: '可联系教学资源共享；区分免费阅读和开放许可。',
  },
  {
    id: 'example-externality',
    conceptId: 'e38',
    title: '夜间活动的收益与噪声成本',
    content:
      '课堂设例：活动者获得休闲收益，附近住户承受噪声。分析外部性需要把这部分影响放进讨论，再比较时间、场地和隔音安排，不能只用道德标签结束争论。',
    source: '本站根据 OpenStax 外部性概念编写的设例。',
    sourceUrl:
      'https://openstax.org/books/principles-economics-3e/pages/12-key-concepts-and-summary',
    usageHint: '先辨认受影响者，再提出可执行方案。',
  },
  {
    id: 'example-lateral',
    conceptId: 'e39',
    title: '十个转发页，可能只有一个来源',
    content:
      'COR 课程建议离开陌生页面，调查发布者并比较其他来源。若十个页面都转述同一条未经证实的消息，数量增加并没有形成十份独立证据。后一句为本站教学说明。',
    source: 'Digital Inquiry Group 课程方法摘要及本站教学说明。',
    sourceUrl: 'https://cor.inquirygroup.org/blog/module-for-high-school/',
    usageHint: '记录首发、证据与转述路径，明确未知部分。',
  },
  {
    id: 'example-care',
    conceptId: 'e40',
    title: '照料不是一个人的无限义务',
    content:
      '课堂设例：一名成员长期承担小组协调与安慰工作。讨论关怀时，既要看到被帮助者的需要，也要讨论任务分担、边界和支持条件，而不是要求“有爱心的人”一直承担。',
    source: '本站依据关怀伦理讨论编写的设例，非真实人物报道。',
    sourceUrl: 'https://plato.stanford.edu/entries/feminism-ethics/',
    usageHint: '把关系中的责任写具体，也保护照料者的自主权。',
  },
];
