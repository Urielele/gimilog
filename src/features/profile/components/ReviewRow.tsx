import Link from "next/link";
import { ExpandableText, Stars } from "@/components/gm";
import { formatDate, getYear } from "../lib/format";
import { first, type ReviewRow as Review } from "../lib/queries";
import { GameCover } from "./GameCover";

export function ReviewRow({
  review,
  lines,
}: {
  review: Review;
  lines: 3 | 5;
}) {
  const game = first(review.games);
  const reviewedAt = formatDate(review.created_at);

  return (
    <li className="flex gap-4 border-b border-hairline py-6 first:pt-0 last:border-b-0 last:pb-0">
      <div className="w-20 shrink-0 sm:w-[80px]">
        <GameCover game={game} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          {game?.slug ? (
            <Link
              href={`/games/${game.slug}`}
              className="text-[24px] leading-[1.2] font-bold break-words text-ink hover:text-brown-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-900"
            >
              {game.title ?? game.slug}
            </Link>
          ) : (
            <span className="text-[24px] leading-[1.2] font-bold text-ink">
              Unknown game
            </span>
          )}
          {getYear(game?.release_date) && (
            <span className="text-[14px] text-text-soft">
              {getYear(game?.release_date)}
            </span>
          )}
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
          <Stars value={review.rating} size="md" />
          {reviewedAt && (
            <span className="text-[14px] leading-[1.4] text-text-soft">
              Reviewed {reviewedAt}
            </span>
          )}
        </div>

        {review.body && (
          <ExpandableText
            lines={lines}
            className="mt-2 font-sans text-[16px] [&_button]:text-[16px] [&_p]:text-[16px] [&_p]:leading-[1.4]"
          >
            {review.body}
          </ExpandableText>
        )}
      </div>
    </li>
  );
}
