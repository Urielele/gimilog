import { NextResponse } from "next/server";
import { rawg } from "@/lib/rawg/client";
import {
  getGameBySlug,
  upsertSearchResults,
} from "@/features/games/services/games.service";
import type { RawgGame } from "@/lib/rawg/types";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim();
  if (!q || q.length < 2) return NextResponse.json([]);

  try {
    // -added = "most popular" menurut RAWG (paling banyak disimpan pengguna).
    const data = (await rawg("/games", {
      search: q,
      // Tanpa ini, fuzzy search RAWG mencampurkan game tak relevan
      // (mis. "persona" -> Assassin's Creed) saat diurutkan dari paling populer.
      search_precise: "true",
      page_size: "8",
      ordering: "-added",
    })) as {
      results: RawgGame[];
    };
    await upsertSearchResults(data.results);

    // RAWG tidak mengembalikan developer/deskripsi di endpoint daftar.
    // Pencarian pertama menambah beberapa panggilan detail, tetapi hasilnya
    // di-cache di database, jadi pencarian berikutnya Cache-first lewat getGameBySlug.
    // allSettled: satu game gagal tidak boleh menggagalkan seluruh respons.
    const details = await Promise.allSettled(
      data.results.map((g) => getGameBySlug(g.slug))
    );

    const response = data.results.map((g, index) => {
      const result = details[index];
      const detail = result?.status === "fulfilled" ? result.value : null;

      return {
        slug: g.slug,
        title: g.name,
        cover_url: g.background_image ?? null,
        release_date: g.released ?? null,
        developer: detail?.developer || null,
        summary: detail?.summary || null,
      };
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Gagal mencari game:", error);
    return NextResponse.json([], { status: 502 });
  }
}
