import { cn } from "@/lib/utils";

/**
 * chunk-engine mark: four staggered "chunk" bars in the brand gradient —
 * language-neutral (it means chunking, not any one runtime). Refreshed from the
 * three-bar chunk-engine mark.
 */
export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="ce-mark" x1="0" y1="0" x2="22" y2="22">
            <stop stopColor="#e8511e" />
            <stop offset="1" stopColor="#ff7a3c" />
          </linearGradient>
        </defs>
        <rect x="0" y="1" width="22" height="4" rx="1.5" fill="url(#ce-mark)" />
        <rect x="0" y="7" width="15" height="4" rx="1.5" fill="url(#ce-mark)" opacity="0.8" />
        <rect x="0" y="13" width="19" height="4" rx="1.5" fill="url(#ce-mark)" opacity="0.6" />
        <rect x="0" y="19" width="11" height="4" rx="1.5" fill="url(#ce-mark)" opacity="0.4" />
      </svg>
      {showWordmark ? (
        <span className="font-mono text-[15px] font-semibold tracking-tight">
          chunk<span className="text-brand">-</span>engine
        </span>
      ) : null}
    </span>
  );
}
