import { BENCHMARK_ENV } from "@/data/benchmarks";

/** The environment-disclosure card shown under the benchmarks hero. */
export function EnvCard() {
  const rows: [string, string][] = [
    ["Corpus", BENCHMARK_ENV.corpus],
    ["Machine", BENCHMARK_ENV.machine],
    ["OS", BENCHMARK_ENV.os],
    ["Runtimes", BENCHMARK_ENV.runtimes],
  ];
  return (
    <div className="mx-auto mt-8 max-w-2xl rounded-xl border border-border bg-surface p-5 text-left">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Environment
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {BENCHMARK_ENV.date}
        </span>
      </div>
      <dl className="space-y-1.5 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
            <dt className="w-24 shrink-0 text-muted-foreground">{k}</dt>
            <dd className="font-mono text-xs text-foreground/90 sm:text-[13px]">
              {v}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
        {BENCHMARK_ENV.caveat}
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        Every figure on this page is from the {BENCHMARK_ENV.date} run, except
        prose sentence-integrity, which is from {BENCHMARK_ENV.proseDate} — the
        engine work between the two runs did not touch it.
      </p>
    </div>
  );
}
