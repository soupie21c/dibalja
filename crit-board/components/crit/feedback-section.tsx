"use client";

/**
 * [2부 버전] 피드백 섹션 — Server Action + useActionState
 *  - action={formAction}: 제출하면 서버의 addFeedback 실행
 *  - SubmitButton(useFormStatus): 전송 중 스피너 + 비활성화
 *  - 성공 후 서버가 revalidatePath → 새 목록이 props(items)로 다시 내려옵니다.
 */
import { useActionState, useState } from "react";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { FeedbackList } from "./feedback-list";
import { KindPicker } from "./kind-picker";
import { FieldError, FormMessage } from "./form-message";
import { SubmitButton } from "./submit-button";
import { addFeedback } from "@/lib/actions/feedback";
import { initialState } from "@/lib/actions/state";
import type { FeedbackKind, FeedbackWithAuthor, Profile } from "@/lib/types";

export function FeedbackSection({
  projectId,
  items,
  currentUser,
}: {
  projectId: string;
  items: FeedbackWithAuthor[];
  currentUser: Profile | null;
}) {
  const [state, formAction] = useActionState(addFeedback, initialState);
  const [kind, setKind] = useState<FeedbackKind>("suggestion");

  return (
    <section aria-labelledby="feedback-heading" className="grid gap-6">
      <h2 id="feedback-heading" className="text-lg font-bold">피드백 {items.length}</h2>
      <FeedbackList items={items} currentUserId={currentUser?.id} />

      {currentUser ? (
        <form action={formAction} className="grid gap-3 rounded-xl border bg-card p-4">
          <input type="hidden" name="project_id" value={projectId} />
          <KindPicker value={kind} onChange={setKind} />
          <Textarea
            name="body"
            required
            minLength={5}
            placeholder="무엇이 좋은지, 무엇을 바꾸면 좋을지 구체적으로 적어주세요."
            aria-invalid={!!state.fieldErrors?.body}
            aria-describedby="body-error"
          />
          <FieldError id="body-error" errors={state.fieldErrors?.body} />
          <FormMessage ok={state.ok} message={state.message} />
          <SubmitButton pendingText="남기는 중…" className="justify-self-end">
            피드백 남기기
          </SubmitButton>
        </form>
      ) : (
        <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
          피드백을 남기려면{" "}
          <Link href={`/login?next=/projects/${projectId}`} className="font-medium text-primary underline-offset-4 hover:underline">
            로그인
          </Link>
          하세요.
        </p>
      )}
    </section>
  );
}
