import { formatFamilies, type FormatStatus } from "@/data/formats";
import { cn } from "@/lib/utils";

const statusDot: Record<FormatStatus, string> = {
  stable: "bg-emerald-500",
  new: "bg-brand",
  soon: "bg-muted-foreground/50",
};

const statusRing: Record<FormatStatus, string> = {
  stable: "ring-emerald-500/20",
  new: "ring-brand/25",
  soon: "ring-border",
};

function FormatChip({ ext, status }: { ext: string; status: FormatStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md bg-surface-2 px-2 py-1 font-mono text-xs ring-1 ring-inset",
        statusRing[status]
      )}
      title={
        status === "stable"
          ? "Stable — in the published wheel"
          : status === "new"
            ? "New — in the library source / latest builds"
            : "Coming soon"
      }
    >
      <span className={cn("size-1.5 rounded-full", statusDot[status])} />
      {ext}
    </span>
  );
}

export function FormatGrid() {
  return (
    <div>
      {/* Legend */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-emerald-500" /> Stable
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-brand" /> New
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {formatFamilies.map((fam) => (
          <div
            key={fam.family}
            className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-brand/30"
          >
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-semibold">{fam.family}</h3>
              <span className="font-mono text-xs text-muted-foreground">
                {fam.formats.length}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">{fam.blurb}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {fam.formats.map((f) => (
                <FormatChip key={f.ext} ext={f.ext} status={f.status} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-muted-foreground">
        <span className="text-brand">New</span> formats live in the library
        source and latest builds; the current published wheel documents a
        subset. Upgrade with{" "}
        <code className="font-mono text-foreground">pip install -U py-chunks</code>{" "}
        to pick up the newest formats.
      </p>
    </div>
  );
}
