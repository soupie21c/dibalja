"use client";

import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "./user-avatar";
import { timeAgo } from "@/lib/utils";
import { deleteFeedback } from "@/lib/actions/feedback";
import { KIND_LABEL, type FeedbackWithAuthor } from "@/lib/types";

const kindVariant = { praise: "final", suggestion: "wip", question: "review" } as const;

/** [2부 버전] 본인이 쓴 피드백에는 삭제 버튼이 붙습니다. */
export function FeedbackList({ items, currentUserId }: { items: FeedbackWithAuthor[]; currentUserId?: string }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">아직 피드백이 없습니다. 첫 의견을 남겨주세요.</p>;
  }
  return (
    <ol className="grid gap-5">
      {items.map((f, i) => (
        <li key={f.id} className="grid grid-cols-[2rem_1fr] gap-3">
          <span className="pin flex size-8 items-center justify-center bg-highlight text-sm font-bold text-highlight-foreground">
            {i + 1}
          </span>
          <div className="grid gap-1.5">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <UserAvatar user={f.author} size="sm" />
              <span className="font-medium">{f.author.display_name}</span>
              <Badge variant={kindVariant[f.kind]}>{KIND_LABEL[f.kind]}</Badge>
              <time className="text-muted-foreground" dateTime={f.created_at} suppressHydrationWarning>
                {timeAgo(f.created_at)}
              </time>
              {currentUserId === f.author_id && (
                // bind 로 인자를 미리 채운 Server Action
                <form action={deleteFeedback.bind(null, f.id, f.project_id)} className="ml-auto">
                  <Button type="submit" variant="ghost" size="icon" className="size-7" aria-label="내 피드백 삭제">
                    <Trash2 />
                  </Button>
                </form>
              )}
            </div>
            <p className="whitespace-pre-line text-[0.95rem] leading-relaxed">{f.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
