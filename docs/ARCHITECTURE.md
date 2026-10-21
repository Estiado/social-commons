# 架构与维护地图

## 用户路径

`阅读（日新 / 群鉴 / 撷英 / 观澜）→ 发现关联专题 → 收藏段落或划线 → 素材包整理 → 带出处导出`

`src/index.tsx` 提供 Router、错误边界和全局样式；`src/app.tsx` 注册路由，首页直接加载，其余页面 `React.lazy`。`Layout` 保留导航和页脚，内容区有 Suspense 边界，搜索弹窗在打开时单独加载。

## 模块职责

| 模块 | 负责什么 | 修改时关注 |
| --- | --- | --- |
| `src/data/*.ts` | 内置内容、分类和类型 | 来源、ID 稳定、文本核验 |
| `src/data/topics.ts` | 前后端共用的通用话题规则 | 达到两次命中即停止，不分配匹配数组 |
| `src/data/hotTopics.ts` | 观澜热点分类 | 手动全名优先，避免关键词抢占归类 |
| `src/data/searchIndex.ts` | 延迟加载的只读全文索引 | 不混入私有用户数据 |
| `src/lib/search.ts` | 检索与结果上限 | 中文正文命中、首尾空白、早停 |
| `src/components/GlobalSearch.tsx` | 搜索交互与展示 | 已完成检索，禁用 cmdk 二次过滤 |
| `src/lib/articleCatalog.ts` | 合并、URL 去重、筛选、话题计数 | 保留本地经典文章阅读入口 |
| `src/lib/collectionExport.ts` | 文本、Markdown、Word、打印导出 | 全格式保留出处；打印 HTML 转义 |
| `src/lib/database.ts` | 数据库结果检查、收藏写入 | Supabase 不会默认 throw，先检查 error |
| `src/lib/presetArticleSync.ts` | 本地经典文章和云端段落映射 | 本地 ID 不能直接作数据库 UUID |
| `src/hooks/useUserId.ts` | 共用匿名登录初始化 | 已配置数据库时失败必须提示，不伪造云端身份 |
| `src/hooks/useLocalStorage.ts` | 浏览器存储订阅 | 同标签组件、多标签页、函数连续更新 |
| `src/hooks/useLoadEffect.ts` | 异步读取的启动和试挂载去重 | 调用方仍要处理请求完成后的状态与错误 |
| `src/hooks/useItemLocation.ts` | 搜索深链接滚动定位 | 目标条目的 DOM ID 和 scroll margin |
| `server/articleFetch.ts` | 来源验证、重定向、超时、流大小上限 | 默认可信媒体白名单；不得无条件代理任意 URL |
| `server/extractArticle.ts` | 抽取、分类、缓存和数据库写入 | 登录令牌、密钥隔离、段落失败补偿 |
| `functions/api/extract-article.ts` | Cloudflare Request/Response 适配 | 请求体 8 KB 上限，密钥从 context.env 读取 |
| `netlify/functions/` | 原 Netlify 平台兼容层 | 调用同一个 server 实现 |

## 数据边界

内置知识与文章位于版本库；自定义议论文词条和分类在当前浏览器 localStorage；段落、划线、素材包位于 Supabase。匿名登录不会自动变成跨设备正式账号，清理浏览器身份后可能无法再访问原来的个人数据。

页面只在需要云端操作时初始化用户。多组件和 StrictMode 共用登录 Promise，避免同时创建多个匿名账号。服务端使用用户令牌校验登录，服务端密钥不会进入浏览器构建。

文章提取过程：`POST /api/extract-article → JSON/URL/登录验证 → 缓存查询 → 受限抓取 → HTML 解析 → 话题归类 → 文章与段落写入 → 统一 {success, article:{id,...}} 返回`。

抓取超时 12 秒，最多 3 次跳转，最大响应 2 MiB；请求体上限 8 KiB。白名单不代表内容正确，抓取成功也不代表来源已核验。PDF 与需登录/动态渲染页面仍可能无法提取。

## 性能取舍

- 搜索仍是线性子串检索，最坏约 O(NL)，没有声称变成 O(1)。归一化文本一次构建，最多返回 30 条并提前停止；不再每键全文转小写、构造所有命中再截断。
- 搜索索引增加一份归一化文本的常驻空间，换取输入时更少分配；只在用户首次打开搜索后加载。
- 观澜读取最近 100 篇云端文章一次，在内存筛选。合并去重 O(N)，排序 O(N log N)，在目录变化时执行。超过 100 篇后的完整历史检索需要服务端分页，当前没有实现。
- 话题计数由每个话题扫描全部文章 O(TN)，改为目录变化时统计 O(N)、卡片查表 O(T)。
- Word 打包库约 391 KB 原始体积，仅在导出时加载；不会进入首页脚本。
- 素材包元数据、段落和划线并行读取；文章收藏状态只查询当前文章，避免拉取整个用户收藏库。

## 仍需专门处理的边界

- 本轮没有执行线上 SQL，也没有验证现有数据库实际 RLS。初始化 SQL 的公开写入策略、段落公开读取、素材包关联项归属，需要独立审计。
- 经典文章多客户端同时补段落仍需要数据库 `(article_id, paragraph_index)` 唯一约束与事务；当前只做同标签页并发合并与缺段补齐。
- 段落排序仍是两次写入；失败后重载避免界面假成功，多人并发原子排序需要 RPC/事务。
- 提取接口有登录和抓取上限；公开运营前仍应加服务端配额/速率限制。匿名登录本身不是防滥用系统。
- 前端管理员页不是权限系统，真正删除权限必须在数据库或受保护的服务端验证。
