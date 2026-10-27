"use client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { GameSearchResult } from "@/features/games/types";

export function useGameSearch(query: string) {
  const [debounced, setDebounced] = useState(query);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 400);
    return () => clearTimeout(t);
  }, [query]);

  return useQuery({
    queryKey: ["games", "search", debounced],
    queryFn: async (): Promise<GameSearchResult[]> => {
      const res = await fetch(`/api/games/search?q=${encodeURIComponent(debounced)}`);
      if (!res.ok) throw new Error("Gagal mencari game");
      return res.json();
    },
    enabled: debounced.length >= 2,
  });
}
