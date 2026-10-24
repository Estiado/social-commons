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
    analysis:
      '赏析沿空间与时间两条线索解读离别：万里长路使重逢无期，衣带渐宽把相思化为身体变化。叠字与直接向“君”诉说的口吻，使朴素语言具有回环的声情；结尾转为珍重身体、等待相见，并未轻易消解前面的离愁。',
  },
  {
    id: 'q92',
    author: '佚名',
    work: '迢迢牵牛星',
    file: 'KS3_05',
    locator: '第4—5页',
    text: '迢迢牵牛星，皎皎河汉女。\n纤纤擢素手，札札弄机杼。\n终日不成章，泣涕零如雨。\n河汉清且浅，相去复几许？\n盈盈一水间，脉脉不得语。',
    analysis:
      '赏析指出，诗把天上的星辰写成有动作与情感的人间夫妇。织布的忙碌与终日不成章形成悬念，末尾的隔水相望才点明思念的缘故。迢迢、纤纤、札札等叠字分别写距离、形态和声响，共同营造可望而不可即的情境。',
  },
  {
    id: 'q93',
    author: '刘义庆',
    work: '荀巨伯远看友人疾',
    file: 'KS3_07',
    locator: '第2—3页',
    text: '荀巨伯远看友人疾，值胡贼攻郡，友人语巨伯曰：“吾今死矣，子可去！”巨伯曰：“远来相视，子令吾去；败义以求生，岂荀巨伯所行邪？”\n\n贼既至，谓巨伯曰：“大军至，一郡尽空，汝何男子，而敢独止？”巨伯曰：“友人有疾，不忍委之，宁以我身代友人命。”贼相谓曰：“我辈无义之人，而入有义之国！”遂班军而还，一郡并获全。',
    analysis:
      '赏析着重说明短篇如何依靠对话推进情节：劝离、拒绝、质问与回答，使处境逐步紧张，再以出人意料的退兵收束。友人不忍相累与荀巨伯不忍相弃相互映照；人物的情义从行动和语言中显现，而非由长篇议论说明。',
  },
  {
    id: 'q94',
    author: '刘义庆',
    work: '管宁、华歆共园中锄菜',
    file: 'KS3_07',
    locator: '第4—5页',
    text: '管宁、华歆共园中锄菜，见地有片金，管挥锄与瓦石不异，华捉而掷去之。又尝同席读书，有乘轩冕过门者，宁读如故，歆废书出看。宁割席分坐曰：“子非吾友也。”',
    analysis:
      '赏析把拾金与观车看作并列的两件轶事：相似处境中的不同动作，显出人物志趣的差别。作品很少使用形容词，也不直接进入人物内心，而以白描和突然而止的结尾留下余味。理解“割席”，需要连读前面两次对照。',
  },
  {
    id: 'q95',
    author: '白居易',
    work: '燕诗',
    file: 'KS3_11',
    locator: '第2—3页',
    text: '叟有爱子，背叟逃去，叟甚悲念之。叟少年时，亦尝如是。故作《燕诗》以谕之矣。\n\n梁上有双燕，翩翩雄与雌。\n衔泥两椽间，一巢生四儿。\n四儿日夜长，索食声孜孜。\n青虫不易捕，黄口无饱期。\n嘴爪虽欲敝，心力不知疲。\n须臾十来往，犹恐巢中饥。\n辛勤三十日，母瘦雏渐肥。\n喃喃教言语，一一刷毛衣。\n\n一旦羽翼成，引上庭树枝。\n举翅不回顾，随风四散飞。\n雌雄空中鸣，声尽呼不归。\n却入空巢里，啁啾终夜悲。\n燕燕尔勿悲，尔当反自思：\n思尔为雏日，高飞背母时。\n当时父母念，今日尔应知！',
    analysis:
      '赏析将筑巢、哺育、学飞与离去的片段连读，指出母瘦雏肥、刷毛衣等细节把亲情写得可见可感。温馨与空巢悲鸣形成转折，最后从叙事转向反思，回应小序中的老人经历。叠词与浅白语言，让劝谕建立在完整故事之中。',
  },
  {
    id: 'q96',
    author: '白居易',
    work: '慈乌夜啼',
    file: 'KS3_11',
    locator: '第5—6页',
    text: '慈乌失其母，哑哑吐哀音。\n昼夜不飞去，经年守故林。\n夜夜夜半啼，闻者为沾襟。\n声中如告诉，未尽反哺心。\n百鸟岂无母？尔独哀怨深。\n应是母慈重，使尔悲不任。\n昔有吴起者，母殁丧不临。\n嗟哉斯徒辈，其心不如禽！\n慈乌复慈乌，鸟中之曾参。',
    analysis:
      '赏析从悼母与托物寄意理解全诗：守故林、夜半啼反复呈现哀伤，由鸟的形象转向人的情感，再借吴起、曾参的典故形成映照。作品中的慈乌和反哺属于传统文学意象，应放在诗歌的抒情与伦理表达中理解。',
  },
  {
    id: 'q97',
    author: '关汉卿',
    work: '四块玉·闲适（南亩耕）',
    file: 'KS4_18a',
    locator: '第2页',
    text: '南亩耕，东山卧。世态人情经历多。闲将往事思量过，贤的是他，愚的是我，争什么？',
    analysis:
      '赏析由陶潜、谢安的典故进入曲中的退隐心绪，再说明后半段如何转为阅世后的反省。口语与衬字使语气从容自然，贤与愚的自我调侃也带有看淡争竞的意味。短曲的声情，需要在前后转折中体会。',
  },
  {
    id: 'q98',
    author: '白朴',
    work: '沉醉东风·渔父词',
    file: 'KS4_18b',
    locator: '第2页',
    text: '黄芦岸白蘋渡口，绿杨堤红蓼滩头。虽无刎颈交，却有忘机友。点秋江白鹭沙鸥。傲煞人间万户侯，不识字烟波钓叟。',
    analysis:
      '赏析从黄、白、绿、红的色彩与对偶景物，说明开篇如何铺成江岸秋景。“点”字让白鹭沙鸥进入静景，忘机友则把自然与人的心境相连。曲末才正面点出钓叟，前面的环境和交游已先勾勒出其不慕名利的形象。',
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
