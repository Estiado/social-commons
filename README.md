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

## 本地开发（Windows，文件留在 D 盘）

建议 Node.js 22.18 以上。保留现有 D 盘项目根目录。首次安装依赖时使用 D 盘缓存：

```powershell
$env:npm_config_cache = 'D:\CodexData\temp\social-commons\npm-cache'
npm ci
Copy-Item .env.example .env.local
.\scripts\dev.ps1 dev
```

不配置 Supabase 也可以阅读所有内置内容。云端收藏、素材包和文章提取需要真实配置及数据库初始化。

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
| `SUPABASE_URL` | 后端项目地址 | Pages Functions 运行期变量 |
| `SUPABASE_SERVICE_ROLE_KEY` | 服务端写入权限 | Pages 运行期 Secret，禁止 `VITE_` 前缀 |
| `ARTICLE_ALLOWED_HOSTS` | 可选，英文逗号分隔的来源域名 | Functions 运行期变量 |

`functions/api/extract-article.ts` 提供 `POST /api/extract-article`；`public/_routes.json` 让 Functions 只接管 API，静态阅读走静态资源。接口需要 Supabase 登录令牌。必须在 Supabase 启用匿名登录，并依次执行 `supabase/init.sql`、`highlights-migration.sql`、`preset-articles-migration.sql`（对已有数据库先核实迁移状态，切勿盲目重跑初始化）。

本轮没有更改线上 Secret 或执行数据库 SQL。`supabase/init.sql` 的宽松文章写入策略仍需专项收紧，详见蓝图。`npm run dev` 只提供前端，不模拟 Pages Functions；`npm run check:functions` 校验函数打包，完整接口联调应使用配置好 Secret 的 Cloudflare 预览部署。

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
