"use client";

import * as React from "react";
import { useInView, useReducedMotion } from "motion/react";

import { formatCoverage } from "@/data/benchmarks";
import { cn } from "@/lib/utils";
import { AnimatedBar } from "@/components/animated-bar";

/** Format coverage bars — scaled to the full 36-format denominator. */
export function CoverageBars() {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const { of, rows } = formatCoverage;

  return (
    <div
      ref={ref}
      className="mx-auto max-w-2xl rounded-xl border border-border bg-surface p-6"
    >
      <div className="space-y-3.5">
        {rows.map((row, i) => {
          const pct = (row.value / of) * 100;
          return (
            <div key={row.tool}>
              <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                <span
                  className={cn(
                    "truncate",
                    row.highlight
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {row.tool}
                  {row.note ? (
                    <span className="ml-2 text-xs text-muted-foreground/70">
                      {row.note}
                    </span>
                  ) : null}
                </span>
                <span
                  className={cn(
                    "shrink-0 font-mono tabular-nums",
                    row.highlight ? "text-brand" : "text-muted-foreground"
                  )}
                >
                  {row.value}
                  <span className="text-xs text-muted-foreground/70">/{of}</span>
                </span>
              </div>
              <AnimatedBar
                pct={pct}
                inView={inView}
                reduce={reduce}
                index={i}
                highlight={row.highlight}
              />
            </div>
          );
        })}
      </div>
      <p className="mt-5 text-xs text-muted-foreground">
        Text-splitters (LangChain, semchunk, Chonkie, semantic-text-splitter) read
        no files directly — they always chunk markitdown&apos;s extracted text.
      </p>
    </div>
  );
}
