import { notFound } from "next/navigation";
import { TextLink } from "@/components/gm";
import { ReviewRow } from "@/features/profile/components/ReviewRow";
import {
  getProfileByUsername,
  getReviews,
} from "@/features/profile/lib/queries";
import { redirectLegacyTab } from "@/features/profile/lib/redirect-legacy-tab";

export default async function ReviewsPage({
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

  const reviews = await getReviews(profile.id, 100);

  return (
    <section>
      <p className="mb-4 text-[16px] leading-[1.4] text-text-soft">
        Showing {reviews.length} review{reviews.length === 1 ? "" : "s"}
      </p>

      {reviews.length ? (
        <ul>
          {reviews.map((review) => (
            <ReviewRow key={review.id} review={review} lines={5} />
          ))}
        </ul>
      ) : (
        <p className="text-[16px] leading-[1.4] text-text-soft">
          No reviews yet. <TextLink href="/search">Find a game</TextLink>
        </p>
      )}
    </section>
  );
}
