import { cn } from "cn";

const sizes = {
  sm: "size-8",
  md: "size-12",
  lg: "size-20",
} as const;

export function SquareAvatar({
  name,
  size = "sm",
  className,
}: {
  name: string | null | undefined;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const initial = (name?.trim().charAt(0) || "?").toUpperCase();

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-none bg-surface-raised text-base font-semibold text-ink",
        sizes[size],
        className
      )}
    >
      {initial}
    </span>
  );
}
