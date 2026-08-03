"use client";

import * as React from "react";
import { useInView, useReducedMotion } from "motion/react";

import {
  benchmarks,
  BENCHMARK_DISCLAIMER,
  type BenchmarkGroup,
} from "@/data/benchmarks";
import { cn } from "@/lib/utils";
import { AnimatedBar } from "@/components/animated-bar";

function BarGroup({ group }: { group: BenchmarkGroup }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  const max = Math.max(...group.rows.map((r) => r.value));

  return (
    <div ref={ref} className="rounded-xl border border-border bg-surface p-6">
      <div className="mb-5 flex items-baseline justify-between">
        <h3 className="text-sm font-semibold">{group.title}</h3>
        <span className="font-mono text-xs text-muted-foreground">
          {group.unit} · {group.better === "lower" ? "lower is better" : "higher is better"}
        </span>
      </div>

      <div className="space-y-4">
        {group.rows.map((row, i) => {
          const pct = Math.max(4, (row.value / max) * 100);
          return (
            <div key={row.label}>
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <span
                  className={cn(
                    "truncate text-sm",
                    row.highlight
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {row.label}
                </span>
                <span
                  className={cn(
                    "shrink-0 font-mono text-sm tabular-nums",
                    row.highlight ? "text-brand" : "text-muted-foreground"
                  )}
                >
                  {row.value.toLocaleString()}
                </span>
              </div>
              <AnimatedBar
                pct={pct}
                inView={inView}
                reduce={reduce}
                index={i}
                highlight={row.highlight}
                baseDelay={0.1}
                stagger={0.12}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function BenchmarkBars() {
  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2">
        {benchmarks.map((g) => (
          <BarGroup key={g.id} group={g} />
        ))}
      </div>
      <p className="mt-6 text-center font-mono text-xs text-muted-foreground">
        {BENCHMARK_DISCLAIMER}
      </p>
    </div>
  );
}
