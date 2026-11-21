import type { ComponentProps } from "react";
import { cn } from "cn";

export const cardClass =
  "rounded-cover border border-hairline-soft bg-surface p-4";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(cardClass, className)} {...props} />;
}
