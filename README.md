# 社科通识 · Social Commons

通过通识、多视角历史、名句和时评阅读，积累有出处的议论文素材。

- 网站：https://social-commons.pages.dev/
- 仓库：https://github.com/Estiado/social-commons
- 技术：React 19、TypeScript、Vite、Tailwind CSS 4、shadcn/ui、Supabase、Cloudflare Pages。

## 从这里接手

1. 阅读 [交接记录](docs/HANDOFF.md)，了解已完成工作与验证边界。
2. 阅读 [架构说明](docs/ARCHITECTURE.md)，按模块查代码。
3. 阅读 [产品蓝图](docs/PRODUCT_BLUEPRINT.md)，区分已实现功能与下一步建议。
4. 阅读 [验证记录](docs/VERIFICATION.md)，复核构建和行为。
5. 阅读 [私人阅读空间](docs/READING_WORKSPACE.md)，了解已批准范围、数据库迁移、邮件登录和精选维护。

## 本地开发（Windows，文件留在 D 盘）

当前按用户要求先本机内测，邮件系统延期。依赖已安装时，双击根目录 `启动本机内测.cmd`，然后打开 **http://127.0.0.1:5180**。保存文章、段落和划线均不要求登录；固定浏览器与地址，清理数据前用阅读空间的整库 ZIP 导出备份。

建议 Node.js 22.18 以上。保留现有 D 盘项目根目录。首次安装依赖时使用 D 盘缓存：

```powershell
$env:npm_config_cache = 'D:\CodexData\temp\social-commons\npm-cache'
npm ci
Copy-Item .env.example .env.local
.\scripts\dev.ps1 dev
```

不配置 Supabase 也可以阅读内置内容、链接/粘贴导入、收藏、本机长期保存及 Word/PDF/JSON 整库导出。未经保存的临时文章保留七天。邮件与跨设备同步默认关闭，旧段落库/素材包仍保留原数据库机制。

```powershell
.\scripts\dev.ps1 check      # 类型、lint、回归测试、前端构建、函数打包
.\scripts\dev.ps1 build      # 输出到 dist/client
.\scripts\dev.ps1 preview    # 预览生产构建
```

脚本仅修改当前进程的 TEMP/TMP/npm 缓存路径，使用 `D:\CodexData\temp\social-commons`，不修改系统隔离设置。构建、测试截图、函数验证产物在项目的 `dist/`、`.artifacts/`，不提交 Git。已安装的 Node 可继续使用，无需迁移系统程序。

## Cloudflare Pages

GitHub 生产分支为 `main`。构建命令 `npm run build`，输出目录 **`dist/client`**，Node 建议 22.18 以上。

| 配置 | 用途 | 放置位置 |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Supabase 项目地址 | Pages 构建环境变量 |
| `VITE_SUPABASE_ANON_KEY` | 浏览器公开客户端密钥 | Pages 构建环境变量 |
| `VITE_READING_CLOUD_ENABLED` | 默认 false；完成邮件与账号验收后才能启用 | 构建环境变量，不代替 RLS |
| `ARTICLE_ALLOWED_HOSTS` | 可选，英文逗号分隔的来源域名 | Functions 运行期变量 |
| `EXTRACTION_RATE_LIMITER` | 可选，分布式限流 | Pages Functions 绑定 |

`POST /api/extract-article` 免登录返回结构化正文，`GET /api/article-image` 提供有来源限制的图片代理。它们不使用 Supabase 服务端 Secret。`public/_routes.json` 让 Functions 只接管 API。

私人阅读空间在现有 Supabase 执行 `supabase/migrations/202610210001_reading_workspace.sql` 和精选种子 `supabase/seeds/reading_catalogue.sql`，不要盲目重跑旧初始化。配置邮箱 OTP 模板与正式 SMTP 后再验收真实发信、保存和跨设备同步，详见阅读空间文档。旧 `supabase/init.sql` 的宽松策略仍需专项审计。

`npm run dev` 通过 Vite 中间件调用真实的共享函数处理器；`npm run check:functions` 校验提取和图片代理打包。当前本地与生产的实际验证状态见验证记录。

本轮新增的 `supabase/migrations/202610220001_essay_examples.sql` 提供站方示例与编辑名单。维护流程及名句来源规则见 [内容发布约定](docs/CONTENT_POLICY.md)。本机素材不会上传公共示例表；在线编辑随邮件内测延期，站方仍可通过版本库发布精选。

[Cloudflare 官方 Functions 文档](https://developers.cloudflare.com/pages/functions/)；[路由文档](https://developers.cloudflare.com/pages/functions/routing/)。原 Netlify 适配层保留，并把 `/api/extract-article` 重写到旧函数。

## 修改约定

- 页面与页面专属 UI 放在 `src/pages/<PageName>/`；通用 UI 放在 `src/components/`。
- 独立逻辑放在 `src/lib/`，外部系统同步逻辑放在 hooks 或 `server/`。
- `src/index.tsx` 和 `src/components/ui/*` 为模板边界，本轮保持原样。
- 数据库写入必须检查 Supabase 返回的 `error`，成功后再更新界面。
- 不能把本地 UUID 当作已通过 Supabase 登录的身份。
- 不在产品页面放文件路径或开发操作说明。
- 新内容必须注明原文、作者、出处和核验状态；生成解读不可冒充作者原文。
- 提交前运行 `npm run check`，并记录实际完成的浏览器与云端验证。
