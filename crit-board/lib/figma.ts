/**
 * [과제 5] Figma REST API — 링크로 썸네일 이미지 주소 얻기
 * ------------------------------------------------------------
 * FIGMA_TOKEN(개인 액세스 토큰)은 서버 전용 환경변수입니다. NEXT_PUBLIC_ 을 붙이지 않으므로
 * 브라우저 번들에 들어가지 않습니다. 이 파일은 Server Action·Route Handler 에서만 import 하세요.
 *
 *   node-id 가 있는 링크 → GET /v1/images/:key?ids=:node  (그 프레임을 PNG 로 렌더링)
 *   node-id 가 없는 링크 → GET /v1/files/:key?depth=1      (파일 썸네일 thumbnailUrl)
 * Figma 가 주는 이미지 주소는 일정 시간 뒤 만료되므로, 저장할 때는 우리 Storage 로 복사합니다.
 */

import { parseFigmaUrl } from "@/lib/schemas";

export { parseFigmaUrl };

const FIGMA_API = "https://api.figma.com/v1";

/** 토큰이 없거나, 링크가 아니거나, 권한이 없으면 null (호출한 쪽은 썸네일 없이 진행) */
export async function getFigmaThumbnailUrl(figmaUrl: string): Promise<string | null> {
  const token = process.env.FIGMA_TOKEN;
  const parsed = parseFigmaUrl(figmaUrl);
  if (!token || !parsed) return null;

  const { fileKey, nodeId } = parsed;
  const endpoint = nodeId
    ? `${FIGMA_API}/images/${fileKey}?ids=${encodeURIComponent(nodeId)}&format=png&scale=1`
    : `${FIGMA_API}/files/${fileKey}?depth=1`;

  try {
    const res = await fetch(endpoint, {
      headers: { "X-Figma-Token": token },
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { images?: Record<string, string | null>; thumbnailUrl?: string };
    const url = nodeId ? json.images?.[nodeId] : json.thumbnailUrl;
    return url ?? null;
  } catch {
    return null; // 시간 초과·네트워크 오류
  }
}
