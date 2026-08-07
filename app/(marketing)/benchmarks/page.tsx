import type { Metadata } from "next";

import { Section } from "@/components/section";
import { RegistryBadges } from "@/components/benchmarks/registry-badges";
import { EnvCard } from "@/components/benchmarks/env-card";
import { CoverageBars } from "@/components/benchmarks/coverage-bars";
import { StructureIntegrity } from "@/components/benchmarks/structure-integrity";
import { SpeedPooled } from "@/components/benchmarks/speed-pooled";
import { SpeedCategory } from "@/components/benchmarks/speed-category";
import { PrecisionTable } from "@/components/benchmarks/precision-table";
import { MetadataRichness } from "@/components/benchmarks/metadata-richness";
import { ProseIntegrity } from "@/components/benchmarks/prose-integrity";
import { CoverageMatrix } from "@/components/benchmarks/coverage-matrix";
import { Scorecard } from "@/components/benchmarks/scorecard";
import { Limitations } from "@/components/benchmarks/limitations";

const description =
  "A full-corpus competitive benchmark: format coverage, structure integrity, content-type accuracy, and speed vs Docling and Unstructured across 473 real files.";

export const metadata: Metadata = {
  title: "Benchmarks",
  description,
  alternates: { canonical: "/benchmarks" },
  // Declaring openGraph here replaces the root layout's wholesale (Next does
  // not deep-merge it), so url/title/description must all follow this page.
  openGraph: {
    type: "website",
    url: "/benchmarks",
    title: "Benchmarks",
    description,
  },
};

export default function BenchmarksPage() {
  return (
    <>
      <Section
        eyebrow="Benchmarks"
        title="Measured, not claimed"
        titleAs="h1"
        description="A full-corpus competitive run — 473 real files across all 36 formats. chunk-engine is a document-understanding engine, so it's measured against its real peers, Docling and Unstructured (text-splitters can't read a file at all)."
      >
        <RegistryBadges />
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
        title="Never cuts a row in half"
        description="Feed each tool tables, lists, and code blocks larger than any chunk budget. What matters is not whether they get divided — they must — but whether a row survives it."
      >
        <StructureIntegrity />
      </Section>

      {/* Speed — pooled */}
      <Section
        className="border-t border-border/60"
        eyebrow="Speed"
        title="Milliseconds, not seconds"
        description="Native Rust parsing with no ML model loading and no per-element Python overhead. Pooled over all 473 files."
      >
        <SpeedPooled />
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
        <PrecisionTable />
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
        <ProseIntegrity />
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
        <Limitations />
      </Section>
    </>
  );
}
