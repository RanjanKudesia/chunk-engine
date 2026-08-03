"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import {
  sampleDoc,
  visualizerModes,
  contentTypeColors,
} from "@/data/visualizer";
import { cn } from "@/lib/utils";

const kindLabel: Record<string, string> = {
  heading: "H",
  paragraph: "¶",
  table: "⊞",
  bullet_list: "•",
  code_block: "</>",
};

export function ChunkVisualizer() {
  const [modeIdx, setModeIdx] = React.useState(0);
  const [hovered, setHovered] = React.useState<number | null>(null);
  const reduce = useReducedMotion();
  const mode = visualizerModes[modeIdx];

  // Which chunk (index) owns a given source block, for the current mode.
  const blockToChunks = React.useMemo(() => {
    const map = new Map<number, number[]>();
    mode.chunks.forEach((c, ci) => {
      c.blocks.forEach((b) => {
        map.set(b, [...(map.get(b) ?? []), ci]);
      });
    });
    return map;
  }, [mode]);

  const usedTypes = React.useMemo(
    () => Array.from(new Set(mode.chunks.map((c) => c.contentType))),
    [mode]
  );

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      {/* Mode toggle */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="mr-1 font-mono text-xs text-muted-foreground">
          mode=
        </span>
        {visualizerModes.map((m, i) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setModeIdx(i)}
            className={cn(
              "rounded-md px-2.5 py-1 font-mono text-xs transition-colors",
              i === modeIdx
                ? "bg-brand/10 text-brand ring-1 ring-inset ring-brand/25"
                : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Left: source document */}
        <div className="rounded-xl border border-border bg-background/50 p-3">
          <div className="mb-2 px-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            report.pdf
          </div>
          <div className="space-y-1">
            {sampleDoc.map((block) => {
              const owners = blockToChunks.get(block.id) ?? [];
              const isHot = hovered !== null && owners.includes(hovered);
              const primary = owners[0];
              const color =
                primary != null
                  ? contentTypeColors[mode.chunks[primary].contentType]
                  : "transparent";
              return (
                <div
                  key={block.id}
                  className={cn(
                    "flex gap-2 rounded-md border-l-2 py-1.5 pl-2 pr-1 text-xs transition-all",
                    block.kind === "heading" && "font-semibold"
                  )}
                  style={{
                    borderColor: color,
                    background: isHot
                      ? `color-mix(in srgb, ${color} 14%, transparent)`
                      : "transparent",
                  }}
                >
                  <span className="mt-px shrink-0 font-mono text-[10px] text-muted-foreground">
                    {kindLabel[block.kind]}
                  </span>
                  <span className="whitespace-pre-line text-foreground/90">
                    {block.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: chunk blocks */}
        <div className="rounded-xl border border-border bg-background/50 p-3">
          <div className="mb-2 flex items-center justify-between px-1">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              chunks
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">
              {mode.chunks.length} chunks
            </span>
          </div>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {mode.chunks.map((chunk, ci) => {
                const color = contentTypeColors[chunk.contentType];
                return (
                  <motion.div
                    key={`${mode.id}-${ci}`}
                    layout={!reduce}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.25, delay: reduce ? 0 : ci * 0.03 }}
                    onMouseEnter={() => setHovered(ci)}
                    onMouseLeave={() => setHovered(null)}
                    className="cursor-default rounded-lg border p-2.5"
                    style={{
                      borderColor: `color-mix(in srgb, ${color} 40%, transparent)`,
                      background: `color-mix(in srgb, ${color} 8%, transparent)`,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="size-2 shrink-0 rounded-full"
                        style={{ background: color }}
                      />
                      <span
                        className="font-mono text-[11px]"
                        style={{ color }}
                      >
                        {chunk.contentType}
                      </span>
                    </div>
                    <p className="mt-1 truncate pl-4 text-xs text-foreground/80">
                      {chunk.label}
                    </p>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mode note + legend */}
      <p className="mt-4 text-sm text-muted-foreground">{mode.note}</p>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {usedTypes.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground"
          >
            <span
              className="size-2 rounded-full"
              style={{ background: contentTypeColors[t] }}
            />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
