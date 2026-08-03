"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Shared animated fill bar: a rounded track with a width-filling bar that
 * animates once its group scrolls into view. The three bar charts
 * (landing benchmark bars, stat bars, coverage bars) all render this — they
 * own the labels/scaling and pass the shared motion signals down.
 *
 * `inView` and `reduce` come from the parent group so every bar in a group
 * shares one trigger and staggers by `index`.
 */
export function AnimatedBar({
  pct,
  inView,
  reduce,
  index = 0,
  highlight = false,
  duration = 0.9,
  baseDelay = 0,
  stagger = 0.1,
}: {
  /** Target width as a percentage (0–100). */
  pct: number;
  inView: boolean;
  /** From `useReducedMotion()` — when true, the bar renders filled, no motion. */
  reduce: boolean | null;
  index?: number;
  highlight?: boolean;
  duration?: number;
  baseDelay?: number;
  stagger?: number;
}) {
  return (
    <div className="h-2.5 overflow-hidden rounded-full bg-surface-2">
      <motion.div
        className={cn(
          "h-full rounded-full",
          highlight ? "bg-gradient-brand" : "bg-muted-foreground/30"
        )}
        initial={{ width: reduce ? `${pct}%` : 0 }}
        animate={inView ? { width: `${pct}%` } : {}}
        transition={{
          duration: reduce ? 0 : duration,
          delay: reduce ? 0 : baseDelay + index * stagger,
          ease: [0.22, 1, 0.36, 1],
        }}
      />
    </div>
  );
}
