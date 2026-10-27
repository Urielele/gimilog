import { NextResponse } from "next/server";
import { rawg } from "@/lib/rawg/client";
import { upsertSearchResults } from "@/features/games/services/games.service";
import type { RawgGame } from "@/lib/rawg/types";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim();
  if (!q || q.length < 2) return NextResponse.json([]);

  try {
    const data = (await rawg("/games", { search: q, page_size: "12" })) as {
      results: RawgGame[];
    };
    await upsertSearchResults(data.results);

    return NextResponse.json(
      data.results.map((g) => ({
        slug: g.slug,
        title: g.name,
        cover_url: g.background_image,
        release_date: g.released,
      }))
    );
  } catch (error) {
    console.error("Gagal mencari game:", error);
    return NextResponse.json([], { status: 502 });
  }
}
