import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Container, PageShell } from "@/components/gm";
import { ProfileHeader } from "@/features/profile/components/ProfileHeader";
import { ProfileTabs } from "@/features/profile/components/ProfileTabs";
import {
  getProfileByUsername,
  getProfileStats,
} from "@/features/profile/lib/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  return { title: `${username} — Gimilog` };
}

export default async function ProfileLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);
  if (!profile) notFound();

  const stats = await getProfileStats(profile.id);

  return (
    <PageShell>
      <Container className="pt-12 pb-24">
        <ProfileHeader profile={profile} stats={stats} />
        <ProfileTabs username={username} />
        <div className="mt-10">{children}</div>
      </Container>
    </PageShell>
  );
}
