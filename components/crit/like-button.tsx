"use client";

import { useOptimistic } from "react";
import Link from "next/link";
import { ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleLike } from "@/lib/actions/reactions";

type LikeState = { count: number; liked: boolean };

/**
 * [과제 2] 좋아요 버튼 — useOptimistic 으로 누르는 즉시 숫자를 바꾸고,
 * 서버 저장이 끝나면 revalidatePath 로 내려온 실제 값(props)으로 맞춰집니다.
 * 저장이 실패하면 낙관적 값은 버려지고 원래 props 값이 그대로 보입니다.
 */
export function LikeButton({ projectId, count, liked, signedIn }: LikeState & { projectId: string; signedIn: boolean }) {
  const [optimistic, setOptimistic] = useOptimistic<LikeState, boolean>(
    { count, liked },
    (state, next) => ({ liked: next, count: Math.max(0, state.count + (next ? 1 : -1)) })
  );

  if (!signedIn) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link href={`/login?next=/projects/${projectId}`} aria-label={`좋아요 ${count}개 — 로그인하고 누르기`}>
          <ThumbsUp /> {count}
        </Link>
      </Button>
    );
  }

  return (
    <form
      action={async () => {
        const next = !optimistic.liked;
        setOptimistic(next); // 화면 먼저
        await toggleLike(projectId, next); // 그다음 서버
      }}
    >
      <Button
        type="submit"
        variant={optimistic.liked ? "secondary" : "outline"}
        size="sm"
        aria-pressed={optimistic.liked}
        aria-label={`좋아요 ${optimistic.count}개${optimistic.liked ? " — 누름" : ""}`}
      >
        <ThumbsUp className={optimistic.liked ? "fill-current" : undefined} /> {optimistic.count}
      </Button>
    </form>
  );
}
