import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getFigmaThumbnailUrl, parseFigmaUrl } from "@/lib/figma";

/**
 * [과제 5] GET /api/figma-thumbnail?url=<Figma 링크>
 * 작업 올리기 폼이 "이미지를 올리지 않았을 때" 미리보기용 썸네일을 받아 갑니다.
 * 토큰을 쓰는 호출이므로 로그인한 사용자만 허용합니다(남이 우리 토큰 한도를 쓰지 못하게).
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });

  const url = request.nextUrl.searchParams.get("url") ?? "";
  if (!parseFigmaUrl(url)) return NextResponse.json({ error: "Figma 디자인 링크가 아닙니다." }, { status: 400 });
  if (!process.env.FIGMA_TOKEN) return NextResponse.json({ error: "서버에 FIGMA_TOKEN 이 설정되지 않았습니다." }, { status: 503 });

  const thumbnail = await getFigmaThumbnailUrl(url);
  if (!thumbnail) return NextResponse.json({ error: "썸네일을 가져오지 못했습니다. 파일 공유 권한을 확인하세요." }, { status: 404 });

  return NextResponse.json({ url: thumbnail }, { headers: { "Cache-Control": "private, no-store" } });
}
