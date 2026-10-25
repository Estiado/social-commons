# 社科通识 · Social Commons

阅读通识、名句、历史与时评，把有出处的文字整理成教学素材。

**正式网站：[social-commons.pages.dev](https://social-commons.pages.dev/)**

日常使用直接打开网站，无需安装软件、运行 CMD 或打开本机预览。邮箱登录与跨设备同步延期；当前文章、划线和文稿保存在使用网站的这个浏览器中。

## 网站怎么用

1. 在日新、撷英、群鉴或观澜阅读，也可以粘贴媒体链接、正文导入。观澜按主题组织 7—10 月精选，可按媒体、月份检索。
2. 悬停收藏段落或选中文字划线，内容自动加入**阅读空间**。
3. 阅读空间统一展示文章、段落、语句和文稿。勾选需要的一部分，调整顺序，点击**编成文稿并编辑**。
4. 在网站内修改文稿、设置标题与常见格式，自动保存后下载**一份 Word / PDF**。继续选材可追加内容。原文章与划线不被修改。
5. 在**数据与备份**下载可恢复的 JSON；恢复时只添加缺失内容，不覆盖已有文章、划线和文稿。旧整库 ZIP 仍保留在其他导出中，旧素材包会转为文稿。
6. 遇到问题，在[内测反馈](https://social-commons.pages.dev/feedback)直接提交给维护者；收到回执才算成功。复制、下载副本作为备用。站长收件方式见[反馈说明](docs/FEEDBACK.md)，实际开通状态见验证记录。

导入内容先保留七天；点击保存或收藏后在当前浏览器长期保留。清理浏览器数据前先备份。更换浏览器或电脑不会自动同步。媒体节选会明确标注，不能当作全文。

## 仓库从哪里看

**修改站内解释、摘要或赏析：[打开统一编辑稿](content/站内编辑稿.md)。** 改标记中间的正文，提交到GitHub后随Cloudflare构建更新。[操作说明](docs/EDITORIAL_COPY.md)包含编辑方法及原作者引文、书目如何维护。

**第一次看仓库，请先读 [中文目录导览](docs/REPOSITORY_GUIDE.md)。** 不需要先翻配置文件。

和同学一起维护，请先看 [Fork 与 PR 协作说明](docs/CLASSMATE_COLLABORATION.md)。公开查看不等于有权修改原仓库。

准备邀请内测者，请先看[内测评估](docs/BETA_READINESS.md)，了解浏览器保存、备份、账号延期及安全检查边界。内容维护另见[群鉴规范](docs/HISTORY_CONTENT.md)与[来源清单](docs/CONTENT_SOURCES.md)。

| 目录 | 放什么 | 常见修改 |
| --- | --- | --- |
| [content](content/站内编辑稿.md) | 站内编辑文字的统一总稿 | 改简介、解释、资料提要和赏析转述 |
| [src](src/README.md) | 用户看到的页面、业务模块、内置内容 | 页面样式、阅读收藏、文章与名句 |
| [server](server/README.md) | 服务端抓取、提取、限流 | 媒体适配、接口规则 |
| [functions](functions/README.md) | Cloudflare API 入口 | 把请求交给共享服务 |
| [supabase](supabase/README.md) | 数据库迁移和精选种子 | 新增表、权限、目录内容 |
| [public](public/README.md) | 字体、静态资源和部署路由 | PDF 中文字体、站点图标 |
| [tests](tests/README.md) | 自动回归测试 | 防止旧功能再次出错 |
| [scripts](scripts/README.md) | 开发、检查、内容生成工具 | 维护者调试和验收 |
| [config](config/README.md) | 旧平台的兼容配置 | Netlify、妙搭兼容 |
| [docs](docs/README.md) | 产品、架构、来源、运维与验收文档 | 接手和交接 |
| [.github](.github/CONTRIBUTING.md) | 自动检查、问题反馈、PR 模板 | 团队协作 |

根目录的 `package.json`、`vite.config.ts`、`tsconfig*.json` 等是构建工具的常用配置入口，不是业务模块。[目录导览](docs/REPOSITORY_GUIDE.md)解释了各自用途。缓存、依赖、构建、截图不进入 GitHub。

## 维护者开发

建议 Node.js 24。新过程文件和缓存使用 D 盘，保留现有项目目录。

```powershell
$env:npm_config_cache = 'D:\CodexData\temp\social-commons\npm-cache'
npm ci
.\scripts\dev.ps1 dev
```

开发预览使用 `127.0.0.1:5180`，这是维护者电脑上的服务，和正式网站是两个独立来源，浏览器数据也互不混用。重复启动会复用已经运行的本站服务；被其他程序占用时显示说明，不自动结束进程。

```powershell
npm run check          # 类型、lint、回归、构建、函数与导出验证
npm run format:reading # 新业务模块统一排版
npm run build          # Cloudflare 输出 dist/client
```

GitHub 的 PR 自动运行检查，Cloudflare 沿用 main 分支部署。数据库、邮件与真实账号验收独立于构建成功，见 [交接记录](docs/HANDOFF.md)与[验证记录](docs/VERIFICATION.md)。

前端仅使用公开的 Supabase 地址和客户端 key；服务端密钥不能放在 `VITE_*`、源码或提交中。当前提取无需数据库服务端密钥。详见[阅读空间运维](docs/READING_WORKSPACE.md)、[内容来源约定](docs/CONTENT_POLICY.md)。
