import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { statusMeta, type LogStatus } from "@/theme/tokens";

export const badgeStyles = cva(
  "inline-flex items-center gap-1 rounded-none px-2 py-1 text-xs leading-[1.5] [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      tone: {
        neutral: "bg-surface text-muted",
        primary: "bg-primary-tint text-primary-text",
        secondary: "bg-wishlist-tint text-wishlist",
        tertiary: "bg-info-tint text-info",
        accent: "bg-rating-tint text-rating-text",
        error: "bg-error-tint text-error-text",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  }
);

type BadgeProps = ComponentProps<"span"> & VariantProps<typeof badgeStyles>;

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeStyles({ tone }), className)} {...props} />;
}

export function StatusBadge({
  status,
  className,
  ...props
}: Omit<BadgeProps, "tone"> & { status: LogStatus }) {
  const tone =
    status === "wishlist"
      ? "secondary"
      : status === "playing"
        ? "accent"
        : "tertiary";

  return (
    <Badge tone={tone} className={className} {...props}>
      {statusMeta[status].label}
    </Badge>
  );
}
