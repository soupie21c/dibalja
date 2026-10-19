"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getFigmaThumbnailUrl } from "@/lib/figma";
import { MAX_IMAGE_BYTES, parseTags, projectSchema } from "@/lib/schemas";
import type { ActionState } from "./state";

type Supabase = Awaited<ReturnType<typeof createClient>>;

/** 공개 버킷에 저장해도 되는 이미지 형식 → 확장자 */
const RASTER_EXT: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/gif": "gif" };

/** Storage: project-images/{userId}/{uuid}.{ext} 에 올리고 공개 URL 을 돌려줍니다. */
async function uploadImage(supabase: Supabase, userId: string, body: Blob, contentType: string, ext: string) {
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("project-images").upload(path, body, { contentType, upsert: false });
  if (error) return { error: error.message };
  return { url: supabase.storage.from("project-images").getPublicUrl(path).data.publicUrl };
}

/**
 * [과제 5] 이미지를 올리지 않았고 Figma 링크가 있으면, Figma 썸네일을 받아 우리 Storage 로 복사합니다.
 * (Figma 이미지 주소는 만료되므로 그대로 저장하지 않습니다.) 실패하면 썸네일 없이 진행합니다.
 */
async function copyFigmaThumbnail(supabase: Supabase, userId: string, figmaUrl: string): Promise<string | null> {
  const src = await getFigmaThumbnailUrl(figmaUrl);
  if (!src) return null;
  try {
    const res = await fetch(src, { cache: "no-store", signal: AbortSignal.timeout(15_000) });
    const type = (res.headers.get("content-type") ?? "").split(";")[0].trim();
    const ext = RASTER_EXT[type]; // SVG 등은 공개 버킷에 올리지 않음(스크립트를 품을 수 있음)
    if (!res.ok || !ext) return null;
    const blob = await res.blob();
    if (blob.size > MAX_IMAGE_BYTES) return null;
    const { url } = await uploadImage(supabase, userId, blob, type, ext);
    return url ?? null;
  } catch {
    return null;
  }
}

export async function createProject(_: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();

  // 1) 인증 확인 — 서버에서 "다시" 검사 (화면에서 버튼을 숨기는 건 보안이 아님)
  const { data: auth } = await supabase.auth.getClaims();
  const userId = auth?.claims?.sub;
  if (!userId) return { ok: false, message: "로그인이 필요합니다." };

  // 2) 입력 검증 — 브라우저(react-hook-form)와 같은 lib/schemas.ts 규칙을 서버에서 다시 실행
  const parsed = projectSchema.safeParse({
    title: formData.get("title") ?? "",
    summary: formData.get("summary") ?? "",
    figma_url: formData.get("figma_url") ?? "",
    tags: formData.get("tags") ?? "",
    stage: formData.get("stage"),
  });
  if (!parsed.success) return { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors };

  // 3) 이미지: 직접 올린 파일 → 없으면 Figma 썸네일 → 그것도 없으면 썸네일 없음
  let image_url: string | null = null;
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    if (!file.type.startsWith("image/")) return { ok: false, fieldErrors: { image: ["이미지 파일만 올릴 수 있습니다."] } };
    if (file.size > MAX_IMAGE_BYTES) return { ok: false, fieldErrors: { image: ["5MB 이하로 올려주세요."] } };

    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const up = await uploadImage(supabase, userId, file, file.type, ext);
    if (up.error) return { ok: false, message: `이미지 업로드 실패: ${up.error}` };
    image_url = up.url ?? null;
  } else if (parsed.data.figma_url) {
    image_url = await copyFigmaThumbnail(supabase, userId, parsed.data.figma_url);
  }

  // 4) DB 저장 — RLS가 author_id = auth.uid() 인지 한 번 더 검사합니다.
  const { figma_url, tags, ...rest } = parsed.data;
  const { data, error } = await supabase
    .from("projects")
    .insert({ ...rest, tags: parseTags(tags), figma_url: figma_url || null, image_url, author_id: userId })
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
