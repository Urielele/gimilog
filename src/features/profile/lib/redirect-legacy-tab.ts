import { redirect } from "next/navigation";

// Tautan lama memakai parameter tab review / backlog. Kini tiap tab punya rute sendiri.
export function redirectLegacyTab(
  username: string,
  tab: string | undefined
): void {
  if (tab === "review") redirect(`/u/${username}/reviews`);
  if (tab === "backlog") redirect(`/u/${username}/games`);
}
