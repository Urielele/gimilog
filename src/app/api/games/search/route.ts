import { NextResponse } from "next/server";
import { rawg } from "@/lib/rawg/client";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim();
  if (!q) return NextResponse.json([]);
  
  const data = await rawg("/games", { search: q, page_size: "10" });
  const results = data.results.map((g: any) => ({
    rawg_id: g.id,
    slug: g.slug,
    title: g.name,
    cover_url: g.background_image,
    release_date: g.released,
  }));
  return NextResponse.json(results);
}