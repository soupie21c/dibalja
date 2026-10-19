"use client";
import { cn } from "@/lib/utils";
import { KIND_LABEL, type FeedbackKind } from "@/lib/types";

/** 라디오 버튼을 세그먼트 컨트롤 모양으로 — name 속성 덕분에 <form>에 그대로 실립니다. */
export function KindPicker({ value, onChange }: { value: FeedbackKind; onChange: (k: FeedbackKind) => void }) {
  return (
    <fieldset className="inline-flex rounded-md border bg-muted p-0.5">
      <legend className="sr-only">피드백 종류</legend>
      {(Object.keys(KIND_LABEL) as FeedbackKind[]).map((k) => (
        <label
          key={k}
          className={cn(
            "cursor-pointer rounded-[5px] px-3 py-1 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/50",
            value === k ? "bg-card font-medium shadow-xs" : "text-muted-foreground"
          )}
        >
          <input
            type="radio"
            name="kind"
            value={k}
            checked={value === k}
            onChange={() => onChange(k)}
            className="sr-only"
          />
          {KIND_LABEL[k]}
        </label>
      ))}
    </fieldset>
  );
}
