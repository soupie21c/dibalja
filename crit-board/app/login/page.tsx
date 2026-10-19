import { redirect } from "next/navigation";
import { AuthForm } from "@/components/crit/auth-form";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "로그인 — Crit Board" };

type Props = { searchParams: Promise<{ next?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { next = "/" } = await searchParams;
  if (await getCurrentUser()) redirect(next.startsWith("/") ? next : "/");

  return (
    <div className="mx-auto grid max-w-sm gap-8 py-8">
      <div className="grid gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Crit Board 시작하기</h1>
        <p className="text-muted-foreground">로그인하면 작업을 올리고 피드백을 남길 수 있습니다.</p>
      </div>
      <AuthForm next={next} />
    </div>
  );
}
