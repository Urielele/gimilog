import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/features/auth/components/LogoutButton";
import { ButtonLink } from "@/components/gm";
import { MobileMenu } from "@/components/MobileMenu";
import { NavLink } from "@/components/nav-link";

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let username: string | null = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .maybeSingle();
    username = (data as { username?: string } | null)?.username ?? null;
  }

  const myGamesHref =
    user && username ? `/u/${username}/games` : "/login";

  return (
    <nav className="relative bg-nav">
      <div className="mx-auto w-full max-w-[1070px] px-5 min-[400px]:px-8 md:px-6">
        <div className="flex h-14 items-center justify-between gap-4 lg:hidden">
          <Link
            href="/"
            className="font-logo shrink-0 text-[32px] leading-none text-ink"
          >
            Gimilog
          </Link>
          <MobileMenu myGamesHref={myGamesHref} signedIn={Boolean(user)} />
        </div>

        <div className="hidden h-16 items-center justify-between gap-4 md:h-20 lg:flex">
          <div className="flex min-w-0 items-center gap-8 md:gap-[50px]">
            <Link
              href="/"
              className="font-logo shrink-0 text-[32px] leading-none text-ink sm:text-[48px]"
            >
              Gimilog
            </Link>

            <div className="hidden pt-4 items-center gap-[48px] lg:flex">
              <NavLink href="/">Home</NavLink>
              <NavLink href={myGamesHref}>My Games</NavLink>
              <NavLink href="/rekomendasi">Recommendations</NavLink>
            </div>
          </div>

          <div className="flex shrink-0 items-center">
            {user ? (
              <LogoutButton />
            ) : (
              <ButtonLink
                href="/login"
                className="h-[38px] rounded-button px-4 text-[22px] leading-none font-medium"
              >
                Sign In
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
