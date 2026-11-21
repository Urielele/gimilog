import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/features/auth/components/LogoutButton";
import { ButtonLink } from "@/components/gm";
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

  const links = (
    <>
      <NavLink href="/">Home</NavLink>
      <NavLink href={myGamesHref}>My Games</NavLink>
      <NavLink href="/rekomendasi">Recommendations</NavLink>
    </>
  );

  return (
    <nav className="bg-nav">
      <div className="mx-auto w-full max-w-[1070px] px-6">
        <div className="flex h-16 items-center justify-between gap-4 md:h-20">
          <div className="flex min-w-0 items-center gap-8 md:gap-[50px]">
            <Link
              href="/"
              className="font-logo shrink-0 text-[32px] leading-none text-ink sm:text-[48px]"
            >
              Gimilog
            </Link>

            <div className="hidden pt-4 items-center gap-[48px] md:flex">
              {links}
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

        <div className="flex gap-8 overflow-x-auto pb-3 md:hidden">{links}</div>
      </div>
    </nav>
  );
}
