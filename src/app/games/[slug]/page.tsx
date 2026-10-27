import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Gamepad2 } from "lucide-react";
import { getGameBySlug } from "@/features/games/services/games.service";

/* DESIGN2 tokens
   primary #FF6B00 · secondary #7C3AED · tertiary #2563EB
   surface #F8FAFC · accent #FFC107 · neutral #FFFFFF
   radius: sm 12px · md 24px · lg 36px                                  */

const INK = "#171525";
const MUTED = "#64748B";
const BORDER = "rgba(23, 21, 37, 0.08)";
const CARD_SHADOW = "0 2px 12px rgba(0, 0, 0, 0.06)";

function formatReleaseDate(value: string | null) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = await getGameBySlug(slug).catch(() => null);
  if (!game) notFound();

  const releaseDate = formatReleaseDate(game.release_date);
  const summary = game.summary?.trim();

  return (
    <main className="min-h-[100dvh] bg-[#F8FAFC]" style={{ color: INK }}>
      <div className="mx-auto w-full max-w-[1100px] px-6 py-12 md:py-20">
        <Link
          href="/search"
          className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-[0.875rem] font-medium transition-colors duration-200 hover:border-[#FF6B00] hover:text-[#FF6B00]"
          style={{ borderColor: BORDER, color: MUTED }}
        >
          <ArrowLeft className="size-4" />
          Back to search
        </Link>

        <div className="mt-8 grid gap-8 md:grid-cols-[260px_1fr] lg:grid-cols-[300px_1fr] lg:gap-12">
          <div>
            {game.cover_url ? (
              <img
                src={game.cover_url}
                alt={`Cover ${game.title}`}
                className="aspect-[3/4] w-full rounded-[24px] border object-cover"
                style={{ borderColor: BORDER, boxShadow: CARD_SHADOW }}
              />
            ) : (
              <div
                className="flex aspect-[3/4] w-full items-center justify-center rounded-[24px] border"
                style={{
                  borderColor: BORDER,
                  background: "linear-gradient(135deg, #FFE9D6, #EDE4FE)",
                  boxShadow: CARD_SHADOW,
                }}
              >
                <Gamepad2 className="size-12" style={{ color: "#FF6B00" }} />
              </div>
            )}
          </div>

          <div>
            <span
              className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-[0.75rem] font-medium tracking-[0.02em]"
              style={{ borderColor: BORDER, color: "#7C3AED" }}
            >
              <Gamepad2 className="size-3.5" />
              Game Details
            </span>

            <h1 className="mt-4 text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.1] tracking-[-0.02em]">
              {game.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {releaseDate && (
                <span
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.8125rem] font-medium"
                  style={{ backgroundColor: "rgba(37, 99, 235, 0.10)", color: "#2563EB" }}
                >
                  <CalendarDays className="size-3.5" />
                  {releaseDate}
                </span>
              )}

              <span
                className="inline-flex items-center rounded-full px-3 py-1.5 text-[0.8125rem] font-medium"
                style={{ backgroundColor: "rgba(23, 21, 37, 0.05)", color: MUTED }}
              >
                No reviews yet
              </span>
            </div>

            <section
              className="mt-8 rounded-[24px] border bg-white p-6 md:p-8"
              style={{ borderColor: BORDER, boxShadow: CARD_SHADOW }}
            >
              <h2 className="text-[1.25rem] font-semibold tracking-[-0.01em]">
                About this game
              </h2>

              {summary ? (
                <p
                  className="mt-3 whitespace-pre-line text-[1rem] leading-[1.7]"
                  style={{ color: MUTED }}
                >
                  {summary}
                </p>
              ) : (
                <p className="mt-3 text-[1rem] leading-[1.7]" style={{ color: MUTED }}>
                  No description available for this game.
                </p>
              )}
            </section>

            <p className="mt-6 text-[0.8125rem]" style={{ color: MUTED }}>
              Game data provided by{" "}
              <a
                href="https://rawg.io"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-2 transition-colors duration-200 hover:text-[#FF6B00]"
              >
                RAWG
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
