/**
 * Central site configuration for chunk-engine — the unified site for the
 * py-chunks / js-chunks / rs-chunks family (one Rust engine, three languages).
 * Per-language package + registry links live in data/languages.ts.
 */
export const site = {
  name: "chunk-engine",
  tagline: "One chunking engine. Python, JavaScript, Rust.",

  /**
   * Canonical site origin. Live at www.chunkengine.dev (apex 308-redirects to
   * www). Override with `NEXT_PUBLIC_SITE_URL` in the deployment env if the
   * canonical ever changes — it flows to metadata, canonical, OpenGraph,
   * sitemap, and robots from this one place.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.chunkengine.dev",
  description:
    "A fast, high-fidelity document chunking engine for RAG — 36 formats, one Rust core, with byte-identical bindings for Python, JavaScript, and Rust.",

  links: {
    /**
     * The hub repo. Every "GitHub" call-to-action points here so stars and
     * watchers collect in one place; it links out to the three SDK repos.
     */
    github: "https://github.com/RanjanKudesia/chunk-engine",
    /** Author profile — used for authorship metadata (JSON-LD), not CTAs. */
    author: "https://github.com/RanjanKudesia",
    docs: "/docs",
  },

  nav: [
    { label: "Docs", href: "/docs" },
    { label: "Playground", href: "/playground" },
    { label: "Benchmarks", href: "/benchmarks" },
  ],
} as const;

export type Site = typeof site;
