import type { Metadata } from "next";
import { AuthForm } from "@/features/auth/components/AuthForm";

export const metadata: Metadata = {
  title: "Sign in — Gimilog",
  description: "Sign in to manage your game backlog and reviews.",
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
