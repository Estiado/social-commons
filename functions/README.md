# Cloudflare 接口入口

- `api/extract-article.ts`：`POST /api/extract-article`，媒体文章提取。
- `api/article-image.ts`：`GET /api/article-image`，受限图片代理。

目录名由 Cloudflare Pages Functions 约定，保留在根目录。业务逻辑放 `server/` 和阅读模块，不复制另一份。
