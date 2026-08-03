import { scorecard } from "@/data/benchmarks";
import { cn } from "@/lib/utils";

function WinnerBadge({ winner }: { winner: string }) {
  const isPy = winner === "py";
  const isTie = winner === "tie";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-xs",
        isPy && "bg-brand/10 text-brand",
        isTie && "bg-surface-2 text-muted-foreground",
        !isPy && !isTie && "border border-border text-muted-foreground"
      )}
    >
      {isPy ? "chunk-engine" : isTie ? "tie" : winner}
    </span>
  );
}

/** The report's scorecard — including the axes chunk-engine does NOT win. */
export function Scorecard() {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-xs text-muted-foreground">
            <th className="px-4 py-3 text-left font-medium">Axis</th>
            <th className="px-3 py-3 text-left font-medium">Winner</th>
            <th className="px-4 py-3 text-left font-medium">Margin</th>
          </tr>
        </thead>
        <tbody>
          {scorecard.map((r) => (
            <tr
              key={r.axis}
              className="border-b border-border/60 align-top last:border-0"
            >
              <td className="px-4 py-3 font-medium">{r.axis}</td>
              <td className="px-3 py-3">
                <WinnerBadge winner={r.winner} />
              </td>
              <td className="px-4 py-3 text-muted-foreground">{r.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
