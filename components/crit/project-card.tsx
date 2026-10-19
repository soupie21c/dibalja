import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StageBadge } from "./stage-badge";
import { UserAvatar } from "./user-avatar";
import { cn, timeAgo } from "@/lib/utils";
import type { ProjectWithMeta } from "@/lib/types";

type CardData = Pick<
  ProjectWithMeta,
  "title" | "summary" | "image_url" | "tags" | "stage" | "created_at" | "author" | "feedback_count"
> & { id?: string };

/**
 * Figma 컴포넌트 "Project Card" 구현
 *  - 썸네일(4:3) + 우상단 코멘트 핀(피드백 수)
 *  - 제목 / 요약 2줄 / 작성자·시간·단계
 * preview=true 이면 링크 없이, 최적화 없이 렌더링(업로드 폼 미리보기용)
 */
export function ProjectCard({ project, preview = false }: { project: CardData; preview?: boolean }) {
  const body = (
    <Card className={cn("gap-0 overflow-hidden transition-shadow", !preview && "group-hover:shadow-md")}>
      <div className="relative aspect-[4/3] bg-muted">
        {project.image_url ? (
          <Image
            src={project.image_url}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
            unoptimized={preview}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            썸네일 없음
          </div>
        )}
        <span
          className="pin absolute right-3 top-3 flex h-8 min-w-8 items-center justify-center gap-1 bg-highlight px-2.5 text-sm font-bold text-highlight-foreground shadow-sm"
          aria-label={`피드백 ${project.feedback_count}개`}
        >
          <MessageCircle className="size-3.5" aria-hidden />
          {project.feedback_count}
        </span>
      </div>

      <div className="grid gap-2 p-5">
        <h3 className="text-base font-bold leading-snug">{project.title || "제목을 입력하세요"}</h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {project.summary || "어떤 피드백이 필요한지 적어주세요."}
        </p>
        {project.tags.length > 0 && (
          <ul className="flex flex-wrap gap-1.5 pt-1">
            {project.tags.map((t) => (
              <li key={t} className="rounded-sm bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                #{t}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center gap-2 border-t px-5 py-3 text-sm">
        <UserAvatar user={project.author} />
        <span className="font-medium">{project.author.display_name}</span>
        <time className="text-muted-foreground" dateTime={project.created_at} suppressHydrationWarning>
          {timeAgo(project.created_at)}
        </time>
        <span className="ml-auto">
          <StageBadge stage={project.stage} />
        </span>
      </div>
    </Card>
  );

  if (preview || !project.id) return body;
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group block rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      {body}
    </Link>
  );
}
