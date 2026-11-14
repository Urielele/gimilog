import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Gamepad2,
  MessageSquare,
  Star,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getGameBySlug } from "@/features/games/services/games.service";
import { ReviewForm } from "@/features/reviews/components/ReviewForm";
import { LogButtons } from "@/features/logs/components/LogButtons";

/* DESIGN2 tokens
   primary #FF6B00 · secondary #7C3AED · tertiary #2563EB
   surface #F8FAFC · accent #FFC107 · neutral #FFFFFF
   radius: sm 12px · md 24px · lg 36px                                  */

const INK = "#171525";
const MUTED = "#64748B";
const BORDER = "rgba(23, 21, 37, 0.08)";
const CARD_SHADOW = "0 2px 12px rgba(0, 0, 0, 0.06)";

type ReviewRow = {
  id: number;
  rating: number;
  body: string | null;
  created_at: string | null;
  profiles:
    | { username: string | null }
    | { username: string | null }[]
    | null;
};

function getUsername(profiles: ReviewRow["profiles"]) {
  if (!profiles) return null;
  const profile = Array.isArray(profiles) ? profiles[0] : profiles;
  return profile?.username ?? null;
}

function formatReleaseDate(value: string | null) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatReviewDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = await getGameBySlug(slug).catch((error) => {
    console.error(`Gagal memuat detail game "${slug}":`, error);
    return null;
  });
  if (!game) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: stats }, { data: reviews }, myReviewResult, myLogResult] =
    await Promise.all([
      supabase
        .from("game_stats")
        .select("avg_rating, rating_count")
        .eq("game_id", game.id)
        .maybeSingle(),
      supabase
        .from("reviews")
        .select("id, rating, body, created_at, profiles(username)")
        .eq("game_id", game.id)
        .order("created_at", { ascending: false }),
      user
        ? supabase
            .from("reviews")
            .select("rating, body")
            .eq("game_id", game.id)
            .eq("user_id", user.id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
      user
        ? supabase
            .from("game_logs")
            .select("status")
            .eq("game_id", game.id)
            .eq("user_id", user.id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
    ]);

  const myReview = myReviewResult.data as {
    rating: number;
    body: string | null;
  } | null;
  const myLog = myLogResult.data as { status: string } | null;
  const reviewRows = (reviews ?? []) as unknown as ReviewRow[];
  const ratingCount = Number(stats?.rating_count ?? 0);
  const avgRating =
    stats?.avg_rating != null ? Number(stats.avg_rating) : null;

  const releaseDate = formatReleaseDate(game.release_date);
  const summary = game.summary?.trim();

  return (
    <main className="min-h-[100dvh] bg-[#F8FAFC]" style={{ color: INK }}>
      <div className="mx-auto w-full max-w-[1100px] px-6 py-12 md:py-20">
        <Link
          href="/search"
          className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-[0.875rem] font-medium transition-colors duration-200 hover:border-[#FF6B00] hover:text-[#FF6B00]"
          style={{ borderColor: BORDER, color: MUTED }}
        >
          <ArrowLeft className="size-4" />
          Back to search
        </Link>

        <div className="mt-8 grid gap-8 md:grid-cols-[260px_1fr] lg:grid-cols-[300px_1fr] lg:gap-12">
          <div>
            {game.cover_url ? (
              <img
                src={game.cover_url}
                alt={`Cover ${game.title}`}
                className="aspect-[3/4] w-full rounded-[24px] border object-cover"
                style={{ borderColor: BORDER, boxShadow: CARD_SHADOW }}
              />
            ) : (
              <div
                className="flex aspect-[3/4] w-full items-center justify-center rounded-[24px] border"
                style={{
                  borderColor: BORDER,
                  background: "linear-gradient(135deg, #FFE9D6, #EDE4FE)",
                  boxShadow: CARD_SHADOW,
                }}
              >
                <Gamepad2 className="size-12" style={{ color: "#FF6B00" }} />
              </div>
            )}
          </div>

          <div>
            <span
              className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-[0.75rem] font-medium tracking-[0.02em]"
              style={{ borderColor: BORDER, color: "#7C3AED" }}
            >
              <Gamepad2 className="size-3.5" />
              Game Details
            </span>

            <h1 className="mt-4 text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.1] tracking-[-0.02em]">
              {game.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {releaseDate && (
                <span
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.8125rem] font-medium"
                  style={{
                    backgroundColor: "rgba(37, 99, 235, 0.10)",
                    color: "#2563EB",
                  }}
                >
                  <CalendarDays className="size-3.5" />
                  {releaseDate}
                </span>
              )}

              {avgRating !== null ? (
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.8125rem] font-semibold"
                  style={{
                    backgroundColor: "rgba(255, 193, 7, 0.18)",
                    color: "#92400E",
                  }}
                >
                  <Star
                    className="size-3.5"
                    style={{ fill: "#F59E0B", color: "#F59E0B" }}
                  />
                  {avgRating.toFixed(1)}
                  <span className="font-normal">
                    ({ratingCount} review{ratingCount === 1 ? "" : "s"})
                  </span>
                </span>
              ) : (
                <span
                  className="inline-flex items-center rounded-full px-3 py-1.5 text-[0.8125rem] font-medium"
                  style={{
                    backgroundColor: "rgba(23, 21, 37, 0.05)",
                    color: MUTED,
                  }}
                >
                  No reviews yet
                </span>
              )}
            </div>

            <section
              className="mt-8 rounded-[24px] border bg-white p-6 md:p-8"
              style={{ borderColor: BORDER, boxShadow: CARD_SHADOW }}
            >
              <h2 className="text-[1.25rem] font-semibold tracking-[-0.01em]">
                About this game
              </h2>

              {summary ? (
                <p
                  className="mt-3 whitespace-pre-line text-[1rem] leading-[1.7]"
                  style={{ color: MUTED }}
                >
                  {summary}
                </p>
              ) : (
                <p
                  className="mt-3 text-[1rem] leading-[1.7]"
                  style={{ color: MUTED }}
                >
                  No description available for this game.
                </p>
              )}
            </section>

            <p className="mt-6 text-[0.8125rem]" style={{ color: MUTED }}>
              Game data provided by{" "}
              <a
                href="https://rawg.io"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-2 transition-colors duration-200 hover:text-[#FF6B00]"
              >
                RAWG
              </a>
              .
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <section
            className="rounded-[24px] border bg-white p-6 md:p-7"
            style={{ borderColor: BORDER, boxShadow: CARD_SHADOW }}
          >
            <h2 className="text-[1.25rem] font-semibold tracking-[-0.01em]">
              Your backlog
            </h2>
            <p className="mt-1 text-[0.875rem]" style={{ color: MUTED }}>
              Mark where you are with this game.
            </p>

            {user ? (
              <div className="mt-4">
                <LogButtons
                  gameId={game.id}
                  current={myLog?.status ?? null}
                />
              </div>
            ) : (
              <p
                className="mt-4 rounded-[12px] border px-4 py-3 text-[0.875rem] leading-[1.6]"
                style={{
                  borderColor: BORDER,
                  backgroundColor: "#F8FAFC",
                  color: MUTED,
                }}
              >
                <Link
                  href="/login"
                  className="font-semibold text-[#FF6B00] underline-offset-4 hover:underline"
                >
                  Sign in
                </Link>{" "}
                to add this game to your backlog.
              </p>
            )}
          </section>

          <section
            className="rounded-[24px] border bg-white p-6 md:p-7"
            style={{ borderColor: BORDER, boxShadow: CARD_SHADOW }}
          >
            <h2 className="text-[1.25rem] font-semibold tracking-[-0.01em]">
              Your review
            </h2>
            <p className="mt-1 text-[0.875rem]" style={{ color: MUTED }}>
              Rate it and share what you thought.
            </p>

            {user ? (
              <div className="mt-4">
                <ReviewForm gameId={game.id} initial={myReview} />
              </div>
            ) : (
              <p
                className="mt-4 rounded-[12px] border px-4 py-3 text-[0.875rem] leading-[1.6]"
                style={{
                  borderColor: BORDER,
                  backgroundColor: "#F8FAFC",
                  color: MUTED,
                }}
              >
                <Link
                  href="/login"
                  className="font-semibold text-[#FF6B00] underline-offset-4 hover:underline"
                >
                  Sign in
                </Link>{" "}
                to rate and review this game.
              </p>
            )}
          </section>
        </div>

        <section
          className="mt-6 rounded-[24px] border bg-white p-6 md:p-8"
          style={{ borderColor: BORDER, boxShadow: CARD_SHADOW }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-[1.25rem] font-semibold tracking-[-0.01em]">
              All reviews
            </h2>
            <span
              className="rounded-full px-3 py-1 text-[0.75rem] font-medium"
              style={{
                backgroundColor: "rgba(124, 58, 237, 0.10)",
                color: "#7C3AED",
              }}
            >
              {ratingCount} {ratingCount === 1 ? "review" : "reviews"}
            </span>
          </div>

          {reviewRows.length ? (
            <ul className="mt-5 flex flex-col gap-3">
              {reviewRows.map((review) => {
                const username = getUsername(review.profiles);
                const reviewDate = formatReviewDate(review.created_at);

                return (
                  <li
                    key={review.id}
                    className="rounded-[16px] border p-4"
                    style={{
                      borderColor: BORDER,
                      backgroundColor: "#FCFCFD",
                    }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="flex size-8 items-center justify-center rounded-full text-[0.75rem] font-semibold text-white"
                          style={{
                            background:
                              "linear-gradient(135deg, #FF6B00, #7C3AED)",
                          }}
                        >
                          {(username ?? "?").charAt(0).toUpperCase()}
                        </span>
                        {username ? (
                          <Link
                            href={`/u/${username}`}
                            className="text-[0.875rem] font-semibold underline-offset-4 hover:text-[#FF6B00] hover:underline"
                          >
                            @{username}
                          </Link>
                        ) : (
                          <span className="text-[0.875rem] font-semibold">
                            Anonymous
                          </span>
                        )}
                      </div>

                      <div
                        className="flex items-center gap-3 text-[0.75rem]"
                        style={{ color: MUTED }}
                      >
                        <span
                          className="inline-flex items-center gap-1 font-semibold"
                          style={{ color: "#FF6B00" }}
                        >
                          <Star
                            className="size-3.5"
                            style={{ fill: "#FF6B00", color: "#FF6B00" }}
                          />
                          {review.rating}/5
                        </span>
                        {reviewDate && <span>{reviewDate}</span>}
                      </div>
                    </div>

                    {review.body && (
                      <p
                        className="mt-3 whitespace-pre-line text-[0.875rem] leading-[1.7]"
                        style={{ color: MUTED }}
                      >
                        {review.body}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div
              className="mt-5 flex flex-col items-center rounded-[16px] border px-6 py-10 text-center"
              style={{ borderColor: BORDER }}
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
              <p className="mt-1 text-[0.875rem]" style={{ color: MUTED }}>
                Be the first to share your thoughts about this game.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
