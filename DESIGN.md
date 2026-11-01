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
  book: '0px'
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

纸白 #f3f0e8 是主背景；栏目文字直接呈现在局部去除旧墨的真实书页照片上。墨绿 #303831 用于主要文字，次级墨色 #62695e 用于来源和计数，赭色 #80513e 用于焦点、当前栏目和阅读入口。选择态为半透明淡绿 #d9e0ce99。首页云层为冷白、极浅蓝灰，不把山水照片或山脊造型带入栏目页。

在纸白实色上的文字对比度：主文字10.62:1、次级文字4.98:1、赭色5.83:1；这些是明确实色组合的计算，不代表所有图片像素及混合状态均已测试。

## Typography

品牌、章目和篇名沿用 Noto Serif SC，工具与正文预览沿用 Noto Sans SC；字体来源及fallback由 src/index.css、src/tailwind-theme.css维护。首页品牌最大82px，章目25–32px；手机品牌42–48px、章目21px。栏目标题36–50px，分类25–32px，预览正文18px/1.95，手机17px。

竖排仅用于总目录。长篇正文、检索、来源与私人文稿保持正常阅读方向；不为表现纸面而扭曲正文。

## Layout

桌面栏目页为左右跨页，最大1340px；实拍底板向外延展，正文横向留白110px，在1000px宽且700px高以上约束书本在首屏，左右页内部滚动。章节标题印在左页，不能压在书缝上。左页分类每页6项、篇目每页8项，右页显示当前篇目及来源；搜索不混入私人内容。

700px及以下改为单页。首页600px及以下采用三列、两组的竖排章目；44px点击宽度不缩。380px及以下阅读空间使用有明确名称的图标入口。正文和私人工作台沿用既有内容宽度及功能合同。

## Elevation & Depth

漂浮文字使用0 26px 20px #484b3422的纸面投影，悬停拉开为0 38px 24px #484b3438。整本书使用用户提供的实拍轮廓、书缝、纸层和自然老化；仅阅读区局部去旧墨。页块叠加真实敦煌壁画植物裁片与照片明暗，另加接触阴影；彩绘边不加文案。可编辑源和再生成脚本均保留，不用渐变矩形替代整张实拍。

首页点击采用共享字形过渡：所选字沿连续路径变为栏目标题，实拍书同时浮现，其余字约3秒融入云层，此段不卷纸。之后公开导航采用Paperlab适配的连续卷纸（256×2网格、收紧螺线）：跨章2.55秒，正文往返1.35秒。源与目标共用视口坐标，照片alpha限定移动纸的真实边界，HTML原行分隔保留，卷纸结束恢复活文字。捕获超时、无WebGL则正常导航，不能呈现残缺或旧纹理。

云海只在首页：画布从场景30%处开始，高72%；CSS .95、材质alpha上限 .96，最大约91%遮挡，稀疏处仍见古籍字迹。六组有界弹簧云团受鼠标推动、抬升再回聚，不是二维液体擦除。最大720×360、24fps；指针与暂停用ref，不逐帧触发React渲染。后台、离屏和减少动态效果停止运动；WebGL不可用显示同图静态回退。目录落地页不加雾、不塑造山势。

## Shapes

工具以小圆角和平直面为主。书本外形来自照片蒙版，取消人造圆角纸板。焦点统一使用2px赭色轮廓及5px偏移。

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
