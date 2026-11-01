# 绑定单页翻动：当前选型

2026-11-01。用户在卷纸试验后提供36.61秒的翻书视频，要求试做同类效果，并强调阴影及纸色必须与古书背景一致。随后指出活动页仍复制了书边、厚页层，形成明显拼贴。当前实现据此改为固定书身、独立单页；卷纸已退役。视频只作用户提供的视觉参考，未获得原网页或源码，不将视频、截图或未知来源代码作为站点素材发布。

## 当前实现

- `BookLeafTurn.ts`：独立WebGL单页，正背面取同一实拍的纸色与色斑；深色书边像素与页缘刷边由内部纸纹修复，不把半本书翻起来。9层低透明度柔影随弯曲移动，书身、厚页块及外轮廓固定。
- `leafGeometry.ts`：72×12网格，积分切线形成连续弯曲；轮廓从实拍明亮纸面取样并平滑，两面共享固定书缝。前后章节方向对应，均2.55秒。
- `domSnapshot.ts`：只对公开目录解码一次SVG透明墨层，原字体/图标/输入/实际行分隔/内部滚动位置保留；与真实照片合成完整静帧，活动页只带墨与纸纹。源、目标在同一视口坐标中。
- `BookMotion.tsx`：完整书本能容纳的桌面使用单页；手机、短屏、正文和总目录往返采用0.24秒退入纸色、0.48秒显现的顺序交接。旧、新正文不相互淡显，不截图长文；首页所选词条成为章节标题的专用衔接保留。
- 最新导航、Back、Escape、resize、减少动态效果会结束旧事务、恢复main焦点并释放资源。私人阅读空间、编辑器、反馈、锚点及修饰键链接不接管，不读取私人字体内容。

实现完成不等于真实感已获用户接受。最终证据与未测设备见 [验收](BOOK_PREVIEW_VERIFICATION.md) 和 [audit](BOOK_PREVIEW_AUDIT_2026-11-01.md)。

## 已研究和退役的方向

| 候选 | 来源 | 当前边界 |
| --- | --- | --- |
| Paperlab连续卷纸 | https://paperlab.nawwara.studio/editor/ · https://github.com/NourMtir0722/Paperlab | 用户曾授权试验；固定ref `41914833cb9ae12b32a8cbbdee4723f5b12158af`的Apache-2.0适配已删除。许可和NOTICE保留为旧版来源记录，当前单页几何独立实现。 |
| 中央撕纸、纸角揭起 | https://interlude.crnacura.workers.dev/transitions/tear/ · https://interlude.crnacura.workers.dev/transitions/peel/ · https://github.com/codrops/interlude | MIT，实际查看，未采用。 |
| 早期B连续3D书 | https://r3f-animated-book-slider-final.vercel.app/ · https://github.com/wass08/r3f-animated-book-slider-final | 未声明代码许可，仅参考可见形变；早期独立实现已退役。 |
| React PageFlip | https://nodlik.github.io/react-pageflip/ · https://github.com/Nodlik/react-pageflip | MIT，实际点过Next page，未采用。 |
| DearFlip | https://js.dearflip.com/ | 商业阅读器，未购买、安装或复制。 |

用户曾要求动态截图、随后撤回；本轮只检查实际中间帧，没有制作或交付演示录屏。
