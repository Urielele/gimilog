import type { Metadata } from "next";
import { AuthForm } from "@/features/auth/components/AuthForm";

export const metadata: Metadata = {
  title: "Create account — Gimilog",
  description: "Create a Gimilog account to track and review your games.",
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
