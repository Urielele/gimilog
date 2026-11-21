import { AlignLeft } from "lucide-react";
import { Stars } from "@/components/gm";
import type { ActivityItem } from "../lib/queries";
import { GameCover } from "./GameCover";

const STATUS_LABEL: Record<string, string> = {
  wishlist: "Wishlist",
  playing: "Playing",
  finished: "Finished",
};

export function RecentActivity({ items }: { items: ActivityItem[] }) {
  if (!items.length) {
    return (
      <p className="mt-4 text-[16px] leading-[1.4] text-text-soft">
        No recent activity yet.
      </p>
    );
  }

  return (
    <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
      {items.map((item) => (
        <li key={item.game.slug} className="min-w-0">
          <GameCover game={item.game} />

          <div className="mt-2 flex min-h-5 items-center gap-1.5 text-text-soft">
            {item.rating !== null && <Stars value={item.rating} size="sm" />}
            {item.hasBody && (
              <AlignLeft className="size-4 shrink-0" aria-label="Has review" />
            )}
            {item.status && (
              <span className="ml-auto truncate text-[12px] leading-none">
                {STATUS_LABEL[item.status] ?? item.status}
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
