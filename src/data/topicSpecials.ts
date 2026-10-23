/**
 * 高考议论文专题数据
 * 每个专题聚合相关话题的文章、通识、名句，方便高三学生按主题找素材
 */

export interface TopicSpecial {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  // 用于匹配观澜文章的话题标签
  relatedTags: string[];
  // Stable IDs from daily.ts; historical links are not renumbered.
  relatedDailyIds: string[];
  // Canonical reading IDs from quotes.ts, without duplicate aliases.
  relatedQuoteIds: string[];
  // 专题封面色（用于卡片渐变）
  color: string;
}

export const TOPIC_SPECIALS: TopicSpecial[] = [
  {
    id: 'economy-development',
    name: '经济与发展',
    subtitle: '增长、就业与生活的连接',
    description:
      '从经济增长到劳动权益，从市场规则到消费选择，练习把宏观变化与人的具体生活联系起来。比较不同政策和行为的条件、收益与代价。',
    relatedTags: ['经济与发展'],
    relatedDailyIds: ['d78', 'd79', 'd51', 'd54', 'd67', 'd2', 'd5', 'd8'],
    relatedQuoteIds: ['q25', 'q15', 'q65', 'q79'],
    color: 'from-orange-500/10 to-amber-500/10',
  },
  {
    id: 'ecology-future',
    name: '生态与未来',
    subtitle: '在发展中理解长期责任',
    description:
      '生态保护、绿色转型与公共资源治理，是理解代际责任的重要入口。关注短期选择如何产生长期影响，并核对论证的事实和适用条件。',
    relatedTags: ['生态与环境'],
    relatedDailyIds: ['d56', 'd66', 'd65', 'd9', 'd8', 'd17'],
    relatedQuoteIds: ['q11', 'q44', 'q70', 'q84'],
    color: 'from-green-500/10 to-teal-500/10',
  },
  {
    id: 'other',
    name: '其他',
    subtitle: '保持开放，发现新的议题',
    description:
      '暂未归入其他主题的时评在这里汇集。阅读时可以自行提出问题、寻找论据，再整理成自己的文稿。',
    relatedTags: ['其他'],
    relatedDailyIds: ['d12'],
    relatedQuoteIds: ['q4'],
    color: 'from-stone-500/10 to-gray-500/10',
  },
  {
    id: 'tech-ai',
    name: '科技与AI',
    subtitle: '人工智能时代的人文思考',
    description:
      '当算法开始写作、AI开始对话，人类的独特性在哪里？科技发展与人文关怀的张力，是高考作文常考的核心议题。',
    relatedTags: ['科技与AI'],
    relatedDailyIds: ['d69', 'd64', 'd61', 'd21', 'd25', 'd26'],
    relatedQuoteIds: ['q36', 'q28', 'q39'],
    color: 'from-blue-500/10 to-cyan-500/10',
  },
  {
    id: 'youth-responsibility',
    name: '青年与责任',
    subtitle: '时代洪流中的个人选择',
    description:
      '青年是国家的未来，也是时代的担当。从"无穷的远方"到"人的境况"，个人与时代的关系是议论文永恒的主题。',
    relatedTags: ['教育与成长', '社会与民生'],
    relatedDailyIds: ['d70', 'd65', 'd20', 'd49', 'd48'],
    relatedQuoteIds: ['q2', 'q11', 'q43', 'q69'],
    color: 'from-red-500/10 to-orange-500/10',
  },
  {
    id: 'culture-heritage',
    name: '文化与传承',
    subtitle: '传统与现代的对话',
    description:
      '文化是一个民族的根脉。从意境到记忆的场所，从屈原到杜甫，如何在现代化进程中守护和传承文化，是高考作文的高频考点。',
    relatedTags: ['文化与传承'],
    relatedDailyIds: ['d64', 'd7', 'd23', 'd46'],
    relatedQuoteIds: ['q31', 'q41', 'q44', 'q58', 'q59'],
    color: 'from-amber-500/10 to-yellow-500/10',
  },
  {
    id: 'education-growth',
    name: '教育与成长',
    subtitle: '成为自己的道路',
    description:
      '教育的本质是什么？是灌输还是唤醒？从惯习与场域到附近的消失，从"知道自己为什么而活"到"人生如逆旅"，成长是一生的课题。',
    relatedTags: ['教育与成长'],
    relatedDailyIds: ['d75', 'd55', 'd57', 'd60', 'd34', 'd39', 'd40'],
    relatedQuoteIds: ['q7', 'q16', 'q65', 'q66', 'q57', 'q87', 'q89', 'q90'],
    color: 'from-green-500/10 to-emerald-500/10',
  },
  {
    id: 'international-global',
    name: '国际与全球',
    subtitle: '文明交流与冲突',
    description:
      '在全球化时代，如何看待不同文明的关系？从修昔底德陷阱到文明的冲突，从想象的共同体到丝绸之路，国际视野是议论文深度的重要来源。',
    relatedTags: ['国际与全球'],
    relatedDailyIds: ['d62', 'd67', 'd1', 'd35', 'd22'],
    relatedQuoteIds: ['q37', 'q38', 'q1', 'q61', 'q72', 'q75'],
    color: 'from-indigo-500/10 to-blue-500/10',
  },
  {
    id: 'philosophy-thinking',
    name: '哲学与思辨',
    subtitle: '追问根本问题的能力',
    description:
      '我是谁？从哪里来？到哪里去？从洞穴寓言到被抛，从维特根斯坦到卡夫卡，哲学思辨能力是议论文深度的核心，也是区分平庸与深刻的关键。',
    relatedTags: ['哲学与思辨', '文化与传承'],
    relatedDailyIds: ['d71', 'd72', 'd81', 'd58', 'd59', 'd62', 'd10', 'd47', 'd13'],
    relatedQuoteIds: ['q39', 'q49', 'q26', 'q70'],
    color: 'from-slate-500/10 to-gray-500/10',
  },
  {
    id: 'history-memory',
    name: '历史与记忆',
    subtitle: '在多视角中理解过去',
    description:
      '历史不是单一的叙事，而是多方声音的交织。从想象的共同体到记忆的场所，从屈原到杜甫，学会从不同视角看历史，是思辨深度的重要来源。',
    relatedTags: ['文化与传承', '国际与全球'],
    relatedDailyIds: ['d22', 'd17', 'd23'],
    relatedQuoteIds: ['q31', 'q41', 'q43', 'q55', 'q63', 'q76', 'q81', 'q82'],
    color: 'from-amber-500/10 to-orange-500/10',
  },
  {
    id: 'society-fairness',
    name: '社会与公平',
    subtitle: '正义如何可能',
    description:
      '公平与正义是议论文的永恒主题。从罗尔斯的"无知之幕"到费孝通的"差序格局"，从风险社会到消费社会，理解社会运行的深层逻辑，才能写出有深度的文章。',
    relatedTags: ['社会与民生', '经济与发展'],
    relatedDailyIds: ['d74', 'd80', 'd82', 'd63', 'd69', 'd70', 'd12', 'd11', 'd17', 'd15'],
    relatedQuoteIds: ['q24', 'q25', 'q5', 'q67'],
    color: 'from-emerald-500/10 to-teal-500/10',
  },
  {
    id: 'individual-freedom',
    name: '个体与自由',
    subtitle: '在规训中保持独立',
    description:
      '从阿伦特的"平庸之恶"到马尔库塞的"单向度的人"，从福柯的"规训"到项飙的"附近的消失"——个体如何在现代社会中保持独立思考和自由意志，是高考作文的核心议题。',
    relatedTags: ['哲学与思辨', '社会与民生'],
    relatedDailyIds: ['d73', 'd76', 'd77', 'd52', 'd53', 'd30', 'd18', 'd14', 'd39'],
    relatedQuoteIds: ['q12', 'q14', 'q49', 'q68', 'q78', 'q80'],
    color: 'from-rose-500/10 to-pink-500/10',
  },
  {
    id: 'literature-aesthetics',
    name: '文学与审美',
    subtitle: '在文字中感受世界',
    description:
      '文学是议论文的文采之源。从王勃到苏轼，从博尔赫斯到卡夫卡，名家名句不仅是素材，更是思维方式。学会用文学的眼光看世界，文章自然有了温度和深度。',
    relatedTags: ['文化与传承', '哲学与思辨'],
    relatedDailyIds: ['d32', 'd44', 'd46'],
    relatedQuoteIds: [
      'q3',
      'q6',
      'q34',
      'q23',
      'q51',
      'q52',
      'q53',
      'q54',
      'q56',
      'q60',
      'q62',
      'q64',
    ],
    color: 'from-violet-500/10 to-fuchsia-500/10',
  },
];
