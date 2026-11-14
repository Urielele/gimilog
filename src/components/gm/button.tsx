import Link from "next/link";
import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

export const buttonStyles = cva(
  "inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-none px-4 text-xs leading-[1.5] whitespace-nowrap transition-colors duration-150 outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-ink hover:bg-primary-hover",
        secondary:
          "border border-hairline bg-canvas text-ink hover:border-primary-text hover:text-primary-text",
        destructive:
          "border border-error-border bg-canvas text-error-text hover:bg-error-tint",
        ghost:
          "text-muted hover:bg-primary-tint hover:text-primary-text",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

type ButtonProps = ComponentProps<"button"> & VariantProps<typeof buttonStyles>;

export function Button({ className, variant, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonStyles({ variant }), className)}
      {...props}
    />
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & VariantProps<typeof buttonStyles>;

export function ButtonLink({ className, variant, ...props }: ButtonLinkProps) {
  return <Link className={cn(buttonStyles({ variant }), className)} {...props} />;
}
