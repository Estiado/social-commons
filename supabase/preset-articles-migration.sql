-- ============================================================
-- 预置文章支持 - 数据库迁移脚本
-- 使用方法：在 Supabase 控制台 → SQL Editor 中执行
-- 为 articles 表添加 is_preset 字段，标识预置经典时评文章
-- ============================================================

-- 添加 is_preset 字段
alter table public.articles
add column if not exists is_preset boolean default false;

-- 创建索引
create index if not exists articles_is_preset_idx on public.articles(is_preset);

-- 更新已有预置文章（如果通过URL匹配）
-- 这些URL是预置文章的原文链接，执行后会标记为预置
update public.articles
set is_preset = true
where url in (
  'https://zh.wikisource.org/wiki/少年中国说',
  'https://zh.wikisource.org/wiki/拿来主义',
  'https://zh.wikisource.org/wiki/敬业与乐业',
  'https://zh.wikisource.org/wiki/论气节',
  'https://zh.wikisource.org/wiki/咬文嚼字',
  'https://zh.wikisource.org/wiki/谈独立思考',
  'https://zh.wikisource.org/wiki/科学的人生观',
  'https://zh.wikisource.org/wiki/论时间',
  'https://zh.wikisource.org/wiki/宽容',
  'https://zh.wikisource.org/wiki/什么是教育',
  'https://zh.wikisource.org/wiki/人与永恒',
  'https://zh.wikisource.org/wiki/论读书',
  'https://zh.wikisource.org/wiki/经济发展理论',
  'https://zh.wikisource.org/wiki/文史传统与文化重建',
  'https://zh.wikisource.org/wiki/平等与效率'
);

-- 验证
select count(*) as preset_articles_count from public.articles where is_preset = true;
