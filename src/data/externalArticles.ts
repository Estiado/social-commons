/**
 * 外链时评文章库
 * 收录主流媒体的时事评论文章，仅保留元数据和原文链接
 * 点击文章直接跳转到原网站阅读，版权归原媒体所有
 * 用户可通过"提交链接"功能自主添加更多文章
 */

export interface ExternalArticle {
  id: string;
  title: string;
  author: string;
  source: string;
  published_at: string;
  excerpt: string;
  url: string;
  tags: string[];
  hot_topic: string; // 对应热点话题ID
  is_external: true;
}

export const EXTERNAL_ARTICLES: ExternalArticle[] = [
  // ===== AI与社会 =====
  {
    id: 'ext-001',
    title: '当AI遇上传统文化：替代or新生？',
    author: '洪声E评',
    source: '澎湃新闻',
    published_at: '2025-11-30',
    excerpt: '当人工智能的算法之光穿透千年文化的薄雾，一场关于未来与传统的对话正在开启。某博物馆用AI复原《兰亭集序》残缺字迹引发两极争议，AI能否真正理解《论语》的微言大义？',
    url: 'https://m.thepaper.cn/newsDetail_forward_32074979',
    tags: ['人工智能', '传统文化', 'AI', '文化创新'],
    hot_topic: 'ai-society',
    is_external: true,
  },
  {
    id: 'ext-002',
    title: '人工智能时代的媒体责任',
    author: '澎湃评论',
    source: '澎湃新闻',
    published_at: '2025-05-29',
    excerpt: 'AI已成为全球治理的重要课题。在此进程中，我们倡导对传统文化进行创造性转化与创新性发展，中华文明因其历史悠久且从未中断的特性，所蕴含的文明积淀与理性思考，应成为AI时代应对各类问题的智慧源泉。',
    url: 'https://m.thepaper.cn/newsDetail_forward_30898545',
    tags: ['人工智能', '媒体责任', '传统文化', 'AI治理'],
    hot_topic: 'ai-society',
    is_external: true,
  },
  {
    id: 'ext-003',
    title: '文科生被取代？理科生也快笑不出了',
    author: '新周刊',
    source: '新周刊',
    published_at: '2025-03-25',
    excerpt: '如果自我意识不过是人类的神经活动，那机器迟早也会拥有。如果连意识都不是独特的，面对机器更强大的学习能力和处理能力，人类该如何自视、如何自处？',
    url: 'http://news.qq.com/rain/a/20250325A02YDM00',
    tags: ['人工智能', '就业', '文科生', 'AI冲击'],
    hot_topic: 'ai-society',
    is_external: true,
  },
  {
    id: 'ext-004',
    title: 'AI，兵器与离骚',
    author: '秦朔朋友圈',
    source: '澎湃新闻',
    published_at: '2026-06-22',
    excerpt: '端午节假期过了。我们接着畅想一个比较深刻的AI话题。每到特定时节，大家照例煮粽子、看龙舟、念屈原。我们以为我们在纪念一位诗人，纪念一段冤屈。但其实，那本是人类最古老的一种"看天"。',
    url: 'https://m.thepaper.cn/newsDetail_forward_33425765',
    tags: ['人工智能', '传统文化', '端午节', '技术反思'],
    hot_topic: 'ai-society',
    is_external: true,
  },
  {
    id: 'ext-005',
    title: '人工智能时代的共同体生活：纪念阿伦特诞辰120周年',
    author: '澎湃思想市场',
    source: '澎湃新闻',
    published_at: '2026-10-14',
    excerpt: '与会学者通过文本重释与现象学分析，厘清了阿伦特对传统哲学认识论批判的脉络，深刻揭示了人工智能时代"他者消逝""主体性空心化"与"无世界性"危机的内在逻辑。',
    url: 'http://m.toutiao.com/group/7696357053039739427/',
    tags: ['人工智能', '阿伦特', '哲学', '共同体'],
    hot_topic: 'ai-society',
    is_external: true,
  },

  // ===== 文化传承与创新 =====
  {
    id: 'ext-006',
    title: '最前沿科技与最古老文明的碰撞：AI浪潮下，谁在重构文化生活？',
    author: '南方周末',
    source: '南方周末',
    published_at: '2025-05-28',
    excerpt: '"小戏剧集群诞生，演艺时代到来了。"技术奔涌向前，人们却越来越需要文化空间。近些年来，新兴演艺空间诞生，历史文化资源成为城市公共空间，演艺不再局限于舞台表演，而是成为连接文化、空间与人群的纽带。',
    url: 'https://news.qq.com/rain/a/20250528A09VZB00',
    tags: ['传统文化', '文化创新', 'AI', '演艺空间'],
    hot_topic: 'culture-renaissance',
    is_external: true,
  },
  {
    id: 'ext-007',
    title: '2025文化原创榜·年度关注｜挑战与新生',
    author: '南方周末',
    source: '南方周末',
    published_at: '2026-01-28',
    excerpt: '2025年5月，漓江文学奖颁奖礼上，90后作家刘楚昕追忆已故女友的演说被刷屏，他的小说《泥潭》三周内卖出40万册，许多购买者是首次买纯文学书。一段视频切片众人皆知，相比之下，小说本身却分外寂寞。',
    url: 'http://m.toutiao.com/group/7600303925643788843/',
    tags: ['文化', '文学', '原创', '短视频'],
    hot_topic: 'culture-renaissance',
    is_external: true,
  },
  {
    id: 'ext-008',
    title: '守绿水青山 促绿富同兴',
    author: '人民日报',
    source: '人民日报',
    published_at: '2025-08-15',
    excerpt: '20年来，浙江坚持一张蓝图绘到底，深入践行"两山"理念，协同推进经济高质量发展和生态环境高水平保护。浙江全省地区生产总值从2004年的1.15万亿元跃升到2024年的超9万亿元，走出了一条"生态美、经济强、百姓富"的高质量发展之路。',
    url: 'http://cpc.people.com.cn/n1/2025/0815/c64387-40542926.html',
    tags: ['生态文明', '绿水青山', '浙江', '高质量发展'],
    hot_topic: 'environment',
    is_external: true,
  },

  // ===== 青年与未来 =====
  {
    id: 'ext-009',
    title: '2025年轻人的情绪价值，在这些微小日常里！',
    author: '南都大数据研究院',
    source: '南方都市报',
    published_at: '2025-12-31',
    excerpt: '享受美食、安稳睡眠、品味咖啡奶茶、与朋友畅谈，成为年轻人收获情绪价值的常见方式。当希望分享喜悦、获得共鸣或应对压力时，情绪价值的支持显得尤为重要。',
    url: 'https://m.mp.oeeee.com/a/BAAFRD0000202512311502847.html',
    tags: ['青年', '情绪价值', 'Z世代', '心理健康'],
    hot_topic: 'youth-future',
    is_external: true,
  },
  {
    id: 'ext-010',
    title: '让青年与城市互相成就',
    author: '人民日报',
    source: '人民日报',
    published_at: '2024-06-21',
    excerpt: '为满足外地高校应届毕业生在当地求职期间的住宿需求，苏州将部分酒店、公寓改造为100余处"青年人才驿站"，学生只需在小程序上申请，即可获得最多14天免费住宿。帮助学生减轻求职期间的开销，彰显城市的发展温度。',
    url: 'http://paper.people.com.cn/rmrb/images/2024-06/21/05/rmrb2024062105.pdf',
    tags: ['青年', '城市', '就业', '人才'],
    hot_topic: 'youth-future',
    is_external: true,
  },
  {
    id: 'ext-011',
    title: '走出休学阴影：练习和解的父母与孩子',
    author: '南方周末',
    source: '南方周末',
    published_at: '2026-10-16',
    excerpt: '"休学的孩子越来越多。"据《半月谈》2025年7月报道，近年来，受学业压力过重、亲子关系紧张、青春期叛逆等因素交织影响，我国多地厌学、拒学青少年有增加趋势。',
    url: 'http://m.toutiao.com/group/7697249890459517459/',
    tags: ['青年', '教育', '心理健康', '休学'],
    hot_topic: 'youth-future',
    is_external: true,
  },
  {
    id: 'ext-012',
    title: '我看2025｜谭飞：人们更关注自身的遭遇与处境',
    author: '新周刊',
    source: '澎湃新闻',
    published_at: '2025-12-16',
    excerpt: '2025年走向尾声，又到了新周刊年度新锐榜即将发布的时刻。在这一年，我们更加关注"稳住的力量"，如何稳住脚步，稳住内心，稳住生活成了主旋律。',
    url: 'https://www.thepaper.cn/newsDetail_forward_32182077',
    tags: ['青年', '年度盘点', '稳住的力量', '社会心态'],
    hot_topic: 'youth-future',
    is_external: true,
  },

  // ===== 教育改革 =====
  {
    id: 'ext-013',
    title: '当辅导员住进学生宿舍楼',
    author: '南方周末',
    source: '南方周末',
    published_at: '2025-10-09',
    excerpt: '安庆师范大学"一站式"学生社区服务中心大厅正中，"回"字型的咨询台与许多地方的政务服务中心类似。一周五天，学生处、组织部、团委、教务处、研究生院等与学生工作有关的职能部门集中办公。',
    url: 'http://news.qq.com/rain/a/20251009A07HYM00',
    tags: ['教育', '大学', '辅导员', '育人模式'],
    hot_topic: 'education-reform',
    is_external: true,
  },
  {
    id: 'ext-014',
    title: '别让孩子掉进"伪阅读"陷阱',
    author: '三联生活周刊',
    source: '三联生活周刊',
    published_at: '2025-12-27',
    excerpt: '没有兴趣的驱动，所有的阅读都是伪阅读。"小猪是一个普普通通的孩子，但就爱读书。念高中时，她能站在书店里，把林贤治厚厚的《人间鲁迅》读完。她还给我推荐安兰德，和我讨论阿伦特。"',
    url: 'http://beta.lifeweek.com.cn/h5/article/detail.do?artId=258116',
    tags: ['教育', '阅读', '青少年', '伪阅读'],
    hot_topic: 'education-reform',
    is_external: true,
  },
  {
    id: 'ext-015',
    title: '大学里如何成人',
    author: '中国青年报',
    source: '中国青年报',
    published_at: '2024-01-08',
    excerpt: '本次系列报道对青年一代的关注，引发社会对大学生现状和培养模式的讨论、热议和反思。其中一篇报道改写的稿件《"高中化"的大学里，晚熟的大学生们》，在微信平台的阅读量为139万，转发量为84710。',
    url: 'https://pic.chinaxwcb.com/files/copy/25/05/12/1746973803630670_9.pdf',
    tags: ['教育', '大学', '成人', '晚熟'],
    hot_topic: 'education-reform',
    is_external: true,
  },

  // ===== 城市与生活 =====
  {
    id: 'ext-016',
    title: '打开城市的门，更要打开城市的心',
    author: '浙江宣传',
    source: '浙江宣传',
    published_at: '2025-12-08',
    excerpt: '浙江省委城市工作会议提出，要高水平建设现代化人民城市，走出有温度和质感的城市品质提升之路，让城市成为心生向往、情感归属、梦想成真的幸福之城。"此心安处是吾乡"，当城市的门越开越大，我们要思考怎样让它变得越来越暖。',
    url: 'http://zjnews.zjol.com.cn/zjxc/202512/t20251208_31386781.shtml',
    tags: ['城市', '温度', '人民城市', '浙江'],
    hot_topic: 'urban-life',
    is_external: true,
  },
  {
    id: 'ext-017',
    title: '谁是中国"第Z城"',
    author: '新周刊',
    source: '澎湃新闻',
    published_at: '2025-07-21',
    excerpt: '2005年，《新周刊》将重庆定义为"第N城"，探讨重庆的N种可能性。2024年，《新周刊》推出"第C城"，把目光投向那些占据C位的"C牌"城市。2025年，《新周刊》推出"第Z城"。',
    url: 'https://www.thepaper.cn/newsDetail_forward_31186503',
    tags: ['城市', '新周刊', '城市排名', 'Z世代'],
    hot_topic: 'urban-life',
    is_external: true,
  },

  // ===== 经济与发展 =====
  {
    id: 'ext-018',
    title: '追"新"还得读懂"两只鸟"',
    author: '浙江宣传',
    source: '浙江宣传',
    published_at: '2026-03-20',
    excerpt: '"腾笼换鸟"是发展新质生产力的路径和手段，而"凤凰涅槃"则是其目标和归宿，二者共同构成了一个有机整体。当前，各地发展新质生产力的热情高涨，这是好事。但热情之下，更需要保持冷静的头脑。',
    url: 'http://zjnews.zjol.com.cn/zjxc/202603/t20260320_31562070.shtml',
    tags: ['新质生产力', '经济发展', '腾笼换鸟', '浙江'],
    hot_topic: 'social-equity',
    is_external: true,
  },
  {
    id: 'ext-019',
    title: '我国就业形势总体稳定',
    author: '李克济',
    source: '人民日报',
    published_at: '2023-07-05',
    excerpt: '就业是最基本的民生，是经济发展的"晴雨表"、社会稳定的"压舱石"。我国经济持续恢复向好，对就业带动作用会不断增强，就业形势将在总体稳定基础上不断改善。',
    url: 'http://paper.people.com.cn/rmrb/images/2023-07/05/05/rmrb2023070505.pdf',
    tags: ['就业', '民生', '经济', '青年就业'],
    hot_topic: 'youth-future',
    is_external: true,
  },

  // ===== 科技伦理 =====
  {
    id: 'ext-020',
    title: '大量"为人工智能而人工智能"的产品引发讨论',
    author: '人民日报',
    source: '人民日报',
    published_at: '2026-01-29',
    excerpt: '在美国拉斯维加斯举办的2026国际消费电子展上，从操作繁琐的智能理发器，到标榜"人工智能温控"的微波炉，再到一些厂商推出的人工智能模块化手机，大量"为人工智能而人工智能"的产品引发讨论。',
    url: 'http://paper.people.com.cn/rmrb/pc/attachement/202601/29/e5a6d3af-453b-45b5-b14b-5d61e1a1a45f.pdf',
    tags: ['人工智能', '科技创新', '消费电子', '技术反思'],
    hot_topic: 'tech-ethics',
    is_external: true,
  },
  {
    id: 'ext-021',
    title: '最后的采访｜楼宇烈：现在我们社会最大的问题，是诚敬的缺失',
    author: '澎湃新闻',
    source: '澎湃新闻',
    published_at: '2026-10-16',
    excerpt: '"人最根本的是精神生活。"他说，如果人与人之间的感情全部变成金钱交易，人就已经被物质异化，丢掉了做人最核心的东西。面对当下的AI技术浪潮，楼宇烈说："AI时代，感悟、发自内心的真诚感受反而更加珍贵。"',
    url: 'http://m.toutiao.com/group/7697072392438383142/',
    tags: ['传统文化', '哲学', 'AI', '诚敬'],
    hot_topic: 'tech-ethics',
    is_external: true,
  },

  // ===== 数字生活 =====
  {
    id: 'ext-022',
    title: '短剧爆了，电影危了？',
    author: '新周刊',
    source: '腾讯新闻',
    published_at: '2025-01-05',
    excerpt: '最显著的一个趋势，即在2024年年底，由《好东西》是否是"小妞电影"引发的关于"老登电影"的讨论。首先，我很开心能看到这样的讨论，这代表我们正在用更新的视角，去重新解读曾经被奉上神坛的电影。',
    url: 'https://view.inews.qq.com/a/20250105A03MV200',
    tags: ['短视频', '电影', '短剧', '媒介变迁'],
    hot_topic: 'digital-life',
    is_external: true,
  },
  {
    id: 'ext-023',
    title: 'AI可以迅速搜索已知，但发现未知、抵达现场、作出判断终究要靠人',
    author: '谭江琦',
    source: '澎湃新闻',
    published_at: '2026-10-19',
    excerpt: '在今天的舆论场上，生产端，AI可以批量生产信息；传播端，商业平台坐拥海量用户，媒体人至少要放大三个方面的核心能力：一是求真，以专业调查和可信数据刻画真实世界。',
    url: 'http://m.toutiao.com/group/7698385782612050472/',
    tags: ['人工智能', '媒体', '新闻', 'AI冲击'],
    hot_topic: 'digital-life',
    is_external: true,
  },

  // ===== 家庭与代际 =====
  {
    id: 'ext-024',
    title: '友谊是一门必修课，越早学越好',
    author: '三联生活周刊',
    source: '三联生活周刊',
    published_at: '2026-09-17',
    excerpt: '当朋友的某个玩笑让你感到不舒服时，当你不小心泄露了朋友的秘密、不知道该如何挽回时，当你觉得一段旧日的友谊逐渐成为负担时……如果友谊是一门人生的必修课，那么，我们认为这门课越早学越好。',
    url: 'http://beta.lifeweek.com.cn/h5/article/detail.do?artId=236642',
    tags: ['青年', '友谊', '青春期', '人际关系'],
    hot_topic: 'family-relation',
    is_external: true,
  },
  {
    id: 'ext-025',
    title: '"消费型快乐"给多了，孩子会变成什么样？',
    author: '三联生活周刊',
    source: '三联生活周刊',
    published_at: '2026-04-16',
    excerpt: '三联做的《2026三联少年新闻思辨课》，正是一门将新闻与思辨结合起来，能更好地让孩子看见真实世界的多面性，让他们长出"更好的自我"的课程。',
    url: 'http://mpre.lifeweek.com.cn/h5/article/detail.do?artId=263990',
    tags: ['教育', '消费主义', '青少年', '思辨'],
    hot_topic: 'family-relation',
    is_external: true,
  },
];

// 按热点话题分组
export function getArticlesByHotTopic(topicId: string): ExternalArticle[] {
  return EXTERNAL_ARTICLES.filter((a) => a.hot_topic === topicId);
}

// 获取所有来源媒体
export function getAllSources(): string[] {
  return Array.from(new Set(EXTERNAL_ARTICLES.map((a) => a.source)));
}
