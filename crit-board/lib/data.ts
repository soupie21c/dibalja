/**
 * 데이터 접근 레이어 (1부: Mock 구현)
 * ------------------------------------------------------------
 * 화면 컴포넌트는 이 파일의 함수만 호출합니다.
 * 2부에서는 이 파일 "하나만" Supabase 구현으로 바꾸고, 화면 코드는 건드리지 않습니다.
 */
import { feedback, profiles, projects } from "./mock-data";
import type { ProjectDetail, ProjectWithMeta } from "./types";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms)); // 네트워크 지연 흉내

function withMeta(p: (typeof projects)[number]): ProjectWithMeta {
  return {
    ...p,
    author: profiles.find((u) => u.id === p.author_id)!,
    feedback_count: feedback.filter((f) => f.project_id === p.id).length,
  };
}

export async function listProjects(opts: { tag?: string; q?: string } = {}): Promise<ProjectWithMeta[]> {
  await wait(150);
  return projects
    .filter((p) => (opts.tag ? p.tags.includes(opts.tag) : true))
    .filter((p) => (opts.q ? (p.title + p.summary).includes(opts.q) : true))
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map(withMeta);
}

export async function getProject(id: string): Promise<ProjectDetail | null> {
  await wait(150);
  const p = projects.find((x) => x.id === id);
  if (!p) return null;
  return {
    ...withMeta(p),
    feedback: feedback
      .filter((f) => f.project_id === id)
      .sort((a, b) => a.created_at.localeCompare(b.created_at))
      .map((f) => ({ ...f, author: profiles.find((u) => u.id === f.author_id)! })),
  };
}

export async function listTags(): Promise<string[]> {
  return [...new Set(projects.flatMap((p) => p.tags))].sort();
}
