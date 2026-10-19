"use client";

/**
 * [1부 버전] 작업 올리기 폼 — 입력과 동시에 오른쪽 카드 미리보기가 갱신됩니다.
 * "제어 컴포넌트(controlled component)" 패턴: 입력값을 state가 소유합니다.
 * 2부에서 action={formAction} 으로 서버에 저장하도록 바뀝니다.
 */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProjectCard } from "./project-card";
import { cn } from "@/lib/utils";
import { STAGE_LABEL, type Stage } from "@/lib/types";

export function ProjectForm() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [stage, setStage] = useState<Stage>("wip");
  const [submitted, setSubmitted] = useState(false);

  const tags = tagsText.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 5);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true); // 1부: 저장 대신 확인 메시지만
  }

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[1fr_22rem]">
      <form onSubmit={handleSubmit} className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="title">제목</Label>
          <Input id="title" name="title" required maxLength={60} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 동네 서점 예약 앱 — 홈 화면" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="summary">받고 싶은 피드백</Label>
          <Textarea id="summary" name="summary" required maxLength={300} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="어떤 부분을 봐주면 좋을지 적어주세요." />
          <p className="text-right text-xs text-muted-foreground">{summary.length}/300</p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="image_url">썸네일 이미지 URL</Label>
          <Input id="image_url" name="image_url" type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" />
          <p className="text-xs text-muted-foreground">2부에서 파일 업로드(Supabase Storage)로 바뀝니다.</p>
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
        <div className="flex items-center gap-3">
          <Button type="submit" size="lg">작업 올리기</Button>
          {submitted && <p role="status" className="text-sm text-muted-foreground">입력 확인 완료. 실제 저장은 2부에서 연결합니다.</p>}
        </div>
      </form>

      <aside className="grid gap-3 lg:sticky lg:top-24">
        <p className="text-sm font-medium text-muted-foreground">피드에 이렇게 보입니다</p>
        <ProjectCard
          preview
          project={{
            title,
            summary,
            image_url: imageUrl || null,
            tags,
            stage,
            created_at: new Date().toISOString(),
            author: { id: "me", display_name: "나", role_title: null, avatar_url: null },
            feedback_count: 0,
          }}
        />
      </aside>
    </div>
  );
}
