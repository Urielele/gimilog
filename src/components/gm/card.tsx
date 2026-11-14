import type { ComponentProps } from "react";
import { cn } from "cn";

export const cardClass =
  "border border-hairline-soft bg-canvas p-4";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(cardClass, className)} {...props} />;
}
