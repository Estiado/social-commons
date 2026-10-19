-- ============================================================
-- 社科通识网站 - Supabase 数据库初始化脚本
-- 使用方法：在 Supabase 控制台 → SQL Editor 中执行
-- ============================================================

-- 启用 UUID 扩展
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. 文章表（观澜 - 时事时评聚合）
-- ============================================================
create table if not exists public.articles (
  id uuid primary key default uuid_generate_v4(),
  url text not null unique,
  title text not null,
  author text,
  source text,
  published_at timestamptz,
  excerpt text,
  content text,
  tags text[] default '{}',
  is_public boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists articles_source_idx on public.articles(source);
create index if not exists articles_created_at_idx on public.articles(created_at desc);
create index if not exists articles_tags_idx on public.articles using gin(tags);

-- ============================================================
-- 2. 文章段落表（个人素材库 - 段落分块）
-- ============================================================
create table if not exists public.article_paragraphs (
  id uuid primary key default uuid_generate_v4(),
  article_id uuid references public.articles(id) on delete cascade,
  paragraph_index int not null,
  content text not null,
  created_at timestamptz default now()
);

create index if not exists article_paragraphs_article_idx on public.article_paragraphs(article_id, paragraph_index);

-- ============================================================
-- 3. 话题标签表
-- ============================================================
create table if not exists public.topics (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique,
  description text,
  created_at timestamptz default now()
);

-- 预置高考作文高频话题
insert into public.topics (name, slug, description) values
  ('科技创新', 'tech-innovation', '科技发展、创新精神、人工智能等'),
  ('文化传承', 'cultural-heritage', '传统文化、文化自信、非遗保护等'),
  ('青年担当', 'youth-responsibility', '青年责任、时代使命、奋斗精神等'),
  ('人与自然', 'human-nature', '生态文明、环境保护、可持续发展等'),
  ('个体与集体', 'individual-collective', '个人与社会、家国情怀、共同体意识等'),
  ('理性与情感', 'reason-emotion', '思辨、批判性思维、人文关怀等'),
  ('历史与现实', 'history-present', '历史借鉴、时代变迁、传承与创新等'),
  ('诚信与规则', 'integrity-rules', '诚信、法治、规则意识、契约精神等')
on conflict (name) do nothing;

-- ============================================================
-- 4. 素材包表（用户个人素材整合）
-- ============================================================
create table if not exists public.collections (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid default auth.uid(),
  name text not null,
  description text,
  is_public boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists collections_user_idx on public.collections(user_id);

-- ============================================================
-- 5. 素材包-段落关联表
-- ============================================================
create table if not exists public.collection_paragraphs (
  collection_id uuid references public.collections(id) on delete cascade,
  paragraph_id uuid references public.article_paragraphs(id) on delete cascade,
  sort_order int default 0,
  note text,
  created_at timestamptz default now(),
  primary key (collection_id, paragraph_id)
);

-- ============================================================
-- 6. 用户收藏段落表
-- ============================================================
create table if not exists public.saved_paragraphs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid default auth.uid(),
  paragraph_id uuid references public.article_paragraphs(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, paragraph_id)
);

create index if not exists saved_paragraphs_user_idx on public.saved_paragraphs(user_id);

-- ============================================================
-- 7. 自动更新 updated_at 触发器
-- ============================================================
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists articles_updated_at on public.articles;
create trigger articles_updated_at before update on public.articles
  for each row execute function public.update_updated_at();

drop trigger if exists collections_updated_at on public.collections;
create trigger collections_updated_at before update on public.collections
  for each row execute function public.update_updated_at();

-- ============================================================
-- 8. RLS 行级安全策略
-- ============================================================
alter table public.articles enable row level security;
alter table public.article_paragraphs enable row level security;
alter table public.topics enable row level security;
alter table public.collections enable row level security;
alter table public.collection_paragraphs enable row level security;
alter table public.saved_paragraphs enable row level security;

-- 文章：公开可读，登录用户可插入（第一期简化，后续加审核）
create policy "articles are viewable by everyone" on public.articles
  for select using (is_public = true);

create policy "users can insert articles" on public.articles
  for insert with check (true);

-- 段落：公开可读
create policy "paragraphs are viewable by everyone" on public.article_paragraphs
  for select using (true);

create policy "users can insert paragraphs" on public.article_paragraphs
  for insert with check (true);

-- 话题：公开可读
create policy "topics are viewable by everyone" on public.topics
  for select using (true);

-- 素材包：用户只能看自己的或公开的
create policy "collections viewable by owner or public" on public.collections
  for select using (user_id = auth.uid() or is_public = true);

create policy "users can insert own collections" on public.collections
  for insert with check (user_id = auth.uid());

create policy "users can update own collections" on public.collections
  for update using (user_id = auth.uid());

create policy "users can delete own collections" on public.collections
  for delete using (user_id = auth.uid());

-- 素材包段落关联：用户只能操作自己的素材包
create policy "collection_paragraphs viewable by owner" on public.collection_paragraphs
  for select using (
    exists (select 1 from public.collections c where c.id = collection_id and (c.user_id = auth.uid() or c.is_public = true))
  );

create policy "users can manage own collection paragraphs" on public.collection_paragraphs
  for all using (
    exists (select 1 from public.collections c where c.id = collection_id and c.user_id = auth.uid())
  );

-- 收藏段落：用户只能看和管理自己的
create policy "saved_paragraphs viewable by owner" on public.saved_paragraphs
  for select using (user_id = auth.uid());

create policy "users can manage own saved paragraphs" on public.saved_paragraphs
  for all using (user_id = auth.uid());

-- ============================================================
-- 完成提示
-- ============================================================
-- 数据库初始化完成！
-- 接下来需要：
-- 1. 在 Supabase 控制台 → Settings → API 获取 SUPABASE_URL 和 SUPABASE_ANON_KEY
-- 2. 填入项目根目录的 .env 文件
-- 3. 在 Netlify → Site settings → Environment variables 中也配置这两个变量
