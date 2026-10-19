"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError, FormMessage } from "./form-message";
import { SubmitButton } from "./submit-button";
import { UserAvatar } from "./user-avatar";
import { updateProfile } from "@/lib/actions/profile";
import { initialState } from "@/lib/actions/state";
import type { Profile } from "@/lib/types";

/** [과제 1] 프로필 편집 폼 — 저장 후 서버가 revalidatePath 하면 헤더 이름도 바로 바뀝니다. */
export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction] = useActionState(updateProfile, initialState);
  const err = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="grid max-w-md gap-6">
      <div className="flex items-center gap-3">
        <UserAvatar user={profile} size="lg" />
        <p className="text-sm text-muted-foreground">프로필 사진이 없으면 이름 첫 글자가 표시됩니다.</p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="display_name">이름</Label>
        <Input id="display_name" name="display_name" required maxLength={30} defaultValue={profile.display_name} aria-invalid={!!err.display_name} aria-describedby="display_name-error" />
        <FieldError id="display_name-error" errors={err.display_name} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="role_title">직함 (선택)</Label>
        <Input id="role_title" name="role_title" maxLength={40} defaultValue={profile.role_title ?? ""} placeholder="예: 프로덕트 디자이너" aria-invalid={!!err.role_title} aria-describedby="role_title-error" />
        <FieldError id="role_title-error" errors={err.role_title} />
      </div>
      <FormMessage ok={state.ok} message={state.message} />
      <SubmitButton pendingText="저장하는 중…" className="w-fit">프로필 저장</SubmitButton>
    </form>
  );
}
