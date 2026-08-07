/**
 * Browser-side chunking engine for the playground.
 *
 * Drives js-chunks' WASM web build (vendored under lib/js-chunks-web/ from the
 * pkg-web output of the js-chunks build the site is pinned to — see
 * PLAYGROUND.md for why it's vendored and how to refresh it) DIRECTLY, rather
 * than the npm `dist/index.js` wrapper — that wrapper has Node-only
 * `node:module`/`node:fs` branches which break browser bundling. Everything
 * here runs 100% client-side; uploaded bytes never leave the browser.
 */

import { pdfToMarkdown } from "./pdf";

export interface PlaygroundChunk {
  content: string;
  contentType: string;
  metadata: Record<string, unknown>;
}

export interface PlaygroundImage {
  name: string;
  data: Uint8Array;
}

export interface ChunkOpts {
  mode: string;
  windowSize: number;
  overlap: number;
  sentencesPerChunk: number;
  paragraphsPerPage: number;
}

// wasm-bindgen web module (default export is the async init()).
interface WasmModule {
  default: (init?: unknown) => Promise<unknown>;
  getChunks: (...a: unknown[]) => unknown;
  getChunksWithImages: (...a: unknown[]) => { chunks?: unknown[]; images?: unknown[] };
  getMarkdown: (...a: unknown[]) => string;
  getMarkdownWithImages: (...a: unknown[]) => { markdown: string; images?: unknown[] };
  chunkPdfMarkdown: (...a: unknown[]) => unknown;
  chunkPdfMarkdownWithImages: (...a: unknown[]) => { chunks?: unknown[]; images?: unknown[] };
}

let _mod: WasmModule | null = null;
let _initPromise: Promise<WasmModule> | null = null;

async function load(): Promise<WasmModule> {
  if (_mod) return _mod;
  if (!_initPromise) {
    _initPromise = (async () => {
      // Vendored wasm-bindgen web glue (JS with a sibling .d.ts).
      const mod = (await import(
        "@/lib/js-chunks-web/chunks_wasm.js"
      )) as unknown as WasmModule;
      if (typeof mod.default === "function") {
        await mod.default(); // instantiate the .wasm (fetched via import.meta.url)
      }
      _mod = mod;
      return mod;
    })();
  }
  return _initPromise;
}

/** Kick off WASM instantiation early (e.g. on route mount) so the first run is instant. */
export function preload(): void {
  void load();
}

interface RawChunk {
  content: string;
  content_type: string;
  metadata?: Record<string, unknown>;
}

function mapChunk(raw: RawChunk): PlaygroundChunk {
  return {
    content: raw.content,
    contentType: raw.content_type,
    metadata: raw.metadata ?? {},
  };
}

function mapImage(raw: { name: string; data: Uint8Array }): PlaygroundImage {
  return { name: raw.name, data: raw.data };
}

function extOf(filename: string): string {
  const dot = filename.lastIndexOf(".");
  return dot >= 0 ? filename.slice(dot + 1).toLowerCase() : "";
}

export async function chunk(
  data: Uint8Array,
  filename: string,
  o: ChunkOpts
): Promise<PlaygroundChunk[]> {
  const wasm = await load();
  if (extOf(filename) === "pdf") {
    const conv = await pdfToMarkdown(data, false);
    const raw = wasm.chunkPdfMarkdown(
      conv.markdown,
      conv.totalPages,
      o.mode,
      o.windowSize,
      o.overlap,
      o.sentencesPerChunk,
      o.paragraphsPerPage
    ) as RawChunk[] | null;
    return (raw ?? []).map(mapChunk);
  }
  const raw = wasm.getChunks(
    data,
    filename,
    o.mode,
    o.windowSize,
    o.overlap,
    o.sentencesPerChunk,
    o.paragraphsPerPage
  ) as RawChunk[] | null;
  return (raw ?? []).map(mapChunk);
}

export async function chunkWithImages(
  data: Uint8Array,
  filename: string,
  o: ChunkOpts
): Promise<{ chunks: PlaygroundChunk[]; images: PlaygroundImage[] }> {
  const wasm = await load();
  if (extOf(filename) === "pdf") {
    const conv = await pdfToMarkdown(data, true);
    const raw = wasm.chunkPdfMarkdownWithImages(
      conv.markdown,
      conv.images.map((i) => ({ name: i.name, data: i.data })),
      conv.totalPages,
      o.mode,
      o.windowSize,
      o.overlap,
      o.sentencesPerChunk,
      o.paragraphsPerPage
    );
    return {
      chunks: ((raw.chunks ?? []) as RawChunk[]).map(mapChunk),
      images: ((raw.images ?? []) as { name: string; data: Uint8Array }[]).map(mapImage),
    };
  }
  const raw = wasm.getChunksWithImages(
    data,
    filename,
    o.mode,
    o.windowSize,
    o.overlap,
    o.sentencesPerChunk,
    o.paragraphsPerPage
  );
  return {
    chunks: ((raw.chunks ?? []) as RawChunk[]).map(mapChunk),
    images: ((raw.images ?? []) as { name: string; data: Uint8Array }[]).map(mapImage),
  };
}

export async function markdown(data: Uint8Array, filename: string): Promise<string> {
  if (extOf(filename) === "pdf") {
    return (await pdfToMarkdown(data, false)).markdown;
  }
  const wasm = await load();
  return wasm.getMarkdown(data, filename);
}

export async function markdownWithImages(
  data: Uint8Array,
  filename: string
): Promise<{ markdown: string; images: PlaygroundImage[] }> {
  if (extOf(filename) === "pdf") {
    const conv = await pdfToMarkdown(data, true);
    return { markdown: conv.markdown, images: conv.images };
  }
  const wasm = await load();
  const raw = wasm.getMarkdownWithImages(data, filename);
  return {
    markdown: raw.markdown,
    images: ((raw.images ?? []) as { name: string; data: Uint8Array }[]).map(mapImage),
  };
}
