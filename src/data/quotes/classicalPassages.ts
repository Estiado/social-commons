import type { IQuote } from '../types';

const edb =
  'https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/chi-edu/recommended-passages/';

// Public-domain texts use simplified characters and modern punctuation.
// Each excerpt is labelled; commentary lives in the separate source ledger.
export const CLASSICAL_PASSAGES: Omit<IQuote, 'commentary'>[] = [
  {
    id: 'q51',
    author: '崔颢',
    source: '《长干行》二首',
    text: '君家何处住，妾住在横塘。\n停船暂借问，或恐是同乡。\n\n家临九江水，来去九江侧。\n同是长干人，生小不相识。',
    sourceUrl: 'https://www.chinawriter.com.cn/n1/2019/0114/c405074-30535628.html',
    context: '两首诗一问一答，写出江上相逢时从试探到认出同乡的语气变化。',
  },
  {
    id: 'q52',
    author: '白居易',
    source: '《问刘十九》',
    text: '绿蚁新醅酒，红泥小火炉。\n晚来天欲雪，能饮一杯无？',
    sourceUrl: 'https://www.chinawriter.com.cn/wxpl/2014/2014-07-03/209839.html',
  },
  {
    id: 'q53',
    author: '柳宗元',
    source: '《江雪》',
    text: '千山鸟飞绝，万径人踪灭。\n孤舟蓑笠翁，独钓寒江雪。',
    sourceUrl: 'https://www.chinawriter.com.cn/n1/2022/0210/c404018-32349000.html',
  },
  {
    id: 'q54',
    author: '刘长卿',
    source: '《逢雪宿芙蓉山主人》',
    text: '日暮苍山远，天寒白屋贫。\n柴门闻犬吠，风雪夜归人。',
    sourceUrl: 'https://www.chinawriter.com.cn/n1/2022/0210/c404018-32349000.html',
  },
  {
    id: 'q55',
    author: '《诗经》',
    source: '《小雅·采薇》末章',
    text: '昔我往矣，杨柳依依。今我来思，雨雪霏霏。\n行道迟迟，载渴载饥。我心伤悲，莫知我哀！',
    sourceUrl: 'https://ctext.org/book-of-poetry/cai-wei/zh',
    context: '节选末章，保留景物、归途与抒情的连续关系，不将全诗简化为一幅春日画面。',
  },
  {
    id: 'q56',
    author: '杜甫',
    source: '《客至》',
    text: '舍南舍北皆春水，但见群鸥日日来。\n花径不曾缘客扫，蓬门今始为君开。\n盘飧市远无兼味，樽酒家贫只旧醅。\n肯与邻翁相对饮，隔篱呼取尽余杯。',
    sourceUrl: 'https://www.chinawriter.com.cn/n1/2019/0114/c405074-30535628.html',
  },
  {
    id: 'q57',
    author: '王之涣',
    source: '《登鹳雀楼》',
    text: '白日依山尽，黄河入海流。\n欲穷千里目，更上一层楼。',
    sourceUrl: 'https://www.chinawriter.com.cn/n1/2026/0319/c403994-40684588.html',
  },
  {
    id: 'q58',
    author: '周敦颐',
    source: '《爱莲说》',
    text: '水陆草木之花，可爱者甚蕃。晋陶渊明独爱菊。自李唐来，世人甚爱牡丹。予独爱莲之出淤泥而不染，濯清涟而不妖，中通外直，不蔓不枝，香远益清，亭亭净植，可远观而不可亵玩焉。\n\n予谓菊，花之隐逸者也；牡丹，花之富贵者也；莲，花之君子者也。噫！菊之爱，陶后鲜有闻。莲之爱，同予者何人？牡丹之爱，宜乎众矣！',
    sourceUrl: `${edb}KS3_15.pdf`,
  },
  {
    id: 'q59',
    author: '刘禹锡',
    source: '《陋室铭》',
    text: '山不在高，有仙则名。水不在深，有龙则灵。斯是陋室，惟吾德馨。苔痕上阶绿，草色入帘青。谈笑有鸿儒，往来无白丁。可以调素琴，阅金经。无丝竹之乱耳，无案牍之劳形。南阳诸葛庐，西蜀子云亭。孔子云：何陋之有？',
    sourceUrl: `${edb}KS3_12.pdf`,
  },
  {
    id: 'q60',
    author: '王维',
    source: '《山居秋暝》',
    text: '空山新雨后，天气晚来秋。\n明月松间照，清泉石上流。\n竹喧归浣女，莲动下渔舟。\n随意春芳歇，王孙自可留。',
    sourceUrl: `${edb}KS4_16a.pdf`,
  },
  {
    id: 'q61',
    author: '王勃',
    source: '《送杜少府之任蜀州》',
    text: '城阙辅三秦，风烟望五津。\n与君离别意，同是宦游人。\n海内存知己，天涯若比邻。\n无为在歧路，儿女共沾巾。',
    sourceUrl: `${edb}KS3_09.pdf`,
  },
  {
    id: 'q62',
    author: '苏轼',
    source: '《水调歌头·明月几时有》',
    text: '明月几时有？把酒问青天。\n不知天上宫阙，今夕是何年。\n我欲乘风归去，又恐琼楼玉宇，高处不胜寒。\n起舞弄清影，何似在人间。\n\n转朱阁，低绮户，照无眠。\n不应有恨，何事长向别时圆？\n人有悲欢离合，月有阴晴圆缺，此事古难全。\n但愿人长久，千里共婵娟。',
    sourceUrl: `${edb}KS3_17.pdf`,
    context: '原词小序记丙辰中秋，并点明“兼怀子由”。这里展示词的完整上下片。',
  },
  {
    id: 'q63',
    author: '李煜',
    source: '《虞美人·春花秋月何时了》',
    text: '春花秋月何时了？往事知多少。\n小楼昨夜又东风，故国不堪回首月明中。\n\n雕栏玉砌应犹在，只是朱颜改。\n问君能有几多愁？恰似一江春水向东流。',
    sourceUrl: `${edb}KS3_13.pdf`,
  },
  {
    id: 'q64',
    author: '马致远',
    source: '《天净沙·秋思》',
    text: '枯藤老树昏鸦，小桥流水人家，古道西风瘦马。\n夕阳西下，断肠人在天涯。',
    sourceUrl: `${edb}KS3_19.pdf`,
  },
  {
    id: 'q65',
    author: '荀子',
    source: '《劝学》节选',
    text: '积土成山，风雨兴焉；积水成渊，蛟龙生焉；积善成德，而神明自得，圣心备焉。\n\n故不积跬步，无以至千里；不积小流，无以成江海。骐骥一跃，不能十步；驽马十驾，功在不舍。锲而舍之，朽木不折；锲而不舍，金石可镂。',
    sourceUrl: `${edb}KS4_06.pdf`,
    context:
      '连续节选同一段的前半部分。后文还以蚯蚓与蟹比较专一和浮躁，全文并非只有“坚持”一个论点。',
  },
  {
    id: 'q66',
    author: '韩愈',
    source: '《师说》节选',
    text: '圣人无常师。孔子师郯子、苌弘、师襄、老聃。郯子之徒，其贤不及孔子。孔子曰：三人行，则必有我师。\n\n是故弟子不必不如师，师不必贤于弟子。闻道有先后，术业有专攻，如是而已。',
    sourceUrl: `${edb}KS4_12.pdf`,
    context: '节选第三段。这里的“不必”应按古义理解，不应读成现代口语中的“不需要”。',
  },
  {
    id: 'q67',
    author: '《礼记》',
    source: '《礼运》“大道之行也”章',
    text: '大道之行也，天下为公，选贤与能，讲信修睦。故人不独亲其亲，不独子其子，使老有所终，壮有所用，幼有所长，矜寡孤独废疾者皆有所养，男有分，女有归。\n\n货恶其弃于地也，不必藏于己；力恶其不出于身也，不必为己。是故谋闭而不兴，盗窃乱贼而不作，故外户而不闭，是谓大同。',
    sourceUrl: `${edb}KS3_02.pdf`,
    context:
      '节选“大同”部分；原文随后还讨论“小康”。历史文本中的角色和性别安排需放回其时代，不能直接当作今日制度方案。',
  },
  {
    id: 'q68',
    author: '陶渊明',
    source: '《归去来兮辞》节选',
    text: '归去来兮，田园将芜胡不归？既自以心为形役，奚惆怅而独悲？悟已往之不谏，知来者之可追。实迷途其未远，觉今是而昨非。\n\n舟遥遥以轻飏，风飘飘而吹衣。问征夫以前路，恨晨光之熹微。',
    sourceUrl: 'https://www.gdep.edu.cn/mksxy/info/1081/2687.htm',
    context: '节选辞的开篇。阅读辞前小序，可以补充家计、出仕与辞官的具体处境。',
  },
  {
    id: 'q69',
    author: '范仲淹',
    source: '《岳阳楼记》末段',
    text: '嗟夫！予尝求古仁人之心，或异二者之为，何哉？不以物喜，不以己悲；居庙堂之高则忧其民；处江湖之远则忧其君。\n\n是进亦忧，退亦忧。然则何时而乐耶？其必曰：先天下之忧而忧，后天下之乐而乐乎！噫！微斯人，吾谁与归？',
    sourceUrl: `${edb}KS4_14.pdf`,
  },
  {
    id: 'q70',
    author: '庄子及其后学',
    source: '《庄子·逍遥游》节选',
    text: '惠子谓庄子曰：吾有大树，人谓之樗。其大本拥肿而不中绳墨，其小枝卷曲而不中规矩，立之涂，匠者不顾。今子之言，大而无用，众所同去也。\n\n庄子曰：子独不见狸狌乎？卑身而伏，以候敖者；东西跳梁，不辟高下；中于机辟，死于罔罟。今夫斄牛，其大若垂天之云。此能为大矣，而不能执鼠。\n\n今子有大树，患其无用，何不树之于无何有之乡，广莫之野，彷徨乎无为其侧，逍遥乎寝卧其下。不夭斤斧，物无害者，无所可用，安所困苦哉！',
    sourceUrl: `${edb}KS4_05.pdf`,
    context: '保留惠子质疑与庄子回应的完整一轮论辩。“无用”在不同评价尺度中的含义，需要连着读。',
  },
];
