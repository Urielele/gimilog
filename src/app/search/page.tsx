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

const stateTextClass =
  "font-about text-[12px] leading-[1.2] text-text-soft md:text-[clamp(16px,2vw,22px)] md:leading-[1.4]";

const resultGridClass =
  "grid grid-cols-[108px_1fr] gap-4 border-b-2 border-divider py-4 md:grid-cols-[209px_1fr] md:gap-8 md:py-8";

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
          className={resultGridClass}
        >
          <div className="aspect-[3/4] w-[108px] animate-pulse rounded-cover bg-field md:w-[209px]" />
          <div className="flex flex-col gap-2 pt-0 md:gap-4 md:pt-2">
            <div className="h-4 w-2/3 animate-pulse rounded-cover bg-field md:h-9" />
            <div className="h-3 w-1/3 animate-pulse rounded-cover bg-field md:h-6" />
            <div className="h-3 w-full animate-pulse rounded-cover bg-field md:h-5" />
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
      <p className={stateTextClass}>
        Type a title to start searching.
      </p>
    );
  }

  if (trimmed.length < 2) {
    return (
      <p className={stateTextClass}>
        Type at least 2 characters.
      </p>
    );
  }

  if (isLoading) return <ResultSkeletons />;

  if (isError) {
    return (
      <p className={stateTextClass}>
        Could not load results.{" "}
        <button type="button" className={inlineActionClass} onClick={() => refetch()}>
          Try again
        </button>
      </p>
    );
  }

  if (results.length === 0) {
    return (
      <p className={stateTextClass}>
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
            className={resultGridClass}
          >
            <Link
              href={`/games/${game.slug}`}
              className="block w-[108px] rounded-cover shadow-cover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-900 md:w-[209px]"
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
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 md:gap-x-4">
                <Link
                  href={`/games/${game.slug}`}
                  className="break-words text-[16px] leading-[1.2] font-bold text-ink transition-colors duration-150 hover:text-brown-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-900 md:text-[clamp(24px,3.5vw,40px)] md:leading-[1.1]"
                >
                  {game.title}
                </Link>
                {year && (
                  <span className="text-[10px] font-normal text-text-soft md:text-[0.65em]">
                    {year}
                  </span>
                )}
              </div>

              {developer && (
                <p className="mt-0.5 text-[13px] leading-[1.2] text-ink lowercase md:mt-1 md:text-[clamp(20px,2.4vw,26px)]">
                  {developer.toLowerCase()}
                </p>
              )}

              {summary && (
                <ExpandableText
                  lines={3}
                  moreLabel="...more"
                  lessLabel="less"
                  className="mt-2 [&_button]:text-[12px] [&_button]:leading-[1.2] [&_p]:text-[12px] [&_p]:leading-[1.2] md:mt-4 md:[&_button]:text-[clamp(16px,2vw,22px)] md:[&_button]:leading-[1.4] md:[&_p]:text-[clamp(16px,2vw,22px)] md:[&_p]:leading-[1.4]"
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

      <h1 className="sr-only font-about text-[clamp(24px,3vw,32px)] leading-[1.2] text-ink lowercase md:not-sr-only md:mt-8">
        showing matches for “{q}”
      </h1>
      <div className="mt-8 h-0.5 w-full bg-divider md:mt-4" />

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
