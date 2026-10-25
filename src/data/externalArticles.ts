import { EDITORIAL } from '../../.artifacts/editorial/externalArticles.ts';
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
    excerpt: EDITORIAL['EXTERNAL_ARTICLES.ext-001.excerpt'],
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
    excerpt: EDITORIAL['EXTERNAL_ARTICLES.ext-002.excerpt'],
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
    excerpt: EDITORIAL['EXTERNAL_ARTICLES.ext-003.excerpt'],
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
    excerpt: EDITORIAL['EXTERNAL_ARTICLES.ext-004.excerpt'],
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
    excerpt: EDITORIAL['EXTERNAL_ARTICLES.ext-005.excerpt'],
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
    excerpt: EDITORIAL['EXTERNAL_ARTICLES.ext-006.excerpt'],
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
    excerpt: EDITORIAL['EXTERNAL_ARTICLES.ext-007.excerpt'],
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
    excerpt: EDITORIAL['EXTERNAL_ARTICLES.ext-008.excerpt'],
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
    excerpt: EDITORIAL['EXTERNAL_ARTICLES.ext-009.excerpt'],
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
    excerpt: EDITORIAL['EXTERNAL_ARTICLES.ext-010.excerpt'],
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
    excerpt: EDITORIAL['EXTERNAL_ARTICLES.ext-011.excerpt'],
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
    excerpt: EDITORIAL['EXTERNAL_ARTICLES.ext-012.excerpt'],
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
    excerpt: EDITORIAL['EXTERNAL_ARTICLES.ext-013.excerpt'],
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
    excerpt: EDITORIAL['EXTERNAL_ARTICLES.ext-014.excerpt'],
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
    excerpt: EDITORIAL['EXTERNAL_ARTICLES.ext-015.excerpt'],
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
    excerpt: EDITORIAL['EXTERNAL_ARTICLES.ext-016.excerpt'],
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
    excerpt: EDITORIAL['EXTERNAL_ARTICLES.ext-017.excerpt'],
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
    excerpt: EDITORIAL['EXTERNAL_ARTICLES.ext-018.excerpt'],
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
    excerpt: EDITORIAL['EXTERNAL_ARTICLES.ext-019.excerpt'],
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
    excerpt: EDITORIAL['EXTERNAL_ARTICLES.ext-020.excerpt'],
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
    excerpt: EDITORIAL['EXTERNAL_ARTICLES.ext-021.excerpt'],
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
    excerpt: EDITORIAL['EXTERNAL_ARTICLES.ext-022.excerpt'],
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
    excerpt: EDITORIAL['EXTERNAL_ARTICLES.ext-023.excerpt'],
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
    excerpt: EDITORIAL['EXTERNAL_ARTICLES.ext-024.excerpt'],
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
    excerpt: EDITORIAL['EXTERNAL_ARTICLES.ext-025.excerpt'],
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
