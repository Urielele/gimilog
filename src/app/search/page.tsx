"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Gamepad2 } from "lucide-react";
import { useGameSearch } from "@/features/games/hooks/useGameSearch";
import {
  Container,
  ExpandableText,
  PageShell,
  SearchBar,
  TextLink,
} from "@/components/gm";

const inlineActionClass =
  "rounded-button px-1 py-1 text-base text-brown-900 underline underline-offset-4 transition-colors duration-150 hover:text-brown-900-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-900";

function getYear(value: string | null) {
  if (!value) return null;
  const year = value.slice(0, 4);
  return /^\d{4}$/.test(year) ? year : null;
}

function ResultSkeletons() {
  return (
    <div className="flex flex-col" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-[110px_1fr] gap-8 border-b-2 border-divider py-8 sm:grid-cols-[209px_1fr]"
        >
          <div className="aspect-[3/4] w-[110px] animate-pulse rounded-cover bg-field sm:w-[209px]" />
          <div className="flex flex-col gap-4 pt-2">
            <div className="h-9 w-2/3 animate-pulse rounded-cover bg-field" />
            <div className="h-6 w-1/3 animate-pulse rounded-cover bg-field" />
            <div className="h-5 w-full animate-pulse rounded-cover bg-field" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SearchResults({ q }: { q: string }) {
  const router = useRouter();
  const trimmed = q.trim();
  const { data, isLoading, isError, refetch } = useGameSearch(trimmed);
  const results = Array.isArray(data) ? data : [];

  if (!trimmed) {
    return (
      <p className="font-about text-[clamp(16px,2vw,22px)] text-text-soft">
        Type a title to start searching.
      </p>
    );
  }

  if (trimmed.length < 2) {
    return (
      <p className="font-about text-[clamp(16px,2vw,22px)] text-text-soft">
        Type at least 2 characters.
      </p>
    );
  }

  if (isLoading) return <ResultSkeletons />;

  if (isError) {
    return (
      <p className="font-about text-[clamp(16px,2vw,22px)] text-text-soft">
        Could not load results.{" "}
        <button type="button" className={inlineActionClass} onClick={() => refetch()}>
          Try again
        </button>
      </p>
    );
  }

  if (results.length === 0) {
    return (
      <p className="font-about text-[clamp(16px,2vw,22px)] text-text-soft">
        No results for “{trimmed}”.{" "}
        <button
          type="button"
          className={inlineActionClass}
          onClick={() => router.push("/search")}
        >
          Clear search
        </button>
      </p>
    );
  }

  return (
    <ul className="flex flex-col">
      {results.map((game) => {
        const year = getYear(game.release_date);
        const developer = game.developer?.trim();
        const summary = game.summary?.trim();

        return (
          <li
            key={game.slug}
            className="grid grid-cols-[110px_1fr] gap-8 border-b-2 border-divider py-8 sm:grid-cols-[209px_1fr]"
          >
            <Link
              href={`/games/${game.slug}`}
              className="block w-[110px] rounded-cover shadow-cover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-900 sm:w-[209px]"
            >
              {game.cover_url ? (
                <img
                  src={game.cover_url}
                  alt={game.title}
                  loading="lazy"
                  className="aspect-[3/4] w-full rounded-cover object-cover"
                />
              ) : (
                <span className="flex aspect-[3/4] w-full items-center justify-center rounded-cover bg-field">
                  <Gamepad2 className="size-8 text-text-soft" aria-hidden="true" />
                </span>
              )}
            </Link>

            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <Link
                  href={`/games/${game.slug}`}
                  className="break-words text-[clamp(24px,3.5vw,40px)] leading-[1.1] font-bold text-ink transition-colors duration-150 hover:text-brown-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-900"
                >
                  {game.title}
                </Link>
                {year && (
                  <span className="text-[0.65em] font-normal text-text-soft">
                    {year}
                  </span>
                )}
              </div>

              {developer && (
                <p className="mt-1 text-[clamp(20px,2.4vw,26px)] leading-[1.2] text-ink lowercase">
                  {developer.toLowerCase()}
                </p>
              )}

              {summary && (
                <ExpandableText
                  lines={3}
                  moreLabel="...more"
                  lessLabel="less"
                  className="mt-4"
                >
                  {summary}
                </ExpandableText>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function SearchView() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q")?.trim() ?? "";

  return (
    <>
      <SearchBar defaultValue={q} variant="outlined" />

      <h1 className="mt-8 font-about text-[clamp(24px,3vw,32px)] leading-[1.2] text-ink lowercase">
        showing matches for “{q}”
      </h1>
      <div className="mt-4 h-0.5 w-full bg-divider" />

      <section aria-live="polite" className="mt-2">
        <SearchResults q={q} />
      </section>

      <p className="mt-12 text-base text-text-soft">
        Game data provided by <TextLink href="https://rawg.io">RAWG</TextLink>.
      </p>
    </>
  );
}

export default function SearchPage() {
  return (
    <PageShell>
      <Container className="pt-8 pb-16">
        <Suspense
          fallback={<div className="h-[60px] w-full animate-pulse rounded-search bg-field" />}
        >
          <SearchView />
        </Suspense>
      </Container>
    </PageShell>
  );
}
