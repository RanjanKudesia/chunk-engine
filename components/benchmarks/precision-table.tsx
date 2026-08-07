import { contentTypePrecision } from "@/data/benchmarks";

/** Content-type precision table (§3) with its honesty note. */
export function PrecisionTable() {
  return (
    <>
      <div className="mx-auto max-w-lg overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="px-4 py-3 text-left font-medium">Precision</th>
              <th className="px-3 py-3 text-right font-medium text-foreground">
                chunk-engine
              </th>
              <th className="px-3 py-3 text-right font-medium">Docling</th>
              <th className="px-4 py-3 text-right font-medium">Unstructured</th>
            </tr>
          </thead>
          <tbody className="font-mono tabular-nums">
            {contentTypePrecision.map((r) => (
              <tr
                key={r.type}
                className="border-b border-border/60 last:border-0"
              >
                <td className="px-4 py-3 font-sans font-medium capitalize">
                  {r.type}
                </td>
                <td className="px-3 py-3 text-right font-semibold text-brand">
                  {r.py.toFixed(2)}
                </td>
                <td className="px-3 py-3 text-right text-muted-foreground">
                  {r.docling.toFixed(3)}
                </td>
                <td className="px-4 py-3 text-right text-muted-foreground">
                  {r.unstructured.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mx-auto mt-4 max-w-lg text-center text-sm text-muted-foreground">
        Perfect precision on tables and code. Docling over-labels code blocks
        (0.48 precision — many non-code chunks tagged &ldquo;code&rdquo;). On
        headings and lists chunk-engine favours fewer, higher-value typed units
        — it under-labels at the anchor level but retains ~99% of the content.
      </p>
    </>
  );
}
