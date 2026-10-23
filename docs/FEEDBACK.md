# 内测反馈收件

访客在 `/feedback` 填写类型、相关页面、问题和期望，点击“提交反馈”。不需要登录或配置SMTP；反馈存入既有Supabase项目的 `public.beta_feedback`，站长在Supabase后台查看。复制和下载只是备用副本，不作为提交成功。

电脑端顶部导航常驻“内测反馈”，手机端在栏目菜单中也能进入；入口自动带入当前页面。相关页面提供栏目下拉，具体条目可选“其他页面或具体条目”填写；期望结果提供六项常见选项，选中后仍能修改文字。两项均为选填，不影响原有的提交、回执和重试规则。选项集中维护在 `src/features/feedback/options.ts`。

## 站长怎样查看

1. 登录自己的Supabase，打开Social Commons项目。
2. 进入 **Table Editor → public → beta_feedback**，按 `created_at` 倒序查看。
3. `kind` 为类型，`description` 为问题，`expected` 为期望，`page` 为相关路径；可用 `id` 查找读者的回执编号。
4. `status` 可改为 `new`（未处理）、`reviewing`（处理中）、`resolved`（已处理）。这是后台处理状态，不向访客开放查询。

当前项目的 [反馈表直达入口](https://supabase.com/dashboard/project/dwubzeqwwsvlhbqvgldk/editor/17852?schema=public) 需要站长登录后使用。也可从Table Editor左侧找到 `articles` 下方的 `beta_feedback`；页面顶部的“Feedback”是Supabase自己的反馈入口。2026-10-23已经从正式站成功提交并在后台核对同一回执，实际验证记录见VERIFICATION.md；带“验收”的记录是维护测试。

不要把项目管理员账号或服务端密钥发给内测者。网站内暂不增加管理员收件箱，也不发送邮件；公众文章投稿与本反馈入口分开，仍未开放。

## 权限与失败处理

- `202610230002_beta_feedback.sql` 创建反馈表和 `submit_beta_feedback` 函数。表启用RLS，PUBLIC、anon、authenticated无直接读取、插入、修改、删除或TRUNCATE权限；只有有界提交函数对访客开放。
- 函数固定空search_path、完整限定表名、校验字段，不执行动态SQL；只返回随机回执ID，不返回反馈内容或列表。
- 同一编号、同一正文重复调用返回原回执，不新增记录或覆盖后台处理状态；同编号不同内容拒绝。页面等待服务器确认；超时保留输入并用同编号重试。
- 后台共享上限为每滚动分钟20条、24小时200条，直接调用函数也受限制。用短事务串行确认配额和写入，避免并发超额。此上限只服务小范围内测，不能替代大规模反垃圾系统；无需记录用户IP或设备指纹。
- 只上传主动填写的内容和一个回执编号；页面链接移除查询和片段，外部地址不保存。保留文字按普通文本阅读，不在后台或网站执行HTML。
- 更换或删除后台回执记录后，不承诺浏览器重试仍去重；不要在读者刚提交时手工删除记录。

## 部署与验证

先核对目标项目并执行本增量迁移，不重跑init.sql。使用现有 `VITE_SUPABASE_URL` 和公开客户端key，不新增或暴露service_role。反馈专用客户端不读取、持久化或刷新读者的历史登录会话。

发布前运行 `npm run check`，再在真实网页提交一条标明“验收”的反馈，核对网页回执与后台同一行；额外检查匿名角色不能读表，不能把PGlite测试写成生产验证。实际状态见VERIFICATION.md。
