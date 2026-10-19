"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * 폼 제출 버튼 — 전송 중이면 스피너 + 비활성화
 * useFormStatus 는 "자신을 감싼 <form>"의 상태를 읽으므로
 * 반드시 <form> 안쪽(자식)에서 렌더링해야 합니다.
 * Figma의 Button Variant "State = Loading" 에 해당합니다.
 * pending 을 직접 넘기면 그 값을 씁니다 — 폼을 startTransition 으로 직접 제출하는 경우
 * (예: react-hook-form 검증 후 제출) useFormStatus 가 전송 상태를 알 수 없기 때문입니다.
 */
export function SubmitButton({
  children,
  pendingText,
  pending: pendingProp,
  ...props
}: React.ComponentProps<typeof Button> & { pendingText: string; pending?: boolean }) {
  const status = useFormStatus();
  const pending = pendingProp ?? status.pending;
  return (
    <Button type="submit" disabled={pending} aria-busy={pending} {...props}>
      {pending && <Loader2 className="animate-spin" aria-hidden />}
      {pending ? pendingText : children}
    </Button>
  );
}
