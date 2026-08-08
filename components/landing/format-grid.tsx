import { formatFamilies } from "@/data/formats";

function FormatChip({ ext }: Readonly<{ ext: string }>) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-surface-2 px-2 py-1 font-mono text-xs ring-1 ring-inset ring-emerald-500/20">
      <span className="size-1.5 rounded-full bg-emerald-500" />
      {ext}
    </span>
  );
}

export function FormatGrid() {
  return (
    <div>
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
                <FormatChip key={f.ext} ext={f.ext} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-muted-foreground">
        Every format listed here ships in every SDK &mdash;{" "}
        <code className="font-mono text-foreground">py-chunks</code>,{" "}
        <code className="font-mono text-foreground">js-chunks</code> and{" "}
        <code className="font-mono text-foreground">rs-chunks</code> read all 36
        from the same engine, with byte-identical output.
      </p>
    </div>
  );
}
