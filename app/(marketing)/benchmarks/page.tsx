import type { Metadata } from "next";
import { Check } from "lucide-react";

import {
  BENCHMARK_ENV,
  speedPooled,
  contentTypePrecision,
  proseIntegrity,
  knownLimitations,
} from "@/data/benchmarks";
import { Section } from "@/components/section";
import { StatBars } from "@/components/benchmarks/stat-bars";
import { CoverageBars } from "@/components/benchmarks/coverage-bars";
import { StructureIntegrity } from "@/components/benchmarks/structure-integrity";
import { SpeedCategory } from "@/components/benchmarks/speed-category";
import { MetadataRichness } from "@/components/benchmarks/metadata-richness";
import { Scorecard } from "@/components/benchmarks/scorecard";
import { CoverageMatrix } from "@/components/benchmarks/coverage-matrix";

export const metadata: Metadata = {
  title: "Benchmarks",
  description:
    "A full-corpus competitive benchmark: format coverage, structure integrity, content-type accuracy, and speed vs Docling and Unstructured across 446 real files.",
};

function EnvCard() {
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
    </div>
  );
}

export default function BenchmarksPage() {
  return (
    <>
      <Section
        eyebrow="Benchmarks"
        title="Measured, not claimed"
        titleAs="h1"
        description="A full-corpus competitive run — 446 real files across all 36 formats. chunk-engine is a document-understanding engine, so it's measured against its real peers, Docling and Unstructured (text-splitters can't read a file at all)."
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://img.shields.io/pypi/v/py-chunks?style=flat-square&label=py-chunks&color=e8511e"
            alt="py-chunks version on PyPI"
            width={128}
            height={24}
            className="h-6 w-auto"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://img.shields.io/npm/v/js-chunks?style=flat-square&label=js-chunks&color=e8511e"
            alt="js-chunks version on npm"
            width={124}
            height={24}
            className="h-6 w-auto"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://img.shields.io/crates/v/rs-chunks?style=flat-square&label=rs-chunks&color=e8511e"
            alt="rs-chunks version on crates.io"
            width={128}
            height={24}
            className="h-6 w-auto"
          />
        </div>
        <EnvCard />
      </Section>

      {/* Format coverage */}
      <Section
        className="border-t border-border/60"
        eyebrow="Coverage"
        title="Reads more formats than anything else"
        description="One representative real fixture per extension, every tool attempted for real — nothing pre-skipped."
      >
        <CoverageBars />
      </Section>

      {/* Structure integrity — the star */}
      <Section
        className="border-t border-border/60 bg-surface/30"
        eyebrow="Structure integrity"
        title="Keeps oversized units whole"
        description="Feed each tool tables, lists, and code blocks larger than any chunk budget. Only one tool refuses to cut them in half."
      >
        <StructureIntegrity />
      </Section>

      {/* Speed — pooled */}
      <Section
        className="border-t border-border/60"
        eyebrow="Speed"
        title="Milliseconds, not seconds"
        description="Native Rust parsing with no ML model loading and no per-element Python overhead. Pooled over all 446 files."
      >
        <div className="mx-auto mb-8 grid max-w-3xl gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-brand/30 bg-surface p-6 text-center">
            <div className="font-mono text-3xl font-semibold tabular-nums text-brand">
              {speedPooled.headline.msPerFile}
              <span className="ml-1 text-base text-muted-foreground">ms</span>
            </div>
            <div className="mt-1 text-sm text-muted-foreground">per file</div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6 text-center">
            <div className="font-mono text-3xl font-semibold tabular-nums text-foreground">
              {speedPooled.headline.filesPerSec.toLocaleString()}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">files / sec</div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6 text-center">
            <div className="text-gradient-brand font-mono text-3xl font-semibold tabular-nums">
              55–221×
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              faster than peers
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-2xl rounded-xl border border-border bg-surface p-6">
          <StatBars
            rows={speedPooled.rows.map((r) => ({
              label: r.tool,
              value: r.filesPerSec,
              highlight: r.highlight,
            }))}
            unit="files/s"
          />
          <p className="mt-4 text-xs text-muted-foreground">
            Higher is better. Docling and Unstructured also errored on ~half the
            corpus, so their median is measured over an easier subset — generous
            to them, not harsh.
          </p>
        </div>
      </Section>

      {/* Speed by category */}
      <Section
        className="border-t border-border/60 bg-surface/30"
        eyebrow="Speed by format"
        title="Fastest in every category"
        description="Per-category multiples are more credible — and more dramatic — than one pooled number."
      >
        <SpeedCategory />
      </Section>

      {/* Content-type precision */}
      <Section
        className="border-t border-border/60"
        eyebrow="Accuracy"
        title="Precise typed chunks"
        description="Is the content_type label actually right? Ground truth extracted directly from source markup, independent of every tool."
      >
        <div className="mx-auto max-w-lg overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="px-4 py-3 text-left font-medium">
                  Precision
                </th>
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
          (0.48 precision — many non-code chunks tagged &ldquo;code&rdquo;).
          On headings and lists chunk-engine favours fewer, higher-value typed units
          — it under-labels at the anchor level but retains ~99% of the content.
        </p>
      </Section>

      {/* Metadata richness (§4) */}
      <Section
        className="border-t border-border/60 bg-surface/30"
        eyebrow="Metadata"
        title="Richer provenance per chunk"
        description="chunk-engine trails on raw page-number population, but attaches a format-specific metadata schema that no competitor exposes."
      >
        <MetadataRichness />
      </Section>

      {/* Prose integrity (§6) */}
      <Section
        className="border-t border-border/60"
        eyebrow="Prose quality"
        title="Doesn't fragment sentences either"
        description="The one axis text-splitters compete on. Verified by hand across every mode."
      >
        <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-brand/30 bg-surface p-6 text-center">
            <div className="font-mono text-3xl font-semibold tabular-nums text-brand">
              {proseIntegrity.sentenceSplits}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              genuine sentence splits, any mode
            </div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6 text-center">
            <div className="font-mono text-3xl font-semibold tabular-nums text-foreground">
              {proseIntegrity.slidingWindowParity.toFixed(3)}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              sliding_window answer-preservation
            </div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6 text-center">
            <div className="font-mono text-3xl font-semibold tabular-nums text-muted-foreground">
              {proseIntegrity.competitorRange}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              text-splitter range (at parity)
            </div>
          </div>
        </div>
      </Section>

      {/* Coverage matrix (formats × modes) */}
      <Section
        className="border-t border-border/60 bg-surface/30"
        eyebrow="Coverage"
        title="Formats × modes"
        description="Which chunking modes each format family supports — derived directly from the library source."
      >
        <CoverageMatrix />
      </Section>

      {/* Scorecard — including the axes chunk-engine does NOT win */}
      <Section
        className="border-t border-border/60"
        eyebrow="Scorecard"
        title="The honest tally"
        description="Every axis measured — including the ones chunk-engine loses. Credibility comes from the whole picture."
      >
        <Scorecard />
      </Section>

      {/* Honest limitations */}
      <Section
        className="border-t border-border/60 bg-surface/30"
        eyebrow="Full disclosure"
        title="What we didn't hide"
        description="The same report surfaces every defect it found. Credibility comes from disclosing them, not burying them."
      >
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
      </Section>
    </>
  );
}
