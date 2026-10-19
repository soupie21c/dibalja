"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "./state";

const MAX_IMAGE = 5 * 1024 * 1024; // 5MB

const projectSchema = z.object({
  title: z.string().trim().min(2, "제목은 2자 이상").max(60),
  summary: z.string().trim().min(5, "5자 이상 적어주세요").max(300),
  figma_url: z.union([z.literal(""), z.url("올바른 URL이 아닙니다")]),
  tags: z
    .string()
    .transform((s) => [...new Set(s.split(",").map((t) => t.trim()).filter(Boolean))].slice(0, 5)),
  stage: z.enum(["wip", "review", "final"]),
});

export async function createProject(_: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();

  // 1) 인증 확인 — 서버에서 "다시" 검사 (화면에서 버튼을 숨기는 건 보안이 아님)
  const { data: auth } = await supabase.auth.getClaims();
  const userId = auth?.claims?.sub;
  if (!userId) return { ok: false, message: "로그인이 필요합니다." };

  // 2) 입력 검증
  const parsed = projectSchema.safeParse({
    title: formData.get("title"),
    summary: formData.get("summary"),
    figma_url: formData.get("figma_url") ?? "",
    tags: formData.get("tags") ?? "",
    stage: formData.get("stage"),
  });
  if (!parsed.success) return { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors };

  // 3) 이미지 업로드 (선택) → Storage: project-images/{userId}/{uuid}.{ext}
  let image_url: string | null = null;
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    if (!file.type.startsWith("image/")) return { ok: false, fieldErrors: { image: ["이미지 파일만 올릴 수 있습니다."] } };
    if (file.size > MAX_IMAGE) return { ok: false, fieldErrors: { image: ["5MB 이하로 올려주세요."] } };

    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const path = `${userId}/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("project-images")
      .upload(path, file, { contentType: file.type, upsert: false });
    if (upErr) return { ok: false, message: `이미지 업로드 실패: ${upErr.message}` };

    image_url = supabase.storage.from("project-images").getPublicUrl(path).data.publicUrl;
  }

  // 4) DB 저장 — RLS가 author_id = auth.uid() 인지 한 번 더 검사합니다.
  const { figma_url, ...rest } = parsed.data;
  const { data, error } = await supabase
    .from("projects")
    .insert({ ...rest, figma_url: figma_url || null, image_url, author_id: userId })
    .select("id")
    .single();
  if (error) return { ok: false, message: error.message };

  // 5) 캐시 무효화 후 상세 페이지로 이동
  revalidatePath("/");
  redirect(`/projects/${data.id}`);
}

export async function deleteProject(projectId: string) {
  const supabase = await createClient();
  // RLS 덕분에 남의 프로젝트는 지워지지 않습니다(0행 삭제).
  const { error } = await supabase.from("projects").delete().eq("id", projectId);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  redirect("/");
}
