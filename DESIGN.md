---
name: 社科通识 · 书页预览
description: 在纸页之间浏览、理解与积累
colors:
  paper: '#f3f0e8'
  ink: '#303831'
  muted-ink: '#62695e'
  accent: '#80513e'
  page: '#faf8f2'
  selected: '#d9e0ce99'
typography:
  display:
    fontFamily: 'Noto Serif SC, Songti SC, serif'
    fontSize: 'clamp(58px, 6vw, 82px)'
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: '0.22em'
  chapter:
    fontFamily: 'Noto Serif SC, Songti SC, serif'
    fontSize: 'clamp(25px, 2.3vw, 32px)'
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: '0.25em'
  body:
    fontFamily: 'Noto Sans SC, PingFang SC, sans-serif'
    fontSize: '18px'
    fontWeight: 400
    lineHeight: 1.95
rounded:
  control: '2px'
  book: '12px'
spacing:
  tight: '8px'
  control: '14px'
  page: '32px'
  gutter: '64px'
components:
  category:
    backgroundColor: 'transparent'
    textColor: '{colors.ink}'
    padding: '16px 4px'
    height: '62px'
  input:
    backgroundColor: '#e9e5d9b8'
    textColor: '{colors.ink}'
    rounded: '{rounded.control}'
    padding: '12px 14px'
  entry-selected:
    backgroundColor: '{colors.selected}'
    textColor: '{colors.ink}'
    padding: '16px 9px'
---

# Design System: 社科通识 · 书页预览

## Overview

**Creative North Star: "书页之间"**

这是 codex/book-preview 分支的设计系统。米白纸面、墨色竖排和真实古籍扫描共同建立阅读环境。物理感来自纸张弧度、侧光、书缝与明确的运动关系；工具仍以可读、可操作为准。生产站沿用 main，不能把本文件当成推广授权。

**Key Characteristics:**

- 真实字形与语义文字分工：古籍扫描构成纸面，标题和操作均为活文字。
- 目录层层进入，分类名称保持空间连续；正文自然滚动。
- 强烈表达集中于首页离场和翻页，编辑与保存保持安静可靠。

## Colors

纸白 #f3f0e8 是主背景；内页白 #faf8f2 承载栏目内容。墨绿 #303831 用于主要文字，次级墨色 #62695e 用于来源和计数，赭色 #80513e 用于焦点、当前栏目和阅读入口。选择态为半透明淡绿 #d9e0ce99。

在纸白实色上的文字对比度：主文字10.62:1、次级文字4.98:1、赭色5.83:1；这些是明确实色组合的计算，不代表所有图片像素及混合状态均已测试。

## Typography

品牌、章目和篇名沿用 Noto Serif SC，工具与正文预览沿用 Noto Sans SC；字体来源及fallback由 src/index.css、src/tailwind-theme.css维护。首页品牌最大82px，章目25–32px；手机品牌42–48px、章目21px。栏目标题36–50px，分类25–32px，预览正文18px/1.95，手机17px。

竖排仅用于总目录。长篇正文、检索、来源与私人文稿保持正常阅读方向；不为表现纸面而扭曲正文。

## Layout

桌面栏目页为左右跨页，容器最大1340px，外侧72px，内侧44px，书缝间隔64–102px。章节标题印在左页，不能压在书缝上。左页分类每页6项、篇目每页8项，右页显示当前篇目及来源；搜索不混入私人内容。

700px及以下改为单页。首页600px及以下采用三列、两组的竖排章目；44px点击宽度不缩。380px及以下阅读空间使用有明确名称的图标入口。正文和私人工作台沿用既有内容宽度及功能合同。

## Elevation & Depth

漂浮文字使用0 26px 20px #484b3422的纸面投影，悬停拉开为0 38px 24px #484b3438。跨页的渐变、窄书缝及纸叠边缘只用于模拟用户指定的纸张材质，不能作为通用卡片装饰。

翻页以半页枢轴和正背面为基础，分三段弯曲；古籍纸面仍使用真实扫描像素。底部雾层局限于27%高的独立画布，85%透明，最大640×190绘制，24fps上限；后台、离屏和暂停状态停止循环。减少动态效果时静止。

## Shapes

工具以小圆角和平直面为主。书页使用5px/12px的不完全对称角与纸叠轮廓，含义是书页而非卡片。焦点统一使用2px赭色轮廓及5px偏移。

## Components

分类行是文字加篇数，不为每一类添加图标或卡片。选择后分类文字成为篇目页标题；返回时恢复分类分页。篇目显示选中态，右页始终是真实条目的摘要与原链接。

搜索有可访问名称。使用指引提供预览版8步和16步路径；减少动态效果下的必要焦点转移仍执行。云雾有暂停按钮。

公开路由使用翻页。私人阅读空间、编辑器、反馈、修饰键链接和页内锚点由原导航处理；另一次导航优先于尚未结束的翻页。Escape结束当前转场。

## Do's and Don'ts

- Do 保留真实来源、稳定ID、原生选字、收藏、划线、备份与导出。
- Do 用字体、布局、光线和连续运动表达书页关系。
- Do 在手机、键盘和减少动态效果下提供完整路径。
- Don't 用生成汉字代替古籍扫描，或把私有网站代码当成已获授权源码。
- Don't 给正文加滚动锁定、强制分页或不必要的舞台动画。
- Don't 将预览合并到main，或将预览连接到正式服务。
