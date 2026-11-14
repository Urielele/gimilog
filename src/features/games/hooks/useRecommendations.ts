"use client";

import { useQuery } from "@tanstack/react-query";

export type RecFilters = {
  genre: string;
  platform: string;
  minRating: string;
  maxHours: string;
};

export type Recommendation = {
  slug: string;
  title: string;
  cover_url: string | null;
  release_date: string | null;
  rating: number | null;
  playtime: number | null;
};

// filters = null means the user has not pressed "Find my game" yet.
export function useRecommendations(filters: RecFilters | null) {
  return useQuery({
    queryKey: ["games", "recommend", filters],
    queryFn: async (): Promise<Recommendation[]> => {
      const qs = new URLSearchParams(filters!);
      const res = await fetch(`/api/games/recommend?${qs.toString()}`);
      if (!res.ok) throw new Error("Failed to load recommendations");
      return res.json();
    },
    enabled: filters !== null,
  });
}
