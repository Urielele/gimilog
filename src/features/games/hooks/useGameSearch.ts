"use client";
import { useQuery } from "@tanstack/react-query";
import type { GameSearchResult } from "@/features/games/types";

// q berasal dari URL, jadi tidak perlu debounce: hasil langsung mengikuti submit.
export function useGameSearch(query: string) {
  return useQuery({
    queryKey: ["games", "search", query],
    queryFn: async (): Promise<GameSearchResult[]> => {
      const res = await fetch(
        `/api/games/search?q=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error("Could not load results.");
      return res.json();
    },
    enabled: query.length >= 2,
  });
}
