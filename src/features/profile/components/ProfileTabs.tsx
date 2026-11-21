"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";

const TABS = [
  { key: "profile", label: "Profile", suffix: "" },
  { key: "reviews", label: "Reviews", suffix: "/reviews" },
  { key: "games", label: "Games", suffix: "/games" },
] as const;

export function ProfileTabs({ username }: { username: string }) {
  const pathname = usePathname();
  const base = `/u/${username}`;

  return (
    <nav
      aria-label="Profile sections"
      className="mt-10 flex h-[52px] items-stretch overflow-x-auto rounded-cover bg-nav/40 pl-4 md:pl-[144px]"
    >
      {TABS.map((tab) => {
        const href = `${base}${tab.suffix}`;
        const isActive =
          tab.key === "profile" ? pathname === base : pathname === href;

        return (
          <Link
            key={tab.key}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative flex shrink-0 items-center px-6 text-[14px] leading-none whitespace-nowrap text-brown-900 transition-colors duration-150 hover:text-brown-900-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-900",
              isActive ? "font-bold after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-brown-900" : "font-medium"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
