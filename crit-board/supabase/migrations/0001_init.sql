-- =============================================================
-- Crit Board 초기 스키마
-- Supabase 대시보드 > SQL Editor 에 통째로 붙여넣고 Run 하세요.
-- (Supabase CLI 사용 시: supabase db push)
-- =============================================================

-- 1) 프로필: auth.users(인증)와 1:1, 화면에 보이는 공개 정보
create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 30),
  role_title   text,
  avatar_url   text,
  created_at   timestamptz not null default now()
);

-- 2) 프로젝트(작업물)
create table public.projects (
  id         uuid primary key default gen_random_uuid(),
  author_id  uuid not null references public.profiles (id) on delete cascade,
  title      text not null check (char_length(title) between 2 and 60),
  summary    text not null check (char_length(summary) between 5 and 300),
  image_url  text,
  figma_url  text,
  tags       text[] not null default '{}',
  stage      text not null default 'wip' check (stage in ('wip', 'review', 'final')),
  created_at timestamptz not null default now()
);
create index projects_created_at_idx on public.projects (created_at desc);
create index projects_tags_idx on public.projects using gin (tags);   -- 태그 필터(@>) 가속

-- 3) 피드백
create table public.feedback (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  author_id  uuid not null references public.profiles (id) on delete cascade,
  body       text not null check (char_length(body) between 5 and 1000),
  kind       text not null default 'suggestion' check (kind in ('praise', 'suggestion', 'question')),
  created_at timestamptz not null default now()
);
create index feedback_project_idx on public.feedback (project_id, created_at);

-- =============================================================
-- 회원가입 시 profiles 행 자동 생성 (트리거)
-- signUp({ options: { data: { display_name } } }) 의 메타데이터를 읽습니다.
-- =============================================================
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================
-- RLS(Row Level Security): "누가 어떤 행을 읽고 쓸 수 있나"를 DB가 직접 검사
-- publishable 키는 브라우저에 노출되므로, 보안은 전적으로 이 정책에 달려 있습니다.
-- =============================================================
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.feedback enable row level security;

-- 읽기: 누구나
create policy "profiles are public"  on public.profiles for select using (true);
create policy "projects are public"  on public.projects for select using (true);
create policy "feedback is public"   on public.feedback for select using (true);

-- 프로필: 본인만 수정
create policy "update own profile" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- 프로젝트: 로그인 사용자가 "자기 이름으로만" 생성, 본인 것만 수정/삭제
create policy "insert own project" on public.projects
  for insert to authenticated with check ((select auth.uid()) = author_id);
create policy "update own project" on public.projects
  for update to authenticated
  using ((select auth.uid()) = author_id) with check ((select auth.uid()) = author_id);
create policy "delete own project" on public.projects
  for delete to authenticated using ((select auth.uid()) = author_id);

-- 피드백: 로그인 사용자가 자기 이름으로 작성, 본인 것만 삭제
create policy "insert own feedback" on public.feedback
  for insert to authenticated with check ((select auth.uid()) = author_id);
create policy "delete own feedback" on public.feedback
  for delete to authenticated using ((select auth.uid()) = author_id);

-- =============================================================
-- Storage: 썸네일 버킷 (공개 읽기, 본인 폴더에만 업로드)
-- 경로 규칙: project-images/{user_id}/{파일명}
-- =============================================================
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

create policy "upload to own folder" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'project-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "delete own images" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'project-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
