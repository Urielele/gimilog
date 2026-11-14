"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Gamepad2,
  Loader2,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

/* DESIGN2 tokens
   primary #FF6B00 · secondary #7C3AED · tertiary #2563EB
   surface #F8FAFC · neutral #FFFFFF
   radius: sm 12px · md 24px                                          */

const INK = "#171525";
const MUTED = "#64748B";
const BORDER = "rgba(23, 21, 37, 0.08)";
const CARD_SHADOW = "0 2px 12px rgba(0, 0, 0, 0.06)";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isRegister = mode === "register";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    const supabase = createClient();
    const credentials = { email: email.trim(), password };

    try {
      if (isRegister) {
        const { data, error } = await supabase.auth.signUp(credentials);
        if (error) throw error;

        // Kalau "Confirm email" masih aktif, belum ada session.
        if (!data.session) {
          toast.success("Account created. Check your email to confirm it.");
          router.push("/login");
          return;
        }

        toast.success("Account created. Welcome to Gimilog!");
      } else {
        const { error } = await supabase.auth.signInWithPassword(credentials);
        if (error) throw error;
        toast.success("Signed in successfully");
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="relative min-h-[100dvh] overflow-hidden bg-[#F8FAFC]"
      style={{ color: INK }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 size-[480px] rounded-full opacity-40 blur-[120px]"
        style={{ background: "radial-gradient(circle, #FFD6B8 0%, transparent 70%)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 -right-40 size-[520px] rounded-full opacity-40 blur-[120px]"
        style={{ background: "radial-gradient(circle, #DDD1FE 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-[1280px] items-center justify-center px-6 py-16">
        <div className="w-full max-w-[440px]">
          <div
            className="rounded-[24px] border bg-white p-8 md:p-10"
            style={{ borderColor: BORDER, boxShadow: CARD_SHADOW }}
          >
            <div
              className="flex size-12 items-center justify-center rounded-[12px]"
              style={{ background: "linear-gradient(135deg, #FF6B00, #7C3AED)" }}
            >
              <Gamepad2 className="size-6 text-white" />
            </div>

            <span
              className="mt-6 inline-flex items-center rounded-full border px-3 py-1 text-[0.75rem] font-medium tracking-[0.02em]"
              style={{ borderColor: BORDER, color: "#7C3AED" }}
            >
              {isRegister ? "Create account" : "Welcome back"}
            </span>

            <h1
              className="mt-3 text-[1.75rem] font-bold leading-[1.15] tracking-[-0.02em]"
              style={{ letterSpacing: "-0.02em" }}
            >
              {isRegister ? "Join Gimilog" : "Sign in to Gimilog"}
            </h1>
            <p className="mt-2 text-[0.95rem] leading-[1.6]" style={{ color: MUTED }}>
              {isRegister
                ? "Track your backlog, review games, and find what to play next."
                : "Pick up where you left off and keep your backlog moving."}
            </p>

            <form className="mt-7 flex flex-col gap-4" onSubmit={onSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="text-[0.8125rem] font-medium tracking-[0.02em]"
                >
                  Email
                </label>
                <div className="relative mt-2">
                  <Mail
                    className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2"
                    style={{ color: "#94A3B8" }}
                  />
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-12 w-full rounded-[12px] border bg-white pl-11 pr-4 text-[0.95rem] outline-none transition-shadow duration-200 placeholder:text-[#94A3B8] focus:ring-2 focus:ring-[#FF6B00] focus:ring-offset-2"
                    style={{ borderColor: "#E2E8F0", color: INK }}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="text-[0.8125rem] font-medium tracking-[0.02em]"
                >
                  Password
                </label>
                <div className="relative mt-2">
                  <LockKeyhole
                    className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2"
                    style={{ color: "#94A3B8" }}
                  />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    autoComplete={isRegister ? "new-password" : "current-password"}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-12 w-full rounded-[12px] border bg-white pl-11 pr-12 text-[0.95rem] outline-none transition-shadow duration-200 placeholder:text-[#94A3B8] focus:ring-2 focus:ring-[#FF6B00] focus:ring-offset-2"
                    style={{ borderColor: "#E2E8F0", color: INK }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-[10px] transition-colors hover:bg-[#FFF4EC]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" style={{ color: MUTED }} />
                    ) : (
                      <Eye className="size-4" style={{ color: MUTED }} />
                    )}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div
                  role="alert"
                  className="rounded-[12px] border px-4 py-3 text-[0.875rem] leading-[1.5]"
                  style={{
                    borderColor: "rgba(220, 38, 38, 0.25)",
                    backgroundColor: "rgba(220, 38, 38, 0.06)",
                    color: "#B91C1C",
                  }}
                >
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[12px] bg-[#FF6B00] px-5 text-[0.95rem] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#E66000] hover:shadow-[0_6px_16px_rgba(255,107,0,0.28)] active:translate-y-px disabled:pointer-events-none disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {isRegister ? "Create account" : "Sign in"}
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-[0.875rem]" style={{ color: MUTED }}>
            {isRegister ? "Already have an account?" : "New to Gimilog?"}{" "}
            <Link
              href={isRegister ? "/login" : "/register"}
              className="font-semibold text-[#FF6B00] underline-offset-4 hover:underline"
            >
              {isRegister ? "Sign in" : "Create an account"}
            </Link>
          </p>

          <p className="mt-3 text-center text-[0.8125rem]">
            <Link
              href="/"
              className="underline-offset-4 transition-colors hover:text-[#FF6B00] hover:underline"
              style={{ color: MUTED }}
            >
              Back to home
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
