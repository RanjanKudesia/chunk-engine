# Playground — how to add a new extension

The `/playground` page chunks documents **100% in the browser** via js-chunks'
WASM engine (no upload, no backend). This doc is the checklist + quality bar for
adding a new file extension. Read it fully before wiring one up.

> TL;DR: add the extension to `data/playground.ts`, drop a real sample in
> `public/playground/`, make sure the engine can chunk it in the browser, give
> it a faithful "rendered" left-pane view, verify with `npm run build`, and hold
> the quality bar below.

## Architecture (what's already there)

| Piece | File | Role |
|---|---|---|
| Vendored WASM engine | `lib/js-chunks-web/` | js-chunks `pkg-web` build (wasm-bindgen), vendored so we can drive it directly. **Pinned to a js-chunks version — keep in sync.** |
| Engine wrapper | `lib/playground/engine.ts` | Lazy-loads the WASM, exposes `chunk` / `chunkWithImages` / `markdown` / `markdownWithImages`. **The only place that calls the WASM.** |
| Markdown render | `lib/playground/markdown.ts` | `getMarkdown` output → sanitized HTML (marked + DOMPurify). |
| Chunk↔doc highlight | `lib/playground/highlight.ts` | Maps a chunk to the markdown block-range it covers (fuzzy text match). |
| Config + data | `data/playground.ts` | Extension list, methods, modes, params, content-type colors. |
| UI | `components/playground/*` + `app/(marketing)/playground/page.tsx` | Config panel, split view, chunk cards. |

Why we vendor `pkg-web` instead of the npm `js-chunks` package: the npm
`dist/index.js` wrapper has Node-only `node:module`/`node:fs` branches that break
browser bundling, and its `exports` map blocks the `pkg-web` subpath. Driving the
vendored web build directly avoids both.

## Steps to add an extension

1. **Pick a sample.** A real, structure-rich file (headings, paragraphs, a
   table, ideally an image) that's **small enough to parse fast** in the browser.
   Copy it to `public/playground/<name>.<ext>`.

2. **Register it** in `data/playground.ts` → `playgroundExts`:
   ```ts
   { ext: "pptx", label: "PPTX", enabled: true,
     sample: "/playground/<name>.pptx", sampleName: "<name>.pptx" }
   ```
   Set `enabled: true` only when it actually works end-to-end.

3. **Engine support.** Most formats already work through `engine.chunk` /
   `engine.markdown` with no changes — the WASM handles docx/pptx/xlsx/html/md/
   csv/… natively by extension. **PDF is the exception**: it needs the optional
   `@llamaindex/liteparse-wasm` peer dep to convert PDF→markdown host-side, then
   `chunkPdfMarkdown`. If a new format needs a host-side pre-parse like that, add
   the branch inside `engine.ts` (keep all WASM/peer-dep calls there).

4. **Sanity-check in Node first** (before touching the UI) — confirms the engine
   + sample produce sensible chunks and surfaces the real `content_type` values:
   ```bash
   cd ../js-chunks && node --input-type=module -e '
   import { getChunks } from "./dist/index.js"; import fs from "node:fs";
   const b = new Uint8Array(fs.readFileSync("<abs path to sample>"));
   console.log((await getChunks(b, { filename: "<name>.<ext>" })).length);'
   ```

5. **Rendered (left) view.** The left pane must show the **real document**, not
   just its markdown. It is format-aware:
   - `docx` → `docx-preview` (into `docxRef`, with the zoom control).
   - `pdf` → an `<iframe>`/`<embed>` of the file blob (browser-native viewer).
   - `html` → render the sanitized HTML; `md`/`txt` → render markdown.
   - Spreadsheets/other → if there's no faithful lightweight in-browser viewer,
     fall back to the markdown view and say so.
   Pick the pattern that best matches the family; lazy-load the renderer.

6. **Modes.** Set the correct mode list for the family:
   - Document formats (docx/pdf/pptx/md/html/txt/…) → `docModes` (7 modes).
   - Spreadsheets (xlsx/ods/…) → `row`/`table`/`sheet`/`sliding_window`/
     `page_aware`/`semantic`.
   - Delimited (csv/tsv) → `row`/`sliding_window`/`page_aware`.

7. **Upload + validation.** The uploader's `accept` and the filename check must
   match the selected extension.

8. **Content-type colors.** If the format emits a `content_type` not already in
   `contentTypeColor` (`data/playground.ts`), add a distinct hue for it.

9. **Build.** `npm run build` must pass (compile + typecheck + static gen). Batch
   several edits per build — don't rebuild after every micro-change.

## Parameters (all exposed in the config panel)

| Param | Default | Used by mode |
|---|---|---|
| `mode` | `default` | — |
| `window_size` | 3 | `sliding_window` |
| `overlap` | 1 | `sliding_window` (must be `< window_size`) |
| `sentences_per_chunk` | 3 | `sentence` |
| `paragraphs_per_page` | 15 | `page_aware` |
| `listImages` (toggle) | off | any (adds extracted images) |

Methods: `getChunks` (batch), `streamChunks` (progressive reveal), `getMarkdown`.
`paramUsage` in `data/playground.ts` drives which params are highlighted as
"active" per mode.

## Minimum quality standards (all must hold)

- **Client-side only** — the file never leaves the browser. No network calls with
  file contents.
- **Real document on the left** — a faithful rendered view, with a `markdown`
  toggle. Not markdown-only.
- **Fast** — the sample chunks in well under a second after WASM warm-up; the
  elapsed time is shown. Heavy parsers (PDF/liteparse) should still feel snappy
  on the chosen sample; if not, pick a smaller sample.
- **Highlight linking works** — hovering/clicking a chunk highlights and scrolls
  to the matching part of the markdown.
- **No layout overflow** — scroll bodies use `min-h-0` inside `overflow-hidden`
  fixed-height panes; content must never bleed over the page/footer.
- **Graceful errors** — unsupported/corrupt files show a friendly message and
  never crash the page.
- **Build green** — `npm run build` passes with no type errors.
- **Honest limitations** — e.g. the highlight text-match is approximate for
  tables and overlapping `sliding_window` chunks; don't imply pixel-perfect
  mapping.

## Best practices

- **Pin WASM versions to the engine.** The vendored `lib/js-chunks-web/` build
  and any peer WASM (e.g. `@llamaindex/liteparse-wasm`) must match the versions
  rs-chunks/js-chunks use, so output stays byte-identical. Record provenance in a
  comment. When js-chunks updates, refresh the vendored files.
- **Lazy-load heavy deps** (`docx-preview`, `liteparse-wasm`, the engine WASM) via
  dynamic `import()` so the rest of the site stays light.
- **Keep WASM calls in `engine.ts`.** UI components never import the WASM glue
  directly.
- **Reuse the design system** — `contentTypeColor`, existing card/panel styles,
  `min-h-0` scroll pattern. Don't introduce a new visual language.
