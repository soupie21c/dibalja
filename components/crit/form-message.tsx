import { cn } from "@/lib/utils";

/** 필드 오류 / 전체 메시지 표시용 작은 컴포넌트 */
export function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  if (!errors?.length) return null;
  return <p id={id} className="text-sm text-destructive">{errors[0]}</p>;
}

export function FormMessage({ ok, message }: { ok: boolean; message?: string }) {
  if (!message) return null;
  return (
    <p role={ok ? "status" : "alert"} className={cn("rounded-md px-3 py-2 text-sm", ok ? "bg-stage-final text-stage-final-foreground" : "bg-destructive/10 text-destructive")}>
      {message}
    </p>
  );
}
