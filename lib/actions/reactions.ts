"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

/**
 * [과제 2] 좋아요 켜기/끄기
 * like=true 면 (작업, 나) 행을 넣고, false 면 지웁니다. RLS 가 "내 이름으로만" 쓰고 지우게 막습니다.
 * 실패해도 화면은 useOptimistic 이 원래 값으로 되돌리므로 예외 대신 ok 를 돌려줍니다.
 */
export async function toggleLike(projectId: string, like: boolean): Promise<{ ok: boolean }> {
  if (!z.uuid().safeParse(projectId).success) return { ok: false };

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const userId = auth?.claims?.sub;
  if (!userId) return { ok: false };

  const { error } = like
    ? await supabase.from("reactions").insert({ project_id: projectId, user_id: userId })
    : await supabase.from("reactions").delete().eq("project_id", projectId).eq("user_id", userId);

  // 23505 = 이미 누른 상태(기본키 중복) — 결과적으로 "좋아요" 상태이므로 성공으로 봅니다.
  const ok = !error || error.code === "23505";
  revalidatePath(`/projects/${projectId}`);
  return { ok };
}
