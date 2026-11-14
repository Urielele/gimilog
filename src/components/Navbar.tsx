import Link from "next/link";
import { Gamepad2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/features/auth/components/LogoutButton";

/* DESIGN2 tokens
   primary #FF6B00 · secondary #7C3AED
   radius: sm 12px                                                   */

const INK = "#171525";
const MUTED = "#64748B";
const BORDER = "rgba(23, 21, 37, 0.08)";

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
    <nav
      className="sticky top-0 z-[100] border-b bg-white/95 backdrop-blur"
      style={{ borderColor: BORDER }}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-[1.0625rem] font-bold tracking-[-0.01em]"
            style={{ color: INK }}
          >
            <span
              className="flex size-8 items-center justify-center rounded-[12px]"
              style={{ background: "linear-gradient(135deg, #FF6B00, #7C3AED)" }}
            >
              <Gamepad2 className="size-[18px] text-white" />
            </span>
            Gimilog
          </Link>

          <div className="hidden items-center gap-1 text-[0.875rem] font-medium md:flex">
            <Link
              href="/search"
              className="rounded-[10px] px-3 py-2 transition-colors duration-200 hover:bg-[#FFF4EC] hover:text-[#FF6B00]"
              style={{ color: MUTED }}
            >
              Games
            </Link>
            <Link
              href="/rekomendasi"
              className="rounded-[10px] px-3 py-2 transition-colors duration-200 hover:bg-[#FFF4EC] hover:text-[#FF6B00]"
              style={{ color: MUTED }}
            >
              Recommendation
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[0.875rem]">
          {user ? (
            <>
              <Link
                href={username ? `/u/${username}` : "/"}
                className="inline-flex h-9 max-w-[180px] items-center truncate rounded-full border px-3 font-medium transition-colors duration-200 hover:border-[#FF6B00] hover:text-[#FF6B00]"
                style={{ borderColor: BORDER, color: INK }}
              >
                {username ? `@${username}` : user.email}
              </Link>
              <Link
                href="/settings"
                className="hidden h-9 items-center rounded-[12px] px-3 font-medium transition-colors duration-200 hover:bg-[#FFF4EC] hover:text-[#FF6B00] sm:inline-flex"
                style={{ color: MUTED }}
              >
                Settings
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex h-9 items-center rounded-[12px] px-3 font-medium transition-colors duration-200 hover:bg-[#FFF4EC] hover:text-[#FF6B00]"
                style={{ color: INK }}
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="inline-flex h-9 items-center rounded-[12px] bg-[#FF6B00] px-4 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#E66000] hover:shadow-[0_6px_16px_rgba(255,107,0,0.28)]"
              >
                Create account
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
