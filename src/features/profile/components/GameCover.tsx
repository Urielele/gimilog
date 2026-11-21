import Link from "next/link";
import { Gamepad2 } from "lucide-react";
import { cn } from "cn";
type CoverGame = {
  slug: string | null;
  title: string | null;
  cover_url: string | null;
};

export function GameCover({
  game,
  className,
  title,
}: {
  game: CoverGame | null;
  className?: string;
  title?: string;
}) {
  if (!game?.slug) return null;

  const label = game.title ?? game.slug;

  return (
    <Link
      href={`/games/${game.slug}`}
      title={title ?? label}
      className={cn(
        "group block rounded-cover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-900",
        className
      )}
    >
      {game.cover_url ? (
        <img
          src={game.cover_url}
          alt={label}
          loading="lazy"
          className="aspect-[3/4] w-full rounded-cover border border-hairline object-cover shadow-cover transition-[transform,box-shadow] duration-150 group-hover:-translate-y-0.5 group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.35)] motion-reduce:transform-none"
        />
      ) : (
        <span className="flex aspect-[3/4] w-full items-center justify-center rounded-cover border border-hairline bg-field shadow-cover">
          <Gamepad2 className="size-8 text-text-soft" aria-hidden="true" />
        </span>
      )}
    </Link>
  );
}
