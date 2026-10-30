# 翻页候选：等待用户选择

2026-10-30。用户明确指出现有分段旋转不真实、过快。此文仅研究候选，不授权替换。当前预览的旧翻页保留；本轮只修复云雾与文字飘落。

## B：连续3D纸页（建议先看）

演示：https://r3f-animated-book-slider-final.vercel.app/

源码：https://github.com/wass08/r3f-animated-book-slider-final

已实际打开并点击Page 1，确认页面显示连续弯曲的书页与投影；代码使用Three.js的SkinnedMesh/Skeleton及30段纸页网格。这里借鉴纸张形变，不采用紫色舞台、营销文字或摄影素材。仓库的GitHub许可字段为空、package.json也未声明许可，不能直接拷贝为本站源码；若选此效果，需要独立实现曲面几何与光照。额外WebGL成本高于A，应只加载当前转场需要的页面，正文继续用HTML。

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

只在用户确定后实现下一版翻页。无论选A或B，都保留米白古籍纸面、现有品牌与正文原生滚动；不把示例的全套视觉或控制栏照搬。本轮不宣称已修复翻页真实性。
