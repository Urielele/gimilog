"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpDown, ChevronDown, Search } from "lucide-react";
import { cn } from "cn";
import { TextLink } from "@/components/gm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CollectionGame } from "../lib/queries";
import { GameCover } from "./GameCover";

type Status = "playing" | "finished" | "wishlist";
type Sort = "added" | "title" | "rating" | "release";
type Display = "covers" | "titles";

const STATUS_CHIPS: { value: Status; label: string }[] = [
  { value: "playing", label: "Playing" },
  { value: "finished", label: "Finished" },
  { value: "wishlist", label: "Wishlist" },
];

const SORT_LABEL: Record<Sort, string> = {
  added: "When Added",
  title: "Title A–Z",
  rating: "My Rating",
  release: "Release Date",
};

const DISPLAY_LABEL: Record<Display, string> = {
  covers: "Covers",
  "titles": "Covers + titles",
};

function parseStatus(value: string | null): Status | null {
  return value === "playing" || value === "finished" || value === "wishlist"
    ? value
    : null;
}

function parseSort(value: string | null): Sort {
  return value === "title" || value === "rating" || value === "release"
    ? value
    : "added";
}

function parseDisplay(value: string | null): Display {
  return value === "titles" ? "titles" : "covers";
}

export function GamesCollection({ games }: { games: CollectionGame[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");

  const status = parseStatus(searchParams.get("status"));
  const sort = parseSort(searchParams.get("sort"));
  const display = parseDisplay(searchParams.get("display"));

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(searchParams.toString());
    if (value === null) next.delete(key);
    else next.set(key, value);
    const search = next.toString();
    router.replace(search ? `${pathname}?${search}` : pathname, {
      scroll: false,
    });
  }

  const visibleGames = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    const filtered = games.filter((game) => {
      const matchesStatus = !status || game.status === status;
      const matchesQuery =
        !needle || game.title.toLocaleLowerCase().includes(needle);
      return matchesStatus && matchesQuery;
    });

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "title":
          return a.title.localeCompare(b.title);
        case "rating":
          return (
            (b.rating ?? -1) - (a.rating ?? -1) || a.title.localeCompare(b.title)
          );
        case "release":
          return (
            (b.release_year ?? "").localeCompare(a.release_year ?? "") ||
            a.title.localeCompare(b.title)
          );
        default:
          return (
            (b.addedAt ?? "").localeCompare(a.addedAt ?? "") ||
            a.title.localeCompare(b.title)
          );
      }
    });
  }, [games, query, sort, status]);

  const triggerClass =
    "inline-flex h-10 shrink-0 items-center gap-2 rounded-button border border-hairline bg-surface-input px-3 text-[16px] leading-none font-semibold text-brown-900 shadow-search transition-colors duration-150 hover:border-brown-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-900";

  const itemClass =
    "flex cursor-default items-center py-1.5 pr-8 pl-2 text-[16px] text-brown-900 focus:bg-primary-tint";

  return (
    <section>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-[16px] leading-[1.4] text-text-soft">
          Showing {visibleGames.length} game{visibleGames.length === 1 ? "" : "s"}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-[320px]">
            <label htmlFor="games-search" className="sr-only">
              Search your games
            </label>
            <Search
              className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-placeholder-search"
              aria-hidden="true"
            />
            <input
              id="games-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search your games..."
              className="h-10 w-full rounded-button border border-hairline bg-surface-input pr-3 pl-11 text-[16px] text-ink outline-none placeholder:text-placeholder-search focus-visible:border-brown-900"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by status">
            {STATUS_CHIPS.map((chip) => {
              const active = status === chip.value;
              return (
                <button
                  key={chip.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setParam("status", active ? null : chip.value)}
                  className={cn(
                    "h-10 rounded-button border px-3 text-[14px] leading-none font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-900",
                    active
                      ? "border-brown-900 bg-brown-900 text-on-brown shadow-button"
                      : "border-hairline bg-surface-input text-brown-900 hover:border-brown-900"
                  )}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className={triggerClass} aria-label="Display">
              {DISPLAY_LABEL[display]}
              <ChevronDown className="size-4" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-button border-brown-900 bg-surface-input">
              <DropdownMenuRadioGroup
                value={display}
                onValueChange={(value) =>
                  setParam("display", value === "covers" ? null : value)
                }
              >
                <DropdownMenuRadioItem value="covers" className={itemClass}>
                  Covers
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="titles" className={itemClass}>
                  Covers + titles
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className={triggerClass} aria-label="Sort by">
              <span className="text-[14px] font-normal text-text-soft">
                Sort by
              </span>
              <ArrowUpDown className="size-4 text-text-soft" aria-hidden="true" />
              {SORT_LABEL[sort]}
              <ChevronDown className="size-4" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-button border-brown-900 bg-surface-input">
              <DropdownMenuRadioGroup
                value={sort}
                onValueChange={(value) =>
                  setParam("sort", value === "added" ? null : value)
                }
              >
                {(Object.keys(SORT_LABEL) as Sort[]).map((value) => (
                  <DropdownMenuRadioItem
                    key={value}
                    value={value}
                    className={itemClass}
                  >
                    {SORT_LABEL[value]}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {games.length === 0 ? (
        <p className="mt-10 text-[16px] leading-[1.4] text-text-soft">
          No games yet. <TextLink href="/search">Find a game</TextLink>
        </p>
      ) : visibleGames.length === 0 ? (
        <div className="mt-10 text-[16px] leading-[1.4] text-text-soft">
          <p>
            {query.trim()
              ? `No games match “${query.trim()}”.`
              : `No games in ${status} yet.`}
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setParam("status", null);
            }}
            className="mt-2 text-[14px] font-semibold text-brown-900 underline underline-offset-4 hover:text-brown-900-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-900"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(124px,1fr))] gap-3 max-sm:grid-cols-[repeat(auto-fill,minmax(104px,1fr))]">
          {visibleGames.map((game) => (
            <li key={`${game.slug}-${game.status}`} className="min-w-0">
              <GameCover
                game={game}
                title={`${game.title}${game.release_year ? ` (${game.release_year})` : ""}`}
              />
              {display === "titles" && (
                <Link
                  href={`/games/${game.slug}`}
                  className="mt-2 line-clamp-2 text-[14px] leading-[1.3] font-semibold text-ink hover:text-brown-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-900"
                >
                  {game.title}
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
