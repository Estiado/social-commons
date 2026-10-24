# 仓库中文导览

这个项目采用 React 的函数与模块组织方式。文件夹对应职责，不是“一堆类”；先确定要改什么，再找对应模块。

## 三条主线

| 想完成什么 | 从哪里开始 | 继续去哪里 |
| --- | --- | --- |
| 修改页面、导航或排版 | `src/pages/`、`src/components/Layout.tsx` | 对应 `src/features/`，通用控件在 `components/ui/` |
| 增加内容或核对出处 | `src/data/` | `docs/CONTENT_POLICY.md`、`scripts/build-*-seed.mjs` |
| 修改收藏、导出或数据库 | `src/features/reading/` | `supabase/migrations/`、`tests/` |

## 一篇内容经过哪些文件

```text
站内内容 src/data/ ── contentDocuments.ts ─┐
                                       ├─ 统一文章模型 model.ts
媒体链接 ─ Cloudflare入口 ─ server/ ─ 解析 ┘
                                                │
                              ContentReader / ArticleContent
                                                │
                         本浏览器文章 + 摘录索引 + 独立文稿
                                                │
                              阅读空间 / Word / PDF / ZIP
```

页面不再分别实现日新收藏、名句收藏和时评收藏。它们把文字交给同一个阅读模型，后续修正划线、出处或导出时只需要改一套实现。

## 阅读空间模块里有什么

| 文件或目录 | 职责 |
| --- | --- |
| `model.ts` | 文章、段落、图片、完整性和划线锚点的合同 |
| `contentDocuments.ts` | 将日新、名句、历史、经典文章、素材概念转换为同一合同；按需加载对应目录 |
| `parseArticle.ts` | 媒体 HTML 和粘贴内容转换，保留段落、插图和图注 |
| `ContentReader.tsx` | 站内内容的保存、划线、段落收藏与导出交互 |
| `ArticleContent.tsx` | 共用正文排版、文字选区和高亮，不访问数据库 |
| `guestRepository.ts` | 本浏览器文档、摘要与摘录索引；版本冲突和七天过期处理 |
| `excerpts.ts` | 摘录清单及出处，不复制整篇正文 |
| `collections.ts` | 旧素材包数据合同，保留迁移与备份兼容 |
| `writing/` | 文稿模型、版本存储、所选内容编排、编辑器与格式转换 |
| `writing/editorDocument.ts` | 编辑器 JSON 与统一文章块之间转换，不保存来源 HTML |
| `writing/legacyDrafts.ts` | 把旧包与备注转成独立文稿，重复迁移不覆盖编辑结果 |
| `TopicReading.tsx`、`CommentaryCatalogue.tsx` | 私人专题关联与公开媒体目录，全文仍属于导入者 |
| `sourceAccess.ts` | 识别验证拦截页，阻止当成文章保存、编排或导出 |
| `legacyImport.ts` | 只读迁移旧段落、划线、素材包；保留原件与本机修改 |
| `cloudRepository.ts` | 后续正式账号私有文档保存，目前默认关闭 |
| `export/` | Word、PDF、图片、压缩包；按需加载与分卷 |

## 其他业务模块

- `features/essay/`：个人素材增改、备份恢复、站方推荐示例。
- `features/auth/`：准备好的邮箱验证码界面，待 SMTP 和真实账号验收后启用。
- `data/`：`daily.ts` 通识，`quotes.ts` 名句，`quoteCommentaries.ts` 已核验评析，`events.ts` 历史，`essay*.ts` 素材，`curatedCommentaries.ts` 近期目录，`topic*.ts` 话题。
- 扩容内容按领域放在 `data/knowledge/`、`history/`、`essay/`、`quotes/`、`commentaries/`，入口文件继续统一导出。`quotes/expandedReadings.ts` 修订旧语段及别名；`publishedCommentaries.ts` 只存已发表解读的来源摘要。新增数据与页面交互分开维护。
- 新的学习、心理与审美来源集中在`knowledge/learningAndCulture.ts`；`essay/learningAndCulture.ts`从同一台账生成素材，不再手工维护两份解释。完整诗文在`quotes/friendshipAndNature.ts`，科学史在`history/naturalSelection.ts`，文化科技目录在`commentaries/cultureAndTechnology.ts`。海外`readingMode`决定只显示原站入口，不能通过新增目录条目绕过抓取白名单。
- `features/reading/catalogueReading.ts` 处理新版正文与旧快照的选择；`typography.ts` 定义可保存的常用正文样式，`writing/DocumentStyleControls.tsx` 只负责样式选择界面。
- `lib/`、`hooks/`：跨模块小工具。新的业务逻辑优先放对应 feature，不再随意塞进公共工具目录。

- 青年与大学研究集中在`knowledge/youthStudies.ts`，日新、观澜、`essay/youthStudies.ts`共用同一书目。作者、期刊、卷期页码与原站PDF使用`types.ts`中的`IResearchSource`；新增论文时先核来源，不从旧摘要推测全文。`TopicSpecial.readingFocus`只调整研究主题的展示顺序，保留私人关联工具。

## 为什么根目录还留有配置

| 配置 | 作用 |
| --- | --- |
| `package.json` / `package-lock.json` | 依赖、命令及锁定版本，安装和部署所需 |
| `vite.config.ts` / `index.html` | 构建与网页启动入口 |
| `tsconfig*.json` | 分别检查前端、服务端、开发配置的类型 |
| `eslint.config.mjs` / `.prettierrc.json` | 代码检查与统一排版 |
| `components.json` | 通用界面组件工具配置 |
| `.gitignore` / `.env.example` / `.npmrc` | 忽略过程文件、公开配置示例、包下载源 |
| `AGENTS.md` | 自动化维护约定 |

这些文件保留标准位置，方便普通工程师用常见工具接手；旧平台配置和开发 CMD 已移入专门目录。

## 维护顺序

读 `HANDOFF.md` → 按本导览找模块 → 小范围修改 → 必要的回归用例 → `npm run check` → PR 检查与真实页面验收 → 合并 main → 核对 Cloudflare 发布。

旧功能代码可以从 Git 历史找回；用户的数据库和浏览器存储不通过删除代码进行清理。

本轮不再维护独立的专题目录页、旧观澜列表、摘录/素材包管理器和首页公共文章查询。观澜与首页共用版本化精选目录；阅读空间通过摘要与摘录索引列出内容，只加载选中的正文来编稿。编辑器、Word/PDF 依赖按页面或操作加载。具体协作权限见 [同学协作说明](CLASSMATE_COLLABORATION.md)。
