export interface CuratedCommentary {
  id: string; title: string; url: string; source: string; author: string;
  publishedAt: string; checkedAt: string; recommendation: string;
  verificationUrl?: string;
  writingTags: string[]; generalTags: string[];
}

// Public metadata only. Recommendations and teaching tags are editorial notes,
// not quotations attributed to the publisher. Full text belongs to its importer.
export const CURATED_COMMENTARIES: CuratedCommentary[] = [
  { id: 'southern-343016', title: '对奇葩投诉说“不”', url: 'https://www.infzm.com/contents/343016', source: '南方周末', author: '辛省志', publishedAt: '2026-10-20', checkedAt: '2026-10-21', recommendation: '以公共服务热线为场景，讨论诉求表达、合理边界与公共资源分配之间的关系。', writingTags: ['权利与责任', '边界分析'], generalTags: ['公共服务', '基层治理'] },
  { id: 'southern-342972', title: '经济学首先要解释市场，而不是设计经济政策', url: 'https://www.infzm.com/contents/342972', source: '南方周末', author: '张是之', publishedAt: '2026-10-20', checkedAt: '2026-10-21', recommendation: '适合大学通识讨论：学科解释、模型假设与政策建议之间应如何建立联系。', writingTags: ['审慎论证', '适用边界'], generalTags: ['经济学方法', '模型与现实'] },
  { id: 'weekly-ai-20261013', title: '“AI挂在嘴边，实际一事无成”，年轻人正在被“AI登”逼疯', url: 'https://mp.weixin.qq.com/s?__biz=MjM5ODMzMDMyMw%3D%3D&mid=2654914202&idx=1&sn=4ac03e2b3e7a09f0919f9557afb944f6', verificationUrl: 'https://www.huxiu.com/article/4896987.html', source: '新周刊', author: '嗡嗡', publishedAt: '2026-10-13', checkedAt: '2026-10-21', recommendation: '以职场中的 AI 形式主义为切口，练习用实际效果检验技术叙事，并对文中引用的数据另作核验。', writingTags: ['独立思考', '现象分析'], generalTags: ['人工智能', '技术与组织'] },
  { id: 'people-30186885', title: '以标准建设护航前沿科创（人民时评）', url: 'https://paper.people.com.cn/rmrb/pc/content/202610/21/content_30186885.html', source: '人民日报', author: '李铭轩', publishedAt: '2026-10-21', checkedAt: '2026-10-21', recommendation: '从前沿科技的标准制定切入，练习分析创新速度与规则更新之间的关系。', writingTags: ['科技创新', '辩证分析'], generalTags: ['科技伦理', '公共治理'] },
  { id: 'people-30186881', title: '被“逼到墙角”，就向新起跑（现场评论）', url: 'https://paper.people.com.cn/rmrb/pc/content/202610/21/content_30186881.html', source: '人民日报', author: '彭飞', publishedAt: '2026-10-21', checkedAt: '2026-10-21', recommendation: '以资源型城市转型为案例，讨论发展路径如何受到旧优势的影响。', writingTags: ['主动求变', '案例论证'], generalTags: ['区域发展', '绿色转型'] },
  { id: 'people-40817915', title: '人民锐评：公共场所不等于“同意直播场所”', url: 'https://opinion.people.com.cn/n1/2026/1020/c436867-40817915.html', source: '人民网', author: '金台岩', publishedAt: '2026-10-20', checkedAt: '2026-10-21', recommendation: '适合练习概念辨析：公共空间中的活动，与同意商业传播之间有哪些区别。', writingTags: ['权利边界', '概念辨析'], generalTags: ['数字生活', '隐私保护'] },
  { id: 'zhejiang-31975796', title: '评论区不能成为“伤人区”', url: 'https://zjnews.zjol.com.cn/zjxc/202610/t20261020_31975796.shtml', source: '浙江宣传', author: '嘉轩', publishedAt: '2026-10-19', checkedAt: '2026-10-21', recommendation: '围绕网络评论中的事实、情绪与责任展开讨论，练习区分合理批评和群体围攻。', writingTags: ['理性表达', '递进论证'], generalTags: ['媒介素养', '平台责任'] },
  { id: 'zhejiang-31973205', title: '电影新力量在改变什么', url: 'https://zjnews.zjol.com.cn/zjxc/202610/t20261018_31973205.shtml', source: '浙江宣传', author: '之江轩', publishedAt: '2026-10-18', checkedAt: '2026-10-21', recommendation: '结合青年电影创作与新技术，讨论人才成长需要怎样的机会和协作环境。', writingTags: ['青年成长', '文化创新'], generalTags: ['文化产业', '技术与艺术'] },
  { id: 'paper-34263640', title: '【社论】守护银龄群体的劳动权益与钱袋子', url: 'https://www.thepaper.cn/newsDetail_forward_34263640', source: '澎湃新闻', author: '澎湃新闻社论', publishedAt: '2026-10-16', checkedAt: '2026-10-21', recommendation: '从具体生活场景理解老龄化议题，练习把宏观关怀落实为可讨论的问题。', writingTags: ['社会关怀', '由点及面'], generalTags: ['人口老龄化', '劳动与消费'] },
  { id: 'paper-34256488', title: '【社论】AI安全使用边界，是该厘清了', url: 'https://www.thepaper.cn/newsDetail_forward_34256488', source: '澎湃新闻', author: '澎湃新闻社论', publishedAt: '2026-10-15', checkedAt: '2026-10-21', recommendation: '结合 AI 辅助办公案例，比较效率收益、信息保护与组织规则各自的责任。', writingTags: ['科技与责任', '多方分析'], generalTags: ['人工智能', '数据治理'] },
  { id: 'paper-34235965', title: '【社论】把食品安全“严”的基调贯彻到底', url: 'https://www.thepaper.cn/newsDetail_forward_34235965', source: '澎湃新闻', author: '澎湃新闻社论', publishedAt: '2026-10-12', checkedAt: '2026-10-21', recommendation: '适合讨论个案处置如何连接日常监管，以及公共安全为何需要持续落实。', writingTags: ['底线意识', '问题分析'], generalTags: ['食品安全', '公共治理'] },
  { id: 'paper-34218425', title: '【社论】这8400万劳动者的权益，将更有保障', url: 'https://www.thepaper.cn/newsDetail_forward_34218425', source: '澎湃新闻', author: '澎湃新闻社论', publishedAt: '2026-10-09', checkedAt: '2026-10-21', recommendation: '从平台劳动议题理解技术效率与人的处境，练习识别报道中征求意见稿的阶段性。', writingTags: ['以人为本', '条件意识'], generalTags: ['平台经济', '算法管理'] },
  { id: 'zhejiang-31953206', title: '观众看剧为何“啃老”', url: 'https://zjnews.zjol.com.cn/zjxc/202610/t20261008_31953206.shtml', source: '浙江宣传', author: '', publishedAt: '2026-10-08', checkedAt: '2026-10-21', recommendation: '以老剧再次走红为入口，讨论经典、流量和二次创作，练习多角度解释文化现象。', writingTags: ['文化传承', '多角度分析'], generalTags: ['大众文化', '内容品质'] },
];

export function recentCommentaries(articles: CuratedCommentary[], now = Date.now(), days = 30): CuratedCommentary[] {
  const oldest = now - days * 86_400_000;
  return articles.filter((article) => {
    const published = Date.parse(`${article.publishedAt}T00:00:00+08:00`);
    return published >= oldest && published <= now;
  }).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 50);
}
