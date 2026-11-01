# 阅读入口 · Impeccable audit / polish

2026-11-01，Asia/Shanghai。限定范围：公开目录点击“翻开阅读”到原阅读器。遵循用户“淡入先不改”的最新决定，不替换章节翻页条件，不改正式站。先检查中间帧与代码、修复，再进行本轮最终技术审查；此报告不取代其他页面的历史审计。

## Implementation integrity verdict

限定范围通过。篇名是同一内容单元在两种阅读布局之间的连接：0.42秒纸色退场后保留篇名，再按真实字符及换行位置用0.95秒接入目标标题。目标标题接棒前隐藏，旧目录卸载后才显现新正文，不把两页文字混合叠放。手机和桌面均使用DOM字形，不光栅化正文或私人资料。

修复前的具体问题：整页先消失，导致篇名身份中断；`/essay?id=…`同路径导航绕过动效；私人懒加载入口和浏览器返回可能被未完成的旧导航覆盖；观澜正文三个同级组件使用相同key。当前代码分别以独立阅读入口时间线、query分支、即时取消和有类型前缀的key修复。

## Audit Health Score

| 维度 | 分数 | 证据与边界 |
| --- | ---: | --- |
| Accessibility | 3/4 | 临时舞台aria-hidden、inert、不可点击；结束恢复main焦点与文字，键盘Enter、减少动态可达正文，Esc可跳过。未做完整读屏验收。 |
| Performance | 3/4 | 仅预备所选公开阅读器，最多160字符，集中测量后仅动画transform/opacity/color，旧新段落不双渲染；4秒准备预算与完整清理。本机完成约1.57–1.97秒，不是全设备FPS保证。 |
| Theming | 3/4 | 新纸面取既有paper token，墨色与字体取源和目标实际样式，无新增照片或伪造内容。旧色值/字号维护提示保留。 |
| Responsive | 3/4 | 六栏覆盖319/390/1024/1440宽；窄屏重排按真实Range测量，正文滚动、无横溢出。触摸为合成事件，未做真实手机手势验收。 |
| Implementation Integrity | 4/4 | 首页和跨章合同保留，篇名与正文真实匹配、素材定位正确，最后导航优先，故障回到现有恢复界面，无临时层残留。 |
| **合计** | **16/20 · Good** | 仅针对上述检查范围，不代表全站WCAG或跨引擎认证。 |

## Findings

本轮限定范围未复现未解决P0/P1/P2，P3=1。

### [P3] 原有纸材色和响应字号仍需维护标尺

- 位置：`src/features/book/book.css`、`DESIGN.md`。
- 类别：Theming / Implementation Integrity。
- 证据：最终detector扫描4个相关源文件，共48 advisory：8颜色、40字号，0 primary；新阅读入口未增加字面色值或固定字号。
- 影响：维护一致性成本，当前未造成阅读受阻。照片与投影的材质特例不能机械当成WCAG失败。
- 建议：后续`$impeccable document`整理共享标尺，按需`$impeccable polish`，最后`$impeccable audit`。不在此轮扩展为主题重构。

## 验证与限制

- `.artifacts/book-preview/check-reader-final.log`：完整check通过，113/113。生成Word/PDF仅证明导出链路可运行，不证明每页排版。
- `reader-prod-qa.json`：Edge生产构建六栏中间状态均旧目录已卸载，移动标题存在且目标标题隐藏；完成后舞台0、inert=false、opacity=1、隐藏标题0，全部无横溢出及pageerror。正文原生滚动、Enter、减少动态及中断路径通过。
- `reader-fault-qa.json`：2.5秒模块延迟期间保留篇名，完成正文；阻断模块时显示现有重载错误页，所有临时层清空。到达正文后的SPA Back返回目录、快速切栏采用最后目标。错误注入不等于线上真实故障。
- `reader-short-screen.json`：319×320短屏真实标题起点y=-229.7px，移动字形为0，正常淡入正文后舞台0、inert=false、无隐藏标题；没有通过伪造屏内位置掩盖裁切。
- 对开发中帧、生产构建中帧及落定帧实际看图复核；未将截图数量、detector提示数量或旧代理评分当作本轮流畅性分数。
- 未做Safari/Firefox、真机触控、原生200%缩放、完整读屏、长时内存及真实私人保存/数据库验收。测试中“阅读空间”仅验证取消与可达性，没有读取或截取私人正文。

润色保留既有字号、纸色、阅读宽度和业务文案，只让篇名、纸面与正文在一次阅读动作中连续。相关实现为`readerArrival.ts`、`BookMotion.tsx`及`book.css`；同级key修复在`GuanlanEventPage.tsx`。
