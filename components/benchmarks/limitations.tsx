import { Check } from "lucide-react";

import { knownLimitations } from "@/data/benchmarks";

/** The honestly-disclosed limitations list, with its closing note. */
export function Limitations() {
  return (
    <>
      <ul className="mx-auto max-w-2xl space-y-3">
        {knownLimitations.map((l) => (
          <li
            key={l}
            className="flex items-start gap-3 rounded-lg border border-border bg-surface p-4 text-sm text-foreground/90"
          >
            <Check className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            {l}
          </li>
        ))}
      </ul>
      <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-muted-foreground">
        Every number here is from a single real run on the environment above —
        no sampling, no cherry-picking. Absolute figures are Apple-Silicon
        specific; a neutral x86 cloud run is a planned follow-up.
      </p>
    </>
  );
}
