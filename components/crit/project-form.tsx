"use client";

/**
 * [2부 버전] 작업 올리기 폼
 *  - 미리보기를 위해 입력값은 계속 state로 관리(1부와 동일)
 *  - 제출은 action={formAction} → 서버의 createProject 가 FormData 를 받음
 *  - 썸네일은 <input type="file">, 미리보기는 URL.createObjectURL
 */
import { useActionState, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProjectCard } from "./project-card";
import { FieldError, FormMessage } from "./form-message";
import { SubmitButton } from "./submit-button";
import { createProject } from "@/lib/actions/projects";
import { initialState } from "@/lib/actions/state";
import { cn } from "@/lib/utils";
import { STAGE_LABEL, type Profile, type Stage } from "@/lib/types";

export function ProjectForm({ author }: { author: Profile }) {
  const [state, formAction] = useActionState(createProject, initialState);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [stage, setStage] = useState<Stage>("wip");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 미리보기 URL은 메모리를 잡아먹으므로 바뀌거나 사라질 때 해제
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const tags = tagsText.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 5);
  const err = state.fieldErrors ?? {};

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[1fr_22rem]">
      <form action={formAction} className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="title">제목</Label>
          <Input id="title" name="title" required maxLength={60} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 동네 서점 예약 앱 — 홈 화면" aria-invalid={!!err.title} aria-describedby="title-error" />
          <FieldError id="title-error" errors={err.title} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="summary">받고 싶은 피드백</Label>
          <Textarea id="summary" name="summary" required maxLength={300} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="어떤 부분을 봐주면 좋을지 적어주세요." aria-invalid={!!err.summary} aria-describedby="summary-error" />
          <div className="flex justify-between">
            <FieldError id="summary-error" errors={err.summary} />
            <p className="ml-auto text-xs text-muted-foreground">{summary.length}/300</p>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="image">썸네일 이미지</Label>
          <Input
            id="image"
            name="image"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="file:mr-3 file:rounded-sm file:border-0 file:bg-secondary file:px-2 file:text-secondary-foreground"
            onChange={(e) => {
              const f = e.target.files?.[0];
              setPreviewUrl(f ? URL.createObjectURL(f) : null);
            }}
            aria-describedby="image-error"
          />
          <FieldError id="image-error" errors={err.image} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="figma_url">Figma 링크 (선택)</Label>
          <Input id="figma_url" name="figma_url" type="url" placeholder="https://www.figma.com/design/…" aria-describedby="figma-error" />
          <FieldError id="figma-error" errors={err.figma_url} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="tags">태그</Label>
          <Input id="tags" name="tags" value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="웹, 랜딩 (쉼표로 구분, 최대 5개)" />
        </div>
        <fieldset className="grid gap-2">
          <legend className="mb-2 text-sm font-medium">작업 단계</legend>
          <div className="flex gap-2">
            {(Object.keys(STAGE_LABEL) as Stage[]).map((s) => (
              <label key={s} className={cn("cursor-pointer rounded-md border px-3 py-1.5 text-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/50", stage === s ? "border-primary bg-secondary text-secondary-foreground" : "bg-card")}>
                <input type="radio" name="stage" value={s} checked={stage === s} onChange={() => setStage(s)} className="sr-only" />
                {STAGE_LABEL[s]}
              </label>
            ))}
          </div>
        </fieldset>
        <FormMessage ok={state.ok} message={state.message} />
        <SubmitButton size="lg" pendingText="올리는 중…" className="w-fit">
          작업 올리기
        </SubmitButton>
      </form>

      <aside className="grid gap-3 lg:sticky lg:top-24">
        <p className="text-sm font-medium text-muted-foreground">피드에 이렇게 보입니다</p>
        <ProjectCard
          preview
          project={{
            title, summary, tags, stage,
            image_url: previewUrl,
            created_at: new Date().toISOString(),
            author,
            feedback_count: 0,
          }}
        />
      </aside>
    </div>
  );
}
