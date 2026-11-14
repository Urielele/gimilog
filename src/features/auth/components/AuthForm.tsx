"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import {
  Button,
  Card,
  Container,
  Input,
  Label,
  PageShell,
  TextLink,
} from "@/components/gm";

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
    <PageShell>
      <Container className="flex min-h-[calc(100dvh-4rem)] items-center justify-center py-16">
        <div className="w-full max-w-[440px]">
          <Card className="p-8">
            <h1 className="text-2xl leading-[1.25] font-semibold text-ink">
              {isRegister ? "Join Gimilog" : "Sign in to Gimilog"}
            </h1>
            <p className="mt-2 text-base leading-[1.5] text-muted">
              {isRegister
                ? "Track games, keep a backlog, and post reviews."
                : "Manage your backlog and reviews."}
            </p>

            <form className="mt-6 flex flex-col gap-4" onSubmit={onSubmit}>
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-2">
                  <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                    <Mail className="size-4 text-placeholder" aria-hidden="true" />
                  </span>
                  <Input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-12 pl-12"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-2">
                  <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                    <LockKeyhole
                      className="size-4 text-placeholder"
                      aria-hidden="true"
                    />
                  </span>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    autoComplete={
                      isRegister ? "new-password" : "current-password"
                    }
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-12 pr-12 pl-12"
                  />
                  <span className="absolute inset-y-0 right-1 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="flex size-11 items-center justify-center rounded-none text-muted transition-colors duration-150 hover:bg-primary-tint hover:text-primary-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      aria-pressed={showPassword}
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" aria-hidden="true" />
                      ) : (
                        <Eye className="size-4" aria-hidden="true" />
                      )}
                    </button>
                  </span>
                </div>
              </div>

              {errorMessage && (
                <div
                  role="alert"
                  className="rounded-none border border-error-border bg-error-tint p-4 text-base leading-[1.5] text-error-text"
                >
                  {errorMessage}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="mt-1 h-12 w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Processing...
                  </>
                ) : (
                  <>
                    {isRegister ? "Create account" : "Sign in"}
                    <ArrowRight aria-hidden="true" />
                  </>
                )}
              </Button>
            </form>
          </Card>

          <p className="mt-6 text-center text-xs text-muted">
            {isRegister ? "Already have an account?" : "New to Gimilog?"}{" "}
            <TextLink href={isRegister ? "/login" : "/register"}>
              {isRegister ? "Sign in" : "Create an account"}
            </TextLink>
          </p>

          <p className="mt-2 text-center">
            <Link
              href="/"
              className="inline-flex h-11 items-center text-xs text-primary-text underline underline-offset-4 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Back to home
            </Link>
          </p>
        </div>
      </Container>
    </PageShell>
  );
}
