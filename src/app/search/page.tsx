"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Gamepad2, Search, SearchX } from "lucide-react";
import { useGameSearch } from "@/features/games/hooks/useGameSearch";

/* DESIGN2 tokens
   primary #FF6B00 · secondary #7C3AED · tertiary #2563EB
   surface #F8FAFC · accent #FFC107 · neutral #FFFFFF
   radius: sm 12px · md 24px · lg 36px                                  */

const INK = "#171525"; // charcoal, never pure black
const MUTED = "#64748B";
const BORDER = "rgba(23, 21, 37, 0.08)";

const CARD_SHADOW = "0 2px 12px rgba(0, 0, 0, 0.06)";
const CARD_SHADOW_HOVER = "0 12px 28px rgba(0, 0, 0, 0.10)";

const SUGGESTIONS = ["Elden Ring", "Hades", "Celeste"];

const styles = `
  @keyframes gm-fade-up {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .gm-fade-up { animation: gm-fade-up 420ms ease-out both; }

  @keyframes gm-shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  .gm-shimmer {
    background-image: linear-gradient(90deg, #EEF1F7 20%, #FDFDFE 50%, #EEF1F7 80%);
    background-size: 200% 100%;
    animation: gm-shimmer 1.4s ease-in-out infinite;
  }
`;

export default function SearchPage() {
  const [q, setQ] = useState("");
  const { data, isLoading } = useGameSearch(q);

  const trimmed = q.trim();
  const hasQuery = trimmed.length >= 2;
  const results = Array.isArray(data) ? data : [];

  const showLoading = hasQuery && isLoading;
  const showEmpty = hasQuery && !isLoading && results.length === 0;

  return (
    <main className="min-h-[100dvh] bg-[#F8FAFC]" style={{ color: INK }}>
      <style>{styles}</style>

      <div className="mx-auto w-full max-w-[1280px] px-6 py-16 md:py-24">
        <header className="gm-fade-up mx-auto max-w-[720px] text-center">
          <span
            className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-1.5 text-[13px] font-medium tracking-[0.02em]"
            style={{ borderColor: BORDER, color: "#7C3AED" }}
          >
            <Gamepad2 className="size-3.5" />
            Game Catalog
          </span>

          <h1
            className="mt-6"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Find{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, #FF6B00, #7C3AED 55%, #2563EB)" }}
            >
              games
            </span>{" "}
            you want to play
          </h1>

          <p className="mx-auto mt-5 max-w-[520px] text-[1rem] leading-[1.6]" style={{ color: MUTED }}>
            Type a game name to start searching. Results update automatically as you type.
          </p>
        </header>

        <div className="gm-fade-up mx-auto mt-10 max-w-[640px]" style={{ animationDelay: "80ms" }}>
          <label
            htmlFor="game-search"
            className="block text-[0.875rem] font-medium tracking-[0.02em]"
            style={{ color: INK }}
          >
            Search games
          </label>

          <form className="mt-2 flex flex-col gap-3 md:flex-row" onSubmit={(e) => e.preventDefault()}>
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2"
                style={{ color: "#94A3B8" }}
              />
              <input
                id="game-search"
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="e.g. Elden Ring"
                className="h-14 w-full rounded-[12px] border bg-white pl-12 pr-4 text-[1rem] outline-none transition-shadow duration-200 placeholder:text-[#94A3B8] focus:ring-2 focus:ring-[#FF6B00] focus:ring-offset-2"
                style={{ borderColor: "#E2E8F0", color: INK }}
              />
            </div>

            <button
              type="submit"
              className="h-14 shrink-0 rounded-[12px] px-7 text-[1rem] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#E66000] hover:shadow-[0_6px_16px_rgba(255,107,0,0.28)] active:translate-y-px"
              style={{ backgroundColor: "#FF6B00" }}
            >
              Search
            </button>
          </form>

          <p className="mt-3 text-[0.875rem]" style={{ color: MUTED }}>
            Results update automatically after you stop typing.
          </p>
        </div>

        <section className="mt-16" aria-live="polite">
          {!hasQuery && (
            <div
              className="gm-fade-up mx-auto flex max-w-[560px] flex-col items-center rounded-[24px] border bg-white px-6 py-14 text-center"
              style={{ borderColor: BORDER, boxShadow: CARD_SHADOW }}
            >
              <div
                className="flex size-16 items-center justify-center rounded-[24px]"
                style={{ background: "linear-gradient(135deg, rgba(255,107,0,0.12), rgba(124,58,237,0.12))" }}
              >
                <Search className="size-7" style={{ color: "#FF6B00" }} />
              </div>
              <h2 className="mt-5 text-[1.5rem] font-semibold" style={{ letterSpacing: "-0.01em" }}>
                Start your search
              </h2>
              <p className="mt-2 text-[1rem] leading-[1.6]" style={{ color: MUTED }}>
                Type at least 2 characters to search. Or try one of the suggestions below.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQ(s)}
                    className="rounded-full border bg-white px-4 py-2 text-[0.875rem] font-medium transition-colors duration-200 hover:border-[#FF6B00] hover:bg-[#FFF4EC] hover:text-[#FF6B00]"
                    style={{ borderColor: "#E2E8F0", color: INK }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showLoading && (
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4" aria-hidden="true">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-[12px] border bg-white"
                  style={{ borderColor: BORDER, boxShadow: CARD_SHADOW }}
                >
                  <div className="gm-shimmer aspect-[3/4] w-full" />
                  <div className="space-y-2 p-4">
                    <div className="gm-shimmer h-4 w-3/4 rounded-[6px]" />
                    <div className="gm-shimmer h-3 w-1/2 rounded-[6px]" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {showEmpty && (
            <div
              className="gm-fade-up mx-auto flex max-w-[560px] flex-col items-center rounded-[24px] border bg-white px-6 py-14 text-center"
              style={{ borderColor: BORDER, boxShadow: CARD_SHADOW }}
            >
              <div
                className="flex size-16 items-center justify-center rounded-[24px]"
                style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(124,58,237,0.12))" }}
              >
                <SearchX className="size-7" style={{ color: "#2563EB" }} />
              </div>
              <h2 className="mt-5 text-[1.5rem] font-semibold" style={{ letterSpacing: "-0.01em" }}>
                Game not found
              </h2>
              <p className="mt-2 text-[1rem] leading-[1.6]" style={{ color: MUTED }}>
                No results found for “{trimmed}”. Try a shorter or different keyword.
              </p>
              <button
                type="button"
                onClick={() => setQ("")}
                className="mt-6 inline-flex items-center gap-2 rounded-[12px] border px-5 py-3 text-[1rem] font-semibold transition-colors duration-200 hover:bg-[#FFF4EC]"
                style={{ borderColor: "#FF6B00", color: "#FF6B00", borderWidth: 1.5 }}
              >
                Clear search
                <ArrowRight className="size-4" />
              </button>
            </div>
          )}

          {!showLoading && !showEmpty && results.length > 0 && (
            <>
              <div className="mb-6 flex items-center gap-3">
                <h2 className="text-[1.5rem] font-semibold" style={{ letterSpacing: "-0.01em" }}>
                  Search results
                </h2>
                <span
                  className="rounded-full px-3 py-1 text-[0.875rem] font-medium"
                  style={{ backgroundColor: "rgba(124,58,237,0.10)", color: "#7C3AED" }}
                >
                  {results.length} {results.length === 1 ? "game" : "games"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                {results.map((g, i) => (
                  <Link
                    key={g.slug}
                    href={`/games/${g.slug}`}
                    className="gm-fade-up group block overflow-hidden rounded-[12px] border bg-white transition-all duration-200 ease-out hover:-translate-y-1"
                    style={{
                      borderColor: BORDER,
                      boxShadow: CARD_SHADOW,
                      animationDelay: `${Math.min(i, 11) * 80}ms`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = CARD_SHADOW_HOVER;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = CARD_SHADOW;
                    }}
                  >
                    {g.cover_url ? (
                      <img
                        src={g.cover_url}
                        alt={g.title}
                        loading="lazy"
                        className="aspect-[3/4] w-full object-cover"
                        style={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                      />
                    ) : (
                      <div
                        className="flex aspect-[3/4] w-full items-center justify-center"
                        style={{
                          background: "linear-gradient(135deg, #FFE9D6, #EDE4FE)",
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12,
                        }}
                      >
                        <Gamepad2 className="size-9" style={{ color: "#FF6B00" }} />
                      </div>
                    )}

                    <div className="p-4">
                      <p
                        className="line-clamp-2 text-[1rem] font-semibold leading-snug group-hover:text-[#FF6B00]"
                        style={{ transition: "color 200ms ease-out" }}
                      >
                        {g.title}
                      </p>
                      {g.release_date && (
                        <p
                          className="mt-2 text-[0.75rem] tracking-[0.02em]"
                          style={{ color: MUTED, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
                        >
                          {g.release_date}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
