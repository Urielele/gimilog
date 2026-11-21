"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { FormEvent } from "react";
import { cn } from "cn";

export function SearchBar({
  defaultValue = "",
  className,
  id = "game-search",
}: {
  defaultValue?: string;
  className?: string;
  id?: string;
}) {
  const router = useRouter();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = new FormData(event.currentTarget).get("q")?.toString().trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  return (
    <form onSubmit={onSubmit} className={cn("relative w-full", className)}>
      <label htmlFor={id} className="sr-only">
        Search games
      </label>
      <Search
        className="pointer-events-none absolute top-1/2 left-5 size-6 -translate-y-1/2 text-placeholder-search"
        aria-hidden="true"
      />
      <input
        id={id}
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder="Search ..."
        aria-label="Search games"
        className="h-[60px] w-full rounded-search border-2 border-[#6B4E3D] bg-surface-input pr-4 pl-[68px] text-[20px] leading-none text-ink shadow-search outline-none transition-colors duration-150 placeholder:text-placeholder-search focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-900"
      />
    </form>
  );
}
