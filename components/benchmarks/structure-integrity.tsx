import { structureIntegrity } from "@/data/benchmarks";
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

/** Kept-whole rate for oversized tables/lists/code — the starkest differentiator. */
export function StructureIntegrity() {
  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full min-w-[520px] border-collapse text-sm">
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
                    row.highlight ? "text-foreground" : "text-muted-foreground"
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
      <p className="mt-4 text-sm text-muted-foreground">
        Kept-whole rate: how often an oversized table, list, or code block lands in{" "}
        <em>one</em> chunk instead of being split. <strong>Every competitor
        tested — including Docling and Unstructured — split 100% of them.</strong>{" "}
        chunk-engine keeps oversized lists and code whole by design, and its{" "}
        <code className="font-mono text-foreground">section</code> mode keeps half
        of oversized tables whole too.
      </p>
    </div>
  );
}
