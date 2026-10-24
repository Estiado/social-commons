-- Reviewed source-based site examples. No reader's private data.
begin;
insert into public.essay_examples (id,concept_id,title,content,source,source_url,usage_hint) values
('example-d83','e53','生产率 J 曲线：新工具为什么没有立刻带来效率','布林约尔松、罗克和西弗森研究通用技术时指出，企业除了购置设备，还要投入培训、流程和商业模式等无形资产。这些投入未被充分计量时，早期生产率表现可能低于实际积累，随后才逐步显现收益。

J 曲线讨论的是技术与互补投入的关系，并不保证所有投资最终成功。评价工具，要同时观察学习成本、流程变化与实际产出，不能仅凭刚上线时的速度或一时的宣传热度作判断。','Brynjolfsson、Rock、Syverson：The Productivity J-Curve（NBER 25148；2021年期刊版）','https://www.nber.org/papers/w25148',''),
('example-d84','e54','图灵陷阱：像人，是否就是技术的唯一目标','《图灵陷阱》把“模仿人的智能”与“增强人的能力”区分开来。作者认为，只追求用机器完成已有工作，可能忽视新产品、新服务与新的合作方式，并改变劳动者的议价能力。

这是关于技术方向的论证，不是对每项自动化的否定。同一种工具可以用来压缩岗位，也可以辅助人完成原来做不到的事；实际结果取决于设计目标、任务安排与收益如何分配。','Erik Brynjolfsson：The Turing Trap（2022）','https://arxiv.org/abs/2201.04200',''),
('example-d85','e55','工作会消失，也会改变：从职业名称转向具体任务','阿西莫格鲁与雷斯特雷波在《自动化与新任务》中，用任务分配解释技术与劳动的关系。机器承担原有任务会产生替代效应，新任务的出现则可能让劳动重新进入生产过程。

因此，“某种职业会不会消失”往往需要拆开讨论：哪些环节改变了，哪些能力仍被需要，是否出现新的分工。总产出增加并不意味着每个人都受益，任务创造也不能自动弥补所有人的转型成本。','Daron Acemoglu、Pascual Restrepo：Automation and New Tasks，JEP 33(2)，2019','https://www.aeaweb.org/articles?id=10.1257/jep.33.2.3',''),
('example-d86','e56','能回忆，能否就能运用？提取练习的迁移边界','Pan 与 Rickard 汇总了提取练习的迁移研究：与重新学习相比，测试式回忆整体上能促进后续迁移，但效果随问题类型和练习条件而变化。回忆某个答案，与在新情境中推理，并非完全相同的活动。

熟悉不等于能够独立提取，提取成功也不等于已经掌握所有应用。理解研究时，应区分记住原题、解释原理和解决新问题，避免把一种有效方法说成适用于一切内容的捷径。','Steven C. Pan、Timothy C. Rickard：Transfer of test-enhanced learning，Psychological Bulletin，2018','https://pubmed.ncbi.nlm.nih.gov/29733621/',''),
('example-d87','e57','为什么隔一段时间再读，可能比连续重读更有用','Cepeda 等人的元分析比较了分散学习与集中学习。研究表明，学习间隔和最终保持时间共同影响记忆表现：希望保持得越久，较合适的间隔通常也会随之变化。

这不是一张适用于所有人的固定复习日历。材料难度、原有知识和反馈方式都会影响效果；同样的总时长，怎样分配与隔多久检查一次理解，都是学习过程的一部分。','Nicholas J. Cepeda 等：Distributed practice in verbal recall tasks，Psychological Bulletin，2006','https://pubmed.ncbi.nlm.nih.gov/16719566/',''),
('example-d88','e58','把记忆交给纸笔和手机以后','Risko 与 Gilbert 将借助外部行动改变信息处理要求的做法称为认知卸载。写下待办、设置提醒、调整物体位置，都可能让环境承担部分原本需要在头脑中完成的工作。

综述关心两个问题：人何时决定使用工具，使用之后又有什么后果。外部帮助并不天然损害思考，但对工具的依赖也可能建立在不准确的自我判断上。工具是否可靠、内容是否容易找回，与“存下来了”同样值得关注。','Evan F. Risko、Sam J. Gilbert：Cognitive Offloading，Trends in Cognitive Sciences，2016','https://samgilbert.net/pubs/Risko2016TiCS.pdf',''),
('example-d89','e59','“我知道”与“我能解释清楚”之间','Rozenblit 与 Keil 研究人们对日常事物的理解判断。参与者尝试详细解释运作机制后，往往会下调原先对自己理解程度的评价。识别名称和用途，与说明内部因果过程，需要不同层次的知识。

这种落差不等于人们有意夸大。只有真正展开解释，缺少的环节才可能暴露出来。结论来自特定任务，不能据此断言所有自信都不可靠；它提示我们让“懂了”的感觉接受具体解释的检验。','Leonid Rozenblit、Frank Keil：The misunderstood limits of folk science，Cognitive Science，2002','https://cogdevlab.yale.edu/sites/default/files/files/rozenblit%20%26%20keil%20%202002.pdf',''),
('example-d90','e60','为什么我们总能找到支持自己的证据','Nickerson 的综述把确认偏误概括为搜寻或解释证据时偏向已有信念、期待或假设。偏向既可能出现在“看什么”上，也可能出现在面对同一材料时“怎样理解”上。

这不意味着支持自己观点的证据都无效。关键是同样严格地对待有利与不利信息，并允许结论随证据调整。寻找反例也不是为了刻意唱反调，而是弄清原来的判断在什么条件下才成立。','Raymond S. Nickerson：Confirmation Bias，Review of General Psychology 2(2)，1998','https://doi.org/10.1037/1089-2680.2.2.175',''),
('example-d91','e61','眼前有，不等于已经看见','OpenStax 区分感觉与知觉：前者涉及感官对刺激的接收，后者涉及信息如何被组织和解释。注意、动机与已有经验，会影响进入意识的内容。

因此，看到同一个场景的人未必注意到相同细节。观察遗漏不能简单证明一个人不诚实，而主观确信也不能保证记录完整。讨论目击、阅读或日常分歧时，需要区分外部刺激、注意到的部分与后来作出的解释。','OpenStax《Psychology 2e》5.1：Sensation versus Perception','https://openstax.org/books/psychology-2e/pages/5-1-sensation-versus-perception',''),
('example-d92','e62','记不起来，是否就等于没有记住','OpenStax 用编码、储存与提取描述记忆过程。信息需要经过加工才能进入记忆，已有知识和意义联系也参与其中；后来能否取出，还涉及线索与情境。

把记忆想成存放文件的柜子，容易忽略这些过程之间的差别。认出熟悉内容、自由回忆和重新学习，并不是同一种表现。评价自己的掌握程度时，需要看具体任务，不能只靠再次阅读时的熟悉感。','OpenStax《Psychology 2e》8.1：How Memory Functions','https://openstax.org/books/psychology-2e/pages/8-1-how-memory-functions',''),
('example-d93','e63','回忆不是把录像重新播放','OpenStax 在讨论记忆问题时介绍了误导信息与目击者研究。后来接触的描述可能影响人对原先经历的回忆，个人也可能把推断与实际见闻混在一起。

因此，回忆的生动程度不等于准确程度。这并不否定所有个人经验，而是说明重要叙述需要与当时记录及其他独立材料互相核对。记忆既维系一个人的经历，也在不断被重新组织。','OpenStax《Psychology 2e》8.3：Problems with Memory','https://openstax.org/books/psychology-2e/pages/8-3-problems-with-memory',''),
('example-d94','e64','为了喜欢而做，还是为了奖励而做','OpenStax 将内在动机与活动本身带来的满足联系起来，将外在动机与奖励、评价等外部结果联系起来。同一行动可以同时具有不同动机，二者不是非此即彼的身份标签。

奖励的意义也与情境有关：它可能提供反馈，也可能让注意转向外部评价。不能把所有奖励都说成有害，或把所有坚持都归结为意志。人的兴趣、目标与环境支持需要放在一起观察。','OpenStax《Psychology 2e》10.1：Motivation','https://openstax.org/books/psychology-2e/pages/10-1-motivation',''),
('example-d95','e65','“能力可以发展”以后，还需要什么','Yeager 等人在美国学校开展的大规模研究，考察了简短成长型思维干预的效果。结果显示，影响并不对所有学生和环境完全一致，同伴规范等学校条件与效果有关。

因此，成长型思维不能被简化为“只要努力就能成功”。承认能力可以发展，还需要允许试错的环境、反馈与可调整的方法。把受挫都归咎于个人心态，反而会遮蔽资源和处境的差异。','David S. Yeager 等：A national experiment reveals where a growth mindset improves achievement，Nature，2019','https://www.nature.com/articles/s41586-019-1466-y',''),
('example-d96','e66','美不只在美术馆里','《斯坦福哲学百科》的“日常美学”条目讨论了艺术作品以外的审美经验：生活环境、普通物品和日常活动，也会带来感受、判断与价值问题。

扩大审美范围，并不是要求每件日用品都变成艺术品。它使人重新注意习以为常的质感、秩序与氛围，也让审美与照料环境、使用物品的方式联系起来。日常生活既有愉悦的经验，也有杂乱、粗糙等不悦感受。','Stanford Encyclopedia of Philosophy：Aesthetics of the Everyday','https://plato.stanford.edu/entries/aesthetics-of-everyday/',''),
('example-d97','e67','谁在讲述，决定了我们能知道多少','OpenStax 写作教材比较不同人称与叙述视角。第一人称让读者接近讲述者的经验；第三人称可以局限于一个人物，也可以进入多个角色的思想。选择视角，同时是在安排信息的边界。

因此，一段叙事中的沉默、误解和悬念，可能来自讲述位置。理解人物时，要留意哪些是亲见，哪些是推断，哪些经历没有进入叙述。视角改变的不只是代词，也改变了读者与人物的距离。','OpenStax《Writing Guide》4.6：Characterization and Point of View','https://openstax.org/books/writing-guide/pages/4-6-editing-focus-more-on-characterization-and-point-of-view',''),
('example-d98','e68','把一种事物看作另一种：隐喻怎样改变理解','《斯坦福哲学百科》的“隐喻”条目梳理了语义、语用等不同解释路径。用一种事物谈论另一种，不能简单还原成字面上的相等；语境和读者的理解活动参与了意义的形成。

一种隐喻会突出某些相似性，同时淡化其他方面。它可以打开新的感受，也可能使某种描述显得理所当然。阅读隐喻时，既可以体会它带来的联想，也要留意它没有解释的部分。','Stanford Encyclopedia of Philosophy：Metaphor','https://plato.stanford.edu/entries/metaphor/',''),
('example-d99','e69','同一件往事，为什么会留下不同的记载','Digital Inquiry Group 的历史思维资料强调出处分析、情境化、互证与细读。材料由谁写成、面向谁、距离事件多久，都影响它能够说明什么。

多份文字内容相同，不一定构成独立支持，它们也可能转引同一来源。相反，差异不必然意味着有人造假，也可能来自位置与目的不同。把材料放回产生的情境，才能区分当时人的认识、后来人的解释和仍然未知的部分。','Digital Inquiry Group：Historical Thinking Chart','https://www.inquirygroup.org/history-lessons/historical-thinking-chart',''),
('example-d100','e70','同一款 AI，为什么对不同人的帮助不一样','Brynjolfsson、Danielle Li 与 Raymond 的《工作中的生成式 AI》研究客服人员使用对话辅助工具的情况。研究中，经验较少的人员获益更明显，而有经验的高技能人员变化较小。

这使“工具能提升多少效率”变成了更具体的问题：对谁、在什么任务中、采用什么指标。结论来自特定工作环境，不能直接外推到所有职业，更不能把完成任务更快等同于已经学会独立完成。','Erik Brynjolfsson、Danielle Li、Lindsey R. Raymond：Generative AI at Work，NBER 31161（2023年修订版）','https://www.nber.org/papers/w31161',''),
('example-d71','e41','基本归因错误：看见行为，也看见处境','OpenStax 将人的行为放在个体特征与环境的共同作用中理解。基本归因错误指观察者偏向用性格解释他人行为，却忽视具体处境；行动者与观察者掌握的信息也可能不同。

这不意味着个人没有责任，而是提醒解释者区分事实、动机推断与环境约束。“他迟到了”是观察，“他不尊重人”则已经加入了性格判断。充分的解释应允许新的证据改变判断。','OpenStax《Psychology 2e》12.1：社会心理学与归因','https://openstax.org/books/psychology-2e/pages/12-1-what-is-social-psychology',''),
('example-d72','e42','认知失调：当行动与信念互相冲突','费斯廷格提出的认知失调理论关注内部不一致带来的心理张力。教材讨论了人如何调整态度、减少矛盾信息的重要性，或为既有行动寻找新的解释。

“说服自己”有时是适应，也可能让人回避错误。理解这一机制时，应区分真正改变行动与仅仅更换理由，不能凭一句辩解就诊断一个人的内心。态度改变还受到信息、关系和情境影响。','OpenStax《Psychology 2e》12.3：态度与说服','https://openstax.org/books/psychology-2e/pages/12-3-attitudes-and-persuasion',''),
('example-d73','e43','从众：多数人的意见为什么有力量','教材借阿希的线段判断实验说明，即使任务相对清楚，群体的一致回答仍可能影响个体。规范性影响关联被接纳的需要，信息性影响则关联对正确答案的判断。

实验所呈现的是特定条件中的行为变化，不代表“多数意见总是错误”。独立判断也不是为反对而反对：需要检查证据、表达异议的成本，以及群体是否允许纠错。','OpenStax《Psychology 2e》12.4：从众、顺从与服从','https://openstax.org/books/psychology-2e/pages/12-4-conformity-compliance-and-obedience',''),
('example-d74','e44','从印象到排斥：三种不同的问题','教材把刻板印象、偏见与歧视分别放在认知、情感和行为层面。把群体特征直接套在某个人身上，会忽略群体内部的差异；态度与行为之间也并非总是一一对应。

理解差异，需要具体考察信息来源、接触条件与制度安排。仅仅赞美“包容”还不够：日常语言怎样分类人，机会怎样分配，受影响的人能否表达和申诉，都是可以观察的问题。','OpenStax《Psychology 2e》12.5：偏见与歧视','https://openstax.org/books/psychology-2e/pages/12-5-prejudice-and-discrimination',''),
('example-d75','e45','镜中自我：我们怎样借他人的目光认识自己','社会学教材介绍，自我并不只来自孤立的内省。人会想象别人怎样看自己、怎样评价自己，再产生自豪、羞惭等感受。这里的关键是对评价的理解，它未必等于他人的真实想法。

米德则强调互动与角色承担。把自我理解放在社会关系中，可以看见认可的力量，也能警惕用单一评价限定自己。一个人在不同关系中呈现不同侧面，并不必然意味着虚伪。','OpenStax《Introduction to Sociology 3e》5.1：自我发展的理论','https://openstax.org/books/introduction-sociology-3e/pages/5-1-theories-of-self-development',''),
('example-d76','e46','社会建构：共同承认的意义也会产生后果','教材通过角色、情境定义和自我呈现解释社会现实如何被维持。人对情境的理解会影响行动，而行动又可能使原先的判断产生实际后果。

这类分析不是否认物质条件。钱币的材料与它的支付资格是不同问题：后者离不开共同承认和制度。讨论建构过程，应进一步追问谁有权命名、规则如何改变，以及哪些人承担改变的成本。','OpenStax《Introduction to Sociology 3e》4.3：现实的社会建构','https://openstax.org/books/introduction-sociology-3e/pages/4-3-social-constructions-of-reality',''),
('example-d77','e47','文化相对主义：理解之前，先暂缓熟悉的尺度','教材比较文化中心主义与文化相对主义：前者倾向以自身文化判断他者，后者努力在当地文化背景中理解信念与实践。物质文化与价值、规范等非物质文化也相互关联。

理解背景并不自动解决价值冲突，更不意味着任何行为都无需批评。它首先要求描述准确、听见当地人的不同声音，再说明自己采用什么评价尺度，避免把整个群体想成只有一种生活。','OpenStax《Introduction to Sociology 3e》3.1：文化是什么','https://openstax.org/books/introduction-sociology-3e/pages/3-1-what-is-culture',''),
('example-d78','e48','需求弹性：价格变了，人有多少调整余地','同样涨价，不同商品的需求量反应可能相差很大。教材用弹性区分这些反应，并提醒计算时比较相应的百分比变化。弹性不是需求曲线斜率的另一个名称。

一种商品是否容易替代、人们有多少调整时间，会影响选择余地。讨论消费行为时，不能只问人是否愿意改变，也要问他能否找到替代办法；短期约束与长期适应应分别分析。','OpenStax《Principles of Economics 3e》5.1：需求与供给的价格弹性','https://openstax.org/books/principles-economics-3e/pages/5-1-price-elasticity-of-demand-and-price-elasticity-of-supply',''),
('example-d79','e49','分析尺度：一个人的选择不等于整个社会的结果','教材把微观与宏观比作观察经济的不同视角。理解家庭如何决策，与理解整体失业和通胀，都很必要；但不能简单用家庭收支类比整个国家，也不能把总量变化当成每个人的共同经历。

从个体推到整体，需要说明互动、制度和反馈。同一种行动被很多人同时采取后，可能改变原本的条件。分析尺度的转换，应有证据和中间机制，而不是把“小道理”直接放大。','OpenStax《Principles of Economics 3e》1.2：微观经济学与宏观经济学','https://openstax.org/books/principles-economics-3e/pages/1-2-microeconomics-and-macroeconomics',''),
('example-d80','e50','平均数与中位数：一个数字能代表谁','教材比较平均数与中位数，并说明分布形态会影响两者的关系。少数极大或极小的值可能明显拉动平均数，而中位数对这种变化相对不敏感。

读收入、时间或成绩数据时，应核对指标定义、样本范围和分布。均值上升不等于每个人都改善了；中位数稳定也不等于没有差距变化。中心位置与内部差异是两类信息。','OpenStax《Introductory Statistics 2e》2.5：数据的中心','https://openstax.org/books/introductory-statistics-2e/pages/2-5-measures-of-the-center-of-the-data',''),
('example-d81','e51','抽样偏差：问了很多人，仍可能问错了人','统计教材介绍随机、分层、整群、系统与便利等抽样方法，并讨论抽样变异。只访问容易联系或愿意回答的人，所得结果可能系统偏离目标总体。

“大量评论”首先反映留下评论的人，不能自动代表全部使用者。阅读调查时，应检查谁被纳入、谁被排除、何时收集以及问题如何表述。扩大一个有偏样本，不一定能消除偏差。','OpenStax《Introductory Statistics 2e》1.2：数据、抽样与变异','https://openstax.org/books/introductory-statistics-2e/pages/1-2-data-sampling-and-variation-in-data-and-sampling',''),
('example-d82','e52','离散程度：均值相同，生活可能很不相同','教材以标准差等指标描述数据相对均值的分散程度。两组数据即使平均数相同，也可能一组集中、另一组分化；这些差异会改变我们对“典型情况”的理解。

标准差带有原数据的单位，比较时应核对测量尺度与样本条件。它本身不解释差异为何产生，也不自动给出公平判断。描述分布、解释原因和作价值评价，需要分步完成。','OpenStax《Introductory Statistics 2e》2.7：数据的离散程度','https://openstax.org/books/introductory-statistics-2e/pages/2-7-measures-of-the-spread-of-the-data',''),
('example-opportunity','e26','同样两小时，如何比较不同用途？','课堂设例（非实证研究）：两小时可以用于订正、继续刷题或休息。选择订正的机会成本，应与最佳可行替代方案比较，不能把其他所有方案的收益相加。','本站依据 OpenStax 机会成本定义编写的教学设例。','https://openstax.org/books/principles-economics-3e/pages/2-1-how-individuals-make-choices-based-on-their-budget-constraint','先交代约束与目的；不预设休息的价值为零。'),
('example-loss','e27','得失判断中的参照点','卡尼曼回顾前景理论时说明，评价得失需要参照点，损失与收益的心理权重往往不对称。这里是对判断机制的概述，不代表可以为每个人的情绪设定统一倍数。','本站依据卡尼曼诺奖自传整理，非原话。','https://www.nobelprize.org/prizes/economic-sciences/2002/kahneman/biographical/','可分析排名、预期和得失；不要将研究当作心理诊断。'),
('example-framing','e28','把分母和期限写出来','课堂设例（虚构数据）：同一活动“90%完成”和“10%未完成”在数字上等价，却可能使读者产生不同印象。若统计范围或时间不同，两句话就不再等价，不能用“框架效应”掩盖事实差异。','本站依据框架效应编写的设例；概念来源为卡尼曼研究回顾。','https://www.nobelprize.org/prizes/economic-sciences/2002/kahneman/biographical/','适合练习信息改写与核查，虚构数字不能当调查结果引用。'),
('example-commons','e29','不存在处处通用的一套公地规则','奥斯特罗姆在诺奖访谈中解释，长期稳健的共享系统存在共同设计原则，但没有一套具体规则在所有系统中通用。制度需要依据当地条件落实。','本站依据 Elinor Ostrom 访谈整理，非原话。','https://www.nobelprize.org/prizes/economic-sciences/2009/ostrom/164465-ostrom-williamson-interview-transcript/','从“人人自觉”推进到规则如何参与、执行和调整。'),
('example-causal','e30','政策变化能否帮助识别因果？','2021 年经济学奖说明，自然实验可以帮助回答教育、劳动等社会问题。比较结果前，需要分析受影响与未受影响群体是否具有可比性，不能把一前一后的变化都归于政策。','本站依据 2021 年经济学奖新闻稿概述，非原话。','https://www.nobelprize.org/prizes/economic-sciences/2021/press-release/','论证时补反事实和竞争解释，不编造实验数据。'),
('example-falsification','e31','一句“总有例外”会保护什么？','课堂设例：若“这种方法对所有人都有效”在遇到失败时总被改成“只是你不够努力”，它就回避了反证。可以改为明确适用对象、期限和结果指标，再接受检验。','本站根据科学方法中可证伪性的讨论编写的设例。','https://plato.stanford.edu/entries/scientific-method/','反对的是拒绝检验的表达；不能据此断定某个真实方法一定无效。'),
('example-abduction','e32','地面湿了，不一定是下雨','课堂设例：雨水、清洁或漏水都可能解释地面潮湿。需要观察窗户、清洁记录和水迹位置，比较各解释的支持证据。一个故事听起来合理，并不足以排除其他原因。','本站根据溯因推理概念编写的设例。','https://plato.stanford.edu/entries/abduction/','练习从“可能”到“更可信”的推理，不把比喻当史实。'),
('example-statistics','e33','显著性不是效果大小','美国统计学会 2016 年声明指出，p 值不衡量效果大小或结果的重要性，也不表示假说为真的概率。研究结论需要结合设计、背景和完整报告。','本站依据 ASA 声明摘要整理，非原话。','https://www.amstat.org/docs/default-source/amstat-documents/p-valuestatement.pdf','遇到“科学证明”时继续核对原研究，不用单个数字替代论证。'),
('example-replication','e34','让下一组能看懂调查过程','课堂设例：两组得到不同结果，可能来自样本、测量或处理方式差异。保留匿名问卷、抽样说明与处理步骤，才能比较差异；仅保存最后一张图表不够。','本站依据 National Academies 关于重复与复现的定义编写的设例。','https://nap.nationalacademies.org/resource/25303/Combined%20Reproducibility%20Brief%20vs2.pdf','讨论透明与合作，也注意个人信息保护。'),
('example-testimony','e35','相信专业，也检查专业边界','课堂设例：同一位学者对自己研究领域的判断，与对陌生领域的随口评论，需要不同的信任依据。核查论证和证据，比只比较头衔更能帮助判断。','本站依据证言认识论编写的设例，非特定学者事迹。','https://plato.stanford.edu/entries/testimony-episprob/','避免由“专家也会错”推到“专业知识没有意义”。'),
('example-capability','e36','同一张入场券，不同的实际机会','课堂设例：图书馆免费开放，但交通、开放时间和无障碍条件可能使不同使用者面对不同门槛。资源数量相同，未必已经转化为同等机会。','本站依据可行能力进路编写的设例。','https://plato.stanford.edu/entries/capability-approach/','从抽象公平推进到具体条件，不把设例当作真实统计。'),
('example-open-science','e37','开放知识不只有免费论文','UNESCO 把开放出版物、研究数据、教育资源、软件和基础设施等纳入开放科学，并关注社会参与。共享需要可获取，也需要让使用者理解许可和复用条件。','本站依据 UNESCO Open Science 页面概述，非原话。','https://www.unesco.org/en/open-science','可联系教学资源共享；区分免费阅读和开放许可。'),
('example-externality','e38','夜间活动的收益与噪声成本','课堂设例：活动者获得休闲收益，附近住户承受噪声。分析外部性需要把这部分影响放进讨论，再比较时间、场地和隔音安排，不能只用道德标签结束争论。','本站根据 OpenStax 外部性概念编写的设例。','https://openstax.org/books/principles-economics-3e/pages/12-key-concepts-and-summary','先辨认受影响者，再提出可执行方案。'),
('example-lateral','e39','十个转发页，可能只有一个来源','COR 课程建议离开陌生页面，调查发布者并比较其他来源。若十个页面都转述同一条未经证实的消息，数量增加并没有形成十份独立证据。后一句为本站教学说明。','Digital Inquiry Group 课程方法摘要及本站教学说明。','https://cor.inquirygroup.org/blog/module-for-high-school/','记录首发、证据与转述路径，明确未知部分。'),
('example-care','e40','照料不是一个人的无限义务','课堂设例：一名成员长期承担小组协调与安慰工作。讨论关怀时，既要看到被帮助者的需要，也要讨论任务分担、边界和支持条件，而不是要求“有爱心的人”一直承担。','本站依据关怀伦理讨论编写的设例，非真实人物报道。','https://plato.stanford.edu/entries/feminism-ethics/','把关系中的责任写具体，也保护照料者的自主权。'),
('example-thucydides','e1','“修昔底德陷阱”是一种研究视角，不是战争预言','哈佛大学贝尔弗中心的项目介绍列出 16 组大国竞争案例，其中 4 组没有以战争告终。项目同时说明，其讨论目的是避免冲突，而非把历史当作未来必然重复的定律。这些数字属于该项目的案例选择，不能直接解释为所有国家关系的战争概率。','本站依据 Harvard Kennedy School Belfer Center 的 Thucydides’s Trap 项目介绍整理。','https://www.belfercenter.org/programs/thucydidess-trap','比较结构压力与政治选择；避免将有限案例的比例直接当作普遍概率。'),
('example-lemons','e2','二手车市场为什么会出现“逆向选择”？','诺贝尔奖官网对 2001 年经济学奖的说明以二手车市场介绍阿克洛夫的研究：卖方比买方更了解车况时，买方难以区分质量，优质商品可能因此退出市场。这里讨论的是信息结构对交易的影响，不能简单推论所有市场都会失灵。','本站依据 NobelPrize.org 的 2001 年经济学奖新闻稿整理。','https://www.nobelprize.org/prizes/economic-sciences/2001/press-release/','可用于分析信任、质量认证与信息披露；引用时注明其模型条件。')
on conflict(id) do update set concept_id=excluded.concept_id,title=excluded.title,content=excluded.content,source=excluded.source,source_url=excluded.source_url,usage_hint=excluded.usage_hint;
commit;
