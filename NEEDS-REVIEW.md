# NEEDS-REVIEW

Items that could not be derived from source and need a human decision. Placeholders
are clearly marked in code.

## Brand / URLs

- [x] **GitHub owner** — resolved to **`RanjanKudesia`** (from js-chunks
      `package.json` and rs-chunks `Cargo.toml`). Per-package repos:
      `RanjanKudesia/py-chunks`, `/js-chunks`, `/rs-chunks`. Wired in
      [`data/languages.ts`](data/languages.ts); nav GitHub link points at the
      author profile in [`data/site.ts`](data/site.ts).
- [x] **Registries** — `pypi.org/project/py-chunks`, `npmjs.com/package/js-chunks`,
      `crates.io/crates/rs-chunks` (all in `data/languages.ts`).
- [ ] **Domain** — using placeholder `https://chunk-engine.dev` for
      `metadataBase` / sitemap / robots. Set the real domain before launch.

## Packages / versions

- Three SDKs, one Rust engine: **py-chunks 0.5.0** (PyPI), **js-chunks 0.1.0**
  (npm), **rs-chunks 0.1.0** (crates.io). rs-chunks is the reference engine;
  js-chunks is its WASM build; py-chunks binds it via PyO3.

## Benchmarks — now REAL (done 2026-07-28)

- [x] The `/benchmarks` page and `data/benchmarks.ts` now use **real, measured**
      data from the full-corpus competitive run (446 files × 36 formats) —
      `benchmarks/competitive/FINAL_REPORT.md`. Coverage (35/36), structure
      integrity (0% vs 100%), pooled + per-category speed (0.51ms/file, 55–221×),
      and table/code precision are all sourced from that report. Measured via
      **py-chunks 0.5.0** on Apple M1 Max — the page discloses the environment.
- [x] Removed the fabricated placeholders (`throughputByFormat`, `chunkReduction`,
      `dependencyFootprint`) from `data/stats.ts` rather than inventing numbers
      the benchmark didn't measure. The formats × modes coverage matrix stays
      (real, source-derived).
- [ ] **HIGH-severity `&`-drop bug is disclosed on the page** (`py_chunks/TECH_DEBT.md`
      #9: DOCX/PPTX drop literal `&`). A fix was expected within ~2 days of
      2026-07-28 but has **not landed** (v0.5.0 still lists it). Re-check when the
      fix ships and update the limitations note.
- [ ] Numbers are **Apple Silicon only** (not cross-machine comparable); a neutral
      x86 cloud run is a recommended follow-up to add later.
- [x] Version drift resolved: docs `changelog` + all site references now say
      py-chunks **0.5.0** (matching `pyproject.toml`), with a 0.5.0 changelog
      entry (7 new formats, PDF liteparse rewrite, spreadsheet/HTML image
      extraction — from the `v0.5.0` commit).

## API / source notes

- [ ] **Format availability badges** (`data/formats.ts`) mark long-shipped
      formats `Stable` and newer ones `New`. Confirm exactly which are in each
      published package and adjust.
- [ ] **PDF dependency** — py-chunks `pyproject.toml` declares `pypdfium2`;
      js-chunks uses the optional `@llamaindex/liteparse-wasm` peer dep; rs-chunks
      uses the `liteparse` crate behind the default `pdf-native` feature. Docs
      reflect each; confirm before finalising.

## Source of truth

- Library sources: `../py_chunks` (Python, v0.5.0), `../rs-chunks` (Rust engine,
  the reference), `../js-chunks` (WASM binding). All API details in the site were
  read from these, not invented.
