-- Keep the old catalogue readable, but only server-side maintenance may write it.
-- Private reading uses reading_documents; never restore anonymous article inserts.
begin;
alter table public.articles enable row level security;
alter table public.article_paragraphs enable row level security;

revoke all on public.articles, public.article_paragraphs from public;
revoke insert, update, delete, truncate, references, trigger
  on public.articles, public.article_paragraphs from anon, authenticated;
grant select on public.articles, public.article_paragraphs to anon, authenticated;

drop policy if exists "users can insert articles" on public.articles;
drop policy if exists "users can insert paragraphs" on public.article_paragraphs;
drop policy if exists "legacy_articles_public_scope" on public.articles;
create policy "legacy_articles_public_scope" on public.articles as restrictive
  for select to anon, authenticated using (is_public = true);

-- Restrictive policies also constrain any older permissive SELECT policy left
-- by a previous deployment. Existing personal saved/collection references remain readable.
drop policy if exists "legacy_paragraph_scope" on public.article_paragraphs;
create policy "legacy_paragraph_scope" on public.article_paragraphs as restrictive
  for select to anon, authenticated using (
    exists (select 1 from public.articles a where a.id = article_id and a.is_public = true)
    or exists (select 1 from public.saved_paragraphs s where s.paragraph_id = article_paragraphs.id and s.user_id = auth.uid())
    or exists (
      select 1 from public.collection_paragraphs cp
      join public.collections c on c.id = cp.collection_id
      where cp.paragraph_id = article_paragraphs.id and c.user_id = auth.uid()
    )
  );
commit;
