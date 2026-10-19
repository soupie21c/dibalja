import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/crit/profile-form";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "프로필 설정 — Crit Board" };

export default async function SettingsPage() {
  // proxy.ts 가 1차로 막지만, 페이지에서도 한 번 더 확인(심층 방어)
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/settings");

  return (
    <div className="grid gap-8">
      <div className="grid gap-2">
        <h1 className="text-3xl font-bold tracking-tight">프로필 설정</h1>
        <p className="text-muted-foreground">피드와 피드백에 보이는 이름과 직함을 바꿀 수 있습니다.</p>
      </div>
      <ProfileForm profile={user} />
    </div>
  );
}
