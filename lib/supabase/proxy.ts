import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/** 로그인해야만 들어갈 수 있는 경로 */
const PROTECTED = ["/projects/new"];

/**
 * 모든 요청의 "입구"에서 실행: 만료된 인증 토큰을 갱신해 쿠키에 다시 씁니다.
 * (Server Component는 쿠키를 쓸 수 없으므로 이 역할이 꼭 필요합니다)
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // 1) 이후 서버 코드가 새 토큰을 보도록 요청 쿠키 갱신
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          // 2) 브라우저에도 새 토큰을 내려주도록 응답 쿠키 갱신
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  // ⚠️ createServerClient 와 getClaims 사이에 다른 코드를 넣지 마세요.
  // getClaims()는 JWT 서명을 검증하고, 필요하면 토큰을 갱신합니다.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  const path = request.nextUrl.pathname;
  if (!user && PROTECTED.some((p) => path.startsWith(p))) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  return response; // 반드시 이 response(쿠키 포함)를 그대로 반환
}
