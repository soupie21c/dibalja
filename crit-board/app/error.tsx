"use client";

import { Button } from "@/components/ui/button";

/** 서버 컴포넌트에서 throw 된 오류를 받아 보여주는 경계(Error Boundary) */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="grid justify-items-start gap-3 rounded-xl border border-dashed p-10">
      <p className="text-lg font-semibold">데이터를 불러오지 못했습니다</p>
      <p className="max-w-prose text-sm text-muted-foreground">
        Supabase 환경변수(.env.local)와 SQL 마이그레이션 실행 여부를 확인한 뒤 다시 시도하세요.
      </p>
      {process.env.NODE_ENV === "development" && <code className="text-xs text-destructive">{error.message}</code>}
      <Button onClick={reset}>다시 시도</Button>
    </div>
  );
}
