export function mapRawgGame(g: any) {
  return {
    rawg_id: g.id,
    slug: g.slug,
    title: g.name,
    summary: g.description_raw ?? null,
    cover_url: g.background_image ?? null,
    release_date: g.released || null,
    synced_at: new Date().toISOString(),
  };
}