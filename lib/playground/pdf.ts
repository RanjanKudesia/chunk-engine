/**
 * PDF side of the playground engine: parsed host-side by
 * @llamaindex/liteparse-wasm, then chunked by the engine's PDF-markdown
 * chunker — mirrors js-chunks / rs-chunks exactly. Split out of engine.ts to
 * keep both files small.
 */

import type { PlaygroundImage } from "./engine";

interface LiteParseModule {
  default: (init?: unknown) => Promise<unknown>;
  LiteParse: new (opts: Record<string, unknown>) => {
    parse: (data: Uint8Array) => Promise<{
      pages: { markdown: string }[];
      images: { id: string | number; bytes: Uint8Array | number[] }[];
    }>;
  };
}

let _lp: LiteParseModule | null = null;
let _lpPromise: Promise<LiteParseModule> | null = null;

async function loadLiteParse(): Promise<LiteParseModule> {
  if (_lp) return _lp;
  if (!_lpPromise) {
    _lpPromise = (async () => {
      const mod = (await import(
        "@llamaindex/liteparse-wasm"
      )) as unknown as LiteParseModule;
      if (typeof mod.default === "function") await mod.default();
      _lp = mod;
      return mod;
    })();
  }
  return _lpPromise;
}

export interface PdfConversion {
  markdown: string;
  totalPages: number;
  images: PlaygroundImage[];
}

// Cache the last conversion so changing mode/params doesn't re-parse the PDF
// (parsing is the expensive step; the same file bytes are reused across runs).
let _pdfCache: { data: Uint8Array; embed: boolean; conv: PdfConversion } | null =
  null;

export async function pdfToMarkdown(
  data: Uint8Array,
  embedImages: boolean
): Promise<PdfConversion> {
  if (_pdfCache && _pdfCache.data === data && _pdfCache.embed === embedImages) {
    return _pdfCache.conv;
  }
  const lp = await loadLiteParse();
  const parser = new lp.LiteParse({
    ocrEnabled: false,
    outputFormat: "markdown",
    imageMode: embedImages ? "embed" : "placeholder",
    quiet: true,
  });
  const result = await parser.parse(data);
  const totalPages = result.pages.length;
  const markdown = result.pages
    .map((p) => p.markdown.trimEnd())
    .filter((m) => m !== "")
    .join("\n\n---\n\n");
  const images = embedImages
    ? result.images.map((img) => ({
        name: `image_${img.id}.png`,
        data: img.bytes instanceof Uint8Array ? img.bytes : new Uint8Array(img.bytes),
      }))
    : [];
  const conv = { markdown, totalPages, images };
  _pdfCache = { data, embed: embedImages, conv };
  return conv;
}
