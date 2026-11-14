import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Gamepad2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  Container,
  PageShell,
  RatingValue,
  SectionHeading,
  SquareAvatar,
  TextLink,
} from "@/components/gm";

const STATUS_ORDER = ["wishlist", "playing", "finished"] as const;
const STATUS_LABEL: Record<string, string> = {
  wishlist: "Wishlist",
  playing: "Playing",
  finished: "Finished",
};

type GameRef = {
  slug: string | null;
  title: string | null;
  cover_url: string | null;
};

type Profile = {
  id: string;
  username: string;
  bio: string | null;
  created_at: string | null;
};

type ReviewRow = {
  id: number;
  rating: number;
  body: string | null;
  created_at: string | null;
  games: GameRef | GameRef[] | null;
};

type LogRow = {
  status: string;
  updated_at: string | null;
  games: GameRef | GameRef[] | null;
};

function getGame(value: GameRef | GameRef[] | null) {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function formatDate(value: string | null, withDay = true) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", {
    day: withDay ? "numeric" : undefined,
    month: withDay ? "short" : "long",
    year: "numeric",
  }).format(date);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `@${username} — Gimilog`,
    description: `Reviews and backlog from @${username} on Gimilog.`,
  };
}

export default async function ProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { username } = await params;
  const { tab: tabParam } = await searchParams;
  const tab = tabParam === "backlog" ? "backlog" : "review";

  const supabase = await createClient();

  const { data: profileData } = await supabase
    .from("profiles")
    .select("id, username, bio, created_at")
    .eq("username", username)
    .maybeSingle();

  const profile = profileData as Profile | null;
  if (!profile) notFound();

  const [{ data: reviewsData }, { data: logsData }] = await Promise.all([
    supabase
      .from("reviews")
      .select("id, rating, body, created_at, games(slug, title, cover_url)")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("game_logs")
      .select("status, updated_at, games(slug, title, cover_url)")
      .eq("user_id", profile.id)
      .order("updated_at", { ascending: false }),
  ]);

  const reviews = (reviewsData ?? []) as unknown as ReviewRow[];
  const logs = (logsData ?? []) as unknown as LogRow[];
  const joined = formatDate(profile.created_at, false);

  const tabClass = (isActive: boolean) =>
    isActive
      ? "inline-flex h-11 items-center border-b-2 border-primary px-1 text-xs font-semibold text-primary-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      : "inline-flex h-11 items-center border-b-2 border-transparent px-1 text-xs font-semibold text-muted transition-colors duration-150 hover:text-primary-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

  return (
    <PageShell>
      <Container className="py-12">
        <TextLink
          href="/"
          className="inline-flex h-11 items-center"
        >
          ← Back to home
        </TextLink>

        <Card className="mt-6 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <SquareAvatar name={profile.username} size="lg" />

            <div className="min-w-0">
              <h1 className="text-2xl leading-[1.25] font-semibold text-ink">
                @{profile.username}
              </h1>
              {profile.bio && (
                <p className="mt-1 max-w-[640px] text-base leading-[1.5] text-muted">
                  {profile.bio}
                </p>
              )}
              {joined && (
                <p className="mt-2 inline-flex items-center gap-1 text-xs text-muted">
                  <CalendarDays className="size-3.5" aria-hidden="true" />
                  Member since {joined}
                </p>
              )}
            </div>
          </div>
        </Card>

        <div className="mt-8 flex gap-6 border-b border-hairline-soft">
          <Link
            href={`/u/${profile.username}?tab=review`}
            className={tabClass(tab === "review")}
          >
            Reviews ({reviews.length})
          </Link>
          <Link
            href={`/u/${profile.username}?tab=backlog`}
            className={tabClass(tab === "backlog")}
          >
            Backlog ({logs.length})
          </Link>
        </div>

        {tab === "backlog" ? (
          logs.length ? (
            <div className="mt-6 flex flex-col gap-4">
              {STATUS_ORDER.map((status) => {
                const items = logs.filter((log) => log.status === status);
                if (!items.length) return null;

                return (
                  <Card key={status} className="p-6">
                    <SectionHeading>
                      {STATUS_LABEL[status]} ({items.length})
                    </SectionHeading>

                    <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                      {items.map((log, index) => {
                        const game = getGame(log.games);
                        if (!game?.slug) return null;

                        return (
                          <li key={`${game.slug}-${index}`}>
                            <Link
                              href={`/games/${game.slug}`}
                              className="group block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            >
                              {game.cover_url ? (
                                <img
                                  src={game.cover_url}
                                  alt={game.title ?? game.slug}
                                  loading="lazy"
                                  className="aspect-[3/4] w-full border border-hairline-soft object-cover"
                                />
                              ) : (
                                <div className="flex aspect-[3/4] w-full items-center justify-center border border-hairline-soft bg-surface-raised">
                                  <Gamepad2
                                    className="size-8 text-muted"
                                    aria-hidden="true"
                                  />
                                </div>
                              )}
                              <p className="mt-2 line-clamp-2 text-base leading-[1.5] font-semibold text-ink group-hover:text-primary-text">
                                {game.title ?? game.slug}
                              </p>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </Card>
                );
              })}
            </div>
          ) : (
            <EmptyState message="No backlog yet." />
          )
        ) : reviews.length ? (
          <ul className="mt-6 flex flex-col gap-4">
            {reviews.map((review) => {
              const game = getGame(review.games);
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
                        <div className="flex flex-wrap items-center justify-between gap-2">
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

                        {reviewDate && (
                          <p className="mt-1 text-xs text-muted">
                            {reviewDate}
                          </p>
                        )}

                        {review.body && (
                          <p className="mt-2 line-clamp-4 whitespace-pre-line text-base leading-[1.5] text-muted">
                            {review.body}
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
          <EmptyState
            message={`@${profile.username} has not reviewed any game yet.`}
          />
        )}
      </Container>
    </PageShell>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <p className="mt-6 text-base leading-[1.5] text-muted">
      {message} <TextLink href="/search">Find a game</TextLink>
    </p>
  );
}
