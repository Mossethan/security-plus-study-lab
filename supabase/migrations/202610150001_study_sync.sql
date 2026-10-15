-- Private per-user snapshots with optimistic concurrency. No service-role key is used in the browser.
create table if not exists public.study_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  revision bigint not null default 1,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint progress_object check (jsonb_typeof(data) = 'object'),
  constraint progress_size check (octet_length(data::text) <= 2000000)
);
alter table public.study_progress enable row level security;
revoke all on public.study_progress from anon, authenticated;
grant select on public.study_progress to authenticated;
create policy "Read own study progress" on public.study_progress for select to authenticated using ((select auth.uid()) = user_id);

create or replace function public.save_study_progress(expected_revision bigint, progress jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare saved public.study_progress; caller uuid := auth.uid();
begin
  if caller is null then raise exception 'Authentication required' using errcode = '42501'; end if;
  if jsonb_typeof(progress) is distinct from 'object' or octet_length(progress::text) > 2000000 then
    raise exception 'Invalid progress';
  end if;
  if expected_revision = 0 then
    insert into public.study_progress(user_id, data) values(caller, progress)
    on conflict (user_id) do nothing returning * into saved;
  else
    update public.study_progress set data = progress, revision = revision + 1, updated_at = now()
    where user_id = caller and revision = expected_revision returning * into saved;
  end if;
  if saved.user_id is null then return jsonb_build_object('conflict', true); end if;
  return jsonb_build_object('revision', saved.revision, 'updated_at', saved.updated_at);
end;
$$;
revoke all on function public.save_study_progress(bigint, jsonb) from public, anon;
grant execute on function public.save_study_progress(bigint, jsonb) to authenticated;
