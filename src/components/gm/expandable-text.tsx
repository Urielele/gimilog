"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "cn";

// Tailwind tidak menemukan nama class yang dibangun secara dinamis, jadi daftar statis.
const clampClasses: Record<number, string> = {
  2: "line-clamp-2",
  3: "line-clamp-3",
  5: "line-clamp-5",
  8: "line-clamp-8",
};

export function ExpandableText({
  children,
  lines,
  moreLabel = "more..",
  lessLabel = "less",
  className,
}: {
  children: string;
  lines: number;
  moreLabel?: string;
  lessLabel?: string;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [truncated, setTruncated] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  // Reset saat teks berganti (pola React: sesuaikan state saat render).
  const [previousChildren, setPreviousChildren] = useState(children);
  if (previousChildren !== children) {
    setPreviousChildren(children);
    setExpanded(false);
  }

  useEffect(() => {
    const element = textRef.current;
    if (!element || expanded) return;

    const measure = () => {
      setTruncated(element.scrollHeight > element.clientHeight + 1);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    // Metrik baris berubah setelah font selesai dimuat.
    document.fonts?.ready.then(measure).catch(() => {});

    return () => observer.disconnect();
  }, [children, expanded, lines]);

  const showButton = truncated || expanded;
  const clampClass = clampClasses[lines] ?? clampClasses[3];

  return (
    <div className={cn("relative bg-page font-about text-text", className)}>
      <p
        ref={textRef}
        className={cn(
          "break-words whitespace-pre-line text-[clamp(16px,2vw,22px)] leading-[1.4]",
          !expanded && clampClass
        )}
      >
        {children}
      </p>

      {showButton && (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setExpanded((value) => !value);
          }}
          className={cn(
            "absolute right-0 bottom-0 min-h-11 bg-inherit pl-1 font-about text-[clamp(16px,2vw,22px)] leading-[1.4] font-bold whitespace-nowrap text-text transition-colors duration-150 hover:text-brown-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-900 sm:min-h-0",
            expanded && "static"
          )}
        >
          {expanded ? lessLabel : moreLabel}
        </button>
      )}
    </div>
  );
}
