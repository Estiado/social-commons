# 自动回归

运行 `npm test`；交付前运行完整 `npm run check`。

- `workspace.test.ts`：站内内容转换、旧数据库原位升级、摘录一致性、迁移与素材包。
- `reading.test.ts`：媒体解析、完整性、七天期限、划线与本机冲突。
- `readingRls.test.ts`：独立 PostgreSQL 中的新增私有表和编辑权限。
- `batchExport.test.ts`：导出分卷、命名、失败清单和取消。
- 其余按来源抓取、目录、搜索、话题、导出、素材校验分文件。

合成测试不等于真实 Supabase、邮件、Word 版式或 Cloudflare 验收。真实结果单独记录到文档。
