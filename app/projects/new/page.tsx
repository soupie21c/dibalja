import { redirect } from "next/navigation";
import { ProjectForm } from "@/components/crit/project-form";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "작업 올리기 — Crit Board" };

export default async function NewProjectPage() {
  // proxy.ts 가 1차로 막지만, 페이지에서도 한 번 더 확인(심층 방어)
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/projects/new");

  return (
    <div className="grid gap-8">
      <div className="grid gap-2">
        <h1 className="text-3xl font-bold tracking-tight">작업 올리기</h1>
        <p className="text-muted-foreground">완성도보다 질문이 중요합니다. 어떤 부분이 고민인지 적어주세요.</p>
      </div>
      <ProjectForm author={user} />
    </div>
  );
}
