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
  ArrowRight,
  Clock,
  Dices,
  Gamepad2,
  Loader2,
  RotateCcw,
  SearchX,
  SlidersHorizontal,
  Sparkles,
  Star,
} from "lucide-react";
import { GENRES, PLATFORMS } from "@/features/games/constants";
import {
  useRecommendations,
  type RecFilters,
} from "@/features/games/hooks/useRecommendations";

/* DESIGN2 tokens
   primary #FF6B00 · secondary #7C3AED · tertiary #2563EB
   surface #F8FAFC · accent #FFC107 · neutral #FFFFFF
   radius: sm 12px · md 24px · lg 36px                            */

const INK = "#171525";
const MUTED = "#64748B";
const BORDER = "rgba(23, 21, 37, 0.08)";
const CARD_SHADOW = "0 2px 12px rgba(0, 0, 0, 0.06)";

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
      <label
        htmlFor={id}
        className="text-[0.8125rem] font-medium tracking-[0.02em]"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="mt-2 h-11 w-full cursor-pointer rounded-[12px] border bg-white px-3 text-[0.875rem] outline-none transition-shadow duration-200 focus:ring-2 focus:ring-[#FF6B00] focus:ring-offset-2"
        style={{ borderColor: "#E2E8F0", color: INK }}
      >
        {children}
      </select>
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

  const genreLabel = GENRES.find((genre) => genre.value === applied?.genre)?.label;
  const platformLabel = PLATFORMS.find(
    (platform) => platform.value === applied?.platform
  )?.label;

  const filterChips = applied
    ? [
        genreLabel ?? "All genres",
        platformLabel ?? "All platforms",
        applied.minRating ? `Rating ${applied.minRating}+` : "Any rating",
        applied.maxHours ? `Up to ${applied.maxHours} hours` : "Any length",
      ]
    : [];

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
    <main className="min-h-[100dvh] bg-[#F8FAFC]" style={{ color: INK }}>
      <div className="mx-auto w-full max-w-[1280px] px-6 py-12 md:py-16">
        <header className="max-w-[760px]">
          <span
            className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-[0.75rem] font-medium tracking-[0.02em]"
            style={{ borderColor: BORDER, color: "#7C3AED" }}
          >
            <Sparkles className="size-3.5" />
            Recommendation
          </span>

          <h1 className="mt-5 text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.05] tracking-[-0.03em]">
            Not sure what to{" "}
            <span className="bg-gradient-to-r from-[#FF6B00] via-[#F43F8E] to-[#7C3AED] bg-clip-text text-transparent">
              play next?
            </span>
          </h1>

          <p
            className="mt-4 max-w-[620px] text-[1rem] leading-[1.7]"
            style={{ color: MUTED }}
          >
            Pick a genre, a platform, and how much time you have. We will find
            games that fit — or let us surprise you.
          </p>
        </header>

        <div className="mt-10 grid items-start gap-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-8">
          <aside
            className="rounded-[24px] border bg-white p-6 lg:sticky lg:top-24"
            style={{ borderColor: BORDER, boxShadow: CARD_SHADOW }}
          >
            <div className="flex items-center gap-2">
              <span
                className="flex size-9 items-center justify-center rounded-[12px]"
                style={{
                  backgroundColor: "rgba(124, 58, 237, 0.10)",
                  color: "#7C3AED",
                }}
              >
                <SlidersHorizontal className="size-[18px]" />
              </span>
              <div>
                <h2 className="text-[1.0625rem] font-semibold">Filters</h2>
                <p className="text-[0.75rem]" style={{ color: MUTED }}>
                  Set your mood and time budget.
                </p>
              </div>
            </div>

            <form onSubmit={submit} className="mt-5 flex flex-col gap-4">
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

              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="submit"
                  disabled={isFetching}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-[12px] bg-[#FF6B00] px-4 text-[0.875rem] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#E66000] hover:shadow-[0_6px_16px_rgba(255,107,0,0.28)] disabled:pointer-events-none disabled:opacity-60"
                >
                  {isFetching ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Sparkles className="size-4" />
                  )}
                  {isFetching ? "Finding games..." : "Find my game"}
                </button>

                <button
                  type="button"
                  onClick={surpriseMe}
                  disabled={!results.length || isFetching}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-[12px] border bg-white px-4 text-[0.875rem] font-semibold transition-colors duration-200 hover:border-[#7C3AED] hover:text-[#7C3AED] disabled:pointer-events-none disabled:opacity-55"
                  style={{ borderColor: BORDER, color: INK }}
                >
                  <Dices className="size-4" />
                  Surprise me
                </button>
              </div>

              {applied && (
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center justify-center gap-2 text-[0.8125rem] font-medium underline-offset-4 transition-colors hover:text-[#FF6B00] hover:underline"
                  style={{ color: MUTED }}
                >
                  <RotateCcw className="size-3.5" />
                  Reset filters
                </button>
              )}
            </form>

            <div
              className="mt-5 rounded-[12px] px-3 py-2.5 text-[0.75rem] leading-[1.6]"
              style={{ backgroundColor: "#F8FAFC", color: MUTED }}
            >
              <p className="flex items-center gap-1.5 font-medium">
                <Clock className="size-3.5" />
                Playtime is an estimate
              </p>
              <p className="mt-1">
                Games without duration data are hidden when a time limit is set.
              </p>
            </div>
          </aside>

          <section aria-live="polite" className="min-w-0">
            {!applied && (
              <div
                className="flex flex-col items-center rounded-[24px] border bg-white px-6 py-14 text-center"
                style={{ borderColor: BORDER, boxShadow: CARD_SHADOW }}
              >
                <div
                  className="flex size-16 items-center justify-center rounded-[24px]"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,107,0,0.12), rgba(124,58,237,0.12))",
                  }}
                >
                  <Dices className="size-7" style={{ color: "#FF6B00" }} />
                </div>
                <h2 className="mt-5 text-[1.5rem] font-semibold tracking-[-0.01em]">
                  Your next game is a few clicks away
                </h2>
                <p
                  className="mt-2 max-w-[460px] text-[0.95rem] leading-[1.7]"
                  style={{ color: MUTED }}
                >
                  Choose any filters you care about, then press{" "}
                  <span className="font-medium" style={{ color: INK }}>
                    Find my game
                  </span>
                  . Not picky? Leave everything blank for popular picks.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {["Genre", "Platform", "Rating", "Playtime"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border bg-white px-3 py-1.5 text-[0.75rem] font-medium"
                      style={{ borderColor: BORDER, color: MUTED }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {isLoading && (
              <div>
                <div className="flex items-center gap-2">
                  <Loader2
                    className="size-4 animate-spin"
                    style={{ color: "#FF6B00" }}
                  />
                  <p className="text-[0.875rem] font-medium" style={{ color: MUTED }}>
                    Finding games that fit...
                  </p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="animate-pulse overflow-hidden rounded-[16px] border bg-white"
                      style={{ borderColor: BORDER }}
                    >
                      <div
                        className="aspect-[3/4] w-full"
                        style={{ backgroundColor: "#EEF1F7" }}
                      />
                      <div className="space-y-2 p-3.5">
                        <div
                          className="h-4 w-4/5 rounded-[6px]"
                          style={{ backgroundColor: "#EEF1F7" }}
                        />
                        <div
                          className="h-3 w-1/2 rounded-[6px]"
                          style={{ backgroundColor: "#EEF1F7" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isError && (
              <div
                className="flex flex-col items-center rounded-[24px] border bg-white px-6 py-14 text-center"
                style={{ borderColor: BORDER, boxShadow: CARD_SHADOW }}
              >
                <div
                  className="flex size-16 items-center justify-center rounded-[24px]"
                  style={{ backgroundColor: "rgba(220, 38, 38, 0.10)" }}
                >
                  <SearchX className="size-7" style={{ color: "#DC2626" }} />
                </div>
                <h2 className="mt-5 text-[1.5rem] font-semibold tracking-[-0.01em]">
                  Could not load recommendations
                </h2>
                <p
                  className="mt-2 max-w-[420px] text-[0.95rem] leading-[1.7]"
                  style={{ color: MUTED }}
                >
                  Something went wrong while contacting the game catalog. Give
                  it another try.
                </p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="mt-6 inline-flex h-10 items-center gap-2 rounded-[12px] border px-4 text-[0.875rem] font-semibold transition-colors duration-200 hover:bg-[#FFF4EC]"
                  style={{
                    borderColor: "#FF6B00",
                    color: "#FF6B00",
                    borderWidth: 1.5,
                  }}
                >
                  <RotateCcw className="size-4" />
                  Try again
                </button>
              </div>
            )}

            {applied && !isLoading && !isError && results.length === 0 && (
              <div
                className="flex flex-col items-center rounded-[24px] border bg-white px-6 py-14 text-center"
                style={{ borderColor: BORDER, boxShadow: CARD_SHADOW }}
              >
                <div
                  className="flex size-16 items-center justify-center rounded-[24px]"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(124,58,237,0.12))",
                  }}
                >
                  <SearchX className="size-7" style={{ color: "#2563EB" }} />
                </div>
                <h2 className="mt-5 text-[1.5rem] font-semibold tracking-[-0.01em]">
                  No games match those filters
                </h2>
                <p
                  className="mt-2 max-w-[460px] text-[0.95rem] leading-[1.7]"
                  style={{ color: MUTED }}
                >
                  Try loosening the rating, removing the time limit, or picking
                  another platform. Some games also do not report playtime.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex h-10 items-center gap-2 rounded-[12px] bg-[#FF6B00] px-4 text-[0.875rem] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#E66000] hover:shadow-[0_6px_16px_rgba(255,107,0,0.28)]"
                  >
                    <RotateCcw className="size-4" />
                    Reset filters
                  </button>
                  <Link
                    href="/search"
                    className="inline-flex h-10 items-center gap-2 rounded-[12px] border bg-white px-4 text-[0.875rem] font-semibold transition-colors duration-200 hover:border-[#FF6B00] hover:text-[#FF6B00]"
                    style={{ borderColor: BORDER }}
                  >
                    Browse all games
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            )}

            {applied && !isLoading && !isError && results.length > 0 && (
              <>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-[1.25rem] font-semibold tracking-[-0.01em]">
                      {results.length} games match
                    </h2>
                    <p className="mt-1 text-[0.8125rem]" style={{ color: MUTED }}>
                      Ordered by popularity. Tighten the filters for a shorter
                      list.
                    </p>
                  </div>
                  <span
                    className="rounded-full px-3 py-1 text-[0.75rem] font-medium"
                    style={{
                      backgroundColor: "rgba(255, 107, 0, 0.10)",
                      color: "#FF6B00",
                    }}
                  >
                    {isFetching ? "Updating..." : "Ready to play"}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {filterChips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border bg-white px-3 py-1 text-[0.75rem] font-medium"
                      style={{ borderColor: BORDER, color: MUTED }}
                    >
                      {chip}
                    </span>
                  ))}
                </div>

                <ul className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">
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
                      <li
                        key={game.slug}
                        className="group overflow-hidden rounded-[16px] border bg-white transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.10)]"
                        style={{ borderColor: BORDER, boxShadow: CARD_SHADOW }}
                      >
                        <Link href={`/games/${game.slug}`} className="block">
                          <div className="relative">
                            {game.cover_url ? (
                              <img
                                src={game.cover_url}
                                alt={game.title}
                                loading="lazy"
                                className="aspect-[3/4] w-full object-cover"
                              />
                            ) : (
                              <div
                                className="flex aspect-[3/4] w-full items-center justify-center"
                                style={{
                                  background:
                                    "linear-gradient(135deg, #FFE9D6, #EDE4FE)",
                                }}
                              >
                                <Gamepad2
                                  className="size-9"
                                  style={{ color: "#FF6B00" }}
                                />
                              </div>
                            )}

                            {rating && (
                              <span
                                className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[0.6875rem] font-semibold text-white backdrop-blur"
                                style={{ backgroundColor: "rgba(23, 21, 37, 0.72)" }}
                              >
                                <Star
                                  className="size-3"
                                  style={{ fill: "#FFC107", color: "#FFC107" }}
                                />
                                {rating}
                              </span>
                            )}
                          </div>

                          <div className="p-3.5">
                            <p className="line-clamp-2 text-[0.9rem] font-semibold leading-snug transition-colors group-hover:text-[#FF6B00]">
                              {game.title}
                            </p>
                            <div
                              className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.75rem]"
                              style={{ color: MUTED }}
                            >
                              {rating ? (
                                <span className="inline-flex items-center gap-1">
                                  <Star
                                    className="size-3"
                                    style={{ color: "#FF6B00" }}
                                  />
                                  {rating}/5
                                </span>
                              ) : (
                                <span>Not rated yet</span>
                              )}
                              {playtime && (
                                <span className="inline-flex items-center gap-1">
                                  <Clock className="size-3" />
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
      </div>
    </main>
  );
}
