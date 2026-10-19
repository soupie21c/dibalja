"use client";

/**
 * [1부 버전] 피드백 섹션 — 서버 없이 React state로만 동작
 * 2부에서 Server Action + useActionState 버전으로 교체됩니다.
 */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FeedbackList } from "./feedback-list";
import { KindPicker } from "./kind-picker";
import type { FeedbackKind, FeedbackWithAuthor } from "@/lib/types";

export function FeedbackSection({ projectId, initial }: { projectId: string; initial: FeedbackWithAuthor[] }) {
  const [items, setItems] = useState(initial);
  const [kind, setKind] = useState<FeedbackKind>("suggestion");
  const [body, setBody] = useState("");
  const tooShort = body.trim().length < 5;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (tooShort) return;
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        project_id: projectId,
        author_id: "me",
        author: { id: "me", display_name: "나", role_title: null, avatar_url: null },
        kind,
        body: body.trim(),
        created_at: new Date().toISOString(),
      },
    ]);
    setBody("");
  }

  return (
    <section aria-labelledby="feedback-heading" className="grid gap-6">
      <h2 id="feedback-heading" className="text-lg font-bold">
        피드백 {items.length}
      </h2>
      <FeedbackList items={items} />
      <form onSubmit={handleSubmit} className="grid gap-3 rounded-xl border bg-card p-4">
        <KindPicker value={kind} onChange={setKind} />
        <Textarea
          name="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="무엇이 좋은지, 무엇을 바꾸면 좋을지 구체적으로 적어주세요."
          aria-describedby="body-hint"
        />
        <div className="flex items-center justify-between gap-3">
          <p id="body-hint" className="text-xs text-muted-foreground">5자 이상 입력하세요.</p>
          <Button type="submit" disabled={tooShort}>피드백 남기기</Button>
        </div>
      </form>
    </section>
  );
}
