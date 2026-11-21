import { CalendarDays } from "lucide-react";
import { CircleAvatar, ExpandableText } from "@/components/gm";
import { formatMemberSince } from "../lib/format";
import type { Profile, ProfileStats } from "../lib/queries";

export function ProfileHeader({
  profile,
  stats,
}: {
  profile: Profile;
  stats: ProfileStats;
}) {
  const joined = formatMemberSince(profile.created_at);
  const items: { label: string; value: number }[] = [
    { label: "Games", value: stats.games },
    { label: "This year", value: stats.thisYear },
    { label: "Reviews", value: stats.reviews },
    { label: "Wishlist", value: stats.wishlist },
  ];

  return (
    <header>
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between md:gap-10">
        <div className="flex min-w-0 items-center gap-4 sm:gap-6">
          <CircleAvatar name={profile.username} src={profile.avatar_url} />

          <div className="min-w-0">
            <h1 className="text-[28px] leading-[1.2] font-bold break-words text-ink sm:text-[32px]">
              {profile.username}
            </h1>

            <div className="mt-2 min-w-0 space-y-1">
              {profile.bio && (
                <ExpandableText
                  lines={2}
                  className="max-w-[520px] font-sans text-[16px] [&_button]:text-[16px] [&_p]:text-[16px] [&_p]:leading-[1.4]"
                >
                  {profile.bio}
                </ExpandableText>
              )}

              {joined && (
                <p className="inline-flex items-center gap-1.5 text-[14px] leading-[1.4] text-text-soft">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  Member since {joined}
                </p>
              )}
            </div>
          </div>
        </div>

        <dl className="grid w-full shrink-0 grid-cols-4 gap-0 sm:w-auto">
          {items.map((item, index) => (
            <div
              key={item.label}
              className={`px-3 first:pl-0 last:pr-0 sm:px-6 ${
                index === 0 ? "" : "border-l border-divider"
              }`}
            >
              <dt className="text-[10px] leading-[1.4] font-semibold uppercase tracking-[0.08em] text-text-soft">
                {item.label}
              </dt>
              <dd className="mt-1 text-[24px] leading-none font-bold text-ink sm:text-[28px]">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}
