"use client";

/**
 * [2부 + 과제 4·5] 작업 올리기 폼
 *  - react-hook-form + zodResolver: lib/schemas.ts 규칙으로 입력하는 동안 바로 오류를 보여줌
 *  - 통과하면 FormData(파일 포함)를 Server Action(createProject)에 넘김 → 서버가 같은 규칙으로 다시 검증
 *  - 미리보기: 올린 파일 → 없으면 Figma 링크의 썸네일(/api/figma-thumbnail)
 */
import { useActionState, useEffect, useState, useTransition, type BaseSyntheticEvent } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProjectCard } from "./project-card";
import { FieldError, FormMessage } from "./form-message";
import { SubmitButton } from "./submit-button";
import { createProject } from "@/lib/actions/projects";
import { initialState, type ActionState } from "@/lib/actions/state";
import { MAX_IMAGE_BYTES, parseFigmaUrl, parseTags, projectSchema, type ProjectInput } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { STAGE_LABEL, type Profile, type Stage } from "@/lib/types";

/** 어떤 링크(forUrl)에 대한 결과인지 함께 저장 → 링크가 바뀌면 지난 결과는 자동으로 무시됩니다. */
type FigmaPreview = { forUrl: string; status: "loading" | "done" | "error"; url: string | null; message?: string };

type FieldName = keyof ProjectInput | "image";

export function ProjectForm({ author }: { author: Profile }) {
  const [state, formAction] = useActionState(createProject, initialState);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    mode: "onTouched", // 칸을 한 번 벗어난 뒤부터, 입력할 때마다 다시 검사
    defaultValues: { title: "", summary: "", figma_url: "", tags: "", stage: "wip" },
  });

  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [figmaResult, setFigmaResult] = useState<FigmaPreview | null>(null);

  // 서버가 돌려준 필드 오류는 "그 응답 이후 사용자가 고친 칸"에서는 숨깁니다.
  // (어느 응답(after) 이후에 고쳤는지 함께 저장 → 새 응답이 오면 자동으로 초기화)
  const [edited, setEdited] = useState<{ after: ActionState; fields: Set<FieldName> }>({ after: initialState, fields: new Set() });
  const markEdited = (name: FieldName) =>
    setEdited((prev) => ({ after: state, fields: new Set(prev.after === state ? prev.fields : []).add(name) }));
  const field = (name: keyof ProjectInput) => register(name, { onChange: () => markEdited(name) });

  // 미리보기 URL은 메모리를 잡아먹으므로 바뀌거나 사라질 때 해제
  useEffect(() => () => { if (fileUrl) URL.revokeObjectURL(fileUrl); }, [fileUrl]);

  // useWatch: 이 값들이 바뀔 때만 다시 그려 미리보기 카드를 갱신
  const [title, summary, tagsText, stage, figmaUrl] = useWatch({ control, name: ["title", "summary", "tags", "stage", "figma_url"] });

  // [과제 5] 파일이 없고 Figma 링크가 맞으면, 입력이 멈춘 뒤 썸네일을 받아 미리보기
  const wantsFigma = !fileUrl && parseFigmaUrl(figmaUrl) !== null;
  useEffect(() => {
    if (!wantsFigma) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setFigmaResult({ forUrl: figmaUrl, status: "loading", url: null });
      try {
        const res = await fetch(`/api/figma-thumbnail?url=${encodeURIComponent(figmaUrl)}`, { signal: controller.signal });
        const json = (await res.json()) as { url?: string; error?: string };
        setFigmaResult(
          res.ok && json.url
            ? { forUrl: figmaUrl, status: "done", url: json.url }
            : { forUrl: figmaUrl, status: "error", url: null, message: json.error }
        );
      } catch (e) {
        if ((e as Error).name !== "AbortError") {
          setFigmaResult({ forUrl: figmaUrl, status: "error", url: null, message: "썸네일을 가져오지 못했습니다." });
        }
      }
    }, 600);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [figmaUrl, wantsFigma]);
  // 지금 링크에 대한 결과만 화면에 씀
  const figma = wantsFigma && figmaResult?.forUrl === figmaUrl ? figmaResult : null;

  // 클라이언트 검증을 통과했을 때만 서버로 보냄 (파일 오류도 함께 확인)
  const onValid = (_values: ProjectInput, event?: BaseSyntheticEvent) => {
    const form = event?.target;
    if (fileError || !(form instanceof HTMLFormElement)) return;
    const data = new FormData(form); // 파일(image)까지 포함
    startTransition(() => formAction(data));
  };

  // 오류는 브라우저 검증 → 없으면 서버 검증 결과 순으로 보여줌
  const serverErrorOf = (name: FieldName) =>
    edited.after === state && edited.fields.has(name) ? undefined : state.fieldErrors?.[name];
  const errorOf = (name: keyof ProjectInput) => (errors[name]?.message ? [errors[name].message] : serverErrorOf(name));
  const imageError = fileError ? [fileError] : serverErrorOf("image");
  const tags = parseTags(tagsText);

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[1fr_22rem]">
      <form onSubmit={handleSubmit(onValid)} noValidate className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="title">제목</Label>
          <Input id="title" maxLength={60} placeholder="예: 동네 서점 예약 앱 — 홈 화면" aria-invalid={!!errorOf("title")} aria-describedby="title-error" {...field("title")} />
          <FieldError id="title-error" errors={errorOf("title")} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="summary">받고 싶은 피드백</Label>
          <Textarea id="summary" maxLength={300} placeholder="어떤 부분을 봐주면 좋을지 적어주세요." aria-invalid={!!errorOf("summary")} aria-describedby="summary-error" {...field("summary")} />
          <div className="flex justify-between">
            <FieldError id="summary-error" errors={errorOf("summary")} />
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
              if (f && !f.type.startsWith("image/")) setFileError("이미지 파일만 올릴 수 있습니다.");
              else if (f && f.size > MAX_IMAGE_BYTES) setFileError("5MB 이하로 올려주세요.");
              else setFileError(null);
              setFileUrl(f ? URL.createObjectURL(f) : null);
              markEdited("image");
            }}
            aria-invalid={!!imageError}
            aria-describedby="image-error"
          />
          <FieldError id="image-error" errors={imageError} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="figma_url">Figma 링크 (선택)</Label>
          <Input id="figma_url" type="url" placeholder="https://www.figma.com/design/…" aria-invalid={!!errorOf("figma_url")} aria-describedby="figma-error figma-hint" {...field("figma_url")} />
          <FieldError id="figma-error" errors={errorOf("figma_url")} />
          <p id="figma-hint" className="text-xs text-muted-foreground" aria-live="polite">
            {figma?.status === "loading"
              ? "Figma 썸네일을 가져오는 중…"
              : figma?.status === "error"
                ? figma.message
                : figma?.url
                  ? "이미지를 올리지 않으면 이 Figma 썸네일을 씁니다."
                  : "이미지를 올리지 않으면 Figma 링크의 썸네일을 자동으로 가져옵니다."}
          </p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="tags">태그</Label>
          <Input id="tags" placeholder="웹, 랜딩 (쉼표로 구분, 최대 5개)" aria-invalid={!!errorOf("tags")} aria-describedby="tags-error" {...field("tags")} />
          <FieldError id="tags-error" errors={errorOf("tags")} />
        </div>
        <fieldset className="grid gap-2">
          <legend className="mb-2 text-sm font-medium">작업 단계</legend>
          <div className="flex gap-2">
            {(Object.keys(STAGE_LABEL) as Stage[]).map((s) => (
              <label key={s} className={cn("cursor-pointer rounded-md border px-3 py-1.5 text-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/50", stage === s ? "border-primary bg-secondary text-secondary-foreground" : "bg-card")}>
                <input type="radio" value={s} className="sr-only" {...field("stage")} />
                {STAGE_LABEL[s]}
              </label>
            ))}
          </div>
        </fieldset>
        <FormMessage ok={state.ok} message={state.message} />
        {/* handleSubmit 뒤 startTransition 으로 제출하므로 전송 상태(isPending)를 직접 넘깁니다 */}
        <SubmitButton size="lg" pending={isPending} pendingText="올리는 중…" className="w-fit">
          작업 올리기
        </SubmitButton>
      </form>

      <aside className="grid gap-3 lg:sticky lg:top-24">
        <p className="text-sm font-medium text-muted-foreground">피드에 이렇게 보입니다</p>
        <ProjectCard
          preview
          project={{
            title, summary, tags, stage,
            image_url: fileUrl ?? figma?.url ?? null,
            created_at: new Date().toISOString(),
            author,
            feedback_count: 0,
          }}
        />
      </aside>
    </div>
  );
}
