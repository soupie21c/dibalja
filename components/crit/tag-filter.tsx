import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * URL 쿼리(?tag=)로 상태를 표현하는 필터.
 * useState 없이도 새로고침·공유·뒤로가기에서 상태가 유지됩니다.
 */
export function TagFilter({ tags, active }: { tags: string[]; active?: string }) {
  const item = (href: string, label: string, on: boolean) => (
    <li key={label}>
      <Link
        href={href}
        aria-current={on ? "page" : undefined}
        className={cn(
          "inline-flex h-8 items-center rounded-full border px-3.5 text-sm transition-colors",
          on ? "border-foreground bg-foreground text-background" : "bg-card hover:bg-muted"
        )}
      >
        {label}
      </Link>
    </li>
  );
  return (
    <nav aria-label="태그 필터">
      <ul className="flex flex-wrap gap-2">
        {item("/", "전체", !active)}
        {tags.map((t) => item(`/?tag=${encodeURIComponent(t)}`, `#${t}`, active === t))}
      </ul>
    </nav>
  );
}
