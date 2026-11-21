import { Suspense } from "react";
import { notFound } from "next/navigation";
import { GamesCollection } from "@/features/profile/components/GamesCollection";
import {
  getGamesCollection,
  getProfileByUsername,
} from "@/features/profile/lib/queries";
import { redirectLegacyTab } from "@/features/profile/lib/redirect-legacy-tab";

export default async function GamesPage({
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

  const games = await getGamesCollection(profile.id);

  return (
    <Suspense fallback={<p className="text-[16px] text-text-soft">Loading games…</p>}>
      <GamesCollection games={games} />
    </Suspense>
  );
}
