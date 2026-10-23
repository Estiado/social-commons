-- Public visitors may submit through one bounded function, never read the inbox.
-- The project owner manages beta_feedback through the authenticated dashboard.
begin;
create table if not exists public.beta_feedback (
  id uuid primary key,
  created_at timestamptz not null default now(),
  kind text not null check (kind in ('使用问题', '内容纠错', '功能建议')),
  page text not null default '' check (char_length(page) <= 500 and (page = '' or page ~ '^/[^?#]*$')),
  description text not null check (char_length(btrim(description)) between 5 and 5000),
  expected text not null default '' check (char_length(expected) <= 2000),
  status text not null default 'new' check (status in ('new', 'reviewing', 'resolved'))
);
create index if not exists beta_feedback_created_at on public.beta_feedback(created_at desc);
alter table public.beta_feedback enable row level security;
revoke all on public.beta_feedback from public, anon, authenticated;

create or replace function public.submit_beta_feedback(
  p_id uuid, p_kind text, p_page text, p_description text, p_expected text, p_website text default ''
) returns uuid
language plpgsql security definer set search_path = ''
as $$
declare existing public.beta_feedback%rowtype;
begin
  if p_id is null or p_kind is null or p_kind not in ('使用问题', '内容纠错', '功能建议')
    or p_description is null or char_length(btrim(p_description)) not between 5 and 5000
    or p_expected is null or char_length(p_expected) > 2000
    or p_page is null or char_length(p_page) > 500 or (p_page <> '' and p_page !~ '^/[^?#]*$')
    or p_website is null or p_website <> '' then
    raise sqlstate 'PT400' using message = 'invalid_feedback';
  end if;

  -- Serialize this small beta inbox's writes so concurrent requests cannot
  -- bypass the shared limits. Read-only dashboard queries are not blocked.
  lock table public.beta_feedback in share row exclusive mode;
  select * into existing from public.beta_feedback where id = p_id;
  if found then
    if (existing.kind, existing.page, existing.description, existing.expected)
      is distinct from (p_kind, p_page, btrim(p_description), btrim(p_expected)) then
      raise sqlstate 'PT409' using message = 'feedback_receipt_conflict';
    end if;
    return p_id;
  end if;
  -- Durable, shared limits remain effective even when the RPC is called directly.
  if (select count(*) from public.beta_feedback where created_at > now() - interval '1 minute') >= 20
    or (select count(*) from public.beta_feedback where created_at > now() - interval '24 hours') >= 200 then
    raise sqlstate 'PT429' using message = 'feedback_rate_limited';
  end if;
  insert into public.beta_feedback(id, kind, page, description, expected)
    values (p_id, p_kind, p_page, btrim(p_description), btrim(p_expected));
  return p_id;
end;
$$;
revoke all on function public.submit_beta_feedback(uuid,text,text,text,text,text) from public;
grant execute on function public.submit_beta_feedback(uuid,text,text,text,text,text) to anon, authenticated;
notify pgrst, 'reload schema';
commit;
