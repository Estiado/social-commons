import { EDITORIAL } from '../../../.artifacts/editorial/quotes/friendshipAndNature.ts';
import type { IQuote } from '../types';

const sourceRoot =
  'https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/chi-edu/recommended-passages/';

// Complete ancient works, with short summaries of the edition's published analysis.
// These are literary readings, not claims that their anecdotes are verified history.
const selections = [
  {
    id: 'q91',
    author: '佚名',
    work: '行行重行行',
    file: 'KS3_05',
    locator: '第2—3页',
    text: '行行重行行，与君生别离。\n相去万余里，各在天一涯。\n道路阻且长，会面安可知？\n胡马依北风，越鸟巢南枝。\n\n相去日已远，衣带日已缓。\n浮云蔽白日，游子不顾返。\n思君令人老，岁月忽已晚。\n弃捐勿复道，努力加餐饭！',
    analysis: EDITORIAL['selections.q91.analysis'],
  },
  {
    id: 'q92',
    author: '佚名',
    work: '迢迢牵牛星',
    file: 'KS3_05',
    locator: '第4—5页',
    text: '迢迢牵牛星，皎皎河汉女。\n纤纤擢素手，札札弄机杼。\n终日不成章，泣涕零如雨。\n河汉清且浅，相去复几许？\n盈盈一水间，脉脉不得语。',
    analysis: EDITORIAL['selections.q92.analysis'],
  },
  {
    id: 'q93',
    author: '刘义庆',
    work: '荀巨伯远看友人疾',
    file: 'KS3_07',
    locator: '第2—3页',
    text: '荀巨伯远看友人疾，值胡贼攻郡，友人语巨伯曰：“吾今死矣，子可去！”巨伯曰：“远来相视，子令吾去；败义以求生，岂荀巨伯所行邪？”\n\n贼既至，谓巨伯曰：“大军至，一郡尽空，汝何男子，而敢独止？”巨伯曰：“友人有疾，不忍委之，宁以我身代友人命。”贼相谓曰：“我辈无义之人，而入有义之国！”遂班军而还，一郡并获全。',
    analysis: EDITORIAL['selections.q93.analysis'],
  },
  {
    id: 'q94',
    author: '刘义庆',
    work: '管宁、华歆共园中锄菜',
    file: 'KS3_07',
    locator: '第4—5页',
    text: '管宁、华歆共园中锄菜，见地有片金，管挥锄与瓦石不异，华捉而掷去之。又尝同席读书，有乘轩冕过门者，宁读如故，歆废书出看。宁割席分坐曰：“子非吾友也。”',
    analysis: EDITORIAL['selections.q94.analysis'],
  },
  {
    id: 'q95',
    author: '白居易',
    work: '燕诗',
    file: 'KS3_11',
    locator: '第2—3页',
    text: '叟有爱子，背叟逃去，叟甚悲念之。叟少年时，亦尝如是。故作《燕诗》以谕之矣。\n\n梁上有双燕，翩翩雄与雌。\n衔泥两椽间，一巢生四儿。\n四儿日夜长，索食声孜孜。\n青虫不易捕，黄口无饱期。\n嘴爪虽欲敝，心力不知疲。\n须臾十来往，犹恐巢中饥。\n辛勤三十日，母瘦雏渐肥。\n喃喃教言语，一一刷毛衣。\n\n一旦羽翼成，引上庭树枝。\n举翅不回顾，随风四散飞。\n雌雄空中鸣，声尽呼不归。\n却入空巢里，啁啾终夜悲。\n燕燕尔勿悲，尔当反自思：\n思尔为雏日，高飞背母时。\n当时父母念，今日尔应知！',
    analysis: EDITORIAL['selections.q95.analysis'],
  },
  {
    id: 'q96',
    author: '白居易',
    work: '慈乌夜啼',
    file: 'KS3_11',
    locator: '第5—6页',
    text: '慈乌失其母，哑哑吐哀音。\n昼夜不飞去，经年守故林。\n夜夜夜半啼，闻者为沾襟。\n声中如告诉，未尽反哺心。\n百鸟岂无母？尔独哀怨深。\n应是母慈重，使尔悲不任。\n昔有吴起者，母殁丧不临。\n嗟哉斯徒辈，其心不如禽！\n慈乌复慈乌，鸟中之曾参。',
    analysis: EDITORIAL['selections.q96.analysis'],
  },
  {
    id: 'q97',
    author: '关汉卿',
    work: '四块玉·闲适（南亩耕）',
    file: 'KS4_18a',
    locator: '第2页',
    text: '南亩耕，东山卧。世态人情经历多。闲将往事思量过，贤的是他，愚的是我，争什么？',
    analysis: EDITORIAL['selections.q97.analysis'],
  },
  {
    id: 'q98',
    author: '白朴',
    work: '沉醉东风·渔父词',
    file: 'KS4_18b',
    locator: '第2页',
    text: '黄芦岸白蘋渡口，绿杨堤红蓼滩头。虽无刎颈交，却有忘机友。点秋江白鹭沙鸥。傲煞人间万户侯，不识字烟波钓叟。',
    analysis: EDITORIAL['selections.q98.analysis'],
  },
];

export const FRIENDSHIP_READINGS: Omit<IQuote, 'commentary'>[] = selections.map((item) => ({
  id: item.id,
  title: item.work,
  author: item.author,
  source: `《${item.work}》`,
  text: item.text,
  sourceUrl: `${sourceRoot}${item.file}.pdf`,
}));

export const FRIENDSHIP_COMMENTARIES: Record<
  string,
  NonNullable<IQuote['commentary']>
> = Object.fromEntries(
  selections.map((item) => [
    item.id,
    {
      text: item.analysis,
      commentator: '香港教育局编选资料',
      commentatorSource: `《建议篇章配套资料》〈${item.work}〉，赏析重点，${item.locator}`,
      status: 'verified',
      url: `${sourceRoot}${item.file}.pdf`,
      checkedAt: '2026-10-24',
    },
  ]),
);
