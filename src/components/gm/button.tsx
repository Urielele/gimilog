import Link from "next/link";
import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

export const buttonStyles = cva(
  "inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-button px-4 text-xs leading-[1.5] whitespace-nowrap transition-colors duration-150 outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-900 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-brown-900 text-on-brown shadow-button hover:bg-brown-900-hover",
        secondary:
          "border border-brown-900 bg-transparent text-brown-900 hover:bg-primary-tint",
        destructive:
          "border border-error-border bg-transparent text-error hover:bg-error-tint",
        ghost:
          "text-brown-900 hover:bg-primary-tint hover:text-brown-900-hover",
        status:
          "bg-brown-500 text-on-brown font-medium shadow-button hover:bg-brown-500-hover",
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
