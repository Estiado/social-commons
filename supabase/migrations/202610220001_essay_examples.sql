-- Public examples and a separate, database-controlled editor allowlist.
-- Only a trusted Supabase administrator can grant editor membership.
begin;
create table public.site_editors (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.site_editors enable row level security;
revoke all on public.site_editors from anon, authenticated;
grant select on public.site_editors to authenticated;
create policy "editor reads own membership" on public.site_editors for select to authenticated
  using (user_id = (select auth.uid()));

create table public.essay_examples (
  id text primary key,
  concept_id text not null check (char_length(concept_id) between 1 and 100),
  title text not null check (char_length(title) between 1 and 200),
  content text not null check (char_length(content) between 1 and 30000),
  source text not null check (char_length(source) between 1 and 500),
  source_url text not null default '' check (source_url = '' or source_url ~ '^https?://'),
  usage_hint text not null default '' check (char_length(usage_hint) <= 2000),
  created_at timestamptz not null default now()
);
create index essay_examples_concept_idx on public.essay_examples(concept_id, created_at);
alter table public.essay_examples enable row level security;
revoke all on public.essay_examples from anon, authenticated;
grant select on public.essay_examples to anon, authenticated;
grant insert, update, delete on public.essay_examples to authenticated;
create policy "everyone reads site examples" on public.essay_examples for select to anon, authenticated using (true);
create policy "only site editors publish examples" on public.essay_examples for all to authenticated
  using (exists (select 1 from public.site_editors where user_id = (select auth.uid()))
    and not coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false))
  with check (exists (select 1 from public.site_editors where user_id = (select auth.uid()))
    and not coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false));
commit;
