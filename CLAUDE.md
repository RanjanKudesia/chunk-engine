# py-chunks Website — Claude Code Build Prompt

> Paste this into Claude Code as the initial brief, or keep it in the repo root as `CLAUDE.md`.
> Fill in the two `TODO:` placeholders (source folder path + repo URLs) before running.

---

## 0. Role & goal

You are building the official website for **py-chunks**, an open-source, Rust-backed Python document-chunking library for RAG / LLM pipelines. The site is a **marketing landing page + full documentation site** in one. **Design quality and documentation accuracy are the two primary goals** — everything else is secondary.

Build it incrementally, commit in logical milestones (see §9), and keep the dev server runnable at every step.

---

## 1. CRITICAL — the parallel source folder is the source of truth

The py-chunks **library source lives in a sibling folder** to this website repo.

- `TODO:` Expected path: `../py-chunks` (detect and confirm on first run; adjust if different).
- Treat that folder as the **single source of truth** for ALL documentation, API signatures, supported formats, chunking modes, and code examples.
- **Before writing any docs page**, read from it: `README.md`, `py_chunks/__init__.py`, everything under `py_chunks/chunkers/`, the Rust sources under `src/`, `tests/`, and `pyproject.toml`.
- **Do not invent, guess, or hallucinate** API names, parameters, return schemas, or examples. If something isn't in the source, don't document it — flag it in a `NEEDS-REVIEW.md` at the site repo root instead.
- The library is **actively evolving** (notably it now supports **30+ file extensions**, most not yet on the published PyPI wheel). Always derive the format/extension list **from the current source**, never from the PyPI page or memory.
- Re-read the source folder whenever you regenerate or update docs so the site tracks the library's latest progress.

---

## 2. Tech stack (use exactly this)

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** — for the marketing/landing UI (hero, buttons, tabs, cards, badges, etc.)
- **Fumadocs** — for the entire `/docs` section (MDX content, sidebar nav, Orama search, auto TOC). Keep the marketing pages custom and outside Fumadocs' layout; let Fumadocs own only `/docs/**`.
- **Shiki** for code highlighting (ships with Fumadocs; reuse its highlighter on the landing too).
- **motion** (framer-motion) for scroll/entrance animations, especially the benchmark bars.
- Package manager: **pnpm** (or bun if preferred). Node 18+.
- Deploy target: **Vercel** (configure accordingly; static where possible).

Keep dependencies lean — this library's whole pitch is "zero bloat," so the site should feel fast and light too.

---

## 3. Design system

The reference vibe is **Bun's performance-theater landing + Hono's clean, minimal docs**, but NOT a clone of either. The identity is our own, anchored on the Rust core.

### Palette
- **Accent (primary):** Rust/molten orange. Gradient `#e8511e → #ff7a3c`. Solid accent `#e8511e`.
- **Base (dark, default):** near-black charcoal `#0e0e10`; surfaces `#161618` / `#1c1c20`; borders `#26262b`.
- **Text:** off-white `#f5f5f4` primary, muted `#a1a1aa`.
- **Light mode:** warm off-white/cream background (`#faf8f5`), dark text — a subtle nod to Bun's warmth without adopting its whole identity.
- **Discipline:** ONE accent color only. Restraint is what makes it look premium (Hono lesson). No secondary brand colors; use neutral grays for everything else.

### Typography
- Headlines: a geometric/grotesk sans — **Geist** (or Inter/Satoshi).
- Body: same family, regular weight.
- **All code, numbers, benchmarks, file extensions:** monospace — **Geist Mono** or **JetBrains Mono**. Monospace on numbers makes the perf data feel precise.

### Dark-first
Dark mode is the default. Provide a clean light toggle. Respect `prefers-color-scheme`.

### Feel
Fast, confident, technical, uncluttered. Generous whitespace. Rounded-but-not-bubbly corners (`rounded-lg`). Subtle borders over heavy shadows. Motion is purposeful (bars filling, sections fading up on scroll), never decorative-for-its-own-sake.

---

## 4. Signature elements (build these as reusable, polished components)

These three are what make the site memorable — invest in them:

1. **Animated benchmark bars** (the "Bun move")
   - Horizontal bars comparing py-chunks vs LangChain `RecursiveCharacterTextSplitter` vs `unstructured`, e.g. ms/document and docs/sec.
   - Bars fill/animate on scroll into view (motion + IntersectionObserver).
   - **Use clearly-labeled placeholder numbers** pulled into a single `data/benchmarks.ts` file with a `// PLACEHOLDER — replace with real measured numbers` comment. Never present fake numbers as real; make them trivially swappable.

2. **Chunk visualizer** (our own signature — neither Bun nor Hono has an equivalent)
   - Left: a sample document. Right: colored chunk "blocks" keyed by `content_type` (`heading`, `plain_paragraph`, `table`, `bullet_list`, `code_block`, etc. — pull the real content-type list from source).
   - A legend maps color → content_type. Optionally let the user toggle chunking `mode` and watch the blocks regroup (can be pre-computed sample data, no backend needed).
   - This single component explains the whole product at a glance — make it a hero-adjacent centerpiece.

3. **Format grid with availability badges**
   - Grid of all supported extensions, **grouped by family** (Office, PDF, Web/Markup, Plain/Data, eBooks, Email, etc. — group by what the source actually supports).
   - Each format carries a status badge: `Stable`, `New`, or `Coming soon`.
   - **Honesty rule:** derive `Stable` vs upcoming from the source. If a format is in the codebase but not in the published wheel, mark it `Coming soon` / `New`. Do NOT imply unpublished formats work in the current `pip install`. "30+ formats, one API" is the headline, but the badges must stay truthful.

Also build: a **copyable install command** component (`pip install py-chunks` with copy button), and **framework-integration tabs** (FastAPI / Flask / Django / Celery) using shadcn Tabs, with real code from the source.

---

## 5. Site structure

### Marketing (custom, outside Fumadocs)
Single scrolling landing at `/`:
1. **Hero** — headline (e.g. *"Chunk any document. In milliseconds. Zero dependencies."*), subline (30+ formats, Rust core, framework-agnostic), copyable `pip install`, buttons: Docs / GitHub / PyPI.
2. **Benchmark bars** section.
3. **"The RAG problem"** strip — why chunking is the hidden lever in retrieval quality; position vs slow, dependency-heavy alternatives.
4. **Format grid** ("30+ formats, one API").
5. **Chunk visualizer** section.
6. **Chunking modes** overview (structural, section, semantic, sliding_window, sentence, page_aware — from source).
7. **Framework logos / integration tabs** (FastAPI, Flask, Django, Celery).
8. **Final CTA** — install + docs.

Other marketing pages:
- `/benchmarks` — the full **Stats page**: throughput per format, chunk-count reduction vs naive splitting, dependency-footprint comparison, coverage matrix (formats × modes), PyPI download badge. Same placeholder-data discipline; link a (future) benchmark methodology/repo.

### Documentation (Fumadocs, `/docs`)
Sidebar IA — generate content from the source folder:
- **Getting Started**: Introduction, Installation (incl. the Windows/PDFium note), Quick Start
- **Input Sources**: local path, bytes, file-like object, FastAPI upload, S3 presigned URL
- **Chunking Modes**: one page each — structural (default), section, semantic, sliding_window, sentence, page_aware — with parameters + the metadata fields each emits
- **Output Schema**: chunk structure + full content-types list
- **API Reference**: `get_chunks`, `stream_chunks`, format-specific entry points, advanced format chunkers (with `rust_ms`/`python_ms` timing)
- **Supported Formats**: full extension list + status badges
- **Framework Integration**: Flask, FastAPI, Django, Celery
- **Error Handling**
- **Architecture**: the Python API → dispatcher → Rust engine design (redraw the ASCII diagram as a proper graphic)
- **Changelog** (from git tags / PyPI releases)

---

## 6. Content & accuracy rules

- Every code sample and API signature must match the **current source**, verified by reading it — not the PyPI description, not memory.
- Extension list, chunking modes, content types, and metadata fields: **derived from source every time**.
- Mark anything present in code-but-not-yet-published as upcoming; keep the published-vs-upcoming distinction visible and honest.
- Where a benchmark/stat is not yet measured, use a labeled placeholder in a data file and surface a small "illustrative — pending real benchmarks" note. Never dress up guesses as measured results.
- Put anything ambiguous or missing from source into `NEEDS-REVIEW.md` rather than inventing it.

---

## 7. Quality bar

- Fully **responsive** (mobile → desktop), real mobile nav.
- **Accessible**: semantic HTML, keyboard nav, focus states, sufficient contrast in both themes, `aria` where needed, reduced-motion support (`prefers-reduced-motion` disables bar animations).
- **SEO/meta**: per-page titles, descriptions, Open Graph, favicon, sitemap, `robots.txt`.
- **Performance**: static generation where possible, optimized fonts (next/font), no layout shift, fast LCP. The site should feel as fast as the library claims to be.
- Clean, typed, componentized code. Reusable primitives (CodeBlock, InstallCommand, BenchmarkBars, ChunkVisualizer, FormatGrid, ModeCard).

---

## 8. Explicitly do NOT

- Do NOT copy Bun's or Hono's layouts/copy/mascot wholesale — take the *principles* (benchmark drama, one-accent minimalism, landing→docs flow), not the pixels.
- Do NOT hardcode the format list or API — read from source.
- Do NOT present placeholder benchmark numbers as real, measured data.
- Do NOT claim unpublished formats are available in the current wheel.
- Do NOT add heavy dependencies that contradict the library's "lean" story.

---

## 9. Suggested build order (milestones)

1. **Scaffold**: Next.js + TS + Tailwind + shadcn/ui init + Fumadocs init; theme tokens (palette, fonts, dark-first); base layout, nav, footer, theme toggle.
2. **Design primitives**: CodeBlock (Shiki), InstallCommand, Button/Badge/Card/Tabs wiring, section shell.
3. **Hero + landing skeleton** with real copy.
4. **Signature components**: BenchmarkBars → FormatGrid → ChunkVisualizer (read source for accurate data).
5. **Landing assembly**: all sections wired together, responsive pass.
6. **Docs**: Fumadocs content generated from source, full IA, search working.
7. **/benchmarks stats page.**
8. **Polish**: animations, accessibility, SEO/meta, performance, light-mode pass.
9. **Deploy config** for Vercel.

Confirm the source-folder path and the GitHub/PyPI URLs (`TODO:`) before starting, then proceed milestone by milestone.

---

## 10. Playground (`/playground`)

An in-browser chunking playground: upload a document (or use a preloaded sample),
pick a method/mode/parameters, and see the real document on the left with live
typed chunks + metadata on the right — all client-side via js-chunks' WASM.

**Before adding or changing a playground extension, read [`PLAYGROUND.md`](PLAYGROUND.md).**
It documents the architecture, the step-by-step for adding an extension, the full
parameter list, the minimum quality standards, and best practices (vendored-WASM
version pinning, lazy-loading, the `min-h-0` scroll pattern, client-side-only
rule, etc.). Extensions are enabled one family at a time — DOCX and PDF first.