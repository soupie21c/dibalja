import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * shadcn/ui Button — Figma 컴포넌트 "Button"의 Variant 속성과 1:1 대응
 *   Figma: Type = Primary | Secondary | Outline | Ghost | Destructive | Link
 *          Size = SM | MD | LG | Icon
 * Figma 기준 보정: 모서리 8px(rounded-lg), 그림자 없음, Destructive 글자색 토큰, Link 항상 밑줄
 */
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-[color,background-color,box-shadow] outline-none disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border bg-card hover:bg-muted",
        ghost: "hover:bg-muted",
        destructive: "bg-destructive text-primary-foreground hover:bg-destructive/90",
        link: "text-primary underline underline-offset-4",
      },
      size: {
        sm: "h-8 gap-1.5 px-3",
        default: "h-9 px-4 py-2",
        lg: "h-11 px-6 text-base",
        icon: "size-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  // asChild: <Button asChild><Link/></Button> 처럼 스타일만 자식에게 넘김
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
  );
}

export { Button, buttonVariants };
