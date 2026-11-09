# 正式站排版与动效精修

## 纸面排版

截图中的手机栏目菜单、议论文素材和阅读空间原先用同一种细边框标记导航、内容、分类和控件。边框让各层看起来同样突出，也消耗了窄屏的阅读宽度。新版沿用暖纸色、墨色正文、朱色强调和衬线标题，通过字号、行距、留白和字色建立层级。

- 手机菜单按宽度采用两列或三列文字导航，当前栏目用朱色、字重和 `aria-current` 标记。按 `Escape` 收起时，焦点回到菜单按钮。
- 素材词条改为直接排在纸面上的连续条目。分类、概念、摘要和适用话题分别使用不同字号或字色，展开箭头随状态转动。
- 阅读空间用文字筛选、短下划线和 `aria-pressed` 显示当前选择。选材操作条使用实色纸面，阅读记录靠留白分组。
- 首页栏目列表和全站搜索沿用同一排版。搜索、下拉和文本编辑框使用浅色底，主操作用深色实底。键盘焦点和复选框仍有清楚的轮廓。

## 动效

标题和列表沿用现有 GSAP 与 `IntersectionObserver`，各元素进入视口时轻移约 5–10 像素并淡入。手机菜单和素材展开用约 240 毫秒的短过渡。系统启用减少动态效果时关闭这些入场动画。正文和编辑器可直接操作，滚动由浏览器负责。

排版参考 Apple 的标题、说明与留白关系，入场节奏参考 React Bits。检视 Lenis 的平滑滚动实现后，本轮选择保留原生滚动。导览与工具条采用实色纸面。 [Apple MacBook Air](https://www.apple.com/macbook-air/) · [React Bits Animated Content](https://reactbits.dev/animations/animated-content) · [Lenis 源码](https://github.com/darkroomengineering/lenis)

## 维护入口

- 共用排版、字段和菜单在 `src/features/design/refinements.css`。
- 页面入场和菜单动效在 `src/features/motion/`。
- `Layout.tsx`、`EssayPage.tsx` 和 `ReadingLibraryPage.tsx` 各自保留导航、搜索、编辑和收藏的原有数据入口。

## 验收

- `npm run check` 通过，112 项测试全部通过，类型、ESLint、生产构建、Functions 和 Word/PDF 构建检查通过。
- Edge 模拟 320、390、1440 像素宽度抽查八个入口，核对装饰边框、横向溢出、素材展开和检索、阅读筛选与搜索焦点、全站搜索、手机菜单的 Escape 和减少动态效果。
- Impeccable 在两个截图页面各提示一次米色背景。纸色是既有活字风格的一部分，本轮有意沿用。
