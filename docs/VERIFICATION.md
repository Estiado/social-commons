# 验证记录 · 2026-10-20—30

## 独立书页预览 · 2026-10-30

`codex/book-preview` 的106项检查、真实浏览器、设计来源、隔离和验收限制独立记录在[书页预览验收](BOOK_PREVIEW_VERIFICATION.md)。这些不是正式站部署或生产数据库验收，main不合并。

## 全站精修与分类层级 · 2026-10-29

- 独立A设计判断完成后才读取B机械与浏览器证据；A26/40。报告存于`.impeccable/critique/2026-10-29T07-33-41Z__src.md`。本次不伪造“优化后独立评分”。Impeccable、Taste、Frontend Design、GSAP React/timeline/performance及humanizer-zh用于实际实现与复核；frameworks的React分流与生命周期原则已遵循，没有引入其他框架。
- 一次完整`scripts/dev.ps1 check`101/101通过，类型、ESLint、生产构建、Cloudflare函数打包和DOCX/PDF生成通过。日志`.artifacts/refinement-check.log`。生成10页PDF和DOCX，不代表在Word中逐页验过。
- 针对浏览器发现的桌面目录高度、手机指引遮挡，以及新增旧目录显示层级和上下文候选逻辑做修复后，14项相关测试通过；对修改文件补类型、ESLint和构建，日志`.artifacts/refinement-final-check.log`、`refinement-release-check.log`。没有反复运行完整检查。
- 本地真实浏览器：桌面知天下补充目录点击后自动展开，锚点top约96px；切换日新scrollY=0、main获焦点；关闭搜索回到“搜索全站”。查询“AI 学习”5条结果，领域/主题/媒体候选含“不限”为4/8/6项，替代原59/932/263项。
- 390×844：8步新手路线实际完整行至反馈页并关闭，没有保存文章或提交反馈；第一步高亮底部491px、卡片顶部507px，留16px间隔。768×1024：观澜六组主题及选中态无页面横溢。720×450：搜索容器和结果可分别滚动，无页面横溢。1440桌面抽查搜索与长文。截图位于D盘`.artifacts/`，不提交。
- 最终机械扫描2条旧未使用渐变字段误报、type0；源码与浏览器均未渲染它们。只读浏览器不支持注入，没有overlay或live-server。真实200%、读屏、微信/真实手机、完整27步路线、系统减少动态效果切换，以及本轮Word人工排版未验收。没有操作数据库、SMTP、抓取或私人内容。
- 功能提交`8627a8380218c15891e8dd12fbb92300274d5014`已推送main；GitHub检查与Cloudflare均completed/success，Cloudflare明确返回`Deployed successfully`，预览`92bf2adf.social-commons.pages.dev`。正式域名实际出现六组主题；打开既有“正式站验收 · 赤壁摘读”仅核对菜单，390px下Popover左103/right359，无横向溢出，没有执行格式修改或反馈提交。当前设计快照因目标实现变化已由helper关闭，保留26/40历史记录，不另报未经独立评审的新分数。

## Impeccable init · 2026-10-29

- 两轮结构化回答分别确认主要受众（高中与大学并重，教师辅助）及未来新增首页/展示页先做效果图。PRODUCT.md记录产品事实；buildPath只写配置，不在产品文档重复存一份流程设置。
- 已复用本会话加载的Impeccable上下文，按init流程读取现有交接、架构、阅读与搜索说明，无覆盖既有PRODUCT.md或流程配置。文件创建前确认均不存在。
- D盘已有引擎执行detect-csp，返回shape:null、signals:[]；仅创建通用live入口配置。没有启动live服务、注入页面、修改CSP或弱化安全策略；不能把配置存在称为live已经实测。
- 变更仅PRODUCT.md、Impeccable通用配置/忽略规则及维护记录。分类归并和全站可折叠层级继续暂停，无源码、内容或数据库修改。本轮`scripts/dev.ps1 check`一次通过97/97，类型、ESLint、构建、函数与导出生成均通过，日志在D盘`.artifacts/impeccable-init-check.log`。本次为文档及配置初始化，未做网页改版或live浏览器验收；不等待文档提交触发的重复部署。

## 知天下连贯长读与红海航运 · 2026-10-28

- 完整`scripts/dev.ps1 check`本轮运行一次，通过93/93。日志`.artifacts/world-longreads-check.log`：类型、ESLint、全部测试、生产构建、Cloudflare函数与Word/PDF生成通过。导出脚本生成10页PDF和DOCX，不代表本轮已经用Word逐页验排版；原有PDF按需包大块警告仍保留。
- 5篇、27章、50个时间书签。回归覆盖章节/书签一一归属、真实阅读块目标、缺失关联拒绝、同章多个日期、主文先于最近进展、不再重复生成节点摘要、年份/统计分母保留、五篇经编辑器往返不丢文字，以及旧快照版本分离和搜索入口。新增的红海正文按需加载。
- 用户DOCX仅只读提取，写作样式参考与事实证据分开。本站正文仍在53组1351字段的统一编辑稿；引语、作者、书目与URL独立。原私人文章及划线未迁移。没有生产数据库、邮件、抓取、账户或权限变动。
- 主文连贯度由humanizer-zh逐段复核；Taste/Frontend Design/Impeccable用于既有Read界面收敛：从头阅读不跳过导语，手机目录默认收起，日期作为章节书签，保留原生滚动与既有减弱动态效果。不重复本轮无关的动效检查，也不把上一轮机械检测当成新页面实测。
- 此记录于推送前写入：本地与origin/main已fetch核对无分叉。生产部署以本提交关联的GitHub Actions及Cloudflare Pages checks为准，浏览器抽样结果随本次交付报告提供；上面93项自动检查不冒充正式站点击验收。若浏览器连接明显卡住，按用户要求立即说明并转交可手动步骤，不连续重试。
- 发布后补记：功能提交`e188ec8e654bf56c496dd59cb5c24be00b459567`已推送并以远端SHA核对。[主分支检查](https://github.com/Estiado/social-commons/actions/runs/40620650811/job/122593579606)completed/success，[Cloudflare Pages](https://github.com/Estiado/social-commons/runs/122593908147)明确Deployed successfully。初次抽查时部署仍在构建、显示旧版未找到新事件；仅在部署成功后刷新，随后新版完整显示，未将旧版表现误判为代码失败。
- Edge原连接不可用，立即向用户说明，没有重试旧连接；内置浏览器一次建立公开页连接成功。红海篇显示六章连续段落与出处，时间书签定位到“绕行怎样传到企业账本，数据又在量什么”，距视口顶部约96px。390×844手机无横向溢出、目录默认收起；1440×1000“从头阅读”确实回到导语，距顶部约96px。两张实际截图`world-longread-mobile.png`与`world-longread-desktop.png`在D盘`.artifacts`，未提交。
- 正式站俄乌篇实际打开，2013年11月21日书签定位“从一份经贸协定，到总统与议会的权力决裂”；正文有亚努科维奇及5880亿美元重建口径，16个书签、无横向溢出、抽查控制台error为空。五篇目录显示核对日期2026-10-28。没有重复测试旧的账户、数据库或下载流程；Word/PDF与私人快照合同由本轮自动回归覆盖，不宣称本轮重新实点全部导出和划线。

## 知天下详解、法国事件与全站动效 · 2026-10-27

- 最终完整`scripts/dev.ps1 check`通过92/92，日志`.artifacts/context-motion-release-check.log`：类型、ESLint、全部回归、生产构建、Cloudflare函数及Word/PDF生成通过。生成10页PDF与DOCX，仅代表生成合同检查，不冒充Word软件视觉验收。既有PDF按需包仍有大块警告。
- 知天下4篇39节点；俄乌15、巴以9、2030议程7、法国8。新回归检查前因/组织区别、出处ID和定位、法国承诺与未来日期边界、短引进入引用块，以及阅读/编辑往返、旧版本快照和非法加载路径。统一稿52组1226字段。没有生产SQL、邮件、抓取或账号修改。
- Impeccable启动器上下文重新加载成功，引擎0.1.17缓存留D盘；最终机械检测退出0，`.artifacts/impeccable-motion-release-detect.json`为空数组。Taste新动效文件源码检查0 FAIL/0 WARN；独立CDP浏览器检查器没有运行，不能将这两个结果扩大为全站全部规则或全部设备通过。
- 本机生产预览实际检查1440×1000、768×1024、390×844。法国日期选择定位到10月26日节点，标题距顶部约96px；768和390px无横向溢出。引用原文及发言人/新华社报道作者/日期/定位均出现。桌面截图`.artifacts/context-france-desktop.png`在D盘；移动截图第一次遇到视口覆盖与捕获尺寸不同步，不将该张作为最终手机视觉证据。
- 俄乌新版背景实读1991、2013、亚努科维奇与议会争议，目录定位正确。创建验收划线后刷新，阅读ID`4db1ba8f-160a-4c5f-a2bd-fbe1ac3c0b28`与一处mark仍保留；该次双击实际选中一个标点，不冒充完整引文划线验收。法国整篇存为`45c7169c-b7ae-4875-adec-dd29e3ca2db4`，随后从阅读空间勾选成稿，编辑器保留短引、发言人和题名超链接；新稿`9a984649-61ef-42a1-a0ca-91a177ad069e`为验收副本。
- 实际打开首页、群鉴、撷英、素材、观澜与阅读空间。撷英检索范仲淹显示2篇；素材搜索舞台化真实显示1词条并展开个人/站方区域；观澜过滤后可恢复13篇。首页新增清楚的中文h1，去掉重复英文眉题。抽查控制台error为空。没有测试帧率、低端真机和系统强制减少动态效果，后者由CSS/GSAP条件实现并静态复查。
- 浏览器连接曾超时及调试器脱离，重新创建独立验收标签恢复；未清空用户数据或关闭其他用户标签。发布前fetch确认本地与远端main无分叉。以下生产发布状态待补充。

## 每日简报、知天下与风险报告 · 2026-10-27

- 本地完整`scripts/dev.ps1 check`通过91/91：类型、ESLint、数据与阅读回归、生产构建、Cloudflare函数打包以及Word/PDF生成均通过。日志`.artifacts/world-briefing-check.log`。导出脚本生成10页PDF和DOCX，不等于Word软件逐页排版验收；既存PDF导出大块警告保留。
- 新增三项回归覆盖北京时间零点/跨年/非法日期、连续70天简报选材差异与无未来新闻，3条脉络25节点的排序/来源关联/原型防护，阅读与编辑模型往返，完整古典诗文及风险报告统计口径。统一编辑稿51组1067字段，缺失/重复/孤立引用按原检查链拦截。
- 本机生产预览实际打开每日简报：当天为2026-10-27，显示最近资料节点2026-10-25的俄乌脉络、范仲淹完整上下两阕及舞台化真实概念。关闭简报后才出现首次指引，点击简报阅读入口可直接进入独立页；Escape能关闭，导航与手机菜单可重开。曾发现旧新闻按全池轮换，已收窄至最新五条并重新完整检查通过。
- 本机1440×900、768×1024、390×844真实浏览器检查：目录与手机弹窗无横向溢出；手机弹窗820px高、小于844px视口，正文独立滚动且操作区可见。搜索“巴以”命中1条，空结果有清空恢复。俄乌“最近进展”和黑海粮食节点实点定位，目标距视口顶约96px。
- 俄乌整篇与当日简报实际保存至预览浏览器，刷新后同一ID保留（`eacb9df7-7701-4f19-9bfb-eacf1fd8b6b8`、`91a4564f-4b8d-4274-b765-8d191168ffec`）。没有清空用户数据；预览与正式域名的存储隔离。
- Taste固定方向为editorial-report，种子573498991，保留品牌字体与纸色。源码检查0 FAIL/0 WARN；实际浏览器截图复查上述三个宽度。Impeccable检查表用于层级、收敛、触摸与异常状态，加载器因缺引擎及C盘默认安装未运行；未把它或独立CDP截图检查器写成已通过。截图`.artifacts/world-desktop.png`、`world-mobile.png`、`briefing-mobile.png`仅在D盘。
- 附件全文与方法/图表核读边界见CONTENT_SOURCES.md。未修改生产SQL、RLS、邮件、账号或微信提取；本轮没有做新的并发压力测试，静态发布成功不代表任何流量下都不会故障。
- 功能提交`8ca1450d5775e9bc312a253755ea1d483cd67d84`已推送main，`ls-remote`核对一致；[主分支检查](https://github.com/Estiado/social-commons/actions/runs/40453350122)completed/success，[Cloudflare Pages](https://github.com/Estiado/social-commons/runs/122021095334)明确Deployed successfully。
- 正式站实际打开每日弹窗和独立简报，完整上下两阕及概念出现；保存后刷新，同一阅读ID`bc1fbe0e-2102-4ff9-9c79-329701477f2f`保留。正式目录实读三条事件，巴以9节点与联合国2030议程7节点加载正常；巴以“最近进展”定位距顶约96px。俄乌9节点此前在本机逐项核读和定位，未把它记作正式站每个节点都点过。
- 正式风险报告显示4份资料与完整方法说明，实点方法附录的站内提要定位到`b59`，距顶约96px。正式站390px报告和知天下目录无横向溢出；手机菜单知天下入口有效，1440px桌面导航与目录正常。截图`.artifacts/world-live-desktop.png`、`world-live-mobile.png`，抽查控制台无error。没有把原站下载入口记成浏览器下载或PDF逐页验收。

## 十二篇观澜与全站扩容 · 2026-10-25

- 观澜12篇/38份提要、日新132条、撷英106个ID/96篇推荐/67篇来源解读、群鉴14事件/42视角、素材102概念/79示例。总稿46组885字段，新增265字段约25057汉字；导航标签改为可读标题时逐项比较确认正文未变。
- 最终完整`scripts/dev.ps1 check`通过88/88，日志`.artifacts/full-content-expansion-check.log`；类型、ESLint、全部测试、生产构建、Cloudflare函数与Word/PDF生成通过。导出验证生成10页PDF及DOCX；没有把文件生成写成Word软件排版已验收。新增事件正文在独立约8—10kB构建模块中按需加载，PDF导出包仍有既存大块警告，不是本轮构建失败。
- 三项新回归验证九篇事件经过/归因、正文与编辑器完整往返、38份来源提要进入同一模型、18条通识/素材同源、专著章节引用和8篇完整古典文本。原有阅读快照、划线、关联和备份回归继续通过。
- 初次测试发现示例SQL种子仍为61条、三个新学科未被分类；已生成79条种子并补入五大类，再执行完整检查通过。种子仅在独立测试数据库执行，没有写生产Supabase。
- 新托管论文核对29页、758728字节及首版许可，首屏PDF渲染与文字核对通过。未对所有所引现代论文作全文或镜像许可审查，具体核读边界见CONTENT_SOURCES.md。
- 功能提交`eb4e1aaebcb16402f427784cd932272c55f0fdcb`已推送main，并以远端SHA核对一致；[主分支检查](https://github.com/Estiado/social-commons/actions/runs/40188155500)completed/success，[Cloudflare Pages检查](https://github.com/Estiado/social-commons/runs/121153369644)明确Deployed successfully。正式站目录实读12篇，九个新增事件的标题、日期与入口均出现。
- 正式站打开乌镇戏剧节事件，实读事件经过、背景、三个来源视角、编辑署名反思及三份多段资料提要。“阅读站内提要”准确定位到Art Worlds对应标题，距视口顶部约96px。整篇保存为阅读ID`03aa1abc-cea2-4b53-ae7d-b5abace6eba6`，再收藏一段贝克尔资料提要；刷新后同一ID及“已收藏”状态保留。没有清空或改写旧私人文章。
- 页内展开范仲淹《苏幕遮·碧云天》，上下两阕、两段来源赏析及题名链接完整；实点独立入口到`/quotes/q105`，加载后首尾诗句均出现。群鉴目录新增三个案例；实际打开`/events/war-of-worlds-1938`，三方视角及对应论文的“打开电子版/下载电子版”链接均出现。本轮没有把电子文献入口出现写成浏览器PDF逐页验收；原件页数与许可核验见上文。
- 日新正式站实读132条，新增三类学科包含在原有五大类下；搜索“舞台化真实”命中1条，展开后多段正文、原始书目及`/daily/d132`独立入口出现。素材正式站实读102词条，同词搜索命中1条，展开后站方示例的三段正文与来源完整；没有添加私人素材或向反馈后台提交测试内容。抽查页面未记录控制台error。
- 390×844手机视口下，乌镇事件clientWidth与scrollWidth均375px，长英文论文题名可以换行。截图`.artifacts/content-expansion-mobile-live.png`留在D盘、不提交Git；手机视口覆盖已恢复。截图只证明该抽样页面，不代替全部设备兼容性测试。
- 初期隔离预览超时及自动审批服务用量阻断后，恢复连接才完成上述正式站实测。部分鼠标动作遇到浏览器连接超时，检查实际状态后改用控件键盘操作完成；最后补拍桌面目录时浏览器调试连接断开，未将该截图或未完成的本机预览计为通过。没有绕过安全审批。

## 统一编辑稿与资料提要 · 2026-10-25

- `content/站内编辑稿.md`共34组620处文字，约283kB；构建输出分组生成到D盘`.artifacts/editorial/`，不提交缓存文件。三篇事件扩写，十份来源均有多段可阅读提要。
- 先保存公开模型快照，再完成迁移并逐项比较：迁移时全站模型完全相同；扩写后非观澜正文、全站原句、书目、编号与关联仍一致。临时比对文件仅留D盘`.artifacts`，未读取或改写浏览器私人数据。
- 完整检查85/85通过，日志`.artifacts/editorial-check.log`。新增回归验证CRLF/Unicode/段落保留、标记损坏/重复与路径拒绝、实际修改总稿后生成模块内容改变、排版后的多行引用及注释、缺字段/整组删除/孤立编号在写入前失败、十份提要进入统一模型。旧快照、备份与导出回归保持。
- 最终完整检查仍85/85通过，日志`.artifacts/editorial-final-check.log`。功能提交`3a3ab3f1955015f6eb32f25ca018d0ddfa234c8f`已推送main并核对远端SHA；[GitHub检查](https://github.com/Estiado/social-commons/actions/runs/40157895178)success，Cloudflare检查明确Deployed successfully。干净构建能由总稿生成所需模块，没有将`.artifacts/editorial`提交仓库。
- 本轮真实页面交互验收尚未完成：浏览器工具未发现可用连接；改用Windows Computer Use打开已安装Edge后，工具因无法可靠确定当前浏览器URL以执行安全策略而终止该轮控制。随后停止全部电脑/浏览器输入，没有绕过安全阻断。未将85项检查或发布成功写成提要跳转、手机布局、段落收藏已经实际点击通过；未生成冒充新版的截图。已有私人数据未清空。

## 观澜事件阅读结构 · 2026-10-25

- 完整`scripts/dev.ps1 check`通过82/82：类型、ESLint、所有既有回归、新事件内容/引用、索引、备份、生产构建、Cloudflare函数及Word/PDF生成通过。日志`.artifacts/guanlan-events-check.log`；导出验证生成10页PDF和DOCX，未将文件生成冒充Word软件视觉验收。
- 新增5项回归验证三个事件的引用与关联ID、未知加载器/原型路径、跨话题规范地址、实际全站搜索、正文与编辑器往返保留电子版链接、新旧快照分离、真实IndexedDB接口的事件关联/旧话题/摘录索引及备份恢复。IndexedDB使用fake-indexeddb测试库，没有清空浏览器用户数据。
- 新正文在生产构建中拆为三个独立约4.3—4.5kB模块，首页与列表只使用轻量目录。新事件个人关系为可选eventIds，未更改生产Supabase、账号、SMTP或抓取白名单。
- 本机服务可启动，浏览器连接到本机5180端口返回连接超时，内置浏览器与Edge各试一次；没有把这项计为页面验收。任务创建的本机进程随后已停止，未结束其他用户进程。
- 功能提交`acc5954b01f168252f553a6c1e94dab278d2c066`已推送main，以远端SHA核对一致；[主分支检查](https://github.com/Estiado/social-commons/actions/runs/40149090413)success，Cloudflare检查明确Deployed successfully。
- 正式站实测事件搜索“学术酒吧”命中1篇；从文化与传承话题进入非遗事件，原有通识/名句/时评仍在展开区。目录“多维立意”跳到对应锚点，标题距视口顶约96px；澎湃来源筛选变为2份，未改变正文。新周刊36氪原文入口进入带来源URL和event的粘贴模式，未试图绕过来源限制。
- 非遗事件整篇与一个正文段落实存当前浏览器，刷新后同一阅读ID`cb87d81c-14b6-4482-8886-e21b8f391539`及取消收藏状态保留。页内展开《劝学》显示完整选段、出处、赏析及收藏/Word/PDF工具，不需要离开事件。
- 实际粘贴一份明确标为“事件关联验收 · 非遗阅读记录”的合成私人材料，确认后返回当前事件的`#my-event-materials`，区域位于视口内；刷新后材料保留。再从学术酒吧事件选择同一材料并关联，仍为同一文章ID`1fcae28e-0328-4a89-a48c-e9d2e175b784`。未修改或清空原有用户文章，没有向公共目录或反馈后台提交验收材料。
- 390×844手机检查观澜目录与含长英文期刊的AI事件，内容宽与scrollWidth均375px，无页面error。验收发现旧阅读器把所有标题输出h2、首页来源裸URL撑宽手机页，随后修正实际标题层级及题名超链接，今日日新卡片直达对应条目；观澜快捷话题收为六个，全部话题仍可下拉选择。
- 最终功能提交`fc9e84d8429dc3e8d4caf97096bff62755e36c20`已推送，[主分支检查](https://github.com/Estiado/social-commons/actions/runs/40149621733)与Cloudflare Pages均success/Deployed successfully。修正后完整检查仍82/82通过，日志`.artifacts/guanlan-events-final-check.log`。
- 正式站复验：首页论文来源显示题名/作者/刊期的真实链接，今日日新直达`/daily/d101`，手机scrollWidth由612px恢复375px（clientWidth375px）；事件子标题实际为H3，原有取消收藏状态保留。观澜实际6个快捷话题，14个全部话题加总入口共15个下拉选项，展开旧媒体目录仍为50篇。没有新增控制台error。
- 截图`.artifacts/guanlan-event-live.png`和`guanlan-event-mobile.png`保存在D盘、未提交Git；手机视口覆盖已恢复。最终公开事件页留在验收标签，浏览器旧私人数据未清理。该轮无生产SQL、SMTP或账号权限修改。

## 青年与大学研究扩充 · 2026-10-24

- 新增d101—d114、e71—e84及14个对应站方示例，114条通识/84个概念/61个示例。观澜新增青年与大学主题，研究优先；近期时评50篇和其他旧条目保留。没有执行生产SQL或更改账号/权限。
- 14篇来源已在真实出版页核对公开摘要和书目，其中7篇《当代青年研究》。不冒充14篇全文精读；两份PDF只链接出版站，未托管现代版权全文。详细边界见CONTENT_SOURCES.md。
- 完整`scripts/dev.ps1 check`通过77/77；类型、ESLint、旧数据/快照、分类、引用/编排、种子权限、生产构建、Cloudflare函数及Word/PDF生成通过。新回归验证研究台账与素材一致、论文年份独立、原站题名链接及两份PDF在编辑转换中保留。日志D盘`.artifacts/youth-expansion-check.log`。SQL种子仅生成，未执行生产。
- 功能提交`b0761b3544d4ed0cbdc83ceb0ad7ebe6941acdef`推送main并以`ls-remote`核对一致；[主分支检查](https://github.com/Estiado/social-commons/actions/runs/40081910479)completed/success，Cloudflare Pages明确显示Deployed successfully。初次Git连接的TLS中断以单次命令切换证书后端解决，未关闭证书检查、修改全局配置或强推。
- 正式站从观澜卡片实际进入`/guanlan/topics/youth-university`，显示14条研究、作者/期刊/年份/期次，先研究后诗文及私人关联区，不展示空的公共时评区。实点d108进入独立页，正文、论文原站及有题名PDF链接均出现；实际保存文章和一个正文段落，刷新后同一阅读ID及“取消收藏本段”状态保留。另保存了新主题介绍的本地副本；未改旧私人文章。
- 390×844手机验收内容宽375px、scrollWidth375px，研究卡片、题名和出处可换行，视口已恢复。日新显示114条，搜索“当代青年研究”命中7篇；素材显示84条，搜索“算法依恋”命中1条并定位，展开后完整三段和题名出处出现。`/essay?id=e81`可定位展开；验收定位器最初错误使用整段精确匹配，改为片段匹配后确认正文完整，未据此误改功能。页面控制台没有error。截图`.artifacts/youth-live-topic.png`、`youth-live-mobile-studies.png`、`youth-live-search.png`均在D盘，不提交Git。

## 文学、学习与科技扩充 · 2026-10-24

- 内容范围：100条通识、98个摘读ID/88篇推荐作品（59篇有出处解读）、11个历史主题/33个视角、70个概念/47个示例。观澜保持50篇，轮换7篇。新增不含金税四期、旭日旗、政策宣传或自拟课堂讨论。
- 定向11项回归已通过：旧ID与私有快照、连续诗文、来源台账一致、专题关系、海外原站模式、历史电子文献定位、文件字节与SHA-256、引用显示和导出模型。生成SQL副本，未执行生产SQL。
- `scripts/dev.ps1 check`全流程通过，75/75测试通过，类型、ESLint、生产构建、Cloudflare函数打包及Word/PDF生成通过。日志在D盘`.artifacts/content-expansion-check.log`。分类回归发现的新学科遗漏已补入五个导航大类；日期校验以各条实际核验日为界。
- 本机预览服务已启动，但本轮内置浏览器访问回环地址超时，未将其记为浏览器验收通过。
- 功能提交`35a25c1cc121607ecc380129e54e64b7fa648227`已推送，远端main核对一致；[主分支检查](https://github.com/Estiado/social-commons/actions/runs/40078933153)成功，Cloudflare Pages明确为Deployed successfully。
- 正式站`/quotes/q91`显示连续全诗、完整末句、题名出处和作品赏析，真实点击加入阅读空间显示已长期保存。`/events/darwin-wallace-1858`显示概述、3方原文与位置、电子文献；实际展开TXT阅读。观澜媒体筛选The Economist显示2篇，只有英文原站入口；375px实际内容宽度与页面宽度相等，无横向溢出，视口已恢复。截图`.artifacts/content-live-poem.png`、`content-live-mobile.png`。
- 线上检索发现形象化标题未包含部分概念名，补齐18条标题的概念名并加入来源台账回归，最终全流程仍75/75通过；日志`.artifacts/content-expansion-final-check.log`。原电子书字节保留，`.gitattributes`只豁免电子版原样空白检查，代码检查继续生效。
- 修正提交`bf646b4d494a631bacc26cbc660e92dbab95fe68`已推送，远端SHA一致；[CI检查](https://github.com/Estiado/social-commons/actions/runs/40079451314)与Cloudflare Pages均成功。正式站搜索“日常审美”命中1条，展开正文正常；素材目录显示70条，搜索“间隔效应”命中1条并定位结果，页面控制台无error。新增截图`.artifacts/content-live-search.png`。正式站实际下载电子书仍为970611字节，与清单SHA-256完全相同。临时预览进程已关闭，未改系统网络或用户原来的标签页。

## 统一备份、正文搜索、反馈草稿与指引 · 2026-10-24

- 用户批准四项体验改进：全部个人内容备份、正文检索、反馈草稿，以及沿首页向下浏览并实际进入栏目、最后介绍导航与反馈的首次指引。实现/维护入口见GUIDED_TOUR.md、READING_WORKSPACE.md、FEEDBACK.md。本轮无生产SQL、权限或邮件配置变更，未新增依赖。
- 完整`scripts/dev.ps1 check`通过74/74：类型、ESLint、旧版本数据升级、备份校验/幂等/局部失败重试、正文索引同步、陈旧写入拒绝、文本区间、反馈草稿和来路、既有权限/内容回归、生产构建、函数及DOCX/PDF生成。最终日志`.artifacts/workspace-tour-final-check.log`；导出生成不冒充桌面Word视觉验收。
- 本机真实浏览器逐步走完桌面与390×844手机的25个目标，每步均出现聚光区域；路线包含首页下滑、群鉴丝路词条、阅读空间、展开备份、素材页、回到导航、日新/撷英/观澜及反馈。手机导航步骤自动展开菜单，所有步骤无横向溢出；1024×768导航也无横向溢出。完成刷新不再弹出、页脚可重看，Esc退出后3个背景区均恢复可操作。减少动态效果分支经代码检查，未在真实设备改系统设置验证。
- 本机粘贴独立合成样本，只有正文含关键词“紫藤星河”。阅读空间搜索找到1条，链接直接带`#reading-b4`，对应段落位于约110px并有关键词标记；选此文另编文稿后搜索找到文章与文稿共2条，进入文稿实际选中相同关键词。选区不改原文字；截图`.artifacts/workspace-search-editor.jpg`。
- 本机实际生成统一备份，校验包含7份阅读文档、2份原文稿、1份个人素材与1份合成自建词条，无反馈字段；文件由浏览器默认下载目录归档至D盘`.artifacts/personal-backup-browser-20261024.json`，不提交Git。重复恢复显示“已恢复0条；已有或到期的11条未覆盖”，原文章与编辑内容保留。自动化另覆盖自定义分类往返、旧阅读/素材备份兼容和容量失败恢复。
- 本机反馈填写合成草稿与常见期望，刷新后文字、期望和`/quotes/q82`来路恢复；再次从手机菜单点击反馈仍保留同一来路。没有为测试草稿点击提交，不冒充新增生产回执或数据库验收。
- 发布前核对远端main仍为`357a2c2444ea59da5c1a9842359cd656d41d4b15`，无他人新提交；功能提交`414898a133ec80ba31aee645bc9d7be8a38c1791`已推送，`ls-remote`与本机SHA一致。[主分支CI](https://github.com/Estiado/social-commons/actions/runs/40065298743)与对应Cloudflare Pages检查均completed/success，Cloudflare显示Deployed successfully。
- 正式`social-commons.pages.dev`在390×844真实完成全部25步：首页滚动、丝路正文、阅读空间/备份、素材、导航展开、日新/撷英/观澜及反馈；每步均找到聚光目标，无横向溢出，完成后刷新不再弹出。首次移动端截图`.artifacts/onboarding-production-mobile.jpg`，逐步记录`.artifacts/onboarding-production-audit.json`，均在D盘且不提交。
- 正式阅读空间对旧资料搜索“大江东去”找到文章、原有摘录、旧文稿共3条；点击文章直接到`#reading-b1`，目标顶端约96px，蓝色搜索与原黄色收藏同时存在；打开原文稿实际选中“大江东去”。只改变检索/选区，没有编辑原文稿或重新写入生产文章，证明生产旧资料升级后的索引可用。

## 反馈入口与表单选项 · 2026-10-23

- 电脑顶部增加可见的“内测反馈”链接，原页脚和手机栏目入口保留，并共用当前路径。相关页面提供八个栏目和“不指定／其他页面或具体条目”；期望结果提供六项预填，文字可继续编辑。表单仍调用原受限RPC，无数据库迁移或权限变更。
- 完整 `scripts/dev.ps1 check` 通过67/67，日志 `.artifacts/feedback-ui-check.log`。本机浏览器实测：具体条目 `/quotes/q82` 保留；选择阅读空间和Word/PDF期望后正确填入，切回自定义可修改；从素材页点击顶部入口后自动选中“议论文素材”。1024px电脑宽度下按钮在视口内，390px手机内容宽375px，无横向溢出。临时视口已恢复默认。
- 功能提交 `9c511026e03afe87be7f237f5ff60e137d01595a` 已推送main并核对远端SHA；[GitHub检查](https://github.com/Estiado/social-commons/actions/runs/39964776176) 与Cloudflare Pages均completed/success。正式站从素材页点击顶部入口自动选中“议论文素材”，六项期望预填均可见，选择排版期望后正文正确填入；提交带“反馈选项验收”的合成反馈，服务器返回回执 `6e221bff-2d50-49a5-b3b3-a2af080f80a3`，页面显示已提交。截图 `.artifacts/feedback-ui-production.png`、`.artifacts/feedback-ui-production-success.png`，回执证据 `.artifacts/feedback-ui-production-receipt.txt`。提交接口和生产权限沿用已有配置及核验结果。

## 在线反馈收件与微信对照 · 2026-10-23

- 用户后续明确改为网站内直接提交，选择现有Supabase后台集中查看。前端改为显式提交、等待匹配回执、失败保留输入及同编号重试；本地复制和下载为副本，不冒充在线成功。不启用SMTP，不扩展到文章投稿或网站内管理员账号。
- 完整 `scripts/dev.ps1 check` 通过67/67，日志D盘 `.artifacts/online-feedback-check.log`。新增回归验证回执不匹配/超时不能报成功、只上传主动填写字段、失败重试沿用编号、匿名和登录角色均不能直接读取/写入/清空收件表、重复请求不覆盖后台状态、分钟与24小时限额。
- 202610230002增量迁移在真实Supabase执行显示Success。未重跑init.sql，未修改旧文章、私人阅读表或原有收藏；迁移仅新增beta_feedback和受限提交函数。生产实际权限查询确认anon、authenticated均无SELECT/INSERT/UPDATE/DELETE/TRUNCATE权限、RLS为true，仅可执行提交函数；真实SET LOCAL ROLE anon读取该表返回42501。证据 `.artifacts/online-feedback-permissions.txt`、`.artifacts/online-feedback-anon-denied.txt`，不是从PGlite推断。
- Cloudflare预览页真实提交返回 `d62450a0-5519-42ea-802e-e9cef9ce2a73`，后台精确查询同ID找到同正文；合成路径 `/reading/reading?token=synthetic-test#draft` 入库为 `/reading/reading`，查询与片段已剥离。未使用真实令牌或读者信息。证据 `.artifacts/online-feedback-preview-row.txt`。
- [PR #5](https://github.com/Estiado/social-commons/pull/5) 已合并，main为 `16ca300314f850a2fb85669b93dfc872e26b0f55`，本机fetch并快进一致。该提交的 [主分支检查](https://github.com/Estiado/social-commons/actions/runs/39954580782) 与Cloudflare Pages均completed/success。Code Review连接器用于对应head的CI检查，不冒充独立人工安全审查。
- 正式 `social-commons.pages.dev/feedback?page=%2Freading` 真实提交“正式站验收”反馈，网页显示已提交及回执 `a9b3a885-0502-4d71-bd75-69a5a8461b07`；Supabase精确查询同ID返回一行，同正文、期望与 `/reading` 路径均一致。截图 `.artifacts/online-feedback-production.png`，后台证据 `.artifacts/online-feedback-production-row.txt`。这是正式网址与真实数据库的端到端验证，不仅是预览部署成功。
- 微信对照见WECHAT_IMPORT.md：最早dddbe34已有缓存优先，2e0b551扩展缓存返回；两条用户原文在本机当前及原Netlify请求头下均403空响应，正式Cloudflare API均422/SOURCE_VERIFICATION_REQUIRED。第二条旧Netlify接口虽200/success，实际只有“环境异常／完成验证／去验证”三块，无文章正文。首条Edge原文导航连接被关闭。没有修改抓取链路、将恢复请求头发布为“已修复”、处理验证码或传输Cookie。

## 内容、手机体验与内测保障 · 2026-10-23

- 本轮目录为82条通识、90个摘读ID/80篇去重作品（51篇附已发表解读）、10个历史事件/30个来源视角、52个素材概念/29个站方示例；观澜保留50篇7—10月目录。新增20篇连续古典诗文及对应教育局资料摘要、12条OpenStax通识与共用素材来源；群鉴移除自拟课堂问题及无法对应的论文条目，重核概述、原文、译文和定位。来源与许可见 CONTENT_SOURCES.md、HISTORY_CONTENT.md。
- `scripts/dev.ps1 check` 全流程通过64/64；类型、ESLint、内容完整性、独立PostgreSQL权限、编辑器往返、备份原子恢复、反馈隐私、生产构建、函数打包与Word/PDF生成均通过。最终日志 `.artifacts/beta-release-check.log`；构建与过程文件均在D盘且不提交。
- 新备份测试验证正文、划线与文稿往返，重复恢复不覆盖编辑，坏标注/危险链接拒绝、过期临时记录跳过。生产权限迁移在独立PGlite模拟旧宽泛策略，验证匿名、两个身份、写入拒绝和重复执行；此项不冒充真实双账号验收。
- 实际本机浏览器390×844：素材搜索“社会”返回24条、提交后焦点与滚动定位结果（目标顶端80px）；正文宽375px无横向溢出。q82显示《念奴娇》上下片、具体来源和赏析；收藏首段、只选该段编为“内测验收 · 赤壁摘读”，标题返回后保留，旧文章和文稿仍存在。
- 实际本机Snow条目显示三种来源视角，CDC资源位于对应观点下，点击展开出现同源PDF iframe；正文无裸URL链接。6份托管原文件均校验大小、SHA256和文件类型，TXT保留原许可证；其余现代文献只链接出版源，不冒充已获整本转载授权。
- 实际本机恢复指定合成备份显示“已恢复1条；已有或到期0条未覆盖”；下载真实阅读备份成功，已移到D盘 `.artifacts/reading-backup-browser-20261023.json`。反馈复制显示“尚未发送”，没有开放在线投稿。没有清空或覆盖用户数据。
- 导出合成样本PDF为10页、6,461,806字节，最终DOCX为10,767字节；PDF URI注释和DOCX链接关系已检查。Poppler渲染第一页确认中文、链接和排版；未进行桌面Word视觉验收。
- npm官方源全依赖审计为0项：移除未使用ECharts依赖，兼容更新构建依赖，约束选择器解析器补丁。版本控制文件扫描未发现实际service_role/secret或私钥。该结果不等于渗透测试或永远无漏洞；未做并发压测。
- 生产Supabase实际只读审计确认：7张现有新旧表启用RLS；reading_documents由owner_id限制本人且排除匿名身份；站方示例写入受site_editors限制。旧articles/article_paragraphs曾有任意INSERT策略、段落SELECT为true，且客户端角色有TRUNCATE等多余权限。用户明确批准后，202610230001实际执行成功；核验anon/authenticated的两张表均可SELECT，INSERT/UPDATE/DELETE/TRUNCATE均为false，RLS均为true。匿名直接读取reading_documents实际返回42501权限拒绝。没有重跑init.sql、删除数据或执行覆盖式种子。
- 首次GitHub Ubuntu检查为63/64，失败原因为Git换行规范化改变了电子书字节。新增.gitattributes对原始TXT禁用文本换行转换，重新加入原文件并验证清单；此为真实CI发现并修复的问题，不放宽散列测试。
- 生产匿名角色实际可见2篇旧公共文章、35个公开段落，私人段落为0；authenticated无用户身份时私人段落和reading_documents均为0。角色核验为事务内SET LOCAL ROLE后回滚，不创建用户、不修改正文；不是两位真实登录用户的端到端验收。证据在D盘 `.artifacts/production-rls-*`。
- 两次功能提交经 [PR #4](https://github.com/Estiado/social-commons/pull/4) 合并，main为 `6caf43ff4075d42c0041e32b9b4e1e61de51af02`，已fetch并快进本机。PR最终Ubuntu检查成功（52秒），[主分支CI](https://github.com/Estiado/social-commons/actions/runs/39921831819) 与Cloudflare Pages均为completed/success。Code Review连接器本轮成功读取对应head的检查和失败日志；此为CI诊断，不冒充独立人工代码审查。
- 正式站Edge实际验收：素材页显示52条、分类下拉；手机390×844搜索“社会”显示24条，并将焦点移到搜索结果。截图D盘 `.artifacts/beta-production-mobile-materials.png`。正式站q82实读上下片与教育局赏析及题名链接，保存文章、收藏首段显示mark与成功状态。
- 正式站内置浏览器实际将q82首段单独编成文稿“正式站验收 · 赤壁摘读”，新文稿仅含所选上片、署名与题名链接；返回列表后标题仍存在，旧三篇文章与原摘录保留。390×844正文宽375px、正文默认16px、标题输入20px，排版设置与更多均折叠；截图 `.artifacts/beta-production-mobile-editor.png`。页脚“数据与备份”实际定位并展开可恢复备份；反馈复制实际显示“尚未发送”。本轮新增测试条目均另存，不覆盖原内容。
- 源码资料字节校验、部署成功和真实浏览器验收分别记录；现代文献不能确认整本镜像许可或下载失败时仍使用出版源链接。微信、SMTP、账号同步继续延期；没有在生产执行站方示例覆盖式种子。

## 全站扩容与常用文稿样式 · 2026-10-22

- `npm run check` 完整通过，57/57：类型、ESLint、独立 PGlite 权限、结构与快照、编辑器往返、生产构建、Cloudflare 函数与 Word/PDF 生成。完整日志为 D 盘 `.artifacts/content-expansion-check.log`。
- 新增回归验证旧 50 个名句 ID 全保留、70 个 ID 唯一、目录去重、每条新摘读的来源与评析、专题关联、50 篇时评日期范围，以及新版正文不覆盖旧划线；源码和种子数量共同核对。没有执行生产 SQL、没有启用邮件。
- 导出合成样本：10 页中文 PDF、6,461,708 字节；DOCX 10,794 字节。OOXML 验证微软雅黑、14 磅、双倍行距及原格式标记。Poppler 已渲染检查第一页与末页；句号孤立成行问题调整后重验末页。PDF 文本提取覆盖作者与第45段。未进行桌面 Word 的视觉版式验收，不能把 OOXML 检查等同于 Word 渲染。
- Edge 本机真实验收：`q51` 的两首诗、蒙曼书摘摘要及出处可读；保存全篇并收藏第一段，阅读空间出现独立文章与摘录。只选此摘录编成文稿，改名“语段精读 · 扩容验收”，设微软雅黑、14 磅、双倍行距，返回后重开保持样式与文本；未修改其他旧文稿。
- 390×844 设置下，编辑器和《春江花月夜》DOM 宽度为375（另有滚动条），文档宽度同为375，无横向溢出；正文含结尾“落月摇情满江树”及莫砺锋解读。临时视口已恢复。一次浏览器截图超时，不把失败截图写成成功证据。
- `essay?id=e26` 显示“同样两小时”的明确教学设例与 OpenStax 来源；`guanlan` 显示50篇，浙江宣传+9月筛为5篇；新印刷史主题显示三个视角与参考资料。Word/PDF 的本次生成产物与截图均在 D 盘 `.artifacts/`，不提交仓库。
- 功能提交 `683c364bc99ab9745cd6e43e5907ac58f2088548` 经 [PR #3](https://github.com/Estiado/social-commons/pull/3) 合并为 `9b4bf252673c011fc1105b913d8062cdcbaa62ab`；已 fetch 并快进本机 main。PR 的类型、回归与构建检查成功（39秒），Cloudflare Pages 显示 Deployed successfully；[主分支 CI](https://github.com/Estiado/social-commons/actions/runs/39790978484) 和主分支 Cloudflare Pages 检查均为 completed / success。
- 正式站 Edge 实际验收：`/quotes` 显示60篇、31篇附出处解读；勾选出处筛选找到31篇，搜索“长干行”找到1篇；`/quotes/q51` 两首正文与蒙曼书摘出处均可读。`/quotes/q23` 为王永年译本连续开篇，附版本及完整刊载链接，不再单独截取“忠诚”一句。`/guanlan` 显示50篇，浙江宣传+9月筛为5篇；`/events/printing-connections` 显示三种视角、原始馆藏参考及明确标注的本站教学问题。
- 正式站截图保存至 D 盘 `.artifacts/content-expansion-production.png`，已实际查看。Code Review 连接器仍要求连接 GitHub，未获得该连接器的审查结果；CI 结论来自 GitHub 页面及其官方公共接口。以上线上页面验收不等于已执行生产 SQL，也不等于微信全文抓取已恢复。

## 观澜合并与文稿编辑 · 2026-10-22

- `npm run check` 完成：类型、ESLint、53 项回归、生产构建、Cloudflare 函数打包和 DOCX/PDF 生成。新增用例覆盖验证页、V2→V3 升级、专题关联、仅所选内容编排、格式与编号往返、跨标签页冲突、旧包幂等迁移、目录日期与分类完整性。
- 导出合成样本生成 6 页中文 PDF；DOCX 检查文字、加粗/斜体/下划线/删除线、对齐和链接关系。产物在 D 盘 `.artifacts/export-verification/`，不进入 GitHub；未在桌面 Word 中完成视觉排版验收。
- Edge 本机真实流程：青年与责任主题→粘贴自写内测文章→保存返回同一主题→个人文章卡片→收藏第一段→阅读空间仅选择该段→生成文稿。未选第二段未进入初始文稿；修改标题、输入文字、加粗后刷新仍保留。继续选材追加整篇文章后，之前的编辑与新文章同时存在。
- 390×844 窄屏真实查看日新及文稿工具栏；五大类加全部共六个按钮，细分类下拉保留；文稿按钮换行，页面内容宽度 375px、小于 390px 视口。截图留 D 盘 `.artifacts/`。顶部原横向图标栏改为可展开栏目菜单。
- 用户微信链接的真实本机 API 请求返回来源 HTTP 403，未生成正文；截图里的“环境异常／去验证”响应另用固定回归样本验证，返回 422 / SOURCE_VERIFICATION_REQUIRED。不得把模拟挑战页测试说成已读取该文全文。
- 浏览器 Word 下载验收触发自动化连接中断；随后用户在 Edge 下载列表确认“课堂讲义 · 正式站验收.docx”已下载到桌面。因此实际 Word 下载由用户确认通过；桌面 Word/PDF 视觉排版仍未验收。浏览器工具不允许访问内部下载管理页，未绕过该限制或修改用户的下载设置。
- 精选由 13 扩为 40 篇，27 条增补分别核对媒体原文的标题、日期和可见署名；未署名留空。7—10 月目录、主题关联、媒体和月份筛选均来自版本化数据；生产数据库种子本轮未执行，独立测试数据库执行了新种子并验证数量和权限。
- 功能提交 `c79822142440af1dfe64f4a07c21b982e4231fb6` 经 [PR #2](https://github.com/Estiado/social-commons/pull/2) 合并为 `2aea4d60534bd07eaff5b500f2f1b1267f63b0df`，已 fetch 核对并快进本机 main。PR 检查成功；[主分支 CI](https://github.com/Estiado/social-commons/actions/runs/39774770431) 成功，Cloudflare 对该合并提交显示 Deploy successful，部署 `455374d0`。
- 正式站实际打开 `/guanlan`：显示 40 篇、13 个主题；选择南方周末后只显示该媒体的 2 篇。进入 `/reading`、新建文稿、输入标题与正文、加粗均正常；Word 实际下载由用户确认。不能据此宣称所有来源全文可提取。
- 仓库简介已改为统一选材与在线编辑说明；GitHub 官方 API 确认仓库仍为 public、主页仍指向 Cloudflare。未邀请协作者或扩大权限。Code Review 连接器提示需要连接 GitHub，未获得独立审查结果；检查结论来自 GitHub 自身 CI、Cloudflare 状态及本地验收。

## 阅读统一与仓库整理 · 2026-10-22

- 日常入口恢复为正式 Cloudflare 网站；浏览器内保存不需要运行本机服务，邮件与跨设备同步仍延期。以下为本轮最新状态，与历史记录冲突时以本节为准。
- `npm run check` 全流程完成：类型、ESLint、46 项回归（46 通过、0 失败）、独立 PostgreSQL RLS、生产构建、两项 Cloudflare 函数打包及真实 Word/PDF 生成。日志为 D 盘 `.artifacts/unification-check.log`。PDF 6 页、6,459,362 bytes；Word 10,570 bytes。Word 尚未做版式渲染验收。
- “丝绸之路”曾实际出现动态模块加载失败，开发依赖返回 `504 Outdated Optimize Dep`。改用共享阅读器并处理过期模块整页重载后，真实浏览器能打开完整条目，检查时无控制台错误。
- 真实浏览器在日新收藏段落、在撷英选择文字并划线；阅读空间显示新旧共 4 条摘录。IndexedDB 原有南方周末两条摘录保留，新增索引无需清库。
- 实际选取两条摘录创建素材包、填写备注；刷新并隔数小时再打开，素材包引用和备注仍保留。点击摘录出处进入对应私有文档的 `#reading-b4`，目标段落实际位于视口顶端下方 96px。
- 实际下载素材包 Word，移动到 D 盘 `.artifacts/export-verification/workspace-collection.docx`；解包核对备注、两条来源内容与出处字段均存在。此处是 OOXML 内容验收，不等于 Word 排版视觉验收。
- 1024px 与 390px 视口检查未见页面级横向溢出。重复运行开发启动器返回“社科通识已经在运行”，正常退出；没有结束原进程或改变端口。尚未模拟其他程序占用该端口。
- 回归覆盖内置内容适配、V1 原位升级、摘录索引、素材快照版本、旧摘录追加、素材包去重和备注合并、备份关系、过期模块识别。真实旧云端身份迁移尚未验收；未删除旧表或原件，不能称旧权限已整改。
- 新业务统一归入 `src/features/reading/`；兼容平台配置归入 `config/`，开发 CMD 归入 `scripts/windows/`。已补中文目录导览、交接说明、贡献约定、问题/PR 模板与自动检查工作流。
- 功能提交 `fa9be86d6a08ff1220f225e89b81e453934b7ae1` 已推送并通过 [PR #1](https://github.com/Estiado/social-commons/pull/1) 合并，主分支为 `a2a107201080951b3627be5558a556f222b324a0`；已 fetch 核对并将本地 main 快进到同一提交。PR 的 Ubuntu 检查成功（33 秒），主分支检查成功（41 秒），Cloudflare Pages 均显示 Deployed successfully。
- 正式站真实打开 `/events/silk-road`，五个视角及文献目录完整显示；已加入私人阅读空间。在 `/daily` 收藏修昔底德概念的段落，在 `/quotes/q44` 实际双击选词并收藏划线，刷新阅读空间后仍显示三篇长期保存文章及两条摘录。正式站不是本机开发地址，二者浏览器存储互相独立。实际页面截图留在 D 盘 `.artifacts/reading-space-production.png`，不提交仓库。
- GitHub 已保存新的项目简介、正式网站入口和教学素材主题标签；根 README 已显示中文目录导览。Code Review 插件返回“Connect your GitHub account to continue”，未获得插件诊断；上述检查结果来自 GitHub 页面，不能称独立代码审查已通过。
- 最后移除无调用方的 `netlify/functions/topics.ts` 转发残留，话题逻辑仍在 `server/topics.ts`，根目录不再出现旧平台文件夹。再次完整运行 `npm run check` 成功（46/46）；日志 `.artifacts/final-structure-check.log`。真实生产接口 `GET /api/extract-article` 返回 JSON 405，确认仍进入 Function 路由；不以此冒充文章抓取全文验收。

## 当前内测 · 2026-10-22

- 用户决定先本机使用，邮件和跨设备同步延期。新阅读入口默认 `VITE_READING_CLOUD_ENABLED=false`，不把登录作为本机收藏的前提。此前关于提取缺 Supabase Secret 的响应是旧版本事实；新提取为无状态服务，不依赖数据库服务端密钥。
- 当前 `npm run check` 通过：类型、ESLint、38 项回归、独立 PostgreSQL RLS、生产构建、提取/图片函数打包、真实 Word/PDF 生成。最终过程日志在 D 盘 `.artifacts/final-check.log`。
- 回归包含：受限正文标识、节选导出、不延长七天期限的补全文、本机长期保存和标签页版本冲突、分卷导出/失败清单/取消、素材备份恢复、公开评析来源字段、编辑名单不可自授及站方示例写权限。
- 真实 PDF 生成 6 页，约 6.46 MB，已逐页渲染查看；中文、页边距、页码与跨页顺序正常。文字可提取验证包含第 1、45 段和作者。完整静态中文 TTF 用于修复子集丢字。Word 已检查 OOXML 可编辑正文、样式和原文超链接；Windows 未提供 LibreOffice，尚未完成 Word 版式渲染验收。
- 真实媒体：澎湃链接可预览、导入、刷新续读；南方周末 `/contents/343016` 只公开两段，实际预览显示“公开节选，尚未取得全文”，提供粘贴完整正文和显式保存节选，不宣称已取得全文。旧本机节选也能识别其完整性警告。
- 本机浏览器新增素材后刷新，正文仍在；保存到私有本地区域，没有写入站方推荐。南方周末节选无需账号即可收藏段落，刷新后仍保留；实际双击选择“考核”并收藏划线，阅读空间显示两条摘录及本机长期保存。
- 实际点击“全部 Word · ZIP”，下载包含两篇文章的压缩包。检查包内两份 DOCX、各自文章与摘录 JSON、最终导出清单及使用说明；两篇均成功。浏览器沿用默认下载目录，已将本次验收文件移动至 D 盘 `.artifacts/export-verification/browser-reading-docx.zip`。
- 从经典文章实际点击相关概念进入 `/daily/d12`，点击相关名句进入 `/quotes/q29`，均为独立条目；`/quotes/q44` 显示马俊江资料摘要、具体出版信息及原文链接。390×844 检查阅读空间与正文，页面宽未超过视口；窄屏段落收藏和整库导出均有入口。
- 生产 Supabase `dwubzeqwwsvlhbqvgldk`：阅读空间迁移与站方示例迁移执行成功；两个种子成功。只读核验返回公共精选 13、示例 2、编辑名单 0、5 张新增表均启用 RLS。旧文章/收藏表未修改。此核验不等于真实双账号保存测试。
- SMTP 原本关闭，平台提示必须先设置自定义 SMTP 才能编辑邮件模板。填写页曾展开但未输入/保存凭证；用户明确延期，已点击 Cancel，确认开关恢复关闭。未发送登录邮件、未创建编辑账号、未开启身份绑定。独立 PGlite 的权限测试不冒充真实账号验收。
- 12 个名句 ID 已换为可点开的具体资料摘要；未核验旧评析撤下。50 个稳定名句 ID 保留，不能称全部名句译文与评析已核验。
- 功能提交 `caa66365fceb5fe1f399a755e8dcb81f4446e6e8` 已推送，GitHub 远端 SHA 一致，Cloudflare Pages check 成功。生产首页 HTTP 200，入口为 `index-DoqPXTZ6.js`。实际生产提取：南方周末返回 `partial`、两块正文及节选警告；澎湃 `34256488` 返回 12 块（含 1 图），完整性仍为待人工核对，未冒充已核验全文。生产中文字体资源 HTTP 200。
- 随后的维护提交统一新增业务模块排版并提供 `format:reading`。本机模式的账号钩子直接跳过会话读取，避免历史登录凭证刷新阻塞本地文章；云端开启时的会话异常也有错误状态。

以下为此前重构的历史记录，与上面当前状态冲突时以上面为准。

## 自动检查

`npm run check`：前端、服务端与 Vite 配置类型检查；ESLint；25 项 Node 原生回归测试；前端生产构建；Cloudflare 函数独立打包与 GET JSON 405 冒烟检查。

没有新增测试框架依赖。接口测试模拟 Supabase 和来源网站，覆盖缓存、新文章写入、手动话题归类、段落失败补偿、未登录拒绝、请求/响应大小限制和恶意跳转。

另用临时公开测试占位值构建了启用 Supabase 的版本，输出到 `.artifacts/configured`；确认云端功能分支可以编译，未把占位值写入源码或正式 `dist/client`。这不等于真实数据库联调。

## 浏览器实际观察

- Edge 线上旧版：观澜正常显示；全站搜索输入“人工智能”得到“未找到相关内容”，确认二次过滤问题。
- 本地开发版：中文搜索能返回通识/议论文/历史条目；“修昔底德”可跳到 `/daily?id=d1`，条目展开；“采菊”可跳到 `/quotes?id=q44`，主卡片显示对应名句。
- 390×844 窄屏：搜索入口有名称且可使用；读取到视口宽 390、文档内容宽 375，没有页面级横向溢出。
- 最终生产构建预览：实际打开页面、按需加载搜索弹窗并显示中文结果；检查期间未捕获浏览器警告或错误。
- 过程截图在 `.artifacts/search-production.jpg`、`mobile-after.jpg`，仅保留在 D 盘工作区。

此前内嵌浏览器连接超时；重试后连接到用户已打开的 Edge，并使用浏览器可访问的本地预览进程完成以上验证。没有修改 Windows 隔离或防火墙设置。

## 加载量与算法

本地相同无数据库环境变量下，修改前首屏单脚本 **1,118,480 bytes**（构建报告，约值）；修改后 HTML 入口及所有 modulepreload 的 JS 合计 **484,250 bytes**，gzip 合计 **169,494 bytes**，原始 JS 减少约 57%。首页 JavaScript 计算包含框架与运行时，不仅比较一个入口文件。

带 Supabase 测试占位配置的构建，首屏 JS 合计 **699,607 bytes**，gzip 合计 **224,718 bytes**；原线上脚本实测 **1,362,441 bytes**。因配置和构建环境不同，这一组只说明当前加载规模，不能视为严格相同条件的性能基准。Word 库约 391 KB 保持按需加载。

本轮没有测量设备峰值内存、LCP 或真实用户访问分布；不能把脚本变小直接说成页面快几倍。搜索最坏仍是线性子串匹配，主要减少重复转换、完整结果数组和不必要渲染。话题计数从每话题重复遍历改为一次统计。

## 上线前状态与验证边界

旧版线上首页 HTTP 200，脚本为 `/assets/index-DUNnMuc4.js`。旧 `/.netlify/functions/extract-article` 返回 **200 text/html** 且内容是 SPA 壳，没有执行文章提取；这验证了原部署平台不匹配的问题。

本轮不修改 Cloudflare Secret、不操作线上数据库、不向线上库插入测试文章，也没有实际删除任何线上文章。云端收藏/匿名登录、Word/PDF 下载的完整设备交互、RLS 权限与多用户并发事务仍需要配置环境后的专项验收。

## GitHub 与 Cloudflare 发布确认

- 代码提交 `b460595ffe6930c1d54f59d09d3c6d71d0fb545e` 已推送至 GitHub `main`，使用 `git ls-remote` 核对远端提交一致。
- GitHub 的 `Cloudflare Pages` check 返回 `completed / success`，对应预览部署 `https://017f9894.social-commons.pages.dev`。
- 生产站 `https://social-commons.pages.dev/` 返回 HTTP 200，页面标题已更新，入口脚本从 `index-DUNnMuc4.js` 变为 `index-DpcsVvgI.js`。
- 在真实生产站打开搜索，输入“修昔底德”，成功看到“日新 · 通识”和“议论文素材”两类结果。截图在 D 盘 `.artifacts/search-live.jpg`。
- `GET /api/extract-article` 返回 **405 application/json**，已不再误返回 SPA HTML，确认 Pages Functions 实际生效。
- 不携带登录凭证的诊断 POST 返回 **500 / 服务器未配置 Supabase，请联系管理员**。这表示运行期 `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` 至少一项缺失，不能据此声称文章提取已可用。维护者需在 Cloudflare 运行期补齐配置后重新部署；Secret 不应粘贴进聊天、源码或 `VITE_*`。

生产站已验证前端与 API 路由发布成功；真实用户的提取、收藏、导出链路仍受云端配置与权限专项验收限制。

## 2026-10-28 各栏目扩充与搜索复查

- 内容：139条日新、109个素材概念/86个示例、110诗文稳定ID/100篇去重推荐/71篇有出处解读、14历史事件/42视角、15观澜事件/48份提要、6篇知天下/33章/57书签。统一稿58组1469字段。示例SQL种子已生成，未执行生产迁移或种子。
- npm run check先完成类型及ESLint，97项测试中仅旧测试把目录前两项硬编码为旧ID而失败。将断言改为本次实际关联的ID后，97/97通过，继续完成生产构建、Cloudflare函数及导出检查；没有反复重跑已通过的全套步骤。导出检查生成PDF10页、DOCX，仍属模型/文件验证，不冒称本轮实际Word桌面编辑或数据库验收。
- 本机浏览器已实测首页搜索条、多词“AI 学习”、媒体新华社筛选（5条缩为1条）、ArrowDown/Enter直达/world/ai-energy及新6章正文。390/768/1440宽度无页面横向溢出；手机筛选进一步改为两行栏目、44px关闭和清空触点、明确select标签及短摘要完整显示。后续窄范围检查与正式发布状态见下方收尾记录。
- Impeccable从D盘已有0.1.17引擎加载既有界面上下文，机械检测返回空列表；这不等于视觉完美。Frontend Design先设计、Taste方向对照、Impeccable操作界面规则与实际截图共同用于复查。过程文件在.artifacts，未加入Git。
- 本轮早先的默认隔离服务占用5180但未响应浏览器；已结束本轮会话并在本机启动同一项目，无结束其他应用进程、换端口或更改系统网络设置。无微信、数据库、账户及SMTP改动。
- 收尾：8项搜索专项复查、类型、ESLint及最终生产构建通过。真实页面已验证空结果与重新搜索、Ctrl+K、来源筛选和键盘直达独立文章；控制台error为空。手机栏目由横向滚动改为两行，三个筛选保留原生控件和明确标签。该复查不再次运行已通过的97项全套和导出生成。
- 发布前fetch核对HEAD与origin/main为0/0，本轮未与他人修改分叉；接下来推送后以GitHub检查和Cloudflare状态为准，正式站验收另行补记。
- 发布完成：功能提交525209e91146699c1a90a8b476e7363b0b885324已推送，ls-remote与本地SHA一致。[GitHub类型/回归/构建](https://github.com/Estiado/social-commons/actions/runs/40698355035/job/122851081281)及[Cloudflare Pages](https://github.com/Estiado/social-commons/runs/122851845184)均completed/success，后者明确Deployed successfully。
- 正式站新首页搜索已实测：“AI 用电”返回知天下1条，显示分类、完整短摘要及IEA/新华社/UNECE来源；点击直达/world/ai-energy。10月14日时间书签定位到正文b25，距顶部约96px；控制台error为空。截图production-ai-energy.png与search-final.png、search-mobile-final.png存D盘.artifacts/search-design，未提交。用户要求重新加载的本地搜索面板已保留打开。
- 此次收尾仅补交接记录，不重复全量检查，也不等待文档提交再次触发的相同生产构建。未做新并发压测、邮箱、微信或真实数据库检查，不将页面抽样说成这些项目已验收。
