-- Additive migration: old public articles and anonymous collections are retained.
-- Run once in Supabase SQL Editor. Ordinary requests never use a service key.
begin;
create table public.reading_documents (
  id uuid primary key,
  owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  document jsonb not null,
  annotations jsonb not null default '[]'::jsonb,
  revision integer not null default 1 check (revision > 0),
  title text generated always as (document ->> 'title') stored,
  source text generated always as (document ->> 'source') stored,
  url text generated always as (nullif(document ->> 'url', '')) stored,
  imported_at text generated always as (document ->> 'importedAt') stored,
  annotation_count integer generated always as (jsonb_array_length(annotations)) stored,
  updated_at timestamptz not null default now(),
  constraint reading_document_shape check (
    jsonb_typeof(document) = 'object'
    and document ?& array['schemaVersion','id','contentVersion','title','source','url','importedAt','blocks']
    and document ->> 'schemaVersion' = '1'
    and document ->> 'id' = id::text
    and jsonb_typeof(document -> 'blocks') = 'array'
    and jsonb_array_length(document -> 'blocks') between 1 and 2000
    and octet_length(document::text) <= 1048576
    and jsonb_typeof(annotations) = 'array' and jsonb_array_length(annotations) <= 1000
    and octet_length(annotations::text) <= 1048576
  ),
  unique (owner_id, url)
);
create index reading_documents_owner_updated_idx on public.reading_documents(owner_id, updated_at desc);
alter table public.reading_documents enable row level security;
revoke all on public.reading_documents from anon, authenticated;
grant select, insert, update, delete on public.reading_documents to authenticated;
create policy "account owns reading document" on public.reading_documents
  for all to authenticated
  using (owner_id = (select auth.uid()) and not coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false))
  with check (owner_id = (select auth.uid()) and not coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false));

create function public.touch_reading_document() returns trigger language plpgsql
  set search_path = '' as $$ begin new.updated_at = now(); return new; end; $$;
create trigger reading_document_updated before update on public.reading_documents
  for each row execute function public.touch_reading_document();

-- Submission contains metadata only. Private document and annotation IDs are
-- deliberately absent, so review/publishing cannot reveal a user's full text.
create table public.reading_submissions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 500),
  url text not null check (url ~ '^https?://'),
  source text not null default '',
  recommendation text not null default '' check (char_length(recommendation) <= 2000),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(), unique(owner_id, url)
);
alter table public.reading_submissions enable row level security;
revoke all on public.reading_submissions from anon, authenticated;
grant select, insert on public.reading_submissions to authenticated;
create policy "owner reads suggestion" on public.reading_submissions for select to authenticated
  using (owner_id = (select auth.uid()));
create policy "account suggests metadata" on public.reading_submissions for insert to authenticated
  with check (owner_id = (select auth.uid()) and status = 'pending'
    and not coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false));

create table public.reading_catalogue (
  id text primary key,
  title text not null check (char_length(title) between 1 and 500),
  url text not null unique check (url ~ '^https?://'),
  source text not null, author text not null default '',
  published_at date not null, checked_at date not null,
  recommendation text not null,
  verification_url text not null default '',
  writing_tags text[] not null default '{}', general_tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived'))
);
alter table public.reading_catalogue enable row level security;
revoke all on public.reading_catalogue from anon, authenticated;
grant select on public.reading_catalogue to anon, authenticated;
create policy "published editorial metadata" on public.reading_catalogue for select to anon, authenticated
  using (status = 'published');
create index reading_catalogue_publication_idx on public.reading_catalogue(published_at desc) where status = 'published';
commit;
