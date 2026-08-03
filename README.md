# chunk-engine website

Marketing landing page + documentation site for **chunk-engine** — the
Rust-backed document chunking engine shipped as three byte-identical SDKs:
**py-chunks** (Python), **js-chunks** (JavaScript/WASM), and **rs-chunks** (Rust).

Built with Next.js (App Router) + TypeScript, Tailwind CSS v4, shadcn-style
primitives, Fumadocs for `/docs`, Shiki for code highlighting, and Motion for
animation.

## Develop

```bash
npm install      # also generates Fumadocs .source via postinstall
npm run dev      # http://localhost:3000
```

## Build

```bash
npm run build    # production build (Turbopack)
npm start        # serve the production build
```

> The first production build after a clean checkout is slow because Shiki bundles
> its oniguruma WASM engine and Fumadocs compiles the MDX pipeline. Subsequent
> builds are fast thanks to the Turbopack filesystem cache.

## Project layout

```
app/
  (marketing)/        # custom landing + /benchmarks (SiteHeader/Footer chrome)
  docs/               # Fumadocs-owned docs routes ([[...slug]])
  api/search/         # Fumadocs search endpoint
  layout.tsx          # root: fonts + Fumadocs RootProvider (theme + search)
components/            # UI primitives, landing sections, docs helpers
content/docs/         # documentation MDX (source of the docs site)
data/                 # site config + landing/benchmark/format data
lib/                  # cn(), Shiki highlighter, Fumadocs source loader
```

## Source of truth

All documentation and code samples are derived from the py-chunks **library
source** at `../py_chunks` (v0.4.7). Do not invent API details — read from the
library. Anything ambiguous or unverifiable is tracked in
[`NEEDS-REVIEW.md`](./NEEDS-REVIEW.md).

## Deploy (Vercel)

The app is a standard Next.js project and deploys to Vercel with zero config —
import the repo and Vercel auto-detects the framework, build command
(`next build`), and output. Docs pages and the landing are statically generated;
the docs search route (`/api/search`) runs on demand.

Before launch, resolve the open items in [`NEEDS-REVIEW.md`](./NEEDS-REVIEW.md)
(real GitHub URL, real benchmark numbers, published-wheel format confirmation).
