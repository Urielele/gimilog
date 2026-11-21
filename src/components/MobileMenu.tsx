"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "cn";
import { ButtonLink } from "@/components/gm";
import { NavLink } from "@/components/nav-link";
import { LogoutButton } from "@/features/auth/components/LogoutButton";

export function MobileMenu({
  myGamesHref,
  signedIn,
}: {
  myGamesHref: string;
  signedIn: boolean;
}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const id = window.setTimeout(() => setOpen(false), 0);
    return () => window.clearTimeout(id);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    function onChange() {
      if (query.matches) setOpen(false);
    }
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const close = () => setOpen(false);
  const itemClass =
    "flex h-[52px] w-full items-center text-[20px] leading-[1.2] font-medium md:text-[20px] lg:text-[20px]";

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((value) => !value)}
        className="-mr-1.5 inline-flex size-11 shrink-0 items-center justify-center rounded-button text-ink transition-colors duration-150 hover:text-brown-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-900 lg:hidden"
      >
        {open ? (
          <X className="size-8" strokeWidth={2} aria-hidden="true" />
        ) : (
          <Menu className="size-8" strokeWidth={2} aria-hidden="true" />
        )}
      </button>

      <div
        aria-hidden="true"
        onClick={close}
        className={cn(
          "fixed inset-0 z-40 bg-ink/20 transition-opacity duration-150 ease-out lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <div
        id="mobile-menu"
        inert={!open}
        className={cn(
          "absolute inset-x-0 top-full z-50 origin-top border-t border-hairline bg-nav shadow-[0_8px_16px_rgba(80,50,30,0.18)] transition-[opacity,transform] duration-150 ease-out lg:hidden",
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible pointer-events-none -translate-y-1 opacity-0"
        )}
      >
        <div className="px-5 pt-2 pb-4 min-[400px]:px-8 md:px-6">
          <NavLink href={myGamesHref} onClick={close} className={itemClass}>
            My Games
          </NavLink>

          <div className="h-px bg-hairline" aria-hidden="true" />

          <NavLink href="/rekomendasi" onClick={close} className={itemClass}>
            Recommendations
          </NavLink>

          <div className="mt-4">
            {signedIn ? (
              <LogoutButton
                onDone={close}
                className="h-11 w-full text-[20px] leading-none"
              />
            ) : (
              <ButtonLink
                href="/login"
                onClick={close}
                className="h-11 w-full text-[20px] leading-none"
              >
                Sign In
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
