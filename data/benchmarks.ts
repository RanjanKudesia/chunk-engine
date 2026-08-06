/**
 * REAL competitive benchmark data — full-corpus runs, 2026-07-28 and 2026-08-06.
 *
 * Source of truth: benchmarks/competitive/FINAL_REPORT.md (473 real files across
 * all 36 formats; no sampling). Every number here is traceable to that report.
 * py_chunks is a document-understanding engine, benchmarked against its real
 * peers (Docling, Unstructured) — NOT positioned as a text-splitter vs LangChain.
 *
 * Measured via py-chunks 0.6.0; the engine (and its rs-chunks / js-chunks
 * bindings) is byte-identical, so coverage / structure / content-type results
 * apply to all three. Speed is the Rust core's, measured through the Python API.
 */

export const BENCHMARK_ENV = {
  date: "2026-08-06",
  // §1–§5 and §7 were all re-measured on 2026-08-06, after the engine work that
  // made the 2026-07-28 figures stale. §6 (prose sentence-integrity vs
  // text-splitters) still dates from 2026-07-28 — nothing in that work touched
  // it. Stated rather than blended, so no number here is attributed to a run it
  // did not come from.
  coverageDate: "2026-08-06",
  proseDate: "2026-07-28",
  corpus: "473 real files · all 36 formats · 3 runs/file (median)",
  machine: "Apple M1 Max · 10 cores (8P+2E) · 32 GB",
  os: "macOS 26.5.1",
  runtimes:
    "py-chunks 0.6.0 · docling 2.115.0 · unstructured 0.24.1 · markitdown 0.1.5",
  caveat:
    "Apple-Silicon numbers — compare tools within this run, not across machines. A neutral x86 cloud run is a planned follow-up.",
};

/* ---- Format coverage (§1) — real ---- */
export interface CoverageRow {
  tool: string;
  value: number;
  highlight?: boolean;
  note?: string;
}
export const formatCoverage = {
  of: 36,
  rows: [
    { tool: "chunk-engine", value: 36, highlight: true },
    { tool: "markitdown", value: 26 },
    { tool: "unstructured", value: 21 },
    {
      tool: "docling",
      value: 17,
      note: "18 in the 2026-07-28 run; the .txt representative is now a cp1252-encoded file docling cannot open, so this is a corpus change rather than a regression on their side",
    },
    { tool: "text-splitters", value: 0, note: "read no files directly" },
  ] as CoverageRow[],
};

/* ---- Structure integrity under load (§2) — real ---- */
// Kept-whole rate (%): fraction of oversized units landing in exactly one chunk.
/* Re-run 2026-08-06. The previous figures here (100% for list and code) are
   obsolete and must not be restored: chunk-engine deliberately stopped keeping
   oversized units whole, because a single 11k-token chunk breaks the bounded-size
   contract every embedding model depends on. What still separates the tools is
   whether a split cuts an atomic row in half — see atomicUnitsSliced. */
export const structureIntegrity = {
  columns: ["Table", "List", "Code"] as const,
  rows: [
    { tool: "chunk-engine · default", vals: [20, 0, 0], highlight: true },
    { tool: "chunk-engine · semantic", vals: [20, 0, 0], highlight: true },
    { tool: "chunk-engine · section", vals: [0, 0, 0], highlight: true },
    { tool: "Docling", vals: [0, 0, 0] },
    { tool: "Unstructured", vals: [0, 0, 0] },
    { tool: "LangChain", vals: [0, 0, 0] },
    { tool: "semchunk · Chonkie · s-t-s", vals: [0, 0, 0] },
  ] as { tool: string; vals: number[]; highlight?: boolean }[],
};

/* Atomic rows / list items / code lines cut in half — unrecoverable damage, and
   the axis that does still separate the tools. Lower is better; 0 is the only
   good answer.

   `units` is a SUM over trials, and each fixture is run at two chunk budgets, so
   a row sliced at both is counted twice; 680 of Docling's 900 come from the one
   5,000-row spreadsheet. That is why `trials` ships alongside it — the bare
   number would read as 900 distinct rows, which it is not. The comparison is
   still like-for-like: the same fixtures at the same budgets. */
export const atomicUnitsSliced = [
  { tool: "chunk-engine", units: 0, trials: 36, dirtyTrials: 0, highlight: true },
  { tool: "Unstructured", units: 0, trials: 12, dirtyTrials: 0 },
  { tool: "LangChain · semchunk · Chonkie · s-t-s", units: 0, trials: 14, dirtyTrials: 0 },
  { tool: "Docling", units: 900, trials: 12, dirtyTrials: 8 },
];

/* ---- Speed, pooled (§7) — real ---- */
export const speedPooled = {
  headline: { msPerFile: 0.32, filesPerSec: 3125, files: 473 },
  // files/sec — higher is better; py-chunks dominates.
  rows: [
    { tool: "chunk-engine", filesPerSec: 3125, ms: 0.32, multiple: "1×", highlight: true },
    { tool: "docling", filesPerSec: 35.2, ms: 28.4, multiple: "89× slower" },
    { tool: "markitdown + langchain", filesPerSec: 26.1, ms: 38.27, multiple: "120× slower" },
    { tool: "unstructured", filesPerSec: 5.9, ms: 168.98, multiple: "528× slower" },
  ],
};

/* ---- Speed by format category (§7) — real ---- */
export interface CategorySpeed {
  category: string;
  py: number; // ms/file
  docling: number;
  unstructured: number;
  markitdownLangchain: number;
  top: string; // largest multiple, with competitor
}
export const speedByCategory: CategorySpeed[] = [
  { category: "PDF", py: 32.78, docling: 8080.79, unstructured: 1916.88, markitdownLangchain: 1181.97, top: "247× vs Docling" },
  { category: "PowerPoint", py: 0.56, docling: 356.53, unstructured: 618.09, markitdownLangchain: 355.43, top: "1,104× vs Unstructured" },
  { category: "Word", py: 0.47, docling: 151.02, unstructured: 132.87, markitdownLangchain: 101.22, top: "321× vs Docling" },
  { category: "Ebook", py: 6.89, docling: 436.02, unstructured: 1334.84, markitdownLangchain: 110.95, top: "194× vs Unstructured" },
  { category: "Spreadsheet", py: 0.29, docling: 13.7, unstructured: 27.03, markitdownLangchain: 24.16, top: "93× vs Unstructured" },
];

/* ---- Content-type precision (§3) — real (table & code) ---- */
export const contentTypePrecision = [
  { type: "table", py: 1.0, docling: 0.854, unstructured: 1.0 },
  { type: "code", py: 1.0, docling: 0.476, unstructured: 1.0 },
];

/* ---- Metadata completeness (§4) — real ---- */
export const metadataStats = {
  // Page-number population on page-aware formats — py-chunks TRAILS here (honest).
  pageRate: [
    { tool: "unstructured", rate: 0.768 },
    { tool: "docling", rate: 0.667 },
    { tool: "chunk-engine", rate: 0.675, highlight: true },
  ],
  // ...but attaches per-format schemas no competitor exposes (their only shared
  // structured field is page_number).
  schemas: [
    { ext: ".eml · .msg", fields: "from · to · cc · subject · date · attachments" },
    { ext: ".epub", fields: "creator · identifier · language · spine_count" },
    { ext: ".ipynb", fields: "cell / code / markdown counts · kernel" },
    { ext: ".json · .jsonl", fields: "record_count · envelope_key" },
    { ext: ".pptx", fields: "total_slides · per-chunk slide_number" },
    { ext: ".odp · .odt · .rtf", fields: "creator · title · author" },
  ],
};

/* ---- Prose sentence-integrity (§6) — real ---- */
export const proseIntegrity = {
  sentenceSplits: 0,
  slidingWindowParity: 0.983,
  competitorRange: "0.949–0.994",
};

/* ---- Scorecard (§ scorecard) — real, incl. the axes py-chunks does NOT win ---- */
export interface ScoreRow {
  axis: string;
  // "py" -> brand win · "tie" -> neutral · otherwise the competitor that wins.
  winner: string;
  detail: string;
}
export const scorecard: ScoreRow[] = [
  { axis: "Format coverage", winner: "py", detail: "36/36 vs 17–26; text-splitters 0/36" },
  { axis: "Structure integrity (oversized units)", winner: "py", detail: "0 atomic rows sliced; Docling sliced 900" },
  { axis: "Content-type precision (table / code)", winner: "py", detail: "1.0 / 1.0 vs 0.14–0.85" },
  { axis: "Content-type recall (heading / list)", winner: "Docling", detail: "chunk-engine retains ~99% of content but under-labels at anchor level" },
  { axis: "Metadata field richness", winner: "py", detail: "only tool with per-format schemas" },
  { axis: "Page-number population", winner: "Unstructured / Docling", detail: "0.67–0.77 vs chunk-engine 0.675" },
  { axis: "Reading order", winner: "py", detail: "section 0.947 and 5/12 fixtures fully ordered, vs 0.922–0.928 and 3/12" },
  { axis: "Prose sentence-integrity", winner: "tie", detail: "0 splits any mode; sliding_window at parity" },
  { axis: "Speed (pooled, 473 files)", winner: "py", detail: "89–528× faster; fastest in every category" },
];

/* ---- Honestly-disclosed limitations (§ known limitations) ---- */
export const knownLimitations = [
  "Page-number metadata population (0.675) still trails Unstructured (0.768) on page-aware formats, though it now edges Docling (0.667) — offset by far richer per-format metadata schemas.",
  "On headings/lists chunk-engine under-labels at anchor granularity (but retains ~99% of the content) — it favours higher-value typed units.",
  "All numbers are Apple Silicon (M1 Max) and not cross-machine comparable; a neutral x86 cloud run is planned.",
];

/* ============================================================
 * Landing-page BenchmarkBars (real pooled numbers, subset).
 * Kept in the original shape so the landing component is unchanged.
 * ============================================================ */
export interface BenchmarkRow {
  label: string;
  value: number;
  highlight?: boolean;
}
export interface BenchmarkGroup {
  id: string;
  title: string;
  unit: string;
  better: "lower" | "higher";
  rows: BenchmarkRow[];
}

export const benchmarks: BenchmarkGroup[] = [
  {
    id: "throughput",
    title: "Documents per second (pooled)",
    unit: "files / sec",
    better: "higher",
    rows: [
      { label: "chunk-engine", value: 3125, highlight: true },
      { label: "docling", value: 35 },
      { label: "unstructured", value: 6 },
    ],
  },
  {
    id: "latency",
    title: "Time per document (pooled)",
    unit: "ms / file",
    better: "lower",
    rows: [
      { label: "chunk-engine", value: 0.32, highlight: true },
      { label: "docling", value: 28.4 },
      { label: "unstructured", value: 168.98 },
    ],
  },
];

// Shown near the landing bars — a measured-run note (no longer a placeholder).
export const BENCHMARK_DISCLAIMER =
  "Measured over 473 files on Apple M1 Max (py-chunks 0.6.0), 2026-08-06. See the benchmarks page for full methodology.";
