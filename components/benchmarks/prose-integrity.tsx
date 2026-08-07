import { proseIntegrity } from "@/data/benchmarks";

/** Prose sentence-integrity stat tiles (§6). */
export function ProseIntegrity() {
  return (
    <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
      <div className="rounded-xl border border-brand/30 bg-surface p-6 text-center">
        <div className="font-mono text-3xl font-semibold tabular-nums text-brand">
          {proseIntegrity.sentenceSplits}
        </div>
        <div className="mt-1 text-sm text-muted-foreground">
          genuine sentence splits, any mode
        </div>
      </div>
      <div className="rounded-xl border border-border bg-surface p-6 text-center">
        <div className="font-mono text-3xl font-semibold tabular-nums text-foreground">
          {proseIntegrity.slidingWindowParity.toFixed(3)}
        </div>
        <div className="mt-1 text-sm text-muted-foreground">
          sliding_window answer-preservation
        </div>
      </div>
      <div className="rounded-xl border border-border bg-surface p-6 text-center">
        <div className="font-mono text-3xl font-semibold tabular-nums text-muted-foreground">
          {proseIntegrity.competitorRange}
        </div>
        <div className="mt-1 text-sm text-muted-foreground">
          text-splitter range (at parity)
        </div>
      </div>
    </div>
  );
}
