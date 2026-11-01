# 连续卷纸选型与实现

2026-11-01。用户在查看卷纸/撕纸/揭角候选后表示“倾向第一种……可以试试”，因此本版采用 Paperlab 连续卷纸，取代早期 B 连续翻页。首页词条直接成为章节标题、摊开的书浮现，此段不卷页。用户先要求动态截屏、随后撤回，未制作或交付录屏。

## 当前：Paperlab 连续卷纸

- 实际演示：https://paperlab.nawwara.studio/editor/
- 官方源码：https://github.com/NourMtir0722/Paperlab
- 固定ref：`41914833cb9ae12b32a8cbbdee4723f5b12158af`。
- 适配源码：`packages/paperlab/src/deformers/roll.ts` 与 `behaviors/unroll.ts`；Apache-2.0，版权 Noor Mtir。完整许可与NOTICE在 `public/book/licenses/`。

`rollGeometry.ts`适配缩紧螺线的连续形变，256×2网格；`RollTurn.ts`使用原生WebGL绘制源页、目标及纸背光照。没有安装Paperlab编辑器或Three/R3F全套依赖。跨章2.55秒，正文往返1.35秒，GSAP `sine.inOut`推进；不是对示例界面、品牌或文章的复刻。

`BookMotion`先准备源与目标，`domSnapshot/snapshotFonts`保留当前公开DOM的真实字体、图标、控件、行分隔与目录滚动位置。照片alpha作为纸张轮廓，共用视口坐标，避免把两个main的不同边距误当作书框。捕获每侧限2.4秒；失败或无WebGL使用正常导航。旧 `PaperTurn/paperMesh/paperSnapshot` 已删除。

转场期间正文inert且aria-busy；导航栏保留响应。最新有效导航、浏览器返回、Escape、resize与减少动态效果都会结束旧事务并释放GL资源；结束后焦点回到main。私人阅读空间、编辑器、反馈、锚点与修饰键链接不接管。

## 已实际研究、未采用

| 候选 | 演示与源码 | 边界 |
| --- | --- | --- |
| 中央撕纸 | https://interlude.crnacura.workers.dev/transitions/tear/ · https://github.com/codrops/interlude | MIT；用户未选，未导入实现 |
| 纸角揭起 | https://interlude.crnacura.workers.dev/transitions/peel/ · 同上 | MIT；用户未选，未导入实现 |
| 早期B连续3D纸页 | https://r3f-animated-book-slider-final.vercel.app/ · https://github.com/wass08/r3f-animated-book-slider-final | 未声明代码许可；当时只借鉴可见形变、独立实现，现已被卷纸替代 |
| React PageFlip | https://nodlik.github.io/react-pageflip/ · https://github.com/Nodlik/react-pageflip | MIT；已实际点击Next page，未采用 |
| DearFlip | https://js.dearflip.com/ | 商业阅读器；未购买、未安装、未复制 |

实现通过不等于用户已接受真实感。中间帧、快速导航及阅读往返的证据和未测设备范围见 [验收](BOOK_PREVIEW_VERIFICATION.md) 与 [最终audit](BOOK_PREVIEW_AUDIT_2026-11-01.md)。
