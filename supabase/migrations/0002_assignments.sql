-- =============================================================
-- 2부 과제용 마이그레이션 (0001_init.sql 다음에 실행)
--   과제 2: 좋아요(reactions) 테이블 + RLS
--   과제 3: feedback 테이블을 Realtime 으로 방송
-- 과제 1(프로필 편집)은 0001의 "update own profile" 정책을 그대로 씁니다.
-- =============================================================

-- 과제 2) 좋아요 — (작업, 사용자) 쌍이 기본키라서 한 사람이 같은 작업에 두 번 누를 수 없습니다.
create table public.reactions (
  project_id uuid not null references public.projects (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

alter table public.reactions enable row level security;

create policy "reactions are public" on public.reactions for select using (true);
create policy "insert own reaction" on public.reactions
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "delete own reaction" on public.reactions
  for delete to authenticated using ((select auth.uid()) = user_id);

-- 과제 3) Realtime — feedback 의 insert/delete 를 구독자에게 방송합니다.
-- 방송도 RLS 를 따르므로 "feedback is public" 정책 덕분에 누구나 받을 수 있습니다.
-- (delete 이벤트에는 기본키 id 만 담기므로, 화면 쪽에서 id 로 내 목록에 있던 글인지 확인합니다.)
alter publication supabase_realtime add table public.feedback;
