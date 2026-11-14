import type { Metadata } from "next";
import { ButtonLink, Container, PageShell } from "@/components/gm";

export const metadata: Metadata = {
  title: "Page not found — Gimilog",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <PageShell>
      <Container className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center py-16 text-center">
        <h1 className="text-display font-semibold text-ink">
          Page not found
        </h1>
        <p className="mt-2 max-w-[480px] text-base leading-[1.5] text-muted">
          The page you are looking for does not exist or has been moved.
        </p>

        <ButtonLink href="/" className="mt-8">
          Back to home
        </ButtonLink>
      </Container>
    </PageShell>
  );
}
