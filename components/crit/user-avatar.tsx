import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Profile } from "@/lib/types";

/** 프로필 이미지가 없으면 이름 첫 글자를 보여줍니다. */
export function UserAvatar({ user, className }: { user: Pick<Profile, "display_name" | "avatar_url">; className?: string }) {
  return (
    <Avatar className={cn("size-7", className)}>
      {user.avatar_url && <AvatarImage src={user.avatar_url} alt="" />}
      <AvatarFallback className="bg-secondary font-bold text-secondary-foreground">
        {user.display_name.slice(0, 1)}
      </AvatarFallback>
    </Avatar>
  );
}
