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
                         本浏览器文章 + 摘录索引 + 素材包
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
| `collections.ts` | 素材包校验、去重、迁移合并和导出模型 |
| `ReadingOrganiser.tsx` | 摘录选取、主题包、备注和排序界面 |
| `legacyImport.ts` | 只读迁移旧段落、划线、素材包；保留原件与本机修改 |
| `cloudRepository.ts` | 后续正式账号私有文档保存，目前默认关闭 |
| `export/` | Word、PDF、图片、压缩包；按需加载与分卷 |

## 其他业务模块

- `features/essay/`：个人素材增改、备份恢复、站方推荐示例。
- `features/auth/`：准备好的邮箱验证码界面，待 SMTP 和真实账号验收后启用。
- `data/`：`daily.ts` 通识，`quotes.ts` 名句，`quoteCommentaries.ts` 已核验评析，`events.ts` 历史，`essay*.ts` 素材，`curatedCommentaries.ts` 近期目录，`topic*.ts` 话题。
- `lib/`、`hooks/`：跨模块小工具。新的业务逻辑优先放对应 feature，不再随意塞进公共工具目录。

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
