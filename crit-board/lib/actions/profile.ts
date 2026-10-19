"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { profileSchema } from "@/lib/schemas";
import type { ActionState } from "./state";

/** [과제 1] 내 프로필(이름·직함) 수정 — RLS "update own profile" 이 본인 행만 허용합니다. */
export async function updateProfile(_: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const userId = auth?.claims?.sub;
  if (!userId) return { ok: false, message: "로그인이 필요합니다." };

  const parsed = profileSchema.safeParse({
    display_name: formData.get("display_name") ?? "",
    role_title: formData.get("role_title") ?? "",
  });
  if (!parsed.success) return { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors };

  const { display_name, role_title } = parsed.data;
  // .select() 로 실제로 바뀐 행을 받아, RLS 에 막혀 0행이 된 경우도 실패로 알립니다.
  const { data, error } = await supabase
    .from("profiles")
    .update({ display_name, role_title: role_title || null })
    .eq("id", userId)
    .select("id");
  if (error) return { ok: false, message: error.message };
  if (!data?.length) return { ok: false, message: "프로필을 저장하지 못했습니다." };

  revalidatePath("/", "layout"); // 헤더·피드 카드·피드백의 이름까지 갱신
  return { ok: true, message: "프로필을 저장했습니다." };
}
