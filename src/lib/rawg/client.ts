const BASE = "https://api.rawg.io/api";

export async function rawg(path: string, params: Record<string, string> = {}) {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set("key", process.env.RAWG_API_KEY!);
  
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url, { next: { revalidate: 3600 } });
  console.log(url);
  if (!res.ok) throw new Error(`RAWG error ${res.status}`);
  return res.json();
}