# 翻页选型：B已确定

2026-10-30。用户已选择B，并进一步指定：首页词条成为栏目标题，摊开的书自然浮现；此段不翻页。后续公开栏目与文章导航使用独立实现的连续曲面纸页。

实现：`homeArrival.ts`负责逐字共享位置与云中离场；`PaperTurn.ts`、`paperMesh.ts`负责88×16网格、弧长积分、正背面纹理和投影；`paperSnapshot.ts`仅在转场时绘制当前可见公共DOM文字，不截取私人工作台，也不替换真实HTML阅读器。3D部分按需加载，无新增依赖。旧三段DOM折板已删除。

## B：连续3D纸页（建议先看）

演示：https://r3f-animated-book-slider-final.vercel.app/

源码：https://github.com/wass08/r3f-animated-book-slider-final

已实际打开并点击Page 1，确认页面显示连续弯曲的书页与投影；代码使用Three.js的SkinnedMesh/Skeleton及30段纸页网格。这里借鉴纸张形变，不采用紫色舞台、营销文字或摄影素材。仓库的GitHub许可字段为空、package.json也未声明许可，不能直接拷贝为本站源码；本轮已独立实现曲面几何与光照。额外WebGL成本高于A，应只加载当前转场需要的页面，正文继续用HTML。

## A：React PageFlip / StPageFlip

演示：https://nodlik.github.io/react-pageflip/

源码：https://github.com/Nodlik/react-pageflip

核心：https://github.com/Nodlik/StPageFlip

已实际点击Next page，React演示从封面进入2–3页；支持HTML、软/硬页、横竖屏与手机，源码MIT。适合保留活文字和现有React阅读流程，集成成本较低。核心原生演示因外部Popper CDN失败出现tooltip异常，改用React演示观察，不能把原生演示失败说成运行无误。它的“卷页”与B的连续三维纸面不是同一视觉效果。

## 已检查但未列为主要推荐：DearFlip

官方JS站：https://js.dearflip.com/

价格与授权：https://js.dearflip.com/pricing/

这是成品PDF/图片3D阅读器，需商业授权，更偏电子刊物展示。本网站核心是可检索、收藏、划线和自然滚动的网页正文，因此没有把采购成品阅读器作为默认方向。未购买、安装或复制其代码。

## 选择边界

用户已确定B，本轮按其后续首页衔接要求实施。无论选A或B，都保留米白古籍纸面、现有品牌与正文原生滚动；不把示例的全套视觉或控制栏照搬。效果仍待用户审阅，不把实现完成当成用户已接受真实性。
