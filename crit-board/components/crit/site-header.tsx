import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "./user-avatar";
import { getCurrentUser } from "@/lib/auth";
import { signOut } from "@/lib/actions/auth";
import { ThemeToggle } from "./theme-toggle";

/** [2부 버전] 로그인 여부에 따라 오른쪽 메뉴가 바뀌는 서버 컴포넌트 */
export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-20 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[67.5rem] items-center gap-6 px-5">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="pin size-5 bg-highlight" aria-hidden />
          Crit Board
        </Link>
        <nav className="flex gap-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">피드</Link>
          <Link href="/design-system" className="hover:text-foreground">디자인 시스템</Link>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <>
              <span className="hidden items-center gap-2 text-sm sm:flex">
                <UserAvatar user={user} />
                {user.display_name}
              </span>
              {/* Server Action 을 form action 으로 — JS 없이도 동작 */}
              <form action={signOut}>
                <Button type="submit" variant="ghost" size="sm">로그아웃</Button>
              </form>
              <Button asChild size="sm">
                <Link href="/projects/new">작업 올리기</Link>
              </Button>
            </>
          ) : (
            <Button asChild size="sm" variant="outline">
              <Link href="/login">로그인</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
