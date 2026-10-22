# 内容来源与发布约定

更新：2026-10-22。用户要求名句评述有已发表的真实依据，原创观点必须明确标注。

## 名句与评析

- `quotes.ts` 保留旧 50 个 ID，新增至 70 个 ID；去重推荐 60 篇。无法对应具体公开出处的旧评析已撤下，不再以名家或“研究学者”的名义展示。
- `quoteCommentaries.ts` 只发布逐条核验的资料摘要，必须有具体作者、文章/论文/版本、原文 URL、核验日期与 verified 状态。统一标注“依据已发布资料整理，非逐字引语”。
- 当前 31 篇去重作品具有已发表资料摘要；其余不显示虚构评析或将待办提示混进正文。相同作品的旧 ID 保留，不伪装成多份证据。新增摘要分组在 `quotes/publishedCommentaries.ts`，来源范围见 `CONTENT_SOURCES.md`。
- 笼统书名、名家身份或网站域名不能充当某段评析的证据。资料观点不表述为唯一结论。
- 不编造引号中的名家原话，不用 AI 解释冒充论文引述。本站推荐理由和使用提示标明“本站整理”或“整理者观点”。
- 名句版本与译文核验和评析核验分开。q8、q10 署名/篇目尚待核对；q29 区分书信篇目和合编书名；q14/q22/q48 修正为悼念 Wolf Graf von Kalckreuth 的《安魂曲》。不能据评析有来源推断所有译文已核验。

维护流程：打开原页/论文 → 查到支持说法的段落 → 写短摘要并注明整理性质 → 填 URL、作者、版本、日期 → 核对未扩大原意 → 检查并提交。未找到证据时保留待核验状态。

## 个人素材与站方示例

读者素材存于 `social-commons:concept-materials-v1`，按概念分组，可增改、删除、JSON 备份与恢复，不上传公共表。旧自定义概念素材保留可读，并可复制到新编辑器。

站方示例入口为 `essayExamples.ts`，新增分组在 `essay/reasoningExamples.ts`，共 17 条；`npm run seed:examples` 生成 SQL。`essay_examples` 访客只读；只有服务端维护的 `site_editors` 名单可以写，普通账号不能自行加入名单。研究摘要和虚构教学设例分别标明，不是媒体全文。数据库同 ID 编辑覆盖静态示例，未同步的旧种子不会使新增示例消失。

用户决定先本机内测，邮箱和在线编辑默认关闭。维护者可编辑数据文件、运行 seed、检查并推送发布推荐；未来邮件功能验收后，启用 `VITE_READING_CLOUD_ENABLED=true`，再使用 `/editor/materials` 在线管理。

编辑账号须先验证邮箱，再由可信 Supabase 管理员核对账号后执行以下语句。替换占位邮箱，检查只返回预期账号；不得做成前端接口。

```sql
insert into public.site_editors(user_id)
select id from auth.users
where lower(email) = lower('YOUR_VERIFIED_EDITOR_EMAIL')
  and email_confirmed_at is not null
  and not coalesce(is_anonymous, false)
on conflict do nothing
returning user_id;
```

这只授予公开示例编辑权，不允许读取他人的私有全文和摘录。
