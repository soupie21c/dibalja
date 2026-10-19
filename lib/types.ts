/**
 * 도메인 타입 — 2부에서 Supabase 테이블 구조와 그대로 맞춥니다.
 * (DB 컬럼은 snake_case, 그대로 사용해 매핑 코드를 없앱니다)
 */
export type Stage = "wip" | "review" | "final";
export type FeedbackKind = "praise" | "suggestion" | "question";

export interface Profile {
  id: string;
  display_name: string;
  role_title: string | null;
  avatar_url: string | null;
}

export interface Project {
  id: string;
  author_id: string;
  title: string;
  summary: string;
  image_url: string | null;
  figma_url: string | null;
  tags: string[];
  stage: Stage;
  created_at: string;
}

export interface Feedback {
  id: string;
  project_id: string;
  author_id: string;
  body: string;
  kind: FeedbackKind;
  created_at: string;
}

/** 화면에서 쓰는 조합 타입 */
export type ProjectWithMeta = Project & {
  author: Profile;
  feedback_count: number;
};

export type FeedbackWithAuthor = Feedback & { author: Profile };

export type ProjectDetail = ProjectWithMeta & {
  feedback: FeedbackWithAuthor[];
};

export const STAGE_LABEL: Record<Stage, string> = {
  wip: "작업 중",
  review: "리뷰 요청",
  final: "최종안",
};

export const KIND_LABEL: Record<FeedbackKind, string> = {
  praise: "좋은 점",
  suggestion: "제안",
  question: "질문",
};
