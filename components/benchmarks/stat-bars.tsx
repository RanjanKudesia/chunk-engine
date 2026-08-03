"use client";

import * as React from "react";
import { useInView, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { AnimatedBar } from "@/components/animated-bar";

export interface StatBarRow {
  label: string;
  value: number;
  highlight?: boolean;
}

/** Reusable animated horizontal bar chart (bars fill on scroll into view). */
export function StatBars({
  rows,
  unit,
  format = (v) => v.toLocaleString(),
}: {
  rows: StatBarRow[];
  unit?: string;
  format?: (v: number) => string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const max = Math.max(...rows.map((r) => r.value));

  return (
    <div ref={ref} className="space-y-3">
      {rows.map((row, i) => {
        const pct = Math.max(3, (row.value / max) * 100);
        return (
          <div key={row.label}>
            <div className="mb-1 flex items-center justify-between gap-3 text-sm">
              <span
                className={cn(
                  "truncate",
                  row.highlight
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {row.label}
              </span>
              <span
                className={cn(
                  "shrink-0 font-mono tabular-nums",
                  row.highlight ? "text-brand" : "text-muted-foreground"
                )}
              >
                {format(row.value)}
                {unit ? <span className="ml-1 text-xs">{unit}</span> : null}
              </span>
            </div>
            <AnimatedBar
              pct={pct}
              inView={inView}
              reduce={reduce}
              index={i}
              highlight={row.highlight}
              duration={0.8}
              stagger={0.08}
            />
          </div>
        );
      })}
    </div>
  );
}
