# 兼容平台配置

当前网站由 **Cloudflare Pages** 部署。其 Functions 入口保留在根目录 `functions/`。

- `netlify/`：原 Netlify 配置及提取适配器。如切换平台，需要显式指定这份配置；它不是当前生产部署入口。
- `miaoda/`：原妙搭项目声明。Vite 只在对应托管环境启用原产物协议；日常 Cloudflare 构建不启用。

根目录其他配置保留各工具的标准位置，含义见 [仓库导览](../docs/REPOSITORY_GUIDE.md)。
