import type { CuratedCommentary } from '@/data/curatedCommentaries';

const rules: [string, RegExp][] = [
  ['tech-ai', /人工智能|\bAI\b|算法|科技|科创|机器人|智能车/i],
  ['society-fairness', /公平|劳动|权益|养老|银龄|食品安全|公共服务|基层治理|投诉|监管/],
  ['culture-heritage', /文化|传承|电影|老剧|博物馆|非遗|文旅/],
  ['education-growth', /教育|学校|校园|学生|高校|开学|教师/],
  ['youth-responsibility', /青年|年轻人|青春|成长|就业|毕业/],
  ['economy-development', /经济|市场|产业|消费|就业|投资|发展|营商/],
  ['ecology-future', /生态|环境保护|绿色|气候|低碳|污染/],
  ['international-global', /国际|全球|世界|文明交流|战争|外交|和平/],
  ['history-memory', /历史|记忆|纪念|抗战|先烈/],
  ['individual-freedom', /独立思考|个人选择|个体|主体性|形式主义/],
  ['philosophy-thinking', /哲学|辩证|思辨|模型假设|认识论/],
  ['literature-aesthetics', /文学|审美|诗歌|诗意|阅读|读书/],
];
export function commentaryTopics(article: CuratedCommentary) {
  if (article.topicIds?.length) return article.topicIds;
  const text = [article.title, ...article.writingTags, ...article.generalTags].join(' ');
  const ids = rules.filter(([, pattern]) => pattern.test(text)).map(([id]) => id);
  return ids.length ? ids : ['other'];
}
