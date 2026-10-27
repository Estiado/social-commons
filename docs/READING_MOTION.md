# 阅读界面与动效维护

更新：2026-10-27。本轮为既有阅读界面细化，保留纸色、衬线字、朱色链接与原有导航。

## 设计依据

- Taste继续采用已有editorial-report方向（The printed annual，种子573498991）。首页删去无信息装饰和重复英文眉题，让中文标题与正文形成层级；日新、群鉴、撷英、素材、观澜和阅读空间保持同样的克制。
- Frontend Design用于检查现有字体、留白、分区和品牌一致性。阅读与编辑为主要场景，内容清晰优先于展示动画。
- Impeccable重新加载成功，启动器引擎0.1.17及缓存位于D盘`.artifacts/impeccable`。上下文允许针对现有界面的局部细化；本轮读取animate、craft-floor、polish，逐项检查触摸、焦点、状态、排版和手机布局。机械检测结果与源码检查不替代真实浏览器查看。
- GSAP core/react用于作用域、生命周期和缓动；已有知天下的ReadingEntrance继续复用。参考[React Bits Animated Content](https://reactbits.dev/animations/animated-content)及[官方实现](https://github.com/DavidHDev/react-bits/blob/main/public/r/AnimatedContent-TS-CSS.json)的分组入场与清理方式，没有复制其整套组件或加入新依赖。
- humanizer-zh用于中文正文：删重复铺垫，说明具体人物、时间和因果；保留引语归属及尚未落实的状态。

## 实现边界

`SiteMotion.tsx`和`motion.css`负责全站增强；业务页面只加`data-page-enter`标记。标题12px、内容8px的小幅入场，约300—420ms；分组延迟总量不超过120ms。展开面板、保存状态及移动菜单使用180ms反馈。

每页一套IntersectionObserver和MutationObserver。可见目标入场后取消观察；过滤列表新节点只扫描新增子树；移除节点从待观察集合清理。useGSAP与matchMedia管理上下文，路由切换或暂停时清理。没有每张卡片的滚动监听，也没有持续全页轮询。

页面默认可见，增强失败仍可阅读。简报或新手指引打开时暂停全站入场；局部ReadingEntrance、可编辑区及嵌套标记排除。锚点导航和包含当前焦点的控件不位移，正文段落不参与入场，保护选词和划线。焦点轮廓、按下与保存反馈由共用样式维护。

系统选择减少动态效果时，GSAP不创建入场，CSS关闭状态和菜单动画。滚轮与触摸始终使用浏览器原生滚动；不使用Lenis、分页吸附或滚动劫持，不给长文加逐字动画、3D背景和持续粒子。

## 验证与后续修改

修改后运行完整check，再在真实浏览器检查1440、768、390px：导航、目录锚点、过滤、展开、输入、划线、保存刷新。截图放D盘`.artifacts`，不提交。实际结果记在VERIFICATION.md。

Taste新动效文件源码检查0 FAIL/0 WARN；独立CDP浏览器检查器未运行，实际界面通过连接浏览器人工化交互检查。Impeccable机械检测无报告项，只代表所查规则范围；不能据此宣称全部可访问性、性能或所有设备均已通过。
