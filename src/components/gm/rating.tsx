import { Star } from "lucide-react";
import { cn } from "cn";

export function RatingValue({
  value,
  className,
}: {
  value: number | string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs leading-[1.5] font-semibold text-ink",
        className
      )}
    >
      <Star className="size-3.5 fill-star-fill text-brown-900" aria-hidden="true" />
      {value}/5
    </span>
  );
}

export function Stars({
  value,
  size = "sm",
  className,
}: {
  value: number;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          aria-hidden="true"
          className={cn(
            size === "md" ? "size-4" : "size-3.5",
            star <= value
              ? "fill-star-fill text-brown-900"
              : "text-star-empty"
          )}
        />
      ))}
    </span>
  );
}
