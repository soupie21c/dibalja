/**
 * 데이터 접근 레이어 (2부: Supabase 구현)
 * ------------------------------------------------------------
 * 1부의 Mock 버전과 "함수 이름·반환 타입이 완전히 같습니다".
 * 그래서 page.tsx 등 화면 코드는 한 줄도 바꾸지 않아도 됩니다.
 */
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { ProjectDetail, ProjectWithMeta } from "./types";

// 관계 조회: author 는 profiles 테이블, feedback(count) 는 집계
const PROJECT_SELECT = "*, author:profiles!projects_author_id_fkey(*), feedback(count)" as const;

type Row = {
  feedback: { count: number }[];
} & Omit<ProjectWithMeta, "feedback_count">;

function toMeta(row: Row): ProjectWithMeta {
  const { feedback, ...rest } = row;
  return { ...rest, feedback_count: feedback[0]?.count ?? 0 };
}

export async function listProjects(opts: { tag?: string; q?: string } = {}): Promise<ProjectWithMeta[]> {
  const supabase = await createClient();
  let query = supabase.from("projects").select(PROJECT_SELECT).order("created_at", { ascending: false }).limit(60);

  if (opts.tag) query = query.contains("tags", [opts.tag]); // tags @> '{tag}'
  if (opts.q) {
    const safe = opts.q.replace(/[,()%]/g, " ").trim(); // PostgREST 필터 문법 문자 제거
    if (safe) query = query.or(`title.ilike.%${safe}%,summary.ilike.%${safe}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message); // → error.tsx 가 받아서 표시
  return (data as unknown as Row[]).map(toMeta);
}

export async function getProject(id: string): Promise<ProjectDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(`${PROJECT_SELECT}, items:feedback(*, author:profiles!feedback_author_id_fkey(*))`)
    .eq("id", id)
    .order("created_at", { referencedTable: "items", ascending: true })
    .maybeSingle();

  if (error) {
    if (error.code === "22P02") return null; // uuid 형식이 아닌 id → 404
    throw new Error(error.message);
  }
  if (!data) return null;

  const { items, ...row } = data as unknown as Row & { items: ProjectDetail["feedback"] };
  return { ...toMeta(row as Row), feedback: items };
}

/**
 * [과제 2] 좋아요 수와 "내가 눌렀는지"
 * 로그인 사용자 id 는 쿠키의 토큰(getClaims)에서 바로 읽으므로, 페이지가 getProject·getCurrentUser 와
 * 동시에 부를 수 있습니다(순차 대기 없음). 개수와 내 좋아요도 동시에 조회합니다.
 */
export async function getLikes(projectId: string): Promise<{ count: number; liked: boolean }> {
  // uuid 가 아닌 id 는 조회하지 않음 → 페이지가 getProject 결과로 404 처리
  // (개수만 받는 head 요청은 오류 본문이 없어 오류 코드로 구분할 수 없습니다)
  if (!z.uuid().safeParse(projectId).success) return { count: 0, liked: false };
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const userId = auth?.claims?.sub;

  const [total, mine] = await Promise.all([
    supabase.from("reactions").select("*", { count: "exact", head: true }).eq("project_id", projectId),
    userId
      ? supabase.from("reactions").select("user_id").eq("project_id", projectId).eq("user_id", userId).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);
  if (total.error) throw new Error(total.error.message || "좋아요 수를 불러오지 못했습니다.");
  return { count: total.count ?? 0, liked: !!mine.data };
}

export async function listTags(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("tags");
  return [...new Set((data ?? []).flatMap((r) => r.tags))].sort();
}
