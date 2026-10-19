import "server-only";
import { rawg } from "@/lib/rawg/client";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { mapRawgGame } from "@/lib/rawg/mappers";

// Simpan hasil pencarian ke database (tanpa deskripsi lengkap)
export async function upsertSearchResults(results: any[]) {
  if (!results.length) return;
  const rows = results.map(mapRawgGame);
  const { error } = await supabaseAdmin
    .from("games")
    .upsert(rows, { onConflict: "rawg_id", ignoreDuplicates: false });
  if (error) throw error;
}

// Ambil detail lengkap satu game (cache-first)
export async function getGameBySlug(slug: string) {
  const { data: cached } = await supabaseAdmin
    .from("games")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  // Jika ada dan sudah punya summary, langsung pakai
  if (cached?.summary) return cached;

  // Kalau belum, ambil detail dari RAWG lalu simpan
  const detail = await rawg(`/games/${slug}`);
  const row = mapRawgGame(detail);
  const { data, error } = await supabaseAdmin
    .from("games")
    .upsert(row, { onConflict: "rawg_id" })
    .select()
    .single();
  if (error) throw error;
  return data;
}