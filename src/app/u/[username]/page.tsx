import { notFound } from "next/navigation";
import { TextLink } from "@/components/gm";
import { GameCover } from "@/features/profile/components/GameCover";
import { RecentActivity } from "@/features/profile/components/RecentActivity";
import { ReviewRow } from "@/features/profile/components/ReviewRow";
import { SectionBar } from "@/features/profile/components/SectionBar";
import {
  buildActivity,
  getLogs,
  getProfileByUsername,
  getReviews,
  getWishlist,
} from "@/features/profile/lib/queries";
import { redirectLegacyTab } from "@/features/profile/lib/redirect-legacy-tab";

export default async function ProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { username } = await params;
  const { tab } = await searchParams;
  redirectLegacyTab(username, tab);

  const profile = await getProfileByUsername(username);
  if (!profile) notFound();

  const [logs, reviews, wishlist] = await Promise.all([
    getLogs(profile.id, 8),
    getReviews(profile.id, 8),
    getWishlist(profile.id, 6),
  ]);

  const activity = buildActivity(logs, reviews);
  const recentReviews = reviews.slice(0, 3);

  return (
    <div className="grid grid-cols-1 gap-[60px] lg:grid-cols-[minmax(0,710px)_300px]">
      <div className="min-w-0 space-y-10">
        <section>
          <SectionBar
            title="Recent activity"
            actionLabel="ALL"
            actionHref={`/u/${username}/games`}
          />
          <RecentActivity items={activity} />
        </section>

        <section>
          <SectionBar
            title="Recent reviews"
            actionLabel="MORE"
            actionHref={`/u/${username}/reviews`}
          />
          {recentReviews.length ? (
            <ul className="mt-2">
              {recentReviews.map((review) => (
                <ReviewRow key={review.id} review={review} lines={3} />
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-[16px] leading-[1.4] text-text-soft">
              No reviews yet. <TextLink href="/search">Find a game</TextLink>
            </p>
          )}
        </section>
      </div>

      <aside className="min-w-0">
        <SectionBar
          title="Wishlist"
          actionLabel="ALL"
          actionHref={`/u/${username}/games?status=wishlist`}
        />
        {wishlist.length ? (
          <ul className="mt-4 grid grid-cols-3 gap-3">
            {wishlist.map((game, index) => (
              <li key={`${game.slug}-${index}`} className="min-w-0">
                <GameCover game={game} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-[14px] leading-[1.4] text-text-soft">
            Nothing wishlisted yet.
          </p>
        )}
      </aside>
    </div>
  );
}
