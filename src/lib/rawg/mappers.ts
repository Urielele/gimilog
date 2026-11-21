import type { RawgGame } from "./types";

// Hasil pencarian: TANPA summary (RAWG tidak menyertakannya di daftar)
export function mapRawgSearchResult(g: RawgGame) {
  return {
    rawg_id: g.id,
    slug: g.slug,
    title: g.name,
    cover_url: g.background_image ?? null,
    release_date: g.released || null,
  };
}

// Detail lengkap: dengan summary. Game tanpa deskripsi disimpan sebagai ""
// supaya tidak memanggil RAWG berulang kali.
export function mapRawgDetail(g: RawgGame) {
  return {
    ...mapRawgSearchResult(g),
    summary: g.description_raw ?? "",
    // "" = sudah diambil dari RAWG tapi game-nya memang tidak punya developer.
    developer: g.developers?.[0]?.name ?? "",
    synced_at: new Date().toISOString(),
  };
}
