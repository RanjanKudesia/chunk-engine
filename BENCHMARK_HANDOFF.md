# Benchmark data handoff — for the session building the `/benchmarks` page

This is a briefing for whoever (human or Claude session) implements the real benchmark
numbers on this website. It assumes no prior context — read this file fully before
touching `data/benchmarks.ts` or `app/(marketing)/benchmarks/page.tsx`.

## What already exists in this repo

- **`data/benchmarks.ts`** — `BenchmarkGroup`/`BenchmarkRow` (latency, throughput
  groups), 100% placeholder, `// PLACEHOLDER` throughout, `BENCHMARK_DISCLAIMER` shown
  in the UI.
- **`data/stats.ts`** — the `/benchmarks` stats page's data: `throughputByFormat`
  (docs/sec per format — **placeholder**), `chunkReduction` (naive vs structured chunk
  count — **placeholder**), `dependencyFootprint` (transitive dep counts —
  **placeholder**), and `coverageMatrix` (formats × modes — **already real**, derived
  from source mode support, leave as-is).
  - **Mapping to real data:** `throughputByFormat` maps directly to the per-category
    speed table in `FINAL_REPORT.md` §7 (PDF/PowerPoint/Word/Ebook/Spreadsheet — note
    the report's categories don't exactly match this file's per-extension breakdown;
    use the raw `results/speed_20260728T112451Z/speed.json` `category_summary` for
    finer granularity, or `rows` for true per-extension numbers).
  - `dependencyFootprint` and `chunkReduction`: **no directly-measured equivalent
    exists in the benchmark.** Don't invent dependency counts or a naive-splitting
    comparison number — either measure them for real (dependency count is trivial to
    get from `pip show <pkg>` / a fresh venv; chunk-count reduction would need a new
    small experiment) or leave them flagged in `NEEDS-REVIEW.md` rather than guessing.
    The closest real substitute for "why fewer/better chunks" is the structure-integrity
    story in `FINAL_REPORT.md` §2 (0% vs 100% kept-whole) — consider using that instead
    of a fabricated reduction ratio.
- **`app/(marketing)/benchmarks/page.tsx`** — the page that renders both files above.
- **`NEEDS-REVIEW.md`** — "Benchmarks" section already updated to point here; keep it
  current as you replace each placeholder.

## Where the real data lives (source of truth — a SIBLING repo, not this one)

The library and its benchmark are in `/Users/MAC/Desktop/packages/`, a directory
**next to** this website repo (this repo is `py-chunks/`, the library is `py_chunks/`
— underscore vs hyphen, easy to confuse, see `NEEDS-REVIEW.md`'s note on this).

**Read this first, in full, before writing any numbers:**
`/Users/MAC/Desktop/packages/benchmarks/competitive/FINAL_REPORT.md`

It is a complete, honest, already-written report with 7 sections (format coverage,
structure integrity, content-type accuracy, metadata completeness, reading order,
prose-quality parity, speed/throughput) plus a scorecard. Every number in it is from a
real, full-corpus benchmark run (446 files across all 36 formats) — nothing sampled,
nothing estimated. Treat it exactly as `CLAUDE.md` in this repo already tells you to
treat the library source: **the single source of truth. Do not invent, round
differently, or re-derive numbers from memory — pull them from this file (or the raw
JSON it links to, if you need a number not already surfaced in prose).**

Raw data behind every number (JSON + markdown), if you need finer granularity than
what's in `FINAL_REPORT.md`:
- `results/coverage_20260728T095630Z/` — format coverage (36 formats × py_chunks/docling/unstructured/markitdown)
- `results/structure_stress_20260728T100148Z/` — oversized table/list/code integrity
- `results/content_type_accuracy_20260728T102527Z/` — typed-chunk label accuracy
- `results/metadata_completeness_20260728T104929Z/` — metadata field population rates
- `results/reading_order_20260728T105103Z/` — chunk ordering fidelity
- `results/speed_20260728T112451Z/` — the full per-category speed table (source for the two existing placeholder groups)
- `REPORT_quality_experiments.md`, `QUALITATIVE_all_round.md` — prose-quality deep dive

All paths above are relative to `/Users/MAC/Desktop/packages/benchmarks/competitive/`.

## Known limitations — disclose, don't hide

`/Users/MAC/Desktop/packages/py_chunks/TECH_DEBT.md` lists 9 disclosed defects, including
one **HIGH SEVERITY** bug found during this benchmark: py_chunks currently drops literal
`&` characters from DOCX/PPTX text ("R&D" → "R D"). The library owner said a release
fixing several of these is expected within ~2 days of 2026-07-28. **Before publishing:**
check whether that release has landed and whether `py_chunks` version in this repo's
`pyproject.toml`/`package.json` matches the version the benchmark ran against (**0.5.0**,
see the Environment table in `FINAL_REPORT.md`). If the fix hasn't landed yet, either
wait, or publish with an honest footnote — do not silently claim a fixed defect is fixed.

## Critical framing correction — read before writing page copy

py_chunks is **not** a text splitter competing with LangChain/Chonkie/semchunk. It's a
document-understanding engine (36 file formats → typed, section-aware chunks). The
report benchmarks it against **two different peer groups** on the axes each actually
competes on:

1. **Real peers** (typed-element, multi-format tools): **Docling, Unstructured** — coverage, structure integrity, content-type accuracy, metadata, reading order.
2. **Text-splitters** (LangChain, semchunk, Chonkie, semantic-text-splitter) — included only for the prose-quality axis, since they read 0/36 file formats directly (always fed markitdown's extracted text).

**Do not** simplify the page's story to "py_chunks vs LangChain" — that undersells it
(LangChain isn't really a competitor; it can't read a file at all) and is also not what
was measured most rigorously. The strongest, most defensible story is coverage +
structure integrity + speed vs Docling/Unstructured, with the text-splitter comparison
as a secondary "and yes, it doesn't fragment sentences either" point.

## Headline numbers (verified 2026-07-28; re-check exact figures against `FINAL_REPORT.md` before publishing, this is a summary for quick reference only)

| Claim | Number |
|---|---|
| Format coverage | py_chunks 35/36, markitdown 26/36, unstructured 21/36, docling 18/36, any text-splitter 0/36 |
| Structure integrity (oversized units) | py_chunks: 100% of oversized lists/code kept whole, 20–50% of oversized tables; **every competitor tested (incl. Docling/Unstructured): 0%** |
| Content-type precision (table/code) | py_chunks 1.0/1.0 vs docling 0.85/0.48, unstructured 1.0/1.0 |
| Speed, pooled (446 files) | py_chunks 0.51ms/file (1980 files/sec) — **55x faster** than docling & markitdown+langchain, **221x faster** than unstructured |
| Speed, PowerPoint specifically | py_chunks 1.17ms/file vs unstructured 1861ms/file — **~1,590x** |
| Speed, PDF specifically | py_chunks 61.4ms/file vs docling 11,351ms/file — **~185x** |
| Prose sentence-integrity | 0 genuine sentence splits in any py_chunks mode; ties competitors render-agnostically |

## Environment disclosure (must appear on the page near any number, per this repo's own credibility bar)

Apple M1 Max, 10 cores (8P+2E), 32GB unified memory, macOS 26.5.1, Python 3.13.7,
rustc 1.95.0, py_chunks 0.5.0, docling 2.115.0, unstructured 0.24.1, markitdown 0.1.5,
langchain-text-splitters 1.1.2, chonkie 1.7.0, semchunk 3.2.5, semantic-text-splitter
0.32.0. Full table in `FINAL_REPORT.md`'s Environment section. Note explicitly that
these are Apple Silicon numbers, not cross-machine comparable (the report itself
recommends a follow-up neutral cloud x86 run — flag that as a future addition if asked).

## Suggested page structure (recommendation, not a mandate — use judgment on design)

The two existing placeholder groups (`latency`, `throughput`) map cleanly to the speed
section. Consider adding groups/sections for:
- **Format coverage** (bar chart: 35 vs 26 vs 21 vs 18 vs 0, out of 36)
- **Structure integrity** (the 0% vs 100% story is the most visually dramatic and honest
  differentiator — nothing else in the report is this stark)
- **Speed by format category** (PDF/PowerPoint/Word/Ebook/Spreadsheet breakdown, not just
  pooled — the per-category multiples are more impressive and more credible than one
  pooled number)
- A short "what we didn't test" / limitations note linking the disclosed known issues —
  matches this repo's existing honesty bar (see the placeholder disclaimer pattern
  already in `data/benchmarks.ts`).

## Addendum (2026-07-28, after first pass) — more semchunk/Chonkie/LangChain/s-t-s
   comparisons available, not yet on the page

The first pass correctly grouped semchunk/Chonkie/semantic-text-splitter as one row in
the structure-integrity table and used `markitdown+langchain` as the sole speed
baseline. That's honest but leaves real, already-measured per-tool data on the table.
More individually-attributed comparisons = more credibility — add these if you want a
richer `/benchmarks` page. All numbers below are already measured; just surface them.

### A1. Structure integrity, per-tool (not grouped)

Source: `results/structure_stress_20260728T100148Z/STRESS_SUMMARY.md`. Instead of one
"semchunk · Chonkie · s-t-s" row, these can be individual rows — every one independently
verified at 0%:

| tool | table kept-whole | list | code | table splits: clean / dirty |
|---|---:|---:|---:|---|
| py_chunks (default) | 20% | 100% | 100% | 8 clean / 0 dirty |
| py_chunks (section) | 50% | 100% | 100% | 0 clean / 2 dirty |
| LangChain (recursive) | 0% | 0% | 0% | 8 clean / 2 dirty |
| LangChain (markdown) | 0% | 0% | 0% | 8 clean / 2 dirty |
| semchunk | 0% | 0% | 0% | 8 clean / 2 dirty |
| semantic-text-splitter | 0% | 0% | 0% | 8 clean / 2 dirty |
| Chonkie | 0% | 0% | 0% | 8 clean / 2 dirty |

### A2. Corpus-level retrieval quality (BM25, 31 docs, ~512-token target)

Source: `results/part_a_sentence_quality.json`.

| chunker | span integrity | recall@1 | recall@3 | recall@5 | MRR |
|---|---:|---:|---:|---:|---:|
| LangChain | 0.994 | 0.874 | 0.971 | 0.989 | 0.927 |
| semchunk | 0.977 | 0.874 | 0.966 | 0.977 | 0.922 |
| Chonkie | 0.949 | 0.863 | 0.949 | 0.949 | 0.906 |
| py_chunks (sentence) | 0.869 | 0.714 | 0.806 | 0.811 | 0.763 |
| py_chunks (sliding) | 0.926 | 0.754 | 0.817 | 0.846 | 0.795 |
| py_chunks (section) | 0.874 | 0.789 | 0.857 | 0.863 | 0.824 |

**Caveat — pair with A4, don't show alone:** this is the *verbatim* metric, which
under-credits py_chunks because it re-renders text (strips markdown markers). A4 is the
corrected version.

### A3. Structure preservation at normal (512-token) budget — units small enough to fit

Source: `results/part_b_structure_preservation.json`. 23 tables / 37 code blocks / 16
lists, containment when the unit fits inside the chunk budget (a different, easier test
than A1's oversized-unit stress case):

| chunker | table (of 21 GT*) | code (of 37) | list (of 16) |
|---|---:|---:|---:|
| LangChain | 21/21 | 36/37 | 16/16 |
| LangChain (markdown) | 21/21 | 37/37 | 16/16 |
| semchunk | 21/21 | 36/37 | 16/16 |
| semantic-text-splitter | 21/21 | 37/37 | 16/16 |
| **Chonkie** | **14/21** | **32/37** | 15/16 |
| py_chunks (structural) | 21/21 | 37/37 | 8/16 |

*(table denominator is 21 not 23 in the raw data for the tools above — see source JSON
for the exact per-tool basis before publishing this one.)* **Chonkie is the clear
laggard here** — a legitimate, specific weak point worth naming, not just "ties."

### A4. Render-agnostic quality — the fairest comparison (corrects A2's measurement artifact)

Source: `results/render_agnostic_quality.json`. Strips the penalty for py_chunks
re-rendering text (markdown markers stripped, lines reflowed) — apples-to-apples:

| tool | verbatim integrity | render-agnostic integrity | recall@1 |
|---|---:|---:|---:|
| LangChain | 0.994 | 0.994 | 0.874 |
| semchunk | 0.977 | 0.977 | 0.886 |
| semantic-text-splitter | 0.977 | 0.977 | 0.886 |
| Chonkie | 0.949 | 0.949 | 0.857 |
| **py_chunks (sliding_window)** | 0.926 | **0.983** | 0.754 |
| py_chunks (section) | 0.874 | 0.874 | 0.771 |

**This is the strongest "we tie the text-splitters at their own game" number** —
py_chunks' `sliding_window` mode beats LangChain's raw verbatim number and ties/beats
everyone else once re-rendering isn't unfairly penalized. Good hero-stat candidate for
a "prose quality" section.

### A5. Full diagnostic — PDF vs clean-source split, sentence-fragmentation check

Source: `results/all_strategies_diagnostic.json`. Same shape as A2, split by whether the
source was noisy PDF-extracted text vs clean docx/md, plus a `miss_split` column (**0 or
near-0 for every tool including py_chunks** — i.e. nobody here actually cuts a sentence
in half; low scores elsewhere are the text simply not appearing verbatim, not
fragmentation). Useful for an honest "no one here fragments sentences, including us"
point if you want to preempt that objection.

### Gap — not fabricated, just not yet measured

**Chonkie and semchunk were never individually timed** in the 446-file end-to-end speed
benchmark (`results/speed_20260728T112451Z/`) — only `markitdown+langchain` ran as the
representative text-splitter pipeline there. If the page wants a "vs Chonkie/semchunk
speed" number specifically, that requires a new (small, fast) experiment — do not
extrapolate or estimate one from the numbers above.

## Constraints

- Do not fabricate, round favorably, or cherry-pick a number that isn't traceable to
  `FINAL_REPORT.md` or its linked raw JSON.
- Do not remove the "illustrative" disclaimer pattern until you've actually replaced
  the specific number it's attached to with a sourced one — partial rollout is fine,
  just don't let a stale placeholder lose its disclaimer.
- Update `NEEDS-REVIEW.md`'s "Benchmarks" checkbox to point here once this is picked up.
- If a number you need isn't in `FINAL_REPORT.md` or the raw JSON linked from it, that
  means it wasn't measured — don't estimate it, flag it in `NEEDS-REVIEW.md` instead.
