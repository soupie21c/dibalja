import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EmptyState({ title, description, action }: {
  title: string;
  description: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="grid justify-items-start gap-3 rounded-xl border border-dashed p-10">
      <p className="text-lg font-bold">{title}</p>
      <p className="max-w-prose text-sm text-muted-foreground">{description}</p>
      {action && (
        <Button asChild className="mt-2">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
}
