import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  Gamepad2,
  MessageSquare,
  Star,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

/* DESIGN2 tokens
   primary #FF6B00 · secondary #7C3AED · tertiary #2563EB
   surface #F8FAFC · accent #FFC107 · neutral #FFFFFF
   radius: sm 12px · md 24px                                          */

const INK = "#171525";
const MUTED = "#64748B";
const BORDER = "rgba(23, 21, 37, 0.08)";
const CARD_SHADOW = "0 2px 12px rgba(0, 0, 0, 0.06)";

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

  return (
    <main className="min-h-[100dvh] bg-[#F8FAFC]" style={{ color: INK }}>
      <div className="mx-auto w-full max-w-[1100px] px-6 py-12 md:py-16">
        <Link
          href="/"
          className="text-[0.8125rem] underline-offset-4 transition-colors hover:text-[#FF6B00] hover:underline"
          style={{ color: MUTED }}
        >
          ← Back to home
        </Link>

        <header
          className="mt-6 rounded-[24px] border bg-white p-6 md:p-8"
          style={{ borderColor: BORDER, boxShadow: CARD_SHADOW }}
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div
              className="flex size-20 shrink-0 items-center justify-center rounded-[24px] text-[1.75rem] font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #FF6B00, #7C3AED)",
              }}
            >
              {profile.username.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <h1 className="text-[1.75rem] font-bold tracking-[-0.02em]">
                @{profile.username}
              </h1>
              {profile.bio && (
                <p
                  className="mt-1 max-w-[640px] text-[0.95rem] leading-[1.6]"
                  style={{ color: MUTED }}
                >
                  {profile.bio}
                </p>
              )}
              {joined && (
                <p
                  className="mt-2 inline-flex items-center gap-1.5 text-[0.8125rem]"
                  style={{ color: MUTED }}
                >
                  <CalendarDays className="size-3.5" />
                  Member since {joined}
                </p>
              )}
            </div>
          </div>
        </header>

        <div
          className="mt-8 flex gap-6 border-b text-[0.875rem]"
          style={{ borderColor: BORDER }}
        >
          <Link
            href={`/u/${profile.username}?tab=review`}
            className={
              tab === "review"
                ? "border-b-2 border-[#FF6B00] pb-2 font-semibold text-[#FF6B00]"
                : "pb-2 font-medium transition-colors hover:text-[#FF6B00]"
            }
            style={tab === "review" ? undefined : { color: MUTED }}
          >
            Reviews ({reviews.length})
          </Link>
          <Link
            href={`/u/${profile.username}?tab=backlog`}
            className={
              tab === "backlog"
                ? "border-b-2 border-[#FF6B00] pb-2 font-semibold text-[#FF6B00]"
                : "pb-2 font-medium transition-colors hover:text-[#FF6B00]"
            }
            style={tab === "backlog" ? undefined : { color: MUTED }}
          >
            Backlog ({logs.length})
          </Link>
        </div>

        {tab === "backlog" ? (
          logs.length ? (
            <div className="mt-6 flex flex-col gap-6">
              {STATUS_ORDER.map((status) => {
                const items = logs.filter((log) => log.status === status);

                return (
                  <section
                    key={status}
                    className="rounded-[24px] border bg-white p-6 md:p-7"
                    style={{ borderColor: BORDER, boxShadow: CARD_SHADOW }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-[1.25rem] font-semibold tracking-[-0.01em]">
                        {STATUS_LABEL[status]}
                      </h2>
                      <span
                        className="rounded-full px-3 py-1 text-[0.75rem] font-medium"
                        style={{
                          backgroundColor:
                            status === "playing"
                              ? "rgba(255, 107, 0, 0.10)"
                              : status === "wishlist"
                                ? "rgba(124, 58, 237, 0.10)"
                                : "rgba(37, 99, 235, 0.10)",
                          color:
                            status === "playing"
                              ? "#FF6B00"
                              : status === "wishlist"
                                ? "#7C3AED"
                                : "#2563EB",
                        }}
                      >
                        {items.length} {items.length === 1 ? "game" : "games"}
                      </span>
                    </div>

                    {items.length ? (
                      <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {items.map((log, index) => {
                          const game = getGame(log.games);
                          if (!game?.slug) return null;

                          return (
                            <li key={`${game.slug}-${index}`}>
                              <Link
                                href={`/games/${game.slug}`}
                                className="group block"
                              >
                                {game.cover_url ? (
                                  <img
                                    src={game.cover_url}
                                    alt={game.title ?? game.slug}
                                    loading="lazy"
                                    className="aspect-[3/4] w-full rounded-[12px] border object-cover transition-transform duration-200 group-hover:-translate-y-1"
                                    style={{ borderColor: BORDER }}
                                  />
                                ) : (
                                  <div
                                    className="flex aspect-[3/4] w-full items-center justify-center rounded-[12px] border"
                                    style={{
                                      borderColor: BORDER,
                                      background:
                                        "linear-gradient(135deg, #FFE9D6, #EDE4FE)",
                                    }}
                                  >
                                    <Gamepad2
                                      className="size-8"
                                      style={{ color: "#FF6B00" }}
                                    />
                                  </div>
                                )}
                                <p className="mt-2 line-clamp-2 text-[0.8125rem] font-semibold leading-snug transition-colors group-hover:text-[#FF6B00]">
                                  {game.title ?? game.slug}
                                </p>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="mt-3 text-[0.875rem]" style={{ color: MUTED }}>
                        No games in this status yet.
                      </p>
                    )}
                  </section>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={<Gamepad2 className="size-5" style={{ color: "#FF6B00" }} />}
              title="No backlog yet"
              description="Games marked as wishlist, playing, or finished will show up here."
            />
          )
        ) : reviews.length ? (
          <ul className="mt-6 flex flex-col gap-4">
            {reviews.map((review) => {
              const game = getGame(review.games);
              const reviewDate = formatDate(review.created_at);

              return (
                <li
                  key={review.id}
                  className="rounded-[24px] border bg-white p-5 md:p-6"
                  style={{ borderColor: BORDER, boxShadow: CARD_SHADOW }}
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
                        <Gamepad2 className="size-6" style={{ color: "#FF6B00" }} />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
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
                          className="inline-flex items-center gap-1 text-[0.8125rem] font-semibold"
                          style={{ color: "#FF6B00" }}
                        >
                          <Star
                            className="size-3.5"
                            style={{ fill: "#FF6B00", color: "#FF6B00" }}
                          />
                          {review.rating}/5
                        </span>
                      </div>

                      {reviewDate && (
                        <p className="mt-1 text-[0.75rem]" style={{ color: MUTED }}>
                          {reviewDate}
                        </p>
                      )}

                      {review.body && (
                        <p
                          className="mt-3 line-clamp-4 whitespace-pre-line text-[0.875rem] leading-[1.7]"
                          style={{ color: MUTED }}
                        >
                          {review.body}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyState
            icon={
              <MessageSquare className="size-5" style={{ color: "#FF6B00" }} />
            }
            title="No reviews yet"
            description={`@${profile.username} has not reviewed any game yet.`}
          />
        )}
      </div>
    </main>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div
      className="mt-6 flex flex-col items-center rounded-[24px] border bg-white px-6 py-12 text-center"
      style={{ borderColor: BORDER, boxShadow: CARD_SHADOW }}
    >
      <div
        className="flex size-12 items-center justify-center rounded-[12px]"
        style={{ backgroundColor: "rgba(255, 107, 0, 0.10)" }}
      >
        {icon}
      </div>
      <p className="mt-3 font-semibold">{title}</p>
      <p className="mt-1 max-w-[420px] text-[0.875rem]" style={{ color: MUTED }}>
        {description}
      </p>
      <Link
        href="/search"
        className="mt-5 inline-flex h-10 items-center gap-2 rounded-[12px] bg-[#FF6B00] px-4 text-[0.875rem] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#E66000] hover:shadow-[0_6px_16px_rgba(255,107,0,0.28)]"
      >
        Find a game
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
