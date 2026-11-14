import { NextResponse } from "next/server";
import { rawg } from "@/lib/rawg/client";
import { upsertSearchResults } from "@/features/games/services/games.service";
import { GENRES, PLATFORMS } from "@/features/games/constants";
import type { RawgGame } from "@/lib/rawg/types";

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const genre = sp.get("genre") ?? "";
  const platform = sp.get("platform") ?? "";
  const minRating = Number(sp.get("minRating") ?? 0);
  const maxHours = Number(sp.get("maxHours") ?? 0);

  // Order by the most-added games so results are not obscure titles.
  const params: Record<string, string> = {
    ordering: "-added",
    page_size: "40",
  };

  // Only accept values from the curated lists.
  if (GENRES.some((g) => g.value === genre)) params.genres = genre;
  if (PLATFORMS.some((p) => p.value === platform)) {
    params.parent_platforms = platform;
  }

  try {
    const data = (await rawg("/games", params)) as { results: RawgGame[] };
    await upsertSearchResults(data.results);

    // Rating and playtime are filtered here. Games without playtime data are
    // excluded when a duration filter is active.
    const filtered = data.results.filter((game) => {
      const rating = game.rating ?? 0;
      const playtime = game.playtime ?? 0;

      return (
        (!minRating || rating >= minRating) &&
        (!maxHours || (playtime > 0 && playtime <= maxHours))
      );
    });

    return NextResponse.json(
      filtered.map((game) => ({
        slug: game.slug,
        title: game.name,
        cover_url: game.background_image,
        release_date: game.released,
        rating: game.rating ?? null,
        playtime: game.playtime ?? null,
      }))
    );
  } catch (error) {
    console.error("Failed to load recommendations:", error);
    return NextResponse.json([], { status: 502 });
  }
}
