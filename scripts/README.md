# 维护工具

这些工具只供开发和运维；访客直接使用 [正式网站](https://social-commons.pages.dev/)。

| 工具 | 用途 |
| --- | --- |
| `editorial-content.ts` | 校验统一编辑稿，按栏目生成构建用文字；不把整份稿件放入首页 |
| `dev.ps1` | 设置当前进程的 D 盘临时目录，运行开发、检查、构建 |
| `start-local.mjs` | 启动或复用开发预览，识别端口占用，不结束其他进程 |
| `windows/开发预览.cmd` | Windows 维护者的启动快捷方式，无需用于日常阅读 |
| `vite-article-api.ts` | 开发预览调用真实 API；本地状态端点仅供启动器识别 |
| `verify-*.mjs` | 函数打包和真实导出文件验证 |
| `build-*-seed.mjs` | 从已核对的精选内容生成 SQL，不自动写生产数据库 |
| `inspect-article-sources.mjs` | 媒体适配时检查真实正文容器 |
| `prepare-pdf-font.py` | 复现 PDF 静态中文字体转换 |

下载、缓存和检查产物放 `.artifacts/`，构建在 `dist/`，均不进 GitHub。开发地址与正式网站使用不同浏览器存储。
