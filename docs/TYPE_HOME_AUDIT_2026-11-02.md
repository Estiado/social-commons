# 活字首页实体边缘审查 · 2026-11-02

范围：独立codex/type-preview首页的实体收边、交互、回退及进入/返回阅读路径。自审与实际Edge浏览器验证，不冒称全站审查、最终视觉确认或物理真机验收。

## Implementation Integrity：通过（限本范围）

实拍城垛原描边决定完整字模排布；已移除全层PNG裁切、边缘二值锁定与无限底板。原字体/镜像/材质来源保持；每个可见边缘样本均响应。运行时与静态图不再叠显，透明快照和同纸色衔接实测。未改业务数据和正文模型。

| 维度 | 分数 | 依据与限制 |
| --- | ---: | --- |
| Accessibility | 3/4 | DOM链接、可见2px键盘焦点、暂停和减少动态保留；装饰场景aria-hidden；未做完整读屏验收。 |
| Performance | 3/4 | 三个实例网格，桌面当前保留502个字位、按需帧、无React逐帧状态；原4K贴图首载体积仍大。 |
| Theming | 3/4 | HTML/WebGL共享五段纸色、静止深度连续混合；正文不变，物理材质色仍是首页局部标尺。 |
| Responsive | 3/4 | 五视窗无横溢出、107边缘样本全部响应；模拟触控和原生滑动通过；缩放为720×450/DPR2等效布局，非浏览器原生缩放及实体手机。 |
| Implementation Integrity | 4/4 | 完整实体、原始描边可追溯，透明静态回退及路由释放验证；不生成长城或伪汉字。 |
| **合计** | **16/20 · Good** | 不代表所有硬件全程60fps或最终审美定稿。 |

## Findings

- **[P2] 原高分辨率字面/高度图首载较大**：约2.8MB与1.8MB，网络慢时先显示同场景静态图。建议后续`$impeccable optimize`按设备提供小尺寸贴图；本轮未更换材质或模糊真实字形。
- **[P3] 静态回退仍保留动效按钮**：无WebGL时画面可用，但暂停按钮没有实质动画可控制；不是阅读阻断。后续可按场景状态隐藏或改成静态说明。
- **[P3] 物理材质色仍为局部标尺**：纸色已共享，其余光照/木材颜色尚未抽成跨页面设计标尺，后续`$impeccable document`整理，不借机改正文。
- Impeccable实际URL detect仅`cream-palette` warning（exit2）。米白为用户指定，人工复核后保留；没有屏蔽规则伪造零告警。无本轮新发现P0/P1。

## 实际验证

- `type-edge-check.log`及`type-edge-check-exit.txt`：完整check退出0；121/121，类型、ESLint、前端、Functions与导出通过。
- `type-edge-layout-qa.json`：1440×900、768×1024、390×844、320×740、720×450共107个边缘字模均响应；mask为none，poster在动态场景就绪后隐藏，最小采样升起量>0.11。暂停稳定；回落后active/edgeActive=0且无待执行帧；减少动态静止。
- `type-edge-touch-qa.json`：手机边缘轻点4块响应；回落静止；CDP原生触摸滑动scrollY=104；无WebGL显示手机透明静态图、六个章节链接可用；DPR2等效缩放无溢出。
- `type-edge-navigation-qa.json`：首页接棒仅1ghost，ghost中poster隐藏，截图角落alpha=0且保留共享渐变。进入议论文素材后0字阵/ghost且main非inert；返回1场景。正文固定2秒采样仍有inert，仅作中间帧记录，不能冒充结束验证。
- `type-edge-reader-settled.txt`：等待正文实际转场结束，缓存场景1778ms后main非inert、readerLayers=0。正文可原生滚动；Escape及快速后退清理临时层。
- `type-edge-production-qa.txt`：构建产物边缘响应、alpha=0、无全层mask、手机无溢出；用户当前正文深链接无字阵/ghost且main非inert，无pageerror。
- `type-edge-detect.json`：上述一条配色警告。截图、原生浏览器缓存和日志仅留`.artifacts`，不入Git。

## 后续边界

实体手机、Safari/Firefox、原生浏览器200%缩放和低端GPU长时间帧率仍未验收。原材质作为试用保留，不把当前确认的实施方案等同最终视觉认可。
