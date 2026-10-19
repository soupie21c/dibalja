import { Suspense } from "react";
import { ProjectGrid } from "@/components/crit/project-grid";
import { TagFilter } from "@/components/crit/tag-filter";
import { Skeleton } from "@/components/ui/skeleton";
import { listProjects, listTags } from "@/lib/data";

// Next.js 15+ : searchParams 는 Promise 입니다.
type Props = { searchParams: Promise<{ tag?: string; q?: string }> };

export default async function HomePage({ searchParams }: Props) {
  const { tag, q } = await searchParams;
  const tags = await listTags();

  return (
    <div className="grid gap-10">
      <section className="grid max-w-3xl gap-4">
        <h1 className="text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl">
          완성 전에 보여주세요.
          <br />
          동료들이 코멘트를 해줍니다.
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          작업 중인 화면을 올리고, 좋은 점·제안·질문으로 나뉜 구체적인 피드백을 받으세요.
        </p>
      </section>

      <TagFilter tags={tags} active={tag} />

      {/* key 를 바꾸면 필터 변경 시마다 스켈레톤이 다시 보입니다 */}
      <Suspense key={`${tag}-${q}`} fallback={<GridSkeleton />}>
        <Feed tag={tag} q={q} />
      </Suspense>
    </div>
  );
}

async function Feed({ tag, q }: { tag?: string; q?: string }) {
  const projects = await listProjects({ tag, q });
  return <ProjectGrid projects={projects} />;
}

function GridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="aspect-[4/5] rounded-xl" />
      ))}
    </div>
  );
}
