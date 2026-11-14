import type { ComponentProps } from "react";
import { cn } from "cn";

export const labelClass = "block text-xs font-semibold text-ink";

const fieldBase =
  "w-full rounded-[2px] border border-hairline bg-canvas text-base text-ink outline-none transition-colors duration-150 placeholder:text-placeholder focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50";

export const inputClass = cn(fieldBase, "h-11 px-4");
export const selectClass = cn(fieldBase, "h-11 cursor-pointer px-4");
export const textareaClass = cn(fieldBase, "min-h-32 resize-y p-4 leading-[1.5]");

export function Label({ className, ...props }: ComponentProps<"label">) {
  return <label className={cn(labelClass, className)} {...props} />;
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(inputClass, className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(textareaClass, className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(selectClass, className)} {...props} />;
}
