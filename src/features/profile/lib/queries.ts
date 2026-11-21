import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { getYear } from "./format";

export const GAME = "games(id, slug, title, cover_url, release_date)";

export type GameRef = {
  id: number;
  slug: string | null;
  title: string | null;
  cover_url: string | null;
  release_date: string | null;
};

export type Profile = {
  id: string;
  username: string;
  bio: string | null;
  avatar_url: string | null;
  created_at: string | null;
};

export type ReviewRow = {
  id: number;
  game_id: number;
  rating: number;
  body: string | null;
  created_at: string | null;
  updated_at: string | null;
  games: GameRef | GameRef[] | null;
};

export type LogRow = {
  game_id: number;
  status: string;
  updated_at: string | null;
  games: GameRef | GameRef[] | null;
};

export type ActivityItem = {
  game: GameRef;
  status: string | null;
  rating: number | null;
  hasBody: boolean;
  activityAt: string | null;
};

export type ProfileStats = {
  games: number;
  thisYear: number;
  reviews: number;
  wishlist: number;
};

export type CollectionGame = {
  slug: string;
  title: string;
  cover_url: string | null;
  release_year: string | null;
  status: string;
  rating: number | null;
  addedAt: string | null;
};

// Supabase mengembalikan relasi sebagai objek ATAU array, tergantung bentuk
// query. Satu helper ini dipakai semua komponen profil.
export function first<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export const getProfileByUsername = cache(
  async function getProfileByUsername(
    username: string
  ): Promise<Profile | null> {
    const supabase = await createClient();
    const { data } = await supabase
      .from("profiles")
      .select("id, username, bio, avatar_url, created_at")
      .eq("username", username)
      .maybeSingle();
    return (data as Profile | null) ?? null;
  }
);

export async function getProfileStats(userId: string): Promise<ProfileStats> {
  const supabase = await createClient();
  const year = new Date().getUTCFullYear();

  const [games, wishlist, reviews, thisYear] = await Promise.all([
    supabase
      .from("game_logs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("game_logs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "wishlist"),
    supabase
      .from("reviews")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("game_logs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("updated_at", `${year}-01-01`)
      .lt("updated_at", `${year + 1}-01-01`),
  ]);

  return {
    games: games.count ?? 0,
    thisYear: thisYear.count ?? 0,
    reviews: reviews.count ?? 0,
    wishlist: wishlist.count ?? 0,
  };
}

export async function getLogs(userId: string, limit?: number) {
  const supabase = await createClient();
  let query = supabase
    .from("game_logs")
    .select(`game_id, status, updated_at, ${GAME}`)
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  if (limit) query = query.limit(limit);

  const { data } = await query;
  return (data ?? []) as unknown as LogRow[];
}

export async function getReviews(userId: string, limit?: number) {
  const supabase = await createClient();
  let query = supabase
    .from("reviews")
    .select(`id, game_id, rating, body, created_at, updated_at, ${GAME}`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (limit) query = query.limit(limit);

  const { data } = await query;
  return (data ?? []) as unknown as ReviewRow[];
}

export function buildActivity(
  logs: LogRow[],
  reviews: ReviewRow[]
): ActivityItem[] {
  const byGame = new Map<number, ActivityItem>();

  for (const log of logs) {
    const game = first(log.games);
    if (!game?.slug) continue;
    byGame.set(game.id, {
      game,
      status: log.status,
      rating: null,
      hasBody: false,
      activityAt: log.updated_at,
    });
  }

  for (const review of reviews) {
    const game = first(review.games);
    if (!game?.slug) continue;
    const existing = byGame.get(game.id);
    const reviewAt = review.updated_at ?? review.created_at;
    const newer =
      !existing ||
      !existing.activityAt ||
      (reviewAt ?? "") > existing.activityAt;

    byGame.set(game.id, {
      game,
      status: existing?.status ?? null,
      rating: review.rating,
      hasBody: Boolean(review.body?.trim()),
      activityAt: newer ? reviewAt : existing.activityAt,
    });
  }

  return [...byGame.values()]
    .sort((a, b) => (b.activityAt ?? "").localeCompare(a.activityAt ?? ""))
    .slice(0, 4);
}

export async function getWishlist(userId: string, limit = 6) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("game_logs")
    .select(`game_id, status, updated_at, ${GAME}`)
    .eq("user_id", userId)
    .eq("status", "wishlist")
    .order("updated_at", { ascending: false })
    .limit(limit);

  return ((data ?? []) as unknown as LogRow[])
    .map((log) => first(log.games))
    .filter((game): game is GameRef => Boolean(game?.slug));
}

export async function getGamesCollection(
  userId: string
): Promise<CollectionGame[]> {
  const supabase = await createClient();
  const [logsResult, reviewsResult] = await Promise.all([
    supabase
      .from("game_logs")
      .select(`game_id, status, updated_at, ${GAME}`)
      .eq("user_id", userId)
      .order("updated_at", { ascending: false }),
    supabase.from("reviews").select("game_id, rating").eq("user_id", userId),
  ]);

  const ratings = new Map<number, number>();
  for (const review of (reviewsResult.data ?? []) as {
    game_id: number;
    rating: number;
  }[]) {
    ratings.set(review.game_id, review.rating);
  }

  return ((logsResult.data ?? []) as unknown as LogRow[])
    .map((log) => {
      const game = first(log.games);
      if (!game?.slug) return null;

      return {
        slug: game.slug,
        title: game.title ?? game.slug,
        cover_url: game.cover_url,
        release_year: getYear(game.release_date),
        status: log.status,
        rating: ratings.get(log.game_id) ?? null,
        addedAt: log.updated_at,
      } satisfies CollectionGame;
    })
    .filter((game): game is CollectionGame => game !== null);
}
