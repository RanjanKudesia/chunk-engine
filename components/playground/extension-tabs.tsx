"use client";

import { playgroundExts } from "@/data/playground";
import { cn } from "@/lib/utils";

/** Format picker — a group of toggle buttons, one pressed at a time.
 * Plain buttons with `aria-pressed` (not a tablist: there is no roving
 * focus / arrow-key behavior, so tab semantics would over-promise). */
export function ExtensionTabs({
  ext,
  onSelect,
}: {
  ext: string;
  onSelect: (ext: string) => void;
}) {
  return (
    <div role="group" aria-label="Document format" className="flex flex-wrap gap-2">
      {playgroundExts.map((e) => (
        <button
          key={e.ext}
          type="button"
          aria-pressed={e.ext === ext}
          onClick={() => onSelect(e.ext)}
          className={cn(
            "rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors",
            e.ext === ext
              ? "border-brand/40 bg-brand/10 text-brand"
              : "border-border text-muted-foreground hover:text-foreground"
          )}
        >
          {e.label}
        </button>
      ))}
    </div>
  );
}
