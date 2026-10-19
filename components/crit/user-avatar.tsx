import { cva, type VariantProps } from "class-variance-authority";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Profile } from "@/lib/types";

/** Figma 컴포넌트 "Avatar" — Size = SM(24) | MD(28) | LG(40) */
const avatarVariants = cva("", {
  variants: {
    size: { sm: "size-6", md: "size-7", lg: "size-10" },
  },
  defaultVariants: { size: "md" },
});

/** 이니셜 글자 크기 — Figma: SM 11 / MD 12 / LG 16 */
const initialVariants = cva("bg-secondary font-bold text-secondary-foreground", {
  variants: {
    size: { sm: "text-[11px]", md: "text-xs", lg: "text-base" },
  },
  defaultVariants: { size: "md" },
});

type UserAvatarProps = {
  user: Pick<Profile, "display_name" | "avatar_url">;
  className?: string;
} & VariantProps<typeof avatarVariants>;

/** 프로필 이미지가 없으면 이름 첫 글자를 보여줍니다. */
export function UserAvatar({ user, size, className }: UserAvatarProps) {
  return (
    <Avatar className={cn(avatarVariants({ size }), className)}>
      {user.avatar_url && <AvatarImage src={user.avatar_url} alt="" />}
      <AvatarFallback className={initialVariants({ size })}>{user.display_name.slice(0, 1)}</AvatarFallback>
    </Avatar>
  );
}
