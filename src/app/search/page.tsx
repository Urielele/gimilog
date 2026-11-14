"use client";

import { useState } from "react";
import Link from "next/link";
import { Gamepad2, Search } from "lucide-react";
import { useGameSearch } from "@/features/games/hooks/useGameSearch";
import {
  Button,
  Card,
  Container,
  Input,
  Label,
  PageShell,
  SectionHeading,
  Skeleton,
  TextLink,
  cardClass,
} from "@/components/gm";

const inlineActionClass =
  "text-primary-text underline underline-offset-4 hover:text-primary";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const { data, isLoading } = useGameSearch(q);

  const trimmed = q.trim();
  const hasQuery = trimmed.length >= 2;
  const results = Array.isArray(data) ? data : [];

  const showLoading = hasQuery && isLoading;
  const showEmpty = hasQuery && !isLoading && results.length === 0;

  return (
    <PageShell>
      <Container className="py-16">
        <header className="max-w-[640px]">
          <h1 className="text-display font-semibold text-ink">Find a game</h1>

          <p className="mt-4 text-base leading-[1.5] text-muted">
            Search the RAWG catalog by title.
          </p>
        </header>

        <div className="mt-8 max-w-[640px]">
          <Label htmlFor="game-search">Search games</Label>

          <form
            className="mt-2 flex flex-col gap-2 md:flex-row"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="relative flex-1">
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                <Search className="size-4 text-placeholder" aria-hidden="true" />
              </span>
              <Input
                id="game-search"
                type="search"
                value={q}
                onChange={(event) => setQ(event.target.value)}
                placeholder="e.g. Elden Ring"
                className="h-12 pl-12"
              />
            </div>

            <Button type="submit" className="h-12">
              Search
            </Button>
          </form>

          <p className="mt-2 text-xs text-muted">
            Type at least 2 characters. Or open{" "}
            <TextLink href="/rekomendasi">Recommendations</TextLink>.
          </p>
        </div>

        <section className="mt-16" aria-live="polite">
          {showLoading && (
            <div
              className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
              aria-hidden="true"
            >
              {Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className="overflow-hidden p-0">
                  <Skeleton className="aspect-[3/4] w-full" />
                  <div className="space-y-2 p-4">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </Card>
              ))}
            </div>
          )}

          {showEmpty && (
            <p className="text-base leading-[1.5] text-muted">
              No results for “{trimmed}”.{" "}
              <button
                type="button"
                onClick={() => setQ("")}
                className={inlineActionClass}
              >
                Clear search
              </button>
            </p>
          )}

          {!showLoading && !showEmpty && results.length > 0 && (
            <>
              <SectionHeading>Results</SectionHeading>

              <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {results.map((game) => (
                  <Link
                    key={game.slug}
                    href={`/games/${game.slug}`}
                    className={`${cardClass} group block overflow-hidden p-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}
                  >
                    {game.cover_url ? (
                      <img
                        src={game.cover_url}
                        alt={game.title}
                        loading="lazy"
                        className="aspect-[3/4] w-full object-cover"
                      />
                    ) : (
                      <div className="flex aspect-[3/4] w-full items-center justify-center bg-surface-raised">
                        <Gamepad2
                          className="size-8 text-muted"
                          aria-hidden="true"
                        />
                      </div>
                    )}

                    <div className="p-4">
                      <p className="line-clamp-2 text-base leading-[1.5] font-semibold text-ink group-hover:text-primary-text">
                        {game.title}
                      </p>
                      {game.release_date && (
                        <p className="mt-2 font-mono text-xs text-muted">
                          {game.release_date}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </section>
      </Container>
    </PageShell>
  );
}
