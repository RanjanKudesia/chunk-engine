import { atomicUnitsSliced, structureIntegrity } from "@/data/benchmarks";
import { cn } from "@/lib/utils";

function Cell({ v, highlight }: { v: number; highlight?: boolean }) {
  // 0 = split every time (muted); 100 = always whole (emerald); partial = brand.
  const tone =
    v === 0
      ? "text-muted-foreground/60"
      : v === 100
        ? "text-emerald-500"
        : "text-brand";
  return (
    <td className="px-3 py-3 text-center">
      <span
        className={cn(
          "inline-flex min-w-[3.25rem] justify-center rounded-md px-2 py-1 font-mono text-sm tabular-nums",
          v === 0 && "bg-surface-2",
          v === 100 && "bg-emerald-500/10",
          v > 0 && v < 100 && "bg-brand/10",
          tone,
          highlight && v > 0 && "font-semibold"
        )}
      >
        {v}%
      </span>
    </td>
  );
}

/** The headline stat: rows destroyed. Lower is better; 0 is the only good answer. */
function SlicedTile({
  tool,
  units,
  trials,
  dirtyTrials,
  highlight,
}: {
  tool: string;
  units: number;
  trials: number;
  dirtyTrials: number;
  highlight?: boolean;
}) {
  const bad = units > 0;
  return (
    <div
      className={cn(
        "rounded-xl border p-6 text-center",
        // Same good/bad pair the rest of the site uses (see rag-problem.tsx):
        // red-500 / emerald-500, not a new colour.
        bad
          ? "border-red-500/60 bg-red-500/5"
          : "border-emerald-500/60 bg-emerald-500/5"
      )}
    >
      <div
        className={cn(
          "font-mono text-4xl font-semibold tabular-nums",
          bad ? "text-red-500" : "text-emerald-500"
        )}
      >
        {units.toLocaleString()}
      </div>
      <div
        className={cn(
          "mt-2 font-mono text-xs",
          highlight ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {tool}
      </div>
      {/* The denominator, so the headline number cannot be read as distinct rows. */}
      <div className="mt-1 text-xs text-muted-foreground">
        in {dirtyTrials} of {trials} trials
      </div>
    </div>
  );
}

/**
 * Structure integrity under load: what survives when a unit exceeds the budget.
 *
 * The kept-whole table used to lead this section, which read as "chunk-engine
 * scores 0% at everything" — a wall of zeros that buried the actual finding and
 * undersold it. The rows-sliced figure is the claim the section title makes, so
 * it leads; kept-whole stays as disclosed supporting detail.
 */
export function StructureIntegrity() {
  const headline = atomicUnitsSliced.filter(
    (r) => r.tool === "chunk-engine" || r.tool === "Docling"
  );
  const alsoZero = atomicUnitsSliced.filter(
    (r) => r.units === 0 && r.tool !== "chunk-engine"
  );

  return (
    <div>
      {/* The claim in the section title, as the primary visual. */}
      <div className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-2">
        {headline.map((row) => (
          <SlicedTile key={row.tool} {...row} />
        ))}
      </div>
      <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-muted-foreground">
        Atomic rows, list items, or code lines <strong>cut in half</strong> —
        unrecoverable damage, as opposed to dividing a unit that genuinely exceeds
        the budget. {alsoZero.map((r) => r.tool).join(", ")} also sliced none.
        Counts are summed over trials at two chunk budgets, so a row cut at both
        is counted twice; 680 of Docling&rsquo;s come from one 5,000-row
        spreadsheet.
      </p>

      {/* Supporting detail, deliberately secondary. */}
      <details className="mx-auto mt-10 max-w-3xl rounded-xl border border-border bg-surface/50">
        <summary className="cursor-pointer px-5 py-4 text-sm text-muted-foreground marker:text-muted-foreground/50">
          Does anything keep an oversized unit whole?{" "}
          <span className="text-foreground">
            Almost never — and that is deliberate.
          </span>
        </summary>
        <div className="border-t border-border px-5 pb-5 pt-4">
          <p className="mb-4 text-sm text-muted-foreground">
            chunk-engine bounds oversized blocks on purpose: a single 11k-token
            chunk breaks the size contract an embedding model depends on, so
            keeping one whole was the defect, not the feature. It is still the
            only tool that keeps an oversized <em>table</em> whole at all.
          </p>
          <div className="overflow-x-auto rounded-lg border border-border bg-surface">
            <table className="w-full min-w-[480px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-medium">Tool</th>
                  {structureIntegrity.columns.map((c) => (
                    <th
                      key={c}
                      className="px-3 py-3 text-center font-medium text-muted-foreground"
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {structureIntegrity.rows.map((row) => (
                  <tr
                    key={row.tool}
                    className={cn(
                      "border-b border-border/60 last:border-0",
                      row.highlight && "bg-brand/[0.03]"
                    )}
                  >
                    <td
                      className={cn(
                        "px-4 py-3 font-mono text-xs",
                        row.highlight
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {row.tool}
                    </td>
                    {row.vals.map((v, i) => (
                      <Cell key={i} v={v} highlight={row.highlight} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Kept-whole rate: how often an oversized table, list, or code block
            lands in <em>one</em> chunk instead of being split.
          </p>
        </div>
      </details>
    </div>
  );
}
