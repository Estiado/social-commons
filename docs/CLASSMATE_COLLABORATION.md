# 和同学一起维护网站

公开仓库允许大家查看、下载和复制代码，不会自动授予修改原仓库的权限。网站访客也不会因为访问网页而获得 GitHub、Cloudflare 或数据库权限。

## 推荐方式：Fork → 修改 → Pull request → 你确认合并

1. 同学点击 GitHub 右上角 **Fork**，创建属于自己的副本。
2. 在自己的副本创建分支并修改。先读本仓库 README 和 `docs/REPOSITORY_GUIDE.md`，一次解决一个明确问题。
3. 点击 **Contribute → Open pull request**，把修改作为提案交给原仓库。
4. 你在 **Files changed** 查看改了哪些行；绿色新增、红色删除。等待 **Checks** 通过，并在预览网址确认效果。
5. 你决定是否 **Merge**。合并后才进入 main，随后 Cloudflare 自动发布。

同学删掉自己 Fork 中的文件，不会删掉你的原仓库。没有写权限的人提交的 PR，也不能自行替你合并。不要把账号密码、数据库服务端密钥或 Cloudflare 管理权限给同学。

## 如果邀请 Collaborator

这是个人账号仓库：Collaborator 通常有写入权限，能推送修改；因此不能把“已邀请协作者”和“只能提建议”混为一谈。需要约束直接修改 main 时，仓库所有者应在 **Settings → Rules → Rulesets** 或 **Branches** 检查分支保护：要求 PR、要求检查通过、禁止强制推送和删除主分支，并核对管理员绕过范围。

本轮没有邀请成员、扩大权限或宣称保护已经开启。保留所有权、让同学使用 Fork+PR 是当前建议。

Git 的提交历史通常能恢复误改的代码；它不备份浏览器私人文章、数据库内容、账号权限和被清除的历史。不要把可恢复代码理解为可以随意删除任何资料。

## GitHub 页面对应什么

| 页面 | 用途 |
| --- | --- |
| Code | 当前文件、README、分支和提交历史 |
| Commit | 一次保存的改动快照，编号用于准确指认版本 |
| Issues | 记录问题、需求和复现步骤 |
| Pull requests | 提交修改提案，审查后合并 |
| Actions / Checks | 自动执行类型、回归与构建检查；绿色不代表所有业务都已实测 |
| Settings | 权限、默认分支、规则和仓库设置，由所有者维护 |

GitHub 保存源码和历史，Cloudflare 把构建后的网页提供给访客，Supabase 负责已启用的数据库服务。这三个服务的权限分别管理；当前阅读空间的私人内容保存在访客自己的浏览器。

官方说明：[个人仓库权限](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/repository-access-and-collaboration/permission-levels-for-a-personal-account-repository)、[分支保护](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)。
