import { ProjectForm } from "@/components/crit/project-form";

export const metadata = { title: "작업 올리기 — Crit Board" };

export default function NewProjectPage() {
  return (
    <div className="grid gap-8">
      <div className="grid gap-2">
        <h1 className="text-3xl font-bold tracking-tight">작업 올리기</h1>
        <p className="text-muted-foreground">완성도보다 질문이 중요합니다. 어떤 부분이 고민인지 적어주세요.</p>
      </div>
      <ProjectForm />
    </div>
  );
}
