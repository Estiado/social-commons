# 静态文件

- `fonts/`：PDF 导出使用的 Noto Sans SC 中文字体及许可证，点击 PDF 时才加载。
- `_routes.json`：Cloudflare 只让 API 请求进入 Functions。
- 其他图标和静态资源随构建复制到网站。

不要把用户导入的正文、私人摘录或密钥放在这里；这里的文件会公开发布。
