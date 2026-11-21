"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { cn } from "cn";

export function NavLink({ href, className, ...props }: ComponentProps<typeof Link>) {
  const pathname = usePathname();
  const target = typeof href === "string" ? href : "";
  const active =
    target === "/"
      ? pathname === "/"
      : target.startsWith("/u/")
        ? pathname.startsWith("/u/")
        : pathname === target;

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "shrink-0 border-b-2 border-transparent text-base leading-[1.2] font-medium text-ink transition-colors duration-150 hover:text-brown-900 md:text-xl lg:text-2xl",
        active && "border-brown-900",
        className
      )}
      {...props}
    />
  );
}
