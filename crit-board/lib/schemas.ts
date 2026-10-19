/**
 * 폼 검증 규칙 — 서버(Server Action)와 브라우저(react-hook-form)가 같은 규칙을 씁니다.
 * "use server" 파일이 아니므로 Client Component 에서도 import 할 수 있습니다.
 * 서버 검증은 항상 다시 실행됩니다. 브라우저 검증은 빠른 안내용일 뿐 보안이 아닙니다.
 */
import { z } from "zod";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
export const MAX_TAGS = 5;

/** "웹, 랜딩, 웹" → ["웹", "랜딩"] (공백 제거, 중복 제거) */
function uniqueTags(text: string): string[] {
  return [...new Set(text.split(",").map((t) => t.trim()).filter(Boolean))];
}

/** 저장·미리보기용 태그 목록 (최대 5개) */
export function parseTags(text: string): string[] {
  return uniqueTags(text).slice(0, MAX_TAGS);
}

/**
 * Figma 디자인 링크 → { fileKey, nodeId } (아니면 null)
 *   /design/:key/:name  또는  /design/:key/branch/:branchKey/:name (브랜치면 branchKey 를 씀)
 *   ?node-id=5-2 → "5:2"
 * 브라우저(미리보기 조건)와 서버(Figma API 호출)가 같은 판단을 하도록 여기 한 곳에 둡니다.
 */
export function parseFigmaUrl(raw: string): { fileKey: string; nodeId: string | null } | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || !/(^|\.)figma\.com$/.test(url.hostname)) return null;

  const m = url.pathname.match(/^\/(?:design|file)\/([A-Za-z0-9]+)(?:\/branch\/([A-Za-z0-9]+))?/);
  if (!m) return null;

  const node = url.searchParams.get("node-id");
  const nodeId = node && /^\d+[-:]\d+$/.test(node) ? node.replace("-", ":") : null;
  return { fileKey: m[2] ?? m[1], nodeId };
}

export const projectSchema = z.object({
  title: z.string().trim().min(2, "제목은 2자 이상 적어주세요.").max(60, "제목은 60자까지 쓸 수 있어요."),
  summary: z.string().trim().min(5, "5자 이상 적어주세요.").max(300, "300자까지 쓸 수 있어요."),
  figma_url: z.union([z.literal(""), z.url("올바른 URL이 아닙니다.")]),
  // 중복을 뺀 개수로 셉니다(미리보기·저장에 쓰는 parseTags 와 같은 기준).
  tags: z.string().refine((s) => uniqueTags(s).length <= MAX_TAGS, `태그는 ${MAX_TAGS}개까지예요.`),
  stage: z.enum(["wip", "review", "final"]),
});
export type ProjectInput = z.infer<typeof projectSchema>;

export const profileSchema = z.object({
  display_name: z.string().trim().min(1, "이름을 입력하세요.").max(30, "이름은 30자까지 쓸 수 있어요."),
  role_title: z.string().trim().max(40, "직함은 40자까지 쓸 수 있어요."),
});
