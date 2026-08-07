import { speedPooled } from "@/data/benchmarks";
import { StatBars } from "@/components/benchmarks/stat-bars";

/** Pooled-speed section body: headline tiles, per-tool bars, and the
 * per-tool success-count disclosure. */
export function SpeedPooled() {
  return (
    <>
      <div className="mx-auto mb-8 grid max-w-3xl gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-brand/30 bg-surface p-6 text-center">
          <div className="font-mono text-3xl font-semibold tabular-nums text-brand">
            {speedPooled.headline.msPerFile}
            <span className="ml-1 text-base text-muted-foreground">ms</span>
          </div>
          <div className="mt-1 text-sm text-muted-foreground">per file</div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-6 text-center">
          <div className="font-mono text-3xl font-semibold tabular-nums text-foreground">
            {speedPooled.headline.filesPerSec.toLocaleString()}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">files / sec</div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-6 text-center">
          <div className="text-gradient-brand font-mono text-3xl font-semibold tabular-nums">
            89–528×
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            faster than peers
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-2xl rounded-xl border border-border bg-surface p-6">
        <StatBars
          rows={speedPooled.rows.map((r) => ({
            label: r.tool,
            value: r.filesPerSec,
            highlight: r.highlight,
          }))}
          unit="files/s"
        />
        <p className="mt-4 text-xs text-muted-foreground">
          Higher is better. Each tool&rsquo;s median pools only the files it
          parsed successfully, of the {speedPooled.attempted} attempted:{" "}
          {speedPooled.rows
            .map((r) => `${r.tool} ${r.succeeded}/${speedPooled.attempted}`)
            .join(" · ")}
          . Measuring the slower tools over the easier subset they could read is
          generous to them, not harsh.
        </p>
      </div>
    </>
  );
}
