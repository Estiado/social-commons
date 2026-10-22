# 共享服务端逻辑

- `articleFetch.ts`：允许的媒体来源、跳转校验、抓取大小和超时。
- `extractArticle.ts`：校验请求、调用解析器、返回文章，不读写私人数据库。
- `requestLimits.ts`：限制提取和图片请求频率；未绑定 Cloudflare 分布式限流时仅每实例有效。

Cloudflare 入口调用这里。本地开发和 Netlify 兼容入口使用同一份实现。
