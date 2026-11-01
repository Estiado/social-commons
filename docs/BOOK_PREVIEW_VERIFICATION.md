# 独立书页预览验收

## 当前：山岚、上移预览与绑定单页 · 2026-11-01

此节取代下方卷纸版记录。用户新视频已作为行为参考：书身和厚页块固定，活动页的透明墨层与纸面照片分开，正反向均2.55秒；旧 `RollTurn/rollGeometry` 已删除。活动页不携带书边、厚纸层和页脚，纸色及色斑取自同一实拍；照片纸面轮廓经取样平滑，柔影落在底页上。手机、短屏、正文与总目录往返依次经过纸色交接，旧新文字不相互淡显。准备超时或无WebGL也使用同一平滑交接，不再直接硬切。

- 完整 `npm run check`：**113/113，0失败**，类型、ESLint、生产构建、函数和导出生成通过；日志 `.artifacts/book-preview/check-delivery.log`。新增照片轮廓共享书缝、行序与不翻转回归；原导出模型检查不等于新增逐页排版验收。
- 最终生产构建13组流程：`.artifacts/book-preview/accept-release-confirmed.json`。山岚推力最大0.0978（旧强推曾达2.2），暂停冻结；首页共享标题；正反单页；分类进退；选中篇目→正文实际滚动327px→Back恢复；快速再导航；返首页；768×1024/390×844/1440×600无横向溢出；Escape/resize/减少动态；键盘与无结果恢复；六栏700px右页无需内部滚动。`errors=[]`，结束stage=0/inert=false。
- 上述流程曾记录1次准备预算超时，随后补强为纸色回退。最终故障注入 `.artifacts/book-preview/fault-book-release.json`：模拟无WebGL、SVG解码延迟3.2秒，两种情况均到达群鉴、stage=0/inert=false/opacity=1、无脚本错误；延迟场景按预期记录预算警告。这是模拟故障，不是真实设备/网络验收。
- 早期自动化用800ms判断总长880ms的分类迁移，产生一次“Category leaked”误判；已改为等待迁移层真实消失。另一次截取前帧耗时使后帧采样点错过，已改为每次转场仅采一个中帧。原失败记录保留，不宣称首次全部通过。
- 最终中帧实际查看 `book-release-reverse.png`、`book-release-front.png`，独立正反面材质帧见 `leaf-ink-front/back.png`。曾发现重复书边/纸层、纯色活动纸不合背景与页脚被挤入快照，均已改为独立墨层、同源纸色和视口合成。用户尚未最终确认真实感；不能写成“完全复刻视频”或“无任何分界线”。
- 山岚当前静帧材质alpha均值0.391，CSS .82后平均约32%，上限约51%；低alpha区域约21%。测量与700/750/900高度布局见 `accept-airy-mist.json`，700px补修见 `raised-short-fixed.json`。这是一个实际帧，不是所有时间和视口的恒定密度。静态回退16762字节。
- 当前纸面位置按正片叠底计算关键文字对比度：分类计数最低5.37:1、结果数5.12:1、来源5.41:1、阅读入口6.23:1；`.artifacts/book-preview/contrast-release.json`。仅对应采样位置，不代替全站/全部图像状态WCAG认证。
- 最终Impeccable源码扫描48条advisory（色值8、字号40），0 primary；见 `audit-release-final.json`。样式标尺维护提示仍为P3，不当成48个用户故障。最终技术audit见 [报告](BOOK_PREVIEW_AUDIT_2026-11-01.md)。
- 未测：Safari/Firefox、真实手机触控/拖拽、屏幕阅读器、原生200%缩放、长时显存、全部正文和个人云端写入。动画是点击导航；参考视频不作为拖拽功能已实现的证明。后台窗口会节流，最终timing在独立浏览器审核会话检查；不声称全程60fps，山岚绘制上限30fps。

仅同步独立预览分支和草稿PR，不合并main。当前发布状态在实际成功后写入本机部署记录；下方是历史阶段验收，不能用作新版本的远端证明。

## 历史阶段记录

## 最终实拍与卷纸验收 · 2026-11-01

此节为当前版本；下方的88×16、52%薄雾、二维速度场及110项测试均是旧版记录。

用户随后指出搜索框贴板生硬，补改六栏共用透明检索与细线、选中墨色下划线、标题/正文/目录/页码正片叠底、透明墨色细滚动条。完整check另跑112/112，日志 `check-printed-ink.log`；中帧发现经典滚动条会留下15px透明纹理，在GL下变黑，已将快照视口先填纸色后再合成DOM。不把修订前报告充作此次增量验证。

六栏增量浏览器结果 `accept-printed-ink.json`：全部multiply、搜索底全透明、无溢出；选中态透明且aria-pressed=true、下划线可见；2px焦点保留，结束stage=0/inert=false；390px无溢出。pageerror与卷纸警告均为空。最终滚动条补底后完整check再次112/112（`check-printed-gutter.log`），`printed-ink-gutter-fixed.json`记录0错误、stage=0，实际查看 `printed-ink-gutter-fixed-mid.png` 未再出现右侧黑边；最终detector为47条advisory、0 primary（`audit-printed-final-detector.json`）。

### 自动检查

- 最终完整 `npm run check` 112/112，0失败，类型、ESLint、Vite生产构建、Cloudflare函数与PDF/DOCX生成均成功。日志 `.artifacts/book-preview/check-real-photo-release.log`。导出仍是模型与文件生成验证，不是新增逐页排版验收。
- 5项新回归检查真实卷纸弧长、平展端点、UV/正反向、有穷法线以及云团推开/回聚/持续输入边界。删除3项旧纸页几何测试；不是同一实现的两套重复验收。
- 最终 Impeccable detector：47条 advisory（色值8、字号39），0 primary。结合已固定的纸色、真实照片材质与响应字号复核，不将这些提示冒充47个用户故障。详细报告见 [audit](BOOK_PREVIEW_AUDIT_2026-11-01.md)。

### 实际浏览器

- 最终生产构建本机4183，Playwright CLI / Edge（Chromium）。11组结果 `.artifacts/book-preview/accept-real-photo-result.json`，pageerror `[]`：云团uniform真实响应且暂停冻结；首页词条→标题；跨章完整书框与卷纸；分类进退；选中d134→正文→Back参数恢复；快速多次导航最后意图胜出；当前标签取消；返回首页无残留；768×1024、390×844、1440×600无横向溢出；Escape/resize/减少动态效果；无结果恢复。
- 实际中间帧已看：`output/playwright/roll-qa-chapter-mid.png`、`roll-qa-category-mid.png`、`roll-qa-size-390-mid.png`、`roll-qa-home-back-end.png`；稳定帧 `roll-qa-daily-stable.png`。目录是整张照片底板，移动纸沿原始照片alpha裁切，未复现旧矩形裁断、右半页横向拉伸、双标题或临时层泄漏。
- 最终补测 `.artifacts/book-preview/audit-photo-browser.json`：检索框有名称；Tab进入分类按钮，2px可见焦点；结束后main聚焦、inert=false、stage=0。完整目录、返回与分页点击高44px。720×500半宽等效重排无横向溢出；这是重排模拟，不冒充浏览器原生200%缩放或真机测试。
- 对真实照片底色与关键次级文字位置采样，最低对比度分别4.68、4.78、4.81及5.75；方法和位置在 `.artifacts/book-preview/audit-photo-contrast.json`。明确不等于全图片像素/所有页面的WCAG AA认证。
- 无WebGL静态回退与原导航曾在本轮实测，`.artifacts/book-preview/no-webgl-final.json`；它早于最终照片替换，未把它标为最终照片的独立真机验收。最终减少动态效果包含于11组流程。
- 首页帧回调采样133次，median16.7ms、p9516.9ms，Intel Arc硬件，记录 `cloud-frame-audit.json`。这是首页rAF回调节奏；体积雾本身限24fps，不能推导全程动画60fps。

### 当前实现与边界

- 首页独有冷白体积雾（场景30%起、高72%，最大约91%遮挡），六组弹簧云团，有界推动、抬升、回聚。它是视觉近似，不是完整大气物理求解器。
- 使用用户最后提供的整本照片作实拍底板；原图、重建脚本、全书/手机素材和图片来源说明均入库。与真实卖家彩绘边构图参考分开，不声称用户照片已有独立CC0许可。
- Paperlab固定ref `41914833cb9ae12b32a8cbbdee4723f5b12158af`，Apache-2.0许可与NOTICE保留。新增 `html-to-image@1.11.13`（MIT）按需加载；无Three/编辑器整库依赖。仅公开DOM进入本机瞬态纹理，不发送截图，不截取私人阅读空间。
- 原生手机触控、Safari/Firefox、屏幕阅读器、原生200%缩放、长时显存及所有正文操作未在本轮全量复验。保留原合同测试，不将其写为新的真实数据库或设备验收。
- 发布前远端main核对为 `bdf9a1d594e5ac31fd4c769885b39c4f21d58f62`。仅推 `codex/book-preview`，草稿PR #6；部署结果另在实际成功后记录，不能将本机通过当成远端上线。

## 历史验收

## 书页为云海基底与鼠标流动 · 2026-10-30

- 用户否定底边云带，要求沿书页纵深铺开、字迹透出及鼠标流体。云面改为46%位置开始、56%高的浅层云海；高精度体积噪声从远至近铺开。CSS75%配合材质alpha上限0.69，最多约52%遮挡。五个纵深横截面的平均alpha均为77–100/255、最大176/255，证实云不只聚在底边；这是实际像素值，不等同于每个字的人眼可读性认证。
- GPU双缓冲速度场160×96，鼠标冲量、局部旋涡、半拉格朗日平流与耗散。移鼠前energy=0，移鼠后135349，离开2.2秒后为0；扰动量442006降为6218。暂停前后场哈希相同，shader program对象相同；减少动态时移鼠也不改场。指针ref及单个被动监听，不用React逐帧setState。RGBA8的末位量化残留以有界摩擦消除，未声称完整不可压缩流体求解。
- 1440×619、768×1024、390×844、320×740的覆盖比例均约56%，无横向溢出，画布不超过640×256。上方浮字清晰；实际首页与手机截图查看后，保留有疏密的浅雾。首页词条最终标题可见，临时场景也捕获当前云帧；无WebGL的同图静态回退已测。浏览器pageerror为空。证据：output/playwright/cloud-sea-final-result.txt及cloud-sea-final-\*、cloud-sea-fallback.png。
- 完整npm run check 110/110，类型、ESLint、构建、函数及导出检查通过，日志check-cloud-sea.log。之后仅增加速度场末位耗散，另经最终构建build-cloud-sea-final.log与GPU/页面专项，不把构建成功说成真实手机GPU验收。静态回退更新为40522字节。
- Vercel React Best Practices本轮应用ref瞬态值、被动事件与监听清理，setup effect保持一次初始化，暂停使用控制ref。没有增加包、数据库或正式站改动。依旧只推独立预览分支与草稿PR；远端成功后另存.artifacts部署证据。

## 连续纸页与标题衔接 · 2026-10-30

- 最后补齐手机单页：700px及以下从外侧书脊翻动整张纸，桌面仍以中央书缝跨页。专项实测singlePage在390px为1、1440px为0，均完成导航；构建记录build-physical-mobile.log、book-whole-leaf-result.txt。发现并修复共享uniform精度不一致的链接失败，最终GL渲染实际成功。首次代码提交a33b369的远端：首页5字衔接且无mesh、后续mesh、群鉴正文new-coke-1985滚动450px、API 503已验证，见live-physical-result.txt。此条是增量验收，不冒充再次全套check。

- 用户选定B；首页后来明确改为共享字形变为栏目标题、摊开书本浮现，此段没有3D翻页。其后公开导航采用独立88×16弧长网格、正背面DOM纹理和动态投影。已删除旧三段折板及对应克隆CSS。当前移动纹理只是转场，HTML、选字、来源与私人模型不变。
- 云层由平面FOG改为MIT来源的CLOUDS体积采样，低矮、可见明暗。60/75/90%均实拍，默认75%；公共静态WebP来自本地渲染的同一云层，WebGL不可用时回退。文件11962字节。
- 完整npm run check 110/110通过，包括类型、ESLint、生产构建、函数与导出；新增几何回归检查弧长、平展端点、连续法线和有穷数。早期两个新测试断言因负零及只比较单个法线分量失败，已修正为几何距离验证；早期着色器保留字导致编译失败也已修复，记录不冒充首轮全通过。最终日志check-physical-final.log。
- 生产构建4183：1440×619、768×1024、390×844、320×740无横向溢出，六章点击宽度44px，云层75%。首页中间帧5字仍在移动、物理翻页和旧panels均为0；标题最终可见、跨页opacity为1。149次逐帧采样的最后交接中心偏差小于1px。路径见book-physical-final-result.txt、book-opaque-result.txt。
- 后续真实点击显示WebGL曲面与正背面文字；本机整体约3.3秒，源设定3.15秒加最后0.12秒合拢。发现旧左页透明度淡出造成双标题后，改为不透明遮挡；专项背页图book-curve-opaque-back.png复核。最后修改只涉及此alpha和合拢时长，另经构建build-physical-opaque.log及专项浏览器，不反复全套测试。
- 私人导航、浏览器Back、动画中切换减少动态效果、转动屏幕及手机Escape均清除覆盖层；栏目wheel实际改变scrollY。浏览器pageerror为空。无WebGL时回退图已真实截图验证。没有本轮真实手机GPU或可靠FPS测量，不作全设备流畅保证；正文原有功能沿用，不将栏目滚动测试说成全篇正文验收。
- Taste实际检查初报3 FAIL/1 WARN：3项均把用户明确指定的竖排当成标题换行；纸白、浮字影、单图、无视频和仅章名同样属于明确要求。按允许规则登记竖排例外后为0 FAIL/1 WARN，保留原始报告和6张图的联系表；静页动效提示不通过增加无关动效处理。本轮Impeccable启动器因C盘缓存权限失败，使用其允许的直接读取PRODUCT/DESIGN及人工craft检查，没有宣称机器门禁通过。与旧版本独立代理评分分开。
- 只更新独立预览与草稿PR，不合并main。首次全面结果中的nearEnd距离属于约2.9秒的中途采样，并非交接误差；以最后逐帧专项为准。真实部署SHA与远端验收另记本轮.artifacts，不能把本机通过当作已发布。

## 云雾与飘字修订 · 2026-10-30

- 用户反馈旧雾层不可见、文字落点偏高且僵硬。雾层改为50%不透明；修正WebGL直通alpha的合成方式，增加密度变化与8px柔化，避免硬亮斑。短屏单独缩放，使云层进入第一屏。
- 文字按真实云层的矩形定位；逐字走弧线，约2.8–3.0秒，18ms错峰，提前逐渐模糊和淡出。浏览器3.05秒采样的20个非选中字符全部进入云层边界（y=652–854内），最后字符不再停在云层上方。
- 完整检查107/107（新增真实云层落点回归），类型、ESLint、构建、函数与导出通过；合成微调另经ESLint与构建。1440×619、390×844、320×740均无横向溢出、六章44px点击区保持、云层可见；减弱动态时云层静止且仍为50%不透明。记录见check-cloud-refinement.log、output/playwright/cloud-final-result.txt与cloud-final-\*图。
- 现有翻页的真实性被用户否定。本轮没有替换翻页实现；候选和许可边界见BOOK_TURN_OPTIONS.md，等待用户决定A/B。约4.5秒是本轮文字飘落加旧翻页的本机实测总长，不是新物理翻页的验收。
- 原功能提交cdc16fa已同步GitHub，CI及Cloudflare成功；独立地址为 https://codex-book-preview.social-commons.pages.dev/ ，对应首次部署 https://eae7ef29.social-commons.pages.dev/ 。main仍为bdf9a1d594e5ac31fd4c769885b39c4f21d58f62。本次修订另行推送预览分支，不合并main。

2026-10-30。仅适用于 codex/book-preview。生产 main 复核仍为 bdf9a1d594e5ac31fd4c769885b39c4f21d58f62；本轮不合并、不推广。部署地址与远端状态需在实际成功后补记。

## 交付范围

- 用户三条要求及来源/复用边界见 BOOK_DESIGN_PLAN.md。首页字号约增20%，浮字离场/沉入、分段慢翻；栏目跨页、分类→篇目层级、标题迁移与分类分页恢复；底部薄雾50%不透明，可暂停。
- Codrops BookBlock几何基础与Vanta FOG着色器均保留许可和固定来源。没有取得图库商业案例的公开代码许可，因此没有声称复制其私有实现。昆虫卷纸仍为待选实验，不冒充已交付功能。
- 原正文、来源、稳定ID、私人存储、收藏与导出模型沿用。所有新工作、扫描原件、缓存及截图在D盘；脚本设置当前进程的D盘TEMP，不改系统设置。

## 自动检查

- 完整 npm run check：106/106，通过类型、ESLint、测试、生产构建、函数打包与导出生成。日志 .artifacts/book-preview/check-final.log。
- 最后仅增加空列表动画防护，针对改动再跑ESLint及生产构建通过，日志 build-shipping.log。没有把无关的全套检查反复运行当成额外证据。
- 导出验证生成10页PDF及DOCX；这是生成与模型检查，不是Word逐页排版或真实读者导出验收。
- 新回归覆盖六章与深链接分流、多词/分类筛选，以及预览API所有方法阻断。原有内容、私人保存、RLS和函数测试继续运行；未执行生产数据库SQL。

## Playwright 实际浏览器

使用官方 @playwright/cli 0.1.22 和现有Edge；生产构建本机地址4183，开发调试5183。截屏与交互脚本位于 output/playwright/，未入库。

- 1440×900、768×1024、390×844、320×740首页：六章完整、点击宽度至少44px，无横向溢出。320使用有明确名称的阅读空间图标。
- 真实点击群鉴，抓到文字沉入与三段弯页帧，完成后turn panel为0、遮罩透明。首页非瞬间跳转；Escape可结束，另一次导航优先。
- 分类第二页选择后成为标题，返回恢复page=1（第二页）；无结果提示可恢复；分类/查询进入URL。
- 正文wheel改变实际窗口滚动位置；保存公开文章、刷新后仍为“已加入阅读空间”。这是预览来源的IndexedDB验证，没有向正式站写入。
- 阅读空间搜索“可乐”后打开保存文章，history.state.usr.readingQuery为“可乐”，私人路由状态保留。
- 减少动态效果：分类仍获得焦点；云雾静止；公开路由不创建空间翻页层。快速转入阅读空间以及浏览器Back不会被旧动画拉回。
- 初次自动验收曾在分页渲染提交前读取旧标签，导致测试断言失败；页面状态核对正确后，从该流程断点重验通过。保留 final-qa-result.txt 原失败记录及 final-flow-result.txt 成功记录，结构化结果为 .artifacts/book-preview/acceptance-final.json。不能把第一次尝试写成无失败。
- 空篇目列表的GSAP警告已修复；受影响分类往返复验 warnings=[]、stage=0，见 output/playwright/console-final.txt。早期流程中的两个警告保留在原日志，不篡改证据。
- 录屏开始时发现Playwright缺少ffmpeg，未补装，不提供或宣称有效演示视频；动作采用实际分帧与网页交互验收。

## 设计复核

早期首页曾由两名独立代理评审，A完成后才读取B结果；27/40属于那个早期版本，不是当前版重新评分。

最新finish reviewer使用当前源码及最终图，只针对已列修复验收：标题压缝、分类分页、静态焦点、转场导航竞态均resolved，disposition: ship。记录 .artifacts/book-preview/final-review-three-requests.md。没有把这次结论扩大为全站认证。

Impeccable本轮最终检测已实际运行一次：0项阻断规则，51条advisory（13色值、37字号、1圆角）。这些指出DESIGN主token没有穷举纸张材质、蒙版黑色、投影及所有响应式字号；逐项保留原始检测JSON，不为消除提示增加几十个品牌token，也不伪报0项。DESIGN.md和schema2侧车记录实际系统，完整取值仍以book.css为准。

Taste的纸白、浮字影、单幅主图、无无关视频及仅章名的首页均是用户明确指定的方向，按书页语境解释，不通过增加无关内容满足通用检测。

## 隔离与限制

旧的comp-led机器记录对应已被用户否定的整本书方向。本轮按用户具体实图和已授权方案走code-led，人工finish reviewer为ship；旧机器finish命令仍按废弃comp门禁拒绝，未将其伪写为通过。状态已归档至本轮.artifacts，项目默认comp偏好已恢复，不让旧记录约束下一轮设计。

预览的Supabase客户端固定禁用；Pages middleware与本地服务阻断/api/；站点noindex。生产账号、反馈、导入服务和私人数据未迁移。公开外链仍可由读者自主访问。

没有声称实机低端手机、微信WebView、屏幕阅读器、200%缩放、全套16步导览、账号同步、生产数据库或所有逐字来源已经重新验收。减弱动态效果测试是真实浏览器模拟，触屏点击区是实际尺寸检查，不冒充物理触摸设备测试。
