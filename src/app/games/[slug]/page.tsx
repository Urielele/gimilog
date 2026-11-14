import { notFound } from "next/navigation";
import { ArrowLeft, Gamepad2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getGameBySlug } from "@/features/games/services/games.service";
import { ReviewForm } from "@/features/reviews/components/ReviewForm";
import { LogButtons } from "@/features/logs/components/LogButtons";
import {
  Card,
  Container,
  PageShell,
  RatingValue,
  SectionHeading,
  SquareAvatar,
  TextLink,
} from "@/components/gm";

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
    <PageShell>
      <Container className="py-12">
        <TextLink
          href="/search"
          className="inline-flex h-11 items-center gap-1"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to search
        </TextLink>

        <div className="mt-8 grid gap-8 md:grid-cols-[240px_1fr] lg:gap-12">
          <div className="max-w-60 md:max-w-none">
            {game.cover_url ? (
              <img
                src={game.cover_url}
                alt={`Cover ${game.title}`}
                className="aspect-[3/4] w-full border border-hairline-soft object-cover"
              />
            ) : (
              <div className="flex aspect-[3/4] w-full items-center justify-center border border-hairline-soft bg-surface-raised">
                <Gamepad2
                  className="size-10 text-muted"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>

          <div>
            <h1 className="text-display font-semibold text-ink">
              {game.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
              {releaseDate && <span>Released {releaseDate}</span>}

              {avgRating !== null ? (
                <span className="inline-flex items-center gap-2">
                  <RatingValue value={avgRating.toFixed(1)} />
                  <span>
                    ({ratingCount} review{ratingCount === 1 ? "" : "s"})
                  </span>
                </span>
              ) : (
                <span>No ratings yet</span>
              )}
            </div>

            <Card className="mt-8 p-6">
              <SectionHeading>About this game</SectionHeading>

              {summary ? (
                <p className="mt-2 whitespace-pre-line text-base leading-[1.5] text-muted">
                  {summary}
                </p>
              ) : (
                <p className="mt-2 text-base leading-[1.5] text-muted">
                  No description available for this game.
                </p>
              )}
            </Card>

            <p className="mt-4 text-xs text-muted">
              Game data provided by{" "}
              <a
                href="https://rawg.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary-text underline underline-offset-4 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                RAWG
              </a>
              .
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <Card className="p-6">
            <SectionHeading>Your backlog</SectionHeading>

            {user ? (
              <div className="mt-4">
                <LogButtons
                  gameId={game.id}
                  current={myLog?.status ?? null}
                />
              </div>
            ) : (
              <p className="mt-2 text-base leading-[1.5] text-muted">
                <TextLink href="/login">Sign in</TextLink> to add this game to
                your backlog.
              </p>
            )}
          </Card>

          <Card className="p-6" id="your-review">
            <SectionHeading>Your review</SectionHeading>

            {user ? (
              <div className="mt-4">
                <ReviewForm gameId={game.id} initial={myReview} />
              </div>
            ) : (
              <p className="mt-2 text-base leading-[1.5] text-muted">
                <TextLink href="/login">Sign in</TextLink> to rate and review
                this game.
              </p>
            )}
          </Card>
        </div>

        <Card className="mt-4 p-6">
          <SectionHeading>All reviews</SectionHeading>

          {reviewRows.length ? (
            <ul className="mt-4 flex flex-col gap-2">
              {reviewRows.map((review) => {
                const username = getUsername(review.profiles);
                const reviewDate = formatReviewDate(review.created_at);

                return (
                  <li
                    key={review.id}
                    className="border border-hairline-soft bg-surface p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <SquareAvatar name={username} />
                        {username ? (
                          <TextLink href={`/u/${username}`}>
                            @{username}
                          </TextLink>
                        ) : (
                          <span className="text-base font-semibold text-ink">
                            Anonymous
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <RatingValue value={review.rating} />
                        {reviewDate && (
                          <span className="text-xs text-muted">
                            {reviewDate}
                          </span>
                        )}
                      </div>
                    </div>

                    {review.body && (
                      <p className="mt-2 whitespace-pre-line text-base leading-[1.5] text-muted">
                        {review.body}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-2 text-base leading-[1.5] text-muted">
              No reviews yet.{" "}
              <TextLink href={user ? "#your-review" : "/login"}>
                {user ? "Write a review" : "Sign in to review"}
              </TextLink>
            </p>
          )}
        </Card>
      </Container>
    </PageShell>
  );
}
