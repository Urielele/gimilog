import { cn } from "cn";

const sizes = {
  sm: "size-8",
  md: "size-12",
  lg: "size-20",
} as const;

export function CircleAvatar({
  name,
  src,
  className,
}: {
  name: string | null | undefined;
  src?: string | null;
  className?: string;
}) {
  const initial = (name?.trim().charAt(0) || "?").toUpperCase();

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-[72px] shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-brown-900 bg-field text-[32px] leading-none font-bold text-ink sm:size-[112px] sm:text-[44px]",
        className
      )}
    >
      {src ? (
        <img src={src} alt="" className="size-full rounded-full object-cover" />
      ) : (
        initial
      )}
    </span>
  );
}

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
        "inline-flex shrink-0 items-center justify-center rounded-field bg-field text-base font-semibold text-ink",
        sizes[size],
        className
      )}
    >
      {initial}
    </span>
  );
}
