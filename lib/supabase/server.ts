import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";

/**
 * 서버(Server Component / Server Action / Route Handler)용 클라이언트
 * 요청마다 새로 만들어야 합니다 — 사용자별 쿠키가 다르기 때문입니다.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Server Component 에서는 쿠키를 쓸 수 없습니다.
            // proxy.ts 가 세션을 갱신하므로 여기서는 무시해도 안전합니다.
          }
        },
      },
    }
  );
}
