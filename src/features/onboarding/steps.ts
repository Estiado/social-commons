export interface TourStep {
  id: string;
  path: string;
  target: string;
  chapter: string;
  title: string;
  description: string;
  nextLabel?: string;
  expandBackup?: boolean;
}

/** Routes and targets are explicit. The guide never clicks a save, import,
 * export or submit control on behalf of the reader. */
export const TOUR_STEPS: TourStep[] = [
  {
    id: 'home',
    path: '/',
    target: 'home-quote',
    chapter: '认识首页',
    title: '从一段文字开始',
    description:
      '首页先送你一段摘读。点击“阅读全文与有出处的解读”，可以连着读作品、核对作者与来源。',
  },
  {
    id: 'daily',
    path: '/',
    target: 'home-daily',
    chapter: '认识首页',
    title: '每天认识一个通识概念',
    description: '“今日日新”是当天的阅读入口。继续向下，我们一起看看首页还有哪些内容。',
  },
  {
    id: 'news',
    path: '/',
    target: 'home-commentaries',
    chapter: '认识首页',
    title: '围绕一件事，读不同论证',
    description:
      '这里推荐观澜的事件精读。进入后先了解事实与背景，再读不同立意、思辨翻转及原始资料。',
  },
  {
    id: 'topics',
    path: '/',
    target: 'home-topics',
    chapter: '认识首页',
    title: '从主题串联阅读',
    description:
      '话题下先按事件组织阅读，相关时评、通识和名句附在事件里。先选一个感兴趣的话题，再看具体发生了什么。',
  },
  {
    id: 'history',
    path: '/',
    target: 'home-events',
    chapter: '走进群鉴',
    title: '历史不止一种叙述',
    description:
      '群鉴从事件概述开始，再呈现不同著述中的视角。下一步直接进入群鉴，看看具体怎样阅读。',
    nextLabel: '进入群鉴',
  },
  {
    id: 'history-list',
    path: '/events',
    target: 'events-search',
    chapter: '走进群鉴',
    title: '先找到感兴趣的事件',
    description:
      '可以按事件或关键词搜索，再打开独立词条。接下来以“丝绸之路”为例，看看正文里的操作。',
    nextLabel: '打开示例词条',
  },
  {
    id: 'history-reader',
    path: '/events/silk-road',
    target: 'reader-paragraph',
    chapter: '走进群鉴',
    title: '读概述，再比较视角',
    description:
      '正文先交代事件背景。继续读会看到各方著述与出处；提供电子版的文献放在对应观点下方。',
  },
  {
    id: 'save-text',
    path: '/events/silk-road',
    target: 'reader-actions',
    chapter: '走进群鉴',
    title: '整篇保存，也能只留一段',
    description:
      '“加入阅读空间”保存整篇。电脑悬停段落可以收藏，手机可使用段落下的收藏按钮；选中文字后，也能点击“收藏划线”。',
    nextLabel: '回首页继续看',
  },
  {
    id: 'workspace-card',
    path: '/',
    target: 'home-reading',
    chapter: '阅读空间',
    title: '把读过的文字放在一起',
    description: '文章、段落、语句和自己编写的文稿，都归入同一个阅读空间。现在直接去看看。',
    nextLabel: '打开阅读空间',
  },
  {
    id: 'workspace',
    path: '/reading',
    target: 'reading-intro',
    chapter: '阅读空间',
    title: '这里是你的阅读与写作桌',
    description: '可以新建文稿，也可以导入自己的内容。个人资料保存在当前浏览器，换设备前请先备份。',
  },
  {
    id: 'workspace-search',
    path: '/reading',
    target: 'reading-search',
    chapter: '阅读空间',
    title: '在正文里找回读过的话',
    description:
      '输入关键词并搜索，能检索标题、正文、摘录和来源。结果会高亮关键词，点击后定位到对应段落。',
  },
  {
    id: 'workspace-select',
    path: '/reading',
    target: 'reading-selection',
    chapter: '阅读空间',
    title: '只选需要的内容，编成一份文稿',
    description:
      '勾选文章或摘录，点击“编成文稿并编辑”。可以调整顺序，在网站编辑器中修改排版，再下载 Word 或 PDF。空白空间也可以直接新建文稿。',
  },
  {
    id: 'workspace-backup',
    path: '/reading',
    target: 'reading-backup-controls',
    chapter: '阅读空间',
    title: '把个人积累备份带走',
    description:
      '一键备份文章、划线、文稿，以及素材页的个人素材、词条和标签。恢复只补充缺失条目，保留已有编辑。请在浏览器下载列表确认文件已保存。',
    expandBackup: true,
    nextLabel: '回首页看素材入口',
  },
  {
    id: 'essay-card',
    path: '/',
    target: 'home-essay',
    chapter: '积累素材',
    title: '从概念出发，积累自己的材料',
    description: '议论文素材提供概念和站方推荐示例，也允许你整理自己的词条与材料。一起进入素材页。',
    nextLabel: '进入议论文素材',
  },
  {
    id: 'essay-search',
    path: '/essay',
    target: 'essay-search',
    chapter: '积累素材',
    title: '按关键词和学科找素材',
    description: '输入关键词后点击搜索，会显示结果数量并定位到结果。学科下拉可以进一步缩小范围。',
  },
  {
    id: 'essay-personal',
    path: '/essay',
    target: 'essay-add',
    chapter: '积累素材',
    title: '自己的词条，也能慢慢长大',
    description:
      '用“添加词条”和“添加标签”整理自己的内容；展开概念后还能添加个人素材。请注明来源，换浏览器前使用统一备份。',
    nextLabel: '回到顶部导航',
  },
  {
    id: 'nav-daily',
    path: '/essay',
    target: 'nav-daily',
    chapter: '认识导航',
    title: '日新：完整的通识目录',
    description:
      '首页只显示当天内容。顶部“日新”可以打开完整目录，按领域和细学科查找；手机上会展开栏目菜单供你查看。',
    nextLabel: '看看通识目录',
  },
  {
    id: 'daily-directory',
    path: '/daily',
    target: 'daily-intro',
    chapter: '认识导航',
    title: '由一个概念读向更多问题',
    description: '搜索概念、内容或来源，打开条目阅读。段落收藏与划线的方法和刚才的历史词条相同。',
  },
  {
    id: 'nav-quotes',
    path: '/daily',
    target: 'nav-quotes',
    chapter: '认识导航',
    title: '撷英：连着读诗文',
    description:
      '这里汇集诗文与名句摘读，可以按作者、作品或文字搜索，也可筛选附有真实出处解读的作品。',
    nextLabel: '打开撷英',
  },
  {
    id: 'quotes-reader',
    path: '/quotes',
    target: 'quotes-intro',
    chapter: '认识导航',
    title: '作品有独立页面和出处',
    description:
      '从目录打开作品，可以连着读选段并查看解读来源。遇到喜欢的文字，仍然可以加入阅读空间、收藏段落或划线。',
  },
  {
    id: 'nav-guanlan',
    path: '/quotes',
    target: 'nav-guanlan',
    chapter: '认识导航',
    title: '观澜：话题下按事件阅读',
    description:
      '事件是观澜的阅读单元，时评、研究和名句围绕事件展开。进入事件可以收藏、划线，也能查原始资料。',
    nextLabel: '打开观澜',
  },
  {
    id: 'guanlan',
    path: '/guanlan',
    target: 'guanlan-intro',
    chapter: '认识导航',
    title: '从话题进入事件，再读完整论述',
    description:
      '上方选择话题，下方进入事件精读。事件页按新闻回放、背景、多维立意与思辨翻转组织，原文可按媒体查阅。原有时评目录保留在折叠区。',
  },
  {
    id: 'search',
    path: '/guanlan',
    target: 'nav-search',
    chapter: '认识导航',
    title: '全站搜索就在这里',
    description:
      '顶部放大镜可以查找站内概念、诗文、历史事件和主题；电脑也能按 Ctrl / Command + K 打开。私人正文请在阅读空间内搜索。',
  },
  {
    id: 'nav-world',
    path: '/guanlan',
    target: 'nav-world',
    chapter: '认识导航',
    title: '知天下：沿时间读懂长期事件',
    description:
      '俄乌、巴以与联合国长期行动都按节点组织。进入后可先看最近进展，也可从头阅读，并把正文保存到阅读空间。',
  },
  {
    id: 'nav-briefing',
    path: '/guanlan',
    target: 'nav-briefing',
    chapter: '认识导航',
    title: '今日简报：随时再读一次',
    description:
      '每天按北京时间换一组时事、完整诗文和概念。每次打开网站先弹出；关闭后仍可从这里重看，并保存为自己的阅读文稿。',
  },
  {
    id: 'feedback',
    path: '/guanlan',
    target: 'nav-feedback',
    chapter: '内测反馈',
    title: '最后一个入口：把问题告诉我们',
    description:
      '遇到内容错误、操作问题或建议，都可以点击“内测反馈”。入口会自动带上你正在看的页面。',
    nextLabel: '打开反馈表',
  },
  {
    id: 'feedback-form',
    path: '/feedback',
    target: 'feedback-intro',
    chapter: '内测反馈',
    title: '写清问题，直接提交',
    description:
      '选择相关页面和常见期望，写下问题后提交。收到回执才算发送成功；未提交的草稿会留在当前浏览器。需要重看时，可在页脚打开“使用指引”。',
    nextLabel: '完成指引',
  },
];
