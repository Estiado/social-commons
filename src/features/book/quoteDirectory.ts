import type { BookEntry } from './chapters';

export type QuoteIndex = { region: string; period: string; author: string };
const CHINESE_PERIODS = [
  '先秦',
  '先秦两汉',
  '汉',
  '三国两晋南北朝',
  '唐',
  '五代十国',
  '宋',
  '元',
  '明',
  '清',
  '近现代',
];
const FOREIGN_PERIODS = ['18—19世纪', '19—20世纪之交', '20世纪及以后'];
// Editorial browsing periods, not precise composition dates. Attribution stays verbatim.
const authorsByPeriod: Record<string, string[]> = {
  先秦: ['《诗经》', '《左传》', '屈原', '荀子', '庄子及其后学', '孟子'],
  先秦两汉: ['《礼记》'],
  汉: ['司马迁'],
  三国两晋南北朝: ['诸葛亮', '李密', '陶渊明', '刘义庆', '北朝民歌'],
  唐: [
    '王勃',
    '张若虚',
    '李白',
    '杜甫',
    '白居易',
    '李商隐',
    '崔颢',
    '柳宗元',
    '刘长卿',
    '王之涣',
    '刘禹锡',
    '王维',
    '韩愈',
    '杜秋娘（传统署名，作者有异说）',
  ],
  五代十国: ['李煜'],
  宋: [
    '苏轼',
    '辛弃疾',
    '晏殊',
    '李清照',
    '周敦颐',
    '范仲淹',
    '苏洵',
    '欧阳修',
    '王安石',
    '秦观',
    '周邦彦',
    '蒋捷',
    '朱熹',
  ],
  元: ['马致远', '关汉卿', '白朴'],
  明: ['王阳明', '刘基', '杨慎', '于谦'],
  清: ['彭端淑', '刘蓉'],
  近现代: ['鲁迅', '木心', '沈从文', '史铁生', '王小波', '余华'],
  '18—19世纪': ['弗里德里希·荷尔德林', '弗里德里希·尼采', '列夫·托尔斯泰', '奥斯卡·王尔德'],
  '19—20世纪之交': [
    '萧伯纳',
    '马塞尔·普鲁斯特',
    '赖内·马利亚·里尔克',
    '弗朗茨·卡夫卡',
    '斯蒂芬·茨威格',
  ],
  '20世纪及以后': [
    '豪尔赫·路易斯·博尔赫斯',
    '阿尔贝·加缪',
    '安妮·塞克斯顿',
    '莱昂纳德·科恩',
    '维克多·弗兰克尔',
    '马丁·海德格尔',
    '路德维希·维特根斯坦',
    '埃莱娜·费兰特',
  ],
};
const profiles = new Map<string, QuoteIndex>();
Object.entries(authorsByPeriod).forEach(([period, authors]) => {
  authors.forEach((author) =>
    profiles.set(author, {
      region: CHINESE_PERIODS.includes(period) ? '中国' : '外国',
      period,
      author,
    }),
  );
});
profiles.set('里尔克', profiles.get('赖内·马利亚·里尔克')!);

export function quoteIndexFor(author: string, work = ''): QuoteIndex {
  if (author === '佚名' && /行行重行行|迢迢牵牛星/.test(work))
    return { region: '中国', period: '汉', author };
  return profiles.get(author) || { region: '待考', period: '待考', author };
}

const label = (key: string) => (key === '中国' ? '中国文学' : key === '外国' ? '外国文学' : key);
export function quoteDirectory(entries: BookEntry[], category: string) {
  // Preserve existing ?category=作者 links while issuing structured paths for new navigation.
  const legacy =
    category && !category.includes('/') && !['中国', '外国', '待考', '~all'].includes(category)
      ? profiles.get(category) ||
        entries.find((entry) => entry.groups.includes(category))?.quoteIndex
      : undefined;
  const path = legacy
    ? [legacy.region, legacy.period, legacy.author]
    : category === '~all'
      ? []
      : category.split('/').filter(Boolean);
  const key = path.join('/');
  const matches = entries.filter((entry) => {
    const index = entry.quoteIndex;
    return index && path.every((part, i) => [index.region, index.period, index.author][i] === part);
  });
  const works = category === '~all' || path.length >= 3;
  const counts = new Map<string, number>();
  if (!works)
    matches.forEach((entry) => {
      const index = entry.quoteIndex!;
      const name = [index.region, index.period, index.author][path.length];
      counts.set(name, (counts.get(name) || 0) + 1);
    });
  const order =
    path.length === 0
      ? ['中国', '外国', '待考']
      : path[0] === '中国'
        ? CHINESE_PERIODS
        : FOREIGN_PERIODS;
  const facets = [...counts]
    .sort(([a], [b]) =>
      path.length < 2
        ? (order.indexOf(a) < 0 ? 999 : order.indexOf(a)) -
          (order.indexOf(b) < 0 ? 999 : order.indexOf(b))
        : a.localeCompare(b, 'zh-Hans-CN-u-co-pinyin'),
    )
    .map(([name, count]) => ({
      name: label(name),
      key: [...path, name].join('/'),
      count,
    }));
  return {
    key: category === '~all' ? '~all' : key,
    matches,
    facets,
    works,
    title: category === '~all' ? '全部篇目' : label(path.at(-1) || '中外文学'),
    unit:
      path.length === 0
        ? '分卷'
        : path.length === 1
          ? path[0] === '中国'
            ? '朝代／时期'
            : '时期'
          : '作者／典籍',
    parent: path.slice(0, -1).join('/'),
    ancestors: path.length
      ? [
          { key: '', name: '中外文学' },
          ...path
            .slice(0, -1)
            .map((part, i) => ({ key: path.slice(0, i + 1).join('/'), name: label(part) })),
        ]
      : category === '~all'
        ? [{ key: '', name: '中外文学' }]
        : [],
  };
}
