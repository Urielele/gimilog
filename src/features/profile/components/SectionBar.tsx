import { TextLink } from "@/components/gm";

export function SectionBar({
  title,
  actionLabel,
  actionHref,
}: {
  title: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-divider pb-2">
      <h2 className="text-sm leading-[1.4] font-normal uppercase tracking-[0.08em] text-text-soft">
        {title}
      </h2>
      {actionLabel && actionHref && (
        <TextLink href={actionHref} className="text-xs uppercase tracking-[0.08em]">
          {actionLabel}
        </TextLink>
      )}
    </div>
  );
}
