-- Reviewed source-based site examples. No reader's private data.
begin;
insert into public.essay_examples (id,concept_id,title,content,source,source_url,usage_hint) values
('example-thucydides','e1','“修昔底德陷阱”是一种研究视角，不是战争预言','哈佛大学贝尔弗中心的项目介绍列出 16 组大国竞争案例，其中 4 组没有以战争告终。项目同时说明，其讨论目的是避免冲突，而非把历史当作未来必然重复的定律。这些数字属于该项目的案例选择，不能直接解释为所有国家关系的战争概率。','本站依据 Harvard Kennedy School Belfer Center 的 Thucydides’s Trap 项目介绍整理；非原文引语。','https://www.belfercenter.org/programs/thucydidess-trap','比较结构压力与政治选择；避免将有限案例的比例直接当作普遍概率。'),
('example-lemons','e2','二手车市场为什么会出现“逆向选择”？','诺贝尔奖官网对 2001 年经济学奖的说明以二手车市场介绍阿克洛夫的研究：卖方比买方更了解车况时，买方难以区分质量，优质商品可能因此退出市场。这里讨论的是信息结构对交易的影响，不能简单推论所有市场都会失灵。','本站依据 NobelPrize.org 的 2001 年经济学奖新闻稿整理；非原文引语。','https://www.nobelprize.org/prizes/economic-sciences/2001/press-release/','可用于分析信任、质量认证与信息披露；引用时注明其模型条件。')
on conflict(id) do update set concept_id=excluded.concept_id,title=excluded.title,content=excluded.content,source=excluded.source,source_url=excluded.source_url,usage_hint=excluded.usage_hint;
commit;
