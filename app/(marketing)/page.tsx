import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { site } from "@/data/site";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/section";
import { InstallTabs } from "@/components/install-tabs";
import { LangCode } from "@/components/lang-code";
import { Hero } from "@/components/landing/hero";
import { BenchmarkBars } from "@/components/landing/benchmark-bars";
import { FormatGrid } from "@/components/landing/format-grid";
import { ChunkVisualizer } from "@/components/landing/chunk-visualizer";
import { RagProblem } from "@/components/landing/rag-problem";
import { ModesOverview } from "@/components/landing/modes-overview";
import { LanguagesSection } from "@/components/landing/languages-section";

export default function Home() {
  return (
    <>
      {/* 1 — Hero */}
      <Hero />

      {/* 2 — Benchmarks */}
      <Section
        eyebrow="Performance"
        title="Milliseconds, not seconds"
        description="A Rust core does the parsing and segmentation. Measured over 446 real files against its peers, Docling and Unstructured — see the full benchmark."
      >
        <BenchmarkBars />
      </Section>

      {/* 3 — The RAG problem */}
      <Section
        className="border-y border-border/60 bg-surface/30"
        eyebrow="Why chunking"
        title="Chunking is the hidden lever in retrieval quality"
        description="Retrieval is only as good as its chunks. Bad boundaries bury the answer; slow, dependency-heavy splitters bottleneck ingestion. chunk-engine fixes both."
      >
        <RagProblem />
      </Section>

      {/* 4 — Format grid */}
      <Section
        eyebrow="Formats"
        title="36 formats, one engine"
        description="Office, PDF, web, plain-text, data, email, eBooks, and notebooks — grouped by family, each with an honest availability badge."
      >
        <FormatGrid />
      </Section>

      {/* 5 — Chunk visualizer */}
      <Section
        className="border-y border-border/60 bg-surface/30"
        eyebrow="See it"
        title="Watch a document become chunks"
        description="A sample document on the left; colored chunk blocks on the right, keyed by content type. Toggle the mode and watch the blocks regroup."
      >
        <ChunkVisualizer />
      </Section>

      {/* 6 — Three languages, one engine */}
      <Section
        eyebrow="One engine, three languages"
        title="Same chunks, everywhere"
        description="Pick the SDK that fits your stack — Python, JavaScript, or Rust. They wrap the same engine and produce byte-identical output."
      >
        <LanguagesSection />
      </Section>

      {/* 7 — Chunking modes */}
      <Section
        className="border-y border-border/60 bg-surface/30"
        eyebrow="Modes"
        title="Seven ways to chunk a document"
        description="default, structural, section, semantic, sliding_window, sentence, page_aware — plus row / table / sheet for spreadsheets."
      >
        <ModesOverview />
      </Section>

      {/* 8 — Start in your language */}
      <Section
        eyebrow="Quick start"
        title="Chunk your first document"
        description="One call. Switch the language tab to see the exact API for your SDK."
      >
        <div className="mx-auto max-w-3xl">
          <LangCode id="quickstart" />
        </div>
      </Section>

      {/* 9 — Final CTA */}
      <Section className="border-t border-border/60">
        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-surface px-6 py-14 text-center sm:px-10">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Start chunking in one line
          </h2>
          <p className="mx-auto mt-4 max-w-md text-pretty text-muted-foreground">
            Install for your language, point it at a file, get clean chunks back.
            No services, no config, no heavy dependency tree.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4">
            <InstallTabs />
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href={site.links.docs}>
                  Get started <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={site.links.github} target="_blank" rel="noreferrer">
                  Star on GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
