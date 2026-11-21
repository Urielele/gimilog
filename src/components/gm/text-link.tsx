import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "cn";

export function TextLink({ className, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        "text-xs leading-[1.5] text-brown-900 underline underline-offset-4 hover:text-brown-900-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-900",
        className
      )}
      {...props}
    />
  );
}
