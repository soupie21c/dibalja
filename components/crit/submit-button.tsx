"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * 폼 제출 버튼 — 전송 중이면 스피너 + 비활성화
 * useFormStatus 는 "자신을 감싼 <form>"의 상태를 읽으므로
 * 반드시 <form> 안쪽(자식)에서 렌더링해야 합니다.
 * Figma의 Button Variant "State = Loading" 에 해당합니다.
 */
export function SubmitButton({
  children,
  pendingText,
  ...props
}: React.ComponentProps<typeof Button> & { pendingText: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} aria-busy={pending} {...props}>
      {pending && <Loader2 className="animate-spin" aria-hidden />}
      {pending ? pendingText : children}
    </Button>
  );
}
