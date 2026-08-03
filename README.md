<div align="center">

# chunk-engine

**One chunking engine. Python, JavaScript, Rust.**

A fast, high-fidelity document chunking engine for RAG — **36 file formats**, one
Rust core, with **byte-identical** output across three SDKs.

[**Website**](https://www.chunkengine.dev) ·
[**Docs**](https://www.chunkengine.dev/docs) ·
[**Playground**](https://www.chunkengine.dev/playground) ·
[**Benchmarks**](https://www.chunkengine.dev/benchmarks)

[![PyPI](https://img.shields.io/pypi/v/py-chunks?style=flat-square&label=py-chunks&color=e8511e)](https://pypi.org/project/py-chunks/)
[![npm](https://img.shields.io/npm/v/js-chunks?style=flat-square&label=js-chunks&color=e8511e)](https://www.npmjs.com/package/js-chunks)
[![crates.io](https://img.shields.io/crates/v/rs-chunks?style=flat-square&label=rs-chunks&color=e8511e)](https://crates.io/crates/rs-chunks)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

</div>

---

## What it is

Most chunkers are **text splitters** — you have to parse the document yourself
first. chunk-engine is a **document-understanding engine**: hand it a file and get
back typed, structure-aware chunks with rich metadata, in one call.

- **36 formats, one API** — Word, PowerPoint, Excel, PDF, HTML, Markdown, email,
  eBooks, notebooks, OpenDocument, JSON/CSV, and more.
- **Rust core** — parsing and chunking are compiled, not a stack of interpreted
  dependencies.
- **Structure-aware** — headings, tables, lists, and code blocks stay intact.
  Seven document modes plus dedicated spreadsheet modes.
- **Typed output** — every chunk carries a `content_type` and format-specific
  `metadata`, ready to embed or cite.
- **Streaming built in** — process large files with bounded memory.
- **Byte-identical across languages** — the same document produces the same
  chunks in Python, JavaScript, and Rust.

## The three SDKs

| Package | Install | Runtime | Repo |
|---|---|---|---|
| **py-chunks** · [PyPI](https://pypi.org/project/py-chunks/) | `pip install py-chunks` | Python 3.9+, via PyO3 | [RanjanKudesia/py-chunks](https://github.com/RanjanKudesia/py-chunks) |
| **js-chunks** · [npm](https://www.npmjs.com/package/js-chunks) | `npm install js-chunks` | Node · Bun · Deno · browsers, via WASM | [RanjanKudesia/js-chunks](https://github.com/RanjanKudesia/js-chunks) |
| **rs-chunks** · [crates.io](https://crates.io/crates/rs-chunks) | `cargo add rs-chunks` | Rust — the reference engine | [RanjanKudesia/rs-chunks](https://github.com/RanjanKudesia/rs-chunks) |

> `rs-chunks` is the source of truth; `py-chunks` and `js-chunks` wrap the same
> engine. Parity is verified over every fixture × every mode.

## Quick start

```python
# Python
from py_chunks import get_chunks

for chunk in get_chunks("report.pdf", mode="semantic"):
    print(chunk["content_type"], chunk["content"][:60])
```

```ts
// JavaScript / TypeScript
import { getChunks } from "js-chunks";

const chunks = await getChunks("./report.pdf", { mode: "semantic" });
for (const c of chunks) console.log(c.contentType, c.content.slice(0, 60));
```

```rust
// Rust
use chunks_rs::get_chunks;

let chunks = get_chunks("report.pdf", "semantic", 3, 1, 3, 15)?;
for c in &chunks { println!("{} {}", c.content_type, &c.content[..60]); }
```

Every chunk is `{ content, content_type, metadata }`. See the
[docs](https://www.chunkengine.dev/docs) for all modes, formats, and metadata
fields — or try it in the [playground](https://www.chunkengine.dev/playground),
which runs entirely in your browser (your file never leaves the page).

## Measured, not claimed

Benchmarked against **Docling** and **Unstructured** over 446 real files across
all 36 formats — the full methodology, the disclosed environment, and the axes
chunk-engine *loses* are published at
[chunkengine.dev/benchmarks](https://www.chunkengine.dev/benchmarks).

## This repository

This repo is the **hub** — it hosts the website and documentation at
[chunkengine.dev](https://www.chunkengine.dev) and links out to the three SDK
repos above. **Stars here are much appreciated** ⭐ — they help the project reach
people building RAG pipelines.

Built with Next.js (App Router) + TypeScript, Tailwind CSS v4, Fumadocs for
`/docs`, Shiki for highlighting, and Motion for animation.

### Develop

```bash
npm install      # also generates the Fumadocs .source via postinstall
npm run dev      # http://localhost:3000
npm run build    # production build
```

> The first production build after a clean checkout is slow — Shiki bundles its
> oniguruma WASM engine and Fumadocs compiles the MDX pipeline. Later builds hit
> the Turbopack cache.

### Layout

```
app/(marketing)/   landing · /benchmarks · /playground
app/docs/          Fumadocs-owned docs routes
content/docs/      documentation MDX (the docs site's source)
components/        UI primitives, landing sections, playground
data/              site config + format/benchmark/sample data
lib/               helpers, Shiki highlighter, playground engine
```

## Contributing

Issues and PRs are welcome. Documentation lives in `content/docs/` and is derived
from the engine's actual behavior — please don't document anything that hasn't
been verified against the library.

## License

MIT
