"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "./state";

const feedbackSchema = z.object({
  project_id: z.uuid(),
  body: z.string().trim().min(5, "5자 이상 입력하세요.").max(1000),
  kind: z.enum(["praise", "suggestion", "question"]),
});

export async function addFeedback(_: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const userId = auth?.claims?.sub;
  if (!userId) return { ok: false, message: "로그인 후 피드백을 남길 수 있습니다." };

  const parsed = feedbackSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors };

  const { error } = await supabase.from("feedback").insert({ ...parsed.data, author_id: userId });
  if (error) return { ok: false, message: error.message };

  revalidatePath(`/projects/${parsed.data.project_id}`);
  revalidatePath("/"); // 카드의 피드백 수
  return { ok: true, message: "피드백을 남겼습니다." };
}

export async function deleteFeedback(feedbackId: string, projectId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("feedback").delete().eq("id", feedbackId);
  if (error) throw new Error(error.message);
  revalidatePath(`/projects/${projectId}`);
}
