import "server-only";
import { rawg } from "@/lib/rawg/client";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { mapRawgDetail, mapRawgSearchResult } from "@/lib/rawg/mappers";
import type { RawgGame } from "@/lib/rawg/types";

// Simpan hasil pencarian ke database (tanpa deskripsi lengkap)
export async function upsertSearchResults(results: RawgGame[]) {
  if (!results.length) return;
  const rows = results.map(mapRawgSearchResult);
  const { error } = await supabaseAdmin
    .from("games")
    .upsert(rows, { onConflict: "rawg_id" });
  if (error) throw error;
}

// Ambil detail lengkap satu game (cache-first)
export async function getGameBySlug(slug: string) {
  const { data: cached, error: readError } = await supabaseAdmin
    .from("games")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (readError) throw readError;

  // summary null = detail belum pernah diambil. "" = sudah, tapi memang kosong.
  if (cached && cached.summary !== null) return cached;

  const detail = (await rawg(`/games/${slug}`)) as RawgGame;
  const { data, error } = await supabaseAdmin
    .from("games")
    .upsert(mapRawgDetail(detail), { onConflict: "rawg_id" })
    .select()
    .single();
  if (error) throw error;
  return data;
}
