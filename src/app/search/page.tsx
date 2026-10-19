"use client";
import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useGameSearch } from "@/features/games/hooks/useGameSearch";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const { data, isLoading } = useGameSearch(q);

  return (
    <main className="mx-auto max-w-5xl p-6">
      <Input placeholder="Cari game..." value={q} onChange={(e) => setQ(e.target.value)} />
      {isLoading && <p className="mt-4">Mencari...</p>}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {data?.map((g: any) => (
          <Link key={g.slug} href={`/games/${g.slug}`} className="group">
            {g.cover_url && (
              <img src={g.cover_url} alt={g.title} className="aspect-[3/4] w-full rounded-md object-cover" />
            )}
            <p className="mt-2 text-sm font-medium group-hover:underline">{g.title}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}