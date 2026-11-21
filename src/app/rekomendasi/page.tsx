"use client";

import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Clock,
  Gamepad2,
  Loader2,
  RotateCcw,
  Star,
} from "lucide-react";
import { GENRES, PLATFORMS } from "@/features/games/constants";
import {
  useRecommendations,
  type RecFilters,
} from "@/features/games/hooks/useRecommendations";
import {
  Button,
  Card,
  Container,
  Label,
  PageShell,
  SectionHeading,
  Select,
  Skeleton,
  cardClass,
} from "@/components/gm";

const EMPTY: RecFilters = {
  genre: "",
  platform: "",
  minRating: "",
  maxHours: "",
};

const RATING_OPTIONS = [
  { value: "3", label: "3.0 and up" },
  { value: "3.5", label: "3.5 and up" },
  { value: "4", label: "4.0 and up" },
  { value: "4.5", label: "4.5 and up" },
] as const;

const HOURS_OPTIONS = [
  { value: "10", label: "Up to 10 hours" },
  { value: "20", label: "Up to 20 hours" },
  { value: "40", label: "Up to 40 hours" },
  { value: "60", label: "Up to 60 hours" },
] as const;

const inlineActionClass =
  "text-primary-text underline underline-offset-4 hover:text-primary disabled:pointer-events-none disabled:opacity-50";

function FilterSelect({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  children: ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Select id={id} value={value} onChange={onChange} className="mt-2">
        {children}
      </Select>
    </div>
  );
}

export default function RecommendationsPage() {
  const router = useRouter();
  const [form, setForm] = useState<RecFilters>(EMPTY);
  const [applied, setApplied] = useState<RecFilters | null>(null);

  const { data, isLoading, isFetching, isError, refetch } =
    useRecommendations(applied);

  const results = data ?? [];

  function update(key: keyof RecFilters, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setApplied({ ...form });
  }

  function reset() {
    setForm(EMPTY);
    setApplied(null);
  }

  function surpriseMe() {
    if (!results.length) return;
    const pick = results[Math.floor(Math.random() * results.length)];
    router.push(`/games/${pick.slug}`);
  }

  return (
    <PageShell>
      <Container className="py-12">
        <header className="max-w-[640px]">
          <h1 className="text-display font-semibold text-ink">
            Recommendations
          </h1>

          {/* <p className="mt-4 text-base leading-[1.5] text-muted">
            Filter by genre, platform, rating, or playtime.
          </p> */}
        </header>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24">
            <Card className="p-6">
              <h2 className="text-base leading-[1.5] font-semibold text-ink">
                Filters
              </h2>

              <form onSubmit={submit} className="mt-4 flex flex-col gap-4">
                <FilterSelect
                  id="genre"
                  label="Genre"
                  value={form.genre}
                  onChange={(event) => update("genre", event.target.value)}
                >
                  <option value="">All genres</option>
                  {GENRES.map((genre) => (
                    <option key={genre.value} value={genre.value}>
                      {genre.label}
                    </option>
                  ))}
                </FilterSelect>

                <FilterSelect
                  id="platform"
                  label="Platform"
                  value={form.platform}
                  onChange={(event) => update("platform", event.target.value)}
                >
                  <option value="">All platforms</option>
                  {PLATFORMS.map((platform) => (
                    <option key={platform.value} value={platform.value}>
                      {platform.label}
                    </option>
                  ))}
                </FilterSelect>

                <FilterSelect
                  id="minRating"
                  label="Minimum rating"
                  value={form.minRating}
                  onChange={(event) => update("minRating", event.target.value)}
                >
                  <option value="">Any rating</option>
                  {RATING_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </FilterSelect>

                <FilterSelect
                  id="maxHours"
                  label="Time to finish"
                  value={form.maxHours}
                  onChange={(event) => update("maxHours", event.target.value)}
                >
                  <option value="">Any length</option>
                  {HOURS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </FilterSelect>

                <div className="flex flex-col gap-2">
                  <Button
                    type="submit"
                    disabled={isFetching}
                    className="w-full"
                  >
                    {isFetching && (
                      <Loader2
                        className="size-4 animate-spin"
                        aria-hidden="true"
                      />
                    )}
                    {isFetching ? "Finding games..." : "Find my game"}
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={surpriseMe}
                    disabled={!results.length || isFetching}
                    className="w-full"
                  >
                    Surprise me
                  </Button>
                </div>

                {applied && (
                  <Button
                    variant="ghost"
                    onClick={reset}
                    className="w-full"
                  >
                    <RotateCcw aria-hidden="true" />
                    Reset filters
                  </Button>
                )}
              </form>

              <p className="mt-4 text-xs leading-[1.5] text-muted">
                Playtime is an estimate; games without duration data are hidden
                when a time limit is set.
              </p>
            </Card>
          </aside>

          <section aria-live="polite" className="min-w-0">
            {!applied && (
              <p className="text-base leading-[1.5] text-muted">
                Set filters and press Find my game.{" "}
                <Link href="/search" className={inlineActionClass}>
                  Browse all games
                </Link>
              </p>
            )}

            {isLoading && (
              <div>
                <div className="flex items-center gap-2">
                  <Loader2
                    className="size-4 animate-spin text-ink"
                    aria-hidden="true"
                  />
                  <p className="text-xs font-semibold text-muted">
                    Finding games...
                  </p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index} className="overflow-hidden p-0">
                      <Skeleton className="aspect-[3/4] w-full" />
                      <div className="space-y-2 p-4">
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {isError && (
              <p className="text-base leading-[1.5] text-muted">
                Could not load recommendations.{" "}
                <button
                  type="button"
                  onClick={() => refetch()}
                  className={inlineActionClass}
                >
                  Try again
                </button>
              </p>
            )}

            {applied && !isLoading && !isError && results.length === 0 && (
              <p className="text-base leading-[1.5] text-muted">
                No games match those filters.{" "}
                <button
                  type="button"
                  onClick={reset}
                  className={inlineActionClass}
                >
                  Reset filters
                </button>
              </p>
            )}

            {applied && !isLoading && !isError && results.length > 0 && (
              <>
                <SectionHeading>
                  {results.length} games match
                </SectionHeading>
                <p className="mt-1 text-xs text-muted">
                  Ordered by popularity.
                </p>

                <ul className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
                  {results.map((game) => {
                    const rating =
                      typeof game.rating === "number" && game.rating > 0
                        ? game.rating.toFixed(1)
                        : null;
                    const playtime =
                      typeof game.playtime === "number" && game.playtime > 0
                        ? game.playtime
                        : null;

                    return (
                      <li key={game.slug} className={`${cardClass} p-0`}>
                        <Link href={`/games/${game.slug}`} className="group block">
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
                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                              {rating ? (
                                <span className="inline-flex items-center gap-1">
                                  <Star
                                    className="size-3 fill-rating text-rating"
                                    aria-hidden="true"
                                  />
                                  {rating}/5
                                </span>
                              ) : (
                                <span>Not rated yet</span>
                              )}
                              {playtime && (
                                <span className="inline-flex items-center gap-1">
                                  <Clock className="size-3" aria-hidden="true" />
                                  ±{playtime} hrs
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </section>
        </div>
      </Container>
    </PageShell>
  );
}
