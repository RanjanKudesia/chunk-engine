/* tslint:disable */
/* eslint-disable */

/**
 * Install a panic hook that surfaces Rust panics as console errors (dev aid).
 */
export function __start(): void;

/**
 * Chunk PDF markdown a host-side parser already produced (`.pdf` bytes are
 * parsed by the engine itself — this is for callers with their own markdown).
 * `total_pages` populates `document_metadata.total_pages`.
 */
export function chunkPdfMarkdown(markdown: string, total_pages: number, mode: string, window_size: number, overlap: number, sentences_per_chunk: number, paragraphs_per_page: number): any;

/**
 * Like [`chunk_pdf_markdown`] but with host-supplied PDF images (image chunks
 * first). `images` is a JS `{ name, data: Uint8Array }[]`. Returns
 * `{ chunks, images }` like [`get_chunks_with_images`].
 */
export function chunkPdfMarkdownWithImages(markdown: string, images: any, total_pages: number, mode: string, window_size: number, overlap: number, sentences_per_chunk: number, paragraphs_per_page: number): any;

/**
 * Chunk a document from raw bytes. `filename` is used only for extension routing.
 * Returns an array of `{ content, content_type, metadata }`.
 */
export function getChunks(data: Uint8Array, filename: string, mode: string, window_size: number, overlap: number, sentences_per_chunk: number, paragraphs_per_page: number): any;

/**
 * Chunk a document and also return its embedded images (py-chunks `list_images=True`).
 * Returns `{ chunks: Chunk[], images: { name, data: Uint8Array }[] }`.
 */
export function getChunksWithImages(data: Uint8Array, filename: string, mode: string, window_size: number, overlap: number, sentences_per_chunk: number, paragraphs_per_page: number): any;

/**
 * Convert a document from raw bytes to Markdown.
 */
export function getMarkdown(data: Uint8Array, filename: string): string;

/**
 * Convert a document to Markdown and also return its embedded images.
 * Returns `{ markdown: string, images: { name, data: Uint8Array }[] }`.
 */
export function getMarkdownWithImages(data: Uint8Array, filename: string): any;

/**
 * Apply the engine's PDF-markdown normalisation to host-parsed markdown.
 *
 * `chunkPdfMarkdown` already does this internally, so chunks agree across SDKs
 * without any help. `getMarkdown` returns the host parser's string directly,
 * which would otherwise skip it — this is what keeps the two in step.
 */
export function normalizePdfMarkdown(markdown: string): string;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __start: () => void;
    readonly chunkPdfMarkdown: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => [number, number, number];
    readonly chunkPdfMarkdownWithImages: (a: number, b: number, c: any, d: number, e: number, f: number, g: number, h: number, i: number, j: number) => [number, number, number];
    readonly getChunks: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number) => [number, number, number];
    readonly getChunksWithImages: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number) => [number, number, number];
    readonly getMarkdown: (a: number, b: number, c: number, d: number) => [number, number, number, number];
    readonly getMarkdownWithImages: (a: number, b: number, c: number, d: number) => [number, number, number];
    readonly normalizePdfMarkdown: (a: number, b: number) => [number, number];
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
