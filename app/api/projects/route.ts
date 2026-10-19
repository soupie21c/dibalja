import { NextResponse, type NextRequest } from "next/server";
import { listProjects } from "@/lib/data";

/**
 * Route Handler = 이 앱의 REST API 엔드포인트
 *   GET /api/projects?tag=웹&q=대시보드
 * 화면은 Server Component 에서 lib/data 를 직접 부르므로 이 API가 필요 없지만,
 * 모바일 앱(예: Kotlin)이나 외부 서비스가 데이터를 가져갈 때 사용합니다.
 */
export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get("tag") ?? undefined;
  const q = request.nextUrl.searchParams.get("q") ?? undefined;
  try {
    const projects = await listProjects({ tag, q });
    return NextResponse.json({ data: projects, count: projects.length });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
