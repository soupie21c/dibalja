import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DeleteProjectButton } from "@/components/crit/delete-project-button";
import { FeedbackSection } from "@/components/crit/feedback-section";
import { StageBadge } from "@/components/crit/stage-badge";
import { UserAvatar } from "@/components/crit/user-avatar";
import { getCurrentUser } from "@/lib/auth";
import { getProject } from "@/lib/data";
import { timeAgo } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const project = await getProject(id);
  return { title: project ? `${project.title} — Crit Board` : "Crit Board" };
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  // 두 요청을 동시에 — 순차 대기(waterfall) 방지
  const [project, user] = await Promise.all([getProject(id), getCurrentUser()]);
  if (!project) notFound();
  const isOwner = user?.id === project.author_id;

  return (
    <article className="grid gap-10 lg:grid-cols-[1fr_24rem]">
      <div className="grid content-start gap-6">
        <Button asChild variant="ghost" size="sm" className="w-fit -ml-3">
          <Link href="/"><ArrowLeft /> 피드로</Link>
        </Button>
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border bg-muted">
          {project.image_url ? (
            <Image src={project.image_url} alt={`${project.title} 화면`} fill priority sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">썸네일 없음</div>
          )}
        </div>
      </div>

      <div className="grid content-start gap-6">
        <header className="grid gap-3">
          <StageBadge stage={project.stage} />
          <h1 className="text-2xl font-bold leading-snug tracking-tight">{project.title}</h1>
          <div className="flex items-center gap-2 text-sm">
            <UserAvatar user={project.author} size="sm" />
            <span className="font-medium">{project.author.display_name}</span>
            {project.author.role_title && <span className="text-muted-foreground">{project.author.role_title}</span>}
            <time className="ml-auto text-muted-foreground" dateTime={project.created_at}>{timeAgo(project.created_at)}</time>
          </div>
          <p className="leading-relaxed">{project.summary}</p>
          <div className="flex flex-wrap gap-2">
            {project.figma_url && (
              <Button asChild variant="outline" size="sm">
                <a href={project.figma_url} target="_blank" rel="noreferrer">Figma에서 보기 <ExternalLink /></a>
              </Button>
            )}
            {isOwner && <DeleteProjectButton projectId={project.id} />}
          </div>
        </header>
        <Separator />
        <FeedbackSection projectId={project.id} items={project.feedback} currentUser={user} />
      </div>
    </article>
  );
}
