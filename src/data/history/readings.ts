export interface HistoryReading {
  title: string;
  url: string;
  format: 'PDF' | 'TXT' | '网页';
  edition: string;
  file?: string;
  license?: string;
}

/** A local file is listed only after its signature and text have been checked.
 * Author-hosted papers without a redistribution licence keep their source URL. */
export const HISTORY_READINGS: Record<string, HistoryReading> = {
  'darwin-wallace-paper': {
    title: '达尔文—华莱士1858年联合发表论文',
    url: 'https://darwin-online.org.uk/converted/pdf/1858_species_F350.pdf',
    format: 'PDF',
    edition: '原刊第45—62页，18页扫描本；Darwin Online',
  },
  'darwin-origin-first': {
    title: '达尔文《物种起源》1859年初版',
    url: 'https://www.gutenberg.org/ebooks/1228',
    format: 'TXT',
    edition: '1859年初版英文全本，Project Gutenberg #1228',
    file: 'darwin-origin-first.txt',
    license: 'Project Gutenberg；保留原版许可说明',
  },
  'declaration-transcript': {
    title: '《独立宣言》完整转录',
    url: 'https://www.archives.gov/founding-docs/declaration-transcript',
    format: '网页',
    edition: '美国国家档案馆，Stone 刻印本转录',
  },
  'adams-ladies': {
    title: '阿比盖尔·亚当斯：1776年3月31日至4月5日书信',
    url: 'https://chnm.gmu.edu/mcpstah/wordpress/wp-content/themes/tah/files/adams_remember-the-ladies_1776.pdf',
    format: 'PDF',
    edition: '马萨诸塞历史学会电子档案转录，4页',
  },
  'udhr-chinese': {
    title: '《世界人权宣言》中文本',
    url: 'https://2017-2021.state.gov/wp-content/uploads/2020/04/CHN-Universal-Declaration-of-Human-Rights.pdf',
    format: 'PDF',
    edition: '联合国中文本，美国国务院存档',
  },
  'bradford-plymouth': {
    title: '布拉福德《普利茅斯殖民史》',
    url: 'https://www.gutenberg.org/ebooks/69871',
    format: 'TXT',
    edition: 'Harold Paget 整理本，1920；英文全本',
    file: 'bradford-plymouth.txt',
    license: 'Project Gutenberg；保留原版许可说明',
  },
  'smith-wealth': {
    title: '亚当·斯密《国富论》',
    url: 'https://www.gutenberg.org/ebooks/3300',
    format: 'TXT',
    edition: '英文全本，Project Gutenberg #3300',
    file: 'smith-wealth.txt',
    license: 'Project Gutenberg；保留原版许可说明',
  },
  'wollstonecraft-rights': {
    title: '沃斯通克拉夫特《女权辩护》',
    url: 'https://www.gutenberg.org/ebooks/3420',
    format: 'TXT',
    edition: '英文全本，Project Gutenberg #3420',
    file: 'wollstonecraft-rights.txt',
    license: 'Project Gutenberg；保留原版许可说明',
  },
  'engels-workers': {
    title: '恩格斯《英国工人阶级状况》',
    url: 'https://www.gutenberg.org/ebooks/17306',
    format: 'TXT',
    edition: 'Florence Kelley 英译，1892年版；英文全本',
    file: 'engels-workers.txt',
    license: 'Project Gutenberg；保留原版许可说明',
  },
  'faxian-kingdoms': {
    title: '法显《佛国记》',
    url: 'https://www.gutenberg.org/ebooks/2124',
    format: 'TXT',
    edition: 'James Legge 英译，1886；英文全本',
    file: 'faxian-kingdoms.txt',
    license: 'Project Gutenberg；保留原版许可说明',
  },
  'seneca-report': {
    title: '1848年妇女权利会议报告',
    url: 'https://www.nps.gov/wori/learn/historyculture/report-of-the-womans-rights-convention.htm',
    format: '网页',
    edition: '美国国家公园管理局完整转录',
  },
  'cdc-snow-2004': {
    title: '斯诺与水泵把手事件150周年',
    url: 'https://stacks.cdc.gov/view/cdc/28527',
    format: 'PDF',
    edition: 'MMWR 2004年第53卷34期，整期24页；本文在第783页',
    file: 'cdc-snow-2004.pdf',
    license: '美国政府公共卫生出版物；保留原出版信息',
  },
  'loc-printing-2023': {
    title: '国会图书馆杂志：百万塔与经咒',
    url: 'https://www.loc.gov/lcm/pdf/LCM_2023_0102.pdf',
    format: 'PDF',
    edition: '2023年1—2月，整期32页；本文在纸面第5页',
  },
  'jikji-nomination': {
    title: '《直指》世界记忆名录申报表',
    url: 'https://media.unesco.org/sites/default/files/webform/mow001/korea_buljo_jikj_simch_yo_jeol.pdf',
    format: 'PDF',
    edition: '英文申报原件，13页',
  },
  'ozone-assessment-2022': {
    title: '2022年臭氧消耗科学评估：执行摘要',
    url: 'https://ozone.unep.org/system/files/documents/Scientific-Assessment-of-Ozone-Depletion-2022-Executive-Summary.pdf',
    format: 'PDF',
    edition: 'WMO GAW Report No.278；英文原版，57页',
  },
  'allen-engels-pause': {
    title: 'Robert C. Allen：Engels’ pause',
    url: 'https://www.nuff.ox.ac.uk/Users/Allen/engelspause.pdf',
    format: 'PDF',
    edition: '2009年作者公开稿，18页',
  },
  'hansen-turfan': {
    title: 'Valerie Hansen：丝路贸易对吐鲁番地方社会的影响',
    url: 'https://history.yale.edu/sites/default/files/files/hansen-silk-road-trade.pdf',
    format: 'PDF',
    edition: '2005年作者公开稿，第283—310页',
  },
  'shiode-snow-2015': {
    title: '斯诺霍乱地图的死亡率与时空分布再分析',
    url: 'https://link.springer.com/content/pdf/10.1186/s12942-015-0011-y.pdf',
    format: 'PDF',
    edition: 'Shiode 等，2015；15页，出版页附图件勘误',
    license: 'CC BY 4.0',
  },
  'new-coke-schindler': {
    title: '辛德勒：新可乐与焦点小组',
    url: 'https://jameshammon.com.au/wp-content/uploads/2019/01/new_coke_AMA.pdf',
    format: 'PDF',
    edition: 'Marketing Research 4(4)，1992，第22—27页；原刊副本',
  },
  'new-coke-neuron': {
    title: '熟悉饮料的品牌线索与行为偏好',
    url: 'https://mcclurelab.org/pdf/McClureLi2004.pdf',
    format: 'PDF',
    edition: 'Neuron 44(2)，2004，第379—387页；作者实验室电子版',
  },
  'eclipse-report': {
    title: '1919年日食观测的1920年正式报告',
    url: 'https://doi.org/10.1098/rsta.1920.0009',
    format: '网页',
    edition: 'Dyson、Eddington、Davidson，Philosophical Transactions A 220，第291—333页',
  },
  'eclipse-longair': {
    title: '朗盖尔：重访1919年日食观测',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4360090/',
    format: '网页',
    edition: 'Philosophical Transactions A 373:20140287，2015；开放全文',
  },
  'radio-research-2013': {
    title: '重访《来自火星的入侵》：传播研究经典的形成',
    url: 'https://ijoc.org/index.php/ijoc/article/viewFile/2117/980',
    format: 'PDF',
    edition: 'International Journal of Communication 7，2013，第1920—1948页，29页原版',
    file: 'war-of-worlds-research-2013.pdf',
    license: 'CC BY-NC-ND；Jefferson D. Pooley、Michael J. Socolow；非商业、署名、保留原件',
  },
};
