import { ProjectCard } from "./project-card";
import { EmptyState } from "./empty-state";
import type { ProjectWithMeta } from "@/lib/types";

export function ProjectGrid({ projects }: { projects: ProjectWithMeta[] }) {
  if (projects.length === 0) {
    return (
      <EmptyState
        title="조건에 맞는 작업이 없습니다"
        description="다른 태그를 고르거나, 지금 작업 중인 화면을 직접 올려 첫 크리틱을 받아보세요."
        action={{ href: "/projects/new", label: "작업 올리기" }}
      />
    );
  }
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => (
        <li key={p.id}>
          <ProjectCard project={p} />
        </li>
      ))}
    </ul>
  );
}
