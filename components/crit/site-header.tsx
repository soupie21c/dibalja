import Link from "next/link";
import { Button } from "@/components/ui/button";

/** [1부 버전] 헤더 — 2부에서 로그인 상태에 따라 메뉴가 바뀝니다. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="pin size-5 bg-highlight" aria-hidden />
          Crit Board
        </Link>
        <nav className="flex gap-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">피드</Link>
          <Link href="/design-system" className="hover:text-foreground">디자인 시스템</Link>
        </nav>
        <Button asChild size="sm" className="ml-auto">
          <Link href="/projects/new">작업 올리기</Link>
        </Button>
      </div>
    </header>
  );
}
