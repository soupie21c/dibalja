"use client";

/**
 * [과제 3] 실시간 피드백 구독 — 화면 컴포넌트가 Supabase 를 직접 다루지 않도록 여기 모았습니다.
 * 다른 사람이 피드백을 남기거나 지우면 router.refresh() 로 서버 컴포넌트만 다시 그려 새 목록을 받습니다.
 * (페이지를 새로 불러오지 않으므로 입력 중인 글도 그대로 남습니다.)
 */
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/** 내가 남긴 글은 Server Action 의 revalidatePath 가 이미 갱신하므로, 잠시 기다렸다가 목록에 없을 때만 새로고침 */
const SETTLE_MS = 400;

export function useFeedbackRealtime(projectId: string, currentIds: string[]) {
  const router = useRouter();

  // 구독 콜백이 항상 최신 목록의 id 를 보도록 ref 에 담아 둡니다(구독을 다시 만들지 않기 위해).
  const ids = useRef(new Set<string>());
  useEffect(() => {
    ids.current = new Set(currentIds);
  }, [currentIds]);

  useEffect(() => {
    const supabase = createClient();
    const timers = new Set<ReturnType<typeof setTimeout>>();

    const channel = supabase
      .channel(`feedback:${projectId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "feedback", filter: `project_id=eq.${projectId}` },
        (payload) => {
          const id = (payload.new as { id?: string }).id;
          const timer = setTimeout(() => {
            timers.delete(timer);
            if (!id || !ids.current.has(id)) router.refresh();
          }, SETTLE_MS);
          timers.add(timer);
        }
      )
      // delete 는 컬럼 필터를 쓸 수 없고(RLS 가 켜진 표는) 기본키만 오므로, 이 화면에 있던 글일 때만 갱신합니다.
      // 피드백 삭제는 드물어서 프로젝트별 채널을 따로 두지 않았습니다.
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "feedback" }, (payload) => {
        const id = (payload.old as { id?: string }).id;
        if (id && ids.current.has(id)) router.refresh();
      })
      .subscribe();

    return () => {
      timers.forEach(clearTimeout);
      supabase.removeChannel(channel);
    };
  }, [projectId, router]);
}
