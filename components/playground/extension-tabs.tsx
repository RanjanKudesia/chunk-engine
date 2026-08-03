"use client";

import { playgroundExts } from "@/data/playground";
import { cn } from "@/lib/utils";

export function ExtensionTabs({
  ext,
  onSelect,
}: {
  ext: string;
  onSelect: (ext: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {playgroundExts.map((e) => (
        <button
          key={e.ext}
          type="button"
          disabled={!e.enabled}
          onClick={() => e.enabled && onSelect(e.ext)}
          title={e.enabled ? undefined : "Coming soon"}
          className={cn(
            "rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors",
            e.ext === ext
              ? "border-brand/40 bg-brand/10 text-brand"
              : e.enabled
                ? "border-border text-muted-foreground hover:text-foreground"
                : "cursor-not-allowed border-border/60 text-muted-foreground/40"
          )}
        >
          {e.label}
          {!e.enabled ? <span className="ml-1.5 opacity-70">soon</span> : null}
        </button>
      ))}
    </div>
  );
}
