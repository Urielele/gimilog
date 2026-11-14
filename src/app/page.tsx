import Link from "next/link";
import { ArrowRight, Gamepad2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  ButtonLink,
  Card,
  Container,
  PageShell,
  RatingValue,
  SectionHeading,
  TextLink,
} from "@/components/gm";

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
    <PageShell>
      <section className="border-b border-hairline-soft bg-canvas">
        <Container className="py-16">
          <h1 className="text-display font-semibold text-ink">
            Your game backlog
          </h1>

          <p className="mt-4 max-w-[640px] text-base leading-[1.5] text-muted">
            Keep a wishlist, track what you are playing, and review the games
            you finish.
          </p>

          <div className="mt-8">
            <ButtonLink href="/search">
              Find a game
              <ArrowRight aria-hidden="true" />
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section className="bg-surface">
        <Container className="py-16">
          <SectionHeading>Latest reviews</SectionHeading>

          {reviews.length ? (
            <ul className="mt-8 flex flex-col gap-4">
              {reviews.map((review) => {
                const game = first(review.games);
                const profile = first(review.profiles);
                const reviewDate = formatDate(review.created_at);

                return (
                  <li key={review.id}>
                    <Card className="p-4">
                      <div className="flex gap-4">
                        {game?.cover_url ? (
                          <img
                            src={game.cover_url}
                            alt={game.title ?? game.slug ?? "Game cover"}
                            loading="lazy"
                            className="h-24 w-16 shrink-0 border border-hairline-soft object-cover"
                          />
                        ) : (
                          <div className="flex h-24 w-16 shrink-0 items-center justify-center border border-hairline-soft bg-surface-raised">
                            <Gamepad2
                              className="size-6 text-muted"
                              aria-hidden="true"
                            />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            {game?.slug ? (
                              <Link
                                href={`/games/${game.slug}`}
                                className="text-base leading-[1.5] font-semibold text-ink underline-offset-4 hover:text-primary-text hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                              >
                                {game.title ?? game.slug}
                              </Link>
                            ) : (
                              <span className="text-base leading-[1.5] font-semibold text-ink">
                                Unknown game
                              </span>
                            )}

                            <RatingValue value={review.rating} />
                          </div>

                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                            {profile?.username ? (
                              <TextLink href={`/u/${profile.username}`}>
                                @{profile.username}
                              </TextLink>
                            ) : (
                              <span>Anonymous</span>
                            )}
                            {reviewDate && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span>{reviewDate}</span>
                              </>
                            )}
                          </div>

                          {review.body ? (
                            <p className="mt-4 line-clamp-3 text-base leading-[1.5] text-muted">
                              {review.body}
                            </p>
                          ) : (
                            <p className="mt-4 text-base leading-[1.5] text-muted italic">
                              Rated without a written review.
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-4 text-base leading-[1.5] text-muted">
              No reviews yet. <TextLink href="/search">Find a game</TextLink>
            </p>
          )}
        </Container>
      </section>

      <footer className="border-t border-hairline-soft bg-canvas">
        <Container className="py-8">
          <p className="text-center text-xs text-ink">
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
        </Container>
      </footer>
    </PageShell>
  );
}
