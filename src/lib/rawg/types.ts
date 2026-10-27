// Bentuk data game dari RAWG API (hanya field yang kita pakai).
export type RawgGame = {
  id: number;
  slug: string;
  name: string;
  background_image: string | null;
  released: string | null;
  description_raw?: string | null;
  rating?: number;
  playtime?: number;
};
