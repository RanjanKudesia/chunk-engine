import { metadataStats } from "@/data/benchmarks";
import { cn } from "@/lib/utils";

/** §4 — page-number rate (chunk-engine trails, shown honestly) + the per-format
 * metadata schemas that no competitor exposes (the real differentiator). */
export function MetadataRichness() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Page-number population — honest: chunk-engine trails */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <h3 className="text-sm font-semibold">
          Page-number population
          <span className="ml-2 font-normal text-muted-foreground">
            page-aware formats
          </span>
        </h3>
        <div className="mt-4 space-y-3">
          {metadataStats.pageRate.map((r) => (
            <div key={r.tool}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span
                  className={cn(
                    r.highlight
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {r.tool}
                </span>
                <span
                  className={cn(
                    "font-mono tabular-nums",
                    r.highlight ? "text-brand" : "text-muted-foreground"
                  )}
                >
                  {r.rate.toFixed(3)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                <div
                  className={cn(
                    "h-full rounded-full",
                    r.highlight ? "bg-gradient-brand" : "bg-muted-foreground/30"
                  )}
                  style={{ width: `${r.rate * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          chunk-engine trails on raw page-number population — a fair loss, offset by
          the schemas on the right.
        </p>
      </div>

      {/* Per-format schemas — the differentiator */}
      <div className="rounded-xl border border-brand/30 bg-surface p-6">
        <h3 className="text-sm font-semibold">Per-format metadata schemas</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Docling and Unstructured expose only <code>page_number</code>. chunk-engine
          attaches a schema per extension:
        </p>
        <div className="mt-4 space-y-2.5">
          {metadataStats.schemas.map((s) => (
            <div key={s.ext} className="flex flex-col gap-0.5">
              <span className="font-mono text-xs text-brand">{s.ext}</span>
              <span className="font-mono text-[11px] text-muted-foreground">
                {s.fields}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
