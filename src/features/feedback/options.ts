// 选项只负责快速填写，提交仍沿用同一份反馈字段与校验。
export const FEEDBACK_PAGES = [
  { value: '/', label: '首页' },
  { value: '/daily', label: '日新 · 通识' },
  { value: '/events', label: '群鉴 · 历史事件' },
  { value: '/quotes', label: '撷英 · 诗文名句' },
  { value: '/essay', label: '议论文素材' },
  { value: '/guanlan', label: '观澜 · 时评与主题' },
  { value: '/world', label: '知天下 · 长期事件' },
  { value: '/briefing', label: '每日简报' },
  { value: '/reading', label: '阅读空间' },
  { value: '/reading/import', label: '文章导入' },
];

export const FEEDBACK_EXPECTATIONS = [
  { label: '正常打开页面和阅读正文', value: '页面能正常打开，文章正文完整显示。' },
  { label: '搜索后直接看到对应结果', value: '搜索后能直接定位到对应结果，并清楚显示找到的内容。' },
  {
    label: '收藏、划线和文稿正确保存',
    value: '收藏、划线和文稿能正确保存，重新打开同一浏览器后仍然保留。',
  },
  { label: '顺利导出 Word / PDF', value: '所选内容能按设置的排版完整导出为 Word 或 PDF。' },
  {
    label: '排版更清楚、操作更方便',
    value: '页面排版更简洁，手机和电脑上都能清楚阅读、方便操作。',
  },
  { label: '更正内容、署名或来源', value: '核对并更正相关内容、作者署名或来源链接。' },
];
