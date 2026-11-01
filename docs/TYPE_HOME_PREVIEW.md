# 活字长城首页 · 独立预览

2026-11-01。用户明确纠正：要整屏首页效果，保留所给构图，只把米白与木字阵间的虚化直线改为真实长城轮廓，动效保留。素材介绍页已撤销，不得恢复为主交付。用户又否定博物馆活字照片，要求从有质感的纪录片寻找旧木边缘；旧活字实拍已获认可作为备选并做成窄边试用，不能把备选认可等同最终视觉确认。

## 2026-11-01 视觉调校（取代下方旧参数）

- 用户指定“上空下实”：背景从 #f8f4ec 经 #e8dbc4 至 #aa8a65 纵向过渡；导航棕墨色 #4b382a、标题 #402f25。标题由7.3vw改为6.65vw，右侧留白12%改14%，字距.105em；导航天头9%。仅议论文素材600字重，其他栏目500。手机目录显式ltr，避免旧书页rtl规则反转次序。
- 仍使用金山岭实拍城垛原始描边，不生成长城。轮廓高差2.8改6，羽化5px改3px，轮廓处34%不透明，沿页面向下300px平滑到完全实；未添加云雾、山体或石墙。`scripts/type_boundary.py`统一构建alpha和像素采样交互边界，消除描边与鼠标锁定的来源差异。单独重建：`D:\python\python.exe -X utf8 scripts/type_boundary.py <workspace>`，随后用Prettier格式化typeBoundary.ts。
- 指针升降上限.99改1.8、邻域半径2.6改3.5，保持0.5秒升起、1.2秒回落的指数阻尼、不弹跳。字身固定高度改3.6，中心同步下移，最高升起时底面仍低于字床，不缩放、不悬空。边界附近以最大升起高度投影锁定，避免冲出城垛。
- 光源由3.5降2.6，补暖色填光和极弱侧面填色，保留接触阴影与哑光木纹。静态回退已由同场景重新捕获。
- 完整`npm run check`119/119；开发浏览器1440/768/390/320无横向溢出，鼠标24块响应，模拟触控28块响应，结束后active=0/framePending=false。章节进入后canvas=0/ghost=0/main非inert，返回后仅一个canvas。证据：`.artifacts/type-refine-check.log`、`type-refine-qa.json`、`type-refine-navigation.txt`、`type-refine-touch.txt`。
- Impeccable实际页面detect仅保留用户指定米白配色警告，见`type-refine-detect.json`；不能把此警告当成颜色需求被否定，或声称机械零警告。尚未新增实体手机、低端GPU、Safari验证。

## 隔离与备份
- 工作区：D:\CodexData\workspaces\social-commons-type-preview，分支 codex/type-preview。
- 备份：D:\CodexData\workspaces\social-commons-backups\book-home-2026-11-01，含源码、素材、静态构建、两尺寸截图、SHA256和RESTORE.md。
- 标签 codex/book-home-backup-2026-11-01 已推送，指向365a255a6066412782152ac6ba49f7c2fe086afb。
- old codex/book-preview=365a255，main=bdf9a1d，均不更新；原工作区5个雾稿保持原地且未打包。
- 备份截图来自同提交构建的本机复原；本轮旧不可变公网截图请求连接失败，不将本机截图冒称线上。

## 当前首页
- 入口仍是BookContents，目录顺序/链接和章节/正文不变。左上竖排目录、右侧书名、下半部木字阵来自用户给的构图；没有加入科普内容或长城照片。
- BookTypeField/typeFieldScene：Three.js r187，1000个实例实体字模；实际宋体镜像字面+浅浮雕高度图，整块平移，不拉伸字身。鼠标邻域起伏、触摸轻点、暂停/后台/减少动态及捕获/清理接口，无React逐帧状态。
- 《千字文》按维基文库原作1000个Unicode字校对；原文保留。字库不含𡓜，图面用通行异体牆，字序不变，未生成伪汉字。原始字序先竖排、再整体镜像映射。
- 长城mask从已选金山岭实拍前景城垛逐点描边，仅使用透明轮廓，不带入山体。home-wall-trace.json保留原图坐标与仿射参数。当前采用6倍实拍城垛高差、3px羽化及沿轮廓向下300px的透明度渐变；生成脚本同时输出交互边界。
- 字身木纹为Poly Haven真实摄影CC0；窄边磨损取自用户认可备选的Declan Sun实拍，适用Unsplash License。真实字面保留，未把源照片旧字形或生成贴图混入。
- 首页选中章名到古书标题的原衔接保留；转场用实际画布捕获，ghost带独立首页样式，进入章节后释放原WebGL场景；其他目录、正文数据与阅读器无改动。

## 验证与未完成
- npm run check：119/119，类型/ESLint/前端/Functions/导出均通过。
- 开发构建实际浏览器：1440/768/390/320无横溢出，鼠标15个邻域字模升降、暂停高度固定；进入议论文素材后0残留画布/ghost且main非inert；返回后仅1个场景。
- Impeccable实际首页扫描仅报cream-palette，此为用户明确指定米白背景，保留并人工核对；不能把该告警消失当成全站审查通过。
- 后续仍需：材质试用的用户视觉反馈、边界两排逐列固定已实现，仍需真机复核；真机/Safari、生产构建快速点击/缩放/无WebGL/后台清理专项。当前不声称首页最终视觉已获确认，不声称全程60fps。
- 原型图与临时测试截图不提交。实际证据在.artifacts/type-home-*.json/png、type-home-check.log。

## 纪录片参考
- 中国非遗网《梨墨刻印 匠心描摹》：https://www.ihchina.cn/news_1_details/28313.html，公开源视频m65fd55aee6288.mp4，21分。官方资源采集成果，2018年拍摄；版权归原权利人，不标为CC0或软件MIT。
- 《谱师家族的传承故事》：https://www.ihchina.cn/project_details/28393.html，m65fd57d6b26dc.mp4，4分。
- UNESCO：https://ich.unesco.org/en/video/3101，文化部2009申遗纪录片，候选，未采用。
- 《了不起的匠人》第12集《东源村的修谱师》：浙江在线2016报道，候选；报道照片有水印，只作参考，未作正式材质。

生产构建补测：减少动态已等待media事件，active=0、framePending=false；鼠标邻域14个字模响应，最大约0.99字宽；章节到达0画布/ghost且main非inert。证据type-home-prod-qa.json。

## 实拍磨损试用与手机修复
用户已将Declan Sun的高清旧活字实拍确认为取材备选。现只取约5px纹理细边与积墨明暗，保持新宋体字形和原构图；不是纪录片截帧，原件、许可和裁切坐标均保留。此为试用版，不能等同最终视觉确认。轻微景深跟随参考图，不影响目录。

合成手机试验曾发现pointerup紧接touch pointerleave，导致回落立即覆盖升起。已将触摸离开与鼠标离开分开，保留700ms轻点脉冲；拖动取消仍走原生滚页。无WebGL已实测同场景静态图显示，原生合成滑动scrollY=104。原型首次手机轻点结果active=0为失败证据，不冒充通过；修复后需以最新QA结果为准。
补测通过：手机轻点15个邻域字模响应，脉冲结束active=0/framePending=false；桌面→手机→桌面静止构图的SHA256完全一致。最终完整检查见type-home-release-check.log。用户认可的实拍磨损材质作为本轮试用，仍不是最终审美定稿。新站独立地址 https://codex-type-preview.social-commons.pages.dev/，正式与旧预览不更新。
