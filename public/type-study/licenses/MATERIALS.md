# 活字首页素材说明

当前是独立首页原型，保留用户所给的整屏构图。用户已认可Declan Sun旧活字实拍作为取材备选，本轮试用其磨损细边与积墨，未宣称最终视觉定稿。旧版和正式站不更新。

- 长城原图：https://commons.wikimedia.org/wiki/File:The_Great_Wall_of_China_at_Jinshanling-edit.jpg 。摄影 Severin.stalder，Brandmeister调色；CC BY-SA 3.0：https://creativecommons.org/licenses/by-sa/3.0/ 。原图与派生轮廓同许可，和软件许可分开。原件和前景城垛像素坐标在 design/type-study/source，页面只用羽化轮廓，不显示长城石墙或山体。
- 当前临时木纹：Poly Haven Wood Table 001，https://polyhaven.com/a/wood_table_001 ，CC0：https://polyhaven.com/license 。摄影木纹有调色、去光泽；不冒称实拍古活字。用户要求后续用纪录片旧字模边框改进，尚待确定。
- 字形：Noto Serif CJK SC SemiBold，官方 https://github.com/notofonts/noto-cjk ，固定ref f8d157532fbfaeda587e826d4cd5b21a49186f7c，OFL-1.1见Noto-OFL.txt。真实字形排成1000字纹理并整体镜像，无生成伪字。源字体不随站点下载。
- 原文：https://zh.wikisource.org/wiki/千字文 。原作公有领域，不复制现代注释。源文本1000个Unicode字符保留；无字库覆盖的𡓜显示为通行异体牆。
- Three.js 0.187.0 / r187，https://github.com/mrdoob/three.js/tree/r187 ，MIT全文见Three-MIT.txt。参考官方实例化示例，首页独立实现。
- 静态回退type-home-static.webp来自实际首页三维渲染，不使用生成草图。

纪录片候选只作选材参考，版权归原权利人，未冒用CC0：
- 中国非遗网《梨墨刻印 匠心描摹》：https://www.ihchina.cn/news_1_details/28313.html ，中国非遗保护中心资源采集成果，2018年拍摄，河南华之杰制作。
- 《谱师家族的传承故事》：https://www.ihchina.cn/project_details/28393.html 。
- 《了不起的匠人》第12集《东源村的修谱师》：尚在核对可用特写，报道照片不直接作为最终贴图。

生成草图、被用户否定的博物馆照片、人物/字幕/风景视频帧均未作为正式首页材质。

## 本轮实拍做旧试用

2026-11-01用户回复“这张质感可以，作为取材备选”。来源：https://unsplash.com/photos/close-up-of-antique-wooden-letterpress-type-blocks-JzcEdsEy1hg ，摄影Declan Sun；页面列出SONY ILCE-7RM5，2026-04-16发布；使用Unsplash License：https://unsplash.com/license ，不是CC0，也不是纪录片截帧。

取材原件为2000px下载版本，保存在design/type-study/source/old-type-photo-reference.jpg；原图坐标、透视四边形与细边裁切在old-type-edge-source.json。只取真实磨损边缘的窄条与积墨明暗，转换为深木色，不复制源照片中的旧字形。字身摄影木纹仍来自Poly Haven；新字面仍由Noto真实字体排成。派生纹理不冒称整张古活字照片，也不把Unsplash照片混标为CC0或软件MIT。
## 2026-11-02 实体边缘
原金山岭照片与描边归属及许可保持不变，当前只用描边决定完整字模的静止排布；PNG蒙版退役，不再作为运行时裁切。桌面和手机WebP是现有真实字形、授权纹理与该排布的透明截图，未更换来源或生成长城照片。材质备选仍为试用，不等同最终视觉确认。
