import { documentModes, spreadsheetModes } from "@/data/modes";
import { cn } from "@/lib/utils";

// Recommended starting points, per the source "Pick your mode" guidance.
const recommended = new Set(["semantic", "section"]);

export function ModesOverview() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {documentModes.map((m) => (
          <div
            key={m.id}
            className={cn(
              "rounded-xl border bg-surface p-5 transition-colors",
              recommended.has(m.id)
                ? "border-brand/40"
                : "border-border hover:border-brand/25"
            )}
          >
            <div className="flex items-center justify-between">
              <code className="font-mono text-sm font-medium text-brand">
                {m.label}
              </code>
              {recommended.has(m.id) ? (
                <span className="rounded-full bg-brand/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-brand">
                  recommended
                </span>
              ) : null}
            </div>
            <p className="mt-2 text-sm text-foreground/90">{m.summary}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Best for: {m.bestFor}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-surface/50 p-5">
        <p className="text-sm text-muted-foreground">
          Spreadsheets (XLSX / XLS / ODS / CSV) add dedicated modes:
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {spreadsheetModes.map((m) => (
            <span
              key={m.id}
              className="inline-flex items-center gap-1.5 rounded-md bg-surface-2 px-2.5 py-1 font-mono text-xs text-foreground/90"
              title={m.summary}
            >
              <span className="size-1.5 rounded-full bg-brand" />
              {m.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
