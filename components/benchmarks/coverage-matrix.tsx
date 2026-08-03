import { Check } from "lucide-react";

import { coverageMatrix, allModes } from "@/data/stats";
import { cn } from "@/lib/utils";

/** Real formats × modes coverage matrix (derived from source mode support). */
export function CoverageMatrix() {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="sticky left-0 bg-surface px-4 py-3 text-left font-medium">
              Format family
            </th>
            {allModes.map((m) => (
              <th
                key={m}
                className="px-2 py-3 text-center font-mono text-[11px] font-normal text-muted-foreground"
              >
                {m}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {coverageMatrix.map((row) => (
            <tr
              key={row.family}
              className="border-b border-border/60 last:border-0"
            >
              <td className="sticky left-0 bg-surface px-4 py-3 font-medium">
                {row.family}
              </td>
              {allModes.map((m) => {
                const has = row.modes.includes(m);
                return (
                  <td key={m} className="px-2 py-3 text-center">
                    {has ? (
                      <Check
                        className="mx-auto size-4 text-brand"
                        aria-label="supported"
                      />
                    ) : (
                      <span
                        className={cn("mx-auto block size-1 rounded-full bg-border")}
                        aria-label="not supported"
                      />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
