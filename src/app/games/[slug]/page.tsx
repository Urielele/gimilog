import { notFound } from "next/navigation";
import { Gamepad2, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getGameBySlug } from "@/features/games/services/games.service";
import { ReviewForm } from "@/features/reviews/components/ReviewForm";
import { LogButtons } from "@/features/logs/components/LogButtons";
import {
  Container,
  ExpandableText,
  PageShell,
  RatingValue,
  SearchBar,
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

function getYear(value: string | null) {
  if (!value) return null;
  const year = value.slice(0, 4);
  return /^\d{4}$/.test(year) ? year : null;
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
  const ratingText =
    avgRating !== null
      ? `${avgRating.toFixed(1)}/5 · ${ratingCount} review${
          ratingCount === 1 ? "" : "s"
        }`
      : "No ratings yet";

  const year = getYear(game.release_date);
  const developer = game.developer?.trim();
  const summary = game.summary?.trim();

  return (
    <PageShell>
      <Container className="pt-8 pb-16">
        <SearchBar variant="outlined" />

        <div className="mt-8 flex flex-col md:mt-20 md:grid md:grid-cols-[282px_1fr] md:gap-8">
          <div className="mx-auto w-[190px] max-w-full md:mx-0 md:w-[282px]">
            {game.cover_url ? (
              <img
                src={game.cover_url}
                alt={`Cover ${game.title}`}
                className="aspect-[3/4] w-full rounded-cover object-cover shadow-cover"
              />
            ) : (
              <div className="flex aspect-[3/4] w-full items-center justify-center rounded-cover bg-field shadow-cover">
                <Gamepad2
                  className="size-10 text-text-soft"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>

          <div className="mt-5 min-w-0 text-center md:mt-0 md:text-left">
            <div className="flex flex-wrap items-baseline justify-center gap-x-4 gap-y-1 md:justify-start">
              <h1 className="text-[20px] leading-[1.2] font-bold text-ink md:text-[clamp(28px,4vw,48px)] md:leading-[1.1]">
                {game.title}
              </h1>
              {year && (
                <span className="hidden text-[0.65em] font-normal text-text-soft md:inline">
                  {year}
                </span>
              )}
            </div>

            {(year || developer) && (
              <p className="mt-1 flex items-center justify-center gap-1 text-[12px] leading-[1.2] text-text-soft md:hidden">
                {year && <span>{year}</span>}
                {year && developer && <span aria-hidden="true">|</span>}
                {developer && (
                  <span className="lowercase">{developer.toLowerCase()}</span>
                )}
              </p>
            )}

            <p className="mt-1 flex items-center justify-center gap-1 text-[12px] leading-[1.2] text-text-soft md:hidden">
              {avgRating !== null && (
                <Star
                  className="size-3 fill-star-fill text-brown-900"
                  aria-hidden="true"
                />
              )}
              {ratingText}
            </p>

            {developer && (
              <p className="mt-1 hidden text-[clamp(20px,3vw,32px)] leading-[1.2] text-ink lowercase md:block">
                {developer.toLowerCase()}
              </p>
            )}

            <div className="mt-4 text-left md:mt-6">
              {summary ? (
                <ExpandableText
                  lines={8}
                  moreLabel="more.."
                  lessLabel="less"
                  clampClassName="max-md:line-clamp-12"
                >
                  {summary}
                </ExpandableText>
              ) : (
                <p className="font-about text-[clamp(16px,2vw,22px)] leading-[1.4] text-text">
                  No description available for this game.
                </p>
              )}
            </div>

            <div className="mt-4 hidden flex-wrap items-center gap-x-4 gap-y-2 text-base text-text-soft md:flex">
              {avgRating !== null ? (
                <span className="inline-flex items-center gap-2">
                  <Star
                    className="size-4 fill-star-fill text-brown-900"
                    aria-hidden="true"
                  />
                  {ratingText}
                </span>
              ) : (
                <span>{ratingText}</span>
              )}

              <TextLink
                href="https://rawg.io"
                className="text-base text-text-soft"
              >
                Game data provided by RAWG
              </TextLink>
            </div>
          </div>
        </div>

        <div className="mt-6 mb-4 h-0.5 w-full bg-divider md:mt-8 md:mb-8" />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[146px_1fr] md:gap-14">
          <LogButtons gameId={game.id} current={myLog?.status ?? null} />

          <div id="your-review" className="min-w-0">
            <ReviewForm gameId={game.id} initial={myReview} />
          </div>
        </div>

        <section className="mt-16">
          <h2 className="text-[28px] leading-[1.2] font-bold text-ink">
            All reviews
          </h2>

          {reviewRows.length ? (
            <ul className="mt-4 flex flex-col gap-4">
              {reviewRows.map((review) => {
                const username = getUsername(review.profiles);
                const reviewDate = formatReviewDate(review.created_at);

                return (
                  <li
                    key={review.id}
                    className="rounded-field bg-field p-4"
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
                          <span className="text-base text-text-soft">
                            {reviewDate}
                          </span>
                        )}
                      </div>
                    </div>

                    {review.body && (
                      <ExpandableText
                        lines={5}
                        moreLabel="...more"
                        lessLabel="less"
                        className="mt-2 bg-field"
                      >
                        {review.body}
                      </ExpandableText>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-4 text-base text-text-soft">
              No reviews yet. Be the first to write one.
            </p>
          )}
        </section>

        <p className="mt-8 text-center text-[12px] leading-[1.4] text-text-soft md:hidden">
          Game data provided by <TextLink href="https://rawg.io">RAWG</TextLink>.
        </p>
      </Container>
    </PageShell>
  );
}
