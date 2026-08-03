"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";

import { contentTypeColor } from "@/data/playground";
import type { PlaygroundChunk } from "@/lib/playground/engine";
import { cn } from "@/lib/utils";

export function ChunkCard({
  chunk,
  index,
  active,
  onActivate,
  onLeave,
  onSelect,
}: {
  chunk: PlaygroundChunk;
  index: number;
  active?: boolean;
  onActivate?: (index: number) => void;
  onLeave?: () => void;
  onSelect?: (index: number) => void;
}) {
  const [showMeta, setShowMeta] = React.useState(false);
  const color = contentTypeColor(chunk.contentType);
  const metaKeys = Object.keys(chunk.metadata ?? {});

  return (
    <div
      onMouseEnter={() => onActivate?.(index)}
      onMouseLeave={() => onLeave?.()}
      onClick={() => onSelect?.(index)}
      className={cn(
        "cursor-pointer rounded-lg border border-border bg-surface transition-shadow",
        active && "ring-2"
      )}
      style={{
        borderLeftColor: color,
        borderLeftWidth: 3,
        ...(active
          ? ({ "--tw-ring-color": color } as React.CSSProperties)
          : {}),
      }}
    >
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            #{index}
          </span>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[11px]"
            style={{
              color,
              background: `color-mix(in srgb, ${color} 12%, transparent)`,
            }}
          >
            <span className="size-1.5 rounded-full" style={{ background: color }} />
            {chunk.contentType}
          </span>
        </div>
        <span className="font-mono text-[11px] text-muted-foreground">
          {chunk.content.length} chars
        </span>
      </div>

      <div className="max-h-48 overflow-auto border-t border-border/60 px-3 py-2">
        <p className="whitespace-pre-wrap break-words text-sm text-foreground/90">
          {chunk.content}
        </p>
      </div>

      {metaKeys.length > 0 ? (
        <div className="border-t border-border/60">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowMeta((v) => !v);
            }}
            className="flex w-full items-center gap-1.5 px-3 py-2 text-left font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronRight
              className={cn("size-3 transition-transform", showMeta && "rotate-90")}
            />
            metadata · {metaKeys.length} field{metaKeys.length === 1 ? "" : "s"}
          </button>
          {showMeta ? (
            <pre className="max-h-56 overflow-auto border-t border-border/60 bg-background/50 px-3 py-2 font-mono text-[11px] leading-relaxed text-foreground/80">
              {JSON.stringify(chunk.metadata, null, 2)}
            </pre>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
