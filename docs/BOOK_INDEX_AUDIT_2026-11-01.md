# 左页目录与撷英 · Impeccable audit / polish

2026-11-01，Asia/Shanghai。范围：六栏左页全部篇目、返回分类，以及撷英的分卷／时期／作者／作品索引。只发布独立预览，保留既有淡入、阅读入口标题接棒和正文模型。

## Implementation integrity verdict

本轮限定路径通过。修复前已复现：点全部篇目后继承左页413px滚动量，目标标题y=78px，body级浮字越过书面；原动效把新列表设为0透明，令切换阶段呈现空白。未据此声称发生作品数据丢失，也不把上一轮未覆盖该起点的audit当作本次反证。

现在左页分层独立挂载、切层滚动归零、临时文字仅在左页裁切区内按transform移动，整列不隐藏，仅从.82显现。字体或换行不匹配、屏外目标走淡入。列表转向其他章节前同步清理，临时文字不进入跨章快照。中断恢复真实标题与视图状态；目录路径和返回目标保持可操作。

撷英增加与纸面目录一致的中外—时期—作者／典籍—作品索引，计数来自现有100篇规范作品。旧ID、作品来源和署名异说保留；编目依据及明确的待考策略见[编目说明](BOOK_QUOTE_DIRECTORY.md)。

## Audit Health Score

| 维度 | 分数 | 证据与限制 |
| --- | ---: | --- |
| Accessibility | 3/4 | 返回与新路径控件44px，临时层aria-hidden且不响应指针，结束恢复可见焦点；Enter、减少动态、中断验证。未做完整读屏与全站对比度验收。 |
| Performance | 3/4 | 一个左页临时层，集中读位置、transform/opacity动画，完整监听与时间线清理；新编目仅元数据，不加载全站正文。未做低端真机与长期内存测试。 |
| Theming | 3/4 | 使用原纸色墨色、宋体与透明书页，13px目录小字共用token；旧材料和断点字号维护项保留。 |
| Responsive | 3/4 | 四屏宽、六栏全部篇目往返，层级标题可见、无横溢出，手机定位新层级开头；未测真实手机手势或Safari/Firefox。 |
| Implementation Integrity | 4/4 | 分期、作者、作品索引可追溯；原文未改，旧作者链接兼容，编目回归检查无漏篇或重复计数，未知归属不猜测。 |
| **合计** | **16/20 · Good** | 仅代表实际检查范围。 |

## Findings

本轮限定范围未复现未解决P0/P1/P2，P3=1。该结论不覆盖所有私人工作台或外部数据服务。

### [P3] 原有纸材颜色与响应字号仍有维护成本

- 位置：`src/features/book/book.css`、`DESIGN.md`。
- 类别：Theming / Implementation Integrity。
- 证据：最终源码detector 45 advisory，8色值、37字号，0 primary。目录13px小字已抽成共享token；照片和投影仍是材质语境，不机械当成WCAG错误。
- 影响：后续维护标尺的成本，未复现当前流程受阻。
- 建议：后续`$impeccable document`继续整理字号标尺，再`$impeccable polish`、`$impeccable audit`。不在本轮改成全站主题重构。

## 验证依据

- `.artifacts/book-preview/index-check-final-ship.log`：完整check，116/116。
- `index-qa-confirmed.json`：64组目录流程，以已提交目录状态与真实动画清理为等待条件，六栏四屏宽、撷英层级、分页、旧链接、检索及中断，无pageerror、横向溢出或结束后隐藏行／浮字。
- `index-prod-final.json`：最终生产构建同64组，无上述遗留或脚本错误。`index-crossflow.json`确认作者目录→正文→Back保持原层级、前后scrollY均1010px，返回总目录和开始即减少动态均清理完成。
- `index-race.json`：真实点击后80ms脚本注入第二导航，捕获时确有1个浮字及.82视图；全局导航捕获前清至0浮字／0隐藏标题，最终stage=0、inert=false。第二次点击是定时注入，不冒充物理触控。程序自身归零的scroll事件已与真实滚动区分。
- `index-audit-final.json`：detector的45 advisory、0 primary；中间帧与落定帧均人工看图复核，未将“没有扫描告警”替代视觉判断。

触摸手势、读屏、原生200%缩放、跨浏览器、长期显存及真实私人保存未验收。时期为阅读索引，不声称完成作者生平或作品成书年代的全量文献考证。先前audit中的旧评分只作历史记录，不是本轮的独立子代理评分。
