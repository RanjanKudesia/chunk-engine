import { speedByCategory } from "@/data/benchmarks";

const fmt = (n: number) =>
  n >= 1000 ? n.toLocaleString(undefined, { maximumFractionDigits: 0 }) : n.toString();

/** Per-category speed (ms/file) — chunk-engine vs the real peers, with the top multiple. */
export function SpeedCategory() {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <table className="w-full min-w-[680px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-xs text-muted-foreground">
            <th className="px-4 py-3 text-left font-medium">Category</th>
            <th className="px-3 py-3 text-right font-medium text-foreground">
              chunk-engine
            </th>
            <th className="px-3 py-3 text-right font-medium">Docling</th>
            <th className="px-3 py-3 text-right font-medium">Unstructured</th>
            <th className="px-3 py-3 text-right font-medium">markitdown+lc</th>
            <th className="px-4 py-3 text-right font-medium">Fastest by</th>
          </tr>
        </thead>
        <tbody className="font-mono tabular-nums">
          {speedByCategory.map((r) => (
            <tr key={r.category} className="border-b border-border/60 last:border-0">
              <td className="px-4 py-3 font-sans font-medium">{r.category}</td>
              <td className="px-3 py-3 text-right font-semibold text-brand">
                {r.py}
              </td>
              <td className="px-3 py-3 text-right text-muted-foreground">
                {fmt(r.docling)}
              </td>
              <td className="px-3 py-3 text-right text-muted-foreground">
                {fmt(r.unstructured)}
              </td>
              <td className="px-3 py-3 text-right text-muted-foreground">
                {fmt(r.markitdownLangchain)}
              </td>
              <td className="px-4 py-3 text-right">
                <span className="rounded-full bg-brand/10 px-2 py-0.5 font-sans text-xs font-medium text-brand">
                  {r.top}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
        Median ms per file (lower is better). chunk-engine is fastest in every
        category measured — margins widen wherever a competitor&apos;s pipeline is
        heaviest.
      </p>
    </div>
  );
}
