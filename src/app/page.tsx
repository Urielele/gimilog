import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Gamepad2,
  MessageSquare,
  Search,
  Star,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

/* DESIGN2 tokens
   primary #FF6B00 · secondary #7C3AED · tertiary #2563EB
   surface #F8FAFC · accent #FFC107 · neutral #FFFFFF
   radius: sm 12px · md 24px · lg 36px                            */

const INK = "#171525";
const MUTED = "#64748B";
const BORDER = "rgba(23, 21, 37, 0.08)";
const CARD_SHADOW = "0 2px 12px rgba(0, 0, 0, 0.06)";

type GameRef = {
  slug: string | null;
  title: string | null;
  cover_url: string | null;
};

type ProfileRef = { username: string | null };

type ReviewRow = {
  id: number;
  rating: number;
  body: string | null;
  created_at: string | null;
  games: GameRef | GameRef[] | null;
  profiles: ProfileRef | ProfileRef[] | null;
};

const STEPS = [
  {
    icon: Search,
    title: "Search the catalog",
    copy: "Find any game from the RAWG catalog and open its detail page.",
    color: "#2563EB",
    background: "rgba(37, 99, 235, 0.10)",
  },
  {
    icon: Bookmark,
    title: "Build your backlog",
    copy: "Sort games into Wishlist, Playing, or Finished with one click.",
    color: "#7C3AED",
    background: "rgba(124, 58, 237, 0.10)",
  },
  {
    icon: Star,
    title: "Rate and review",
    copy: "Leave a rating and a review, then update it whenever you change your mind.",
    color: "#FF6B00",
    background: "rgba(255, 107, 0, 0.10)",
  },
];

const BACKLOG_PREVIEW = [
  {
    icon: Bookmark,
    label: "Wishlist",
    copy: "Games you want to try next",
    color: "#7C3AED",
    background: "rgba(124, 58, 237, 0.10)",
  },
  {
    icon: Gamepad2,
    label: "Playing",
    copy: "Currently in progress",
    color: "#FF6B00",
    background: "rgba(255, 107, 0, 0.10)",
  },
  {
    icon: CheckCircle2,
    label: "Finished",
    copy: "Completed and rated",
    color: "#2563EB",
    background: "rgba(37, 99, 235, 0.10)",
  },
];

function first<T>(value: T | T[] | null) {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function formatDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select(
      "id, rating, body, created_at, games(slug, title, cover_url), profiles(username)"
    )
    .order("created_at", { ascending: false })
    .limit(6);

  const reviews = (data ?? []) as unknown as ReviewRow[];

  return (
    <main className="min-h-[100dvh] bg-[#F8FAFC]" style={{ color: INK }}>
      <section
        className="relative overflow-hidden border-b"
        style={{ borderColor: BORDER }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-40 size-[480px] rounded-full opacity-70 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(255, 107, 0, 0.20), transparent 65%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-32 size-[480px] rounded-full opacity-70 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(124, 58, 237, 0.16), transparent 65%)",
          }}
        />

        <div className="relative mx-auto grid w-full max-w-[1280px] items-center gap-12 px-6 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <span
              className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-[0.75rem] font-medium tracking-[0.02em]"
              style={{ borderColor: BORDER, color: "#7C3AED" }}
            >
              <Gamepad2 className="size-3.5" />
              Your game backlog, sorted
            </span>

            <h1 className="mt-5 text-[clamp(2.5rem,5.5vw,4.25rem)] font-bold leading-[1.03] tracking-[-0.03em]">
              Track what you play.{" "}
              <span className="bg-gradient-to-r from-[#FF6B00] via-[#F43F8E] to-[#7C3AED] bg-clip-text text-transparent">
                Review what you love.
              </span>
            </h1>

            <p
              className="mt-5 max-w-[560px] text-[1.0625rem] leading-[1.75]"
              style={{ color: MUTED }}
            >
              Gimilog keeps your wishlist, current games, and finished titles in
              one place. Rate the games you play and see what everyone else
              thinks.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/search"
                className="inline-flex h-11 items-center gap-2 rounded-[12px] bg-[#FF6B00] px-5 text-[0.875rem] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#E66000] hover:shadow-[0_8px_20px_rgba(255,107,0,0.28)]"
              >
                Find a game
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex h-11 items-center gap-2 rounded-[12px] border bg-white px-5 text-[0.875rem] font-semibold transition-colors duration-200 hover:border-[#FF6B00] hover:text-[#FF6B00]"
                style={{ borderColor: BORDER }}
              >
                How it works
              </Link>
            </div>

            <p className="mt-6 text-[0.8125rem]" style={{ color: MUTED }}>
              Free to use · Game data powered by RAWG
            </p>
          </div>

          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-4 rounded-[36px] opacity-70 blur-2xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255, 107, 0, 0.18), rgba(124, 58, 237, 0.18))",
              }}
            />

            <div
              className="relative rounded-[36px] border bg-white p-6 md:p-8"
              style={{
                borderColor: BORDER,
                boxShadow: "0 18px 50px rgba(23, 21, 37, 0.10)",
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="flex size-9 items-center justify-center rounded-[12px]"
                    style={{
                      background:
                        "linear-gradient(135deg, #FF6B00, #7C3AED)",
                    }}
                  >
                    <Gamepad2 className="size-[18px] text-white" />
                  </span>
                  <span className="font-semibold">My backlog</span>
                </div>
                <span
                  className="rounded-full px-2.5 py-1 text-[0.6875rem] font-medium"
                  style={{
                    backgroundColor: "rgba(255, 107, 0, 0.10)",
                    color: "#FF6B00",
                  }}
                >
                  3 lists
                </span>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                {BACKLOG_PREVIEW.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 rounded-[16px] border bg-[#FCFCFD] p-3.5"
                      style={{ borderColor: BORDER }}
                    >
                      <span
                        className="flex size-10 items-center justify-center rounded-[12px]"
                        style={{
                          backgroundColor: item.background,
                          color: item.color,
                        }}
                      >
                        <Icon className="size-[18px]" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[0.875rem] font-semibold">
                          {item.label}
                        </p>
                        <p className="text-[0.75rem]" style={{ color: MUTED }}>
                          {item.copy}
                        </p>
                      </div>
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                  );
                })}
              </div>

              <div
                className="mt-6 flex items-center justify-between gap-3 rounded-[16px] px-4 py-3"
                style={{ backgroundColor: "#FFF7F0" }}
              >
                <span
                  className="text-[0.8125rem] font-medium"
                  style={{ color: "#9A3412" }}
                >
                  Ready when you are
                </span>
                <span
                  className="inline-flex items-center gap-1 text-[0.75rem] font-semibold"
                  style={{ color: "#FF6B00" }}
                >
                  <Star
                    className="size-3.5"
                    style={{ fill: "#FF6B00", color: "#FF6B00" }}
                  />
                  Rate your games
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="mx-auto w-full max-w-[1280px] scroll-mt-24 px-6 py-16 md:py-20"
      >
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div>
            <p
              className="text-[0.75rem] font-semibold uppercase tracking-[0.14em]"
              style={{ color: "#7C3AED" }}
            >
              How it works
            </p>
            <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.02em]">
              From discovery to done.
            </h2>
            <p
              className="mt-3 max-w-[420px] text-[0.95rem] leading-[1.7]"
              style={{ color: MUTED }}
            >
              Search a game, drop it into a list, and leave a review when you are
              ready. No spreadsheets, no clutter.
            </p>
            <Link
              href="/search"
              className="mt-6 inline-flex items-center gap-2 text-[0.875rem] font-semibold text-[#FF6B00] underline-offset-4 hover:underline"
            >
              Start with a search
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div
            className="rounded-[24px] border bg-white p-2 md:p-3"
            style={{ borderColor: BORDER, boxShadow: CARD_SHADOW }}
          >
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className={index > 0 ? "border-t" : undefined}
                  style={index > 0 ? { borderColor: BORDER } : undefined}
                >
                  <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-5 md:p-5">
                    <span
                      className="text-[0.75rem] font-bold tracking-[0.12em]"
                      style={{ color: "#94A3B8" }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="flex size-10 shrink-0 items-center justify-center rounded-[12px]"
                      style={{
                        backgroundColor: step.background,
                        color: step.color,
                      }}
                    >
                      <Icon className="size-[18px]" />
                    </span>
                    <div>
                      <p className="font-semibold">{step.title}</p>
                      <p
                        className="mt-0.5 text-[0.8125rem]"
                        style={{ color: MUTED }}
                      >
                        {step.copy}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="border-y bg-white/60"
        style={{ borderColor: BORDER }}
      >
        <div className="mx-auto w-full max-w-[1280px] px-6 py-16 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p
                className="text-[0.75rem] font-semibold uppercase tracking-[0.14em]"
                style={{ color: "#FF6B00" }}
              >
                Community
              </p>
              <h2 className="mt-2 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.02em]">
                Latest reviews
              </h2>
              <p className="mt-2 text-[0.95rem]" style={{ color: MUTED }}>
                Fresh takes from players tracking their games.
              </p>
            </div>
            <Link
              href="/search"
              className="inline-flex h-10 items-center gap-2 rounded-[12px] border bg-white px-4 text-[0.875rem] font-semibold transition-colors duration-200 hover:border-[#FF6B00] hover:text-[#FF6B00]"
              style={{ borderColor: BORDER }}
            >
              Browse games
              <ArrowRight className="size-4" />
            </Link>
          </div>

          {reviews.length ? (
            <ul className="mt-8 grid gap-4 md:grid-cols-2">
              {reviews.map((review) => {
                const game = first(review.games);
                const profile = first(review.profiles);
                const reviewDate = formatDate(review.created_at);

                return (
                  <li
                    key={review.id}
                    className="rounded-[24px] border bg-white p-5 transition-shadow duration-200 hover:shadow-[0_10px_30px_rgba(23,21,37,0.08)] md:p-6"
                    style={{ borderColor: BORDER }}
                  >
                    <div className="flex gap-4">
                      {game?.cover_url ? (
                        <img
                          src={game.cover_url}
                          alt={game.title ?? game.slug ?? "Game cover"}
                          loading="lazy"
                          className="h-[96px] w-[72px] shrink-0 rounded-[12px] border object-cover"
                          style={{ borderColor: BORDER }}
                        />
                      ) : (
                        <div
                          className="flex h-[96px] w-[72px] shrink-0 items-center justify-center rounded-[12px] border"
                          style={{
                            borderColor: BORDER,
                            background:
                              "linear-gradient(135deg, #FFE9D6, #EDE4FE)",
                          }}
                        >
                          <Gamepad2
                            className="size-6"
                            style={{ color: "#FF6B00" }}
                          />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          {game?.slug ? (
                            <Link
                              href={`/games/${game.slug}`}
                              className="text-[1.0625rem] font-semibold underline-offset-4 hover:text-[#FF6B00] hover:underline"
                            >
                              {game.title ?? game.slug}
                            </Link>
                          ) : (
                            <span className="text-[1.0625rem] font-semibold">
                              Unknown game
                            </span>
                          )}

                          <span
                            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.75rem] font-semibold"
                            style={{
                              backgroundColor: "rgba(255, 107, 0, 0.10)",
                              color: "#FF6B00",
                            }}
                          >
                            <Star
                              className="size-3"
                              style={{ fill: "#FF6B00", color: "#FF6B00" }}
                            />
                            {review.rating}/5
                          </span>
                        </div>

                        <div
                          className="mt-1 flex flex-wrap items-center gap-2 text-[0.75rem]"
                          style={{ color: MUTED }}
                        >
                          {profile?.username ? (
                            <Link
                              href={`/u/${profile.username}`}
                              className="font-medium underline-offset-4 hover:text-[#FF6B00] hover:underline"
                            >
                              @{profile.username}
                            </Link>
                          ) : (
                            <span>Anonymous</span>
                          )}
                          {reviewDate && (
                            <>
                              <span aria-hidden>·</span>
                              <span>{reviewDate}</span>
                            </>
                          )}
                        </div>

                        {review.body ? (
                          <p
                            className="mt-3 line-clamp-3 text-[0.875rem] leading-[1.65]"
                            style={{ color: MUTED }}
                          >
                            {review.body}
                          </p>
                        ) : (
                          <p
                            className="mt-3 text-[0.875rem] italic"
                            style={{ color: MUTED }}
                          >
                            Rated without a written review.
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div
              className="mt-8 flex flex-col items-center rounded-[24px] border bg-white px-6 py-12 text-center"
              style={{ borderColor: BORDER, boxShadow: CARD_SHADOW }}
            >
              <div
                className="flex size-12 items-center justify-center rounded-[12px]"
                style={{ backgroundColor: "rgba(255, 107, 0, 0.10)" }}
              >
                <MessageSquare
                  className="size-5"
                  style={{ color: "#FF6B00" }}
                />
              </div>
              <p className="mt-3 font-semibold">No reviews yet</p>
              <p
                className="mt-1 max-w-[420px] text-[0.875rem]"
                style={{ color: MUTED }}
              >
                Be the first to rate a game and share your thoughts with the
                community.
              </p>
              <Link
                href="/search"
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-[12px] bg-[#FF6B00] px-4 text-[0.875rem] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#E66000] hover:shadow-[0_6px_16px_rgba(255,107,0,0.28)]"
              >
                Find a game
                <ArrowRight className="size-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1280px] px-6 pb-16 pt-4 md:pb-24">
        <div
          className="relative overflow-hidden rounded-[36px] px-6 py-10 md:px-12 md:py-14"
          style={{
            background:
              "linear-gradient(120deg, #171525 0%, #2A1B4A 55%, #4A1D3F 100%)",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-20 size-[320px] rounded-full opacity-40 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(255, 107, 0, 0.55), transparent 65%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 left-1/3 size-[280px] rounded-full opacity-30 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(124, 58, 237, 0.65), transparent 65%)",
            }}
          />

          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="max-w-[560px] text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-[1.2] tracking-[-0.02em] text-white">
                Ready to clear your backlog?
              </h2>
              <p className="mt-2 max-w-[520px] text-[0.95rem] leading-[1.7] text-white/70">
                Find your next game, save it, and come back when you have
                something to say.
              </p>
            </div>
            <Link
              href="/search"
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-[12px] bg-[#FF6B00] px-5 text-[0.875rem] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#E66000] hover:shadow-[0_8px_20px_rgba(255,107,0,0.3)]"
            >
              Find a game
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        <p
          className="mt-6 text-center text-[0.75rem]"
          style={{ color: MUTED }}
        >
          Game data provided by{" "}
          <a
            href="https://rawg.io"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-2 transition-colors hover:text-[#FF6B00]"
          >
            RAWG
          </a>
          .
        </p>
      </section>
    </main>
  );
}
