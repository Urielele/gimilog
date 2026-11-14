import Link from "next/link";
import { Gamepad2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/features/auth/components/LogoutButton";
import { ButtonLink } from "@/components/gm";

const navItemClass =
  "inline-flex h-11 items-center rounded-none px-4 text-xs font-semibold text-muted transition-colors duration-150 hover:bg-primary-tint hover:text-primary-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

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

  return (
    <nav className="sticky top-0 z-[100] border-b border-hairline-soft bg-canvas">
      <div className="mx-auto flex h-16 w-full max-w-[896px] items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex h-11 items-center gap-2 rounded-none text-base font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Gamepad2 className="size-4 text-ink" aria-hidden="true" />
            Gimilog
          </Link>

          <div className="hidden items-center text-xs font-semibold md:flex">
            <Link href="/search" className={navItemClass}>
              Games
            </Link>
            <Link href="/rekomendasi" className={navItemClass}>
              Recommendation
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                href={username ? `/u/${username}` : "/"}
                className="inline-flex h-11 max-w-24 items-center truncate rounded-none border border-hairline px-4 text-xs font-semibold text-ink transition-colors duration-150 hover:border-primary-text hover:text-primary-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:max-w-44"
              >
                {username ? `@${username}` : user.email}
              </Link>
              <Link
                href="/settings"
                className={`${navItemClass} hidden sm:inline-flex`}
              >
                Settings
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex h-11 items-center rounded-none px-4 text-xs font-semibold text-ink transition-colors duration-150 hover:bg-primary-tint hover:text-primary-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Sign in
              </Link>
              <ButtonLink href="/register">Create account</ButtonLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
