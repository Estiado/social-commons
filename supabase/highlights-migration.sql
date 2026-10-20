-- ============================================================
-- 社科通识网站 - 划线收藏功能 数据库迁移脚本
-- 使用方法：在 Supabase 控制台 → SQL Editor 中执行
-- ============================================================

-- ============================================================
-- 划线收藏表（用户选中的句子/片段）
-- ============================================================
create table if not exists public.saved_highlights (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid default auth.uid(),
  article_id uuid references public.articles(id) on delete cascade,
  paragraph_id uuid references public.article_paragraphs(id) on delete cascade,
  selected_text text not null,
  start_offset int default 0,
  end_offset int default 0,
  note text,
  created_at timestamptz default now(),
  unique(user_id, article_id, selected_text)
);

create index if not exists saved_highlights_user_idx on public.saved_highlights(user_id);
create index if not exists saved_highlights_article_idx on public.saved_highlights(article_id);

-- ============================================================
-- 素材包-划线关联表（素材包可以包含划线收藏）
-- ============================================================
create table if not exists public.collection_highlights (
  collection_id uuid references public.collections(id) on delete cascade,
  highlight_id uuid references public.saved_highlights(id) on delete cascade,
  sort_order int default 0,
  note text,
  created_at timestamptz default now(),
  primary key (collection_id, highlight_id)
);

-- ============================================================
-- RLS 行级安全策略
-- ============================================================
alter table public.saved_highlights enable row level security;
alter table public.collection_highlights enable row level security;

-- 划线收藏：用户只能看和管理自己的
create policy "highlights viewable by owner" on public.saved_highlights
  for select using (user_id = auth.uid());

create policy "users can manage own highlights" on public.saved_highlights
  for all using (user_id = auth.uid());

-- 素材包-划线关联：用户只能操作自己的素材包
create policy "collection_highlights viewable by owner" on public.collection_highlights
  for select using (
    exists (select 1 from public.collections c where c.id = collection_id and (c.user_id = auth.uid() or c.is_public = true))
  );

create policy "users can manage own collection highlights" on public.collection_highlights
  for all using (
    exists (select 1 from public.collections c where c.id = collection_id and c.user_id = auth.uid())
  );

-- ============================================================
-- 完成提示
-- ============================================================
-- 划线收藏功能数据库初始化完成！
-- 表结构：
--   saved_highlights - 用户划线收藏的句子
--   collection_highlights - 素材包与划线的关联
-- 前端代码推送后即可使用划线收藏功能
