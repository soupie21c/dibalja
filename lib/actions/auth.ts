"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "./state";

const credentials = z.object({
  email: z.email("이메일 형식이 아닙니다."),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
});

/** 안전한 내부 경로만 허용 (오픈 리다이렉트 방지) */
function safeNext(v: FormDataEntryValue | null) {
  const s = typeof v === "string" ? v : "/";
  return s.startsWith("/") && !s.startsWith("//") ? s : "/";
}

export async function signIn(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = credentials.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { ok: false, message: "이메일 또는 비밀번호가 맞지 않습니다." };

  revalidatePath("/", "layout"); // 헤더의 로그인 상태 갱신
  redirect(safeNext(formData.get("next")));
}

export async function signUp(_: ActionState, formData: FormData): Promise<ActionState> {
  const schema = credentials.extend({
    display_name: z.string().trim().min(1, "이름을 입력하세요.").max(30),
  });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors };

  const { email, password, display_name } = parsed.data;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name }, // → DB 트리거가 profiles.display_name 으로 복사
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    },
  });
  if (error) return { ok: false, message: error.message };

  // 이메일 인증을 끈 프로젝트라면 바로 세션이 생깁니다.
  if (data.session) {
    revalidatePath("/", "layout");
    redirect(safeNext(formData.get("next")));
  }
  return { ok: true, message: "인증 메일을 보냈습니다. 메일의 링크를 누르면 가입이 완료됩니다." };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
