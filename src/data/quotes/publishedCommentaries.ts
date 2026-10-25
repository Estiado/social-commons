import { EDITORIAL } from '../../../.artifacts/editorial/quotes/publishedCommentaries.ts';
import type { IQuote } from '../types';

type Commentary = NonNullable<IQuote['commentary']>;
const edb =
  'https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/chi-edu/recommended-passages/';
function educationNote(text: string, work: string, file: string): Commentary {
  return {
    text,
    commentator: '香港教育局编选资料（未单列撰稿者）',
    commentatorSource: `《建议篇章配套资料》〈${work}〉，“赏析重点”`,
    status: 'verified',
    url: `${edb}${file}.pdf`,
    checkedAt: '2026-10-22',
  };
}
function published(
  text: string,
  commentator: string,
  commentatorSource: string,
  url: string,
): Commentary {
  return { text, commentator, commentatorSource, url, status: 'verified', checkedAt: '2026-10-22' };
}

// A source must discuss the displayed work, not merely introduce its author.
// These are attributed paraphrases; nobody's words are reconstructed as quotes.
export const PUBLISHED_COMMENTARIES: Record<string, Commentary> = {
  q11: published(
    EDITORIAL['PUBLISHED_COMMENTARIES.q11.arg0'],
    '虞金星',
    '《文学，扎根群众才更有力量》，人民日报，2026-09-15，第5版',
    'https://opinion.people.com.cn/n1/2026/0915/c461529-40798667.html',
  ),
  q23: published(
    EDITORIAL['PUBLISHED_COMMENTARIES.q23.arg0'],
    '崔健、唐瑜珮（编导访谈）',
    '上海国际舞蹈中心剧场：《委约｜〈我用什么才能留住你〉：摆脱惯性的“营字造句”，坦诚对待自己的身体》，澎湃号刊载，2021',
    'https://m.thepaper.cn/newsDetail_forward_15079568',
  ),
  q36: published(
    EDITORIAL['PUBLISHED_COMMENTARIES.q36.arg0'],
    '张静整理（“叶嘉莹古典诗词系列”）',
    '人民日报“叶嘉莹古典诗词系列”：《了然人生的况味——读苏轼〈定风波·莫听穿林打叶声〉》，2014-05-13；中国作家网刊载',
    'https://www.chinawriter.com.cn/wxpl/2014/2014-05-13/203498.html',
  ),
  q49: published(
    EDITORIAL['PUBLISHED_COMMENTARIES.q49.arg0'],
    '夏可君',
    '《卡夫卡与中国：无用的文学》，澎湃新闻；中国作家网刊载，2020-08-25',
    'https://www.chinawriter.com.cn/n1/2020/0825/c404091-31835292.html',
  ),
  q51: published(
    EDITORIAL['PUBLISHED_COMMENTARIES.q51.arg0'],
    '蒙曼',
    '《蒙曼品最美唐诗：人生五味》，浙江人民出版社，2018；“长干行”书摘，中国作家网，2019-01-14',
    'https://www.chinawriter.com.cn/n1/2019/0114/c405074-30535628.html',
  ),
  q52: published(
    EDITORIAL['PUBLISHED_COMMENTARIES.q52.arg0'],
    '潘向黎',
    '《能饮一杯无》，新民晚报；中国作家网刊载，2014-07-03',
    'https://www.chinawriter.com.cn/wxpl/2014/2014-07-03/209839.html',
  ),
  q53: published(
    EDITORIAL['PUBLISHED_COMMENTARIES.q53.arg0'],
    '曹璐',
    '《古诗中的雪与暖》，北京日报；中国作家网刊载，2022-02-10',
    'https://www.chinawriter.com.cn/n1/2022/0210/c404018-32349000.html',
  ),
  q54: published(
    EDITORIAL['PUBLISHED_COMMENTARIES.q54.arg0'],
    '曹璐',
    '《古诗中的雪与暖》，北京日报；中国作家网刊载，2022-02-10',
    'https://www.chinawriter.com.cn/n1/2022/0210/c404018-32349000.html',
  ),
  q55: published(
    EDITORIAL['PUBLISHED_COMMENTARIES.q55.arg0'],
    '曹璐；末句为本站提示',
    '《古诗中的雪与暖》，北京日报；中国作家网刊载，2022-02-10',
    'https://www.chinawriter.com.cn/n1/2022/0210/c404018-32349000.html',
  ),
  q56: published(
    EDITORIAL['PUBLISHED_COMMENTARIES.q56.arg0'],
    '蒙曼',
    '《蒙曼品最美唐诗：人生五味》“客至”书摘，浙江人民出版社，2018；中国作家网刊载，2019-01-14',
    'https://www.chinawriter.com.cn/n1/2019/0114/c405074-30535628.html',
  ),
  q57: published(
    EDITORIAL['PUBLISHED_COMMENTARIES.q57.arg0'],
    '张静；路艳霞、吴桐雨报道',
    '《叶嘉莹亲传弟子张静出新作，解读古典诗词中的品格与修养》，北京日报客户端；中国作家网，2026-03-19',
    'https://www.chinawriter.com.cn/n1/2026/0319/c403994-40684588.html',
  ),
  q58: educationNote(EDITORIAL['PUBLISHED_COMMENTARIES.q58.arg0'], '爱莲说', 'KS3_15'),
  q59: educationNote(EDITORIAL['PUBLISHED_COMMENTARIES.q59.arg0'], '陋室铭', 'KS3_12'),
  q60: educationNote(EDITORIAL['PUBLISHED_COMMENTARIES.q60.arg0'], '山居秋暝', 'KS4_16a'),
  q61: educationNote(EDITORIAL['PUBLISHED_COMMENTARIES.q61.arg0'], '送杜少府之任蜀州', 'KS3_09'),
  q62: educationNote(EDITORIAL['PUBLISHED_COMMENTARIES.q62.arg0'], '水调歌头', 'KS3_17'),
  q63: educationNote(EDITORIAL['PUBLISHED_COMMENTARIES.q63.arg0'], '虞美人', 'KS3_13'),
  q64: educationNote(EDITORIAL['PUBLISHED_COMMENTARIES.q64.arg0'], '天净沙·秋思', 'KS3_19'),
  q65: educationNote(EDITORIAL['PUBLISHED_COMMENTARIES.q65.arg0'], '劝学', 'KS4_06'),
  q66: educationNote(EDITORIAL['PUBLISHED_COMMENTARIES.q66.arg0'], '师说', 'KS4_12'),
  q67: educationNote(EDITORIAL['PUBLISHED_COMMENTARIES.q67.arg0'], '大同与小康', 'KS3_02'),
  q68: published(
    EDITORIAL['PUBLISHED_COMMENTARIES.q68.arg0'],
    '吴永兴、王珍',
    '《静穆·独善·逸乐：陶渊明的三重精神价值——以〈归去来兮辞〉为考察中心》，《学语文》2025年第4期，50—54页',
    'https://wxy.ahnu.edu.cn/__local/E/3E/7C/01C2A6C44A492E8C498B878E8BA_E5FF3674_A532F.pdf',
  ),
  q69: educationNote(EDITORIAL['PUBLISHED_COMMENTARIES.q69.arg0'], '岳阳楼记', 'KS4_14'),
  q70: educationNote(EDITORIAL['PUBLISHED_COMMENTARIES.q70.arg0'], '逍遥游', 'KS4_05'),
};
