import type { ReactNode } from "react";
import { cn } from "cn";

export function PageShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main
      className={cn("min-h-[100dvh] bg-surface text-ink", className)}
    >
      {children}
    </main>
  );
}

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[896px] px-6", className)}>
      {children}
    </div>
  );
}

export function SectionHeading({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "text-2xl leading-[1.25] font-semibold text-ink",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("bg-surface-raised", className)}
    />
  );
}
