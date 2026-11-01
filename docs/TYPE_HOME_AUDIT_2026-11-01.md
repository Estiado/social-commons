# 活字首页技术审查 · 2026-11-01

范围：codex/type-preview整屏首页、手机升降、原选章标题接棒与返回清理；不是正式站全站审查。实拍边缘是用户认可备选的试用，最终审美尚未定稿。本轮自审与实际浏览器核对，不冒用以前子代理评分。

## 结论
实现回到用户要求的首页构图，素材介绍页已撤销。没有长城石墙或山体图片，只使用实拍城垛透明轮廓。真实字体、原字序、镜像和材质来源可追溯。实际覆盖流程未复现未解决P0/P1。

| 维度 | 分数 | 实际依据和限制 |
|---|---:|---|
| Accessibility | 3/4 | DOM文字与真实链接、焦点和暂停保留；减少动态active=0且无待执行帧，背景装饰不进入读屏；未做完整读屏/WCAG验收。 |
| Performance | 3/4 | 1000实例、按需帧、DPR上限、无React逐帧状态，进入栏目释放场景；4K材质首载仍较大，见P2。 |
| Theming | 3/4 | 用户指定米白/深木/宋体，目录与正文原样；部分新字号和物理材质色尚未统一记录到全局设计标尺。 |
| Responsive | 3/4 | 1440/768/390/320无横溢出；合成手机轻点15块响应，回落后0活动/0待执行帧；合成滑动scrollY=104。真机、Safari与浏览器原生缩放未验收。 |
| Implementation Integrity | 4/4 | 拒绝伪汉字和生成长城；实拍/字库/修改坐标/许可保留，未改公共数据或读者正文；快照和场景释放实测。 |
| **合计** | **16/20 · Good** | 限已测试范围，不代表最终视觉确认或全程60fps。 |

## Findings
- **[P2] 4K字面与高度图首载较大**：src/features/book/typeFieldScene.ts及public/type-study/materials。彩色约2.8MB、高度约1.8MB，静态图先显示，WebGL就绪后接替；慢网仍可能等候。材质确认后可用手机2K版本和更小高度图，不能用模糊伪字替代。建议 `$impeccable optimize`。
- **[P3] 字号/物理材质色仍为局部标尺**：type-home.css与场景材质；后续 `$impeccable document` 整理，仅限新首页，不借机改变原阅读风格。
- Impeccable实际渲染检测仅cream-palette主告警。米白是用户明确指定，人工复核后保留，不通过忽略颜色或换色制造“零告警”。源码字体层级跨JS/CSS入口的静态误报不替代实际76px/约29px测量。

## 证据
- `.artifacts/type-home-worn-final-check.log`：完整check 119/119、类型/ESLint/前端/Functions/导出通过；最终小修后以最新日志为准。
- `type-home-prod-qa.json`：生产构建无pageerror；减少动态0活动/无帧；鼠标14个邻域字模响应；到达章节0残留画布/ghost且main非inert。
- `type-home-touch-fixed.json`：修复触摸pointerleave过早取消后，轻点15块响应，结束0活动/无帧。旧active=0结果明确保留为失败证据。
- `type-home-touch-fallback.json`：无WebGL显示同场景静态图；合成原生滑动未被阻断。不是物理真机。
- `type-home-resize-qa.json`：桌面→手机→桌面恢复同一静止字模构图的实际像素比较。

尚未验收：低端真机持续帧率、长期显存、Safari/Firefox、读屏、原生200%缩放、所有私人工作台；不将上述范围写成通过。材质试用的最终视觉需用户看新站反馈。后续收尾顺序：`$impeccable optimize`（若素材确认需要）→`$impeccable polish`。
