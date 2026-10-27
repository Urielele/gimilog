// Bentuk hasil pencarian yang dikirim API ke browser.
export type GameSearchResult = {
  slug: string;
  title: string;
  cover_url: string | null;
  release_date: string | null;
};
